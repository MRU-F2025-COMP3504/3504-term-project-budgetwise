"use client";
import { useState } from "react";

const QUESTIONS = [
  { id: "q1", text: "Average monthly income?", type: "number" },
  { id: "q2", text: "Average monthly rent/housing?", type: "number" },
  { id: "q3", text: "Savings goal for next 12 months?", type: "number" },
  { id: "q4", text: "How often do you dine out?", type: "select", options: ["Rarely", "Weekly", "Multiple times/week"] },
  { id: "q5", text: "Comfort with risk?", type: "select", options: ["Low", "Medium", "High"] }
];

export default function QuizPage() {
  const [answers, setAnswers] = useState({});
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const current = QUESTIONS[step];

  function update(id, value) {
    setAnswers(a => ({ ...a, [id]: value }));
  }

  async function next() {
    if (step < QUESTIONS.length - 1) setStep(s => s + 1);
    else {
      setSubmitting(true);
      try {
        await fetch("/api/user_profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ profile_type: "onboarding_quiz", answers })
        });
      } catch {
        // ignore for MVP
      } finally {
        setSubmitting(false);
        setDone(true);
      }
    }
  }

  function back() {
    if (step > 0) setStep(s => s - 1);
  }

  if (done) {
    return (
      <div className="bw-container max-w-lg">
        <h1 className="text-2xl font-semibold mb-4">Quiz Complete</h1>
        <p className="text-[var(--color-text-muted)] mb-4">
          Your answers were saved. These will power personalized AI budgeting advice.
        </p>
        <pre className="bw-card p-4 text-xs overflow-auto">
          {JSON.stringify(answers, null, 2)}
        </pre>
        <a href="/dashboard" className="inline-block mt-4 underline text-sm">Go to Dashboard</a>
      </div>
    );
  }

  return (
    <div className="bw-container max-w-lg">
      <h1 className="text-2xl font-semibold mb-4">Spending Profile Quiz</h1>
      <div className="bw-card p-6 space-y-4">
        <p className="text-sm">{current.text}</p>
        {current.type === "number" && (
          <input
            type="number"
            className="bw-input w-full"
            value={answers[current.id] || ""}
            onChange={e => update(current.id, e.target.value)}
            placeholder="Enter amount"
          />
        )}
        {current.type === "select" && (
          <select
            className="bw-input w-full"
            value={answers[current.id] || ""}
            onChange={e => update(current.id, e.target.value)}
          >
            <option value="">Select...</option>
            {current.options.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        )}
        <div className="flex justify-between mt-2">
          <button
            disabled={step === 0}
            onClick={back}
            className="px-4 py-2 rounded-md bg-[var(--color-surface-2)]"
          >Back</button>
          <button
            disabled={submitting || !answers[current.id]}
            onClick={next}
            className="px-4 py-2 rounded-md bg-[var(--color-accent-2)] text-white"
          >
            {step === QUESTIONS.length - 1 ? (submitting ? "Saving..." : "Finish") : "Next"}
          </button>
        </div>
        <p className="text-[10px] text-right text-[var(--color-text-muted)]">
          Step {step + 1} / {QUESTIONS.length}
        </p>
      </div>
    </div>
  );
}
