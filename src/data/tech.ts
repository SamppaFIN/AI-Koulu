// Tekniikkamuistiinpanot: "tausta ·" -merkinnät avaavat nämä dialogissa. Tekniikka, kaava ja perustelu.

export type Note = { title: string; technique: string; formula: string; why: string };

export const TECH: Record<string, Note> = {
  hero: {
    title: 'Astrolabi-hero',
    technique: 'Astrolabin renkaat, asteikko ja kirjaimet ovat buildissa laskettu SVG. Sen päällä yksi WebGL-fragmenttishaderi piirtää hitaan valokeilan ja tähtikentän. Alidadi kääntyy osoittimen kulmaan CSS-transformilla. Shaderi piirtää vain, kun hero näkyy.',
    formula: 'kulma θ = atan2(y − c_y, x − c_x)\nvalokeila I = max(0, cos(φ − ωt))^24 · (1 − r/R)\ntähti: I_s = step(0.9985, hash(floor(uv · 240))) · (0.6 + 0.4 sin(t + 7 · hash))',
    why: 'Piirros toimii ilman WebGL:ää ja ilman JavaScriptiä, joten varakuva on sama kuva ilman valoa. Shaderi lisää vain liikkeen, ja prefers-reduced-motion jättää sen yhteen staattiseen kuvaan.',
  },
  glyphs: {
    title: 'Kirjaimet hajoavat tokeneiksi',
    technique: 'Canvas 2D: kreikkalaiset kirjaimet putoavat hitaasti ja vaihtuvat matkalla neliöiksi eli tokeneiksi. Hiukkasia on vakiomäärä, ja ne kierrätetään. Animaatio pyörii vain, kun osio näkyy (IntersectionObserver).',
    formula: 'y ← y + v · Δt, v ∈ [6, 14] px/s\nmuoto = kirjain, kun y < 0,45 · H, muuten token\nläpinäkyvyys α = 0,35 · (1 − y/H)',
    why: 'Osio esittelee kielimallien perusteet, ja tokenisointi on niiden ensimmäinen askel: teksti pilkotaan paloiksi ennen kuin malli näkee sitä.',
  },
  colonnade: {
    title: 'Pylväikkö',
    technique: 'Yksi div ja clip-path: polygon(). Pylväät ja päätykolmio ovat saman monikulmion pisteitä, joten kuvaa ei ladata erikseen.',
    formula: 'pylväs i: x ∈ [8 + 20i, 16 + 20i] %, i = 0…4\npääty: (0, 18 %) → (50 %, 0) → (100 %, 18 %)',
    why: 'Kevein mahdollinen koriste: ei skriptiä, ei kuvaa ja ei animaatiota. Sopii UI/UX-osioon, jossa sisältö on tekstiä ja listoja.',
  },
  sweep: {
    title: 'Alidadin pyyhkäisy',
    technique: 'Rekisteröity CSS-ominaisuus @property --sweep (tyyppi <angle>) animoi conic-gradientin aloituskulmaa. Rengas rajataan radial-gradient-maskilla.',
    formula: '@property --sweep { syntax: \'<angle>\' }\nbackground: conic-gradient(from var(--sweep), kulta 18 %, transparent 12 %)\n--sweep: 0deg → 360deg / 24 s',
    why: 'Ilman @property-rekisteröintiä selain ei osaa interpoloida mukautettua ominaisuutta, ja kulma hyppäisi suoraan loppuarvoon.',
  },
  flow: {
    title: 'Musteen virtaus',
    technique: 'Canvas 2D -virtauskenttä: hiukkaset seuraavat kulmakenttää, joka on kolmen sinin summa, ja jättävät haalean jäljen. Kenttä muuttuu hitaasti ajan mukana.',
    formula: 'θ(x, y, t) = 1,6 sin(0,006x + 0,15t) + 1,6 cos(0,009y − 0,11t) + 1,2 sin(0,004(x + y))\np ← p + 0,6 · (cos θ, sin θ)\njälki: täyttö taustavärillä α = 0,04 joka kuvassa',
    why: 'Sanasto yhdistää lukujen termit toisiinsa. Virtaus on sen kuva, ja se on niin haalea, ettei se kilpaile tekstin kanssa.',
  },
  crew: {
    title: 'Kolme insinööriä',
    technique: 'Hahmot piirretään canvasille Path2D-poluilla koko näkymän päälle. Jokaisella kaaviolla, demolla ja visalla on huomioarvo, joka kasvaa, kun kohde on lähellä näkymän keskikohtaa, osoitin on alle 220 px:n päässä tai fokus on kohteen sisällä. Kun arvo ylittää kynnyksen ja pysyy siellä hetken, hahmot siirtyvät jonossa kohteen ympäri piirretylle pyöristetylle suorakaiteelle ja kiertävät sitä. Puhe näkyy kuplana, mobiilissa näkymän alareunaan kiinnitettynä.',
    formula: 'huomio: A ← A + (I − A) · (1 − e^(−Δt/τ)), τ = 0,35 s nousussa, 1,2 s laskussa\nvaihto: A ≥ 0,35 ja A > A_nyk + 0,12 vähintään 450 ms (ilman osoitinta 1,6-kertaisesti)\nkehä: u ← u + v · Δt / L, v = 16 px/s (puhuessa 6 px/s), jono 58 px välein\nväistö: d < 110 px ⇒ siirto 110 − d osoittimesta poispäin\nkupla: kesto = max(3,5 s, 55 ms · merkit)',
    why: 'Kynnys ja hystereesi estävät hahmoja hyppimästä kohteesta toiseen. Jokaisella on oma näkökulma, joten repliikit täydentävät toisiaan eivätkä toista lukutekstiä.',
  },
  kehae: {
    title: 'Aikakehän asteikko',
    technique: 'Käsitteen kulma lasketaan paloittain lineaarisesta funktiosta. Kehä on SVG, ja valinta, vuosi ja nimet ovat React-saarekkeen tilaa.',
    formula: 'θ(v) = −140° + 70°·(v − 1950)/60, kun v ≤ 2010\nθ(v) = −70° + 7°·(v − 2010), kun 2010 < v ≤ 2020\nθ(v) = 140°·(v − 2020)/6, kun v > 2020',
    why: 'Lineaarisella asteikolla vuodet 2020–2026 saisivat 280° · 6/76 ≈ 22° kaaresta, ja niihin osuu 22 käsitettä 28:sta. Paloittainen asteikko pitää ne erillään ja näyttää samalla, että tahti kiihtyi.',
  },
};
