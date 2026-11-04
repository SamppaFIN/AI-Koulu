# AI-Koulu

Suomenkielinen opetussivusto tekoälyjärjestelmien arkkitehtuurista ja UI/UX-käytännöistä insinööriopiskelijalle. Sisältö on marraskuun 2026 tasolla, ja jokaisella aikasidonnaisella faktalla on lähde.

**Sivusto:** https://samppafin.github.io/AI-Koulu/ · **Tekijä:** Infinite

## Sisältö

- **AI-arkkitehtuurit**, 14 lukua neljässä osassa: perusteet (kielimalli, mallimaisema, kontekstin hallinta), rakennusmallit (API, RAG, hienosäätö, multimodaalisuus), agentit (suunnittelumallit, MCP ja Agent Skills, koodausagentit, evalit) ja tuotanto (infrastruktuuri, luotettavuus, viitearkkitehtuurit).
- **UI/UX-käytännöt**, 9 lukua: ihmiskeskeinen suunnittelu, saavutettavuus, suorituskyky ja tekoälyn vaikutus käyttöliittymiin.
- **Tekoälyn aikakehä**: 28 käsitettä julkaisuvuoden mukaan 1950–2026.
- Interaktiiviset demot, kaaviot, sanasto, visat ja kolme insinööriä (Ktesibios, Heron ja Hypatia), jotka kommentoivat sitä, mitä katsot.

## Rakenne

```
src/content/ai-architecture/  luvut (MDX); luonnokset merkitään published: false
src/content/ui-ux/            UI/UX-luvut (MDX)
src/data/                     sanasto, visat, lähteet, aikakehä, insinöörien repliikit, tekniikkamuistiinpanot
src/components/site/          sivuston rakenne: lukusivu, lukukortit, astrolabi
src/components/mdx/           MDX:n apukomponentit (Callout, Reference, TermTooltip, …)
src/components/demo/          React-demot ja aikakehä (saarekkeet)
src/components/wrappers/      Astro-wrapperit, jotka antavat demoille client:visible-direktiivin
src/scripts/                  selainskriptit: hero (WebGL), taustat, insinöörit, Kysy
src/styles/site.css           koko sivuston tyylit ja tokenit (teema C1 Messinkiastrolabi)
tests/                        Playwright (*.spec.ts) ja Vitest (*.test.ts)
```

## Kehitys

Vaatii Node.js:n version 22.23.4 tai uudemman (`.nvmrc`: 22).

```sh
npm install
npm run dev        # http://localhost:4321/AI-Koulu/
npm run build      # staattinen sivusto ja Pagefind-hakuindeksi kansioon dist/
npm run preview    # valmiin buildin esikatselu
```

## Testit

```sh
npm run lint       # TypeScript
npm test           # datan eheys: lähteet, visat, sanasto, aikakehä, repliikit (Vitest)
npx playwright install chromium
npm run build && npm run test:ui   # saavutettavuus (axe) ja käyttöliittymä, 1440 px ja 390 px
```

Playwright käynnistää esikatselupalvelimen portissa 4329. Testit odottavat sivun tilaa (`window.aiKoulu`) eivätkä kiinteitä viiveitä. GitHub Actions ajaa saman ketjun ennen jokaista julkaisua, ja punainen testi estää deployn.

## Sisällön kirjoittaminen

- Kirjoita insinööriopiskelijalle: määritelmä, mekanismi, kaava tai esimerkki, sudenkuoppa ja lähde.
- Aikasidonnaiset faktat (mallit, hinnat, versiot) merkitään "tilanne 11/2026", ja lähde lisätään tiedostoon `src/data/references.json`. Viite lisätään tekstiin muodossa `<Reference id="…" />`.
- Mallien hinnat ovat vain luvussa 2, ja muut luvut viittaavat siihen.
- Uusi demo tehdään React-komponenttina `src/components/demo/`-kansioon ja otetaan käyttöön wrapperin kautta.

## Lisenssit

Koodi: MIT ([LICENSE](LICENSE)). Opetussisältö: CC BY 4.0 ([LICENSE-CONTENT](LICENSE-CONTENT)). Fontit: SIL OFL 1.1 ([public/fonts/](public/fonts/)).
