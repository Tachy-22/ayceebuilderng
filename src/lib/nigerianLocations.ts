// Nigerian states and their major cities/towns
export interface StateData {
  name: string;
  cities: string[];
}

export const nigerianStates: StateData[] = [
  {
    name: "Abia",
    cities: [
      "Aba", "Umuahia", "Arochukwu", "Bende", "Ikwuano", "Isiala Ngwa North", 
      "Isiala Ngwa South", "Isuikwuato", "Obi Ngwa", "Ohafia", "Osisioma", 
      "Ugwunagbo", "Ukwa East", "Ukwa West", "Umu Nneochi"
    ]
  },
  {
    name: "Adamawa",
    cities: [
      "Yola", "Mubi", "Numan", "Jimeta", "Ganye", "Gombi", "Hong", "Jada", 
      "Lamurde", "Madagali", "Maiha", "Mayo Belwa", "Michika", "Mubi North", 
      "Mubi South", "Song", "Shelleng", "Toungo", "Yola North", "Yola South"
    ]
  },
  {
    name: "Akwa Ibom",
    cities: [
      "Uyo", "Ikot Ekpene", "Eket", "Oron", "Abak", "Eastern Obolo", "Eket", 
      "Esit Eket", "Essien Udim", "Etim Ekpo", "Etinan", "Ibeno", "Ibesikpo Asutan", 
      "Ibiono Ibom", "Ika", "Ikono", "Ikot Abasi", "Ini", "Itu", "Mbo", "Mkpat Enin", 
      "Nsit Atai", "Nsit Ibom", "Nsit Ubium", "Obot Akara", "Okobo", "Onna", 
      "Oruk Anam", "Udung Uko", "Ukanafun", "Uruan", "Urue-Offong/Oruko"
    ]
  },
  {
    name: "Anambra",
    cities: [
      "Awka", "Onitsha", "Nnewi", "Ekwulobia", "Aguleri", "Ajalli", "Alor", 
      "Nanka", "Adazi Nnukwu", "Agulu", "Akpo", "Anam", "Anaocha", "Anambra East", 
      "Anambra West", "Anaocha", "Awka North", "Awka South", "Ayamelum", 
      "Dunukofia", "Ekwusigo", "Idemili North", "Idemili South", "Ihiala", 
      "Njikoka", "Nnewi North", "Nnewi South", "Ogbaru", "Onitsha North", 
      "Onitsha South", "Orumba North", "Orumba South", "Oyi"
    ]
  },
  {
    name: "Bauchi",
    cities: [
      "Bauchi", "Azare", "Misau", "Jama'are", "Katagum", "Ningi", "Warji", 
      "Ganjuwa", "Kirfi", "Alkaleri", "Bogoro", "Damban", "Darazo", "Dass", 
      "Gamawa", "Giade", "Itas/Gadau", "Jama'are", "Tafawa Balewa", "Toro", "Zaki"
    ]
  },
  {
    name: "Bayelsa",
    cities: [
      "Yenagoa", "Brass", "Ekeremor", "Kolokuma/Opokuma", "Nembe", 
      "Ogbia", "Sagbama", "Southern Ijaw"
    ]
  },
  {
    name: "Benue",
    cities: [
      "Makurdi", "Gboko", "Katsina-Ala", "Vandeikya", "Adoka", "Agatu", 
      "Apa", "Ardo-Kola", "Buruku", "Gboko", "Guma", "Gwer East", "Gwer West", 
      "Katsina-Ala", "Konshisha", "Kwande", "Logo", "Obi", "Ogbadibo", 
      "Ohimini", "Oju", "Okpokwu", "Oturkpo", "Tarka", "Ukum", "Ushongo"
    ]
  },
  {
    name: "Borno",
    cities: [
      "Maiduguri", "Biu", "Bama", "Konduga", "Jere", "Mafa", "Dikwa", 
      "Askira/Uba", "Bayo", "Chibok", "Damboa", "Gwoza", "Hawul", "Kaga", 
      "Kala/Balge", "Kukawa", "Kwaya Kusar", "Magumeri", "Marte", "Mobbar", 
      "Monguno", "Ngala", "Nganzai", "Shani"
    ]
  },
  {
    name: "Cross River",
    cities: [
      "Calabar", "Ugep", "Ogoja", "Ikom", "Obudu", "Akpabuyo", "Bakassi", 
      "Bekwarra", "Biase", "Boki", "Calabar Municipal", "Calabar South", 
      "Etung", "Ikom", "Obanliku", "Obubra", "Obudu", "Odukpani", "Ogoja", 
      "Yakuur", "Yala"
    ]
  },
  {
    name: "Delta",
    cities: [
      "Asaba", "Warri", "Sapele", "Ughelli", "Agbor", "Abraka", "Okpanam", 
      "Aniocha North", "Aniocha South", "Bomadi", "Burutu", "Ethiope East", 
      "Ethiope West", "Ika North East", "Ika South", "Isoko North", "Isoko South", 
      "Ndokwa East", "Ndokwa West", "Okpe", "Oshimili North", "Oshimili South", 
      "Patani", "Sapele", "Udu", "Ughelli North", "Ughelli South", 
      "Ukwuani", "Uvwie", "Warri North", "Warri South", "Warri South West"
    ]
  },
  {
    name: "Ebonyi",
    cities: [
      "Abakaliki", "Afikpo", "Onueke", "Ezza", "Ikwo", "Ishielu", "Ivo", 
      "Izzi", "Ohaozara", "Ohaukwu", "Onicha"
    ]
  },
  {
    name: "Edo",
    cities: [
      "Benin City", "Auchi", "Ekpoma", "Uromi", "Ubiaja", "Akoko-Edo", 
      "Egor", "Esan Central", "Esan North-East", "Esan South-East", 
      "Esan West", "Etsako Central", "Etsako East", "Etsako West", 
      "Igueben", "Ikpoba Okha", "Oredo", "Orhionmwon", "Ovia North-East", 
      "Ovia South-West", "Owan East", "Owan West", "Uhunmwonde"
    ]
  },
  {
    name: "Ekiti",
    cities: [
      "Ado Ekiti", "Ikere", "Oye", "Efon", "Ijero", "Ise/Orun", "Emure", 
      "Gbonyin", "Ekiti East", "Ekiti South-West", "Ekiti West", "Ido Osi", 
      "Ilejemeje", "Irepodun/Ifelodun", "Moba"
    ]
  },
  {
    name: "Enugu",
    cities: [
      "Enugu", "Nsukka", "Oji River", "Udenu", "Udi", "Aninri", "Awgu", 
      "Enugu East", "Enugu North", "Enugu South", "Ezeagu", "Igbo Etiti", 
      "Igbo Eze North", "Igbo Eze South", "Isi Uzo", "Nkanu East", 
      "Nkanu West", "Nsukka", "Oji River", "Udenu", "Udi", "Uzo Uwani"
    ]
  },
  {
    name: "Federal Capital Territory",
    cities: [
      "Abuja", "Gwagwalada", "Kuje", "Bwari", "Kwali", "Municipal Area Council",
      "Garki", "Wuse", "Maitama", "Asokoro", "Gwarinpa", "Kubwa", "Nyanya", 
      "Karu", "Lugbe", "Jabi", "Utako", "Katampe", "Lokogoma", "Galadimawa",
      "Gudu", "Apo", "Durumi", "Wuye", "Dakwo", "Gaduwa", "Idu", "Mpape",
      "Karmo", "Life Camp", "Guzape", "Jikwoyi", "Jahi", "Kabusa", "Kafe",
      "Kaura", "Ketti", "Koroduma", "Kpaduma", "Kuchigoro", "Kuchiko", 
      "Kuruduma", "Kwali", "Leleyi", "Lokoja", "Mabushi", "Malumfashi",
      "Nasarawa", "Orozo", "Pegi", "Pyakassa", "Sabon Lugbe", "Suleja",
      "Tasha", "Tunfure", "Tunga Maje", "Wumba", "Zuba", "Aco Estate",
      "Airport Road", "Berger", "Central Business District", "Dei-Dei",
      "Gwagwa", "Idu Industrial", "Karishi", "Kado", "Kagarko", "Kapwa",
      "Karkara", "Karmo Extension", "Katampe Extension", "Kpaduma Extension",
      "Kuje Extension", "Kwaita", "Kwata", "Kyami", "Lanto", "Lugbe Extension",
      "Mararaba", "Masaka", "New Karu", "Old Karu", "Passo", "Phase 1",
      "Phase 2", "Phase 3", "Phase 4", "Piwoyi", "Quarters", "Saburi",
      "Sun City", "Trade More", "Village", "Wumba Extension", "Zone 1",
      "Zone 2", "Zone 3", "Zone 4", "Zone 5", "Zone 6", "Zone 7", "Zone 8"
    ]
  },
  {
    name: "Gombe",
    cities: [
      "Gombe", "Billiri", "Kaltungo", "Nafada", "Akko", "Balanga", 
      "Dukku", "Funakaye", "Kwami", "Shongom", "Yamaltu/Deba"
    ]
  },
  {
    name: "Imo",
    cities: [
      "Owerri", "Orlu", "Okigwe", "Mbaise", "Ahiazu Mbaise", "Ehime Mbano", 
      "Ezinihitte", "Ideato North", "Ideato South", "Ihitte/Uboma", "Ikeduru", 
      "Isiala Mbano", "Isu", "Mbaitoli", "Ngor Okpala", "Njaba", "Nkwerre", 
      "Nwangele", "Obowo", "Oguta", "Ohaji/Egbema", "Okigwe", "Onuimo", 
      "Orlu", "Orsu", "Oru East", "Oru West", "Owerri Municipal", 
      "Owerri North", "Owerri West"
    ]
  },
  {
    name: "Jigawa",
    cities: [
      "Dutse", "Hadejia", "Kazaure", "Gumel", "Ringim", "Birnin Kudu", 
      "Auyo", "Babura", "Biriniwa", "Buji", "Garki", "Gagarawa", "Guri", 
      "Gwiwa", "Jahun", "Kafin Hausa", "Kaugama", "Kirikasamma", "Kiyawa", 
      "Maigatari", "Malam Madori", "Miga", "Roni", "Sule Tankarkar", 
      "Taura", "Yankwashi"
    ]
  },
  {
    name: "Kaduna",
    cities: [
      "Kaduna", "Zaria", "Kafanchan", "Kagoro", "Zonkwa", "Birnin Gwari", 
      "Chikun", "Giwa", "Igabi", "Ikara", "Jaba", "Jema'a", "Kachia", 
      "Kaduna North", "Kaduna South", "Kagarko", "Kajuru", "Kaura", 
      "Kauru", "Kubau", "Kudan", "Lere", "Makarfi", "Sabon Gari", 
      "Sanga", "Soba", "Zangon Kataf", "Zaria"
    ]
  },
  {
    name: "Kano",
    cities: [
      "Kano", "Wudil", "Gwarzo", "Kura", "Madobi", "Karaye", "Rogo", 
      "Bagwai", "Gezawa", "Gabasawa", "Albasu", "Ajingi", "Bebeji", 
      "Bichi", "Bunkure", "Dala", "Dambatta", "Dawakin Kudu", 
      "Dawakin Tofa", "Doguwa", "Fagge", "Garun Mallam", "Gaya", 
      "Gwale", "Kabo", "Kano Municipal", "Kibiya", "Kiru", "Kumbotso", 
      "Kunchi", "Kura", "Madobi", "Makoda", "Minjibir", "Nasarawa", 
      "Rano", "Rimin Gado", "Shanono", "Sumaila", "Takai", "Tarauni", 
      "Tofa", "Tsanyawa", "Tudun Wada", "Ungogo", "Warawa", "Wudil"
    ]
  },
  {
    name: "Katsina",
    cities: [
      "Katsina", "Daura", "Funtua", "Malumfashi", "Kankia", "Dandume", 
      "Bakori", "Batagarawa", "Batsari", "Baure", "Bindawa", "Charanchi", 
      "Dan Musa", "Danko/Wasagu", "Danja", "Daura", "Dutsi", "Dutsin Ma", 
      "Faskari", "Ingawa", "Jibia", "Kafur", "Kaita", "Kankara", 
      "Kankia", "Katsina", "Kurfi", "Kusada", "Mai'Adua", "Malumfashi", 
      "Mani", "Mashi", "Matazu", "Musawa", "Rimi", "Sabuwa", "Safana", 
      "Sandamu", "Zango"
    ]
  },
  {
    name: "Kebbi",
    cities: [
      "Birnin Kebbi", "Argungu", "Yauri", "Zuru", "Bagudo", "Aleiro", 
      "Augie", "Dandi", "Fakai", "Gwandu", "Jega", "Kalgo", "Koko/Besse", 
      "Maiyama", "Ngaski", "Sakaba", "Shanga", "Suru", "Wasagu/Danko"
    ]
  },
  {
    name: "Kogi",
    cities: [
      "Lokoja", "Okene", "Idah", "Kabba", "Anyigba", "Adavi", "Ajaokuta", 
      "Ankpa", "Bassa", "Dekina", "Ibaji", "Igalamela Odolu", "Ijumu", 
      "Kabba/Bunu", "Kogi", "Lokoja", "Mopa Muro", "Ofu", "Ogori/Magongo", 
      "Okehi", "Okene", "Olamaboro", "Omala", "Yagba East", "Yagba West"
    ]
  },
  {
    name: "Kwara",
    cities: [
      "Ilorin", "Offa", "Omu-Aran", "Jebba", "Lafiagi", "Asa", "Baruten", 
      "Edu", "Ekiti", "Ifelodun", "Ilorin East", "Ilorin South", 
      "Ilorin West", "Irepodun", "Isin", "Kaiama", "Moro", "Oyun", 
      "Pategi"
    ]
  },
  {
    name: "Lagos",
    cities: [
      "Ikeja", "Lagos Island", "Victoria Island", "Ikoyi", "Surulere", 
      "Yaba", "Mushin", "Alimosho", "Ajeromi-Ifelodun", "Kosofe", 
      "Oshodi-Isolo", "Agege", "Ifako-Ijaiye", "Somolu", "Amuwo-Odofin", 
      "Lagos Mainland", "Apapa", "Eti-Osa", "Badagry", "Ikorodu", 
      "Epe", "Lekki", "Ajah", "Festac", "Mile 2", "Ojo", "Alagbado",
      "Egbeda", "Idimu", "Ikotun", "Isheri", "Ketu", "Magodo", "Maryland",
      "Ojodu", "Ogba", "Omole", "Berger", "Ojota", "Gbagada", "Anthony",
      "Palmgroove", "Onipanu", "Fadeyi", "Jibowu", "Sabo", "Akoka",
      "Bariga", "Shomolu", "Pedro", "Ladi-Lak", "Oyingbo", "Ebute Metta",
      "Herbert Macaulay", "Iddo", "Otto", "Olodi", "Apongbon", "Broad Street",
      "CMS", "Tinubu", "Marina", "Obalende", "Iganmu", "Orile", "Ijora",
      "Costain", "National Theatre", "Alaba", "Mile 12", "Owode", "Kara",
      "Ishaga", "Dopemu", "Akowonjo", "Shasha", "Command", "Meiran",
      "Abule Egba", "Iyana Ipaja", "Ayobo", "Ipaja", "Gowon Estate",
      "Idimu Estate", "Powerline", "Ejigbo", "Isolo", "Okota", "Bucknor",
      "Mafoluku", "Airport Road", "International Airport", "Oshodi",
      "Bolade", "Ilasamaja", "Itire", "Lawanson", "Iponri", "Shitta",
      "Bode Thomas", "Adeniran Ogunsanya", "Enitan", "Adelabu", "Eric Moore",
      "Western Avenue", "Funsho Williams", "Ikorodu Road", "Awolowo Road",
      "Allen Avenue", "Opebi", "Oregun", "Alausa", "Toyin", "Adeniyi Jones",
      "Agidingbi", "Omole Phase 1", "Omole Phase 2", "Magodo Phase 1",
      "Magodo Phase 2", "GRA Ikeja", "Computer Village", "Ikeja Along",
      "Ogudu", "Alapere", "Ketu Mile 12", "Ojuelegba", "Itire-Ikate",
      "Yaba Left", "Yaba Right", "Sabo Yaba", "Akoka Estate", "Unilag",
      "Mainland Hospital", "National Stadium", "Tafawa Balewa Square",
      "Race Course", "Adeniji Adele", "Campos", "Kakawa", "Simpson",
      "Bamgbose", "Igbosere", "Ereko", "Olowogbowo", "Martins", "Balogun",
      "Idumota", "Oke Arin", "Lagos Island South", "Iganmu Estate",
      "Liverpool", "Denton", "Kirikiri", "Boundary", "Amuwo", "Satellite",
      "Trade Fair", "Aspamda", "Alaba Market", "Ojo Cantonment", "Iba",
      "Iba Estate", "Igando", "Igando Estate", "Ikotun Estate", "Egbe",
      "Powerline Estate", "Iyana Oba", "Isashi", "Okokomaiko", "Agboju",
      "Kirikiri Town", "Olodi Apapa", "Tincan", "Wharf", "Creek Road",
      "Point Road", "Burma Road", "Warehouse Road", "Commercial Road",
      "Apapa GRA", "Iganmu GRA", "Iponri Estate", "Surulere Estate",
      "Adeniran Ogunsanya Estate", "Aguda", "Kilo", "Masha", "Onike"
    ]
  },
  {
    name: "Nasarawa",
    cities: [
      "Lafia", "Keffi", "Akwanga", "Nasarawa Egon", "Doma", "Awe", 
      "Karu", "Keana", "Kokona", "Nasarawa", "Obi", "Toto", "Wamba"
    ]
  },
  {
    name: "Niger",
    cities: [
      "Minna", "Bida", "Kontagora", "Suleja", "New Bussa", "Agaie", 
      "Agwara", "Bida", "Borgu", "Bosso", "Chanchaga", "Edati", 
      "Gbako", "Gurara", "Katcha", "Kontagora", "Lapai", "Lavun", 
      "Magama", "Mariga", "Mashegu", "Mokwa", "Muya", "Paikoro", 
      "Rafi", "Rijau", "Shiroro", "Suleja", "Tafa", "Wushishi"
    ]
  },
  {
    name: "Ogun",
    cities: [
      "Abeokuta", "Sagamu", "Ijebu Ode", "Ota", "Ilaro", "Abeokuta North", 
      "Abeokuta South", "Ado-Odo/Ota", "Egbado North", "Egbado South", 
      "Ewekoro", "Ifo", "Ijebu East", "Ijebu North", "Ijebu North East", 
      "Ijebu Ode", "Ikenne", "Imeko Afon", "Ipokia", "Obafemi Owode", 
      "Odeda", "Odogbolu", "Ogun Waterside", "Remo North", "Shagamu",
      "Sango", "Agbado", "Akute", "Lambe", "Ajuwon", "Berger", "Ojodu",
      "Isheri", "Magboro", "Arepo", "Redemption Camp", "Mowe", "Ibafo",
      "Warewa", "Obafemi Owode", "Shagamu Road", "Siun", "Fidiwo", "Asero",
      "Oke Lantoro", "Iberekodo", "Ita Oshin", "Lafenwa", "Obantoko", 
      "Rounder", "Totoro", "Quarry Road", "Sapon", "Kuto", "Ake", "Igbore",
      "Ijaye", "Adigbe", "Itoku", "Iyana Mortuary", "Adatan", "Brewery",
      "Ayetoro", "Papalanto", "Wasimi", "Owode", "Itori", "Ewekoro",
      "Ifo Town", "Ishaga", "Agbara", "Lusada", "Toll Gate", "Canaan Land",
      "Ijebu Igbo", "Ago Iwoye", "Ilaporu", "Odogbolu", "Ogbere", "Ijebu Itele",
      "Epe Road", "Itokin Road", "Imagbon", "Ijebu Ife", "Awa", "Odeda",
      "Arigbajo", "Olodo", "Wasimi", "Papalanto", "Itori", "Ewekoro",
      "Pakoto", "Ilaro", "Ayetoro", "Ajilete", "Igbogila", "Sawonjo",
      "Owode Egba", "Obafemi Owode", "Kajola", "Akiode", "Agbado Crossing",
      "Sango Ota", "Joju", "Itele", "Ayobo", "Iyana Coker", "Dalemo",
      "Iyana Iyesi", "Winners Chapel", "Covenant University", "Bells University",
      "RCCG Camp", "Lagos Ibadan Expressway", "Ibadan Road", "Lagos Road",
      "Sagamu Interchange", "Sagamu Siun", "Simawa", "Sagamu Remo",
      "Makun City", "Ogijo", "Ikorodu Road", "Sagamu Road Extension",
      "Remo", "Iperu", "Ikenne Remo", "Ogere", "Ilishan Remo", "Ipara",
      "Isara", "Odogbolu Road", "Ijebu Waterside", "Abigi", "Ayila"
    ]
  },
  {
    name: "Ondo",
    cities: [
      "Akure", "Ondo", "Owo", "Ikare", "Okitipupa", "Akoko North-East", 
      "Akoko North-West", "Akoko South-East", "Akoko South-West", 
      "Akure North", "Akure South", "Ese Odo", "Idanre", "Ifedore", 
      "Ilaje", "Ile Oluji/Okeigbo", "Irele", "Odigbo", "Okitipupa", 
      "Ondo East", "Ondo West", "Ose", "Owo"
    ]
  },
  {
    name: "Osun",
    cities: [
      "Osogbo", "Ile-Ife", "Ilesa", "Ede", "Iwo", "Ejigbo", "Aiyedaade", 
      "Aiyedire", "Atakunmosa East", "Atakunmosa West", "Boluwaduro", 
      "Boripe", "Ede North", "Ede South", "Egbedore", "Ejigbo", 
      "Ife Central", "Ife East", "Ife North", "Ife South", "Ifedayo", 
      "Ifelodun", "Ila", "Ilesa East", "Ilesa West", "Irepodun", 
      "Irewole", "Isokan", "Iwo", "Obokun", "Odo Otin", "Ola Oluwa", 
      "Olorunda", "Oriade", "Orolu", "Osogbo",
      "Oke Baale", "Oja Oba", "Old Garage", "Station Road", "Oke Fia",
      "Asubiaro", "Oke Ayepe", "Lameco", "Jaleyemi", "Igbonna", "Alekunwodo",
      "Oke Oniti", "Oja Titun", "Sekona", "Ring Road", "MDS", "Alalubosa",
      "Okinni", "Oke Onigbedu", "Isale Osun", "Oba Adesoji", "Oke Bode",
      "Fagbewesa", "Oke Gada", "Owode", "Powerline", "Ayetoro", "Ilobu",
      "Ofatedo", "Kajola", "Apomu", "Gbongan", "Ikire", "Ikirun", 
      "Inisa", "Okuku", "Ila Orangun", "Ora Igbomina", "Oke Ila", "Rore",
      "Arandun", "Isundunrin", "Oyan", "Eko Ende", "Ipetu Ijesa", "Ijebu Jesa",
      "Erin Ijesa", "Iloko Ijesa", "Ibokun", "Esa Oke", "Esa Odo", "Iperindo",
      "Ipole Ijesa", "Erinmo", "Iwaraja", "Dagbolu", "Ifewara", "Iwara",
      "Oke Osun", "Oke Imesi", "Effon Alaiye", "Ilotin", "Ijeda", "Ijesha Isu",
      "Itagunmodi", "Odo Ijesa", "Iwara Ijesa", "Ilahun", "Oke Ako",
      "Modakeke", "Yakoyo", "Origbo", "Famia", "Toro", "Ifetedo", "Mayfair",
      "Asipa", "Parakin", "OAU", "Obafemi Awolowo University", "Ajebandele",
      "Opa", "Moore", "Lagere", "Iremo", "Alapere", "Ile Ife Central",
      "Sabo", "Eleyele", "Akarabata", "Agric Olodo", "Moremi", "Oduduwa",
      "Polytechnic Road", "Wesley Guild", "State Hospital", "Lagere",
      "OAUTHC", "Teaching Hospital", "Catering Rest House", "Mayfair",
      "Fajuyi", "Urban Area", "Ibadan Road", "Ilesa Road", "Oshogbo Road",
      "Ring Road", "Ondo Road", "Stadium Road", "Post Office"
    ]
  },
  {
    name: "Oyo",
    cities: [
      "Ibadan", "Ogbomoso", "Oyo", "Iseyin", "Saki", "Kishi", "Shaki", 
      "Afijio", "Akinyele", "Atiba", "Atisbo", "Egbeda", "Ibadan North", 
      "Ibadan North-East", "Ibadan North-West", "Ibadan South-East", 
      "Ibadan South-West", "Ibarapa Central", "Ibarapa East", 
      "Ibarapa North", "Ido", "Irepo", "Iseyin", "Itesiwaju", "Iwajowa", 
      "Kajola", "Lagelu", "Ogbomoso North", "Ogbomoso South", "Ogo Oluwa", 
      "Olorunsogo", "Oluyole", "Ona Ara", "Orelope", "Ori Ire", 
      "Oyo East", "Oyo West", "Saki East", "Saki West", "Surulere",
      "Bodija", "UI", "Agodi", "Jericho", "Ring Road", "Dugbe", "Challenge",
      "Mokola", "Sango", "Ojoo", "Moniya", "Akinyele", "New Garage", "Gate",
      "Poly Ibadan", "Polytechnic Ibadan", "Soka", "Ijokodo", "Apata",
      "Ologuneru", "Eleyele", "Ashi", "Bodija Market", "Lebanon", "Samonda",
      "Ajibode", "Apete", "Awotan", "Oluyole Estate", "Kolapo Ishola",
      "Adeoyo", "Ringroad", "Dugbe Market", "Gbagi", "Bere", "Oje",
      "Foko", "Inalende", "Orita Challenge", "Orita Mefa", "Orita Basorun",
      "Basorun", "Akobo", "Lalupon", "Olorunda Abaa", "Omi Adio", "Toll Gate",
      "Ibadan Lagos Expressway", "Ojurin", "Iyana Church", "Iwo Road",
      "Academy", "Felele", "Ologuneru", "Elebu", "Akala Express", "New Ife Road",
      "Old Ife Road", "Adegbayi", "Alakia", "Coca Cola", "Testing Ground",
      "Orogun", "Ajia", "Laniba", "Oremeji", "Odo Ona", "Kilo", "Queen Elizabeth",
      "Agbowo", "Bodija Estate", "Awolowo Avenue", "University of Ibadan",
      "Trenchard Hall", "Kuti Hall", "Tedder Hall", "Sultan Bello", "Obafemi Awolowo",
      "Queen Elizabeth Road", "Ikolaba", "Molete", "Oke Ado", "Oke Bola",
      "Oke Itunu", "Oke Padre", "Aremo", "Agugu", "Oke Ayo", "Onireke",
      "Odinjo", "Olorunsogo", "Olopomerin", "Olorunsogo Estate", "Aperin",
      "Orogun", "Oke Ado", "Adeoyo Hospital", "State Hospital Ring Road",
      "UCH", "University College Hospital", "Adeoyo State Hospital", "Mollete General Hospital",
      "Ogbomoso Town", "Caretaker", "Sabo Ogbomoso", "Owode Ogbomoso", "Aguodo",
      "Masifa", "Ogbomoso South", "Ogbomoso North", "LAUTECH", "Ogbomoso Polytechnic",
      "Baptist Medical Centre", "Bowen University Teaching Hospital", "Ogbomoso Main Market",
      "Oyo Town", "Akesan Market", "Aafin", "Durbar", "Oba Palace", "Isokun",
      "Oyo State Secretariat", "Atiba Local Government", "Atiba University",
      "Awe", "Jobele", "Kosobo", "Fiditi", "Igbo Ora", "Eruwa", "Lanlate",
      "Igboho", "Kisi", "Iwere Ile", "Sepeteri", "Tede", "Ago Are", "Ilero"
    ]
  },
  {
    name: "Plateau",
    cities: [
      "Jos", "Bukuru", "Shendam", "Pankshin", "Barkin Ladi", "Bassa", 
      "Bokkos", "Jos East", "Jos North", "Jos South", "Kanam", 
      "Kanke", "Langtang North", "Langtang South", "Mangu", "Mikang", 
      "Qua'an Pan", "Riyom", "Wase"
    ]
  },
  {
    name: "Rivers",
    cities: [
      "Port Harcourt", "Obio-Akpor", "Okrika", "Ogu–Bolo", "Eleme", 
      "Tai", "Gokana", "Khana", "Oyigbo", "Opobo–Nkoro", "Andoni", 
      "Bonny", "Degema", "Asari-Toru", "Akuku-Toru", "Abua–Odual", 
      "Ahoada West", "Ahoada East", "Ogba–Egbema–Ndoni", "Emohua", 
      "Ikwerre", "Etche", "Omuma"
    ]
  },
  {
    name: "Sokoto",
    cities: [
      "Sokoto", "Tambuwal", "Binji", "Bodinga", "Dange Shuni", "Gada", 
      "Goronyo", "Gudu", "Gwadabawa", "Illela", "Isa", "Kebbe", 
      "Kware", "Rabah", "Sabon Birni", "Shagari", "Silame", "Tureta", 
      "Wamako", "Wurno", "Yabo"
    ]
  },
  {
    name: "Taraba",
    cities: [
      "Jalingo", "Wukari", "Bali", "Gembu", "Serti", "Ardo Kola", 
      "Bali", "Donga", "Gashaka", "Gassol", "Ibi", "Jalingo", 
      "Karim Lamido", "Kurmi", "Lau", "Sardauna", "Takum", 
      "Ussa", "Wukari", "Yorro", "Zing"
    ]
  },
  {
    name: "Yobe",
    cities: [
      "Damaturu", "Gashua", "Nguru", "Potiskum", "Bade", "Bursari", 
      "Fika", "Fune", "Geidam", "Gujba", "Gulani", "Jakusko", 
      "Karasuwa", "Machina", "Nangere", "Tarmuwa", "Yunusari", "Yusufari"
    ]
  },
  {
    name: "Zamfara",
    cities: [
      "Gusau", "Kaura Namoda", "Talata Mafara", "Zurmi", "Anka", 
      "Bakura", "Birnin Magaji/Kiyaw", "Bukkuyum", "Bungudu", 
      "Gummi", "Gusau", "Maradun", "Maru", "Shinkafi", "Tsafe"
    ]
  }
];

// Helper function to get cities for a specific state
export const getCitiesForState = (stateName: string): string[] => {
  const state = nigerianStates.find(s => s.name === stateName);
  return state ? state.cities : [];
};

// Helper function to get all state names
export const getAllStateNames = (): string[] => {
  return nigerianStates.map(state => state.name);
};

// Helper function to validate if a state-city combination is valid
export const validateStateCity = (stateName: string, cityName: string): boolean => {
  const state = nigerianStates.find(s => s.name === stateName);
  if (!state) return false;
  return state.cities.includes(cityName);
};