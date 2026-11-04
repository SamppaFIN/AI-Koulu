# Design brief — AI-Koulu

> Generoitu `init-project`-alustuksella, koska projektissa on käyttöliittymä.
> Tätä käytetään Design-canvaksen pohjana, jotta mockupit käyttävät projektin
> omia tokeneita eivätkä yleisiä oletuksia.

## Konteksti

- **Projekti:** AI-Koulu — suomenkielinen interaktiivinen opetussivusto
  AI-arkkitehtuureista ja UI/UX-käytännöistä, marraskuun 2026 tasolla.
- **Kohdekäyttäjä:** suomenkielinen insinööriopiskelija, joka haluaa
  ymmärtää nykyiset AI-järjestelmät mekanismin, kaavojen ja sudenkuoppien
  tasolla. Sisällön selkeys ja tarkkuus menevät kaiken edelle.
- **Ensisijainen laite:** mobiili ja desktop yhtä tärkeinä. Testataan 390 px ja
  1440 px.
- **Sävy:** futuristinen Aleksandrian kirjasto, toteutuksena C1
  Messinkiastrolabi. Asiallinen ja rauhallinen. Efektit ja kolme insinööriä
  ovat hillittyjä eivätkä kilpaile sisällön kanssa.
- **Malli:** portfolio (https://samppafin.github.io/Infinite/, koodi
  C:\Projects\Infinite-LandingPage), mutta yhdellä teemalla.

## Suunniteltavat näkymät

1. Teeman 2–3 tulkintaa rinnakkain (hero ja yksi sisältöosio kustakin)
2. Etusivu: WebGL-hero, insinöörien esittely, osa-alueet ja jatka-siitä-mihin-jäit
3. Lukusivu: teksti, kaavio, visa ja insinöörien keskustelu luvun äärellä
4. Demo: yksi interaktiivinen demo uudessa ilmeessä
5. Insinöörien keskustelu ja Kysy-ikkuna (loki ja piilotus)
6. Mobiilinäkymä: etusivu ja lukusivu 390 px:n leveydellä

## Design-systeemi — käytä näitä, älä keksi uusia

Värit ovat ehdotus. Kontrastit on laskettu OKLCH → sRGB -muunnoksella (WCAG
2.x -kaava) taustaa `--c-bg` vasten.

```css
:root {
  /* OKLCH: tasainen havaittu kirkkaus, ei yllätyksiä kirkkautta säätäessä */
  --c-bg:       oklch(0.16 0.045 262);  /* syvä lapis-yö */
  --c-surface:  oklch(0.22 0.05 262);
  --c-text:     oklch(0.94 0.03 85);    /* papyrus — 16,3:1 */
  --c-muted:    oklch(0.80 0.035 85);   /* 10,4:1 */
  --c-accent:   oklch(0.82 0.13 85);    /* kulta — 11,1:1 */
  --c-holo:     oklch(0.84 0.11 200);   /* kylmä syaani hologrammi — 12,4:1 */
  --c-success:  oklch(0.80 0.15 150);   /* 11,0:1 */
  --c-danger:   oklch(0.72 0.16 30);    /* 7,3:1 */

  --touch-target: 44px;        /* WCAG 2.5.5 */
}

/* Responsiivinen typografia ilman mediakyselyitä */
font-size: clamp(1rem, 0.95rem + 0.25vw, 1.125rem);
```

Typografia: antiikkia henkivä otsikkofontti ja selkeä leipäteksti, molemmat
muuttuvia fontteja, OFL-lisenssillä ja itse isännöityinä. Fontit valitaan
canvaksessa.

Pakolliset käytökset:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}

:focus-visible {
  outline: 2px solid var(--c-accent);
  outline-offset: 2px;
}
```

## Rajoitteet

- Jokainen interaktiivinen kohde vähintään 44 × 44 px
- Kontrasti täyttää WCAG AA:n taustaa `--c-bg` vasten
- Pelkkä väri ei kanna merkitystä: jokaisen värivihjeen parina on teksti tai ikoni
- Yksi teema, ei teemavalikkoa eikä tumma/vaalea-vaihtajaa
- WebGL:lle staattinen fallback; animaatiot pysähtyvät, kun ne eivät näy
- Ei kolmansien osapuolten pyyntöjä (fontit itse isännöityinä)
- Selkeys ennen määrää: ei säädinrivejä sisällön yläpuolella

## Mitä tuotetaan

Mockupit yllä olevista näkymistä tässä järjestyksessä. Yksi näkymä kerrallaan:
näytä se, ota palaute ja siirry seuraavaan. Älä suunnittele kaikkia ennen kuin
ensimmäisestä on sovittu.
