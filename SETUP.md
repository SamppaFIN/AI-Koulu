# SETUP — seuraavat askeleet

Alustus tuotti tiedostot CLAUDE.md, backlog.json, INSTRUCTIONS-FINAL.md,
design-brief.md ja tämän tiedoston. Vanha agenttitiedosto (Piirtäjä, DeepSeek)
on siirretty polkuun `docs/historia/claude-piirtaja-deepseek-2026-06.md`.

1. **Node.js päivitetty** versioon 22.23.4 (2026-11-04). CI käyttää samaa linjaa (`.nvmrc`: 22).
2. **Tarkista CLAUDE.md ja backlog.json.** Korjaa tai kuittaa. Erityisesti
   osion 13 avoimet kysymykset.
3. **Kokeile uutta ulkoasua paikallisesti** sekä mobiilissa että desktopissa:
   `npm install`, `npm run build` ja `npm run preview`. Sivu aukeaa osoitteessa
   http://localhost:4321/AI-Koulu/. Hyväksy tai korjaa TICKET-TEST-002.
4. **Päätä commit.** Työ on haarassa `uudistus-2026-11`, eikä mitään ole
   commitoitu. `docs/paivitys-2026-11.md` jää tarkoituksella commitoimatta.
5. **Ota Dependabot käyttöön** GitHubissa: Settings → Code security →
   Dependabot alerts.
6. **Ota main-haaran suojaus käyttöön**, kun STORY-003 on valmis: Settings →
   Branches → vaaditut tarkistukset (testijobi). Sen jälkeen punainen testi estää
   mergen.
7. **Jos käytät myös claude.ai-projektia:**
   1. Avaa "Set project instructions" ja KORVAA nykyinen sisältö tiedostolla
      INSTRUCTIONS-FINAL.md.
   2. Raahaa project knowledge -kenttään CLAUDE.md ja backlog.json.
   3. Poista project knowledgesta pohjat ja esimerkki: CLAUDE.*.md.template,
      design-brief.template.md ja backlog.example.json (skeemat voivat jäädä).
   Claude Codessa näitä ei tarvita, koska se lukee CLAUDE.md:n reposta.
8. **Kun uudistus on valmis:** päivitä portfolion AI-Koulu-kortti
   Infinite-LandingPage-projektissa (README, viimeisin commit, AI-avustaja).
