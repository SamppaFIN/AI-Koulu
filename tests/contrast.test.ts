import { describe, it, expect } from "vitest";
import { contrastRatio } from "../src/lib/contrast";

// WCAG 2.2:n kontrastisuhde: jokainen kanava linearisoidaan ennen painotettua summaa.
describe("kontrastisuhde", () => {
  it("musta valkoisella on 21:1 ja sama väri 1:1", () => {
    expect(contrastRatio("#000000", "#ffffff")).toBeCloseTo(21, 2);
    expect(contrastRatio("#336699", "#336699")).toBeCloseTo(1, 5);
  });
  it("harmaat vastaavat tunnettuja arvoja", () => {
    expect(contrastRatio("#767676", "#ffffff")).toBeCloseTo(4.54, 2);
    expect(contrastRatio("#999999", "#ffffff")).toBeCloseTo(2.85, 2);
  });
  it("värillinen pari lasketaan kanavittain linearisoituna", () => {
    // Puhdas punainen: L = 0,2126, joten (1,05) / (0,2626) ≈ 4,00
    expect(contrastRatio("#ff0000", "#ffffff")).toBeCloseTo(4.0, 2);
    expect(contrastRatio("#0000ff", "#ffffff")).toBeCloseTo(8.59, 2);
  });
  it("järjestys ei vaikuta tulokseen", () => {
    expect(contrastRatio("#ffffff", "#6b3fa0")).toBeCloseTo(contrastRatio("#6b3fa0", "#ffffff"), 10);
  });
});
