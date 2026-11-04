// Yhteiset apufunktiot selainskripteille
export const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
// Pienet kirjaimet ja ääkköset ilman pisteitä, jotta "Mitä" ja "mita" täsmäävät
export const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
