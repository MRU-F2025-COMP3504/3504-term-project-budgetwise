"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useQuiz from "../hooks/useQuiz";
import QuizQuestion from "../components/QuizQuestion";

// QuizPage is a thin client around the AI-driven quiz.
// It keeps a chat-like `history`, renders the current question,
// collects the user's answer, and asks the server for the next step via /api/quiz.
// The server calls OpenAI with prompts from lib/helpers/QuizPrompts.js
// and responds with either a {status:"question"} or {status:"complete"} JSON payload.

export default function QuizPage() {
  const router = useRouter();
  const [answer, setAnswer] = useState("");
  const [redirecting, setRedirecting] = useState(false);
  const { currentQ, loading, error, done, summary, submitAnswer } = useQuiz({
    onComplete: async ({ profile, summary }) => {
      // Persist profile (best-effort) when quiz finishes
      try {
        await fetch("/api/user_profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            profile_type: "ai_quiz",
            profile: profile || {},
            summary: summary || "",
            created_at: new Date().toISOString(),
          }),
        });
      } catch (_) {}
    },
  });

  // Auto-redirect to dashboard after quiz completion
  useEffect(() => {
    if (done && !redirecting) {
      setRedirecting(true);
      setTimeout(() => {
        router.push("/dashboard");
      }, 3000); // 3 second delay to show completion message
    }
  }, [done, redirecting, router]);

  const handleSubmit = async () => {
    if (!currentQ || !answer) return;
    const value = answer;
    setAnswer("");
    await submitAnswer(value);
  };

  if (done) {
    return (
      <div className="bw-container max-w-lg">
        <h1 className="text-2xl font-semibold mb-4">Quiz Complete! ✅</h1>
        <p className="text-[var(--color-text-muted)] mb-4">
          Your profile has been saved. These insights will power personalized budgeting advice.
        </p>
        {summary?.summary && (
          <div className="bw-card p-4 text-sm mb-3 whitespace-pre-wrap">{summary.summary}</div>
        )}
        <div className="bw-card p-4 bg-blue-900/20 border-blue-500/30 mb-4">
          <p className="text-sm text-blue-300">
            {redirecting ? "Redirecting to dashboard in a moment..." : "Preparing your dashboard..."}
          </p>
        </div>
        <button 
          onClick={() => router.push("/dashboard")}
          className="bw-btn bw-btn-primary"
        >
          Go to Dashboard Now
        </button>
      </div>
    );
  }

  return (
  <div className="bw-container mt-8">
    <div className="flex justify-center">
      <div className="w-full max-w-[420px]">
        <h1 className="text-2xl font-semibold mb-4">Spending Profile Quiz</h1>
        <div className="bw-card p-6 space-y-4">
        {error && <div className="text-red-600 text-sm">{error}</div>}
        {!currentQ && <p className="text-sm">{loading ? "Loading first question..." : "Preparing quiz..."}</p>}
        {currentQ && (
          <>
            <QuizQuestion
              question={currentQ}
              value={answer}
              onChange={setAnswer}
              disabled={loading}
            />
            <div className="flex justify-end mt-2">
              <button
                disabled={loading || !answer}
                onClick={handleSubmit}
                className="bw-btn bw-btn-primary"
              >
                {loading ? "Thinking..." : "Next"}
              </button>
            </div>
          </>
        )}
        </div>
      </div>
    </div>
    </div>
  );
}
