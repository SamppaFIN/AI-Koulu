// Tekoälyn aikakehä: käsitteet julkaisuvuoden mukaan.
// Vuodet on tarkistettu (tilanne 11/2026), ja lähde on kunkin käsitteen source-kentässä. `flag` merkitsee epävarman vuoden.

export type Concept = {
  id: string;
  y: number; // vuosi desimaalina, kuukausi mukana järjestystä varten
  ring: 0 | 1 | 2 | 3;
  title: string;
  date: string;
  text: string;
  chapter: string; // luvun polku osion alla, esim. "ai-architecture/05-rag"
  chapterLabel: string;
  source: string;
  flag?: boolean;
  dr?: number; // säteen siirto, kun kaksi käsitettä osuisi päällekkäin
};

export const RINGS = ['Mallit', 'Tieto ja konteksti', 'Agentit ja työkalut', 'Tuotanto ja luottamus'] as const;

const L1 = ['ai-architecture/01-kielimalli', 'Luku 1 · Miten kielimalli toimii'] as const;

export const CONCEPTS: Concept[] = [
  { id: 'turing', y: 1950.8, ring: 0, title: 'Turingin testi', date: '10/1950', text: 'Alan Turing kysyi, voiko kone ajatella, ja ehdotti jäljittelypeliä, jota kutsutaan nyt Turingin testiksi.', chapter: L1[0], chapterLabel: L1[1], source: 'Turing 1950, Mind' },
  { id: 'perc', y: 1958.5, ring: 0, title: 'Perseptroni', date: '1958', text: 'Frank Rosenblattin oppiva neuroni säätää painojaan esimerkeistä.', chapter: L1[0], chapterLabel: L1[1], source: 'Rosenblatt 1958' },
  { id: 'backprop', y: 1986.8, ring: 0, title: 'Takaisinvirtaus', date: '1986', text: 'Monikerroksinen verkko oppii, kun virheen gradientti kuljetetaan taaksepäin kerros kerrokselta.', chapter: L1[0], chapterLabel: L1[1], source: 'Rumelhart, Hinton ja Williams 1986, Nature' },
  { id: 'alexnet', y: 2012.75, ring: 0, title: 'Syväoppimisen läpimurto', date: '2012', text: 'Näytönohjaimilla koulutettu konvoluutioverkko voitti ImageNet-kilpailun selvällä erolla.', chapter: L1[0], chapterLabel: L1[1], source: 'Krizhevsky, Sutskever ja Hinton 2012' },
  { id: 'transformer', y: 2017.45, ring: 0, title: 'Transformer', date: '6/2017', text: 'Huomiomekanismi korvasi rekursion. Useimmat nykyiset kielimallit käyttävät arkkitehtuurin dekooderiosaa.', chapter: L1[0], chapterLabel: L1[1], source: 'Vaswani ym. 2017' },
  { id: 'gpt3', y: 2020.4, ring: 0, title: 'GPT-3 ja skaalaus', date: '5/2020', text: '175 miljardin parametrin malli oppi tehtäviä pelkistä kehotteen esimerkeistä.', chapter: L1[0], chapterLabel: L1[1], source: 'Brown ym. 2020' },
  { id: 'rlhf', y: 2022.2, ring: 0, title: 'Ihmispalaute (RLHF)', date: '3/2022', text: 'Ihmisten palautteella hiotun 1,3 miljardin parametrin mallin vastauksia suosittiin 175 miljardin GPT-3:n vastausten sijaan.', chapter: L1[0], chapterLabel: L1[1], source: 'Ouyang ym. 2022' },
  { id: 'chatgpt', y: 2022.92, ring: 0, title: 'ChatGPT', date: '11/2022', text: 'Keskusteleva käyttöliittymä toi kielimallit suuren yleisön käyttöön.', chapter: L1[0], chapterLabel: L1[1], source: 'OpenAI 2022' },
  { id: 'reasoning', y: 2024.7, ring: 0, title: 'Päättelymallit', date: '9/2024', text: 'Malli tuottaa päättelyä ennen vastausta, ja laskentaa siirtyy koulutuksesta vastaushetkeen.', chapter: L1[0], chapterLabel: L1[1], source: 'OpenAI 2024 (o1)' },
  { id: 'adaptive', y: 2026.1, ring: 0, title: 'Adaptiivinen päättely ja effort', date: '2/2026', text: 'Malli päättää itse, kuinka paljon se päättelee, ja kehittäjä säätää syvyyttä effort-tasolla.', chapter: L1[0], chapterLabel: L1[1], source: 'Anthropic 2026 (Claude Opus 4.6)' },
  { id: 'w2v', y: 2013.05, ring: 1, title: 'Sanaupotukset', date: '1/2013', text: 'Sanat muutetaan vektoreiksi, joissa merkitykseltään läheiset sanat ovat lähellä toisiaan.', chapter: 'ai-architecture/05-rag', chapterLabel: 'Luku 5 · RAG', source: 'Mikolov ym. 2013' },
  { id: 'rag', y: 2020.38, ring: 1, title: 'RAG', date: '5/2020', text: 'Malli hakee tietoa ulkoisesta lähteestä ennen kuin vastaa.', chapter: 'ai-architecture/05-rag', chapterLabel: 'Luku 5 · RAG', source: 'Lewis ym. 2020' },
  { id: 'clip', y: 2021.05, ring: 1, title: 'Kuva ja teksti (CLIP)', date: '1/2021', text: 'Kuvat ja tekstit samaan upotusavaruuteen, jolloin kuvaa voi hakea sanoilla.', chapter: 'ai-architecture/07-multimodaalisuus', chapterLabel: 'Luku 7 · Multimodaalisuus', source: 'Radford ym. 2021' },
  { id: 'lora', y: 2021.46, ring: 1, title: 'LoRA', date: '6/2021', text: 'Hienosäätö pienillä matalan asteen lisämatriiseilla koko mallin painojen sijaan.', chapter: 'ai-architecture/06-hienosaato', chapterLabel: 'Luku 6 · Hienosäätö', source: 'Hu ym. 2021' },
  { id: 'cache', y: 2024.62, ring: 1, title: 'Prompt-välimuisti', date: '8/2024', text: 'Toistuva kehotteen alku käsitellään kerran ja luetaan sen jälkeen välimuistista.', chapter: 'ai-architecture/03-kontekstin-hallinta', chapterLabel: 'Luku 3 · Kontekstin hallinta', source: 'Anthropic 2024' },
  { id: 'compact', y: 2026.12, ring: 1, title: 'Kompaktointi', date: '2/2026', text: 'Pitkä keskustelu tiivistetään, jotta työ jatkuu kontekstiikkunan täyttyessä.', chapter: 'ai-architecture/03-kontekstin-hallinta', chapterLabel: 'Luku 3 · Kontekstin hallinta', source: 'Anthropic 2026 (Claude Opus 4.6)' },
  { id: 'cot', y: 2022.08, ring: 2, title: 'Ajatusketju', date: '1/2022', text: 'Kun malli kirjoittaa välivaiheet näkyviin, monivaiheinen päättely paranee.', chapter: 'ai-architecture/08-agentit', chapterLabel: 'Luku 8 · Agentit ja suunnittelumallit', source: 'Wei ym. 2022' },
  { id: 'react', y: 2022.8, ring: 2, title: 'ReAct', date: '10/2022', text: 'Päättely ja toiminta vuorottelevat: ajattele, käytä työkalua ja havainnoi tulos.', chapter: 'ai-architecture/08-agentit', chapterLabel: 'Luku 8 · Agentit ja suunnittelumallit', source: 'Yao ym. 2022' },
  { id: 'auto', y: 2023.25, ring: 2, title: 'Autonomiset agentit', date: '3/2023', text: 'Kokeilut, joissa malli asettaa itselleen välitavoitteita silmukassa, kuten AutoGPT.', chapter: 'ai-architecture/08-agentit', chapterLabel: 'Luku 8 · Agentit ja suunnittelumallit', source: 'AutoGPT 2023' },
  { id: 'tools', y: 2023.45, ring: 2, title: 'Työkalukutsut', date: '6/2023', text: 'Malli palauttaa rakenteisen kutsun, jonka sovellus suorittaa ja jonka tuloksen se palauttaa mallille.', chapter: 'ai-architecture/04-api-sovellukset', chapterLabel: 'Luku 4 · API-sovellukset', source: 'OpenAI 2023' },
  { id: 'cu', y: 2024.8, ring: 2, title: 'Computer use', date: '10/2024', text: 'Malli käyttää tietokonetta kuvakaappausten, hiiren ja näppäimistön kautta.', chapter: 'ai-architecture/09-agentin-tyokalut', chapterLabel: 'Luku 9 · Agentin työkalut', source: 'Anthropic 2024', dr: -22 },
  { id: 'mcp', y: 2024.9, ring: 2, title: 'MCP', date: '11/2024', text: 'Avoin protokolla, jolla työkalut ja tietolähteet kytketään malleihin yhdellä tavalla.', chapter: 'ai-architecture/09-agentin-tyokalut', chapterLabel: 'Luku 9 · Agentin työkalut', source: 'Anthropic 2024' },
  { id: 'coding', y: 2025.15, ring: 2, title: 'Koodausagentit', date: '2025', text: 'Agentti lukee repon, ajaa komentoja, muokkaa koodia ja tarkistaa työnsä testeillä, esimerkiksi Claude Code ja Codex.', chapter: 'ai-architecture/10-koodausagentit', chapterLabel: 'Luku 10 · Koodausagentit', source: 'Anthropic 2/2025, OpenAI 5/2025' },
  { id: 'skills', y: 2025.8, ring: 2, title: 'Agent Skills', date: '10/2025', text: 'Ohjeet, skriptit ja resurssit paketoidaan taidoiksi, jotka agentti lataa vasta tarvittaessa.', chapter: 'ai-architecture/09-agentin-tyokalut', chapterLabel: 'Luku 9 · Agentin työkalut', source: 'Anthropic 2025' },
  { id: 'inject', y: 2022.7, ring: 3, title: 'Prompt injection', date: '9/2022', text: 'Syötteeseen piilotettu ohje kaappaa mallin. Agenteille se on keskeinen turvariski.', chapter: 'ai-architecture/13-luotettavuus', chapterLabel: 'Luku 13 · Luotettavuus ja turvallisuus', source: 'Willison 2022' },
  { id: 'vllm', y: 2023.45, ring: 3, title: 'Tehokas inferenssi', date: '2023', text: 'PagedAttention hallitsee avain–arvo-välimuistin muistia käyttöjärjestelmän sivutuksen tapaan (vLLM).', chapter: 'ai-architecture/12-infrastruktuuri', chapterLabel: 'Luku 12 · Infrastruktuuri ja kustannukset', source: 'Kwon ym. 2023' },
  { id: 'swe', y: 2023.8, ring: 3, title: 'Agenttievalit', date: '10/2023', text: 'Agenttia mitataan oikeilla GitHub-ongelmilla: korjaako se vian niin, että testit menevät läpi (SWE-bench).', chapter: 'ai-architecture/11-evalit', chapterLabel: 'Luku 11 · Evalit ja laadunmittaus', source: 'Jimenez ym. 2023' },
  { id: 'euai', y: 2024.6, ring: 3, title: 'EU:n tekoälyasetus', date: '8/2024', text: 'Riskiperusteinen sääntely tuli voimaan, ja velvoitteet alkavat vaiheittain.', chapter: 'ai-architecture/13-luotettavuus', chapterLabel: 'Luku 13 · Luotettavuus ja turvallisuus', source: 'Asetus (EU) 2024/1689' },
];

export const LINKS: [string, string][] = [
  ['perc', 'backprop'], ['backprop', 'alexnet'], ['alexnet', 'transformer'], ['transformer', 'gpt3'], ['gpt3', 'rlhf'], ['rlhf', 'chatgpt'],
  ['chatgpt', 'reasoning'], ['reasoning', 'adaptive'], ['w2v', 'rag'], ['cot', 'react'], ['react', 'auto'], ['auto', 'cu'],
  ['tools', 'mcp'], ['mcp', 'skills'], ['mcp', 'coding'], ['cot', 'reasoning'], ['swe', 'coding'],
];

// Kehän asteikko ei ole lineaarinen: 1950–2010 = 70°, 2010–2020 = 70°, 2020–2026 = 140°. Vuosi 2020 on huipulla (0°).
export const angleOf = (y: number) => (y <= 2010 ? -140 + ((y - 1950) * 70) / 60 : y <= 2020 ? -70 + (y - 2010) * 7 : ((y - 2020) * 140) / 6);
export const RING_R = [160, 225, 290, 355];

export const polar = (cx: number, cy: number, r: number, deg: number): [number, number] => {
  const a = ((deg - 90) * Math.PI) / 180;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
};
