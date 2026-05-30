"use client";

import { useState, useMemo } from "react";
import quizData from "../../data/quizzes.json";

interface Question {
  id: string;
  chapterSlug: string;
  scenario: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  adhdTip?: string;
}

interface ChapterQuizProps {
  chapterSlug: string;
}

type QuizState = "intro" | "playing" | "finished";

function shuffleArray<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * ChapterQuiz — lukukohtainen tietovisa skenaariopohjaisilla kysymyksillä.
 */
export default function ChapterQuiz({ chapterSlug }: ChapterQuizProps) {
  const [state, setState] = useState<QuizState>("intro");
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [shuffledOptions, setShuffledOptions] = useState<string[][]>([]);

  const questions = useMemo(() => {
    const all = quizData as Question[];
    const filtered = all.filter((q) => q.chapterSlug === chapterSlug);
    // Sekoita vaihtoehdot kerran
    setShuffledOptions(filtered.map((q) => shuffleArray(q.options)));
    return filtered;
  }, [chapterSlug]);

  if (questions.length === 0) return null;

  const q = questions[current];
  const total = questions.length;
  const isLast = current === total - 1;

  const getCorrectShuffledIndex = (qIdx: number): number => {
    if (!shuffledOptions[qIdx] || !questions[qIdx]) return -1;
    const correctText = questions[qIdx].options[questions[qIdx].correctIndex];
    return shuffledOptions[qIdx].indexOf(correctText);
  };

  const handleAnswer = (optIdx: number) => {
    if (selected !== null) return; // Estä uudelleenvalinta
    setSelected(optIdx);

    const correctShuffled = getCorrectShuffledIndex(current);
    const isCorrect = optIdx === correctShuffled;

    if (isCorrect) setScore((s) => s + 1);
    setAnswers((a) => ({ ...a, [q.id]: isCorrect }));
  };

  const handleNext = () => {
    if (isLast) {
      setState("finished");
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
    }
  };

  const handleRestart = () => {
    setCurrent(0);
    setSelected(null);
    setScore(0);
    setAnswers({});
    setState("intro");
  };

  const correctShuffledIndex = getCorrectShuffledIndex(current);

  return (
    <div
      style={{
        background: "var(--glass-bg)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border: "1px solid var(--glass-border)",
        borderRadius: "16px",
        padding: "2rem",
        marginBlock: "2rem",
        boxShadow: "var(--glass-shadow)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Glow-efekti yläreunassa */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "3px",
          background: "var(--aurora-gradient-full)",
          animation: "cardGlow 3s linear infinite",
        }}
      />

      {/* Intro-tila */}
      {state === "intro" && (
        <div style={{ textAlign: "center", padding: "1.5rem 0" }}>
          <p style={{ fontSize: "2.5rem", margin: "0 0 1rem 0" }}>🧠</p>
          <h3 style={{ margin: "0 0 0.5rem 0", color: "var(--color-brand)" }}>
            Muistitesti — {total} kysymystä
          </h3>
          <p style={{ color: "var(--color-text-secondary)", maxWidth: "50ch", margin: "0 auto 1.5rem auto" }}>
            Testaa oppimaasi käytännön skenaarioilla. Ei pänttäystä — vaan
            oikean elämän tilanteita, joissa sovellat juuri lukemiasi asioita.
          </p>
          <button
            onClick={() => setState("playing")}
            style={{
              padding: "0.75rem 2rem",
              border: "none",
              borderRadius: "10px",
              background: "var(--aurora-gradient-1)",
              color: "white",
              fontWeight: 700,
              fontSize: "1rem",
              cursor: "pointer",
              fontFamily: "inherit",
              boxShadow: "0 4px 15px oklch(0.55 0.24 280 / 0.3)",
            }}
          >
            Aloita testi 🚀
          </button>
        </div>
      )}

      {/* Pelaaminen */}
      {state === "playing" && (
        <div>
          {/* Edistymispalkki */}
          <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
            {Array.from({ length: total }).map((_, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: "4px",
                  borderRadius: "999px",
                  background:
                    i === current
                      ? "var(--color-brand)"
                      : answers[questions[i]?.id] !== undefined
                      ? answers[questions[i]?.id]
                        ? "var(--color-success)"
                        : "var(--color-error)"
                      : "var(--color-bg-code)",
                  transition: "background 0.3s",
                }}
              />
            ))}
          </div>

          <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", marginBottom: "1rem" }}>
            Kysymys {current + 1}/{total}
          </p>

          {/* Skenaario */}
          <div
            style={{
              background: "var(--glass-bg)",
              backdropFilter: "blur(8px)",
              border: "1px solid var(--glass-border)",
              borderRadius: "10px",
              padding: "1rem 1.25rem",
              marginBottom: "1.25rem",
              borderLeft: "3px solid var(--aurora-pink)",
            }}
          >
            <p style={{ fontSize: "0.8rem", fontWeight: 600, margin: "0 0 0.4rem 0", color: "var(--aurora-pink)" }}>
              📖 Skenaario
            </p>
            <p style={{ margin: 0, lineHeight: 1.6, fontSize: "0.95rem" }}>
              {q.scenario}
            </p>
          </div>

          {/* Kysymys */}
          <p style={{ fontWeight: 600, fontSize: "1.05rem", marginBottom: "1rem" }}>
            {q.question}
          </p>

          {/* Vaihtoehdot */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1.25rem" }}>
            {(shuffledOptions[current] || q.options).map((opt, i) => {
              const isCorrectOpt = i === correctShuffledIndex;
              const isSelected = i === selected;
              let bg = "var(--color-bg)";
              let borderColor = "var(--color-border)";

              if (isSelected) {
                borderColor = isCorrectOpt ? "var(--color-success)" : "var(--color-error)";
                bg = isCorrectOpt
                  ? "color-mix(in oklab, var(--color-success) 12%, var(--color-bg))"
                  : "color-mix(in oklab, var(--color-error) 12%, var(--color-bg))";
              } else if (selected !== null && isCorrectOpt) {
                // Näytä oikea vastaus aina
                borderColor = "var(--color-success)";
                bg = "color-mix(in oklab, var(--color-success) 8%, var(--color-bg))";
              }

              return (
                <button
                  key={i}
                  onClick={() => handleAnswer(i)}
                  disabled={selected !== null}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "0.75rem",
                    padding: "0.75rem 1rem",
                    borderRadius: "10px",
                    border: `1.5px solid ${borderColor}`,
                    background: bg,
                    cursor: selected !== null ? "default" : "pointer",
                    textAlign: "left",
                    color: "var(--color-text)",
                    fontSize: "0.9rem",
                    fontFamily: "inherit",
                    lineHeight: 1.5,
                    transition: "background 0.2s, border-color 0.2s",
                  }}
                >
                  <span
                    style={{
                      width: "24px",
                      height: "24px",
                      minWidth: "24px",
                      borderRadius: "50%",
                      border: `2px solid ${borderColor}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      background:
                        selected !== null && isCorrectOpt
                          ? "var(--color-success)"
                          : isSelected && !isCorrectOpt
                          ? "var(--color-error)"
                          : "transparent",
                      color:
                        selected !== null && (isCorrectOpt || (isSelected && !isCorrectOpt))
                          ? "white"
                          : "var(--color-text-muted)",
                    }}
                  >
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span style={{ flex: 1 }}>{opt}</span>
                </button>
              );
            })}
          </div>

          {/* Palaute */}
          {selected !== null && (
            <div
              style={{
                background:
                  correctShuffledIndex === selected
                    ? "color-mix(in oklab, var(--color-success) 12%, var(--color-bg))"
                    : "color-mix(in oklab, var(--color-error) 12%, var(--color-bg))",
                borderRadius: "10px",
                padding: "1rem 1.25rem",
                marginBottom: "1rem",
              }}
            >
              <p style={{ fontWeight: 700, margin: "0 0 0.4rem 0", color: correctShuffledIndex === selected ? "var(--color-success)" : "var(--color-error)" }}>
                {correctShuffledIndex === selected ? "✅ Oikein!" : "❌ Väärin"}
              </p>
              <p style={{ margin: 0, lineHeight: 1.6, fontSize: "0.9rem" }}>
                {q.explanation}
              </p>
              {q.adhdTip && (
                <p
                  style={{
                    margin: "0.75rem 0 0 0",
                    fontSize: "0.85rem",
                    color: "var(--color-accent)",
                    borderTop: "1px solid var(--color-border-light)",
                    paddingTop: "0.75rem",
                  }}
                >
                  {q.adhdTip}
                </p>
              )}
            </div>
          )}

          {/* Seuraava / Valmis */}
          {selected !== null && (
            <div style={{ textAlign: "right" }}>
              <button
                onClick={handleNext}
                style={{
                  padding: "0.6rem 1.5rem",
                  border: "none",
                  borderRadius: "8px",
                  background: "var(--aurora-gradient-1)",
                  color: "white",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontSize: "0.9rem",
                  fontFamily: "inherit",
                }}
              >
                {isLast ? "Näytä tulos 📊" : "Seuraava →"}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Valmis-tila */}
      {state === "finished" && (
        <div style={{ textAlign: "center", padding: "1rem 0" }}>
          <p style={{ fontSize: "3rem", margin: "0 0 0.5rem 0" }}>
            {score === total ? "🏆" : score >= total / 2 ? "👏" : "💪"}
          </p>
          <h3 style={{ margin: "0 0 0.5rem 0" }}>
            Tulos: {score}/{total} oikein
          </h3>
          <p style={{ color: "var(--color-text-secondary)", marginBottom: "1.5rem" }}>
            {score === total
              ? "Täydellinen! Hallitset luvun asiat."
              : score >= total / 2
              ? "Hyvin tehty! Muutama asia kaipaa kertausta."
              : "Jatka harjoittelua — käytännön oppiminen vaatii toistoja!"}
          </p>

          {/* Yhteenveto */}
          <div style={{ textAlign: "left", marginBottom: "1.5rem" }}>
            {questions.map((question, i) => {
              const isCorrect = answers[question.id];
              const shuffledIdx = getCorrectShuffledIndex(i);
              return (
                <div
                  key={question.id}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "0.75rem",
                    padding: "0.75rem",
                    borderRadius: "8px",
                    background: isCorrect
                      ? "color-mix(in oklab, var(--color-success) 8%, var(--color-bg))"
                      : "color-mix(in oklab, var(--color-error) 6%, var(--color-bg))",
                    marginBottom: "0.5rem",
                  }}
                >
                  <span style={{ fontSize: "1.2rem" }}>
                    {isCorrect ? "✅" : "❌"}
                  </span>
                  <div>
                    <p style={{ margin: "0 0 0.2rem 0", fontWeight: 600, fontSize: "0.9rem" }}>
                      {question.question.length > 60
                        ? question.question.slice(0, 60) + "..."
                        : question.question}
                    </p>
                    {!isCorrect && (
                      <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--color-success)" }}>
                        Oikea vastaus: {shuffledOptions[i]?.[shuffledIdx] || question.options[question.correctIndex]}
                      </p>
                    )}
                    <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.8rem", color: "var(--color-text-muted)" }}>
                      {question.adhdTip || question.explanation.slice(0, 100) + "..."}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={handleRestart}
            style={{
              padding: "0.6rem 1.5rem",
              border: "1px solid var(--color-border)",
              borderRadius: "8px",
              background: "var(--color-bg)",
              color: "var(--color-text)",
              cursor: "pointer",
              fontSize: "0.9rem",
              fontFamily: "inherit",
              marginRight: "0.5rem",
            }}
          >
            🔄 Uudelleen
          </button>
        </div>
      )}
    </div>
  );
}
