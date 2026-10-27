/* ═══════════════════════════════════════════════════════════════════
   MAREA WORLD — CONTENT
   Everything editable lives in this file. The site reads it on load.

   Rules of thumb
   • Unknown information stays `null` (or an empty list []).
     With `showPlaceholders: true`, every null shows as a dashed
     “Add …” marker so you can see what is missing.
     With `showPlaceholders: false`, missing fields are simply hidden.
   • Image paths are relative to index.html, e.g. 'assets/images/maalich.jpg'.
   • Keep commas between items. Text goes inside quotes.
   ═══════════════════════════════════════════════════════════════════ */

window.MAREA_DATA = {

  /* ── SITE SETTINGS ─────────────────────────────────────────────── */
  site: {
    showPlaceholders: true,                 // ← set to false before publishing
    releaseDate: '2026-09-15T00:00:00',     // album countdown; hidden automatically once passed
    notifyEndpoint: '',                     // Formspree / Mailchimp form URL. Empty = emails are not sent anywhere.
  },

  /* ── CHAPTER I · BEFORE MAREA ──────────────────────────────────
     Order here = order on the site.
     Fields: title · youtube (full YouTube URL, kept exactly as given) · artwork (image path) · artworkAlt
             subtitle · releaseDate (free text, e.g. '12 March 2025') · duration ('3:12')
             description · producedBy · writtenBy · listen: [{ label: 'Spotify', url: 'https://…' }, …]
     The track that has `lyrics` also drives the synced-lyrics player on the page.      */
  beforeMarea: [
    { title: 'MAALLICH',   youtube: 'https://www.youtube.com/watch?v=MaSEWp1YJGQ', artwork: 'assets/images/Maalich cover.jpg', artworkBy: "Naoufal Alazy", releaseDate: "14-11-2025", duration: "3:52", description: null, producedBy: "YVZID & Hakai & Draconic & Bakr", writtenBy: "YVZID", mixedBy: "Hakai", listen: [],
      // synced lyrics from yvzid_maalich_timestamps.txt: [start, end, line]
      lyrics: [
        ["00:09.000", "00:11.000", "Maalich"],
        ["00:11.035", "00:13.146", "La tleqti semmek gheda fik yqis"],
        ["00:13.716", "00:18.330", "Lli galha fmmek ghadi ghir ytiqo w ynsaw mbeed"],
        ["00:19.400", "00:23.514", "Ma fik la khayb la zwin qlbek ghir ymout"],
        ["00:23.584", "00:25.395", "Qte3ti sehba w lma mnin ydouz"],
        ["00:25.565", "00:27.500", "Daba 3arfk nadem"],
        ["00:27.900", "00:32.380", "Gatli aji n3icho gtla ma tzerbich 3liya"],
        ["00:32.800", "00:37.000", "3chiri hadi meni wana kansebeq niya"],
        ["00:37.500", "00:41.580", "Gatli aji n3icho gtla ma tzerbich 3liya"],
        ["00:42.000", "00:46.800", "3chiri hadi meni wana kansebeq niya"],
        ["00:47.800", "00:51.005", "Kaytsna ghir ndor w kinod ytiri fiya jar"],
        ["00:51.675", "00:56.080", "Kterti 3lya bhdrok, bghiti tqetli fiya sber"],
        ["00:56.500", "01:01.000", "Ta telhiti bhmoum denya achno rebho li bzerba faqo"],
        ["01:01.100", "01:05.900", "Wakha ga3 tbedel jerya 3mrek treje3 dmou3 li fado"],
        ["01:06.000", "01:10.605", "Bghit nbedel hiyati wach nbedel hta nass"],
        ["01:11.275", "01:15.180", "Wakha kangol nsit mais lpassé ga3ma nsani"],
        ["01:15.850", "01:20.555", "Kolla nhar nhseb chhal baqi liya m3ak"],
        ["01:21.025", "01:24.200", "Kolla ferha 3echtha jat nessina l7zan"],
        ["01:26.200", "01:27.314", "Maalich"],
        ["01:27.384", "01:30.629", "La tleqti semmek gheda fik yqis"],
        ["01:30.899", "01:34.530", "Lli galha fmmek ghadi ghir ytiqo w ynsaw mbeed"],
        ["01:36.600", "01:39.631", "Ma fik la khayb la zwin qlbek ghir ymout"],
        ["01:40.000", "01:42.546", "Qte3ti sehba w lma mnin ydouz"],
        ["01:42.816", "01:44.146", "Daba 3arfk nadem"],
        ["01:44.900", "01:48.855", "Gatli aji n3icho gtla ma tzerbich 3liya"],
        ["01:49.155", "01:53.680", "3chiri hadi meni wana kansebeq niya"],
        ["01:54.180", "01:58.305", "Gatli aji n3icho gtla ma tzerbich 3liya"],
        ["01:59.000", "02:03.500", "3chiri hadi meni wana kansebeq niya"],
        ["02:04.000", "02:08.580", "Ti7a lewla qetlat fiya z3ama 7dert rass zeema ra lsani mat"],
        ["02:08.850", "02:13.530", "Jbedt werqa bida w wssekhtha b hedra lli 3emmer chihed fihom ghadi sme3"],
        ["02:14.100", "02:18.280", "Waqfin hdaya hit kaysayno dor gatli bebe bghit nsak glt liha say no more"],
        ["02:18.850", "02:23.630", "La dert 3lach wach ghatmchi bhalhom kamlin wla blach mabqa walo aji nsayno lmot"],
        ["02:24.000", "02:28.180", "Tta lhedra m3ahom bsalet kolchi fih lfhama w qlil lli fahem"],
        ["02:28.750", "02:33.000", "N3ich blama y3rfoni ki 3aych w mli nmot ghat3rfoni tana ghi dayez"],
        ["02:33.500", "02:35.163", "Maalich"],
        ["02:35.633", "02:37.508", "La tleqti semmek gheda fik yqis"],
        ["02:37.678", "02:42.106", "Lli galha fmmek ghadi ghir ytiqo w ynsaw mbeed"],
        ["02:43.000", "02:44.440", "Ma fik"],
        ["02:44.610", "02:47.052", "La khayb la zwin qlbek ghir ymout"],
        ["02:47.350", "02:49.197", "Qte3ti sehba w lma mnin ydouz"],
        ["02:49.247", "02:51.197", "Daba 3arfk nadem"],
        ["02:52.697", "02:54.197", "Maalich"],
        ["02:54.360", "02:56.197", "La tleqti semmek gheda fik yqis"],
        ["02:56.897", "03:00.653", "Lli galha fmmek ghadi ghir ytiqo w ynsaw mbeed"],
        ["03:02.723", "03:04.270", "Ma fik"],
        ["03:04.420", "03:06.219", "La khayb la zwin qlbek ghir ymout"],
        ["03:06.389", "03:08.213", "Qte3ti sehba w lma mnin ydouz"],
        ["03:08.513", "03:10.213", "Daba 3arfk nadem"],
        ["03:11.080", "03:15.505", "Gatli aji n3icho gtla ma tzerbich 3liya"],
        ["03:16.000", "03:20.080", "3chiri hadi meni wana kansebeq niya"],
        ["03:20.650", "03:25.155", "Gatli aji n3icho gtla ma tzerbich 3liya"],
        ["03:25.525", "03:30.000", "3chiri hadi meni wana kansebeq niya"],
        ["03:30.500", "03:34.605", "Gatli aji n3icho gtla ma tzerbich 3liya"],
        ["03:35.000", "03:39.380", "3chiri hadi meni wana kansebeq niya"],
        ["03:39.750", "03:44.355", "Gatli aji n3icho gtla ma tzerbich 3liya"],
        ["03:44.425", "03:39.400", "3chiri hadi meni wana kansebeq niya"],
      ],
    },
    { title: 'D3ILI',      youtube: 'https://www.youtube.com/watch?v=vxZRlG31EVw', artwork: 'assets/images/D3ili cover.jpg', artworkBy: "Naoufal Alazy", releaseDate: "18-12-2025", duration: "2:44", description: null, producedBy: "YVZID & Hakai", writtenBy: "YVZID", mixedBy: "Hakai", listen: [],
      // synced lyrics from yvzid_d3ili_timestamps.txt: [start, end, line]
      lyrics: [
        ["00:19.100", "00:21.400", "Glt lik sawem lmwaj 7ta jehda yfna"],
        ["00:21.800", "00:24.300", "Lbher safe ra haj ma3et fin laye7na"],
        ["00:24.500", "00:27.000", "Tanweslo l3erch 3ad kiji ybaye3na"],
        ["00:27.100", "00:29.000", "Ghi khelik 3adi sahbi tta chkoun hna"],
        ["00:29.100", "00:31.900", "Dikrayat kiredok lor"],
        ["00:32.000", "00:33.800", "Lli 3chto ykfini"],
        ["00:34.000", "00:36.300", "3aych solo w ila solo mat"],
        ["00:36.600", "00:38.000", "Kolchi ghadi yji ybki"],
        ["00:39.500", "00:41.400", "Lweqt katnessini l'âge"],
        ["00:41.600", "00:43.850", "Mouhal ghadi nchof hfidi"],
        ["00:44.000", "00:46.850", "Kanchof f3inhom ghi cinema"],
        ["00:47.000", "00:48.500", "Qlbi rkebt lih 7did"],
        ["00:49.500", "00:51.650", "Wakha ga3 ydouzo sinin"],
        ["00:52.000", "00:54.000", "Tahaja ma ghatnesini"],
        ["00:55.100", "00:56.200", "Fli daz"],
        ["00:56.600", "00:59.000", "Dyal nas 3mro yksik"],
        ["00:59.600", "01:01.300", "Hada llah"],
        ["01:01.400", "01:02.400", "Lallah"],
        ["01:02.600", "01:04.500", "Homa dehki lihom wana lla"],
        ["01:04.600", "01:07.100", "Ya denya chofi fiya ta la d3aw"],
        ["01:07.300", "01:09.300", "Fiya nti ghir d3ili"],
        ["01:09.500", "01:11.200", "W hada llah"],
        ["01:11.300", "01:12.000", "Lallah"],
        ["01:12.000", "01:14.100", "Homa dehki lihom wana lla"],
        ["01:14.100", "01:17.000", "Ya denya chofi fiya ta la d3aw"],
        ["01:17.100", "01:19.200", "Fiya nti ghir d3ili"],
        ["01:30.000", "01:32.300", "Mli mchiti bqaw tsawer ma kntch kanhmel"],
        ["01:32.700", "01:34.600", "Kansoni nsme3 allo flhedra kanhsel"],
        ["01:34.700", "01:37.300", "Kanzid nbe3ed kter wach nqed n3ich hsen"],
        ["01:37.400", "01:39.800", "Rebi ktebha liya"],
        ["01:40.000", "01:42.500", "Lli chftha ghir dwa chwya 3rftha kant semm"],
        ["01:42.700", "01:44.900", "Kanchof zhri lono safi mn b3id kiban 3sel"],
        ["01:45.000", "01:47.100", "Galoli doz dir sef fdenya ghathsel"],
        ["01:47.100", "01:49.400", "Rebi ktebha liya"],
        ["01:49.600", "01:52.500", "Wakha ga3 ydouzo sinin"],
        ["01:52.500", "01:55.800", "Tahaja ma ghatnesini"],
        ["01:55.800", "01:57.400", "Fli daz"],
        ["01:57.400", "02:00.000", "Dyal nas 3mro yksik"],
        ["02:00.000", "02:02.300", "W hada llah"],
        ["02:02.300", "02:03.350", "Lallah"],
        ["02:03.350", "02:05.250", "Homa dehki lihom wana lla"],
        ["02:05.250", "02:07.250", "Ya denya chofi fiya ta la d3aw"],
        ["02:07.250", "02:10.100", "Fiya nti ghir d3ili"],
        ["02:10.700", "02:12.500", "W hada llah"],
        ["02:12.500", "02:13.750", "Lallah"],
        ["02:13.750", "02:15.650", "Homa dehki lihom wana lla"],
        ["02:15.650", "02:18.150", "Ya denya chofi fiya ta la d3aw"],
        ["02:18.150", "02:20.500", "Fiya nti ghir d3ili"],
        ["02:20.800", "02:22.300", "W hada llah"],
        ["02:22.300", "02:23.450", "Lallah"],
        ["02:23.450", "02:25.650", "Homa dehki lihom wana lla"],
        ["02:25.650", "02:28.050", "Ya denya chofi fiya ta la d3aw"],
        ["02:28.050", "02:30.900", "Fiya nti ghir d3ili"],
        ["02:30.200", "02:32.700", "W hada llah"],
        ["02:32.700", "02:33.550", "Lallah"],
        ["02:33.550", "02:35.450", "Homa dehki lihom wana lla"],
        ["02:35.450", "02:38.450", "Ya denya chofi fiya ta la d3aw"],
        ["02:38.450", "02:40.300", "Fiya nti ghir d3ili"],
      ],
    },
     { title: 'MERRA FL3AM', subtitle: 'Lead Single', lead: true,
      youtube: 'https://www.youtube.com/watch?v=7zrOgfwRmDU',
      artwork: 'assets/images/still-mirrorball.jpg', artworkBy: "Naoufal Alazy",
      releaseDate: "14-05-2026", duration: '2:55', description: null, producedBy: "YVZID, Hakai & Bakr Chaibane", writtenBy: "YVZID", listen: [],
      // synced lyrics: [seconds, line]
      lyrics: [
        [9,"Bghina n9at3o lb7our"],[11,"Ymkn l3icha tzyan"],[13.5,"Chno makan mor sour"],[15,"Nrj3 nzour merra fl3am"],
        [19,"Mabghitch nkhlik lour"],[21,"Rak m3aya machi nkhlik ghir f soura"],[24,"Kayswloni mabghitch ngoul"],[26,"Bo7dha f 9albi mais khliha mstoura"],
        [29,"Jbt lik briya"],[31,"Saynt mad9itch bab"],[34,"Jahdi ay katba 7titha f 3atba"],[36,"t9rayha mn b3d"],
        [40,"La9riti soni liya"],[42,"Ta nmra ila nsiti chofi lta7t chwiya"],[44,"Aji nbdlo mdina w nasha l7zina"],[47,"W n7almo bjouj"],
        [50,"Ba9i tal daba majwbtich"],[52,"Ba3da wach f ydek nti"],[55,"Hna 3am 3la 3am"],[56,"Kanzid nban ghrib"],[57,"Wach n9tl lfnan w m3ak n3ich"],
        [60,"Jbt lik briya"],[62,"Saynt mad9itch bab"],[65,"Jahdi ay katba 7titha f 3atba"],[67,"t9rayha mn b3d"],
        [69,"Bghina n9at3o lb7our"],[72,"Ymkn l3icha tzyan"],[74,"Chno makan mor sour"],[76,"Nrj3 nzour merra fl3am"],
        [79,"Mabghitch nkhlik lour"],[81,"Rak m3aya machi ghir f soura"],[84,"Kayswloni mabghitch ngoul"],[86,"Bo7dha f 9albi mais khliha mstoura"],
        [99,"L7ouma bdat katkhwa"],[102,"Kantal Makayn ta 7ed"],[105,"F biti matbdl walo"],[107,"Ghir chi wrda tjrs to f terrasse dnb"],
        [110,"Safee ankhwi mdina"],[112,"Ta7ed mab9a kaychbh lina"],[115,"7alf an3icho hssen"],[117,"Wakha 3mri skhit b3icha 9dima"],
        [120,"Dkhalt blad jdida"],[122,"W ta7ed maswlni chkon nta"],[125,"Wla mafhmtch loghthom ghriba"],
        [127,"Mareaaa mareaaaa"],[130,"Ba9i anrj3 lik"],[132,"W njibk m3aya w tchof"],[135,"3lah ntlfo f tri9"],[137,"Mareaaa mareaaa"],
        [140,"Jbt lik briya"],[142,"Saynt mad9itch bab"],[146,"Jahdi ay katba 7titha f 3atba"],[148,"t9rayha mn b3d"],
        [150,"Bghina n9at3o lb7our"],[152,"Ymkn l3icha tzyan"],[155,"Chno makan mor sour"],[157,"Nrj3 nzour merra fl3am"],
        [160,"Mabghitch nkhlik lour"],[162,"Rak m3aya machi ghir f soura"],[165,"Kayswloni mabghitch ngoul"],[167,"Bo7dha f 9albi mais khliha mstoura"],
      ],
    },
    { title: 'GOUL LBHER', youtube: 'https://www.youtube.com/watch?v=sILKr-AzNPk', artwork: 'assets/images/Goul lbher cover.jpg', artworkBy: "Naoufal Alazy", releaseDate: "23-07-2026", duration: "3:47", description: null, producedBy: "YVZID, Hakai & Bakr Chaibane", writtenBy: "YVZID", mixedBy: "Anas Ynb",
masteredBy: "Anas Ynb", listen: [],
      // synced lyrics from gol_lbhar_lyrics_timestamps.txt: [start, end, line]
      lyrics: [
        ["00:04.000", "00:06.600", "Baqi ki wassini lil,"],
        ["00:06.600", "00:08.500", "mn nhar mchat ma hessit,"],
        ["00:10.000", "00:11.500", "3adi,"],
        ["00:11.500", "00:14.100", "mchiti w ghant3eza fik"],
        ["00:14.200", "00:16.900", "Wakha glt liha salina"],
        ["00:16.900", "00:19.100", "baqi tabe3ni khyalha"],
        ["00:19.300", "00:21.500", "Kifach n3ass hla lik ?"],
        ["00:21.500", "00:24.500", "Foqach kenti ghatfehmini ?"],
        ["00:24.700", "00:27.100", "3mrek ma knti bhali"],
        ["00:27.200", "00:29.100", "Bqa m3aya ghi khyalek"],
        ["00:40.200", "00:42.000", "Mkhebbi werda mor dehri,"],
        ["00:42.000", "00:44.200", "3eqli w qlbi 3liha ra kidarbo"],
        ["00:44.300", "00:47.000", "Kat3iyet f lfix w tswel finek"],
        ["00:47.200", "00:50.500", "Gatli ndoro l3alam glt liha 3fini"],
        ["00:50.600", "00:53.000", "Kanrtah ghi f mdinti"],
        ["00:53.100", "00:55.000", "Mora kedba kindir ntiq?"],
        ["00:55.100", "00:57.000", "Kanghenni bach kanhess,"],
        ["00:57.100", "01:00.100", "w nti katkhebbi qedam nass"],
        ["01:00.800", "01:03.800", "Gol lbher yzid y3emer,"],
        ["01:03.900", "01:06.200", "ghir yzid y3emer"],
        ["01:06.700", "01:10.000", "Qlbi ra kimot tal gheda w lmwaj ghatermih"],
        ["01:11.100", "01:14.500", "Gol lbher yzid y3emer,"],
        ["01:14.500", "01:16.800", "ghir yzid y3emer"],
        ["01:17.000", "01:20.500", "Qlbi ra kimot tal gheda w lmwaj ghatermih"],
        ["01:22.000", "01:24.100", "Nsiti lhaqiqa wakha dwiti bezaf"],
        ["01:24.100", "01:26.500", "Daba baghi ghi tiqar w lli mhito ystahel"],
        ["01:40.800", "01:28.400", "Ghayji lhriq w 3ellah seha trje3"],
        ["01:28.600", "01:31.500", "Baqi ma kandirch tiqa wakha cheftini m3ah"],
        ["01:32.200", "01:34.400", "Smitha mwchoma kighandir nsaha"],
        ["01:34.500", "01:37.400", "Wana qlbi fih diq ga3ma kaybghi bezaf"],
        ["01:37.500", "01:39.500", "Ghadi ftriq mennha wach baqi rjou3"],
        ["01:39.500", "01:42.000", "Telqat yеddi melli bqaw kine3to fina nass"],
        ["01:42.200", "01:44.400", "Katswelni kеnti fin"],
        ["01:44.500", "01:47.200", "Men nhar chekkiti safe c’était fini"],
        ["01:47.300", "01:49.200", "Imta lgmra ghatfa?"],
        ["01:49.200", "01:51.200", "Sbeght hit lbit bloun dfarek"],
        ["01:52.500", "01:54.800", "Kifach n3ass hla lik ?"],
        ["01:55.000", "01:57.100", "Mchiti w ghant3eza fik"],
        ["01:57.600", "02:00.200", "Wakha glt liha salina"],
        ["02:00.300", "02:02.000", "bqa m3aya ghir khyalha"],
        ["02:02.700", "02:05.300", "Gol lbher yzid y3emer,"],
        ["02:05.300", "02:08.300", "ghir yzid y3emer"],
        ["02:09.000", "02:12.500", "Qlbi ra kimot tal gheda w lmwaj ghatermih"],
        ["02:13.000", "02:16.500", "Gol lbher yzid y3emer,"],
        ["02:16.600", "02:18.900", "ghir yzid y3emer"],
        ["02:19.000", "02:22.400", "Qlbi ra kimot tal gheda w lmwaj ghatermih"],
        ["02:33.000", "02:36.400", "Dkhelti hiyati derti foda"],
        ["02:36.500", "02:38.300", "Gatli à jamais mais c’était faux"],
        ["02:38.400", "02:40.500", "Ma kanoch kibanoli tes défauts"],
        ["02:40.600", "02:43.900", "Daba fat lfout, makayn bass"],
        ["02:44.000", "02:46.000", "Dkhelti hiyati derti foda"],
        ["02:46.100", "02:48.400", "Gatli à jamais mais c’était faux"],
        ["02:48.500", "02:51.000", "Ma kanoch kibanoli tes défauts"],
        ["02:51.100", "02:53.600", "Daba fat lfout, makayn bass"],
        ["02:54.800", "02:57.700", "Gol lbher yzid y3emer,"],
        ["02:57.700", "03:00.100", "ghir yzid y3emer"],
        ["03:00.400", "03:04.000", "Qlbi ra kimot tal gheda w lmwaj ghatermih"],
        ["03:04.500", "03:07.700", "Gol lbher yzid y3emer,"],
        ["03:07.700", "03:10.700", "ghir yzid y3emer"],
        ["03:10.800", "03:14.500", "Qlbi ra kimot tal gheda w lmwaj ghatermih"],
      ],
    },
        { title: 'LHOUMA', youtube: 'https://www.youtube.com/watch?v=TalX4Mxj6-E', artwork: 'assets/images/Lhouma cover.jpg', artworkBy: "Naoufal Alazy", releaseDate: "10-09-2026", duration: "3:32", description: null, producedBy: "Oussama Jaboune", writtenBy: "YVZID", listen: [],
      // synced lyrics from gol_lbhar_lyrics_timestamps.txt: [start, end, line]
      lyrics: [
        ["00:22.100", "00:25.300", "Ankhrej mn lhoma w ndir l3aqa b3id,"],
        ["00:25.400", "00:27.900", "Hit lhouma ma dart walo 3la qbli"],
        ["00:28.000", "00:30.200", "Li dertihom hdak daba b3ad 3lik"],
        ["00:30.400", "00:33.000", "W ghir stylo li ki sme3ni fhad lil"],
        ["00:33.100", "00:35.500", "Nhar lfinal ghflouni w lbsouni 10"],
        ["00:35.600", "00:38.200", "W df3ouni f terrain nle3ebhom"],
        ["00:38.300", "00:40.100", "T3etelt bach nfeker flbenefice"],
        ["00:40.200", "00:43.200", "Daba qerrert ga3 les taches ghant3elemhom"],
        ["00:43.500", "00:45.500", "Ki qarnoni bihom wach darori case"],
        ["00:45.600", "00:48.000", "Wld bettana w lhemri kanban monegasque"],
        ["00:48.100", "00:50.900", "Kanbghi lhaja lghalia w kanbghi khlassi cash"],
        ["00:51.000", "00:53.400", "B dehka w labaqa d bourita"],
        ["00:53.500", "00:55.000", "Wach lkbda beeda baqa bon état"],
        ["00:55.100", "00:58.400", "Bghit nbi3ha w floussha nchri guitar"],
        ["00:58.500", "01:00.000", "Ma kanswel ftahed w dima nefs lkedba"],
        ["01:00.100", "01:03.000", "M3a jbedt n3iyet telephoni tar"],
        ["01:04.400", "01:07.500", "Fini les sentiments, katban fik quand tu mens"],
        ["01:07.700", "01:11.100", "Mohal ntbedel wakha nbedel lcontinent, aah"],
        ["01:14.500", "01:17.500", "Fini les sentiments, katban fik quand tu mens"],
        ["01:17.600", "01:21.200", "Mohal ntbedel wakha nbedel lcontinent, aah"],
        ["01:24.200", "01:27.000", "Golo lnassi bslama"],
        ["01:29.500", "01:34.500", "Hit baqi ghanrje3 mbeed 3liha ma reditch lbab"],
        ["01:34.600", "01:37.800", "Lhouma bslama"],
        ["01:39.800", "01:44.500", "Jrit fiha ghir lbareh l3mer tayer ma reditch lbal"],
        ["01:45.000", "01:46.100", "Ma tgolch lihom chno khessek"],
        ["01:46.100", "01:47.800", "Ghayhedro ga3ma yhenno fik"],
        ["01:47.800", "01:49.000", "Kolhom ghadi ydoro bik"],
        ["01:50.000", "01:52.500", "Kankreh sehd kanbghi tokyo w fheqi jat ghi nairobi"],
        ["01:52.500", "01:55.400", "W fddo lhmer yban lli khebba 3yobo btonobil"],
        ["01:55.500", "01:58.400", "Gheda lmout w m3aya ach andi, mn hadi chhal kanbni"],
        ["01:58.500", "02:00.600", "Ghir nta li 3ad chftini mn hadi chhal kanbri"],
        ["02:00.900", "02:03.000", "Wakha kadhek lik denya hacha wach katbghik"],
        ["02:03.200", "02:05.400", "3chiri kaytfi friya w ych3el l3afya ftriq"],
        ["02:05.500", "02:09.200", "Hafed triq labyrinth ana li bghit nbqa talef"],
        ["02:10.500", "02:14.200", "Katji lmima tfiyqni mli kangol hlami matou"],
        ["02:15.200", "02:18.200", "Fini les sentiments, katban fik quand tu mens"],
        ["02:18.500", "01:22.800", "Mohal ntbedel wakha nbedel lcontinent, aah"],
        ["02:25.300", "02:28.100", "Fini les sentiments, katban fik quand tu mens"],
        ["02:28.600", "02:31.200", "Mohal ntbedel wakha nbedel lcontinent, aah"],
        ["02:35.000", "02:38.000", "Golo lnassi bslama"],
        ["02:40.200", "02:45.300", "Hit baqi ghanrje3 mbeed 3liha ma reditch lbab"],
        ["02:45.500", "02:48.300", "Lhouma bslama"],
        ["02:50.200", "02:55.500", "Jrit fiha ghir lbareh l3mer tayer ma reditch lbal"],
        ["02:55.700", "02:58.000", "Golo lnassi bslama"],
        ["03:00.100", "03:05.300", "Hit baqi ghanrje3 mbeed 3liha ma reditch lbab"],
        ["03:5.500", "03:08.300", "Lhouma bslama"],
        ["03:10.600", "03:15.500", "Jrit fiha ghir lbareh l3mer tayer ma reditch lbal"],
      ],
    },
  ],

  /* ── CHAPTER II · MAREA (the album) ─────────────────────────────
     14 slots, shown as TRACK 01 … TRACK 14 until you fill them in.
     Fill a slot: title · youtube (full URL) · artwork · subtitle · duration
                  (optional: releaseDate · description · producedBy · writtenBy · listen)
     mood is only the look of the sea while the slot is selected:
       crest · shore · sepia · violet · still · ember · sage · swell · night · harbor          */
  marea: {
    title: 'MAREA WORLD',
    cover: 'assets/images/marea-cover.jpg',
    coverSmall: 'assets/images/marea-cover-600.webp',
    coverAlt: 'MAREA WORLD artwork: a gold crest of two winged horses around a sun face, on burgundy',
    tracks: [
      { title: null, youtube: null, artwork: null, subtitle: null, duration: null, mood: 'crest' },   // TRACK 01
      { title: null, youtube: null, artwork: null, subtitle: null, duration: null, mood: 'shore' },   // TRACK 02
      { title: null, youtube: null, artwork: null, subtitle: null, duration: null, mood: 'sepia' },   // TRACK 03
      { title: null, youtube: null, artwork: null, subtitle: null, duration: null, mood: 'violet' },  // TRACK 04
      { title: null, youtube: null, artwork: null, subtitle: null, duration: null, mood: 'still' },   // TRACK 05
      { title: null, youtube: null, artwork: null, subtitle: null, duration: null, mood: 'ember' },   // TRACK 06
      { title: null, youtube: null, artwork: null, subtitle: null, duration: null, mood: 'sage' },    // TRACK 07
      { title: null, youtube: null, artwork: null, subtitle: null, duration: null, mood: 'swell' },   // TRACK 08
      { title: null, youtube: null, artwork: null, subtitle: null, duration: null, mood: 'crest' },   // TRACK 09
      { title: null, youtube: null, artwork: null, subtitle: null, duration: null, mood: 'shore' },   // TRACK 10
      { title: null, youtube: null, artwork: null, subtitle: null, duration: null, mood: 'sepia' },   // TRACK 11
      { title: null, youtube: null, artwork: null, subtitle: null, duration: null, mood: 'violet' },  // TRACK 12
      { title: null, youtube: null, artwork: null, subtitle: null, duration: null, mood: 'still' },   // TRACK 13
      { title: null, youtube: null, artwork: null, subtitle: null, duration: null, mood: 'ember' },   // TRACK 14
    ],
    /* Teaser lines from the earlier 8-track version, kept here for reference (not displayed):
       'where the ocean meets the shore' · 'a conversation with the past' · 'midnight in a foreign city'
       'the weight of an unspoken word' · 'dancing alone in the ruins' · 'home is not a place'
       'the tide always comes back'                                                              */
  },

  /* ── CHAPTER III · THE PEOPLE BEHIND MAREA ──────────────────────
     Add a person inside the `people: []` of their role:
       { name: 'Full Name', image: 'assets/images/people/name.jpg', note: 'What they did on MAREA.',
         links: [{ label: 'Instagram', url: 'https://instagram.com/…' }] }
     Only `name` is required. Someone with several roles can appear in several groups;
     their detail panel lists every role automatically.
     Empty roles are hidden when showPlaceholders is false.                               */
  credits: [
    { role: 'Artist', people: [
      { name: 'YVZID', realName: 'Elyazid Bensada', image: 'assets/images/yvzid-portrait.webp',
        note: 'A singer-songwriter whose sound fuses rap, urban pop, and jazz into something distinctly his own.',
        links: [
          { label: 'Instagram',   url: 'https://www.instagram.com/yvzidd/' },
          { label: 'YouTube',     url: 'https://www.youtube.com/c/yvzid' },
          { label: 'Apple Music', url: 'https://music.apple.com/us/artist/yvzid/1519889365' },
          { label: 'Deezer',      url: 'https://www.deezer.com/us/artist/127163922' },
        ] },
    ] },
    { role: 'Creative Direction / Art Direction', people: [] },
    { role: 'Cover Artwork / Graphic Design',     people: [] },
    { role: 'Music Producers / Beatmakers',       people: [] },
    { role: 'Songwriters / Composers',            people: [] },
    { role: 'Recording Engineers',                people: [] },
    { role: 'Mixing & Mastering Engineers',       people: [] },
    { role: 'Photography',                        people: [] },
    { role: 'Videography / Film Direction',       people: [] },
    { role: 'Editing / Motion Design',            people: [] },
    { role: 'Other Contributors',                 people: [] },
  ],
};
