// Kolme insinööriä. Jokainen repliikki on joko sudenkuoppa (Ktesibios), mekanismi (Heron) tai rajaus (Hypatia),
// eikä mikään repliikki toista lukutekstiä. `re` kertoo, kenelle repliikki vastaa.

export type Who = 'ktesibios' | 'heron' | 'hypatia';
export type Line = { who: Who; text: string; re?: string };

export const PERSONAS: Record<Who, { name: string; role: string; color: string }> = {
  ktesibios: { name: 'Ktesibios', role: 'humoristi · käytännön sudenkuopat', color: 'oklch(0.82 0.13 85)' },
  heron: { name: 'Heron', role: 'tekninen · miten mekanismi toimii', color: 'oklch(0.84 0.11 200)' },
  hypatia: { name: 'Hypatia', role: 'filosofi ja kriitikko · rajat ja oletukset', color: 'oklch(0.80 0.10 300)' },
};

const k = (text: string, re?: string): Line => ({ who: 'ktesibios', text, re });
const h = (text: string, re?: string): Line => ({ who: 'heron', text, re });
const y = (text: string, re?: string): Line => ({ who: 'hypatia', text, re });

export const LINES: Record<string, Line[]> = {
  welcome: [
    k('Hei, olen Ktesibios. Kerron, mihin tässä aiheessa yleensä kompastutaan.'),
    h('Minä olen Heron. Selitän, miten mekanismi toimii ja millä ehdoilla.'),
    y('Ja minä olen Hypatia. Kysyn, milloin menetelmä ei päde ja miten sen voi mitata.'),
    k('Osoita lukua, demoa tai kaaviota, niin kerromme siitä. Kysy-painikkeesta voit kysyä suoraan.'),
  ],
  hero: [
    h('Taustan astrolabi on SVG-piirros, ja sen päällä WebGL-shaderi piirtää valon. Ilman WebGL:ää näet pelkän piirroksen.'),
    k('Alidadi eli viivain kääntyy osoittimen suuntaan. Se on ainoa asia, joka tässä liikkuu käskystäsi.', 'Heron'),
  ],
  parts: [
    k('Moni hyppää suoraan agentteihin. Ilman lukuja 1–3 agentin virheitä on vaikea selittää.'),
    h('Osat etenevät kerroksittain: malli, sen ympärille rakennettu sovellus, agentti ja lopuksi tuotanto.', 'Ktesibios'),
    y('Järjestys on yksi mahdollinen. Jos olet jo tehnyt RAG-toteutuksen, aloita siitä ja palaa perusteisiin tarvittaessa.', 'Heron'),
  ],
  uiux: [
    h('UI/UX-luvut ovat erillinen kokonaisuus. Luku 7 sitoo ne tekoälyyn: generatiivinen ja interaktiivinen UI chatissa.'),
    k('Saavutettavuusluku on se, jonka moni ohittaa ja jonka puute löytyy ensimmäisenä auditoinnissa.', 'Heron'),
  ],
  kehae: [
    h('Kehän asteikko ei ole lineaarinen. Vuodet 2020–2026 saavat saman kaaren kuin kaikki sitä edeltänyt.'),
    k('Kreikkalaiset kirjaimet loppuvat vuoteen 2017. Sen jälkeen reunalla on tokeneita.', 'Heron'),
    y('Tähti syttyy julkaisuvuonna. Kehä ei kerro, milloin käsitteestä tuli käytäntöä tai mikä niistä hylättiin.', 'Ktesibios'),
  ],
  sanasto: [
    h('Sanaston termit ovat samat kuin luvuissa. Luvun tekstissä termin lyhyt määritelmä aukeaa osoittimella tai fokuksella, ja siitä pääsee tänne.'),
    y('Määritelmä ei ole ymmärrys. Kokeile selittää termi ääneen ennen kuin luet määritelmän.', 'Heron'),
  ],
  'ch:ai-architecture/03-kontekstin-hallinta': [
    k('Yleinen virhe: aikaleima järjestelmäkehotteen alussa. Etuliite muuttuu joka kutsulla, eikä välimuisti osu koskaan.'),
    h('Siirrä muuttuva tieto viimeiseen viestiin. Välimuisti vertaa etuliitettä, joten kaikki ennen ensimmäistä eroa voidaan lukea välimuistista.', 'Ktesibios'),
    y('Kompaktointi on häviöllistä. Mitä tiivistelmästä puuttuu, sitä malli ei voi enää käyttää. Testaa samoilla tehtävillä ennen ja jälkeen.', 'Heron'),
  ],
  'demo:konteksti': [
    k('Lisää vuoroja, kunnes ikkuna täyttyy. Huomaa, että kehote kasvaa joka vuorolla, vaikka kysymys olisi lyhyt.'),
    h('Paina sitten Muuta järjestelmäkehotetta. Etuliite muuttuu, ja välimuistista luettava osuus putoaa nollaan.', 'Ktesibios'),
    y('Demo laskee osuuksia, ei millisekunteja tai euroja. Todelliset luvut riippuvat mallista ja palvelusta, ja ne ovat luvussa 2.', 'Heron'),
  ],
};
