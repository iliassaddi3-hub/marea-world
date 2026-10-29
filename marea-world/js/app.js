const DATA = window.MAREA_DATA || { site: {}, beforeMarea: [], marea: { tracks: [] }, credits: [] };
const SITE = DATA.site || {};
const SHOW_PH = !!SITE.showPlaceholders;
const BEFORE = DATA.beforeMarea || [];
const ALBUM = (DATA.marea && DATA.marea.tracks) || [];
const hasLyrics = t => !!(t && t.lyrics && t.lyrics.length);
const LEAD = BEFORE.find(t => t && t.lead) || BEFORE.find(hasLyrics) || null;
const toSec = v => typeof v === 'number' ? v : String(v).trim().split(':').reduce((acc, n) => acc * 60 + Number(n), 0);
function ytId(url) {
  if (!url) return null;
  try {
    const u = new URL(url);
    if (/(^|\.)youtu\.be$/.test(u.hostname)) return u.pathname.slice(1).split('/')[0] || null;
    if (u.searchParams.get('v')) return u.searchParams.get('v');
    const m = u.pathname.match(/\/(embed|shorts|live)\/([\w-]{6,})/);
    return m ? m[2] : null;
  } catch (e) { return /^[\w-]{11}$/.test(url) ? url : null; }
}

const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const root = document.documentElement;
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;
const mqReduce = matchMedia('(prefers-reduced-motion: reduce)');
let reduced = mqReduce.matches;
const FINE = matchMedia('(hover: hover) and (pointer: fine)').matches;
const SMALL = () => innerWidth <= 760;
const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16) / 255);
const ticks = new Set();
const imgReady = img => new Promise(res => {
  if (!img || img.complete) return res();
  img.addEventListener('load', res, { once: true });
  img.addEventListener('error', res, { once: true });
});

const MOODS = {
  night: { deep:'#0b1a2e', crest:'#7b95b3', light:'#ebba69', sky:'#0e2036', amp:1.00, speed:1.00, chop:.25, fog:1.00, lx: .42, city:1.0 },
  crest: { deep:'#2a0d17', crest:'#a7646d', light:'#f0c46a', sky:'#2a0f1a', amp:.85,  speed:.80,  chop:.20, fog:.90,  lx:-.18, city:1.3 },
  shore: { deep:'#0a2229', crest:'#86c0bf', light:'#e9f3ee', sky:'#0d2a30', amp:.70,  speed:1.15, chop:.55, fog:1.00, lx: .30, city:.8 },
  sepia: { deep:'#1d1812', crest:'#a8916c', light:'#f2d9a6', sky:'#241c13', amp:.55,  speed:.55,  chop:.10, fog:.62,  lx:-.30, city:.5 },
  violet:{ deep:'#100e2a', crest:'#7c79c6', light:'#ffb062', sky:'#16133c', amp:.80,  speed:.90,  chop:.30, fog:1.00, lx: .05, city:1.9 },
  still: { deep:'#06080d', crest:'#4a5566', light:'#a9b6c6', sky:'#080b12', amp:.32,  speed:.45,  chop:.05, fog:.50,  lx: .00, city:.3 },
  ember: { deep:'#1f0b10', crest:'#c0646a', light:'#ffd2a1', sky:'#2a0f15', amp:1.15, speed:1.60, chop:.80, fog:.85,  lx: .22, city:1.1 },
  sage:  { deep:'#0c1b1e', crest:'#8fa8a0', light:'#e3ece6', sky:'#10242a', amp:.85,  speed:.70,  chop:.20, fog:.75,  lx:-.40, city:.6 },
  swell: { deep:'#06192d', crest:'#5ea2d6', light:'#f4e3b6', sky:'#0a2440', amp:1.55, speed:1.10, chop:.35, fog:1.00, lx: .12, city:1.0 },
  before:{ deep:'#0d1013', crest:'#9aa3ad', light:'#e9e6df', sky:'#13171c', amp:.42,  speed:.60,  chop:.12, fog:.70,  lx:-.35, city:.75 },
  harbor:{ deep:'#0a1626', crest:'#7a92ae', light:'#f0c87a', sky:'#0f1f33', amp:.60,  speed:.70,  chop:.15, fog:1.00, lx: .10, city:1.6 }, 
};
const toState = m => ({ deep: hex(m.deep), crest: hex(m.crest), light: hex(m.light), sky: hex(m.sky),
  amp: m.amp, speed: m.speed, chop: m.chop, fog: m.fog, lx: m.lx, city: m.city });

const esc = v => String(v == null ? '' : v).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const ph = text => SHOW_PH ? `<span class="ph">${esc(text)}</span>` : '';
const pad2 = n => String(n).padStart(2, '0');

function tideChart(seedText) {
  let h = 2166136261;
  for (const c of seedText) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); }
  let s = (h >>> 0) % 2147483646 + 1;
  const rnd = () => (s = s * 16807 % 2147483647) / 2147483647;
  const cx = 120 + rnd() * 160, cy = 120 + rnd() * 130;
  const harm = [2, 3, 4, 5, 7].map(k => ({ k, a: (.05 + rnd() * .12) / Math.sqrt(k - 1), p: rnd() * Math.PI * 2 }));
  const dx = (rnd() - .5) * 7, dy = (rnd() - .5) * 7;
  const levels = 11 + Math.floor(rnd() * 5), r0 = 16 + rnd() * 22, step = 15 + rnd() * 7;
  let paths = '';
  for (let i = 0; i < levels; i++) {
    const R = r0 + i * step, x0 = cx + dx * i, y0 = cy + dy * i;
    let d = '';
    for (let j = 0; j <= 96; j++) {
      const t = j / 96 * Math.PI * 2;
      let f = 1; harm.forEach(q => { f += q.a * Math.sin(q.k * t + q.p + i * .06 * q.k); });
      d += (j ? 'L' : 'M') + (x0 + Math.cos(t) * R * f).toFixed(1) + ' ' + (y0 + Math.sin(t) * R * f * .86).toFixed(1);
    }
    paths += `<path d="${d}Z" stroke-opacity="${(.6 - i / levels * .42).toFixed(2)}"/>`;
  }
  return `<svg viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false"><g fill="none" stroke="#c4c9cf" stroke-width="1.1">${paths}</g><line x1="0" y1="336" x2="400" y2="336" stroke="#c4c9cf" stroke-opacity=".22"/></svg>`;
}

const coverTag = (src, title, alt, extra = '') =>
  `<img src="${esc(src)}" alt="${esc(alt || title + ' cover')}" data-cover="${esc(src)}" data-title="${esc(title)}" ${extra}>`;
function coverCandidates(src) {
  const m = String(src).match(/^(.*\/)?([^/]+?)(\.[A-Za-z0-9]+)?$/); if (!m) return [];
  const dir = m[1] || '', name = m[2], ext = m[3] || '', out = [];
  if (ext) out.push(dir + name + ext + ext);
  [name, name.toLowerCase()].forEach(n => ['.jpg', '.jpeg', '.png', '.webp', '.JPG', '.JPEG', '.PNG'].forEach(x => out.push(dir + n + x)));
  return [...new Set(out)].filter(c => c !== src);
}
document.addEventListener('error', e => {
  const img = e.target;
  if (!(img instanceof HTMLImageElement) || !img.dataset.cover) return;
  const queue = img.dataset.queue ? JSON.parse(img.dataset.queue) : coverCandidates(img.dataset.cover);
  const next = queue.shift(); img.dataset.queue = JSON.stringify(queue);
  if (next) { img.src = next; return; }
  console.warn(`MAREA WORLD — cover not found for ${img.dataset.title}: "${img.dataset.cover}". The name in js/data.js must match the file in assets/images exactly (capitals, spaces, .jpg/.png).`);
  if (img.dataset.onfail === 'hide') { img.hidden = true; return; }
  img.insertAdjacentHTML('afterend', tideChart(img.dataset.title) + ph('Cover not found: ' + img.dataset.cover.split('/').pop()));
  img.remove();
}, true);
document.addEventListener('load', e => {
  const img = e.target;
  if (img instanceof HTMLImageElement && img.dataset.cover && img.dataset.queue && !img.dataset.noted) {
    img.dataset.noted = '1';
    console.info(`MAREA WORLD — cover for ${img.dataset.title} found at "${decodeURI(new URL(img.src).pathname).replace(/^\//, '')}". Put this path in js/data.js.`);
  }
}, true);

(function renderBefore() {
  const grid = $('#bmGrid'); if (!grid) return;
  const play = '<svg viewBox="0 0 24 24" aria-hidden="true"><polygon points="6,3 20,12 6,21"/></svg>';
  grid.innerHTML = BEFORE.map((t, i) => {
    const art = t.artwork ? coverTag(t.artwork, t.title, t.artworkAlt, 'loading="lazy"') : tideChart(t.title) + ph('Placeholder artwork');
    const meta = [t.releaseDate, t.duration].filter(Boolean).map(esc).join(', ');
    const hasVideo = !!ytId(t.youtube);
    const action = hasLyrics(t) ? 'Play with lyrics' : hasVideo ? 'Play video' : 'Open track details';
    return `<li class="bm-item fade"><button class="bm-card${hasLyrics(t) ? ' has-lyrics' : ''}" type="button" data-i="${i}"${hasLyrics(t) ? '' : ' aria-haspopup="dialog"'} aria-label="${esc(t.title)}: ${action.toLowerCase()}">
      <span class="bm-art">${art}<span class="bm-n" aria-hidden="true">${pad2(i + 1)}</span>${hasVideo ? `<span class="bm-play" aria-hidden="true">${play}</span>` : ''}</span>
      <span class="bm-info"><span class="bm-title">${esc(t.title)}</span><span class="bm-meta">${meta || ph('Add release date, duration')}</span><span class="bm-open">${action}</span></span>
    </button></li>`;
  }).join('') + `<li class="bm-item bm-next fade"><a href="#marea" data-chapter="II" data-chapter-title="Marea"><img src="assets/images/marea-emblem.webp" alt="" width="656" height="374" loading="lazy"><span>Then</span><strong>MAREA WORLD</strong></a></li>`;
})();

(function renderAlbum() {
  const list = $('#tlist'); if (!list) return;
  const playIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><polygon points="6,3 20,12 6,21"/></svg>';
  list.innerHTML = ALBUM.map((t, i) => {
    const label = 'TRACK ' + pad2(i + 1);
    const body = t.title
      ? `<span class="ti-name">${esc(t.title)}</span>${t.subtitle ? `<span class="ti-sub">${esc(t.subtitle)}</span>` : ''}`
      : '<span class="ti-wave" aria-hidden="true"></span>';
    const play = ytId(t.youtube) ? `<button class="ti-play pressable" type="button" data-i="${i}" aria-label="Play ${esc(t.title || label)}">${playIcon}</button>` : '';
    return `<li class="tl-row${t.title ? '' : ' empty'}"><button class="ti" type="button" aria-pressed="false" aria-controls="stage" aria-label="${esc(t.title ? label + ': ' + t.title : label + ', not revealed yet')}"><span class="ti-n">${label}</span><span class="ti-info">${body}</span><span class="ti-r">${esc(t.duration || '')}</span></button>${play}</li>`;
  }).join('');
})();

(function renderCredits() {
  const box = $('#crList'); if (!box) return;
  box.innerHTML = (DATA.credits || []).map((g, gi) => {
    const people = (g.people || []).filter(p => p && p.name);
    if (!people.length && !SHOW_PH) return '';
    const names = people.map((p, pi) => `<li><button class="cr-name" type="button" data-g="${gi}" data-p="${(g.people || []).indexOf(p)}" aria-haspopup="dialog">${p.image ? `<img class="cr-thumb" src="${esc(p.image)}" alt="" loading="lazy">` : ''}<span>${esc(p.name)}</span></button></li>`).join('');
    return `<div class="cr-group fade"><h3 class="cr-role">${esc(g.role)}</h3><ul class="cr-names">${names || `<li>${ph('Add name in js/data.js')}</li>`}</ul></div>`;
  }).join('');
})();

const fallbackLink = $('#vidFallbackLink');
if (fallbackLink && LEAD && LEAD.youtube) fallbackLink.href = LEAD.youtube;

(() => {
  const el = $('#grain'); if (!el) return;
  const c = document.createElement('canvas'); c.width = c.height = 160;
  const x = c.getContext('2d'); const d = x.createImageData(160, 160);
  for (let i = 0; i < d.data.length; i += 4) {
    const v = Math.random() * 255 | 0;
    d.data[i] = d.data[i + 1] = d.data[i + 2] = v;
    d.data[i + 3] = 10 + (Math.random() * 16 | 0);
  }
  x.putImageData(d, 0, 0);
  el.style.backgroundImage = `url(${c.toDataURL()})`;
})();

const Intro = (() => {
  const el = $('#intro');
  let opened = false;
  const listeners = [];
  const fast = root.classList.contains('intro-fast') || reduced;
  try { sessionStorage.setItem('marea-intro', '1'); } catch (e) {}
  const t0 = performance.now();
  const MIN = fast ? 200 : 1700;
  const tasks = [imgReady($('.intro-mark'))];
  if (document.fonts && document.fonts.ready) tasks.push(document.fonts.ready);
  let done = 0;
  const setLoad = v => el && el.style.setProperty('--load', v);
  requestAnimationFrame(() => setLoad(.18));
  tasks.forEach(p => p.then(() => { done++; setLoad(.18 + .82 * done / tasks.length); }));
  Promise.all(tasks).then(() => setTimeout(open, Math.max(0, MIN - (performance.now() - t0))));
  const hard = setTimeout(open, 4500);
  function open() {
    if (opened) return;
    opened = true; clearTimeout(hard);
    setLoad(1);
    root.classList.remove('is-loading');
    root.classList.add('is-open');
    if (location.hash) { const t = document.getElementById(location.hash.slice(1)); if (t) t.scrollIntoView(); }
    setTimeout(() => root.classList.add('is-ready'), reduced ? 30 : 1500);
    listeners.forEach(fn => fn());
  }
  if (el) el.addEventListener('click', open);
  addEventListener('keydown', function k() { open(); removeEventListener('keydown', k); });
  return { onOpen(fn) { opened ? fn() : listeners.push(fn); }, get opened() { return opened; } };
})();

const Sea = (() => {
  const canvas = $('#sea'), sky = $('#sky'), mist = $('#mist');
  const cur = toState(MOODS.night);
  let target = toState(MOODS.night), moving = true;
  let playing = 0, playTarget = 0;
  const FOV = 55 * Math.PI / 180, FY = 1 / Math.tan(FOV / 2);
  let hz = .47, pitch = 0, cosP = 1, sinP = 0, aspect = 1, dpr = 1;
  let camY = 2.3, arrive = 0;
  const ptr = { x: 0, z: -8, s: 0, ts: 0 };
  const rip = { x: 0, z: -8, age: 99, s: 0 };
  let gl = null, prog = null, buf = null, count = 0, U = {}, lost = false;

  const VS = `
  precision highp float;
  attribute vec4 aP;
  uniform float uT, uTravel, uAmp, uChop, uFogFar, uLightX, uCity, uDpr, uSize, uHalfW, uNear, uFar, uPlay, uArrive;
  uniform vec3 uCam; uniform vec2 uPitch; uniform vec4 uProj;
  uniform vec3 uDeep, uCrest, uLight;
  uniform vec4 uPtr; uniform vec4 uRip;
  varying vec3 vC; varying float vA;
  float hash(vec2 p){ p = fract(p * vec2(127.1, 311.7)); p += dot(p, p + 34.23); return fract(p.x * p.y); }
  float noise(vec2 p){ vec2 i = floor(p), f = fract(p); vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y); }
  float waves(vec2 p, float t){
    float h = 0.0;
    h += sin(p.y * 0.32 + p.x * 0.05 + t * 0.55) * 0.13;
    h += sin(dot(p, vec2(0.62, 0.78)) * 0.95 + t * 0.95) * 0.15;
    h += sin(dot(p, vec2(-0.83, 0.55)) * 1.45 + t * 1.25) * 0.09;
    h += sin(dot(p, vec2(0.25, 0.97)) * 2.4 + t * 1.8) * 0.055;
    h += sin(dot(p, vec2(0.97, -0.24)) * 3.9 + t * 2.6) * 0.03 * (1.0 + uChop * 2.5);
    h += (noise(p * 0.55 + vec2(t * 0.05, -t * 0.08)) - 0.5) * 0.24;
    h += (noise(p * 1.9 - vec2(t * 0.14, 0.0)) - 0.5) * 0.09 * (1.0 + uChop * 3.0);
    return h * uAmp;
  }
  vec4 project(vec3 w, out float depth){
    vec3 v = w - uCam;
    float vy = v.y * uPitch.x - v.z * uPitch.y;
    float vz = v.y * uPitch.y + v.z * uPitch.x;
    depth = -vz;
    return vec4(v.x * uProj.x, vy * uProj.y, vz * uProj.z + uProj.w, -vz);
  }
  void main(){
    float kind = aP.w, seed = aP.z, depth;
    if (kind < 0.5) {
      float d = uNear * pow(uFar / uNear, aP.y);
      d *= 1.0 + (fract(seed * 13.7) - 0.5) * 0.02;
      float x = (aP.x + (fract(seed * 7.3) - 0.5) * 0.01) * d * uHalfW;
      vec2 wp = vec2(x, -d);
      vec2 np = vec2(wp.x, wp.y - uTravel);
      float h = waves(np, uT);
      float slope = (h - waves(np + vec2(0.0, -0.25), uT)) * 3.0;
      vec2 dp = wp - uPtr.xy; float pd = length(dp);
      float lamp = exp(-pd * pd / 3.2) * uPtr.z;
      h += sin(pd * 4.5 - uT * 4.0) * 0.08 * lamp;
      float rd = length(wp - uRip.xy);
      float ring = exp(-pow((rd - uRip.z * 3.0) / 0.6, 2.0)) * exp(-uRip.z * 0.75) * uRip.w;
      h += ring * 0.3;
      gl_Position = project(vec3(wp.x, h, wp.y), depth);
      float fog = 1.0 - smoothstep(uFogFar * 0.22, uFogFar, depth);
      float crest = smoothstep(-0.22, 0.32, h);
      float ndcx = gl_Position.x / gl_Position.w;
      float colW = 0.05 + 1.3 / depth;
      float column = exp(-pow((ndcx - uLightX) / colW, 2.0));
      float sparkle = pow(clamp(slope * 1.6 + 0.35, 0.0, 1.0), 2.5) * (0.45 + 0.55 * sin(uT * 3.1 + seed * 91.0));
      float glint = column * (0.25 + sparkle) * (1.0 + uPlay * 0.7);
      vec3 c = mix(uDeep * 2.4 + 0.03, uCrest * 1.1, crest);
      c += uLight * (glint * 2.2 + lamp * 0.6 + ring * 0.9);
      vA = (0.34 + crest * 0.62 + glint * 1.5 + lamp * 0.45 + ring * 0.6) * fog;
      vC = c;
      gl_PointSize = clamp(uSize * (0.85 + crest * 0.5 + glint * 1.2) / depth * uDpr, 1.25 * uDpr, 6.0 * uDpr);
    } else {
      float d = uFar * mix(1.15, 0.6, uArrive);
      float x = aP.x * d * uHalfW;
      float tw = 0.72 + 0.28 * sin(uT * (0.6 + fract(seed * 5.1) * 2.2) + seed * 60.0);
      float y = aP.y, a = tw;
      if (kind > 1.5 && kind < 2.5) {
        y = -aP.y;
        x += sin(uT * 1.6 + seed * 40.0 + aP.y * 26.0) * d * 0.0012;
        a = tw * 0.36 * (1.0 - aP.y / 1.3);
      } else if (kind > 2.5) {
        a = pow(0.5 + 0.5 * sin(uT * 0.7), 10.0) * 1.2 + 0.18;
      }
      gl_Position = project(vec3(x, y, -d), depth);
      float hue = fract(seed * 3.7);
      vec3 warm = mix(vec3(1.0, 0.72, 0.4), vec3(1.0, 0.93, 0.8), hue);
      vC = hue > 0.88 ? vec3(0.74, 0.84, 1.0) : warm;
      vA = a * uCity * 1.25;
      gl_PointSize = (kind > 2.5 ? 4.0 : (kind < 1.5 ? 2.4 : 2.0)) * uDpr * (0.8 + fract(seed * 9.1) * 0.5) * (1.0 + uArrive * 0.5);
    }
  }`;
  const FS = `
  precision mediump float;
  varying vec3 vC; varying float vA;
  void main(){
    vec2 q = gl_PointCoord - 0.5;
    float r = dot(q, q);
    if (r > 0.25) discard;
    float a = vA * smoothstep(0.25, 0.04, r);
    gl_FragColor = vec4(vC * a, a);
  }`;

  function buildPoints() {
    const small = SMALL();
    const cols = small ? 120 : 210, rows = small ? 110 : 160;
    let s = 1337;
    const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
    const water = [];
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) water.push(c / (cols - 1) * 2 - 1, r / (rows - 1), rnd(), 0);
    const city = [];
    const clusters = [[-.58, .26, 46, 1.0], [-.2, .12, 16, .55], [.36, .1, 12, .45], [.7, .06, 7, .35]];
    clusters.forEach(([cx, sp, n, hs]) => {
      for (let i = 0; i < n; i++) {
        const off = (rnd() - .5) * 2 * sp;
        const u = cx + off * Math.abs(off) / sp * 1.2;
        const y = .12 + rnd() * 1.25 * hs * (1 - Math.min(1, Math.abs(u - cx) / (sp * 1.3)));
        const sd = rnd();
        city.push(u, y, sd, 1);
        if (rnd() < .7) for (let k = 1; k <= 3; k++) city.push(u, .12 + k * .26, sd + k * .13, 2);
      }
    });
    city.push(.86, .55, .5, 3, .86, .3, .41, 2, .86, .6, .42, 2);
    count = (water.length + city.length) / 4;
    return new Float32Array(water.concat(city));
  }

  function compile(type, src) {
    const sh = gl.createShader(type); gl.shaderSource(sh, src); gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(sh));
    return sh;
  }
  function init() {
    gl = canvas.getContext('webgl', { antialias: false, alpha: true, premultipliedAlpha: true, depth: false, stencil: false, powerPreference: 'high-performance' });
    if (!gl) throw new Error('no webgl');
    prog = gl.createProgram();
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VS));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FS));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
    gl.useProgram(prog);
    buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, buildPoints(), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'aP');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 4, gl.FLOAT, false, 0, 0);
    ['uT','uTravel','uAmp','uChop','uFogFar','uLightX','uCity','uDpr','uSize','uHalfW','uNear','uFar','uPlay','uArrive','uCam','uPitch','uProj','uDeep','uCrest','uLight','uPtr','uRip']
      .forEach(n => U[n] = gl.getUniformLocation(prog, n));
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE);
    gl.disable(gl.DEPTH_TEST);
    gl.clearColor(0, 0, 0, 0);
  }
  try { init(); } catch (e) { gl = null; root.classList.add('no-webgl'); }
  if (canvas) {
    canvas.addEventListener('webglcontextlost', e => { e.preventDefault(); lost = true; });
    canvas.addEventListener('webglcontextrestored', () => { try { init(); lost = false; resize(); } catch (e) { gl = null; root.classList.add('no-webgl'); } });
  }

  function resize() {
    hz = parseFloat(getComputedStyle(root).getPropertyValue('--hz')) || .47;
    pitch = Math.atan((1 - 2 * hz) / FY);
    cosP = Math.cos(pitch); sinP = Math.sin(pitch);
    if (!canvas) return;
    dpr = Math.min(devicePixelRatio || 1, SMALL() ? 1.5 : 2);
    const w = canvas.clientWidth || innerWidth, h = canvas.clientHeight || innerHeight;
    aspect = w / h;
    if (gl) { canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr); gl.viewport(0, 0, canvas.width, canvas.height); }
  }

  function toWater(cx, cy) {
    const w = canvas.clientWidth || innerWidth, h = canvas.clientHeight || innerHeight;
    const nx = cx / w * 2 - 1, ny = 1 - cy / h * 2;
    const dx = nx / (FY / aspect), dy = ny / FY, dz = -1;
    const wy = dy * cosP + dz * sinP, wz = -dy * sinP + dz * cosP;
    if (wy > -1e-3) return null;
    const t = -camY / wy;
    return [dx * t, wz * t];
  }

  function draw(T, travel) {
    if (!gl || lost) return;
    gl.clear(gl.COLOR_BUFFER_BIT);
    const near = 1.6, far = 72;
    gl.uniform1f(U.uT, T);
    gl.uniform1f(U.uTravel, travel);
    gl.uniform1f(U.uAmp, cur.amp * (1 + playing * .12));
    gl.uniform1f(U.uChop, cur.chop);
    gl.uniform1f(U.uFogFar, 62 * cur.fog);
    gl.uniform1f(U.uLightX, cur.lx);
    gl.uniform1f(U.uCity, cur.city);
    gl.uniform1f(U.uDpr, dpr);
    gl.uniform1f(U.uSize, SMALL() ? 9 : 11);
    gl.uniform1f(U.uHalfW, aspect * Math.tan(FOV / 2) * 1.08);
    gl.uniform1f(U.uNear, near);
    gl.uniform1f(U.uFar, far);
    gl.uniform1f(U.uPlay, playing);
    gl.uniform1f(U.uArrive, arrive);
    gl.uniform3f(U.uCam, 0, camY, 0);
    gl.uniform2f(U.uPitch, cosP, sinP);
    const zn = .1, zf = 200;
    gl.uniform4f(U.uProj, FY / aspect, FY, (zf + zn) / (zn - zf), 2 * zf * zn / (zn - zf));
    gl.uniform3fv(U.uDeep, cur.deep);
    gl.uniform3fv(U.uCrest, cur.crest);
    gl.uniform3fv(U.uLight, cur.light);
    gl.uniform4f(U.uPtr, ptr.x, ptr.z, ptr.s, 0);
    gl.uniform4f(U.uRip, rip.x, rip.z, rip.age, rip.s);
    gl.drawArrays(gl.POINTS, 0, count);
  }

  function paintSky() {
    const c = a => `rgb(${a.map(v => Math.round(v * 255)).join(',')})`;
    const haze = cur.sky.map((v, i) => lerp(v, cur.crest[i], .28));
    sky.style.setProperty('--sky', c(cur.sky));
    sky.style.setProperty('--haze', c(haze));
    sky.style.setProperty('--glow', cur.light.map(v => Math.round(v * 255)).join(','));
    sky.style.setProperty('--lx', ((cur.lx + 1) * 50).toFixed(2) + '%');
    mist.style.setProperty('--mist-o', (.35 + .65 * clamp(1.6 - cur.fog, 0, 1)).toFixed(3));
  }

  let T = 0, last = performance.now(), lastScroll = -1, dirty = true;
  ticks.add(now => {
    const dt = Math.min(.05, (now - last) / 1000); last = now;
    if (moving) {
      const k = 1 - Math.exp(-dt * 1.7);
      let delta = 0;
      for (const key of ['deep', 'crest', 'light', 'sky']) for (let i = 0; i < 3; i++) { const d = target[key][i] - cur[key][i]; cur[key][i] += d * k; delta += Math.abs(d); }
      for (const key of ['amp', 'speed', 'chop', 'fog', 'lx', 'city']) { const d = target[key] - cur[key]; cur[key] += d * k; delta += Math.abs(d); }
      paintSky();
      if (delta < .002) moving = false;
      dirty = true;
    }
    playing += (playTarget - playing) * (1 - Math.exp(-dt * 1.2));
    ptr.s += (ptr.ts - ptr.s) * (1 - Math.exp(-dt * 3));
    rip.age += dt;
    const sy = scrollY;
    if (sy !== lastScroll) { lastScroll = sy; dirty = true; }
    const maxS = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    const p = clamp(sy / maxS, 0, 1);
    camY = lerp(2.3, 1.45, p * p * (3 - 2 * p));
    const a = clamp((p - .72) / .28, 0, 1); arrive = a * a * (3 - 2 * a);
    if (reduced) { if (dirty) draw(T, sy * .004); dirty = false; return; }
    T += dt * cur.speed;
    draw(T, T * .9 + sy * .004);
  });

  addEventListener('resize', () => { resize(); dirty = true; });
  resize(); paintSky();

  if (FINE) {
    addEventListener('pointermove', e => {
      const w = toWater(e.clientX, e.clientY);
      if (w) { ptr.x = w[0]; ptr.z = w[1]; ptr.ts = 1; } else ptr.ts = 0;
    }, { passive: true });
    document.addEventListener('pointerleave', () => { ptr.ts = 0; });
    addEventListener('blur', () => { ptr.ts = 0; });
  }
  addEventListener('pointerdown', e => {
    if (e.target.closest('a,button,input,iframe,dialog,.lp,.pb-bg,.stage,.tl-list,.bm-grid,.cr-list,form')) return;
    const w = toWater(e.clientX, e.clientY);
    if (w) { rip.x = w[0]; rip.z = w[1]; rip.age = 0; rip.s = 1; }
  }, { passive: true });

  return {
    setMood(name) { const m = MOODS[name]; if (!m) return; target = toState(m); moving = true; },
    setPlaying(on) { playTarget = on ? 1 : 0; },
    get hz() { return hz; },
  };
})();

function Reflection(canvas, opts) {
  const ctx = canvas.getContext('2d');
  let src = null, sw = 0, sh = 0, visible = false, active = false, frame = 0, ready = false;
  const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { rootMargin: '60px' });
  io.observe(canvas);
  function prepare() { const r = opts.prepare(); if (!r) return; ({ src, sw, sh } = r); ready = true; render(0); }
  function render(t) {
    if (!ready) return;
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    const step = Math.max(1, Math.round(opts.dpr()));
    const span = opts.span || .9;
    for (let y = 0; y < H; y += step) {
      const f = y / H;
      const sy = opts.sy0(sh) - f * sh * span;
      if (sy < 0) break;
      const amp = (opts.amp0 + f * opts.amp) * step;
      const ox = Math.sin(y / step * .11 + t * 1.7) * amp + Math.sin(y / step * .031 - t * .8) * amp * .7;
      let a = opts.alpha * Math.pow(1 - f, 1.6) * (.7 + .3 * Math.sin(y / step * .45 + t * 2.3));
      if (opts.gaps) a *= clamp(.6 + Math.sin(y / step * .19 - t * 1.3) * .7 + Math.sin(y / step * .07 + t * .6) * .3, 0, 1);
      ctx.globalAlpha = a;
      ctx.drawImage(src, opts.sx(sw), sy, opts.sWidth(sw), Math.max(1, sh * span / H * step), ox, y, W, step);
    }
    ctx.globalAlpha = 1;
  }
  ticks.add(now => {
    if (!active || !visible || reduced) return;
    if ((frame++ & 1) === 0) render(now / 1000);
  });
  return { prepare, start() { active = true; }, render };
}

const titleReflect = (() => {
  const canvas = $('#reflect'), title = $('#title');
  if (!canvas || !title) return null;
  const src = document.createElement('canvas');
  const dpr = () => Math.min(devicePixelRatio || 1, 2);
  const R = Reflection(canvas, {
    dpr, alpha: .5, amp0: 1.4, amp: 11, span: .92, gaps: true,
    sy0: sh => sh - 1, sx: () => 0, sWidth: sw => sw,
    prepare() {
      const r = title.getBoundingClientRect(); if (!r.width) return null;
      const cs = getComputedStyle(title), fs = parseFloat(cs.fontSize), d = dpr();
      src.width = Math.ceil(r.width * d); src.height = Math.ceil(fs * .8 * d);
      const x = src.getContext('2d');
      x.clearRect(0, 0, src.width, src.height);
      x.font = `${cs.fontWeight} ${fs * d}px ${cs.fontFamily}`;
      x.fillStyle = '#efdcb4';
      x.textBaseline = 'alphabetic';
      const chs = $$('.ch', title), tb = title.getBoundingClientRect();
      const lastTop = Math.max(...chs.map(c => c.parentNode.offsetTop));
      chs.filter(c => c.parentNode.offsetTop === lastTop).forEach(ch => {
        x.fillText(ch.textContent, (ch.getBoundingClientRect().left - tb.left) * d, src.height - 1);
      });
      canvas.width = src.width; canvas.height = Math.ceil(src.height * .62);
      canvas.style.width = r.width + 'px'; canvas.style.height = (src.height * .62 / d) + 'px';
      return { src, sw: src.width, sh: src.height };
    }
  });
  const go = () => R.prepare();
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(go);
  Intro.onOpen(() => { go(); R.start(); });
  addEventListener('resize', () => requestAnimationFrame(go));
  return R;
})();

(() => {
  const canvas = $('#ptReflect'), img = $('#ptImg'), frame = $('.pt-frame');
  if (!canvas || !img || !frame) return;
  const dpr = () => Math.min(devicePixelRatio || 1, 2);
  const R = Reflection(canvas, {
    dpr, alpha: .55, amp0: .6, amp: 6, span: .32,
    sy0: sh => sh * .92, sx: sw => sw * .12, sWidth: sw => sw * .7,
    prepare() {
      const w = frame.clientWidth; if (!w || !img.naturalWidth) return null;
      const d = dpr();
      canvas.width = Math.round(w * d); canvas.height = Math.round(w * .26 * d);
      return { src: img, sw: img.naturalWidth, sh: img.naturalHeight };
    }
  });
  imgReady(img).then(() => { R.prepare(); R.start(); });
  addEventListener('resize', () => requestAnimationFrame(() => R.prepare()));
})();

(() => {
  const rel = new Date(SITE.releaseDate).getTime(), box = $('#cd');
  let id = 0;
  function updCD() {
    const d = rel - Date.now();
    if (!(d > 0)) { box.hidden = true; clearInterval(id); return; }
    $('#cdD').textContent = String(Math.floor(d / 864e5)).padStart(2, '0');
    $('#cdH').textContent = String(Math.floor((d % 864e5) / 36e5)).padStart(2, '0');
    $('#cdM').textContent = String(Math.floor((d % 36e5) / 6e4)).padStart(2, '0');
    $('#cdS').textContent = String(Math.floor((d % 6e4) / 1e3)).padStart(2, '0');
  }
  updCD(); id = setInterval(updCD, 1000);
})();
(() => {
  const nav = $('#nav'), prog = $('#nprog'), hero = $('#top'), stmt = $('#statement');
  let words = [];
  if (stmt) {
    const txt = stmt.textContent.trim();
    stmt.textContent = '';
    txt.split(/\s+/).forEach((w, i) => {
      const s = document.createElement('span'); s.className = 'w'; s.textContent = w;
      stmt.appendChild(s); stmt.appendChild(document.createTextNode(' '));
    });
    words = $$('.w', stmt);
  }
  let lastY = -1, lit = -1, hp = -1;
  ticks.add(() => {
    const y = scrollY;
    if (y === lastY) return;
    lastY = y;
    const vh = innerHeight;
    nav.classList.toggle('solid', y > 60);
    const max = Math.max(1, document.documentElement.scrollHeight - vh);
    prog.style.transform = `scaleX(${clamp(y / max, 0, 1)})`;
    const h = clamp(y / (hero.offsetHeight * .85), 0, 1);
    if (h !== hp && !reduced) { hp = h; hero.style.setProperty('--hp', h.toFixed(4)); }
    if (stmt && words.length) {
      const r = stmt.getBoundingClientRect();
      if (r.top < vh && r.bottom > 0) {
        const p = reduced ? 1 : clamp((vh * .9 - r.top) / (r.height + vh * .35), 0, 1);
        const n = Math.round(p * words.length);
        if (n !== lit) { lit = n; words.forEach((w, i) => w.classList.toggle('lit', i < n)); }
      }
    }
  });
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: .15, rootMargin: '0px 0px -6% 0px' });
  $$('.rise,.fade').forEach(el => io.observe(el));
})();

const Sections = (() => {
  let current = 'top', trackMood = 'crest';
  const moodFor = id => ({ top: 'night', before: 'before', marea: 'night', single: 'before', tracklist: trackMood, artist: 'night', credits: 'harbor', notify: 'harbor' })[id] || 'night';
  const navFor = id => ({ before: 'before', marea: 'marea', single: 'before', tracklist: 'marea', artist: 'artist', credits: 'credits' })[id];
  const links = $$('.n-links a');
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    current = e.target.id;
    Sea.setMood(moodFor(current));
    links.forEach(a => a.setAttribute('aria-current', a.getAttribute('href') === '#' + navFor(current) ? 'true' : 'false'));
  }), { rootMargin: '-48% 0px -48% 0px' });
  $$('main > section[id]').forEach(s => io.observe(s));
  return { setTrackMood(m) { trackMood = m; if (current === 'tracklist') Sea.setMood(m); } };
})();

(() => {
  const vz = $('#vz'); if (!vz) return;
  const wave = (amp) => { let d = 'M0 12'; for (let x = 0; x < 360; x += 20) d += ` Q${x + 10} ${12 + (x / 20 % 2 ? amp : -amp)} ${x + 20} 12`; return d; };
  vz.innerHTML = `<svg viewBox="0 0 300 24" preserveAspectRatio="none"><g><path d="${wave(9)}"/><path d="${wave(5)}" transform="translate(-10 0)"/></g></svg>`;
})();

let LT = LEAD, D = [], lineOn = true;
const ls = document.getElementById('ls');
function setLyricsTrack(track) {
  LT = track;
  D = ((track && track.lyrics) || []).map(r => r.length >= 3 ? [toSec(r[0]), r[2], toSec(r[1])] : [toSec(r[0]), r[1], null])
    .filter(r => !isNaN(r[0]));
  const list = document.createElement('ol');
  list.setAttribute('lang', 'ary-Latn');
  D.forEach(([t, txt], i) => {
    const li = document.createElement('li'); li.className = 'll'; li.id = 'l' + i; li.textContent = txt; li.dataset.t = t;
    list.appendChild(li);
  });
  ls.replaceChildren(list);
  ls.scrollTop = 0;
  const title = $('#single-title > span'); if (title && track) title.textContent = track.title;
  [$('#single .kicker'), $('#single .si-badge'), $('#statement')].forEach(el => { if (el) el.hidden = track !== LEAD; });
  if (fallbackLink && track && track.youtube) fallbackLink.href = track.youtube;
  const cv = document.getElementById('siCover');
  if (cv) {
    if (track && track.artwork) {
      delete cv.dataset.queue; delete cv.dataset.noted;
      cv.dataset.cover = track.artwork; cv.dataset.title = track.title; cv.dataset.onfail = 'hide';
      cv.alt = track.title + ' cover'; cv.hidden = false; cv.src = track.artwork;
    } else cv.hidden = true;
  }
  const tt = $('#tt'); tt.dataset.d = ''; tt.textContent = (track && track.duration) || '0:00';
}
setLyricsTrack(LEAD);
let lyricHold = 0;
['wheel', 'touchstart'].forEach(ev => ls.addEventListener(ev, () => { lyricHold = Date.now(); }, { passive: true }));
ls.addEventListener('click', e => {
  const li = e.target.closest('.ll'); if (!li) return;
  if (!ytR) { wantPlay = true; seekWhenReady = +li.dataset.t; return; }
  player.seekTo(+li.dataset.t, true);
  if (!on) player.playVideo();
});

let player = null, on = false, cur = -1, tid = null, ytR = false, wantPlay = false, seekWhenReady = null;
const pbtn = $('#pbtn'), bar = $('#barbg'), vid = $('#vid');
function videoFailed() {
  if (ytR) return;
  vid.classList.add('failed');
  if (location.protocol === 'file:') $('#vidFallbackNote').textContent = 'YouTube blocks embeds on pages opened as files. Start a local server (see the notes) and reload.';
  pbtn.setAttribute('aria-disabled', 'true');
}
const sc = document.createElement('script');
sc.src = 'https://www.youtube.com/iframe_api';
sc.onerror = videoFailed;
document.head.appendChild(sc);
const ytTimeout = setTimeout(videoFailed, 15000);
window.onYouTubeIframeAPIReady = function () {
  const vars = { autoplay: 0, controls: 1, modestbranding: 1, rel: 0, playsinline: 1 };
  if (/^https?:$/.test(location.protocol)) vars.origin = location.origin;
  player = new YT.Player('ytplayer', {
    width: '100%', height: '100%', videoId: LT ? ytId(LT.youtube) : '', playerVars: vars,
    events: {
      onReady() {
        ytR = true; clearTimeout(ytTimeout); vid.classList.remove('failed');
        pbtn.setAttribute('aria-disabled', 'false');
        const d = player.getDuration(); if (d) { $('#tt').textContent = fmt(d); bar.setAttribute('aria-valuemax', Math.round(d)); }
        if (seekWhenReady !== null) { player.seekTo(seekWhenReady, true); seekWhenReady = null; }
        if (wantPlay) { wantPlay = false; player.playVideo(); }
      },
      onStateChange(e) {
        if (e.data === YT.PlayerState.PLAYING && !on) sUI(true);
        if (e.data === YT.PlayerState.PAUSED && on) sUI(false);
        if (e.data === YT.PlayerState.ENDED) sUI(false);
      },
      onError() { if (!ytR) videoFailed(); }
    }
  });
};
function sUI(p) {
  on = p;
  document.getElementById('ic1').style.display = on ? 'none' : 'block';
  document.getElementById('ic2').style.display = on ? 'block' : 'none';
  pbtn.classList.toggle('on', on);
  pbtn.setAttribute('aria-label', (on ? 'Pause ' : 'Play ') + (LT ? LT.title : ''));
  document.getElementById('vz').classList.toggle('on', on);
  $$('.bm-card').forEach(c => c.classList.toggle('np', on && BEFORE[+c.dataset.i] === LT));
  Sea.setPlaying(on);
  on ? sTick() : (xTick(), paintTime());
}
function toggle() { if (!ytR) { wantPlay = !wantPlay; return; } on ? player.pauseVideo() : player.playVideo(); }
function paintTime() {
  if (!ytR) return;
  const t = player.getCurrentTime() || 0, dur = player.getDuration() || 1;
  document.getElementById('bf').style.width = (t / dur * 100) + '%';
  document.getElementById('tc').textContent = fmt(t);
  bar.setAttribute('aria-valuenow', Math.round(t));
  bar.setAttribute('aria-valuetext', fmt(t) + ' of ' + fmt(dur));
  // while a new track is loading, ignore the previous video's clock
  const vd = player.getVideoData ? player.getVideoData() : null;
  if (LT && vd && vd.video_id && vd.video_id !== ytId(LT.youtube)) return;
  const tt = document.getElementById('tt');
  if (dur > 1 && tt.dataset.d !== String(Math.round(dur))) { tt.dataset.d = Math.round(dur); tt.textContent = fmt(dur); bar.setAttribute('aria-valuemax', Math.round(dur)); }
  let nc = -1; for (let i = D.length - 1; i >= 0; i--) { if (t >= D[i][0]) { nc = i; break; } }
  const lit = nc >= 0 && (D[nc][2] == null || t < D[nc][2]);   // a line with an end time goes dark when it ends
  if (nc !== cur || lit !== lineOn) { cur = nc; lineOn = lit; rnd(); }
}
function sTick() {
  xTick();
  (function lp() { if (!on) return; paintTime(); tid = requestAnimationFrame(lp); })();
}
function xTick() { if (tid) cancelAnimationFrame(tid); tid = null; }
function rnd() {
  D.forEach((_, i) => {
    const el = document.getElementById('l' + i);
    el.classList.toggle('p', i < cur || (i === cur && !lineOn));
    el.classList.toggle('a', i === cur && lineOn);
  });
  const el = cur >= 0 && document.getElementById('l' + cur);
  if (el && Date.now() - lyricHold > 3500) {
    ls.scrollTo({ top: el.offsetTop - ls.clientHeight * .38, behavior: reduced ? 'auto' : 'smooth' });
  }
}
function seekTo(clientX) {
  const r = bar.getBoundingClientRect();
  const f = clamp((clientX - r.left) / r.width, 0, 1);
  player.seekTo(f * player.getDuration(), true);
  document.getElementById('bf').style.width = (f * 100) + '%';
}
bar.addEventListener('pointerdown', e => {
  if (!ytR) return;
  bar.setPointerCapture(e.pointerId); bar.classList.add('drag'); seekTo(e.clientX);
  const move = ev => seekTo(ev.clientX);
  const up = () => { bar.classList.remove('drag'); bar.removeEventListener('pointermove', move); if (!on) player.playVideo(); paintTime(); };
  bar.addEventListener('pointermove', move);
  bar.addEventListener('pointerup', up, { once: true });
  bar.addEventListener('pointercancel', up, { once: true });
});
bar.addEventListener('keydown', e => {
  if (!ytR) return;
  const t = player.getCurrentTime() || 0, d = player.getDuration() || 0;
  const map = { ArrowRight: t + 5, ArrowUp: t + 5, ArrowLeft: t - 5, ArrowDown: t - 5, Home: 0, End: d - 1, PageUp: t + 15, PageDown: t - 15 };
  if (!(e.key in map)) return;
  e.preventDefault(); player.seekTo(clamp(map[e.key], 0, d), true); setTimeout(paintTime, 60);
});
pbtn.addEventListener('click', toggle);
function goPlay() {
  document.getElementById('single').scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
  setTimeout(() => { if (ytR && !on) player.playVideo(); else if (!ytR) wantPlay = true; }, reduced ? 60 : 800);
}
function playTrack(track) {
  if (track && hasLyrics(track) && track !== LT) {
    setLyricsTrack(track);
    cur = -1; lineOn = true;
    document.getElementById('bf').style.width = '0%';
    document.getElementById('tc').textContent = '0:00';
    pbtn.setAttribute('aria-label', (on ? 'Pause ' : 'Play ') + track.title);
    $$('.bm-card').forEach(c => c.classList.toggle('np', on && BEFORE[+c.dataset.i] === LT));
    const id = ytId(track.youtube);
    if (ytR && id) player.loadVideoById(id);
  }
  goPlay();
}
function fmt(s) { return Math.floor(s / 60) + ':' + (Math.floor(s % 60) < 10 ? '0' : '') + Math.floor(s % 60); }

(() => {
  const btns = $$('.ti'), stage = $('#stage'), img = $('#stImg');
  const total = btns.length;
  const el = id => document.getElementById(id);
  $$('.ti-play').forEach(b => b.addEventListener('click', () => TrackSheet.open('album', +b.dataset.i, b)));
  function select(i, focus) {
    const b = btns[i], t = ALBUM[i]; if (!b || !t) return;
    btns.forEach((x, j) => { x.setAttribute('aria-pressed', j === i ? 'true' : 'false'); x.tabIndex = j === i ? 0 : -1; });
    if (focus) b.focus();
    const m = MOODS[t.mood];
    stage.style.setProperty('--tint', m ? m.light : '#ebba69');
    const label = 'TRACK ' + pad2(i + 1);
    el('stNum').textContent = pad2(i + 1);
    const missing = [!t.title && 'title', !t.youtube && 'YouTube link', !t.artwork && 'artwork'].filter(Boolean);
    el('stMeta').innerHTML = `Track ${i + 1} of ${total}` + (SHOW_PH && missing.length ? `<br>${ph('Add ' + missing.join(', '))}` : '');
    const ti = el('stTitle');
    ti.textContent = t.title || label;
    ti.classList.toggle('slot', !t.title);
    const line = el('stLine');
    if (t.title) line.textContent = t.subtitle || '';
    else line.innerHTML = '<span class="ti-wave" aria-hidden="true"></span>';
    el('stStatus').textContent = t.duration || '';
    const act = el('stAction'); act.textContent = '';
    if (ytId(t.youtube)) {
      const p = document.createElement('button'); p.type = 'button'; p.className = 'ring-btn pressable';
      p.innerHTML = `<span class="ring"><svg viewBox="0 0 24 24" aria-hidden="true"><polygon points="6,3 20,12 6,21"/></svg></span><span>Play video</span>`;
      p.addEventListener('click', () => TrackSheet.open('album', i, p)); act.appendChild(p);
    } else {
      const a = document.createElement('a'); a.href = '#notify'; a.className = 'tide-link'; a.textContent = 'Get notified';
      act.appendChild(a);
    }
    if (t.artwork) {
      if (img.dataset.cover !== t.artwork) { delete img.dataset.queue; img.hidden = false; img.dataset.cover = t.artwork; img.dataset.title = t.title || 'TRACK ' + pad2(i + 1); img.dataset.onfail = 'hide'; img.src = t.artwork; }
      stage.classList.add('has-img');
    }
    else stage.classList.remove('has-img');
    stage.classList.remove('swap'); void stage.offsetWidth; stage.classList.add('swap');
    Sections.setTrackMood(t.mood || 'night');
  }
  btns.forEach((b, i) => b.addEventListener('click', () => select(i)));
  $('#tlist').addEventListener('keydown', e => {
    const i = btns.indexOf(document.activeElement); if (i < 0) return;
    const to = { ArrowDown: i + 1, ArrowRight: i + 1, ArrowUp: i - 1, ArrowLeft: i - 1, Home: 0, End: total - 1 }[e.key];
    if (to === undefined) return;
    e.preventDefault(); select((to + total) % total, true);
  });
  select(0);
  stage.classList.remove('swap');

  const sl = $('#sleeve');
  if (sl && FINE && !reduced) {
    sl.addEventListener('pointermove', e => {
      const r = sl.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      sl.style.setProperty('--ry', (x * 14).toFixed(2) + 'deg'); sl.style.setProperty('--rx', (-y * 14).toFixed(2) + 'deg');
      sl.style.setProperty('--sx', (100 - (x + .5) * 100).toFixed(1) + '%');
    });
    sl.addEventListener('pointerleave', () => { ['--rx', '--ry'].forEach(p => sl.style.setProperty(p, '0deg')); sl.style.setProperty('--sx', '120%'); });
  }
})();

(() => {
  const img = $('#ptImg'), fr = $('.pt-frame'); if (!img || !fr || reduced) return;
  let vis = false;
  new IntersectionObserver(([e]) => { vis = e.isIntersecting; }).observe(fr);
  ticks.add(() => {
    if (!vis) return;
    const r = fr.getBoundingClientRect();
    const p = clamp((innerHeight - r.top) / (innerHeight + r.height), 0, 1);
    img.style.setProperty('--py', (-12 + p * 12).toFixed(2) + '%');
  });
})();

(() => {
  const form = $('#notiForm'), input = $('#notiEmail'), btn = $('#notiBtn'), msg = $('#notiMsg');
  const say = (t, err) => { msg.textContent = t; msg.classList.toggle('err', !!err); };
  input.addEventListener('input', () => { input.removeAttribute('aria-invalid'); if (msg.classList.contains('err')) say(''); });
  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (!input.value.trim() || !input.checkValidity()) {
      input.setAttribute('aria-invalid', 'true'); input.focus();
      say('Enter a valid email address, like name@example.com.', true); return;
    }
    if (SITE.notifyEndpoint) {
      btn.disabled = true; btn.textContent = 'Sending…';
      try {
        const res = await fetch(SITE.notifyEndpoint, { method: 'POST', headers: { Accept: 'application/json' }, body: new FormData(form) });
        if (!res.ok) throw new Error(res.status);
      } catch (err) {
        btn.disabled = false; btn.textContent = 'Notify Me';
        say('That didn’t go through. Check your connection and try again.', true); return;
      }
    }
    btn.textContent = 'Subscribed ✓'; btn.classList.add('done'); btn.disabled = true; input.disabled = true;
    say('You’ll hear about new tracks first.');
  });
})();

const Sheets = (() => {
  function open(dlg, trigger) {
    dlg._ticket = (dlg._ticket || 0) + 1;
    dlg._trigger = trigger || document.activeElement;
    dlg.classList.remove('closing');
    root.classList.add('has-sheet');
    if (typeof dlg.showModal === 'function') { if (!dlg.open) dlg.showModal(); } else dlg.setAttribute('open', '');
  }
  function close(dlg, after) {
    if (!dlg.open || dlg.classList.contains('closing')) return;
    if (dlg._onClosing) dlg._onClosing();
    const ticket = dlg._ticket = (dlg._ticket || 0) + 1;
    const done = () => {
      if (dlg._ticket !== ticket) return;
      dlg.classList.remove('closing');
      if (typeof dlg.close === 'function') dlg.close(); else dlg.removeAttribute('open');
      root.classList.remove('has-sheet');
      if (!after && dlg._trigger && document.contains(dlg._trigger)) dlg._trigger.focus({ preventScroll: true });
      if (after) after();
    };
    if (reduced) return done();
    let fired = false;
    const once = () => { if (fired) return; fired = true; done(); };
    dlg.addEventListener('animationend', function h(e) { if (e.target === dlg) { dlg.removeEventListener('animationend', h); once(); } });
    dlg.classList.add('closing'); setTimeout(once, 400);
  }
  $$('dialog').forEach(dlg => {
    dlg.addEventListener('cancel', e => { e.preventDefault(); close(dlg); });
    dlg.addEventListener('close', () => { if (!$$('dialog').some(d => d.open)) root.classList.remove('has-sheet'); });
    dlg.addEventListener('click', e => { if (e.target.closest('[data-close]')) close(dlg); });
  });
  return { open, close };
})();

const TrackSheet = (() => {
  const dlg = $('#trackSheet'), body = $('#tsBody');
  const LISTS = {
    before: { items: BEFORE, label: 'Before Marea', cls: 'sheet-before', nav: () => BEFORE.map((_, i) => i) },
    album:  { items: ALBUM, label: 'MAREA WORLD', cls: 'sheet-album', nav: () => ALBUM.map((t, i) => (t.title || t.youtube) ? i : -1).filter(i => i >= 0) },
  };
  let listName = 'before', idx = 0;
  const nameOf = (t, i) => t.title || 'TRACK ' + pad2(i + 1);
  function render(name, i) {
    listName = name; idx = i;
    const L = LISTS[name], t = L.items[i]; if (!t) return;
    const id = ytId(t.youtube), order = L.nav(), pos = order.indexOf(i);
    const prevI = order[(pos - 1 + order.length) % order.length], nextI = order[(pos + 1) % order.length];
    const media = id
      ? `<div class="sheet-video"><iframe src="https://www.youtube.com/embed/${encodeURIComponent(id)}?autoplay=1&rel=0&playsinline=1" title="${esc(nameOf(t, i))}, YouTube video" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe></div>`
      : `<div class="sheet-art">${t.artwork ? coverTag(t.artwork, nameOf(t, i), t.artworkAlt) : tideChart(nameOf(t, i)) + ph('Placeholder artwork')}</div>`;
    const rows = [['Release date', t.releaseDate, 'release date'], ['Duration', t.duration, 'duration'], ['Produced by', t.producedBy, 'producer'], ['Written by', t.writtenBy, 'songwriter'], ['Artwork by', t.artworkBy, 'Naoufal Alazy']]
      .map(([k, v, missing]) => v ? `<dt>${k}</dt><dd>${esc(v)}</dd>` : (SHOW_PH ? `<dt>${k}</dt><dd>${ph('Add ' + missing)}</dd>` : '')).join('');
    const links = [
      t.youtube ? `<a class="tide-link" href="${esc(t.youtube)}" target="_blank" rel="noopener">Watch on YouTube</a>` : '',
      ...(t.listen || []).filter(l => l && l.url).map(l => `<a class="tide-link" href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label || 'Listen')}</a>`),
    ].join('');
    const lyricsBtn = hasLyrics(t) ? `<button class="ring-btn pressable" type="button" data-lyrics><span class="ring"><svg viewBox="0 0 24 24" aria-hidden="true"><polygon points="6,3 20,12 6,21"/></svg></span><span>Play with synced lyrics</span></button>` : '';
    body.className = `sheet-in ${L.cls}${id ? ' has-video' : ''}`;
    body.innerHTML = `${media}
      <div class="sheet-info">
        <p class="sheet-eyebrow">${L.label}, track ${i + 1} of ${L.items.length}</p>
        <h2 class="sheet-title" id="tsTitle">${esc(nameOf(t, i))}</h2>
        ${t.subtitle ? `<p class="sheet-sub">${esc(t.subtitle)}</p>` : ''}
        ${t.description ? `<p class="sheet-desc">${esc(t.description)}</p>` : (SHOW_PH ? `<p>${ph('Add a short description')}</p>` : '')}
        ${rows ? `<dl class="sheet-meta">${rows}</dl>` : ''}
        ${lyricsBtn ? `<div class="sheet-cta">${lyricsBtn}</div>` : ''}
        ${links ? `<div class="sheet-links">${links}</div>` : (SHOW_PH ? `<div class="sheet-links">${ph('Add YouTube link')}</div>` : '')}
        ${order.length > 1 ? `<div class="sheet-nav"><button type="button" data-step="-1" data-to="${prevI}"><span>Previous</span><strong>${esc(nameOf(L.items[prevI], prevI))}</strong></button><button type="button" data-step="1" data-to="${nextI}"><span>Next</span><strong>${esc(nameOf(L.items[nextI], nextI))}</strong></button></div>` : ''}
      </div>`;
  }
  function open(name, i, trigger) {
    if (typeof ytR !== 'undefined' && ytR && on) player.pauseVideo();
    render(name, i);
    Sheets.open(dlg, trigger);
    $('[data-close]', dlg).focus();
  }
  const step = n => {
    const b = $(`[data-step="${n}"]`, body); if (!b) return;
    render(listName, +b.dataset.to);
    const again = $(`[data-step="${n}"]`, body); if (again) again.focus();
  };
  body.addEventListener('click', e => {
    const s = e.target.closest('[data-step]'); if (s) return step(+s.dataset.step);
    if (e.target.closest('[data-lyrics]')) Sheets.close(dlg, () => { playTrack(LISTS[listName].items[idx]); pbtn.focus({ preventScroll: true }); });
  });
  dlg.addEventListener('keydown', e => {
    if (e.target.closest && e.target.closest('iframe')) return;
    if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); }
  });
  dlg._onClosing = () => { const f = $('iframe', body); if (f) f.src = 'about:blank'; };
  dlg.addEventListener('close', () => { if (!dlg.open) body.innerHTML = ''; });
  const grid = $('#bmGrid');
  if (grid) grid.addEventListener('click', e => {
    const b = e.target.closest('.bm-card'); if (!b) return;
    const t = BEFORE[+b.dataset.i];
    if (hasLyrics(t)) { playTrack(t); pbtn.focus({ preventScroll: true }); }
    else open('before', +b.dataset.i, b);
  });
  const det = $('#siDetails');
  if (det) det.addEventListener('click', () => { const i = BEFORE.indexOf(LT); if (i >= 0) open('before', i, det); });
  return { open };
})();

(() => {
  const dlg = $('#personSheet'), body = $('#psBody'), box = $('#crList');
  const groups = DATA.credits || [];
  if (!dlg || !box) return;
  const rolesOf = name => groups.filter(g => (g.people || []).some(p => p && p.name === name)).map(g => g.role);
  box.addEventListener('click', e => {
    const b = e.target.closest('.cr-name'); if (!b) return;
    const p = (groups[+b.dataset.g].people || [])[+b.dataset.p]; if (!p) return;
    const art = p.image ? `<img src="${esc(p.image)}" alt="${esc(p.name)}">` : `<span class="monogram" aria-hidden="true">${esc(p.name.trim().charAt(0))}</span>`;
    const links = (p.links || []).filter(l => l && l.url).map(l => `<a class="tide-link" href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label || 'Link')}</a>`).join('');
    body.className = 'sheet-in sheet-person';
    body.innerHTML = `<div class="sheet-art is-portrait">${art}</div>
      <div class="sheet-info">
        <ul class="sheet-roles">${rolesOf(p.name).map(r => `<li>${esc(r)}</li>`).join('')}</ul>
        <h2 class="sheet-title" id="psName">${esc(p.name)}</h2>
        ${p.realName ? `<p class="sheet-sub">${esc(p.realName)}</p>` : ''}
        ${p.note ? `<p class="sheet-desc">${esc(p.note)}</p>` : (SHOW_PH ? `<p>${ph('Add a note on their contribution')}</p>` : '')}
        ${links ? `<div class="sheet-links">${links}</div>` : ''}
      </div>`;
    Sheets.open(dlg, b);
    $('[data-close]', dlg).focus();
  });
})();

const Tide = (() => {
  const el = $('#tide'), num = $('#tideNum'), ttl = $('#tideTitle');
  let busy = false;
  function land(target) {
    const prev = root.style.scrollBehavior; root.style.scrollBehavior = 'auto';
    target.scrollIntoView(); root.style.scrollBehavior = prev;
    if (target.hasAttribute('tabindex')) target.focus({ preventScroll: true });
    try { history.replaceState(null, '', '#' + target.id); } catch (e) {}
  }
  function go(id, n, title) {
    const target = document.getElementById(id); if (!target) return;
    if (reduced || !el) { land(target); return; }
    if (busy) return;
    busy = true;
    num.textContent = n || ''; num.hidden = !n; ttl.textContent = title || '';
    el.classList.remove('in', 'out'); void el.offsetWidth; el.classList.add('in');
    setTimeout(() => {
      land(target);
      setTimeout(() => el.classList.add('out'), 280);
      setTimeout(() => { el.classList.remove('in', 'out'); busy = false; }, 280 + 950);
    }, 780);
  }
  document.addEventListener('click', e => {
    const a = e.target.closest('a[data-chapter-title]'); if (!a) return;
    e.preventDefault();
    const menu = $('#menu'); if (menu && menu.open) menu.close();
    go(a.getAttribute('href').slice(1), a.dataset.chapter, a.dataset.chapterTitle);
  });
  return { go };
})();

(() => {
  const btn = $('#menuBtn'), menu = $('#menu'); if (!btn || !menu) return;
  btn.setAttribute('aria-expanded', 'false');
  btn.addEventListener('click', () => { Sheets.open(menu, btn); btn.setAttribute('aria-expanded', 'true'); });
  menu.addEventListener('close', () => btn.setAttribute('aria-expanded', 'false'));
})();

(() => {
  const n = $('#fileNote'); if (!n || location.protocol !== 'file:') return;
  const b = document.createElement('button'); b.type = 'button'; b.textContent = 'Hide';
  b.addEventListener('click', () => { n.hidden = true; });
  n.appendChild(b); n.hidden = false;
})();

(() => {
  const n = $('#editNote'); if (!n || !SHOW_PH) return;
  const b = document.createElement('button'); b.type = 'button'; b.textContent = 'Hide';
  b.addEventListener('click', () => { n.hidden = true; });
  n.appendChild(b); n.hidden = false;
})();
(function loop(now) {
  requestAnimationFrame(loop);
  if (document.hidden || root.classList.contains('has-sheet')) return;
  ticks.forEach(fn => fn(now));
})(performance.now());
mqReduce.addEventListener && mqReduce.addEventListener('change', e => { reduced = e.matches; });
