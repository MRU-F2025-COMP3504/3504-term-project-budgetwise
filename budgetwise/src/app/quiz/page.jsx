"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import useQuiz from "@/hooks/useQuiz";
import QuizQuestion from "@/components/QuizQuestion";
import api from "@/services/api";

// QuizPage is a thin client around the AI-driven quiz.
// It keeps a chat-like `history`, renders the current question,
// collects the user's answer, and asks the server for the next step via /api/quiz.
// The server calls OpenAI with prompts from lib/helpers/QuizPrompts.js
// and responds with either a {status:"question"} or {status:"complete"} JSON payload.

export default function QuizPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [answer, setAnswer] = useState("");
  const [redirecting, setRedirecting] = useState(false);

  // 1. Initialize Quiz Hook
  // We use a custom hook to handle all the complex quiz logic (fetching questions, submitting answers).
  const { currentQ, loading, error, done, summary, submitAnswer } = useQuiz({
    onComplete: async ({ profile, summary }) => {
      // 2. Save Results
      // When the quiz is done, we save the generated profile to the database.
      try {
        await api.profile.upsert({
          profile_type: "ai_quiz",
          profile: profile || {},
          summary: summary || "",
          created_at: new Date().toISOString(),
        });
      } catch (err) {
        console.error("Failed to save profile:", err);
      }
    },
  });

  // 3. Auto-Redirect
  // Once the quiz is finished and saved, we send the user to their dashboard.
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

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="bw-container mt-8">
        <div className="flex justify-center">
          <div className="w-full max-w-[420px]">
            <h1 className="text-2xl font-semibold mb-4">
              Spending Profile Quiz
            </h1>
            <div className="bw-card p-6">
              <p className="text-sm text-[var(--color-text-muted)]">
                Verifying your session...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!authLoading && !user) {
    return (
      <div className="bw-container mt-8">
        <div className="flex justify-center">
          <div className="w-full max-w-[420px]">
            <h1 className="text-2xl font-semibold mb-4">
              Spending Profile Quiz
            </h1>
            <div className="bw-card p-6">
              <p className="text-sm text-[var(--color-text-muted)] mb-4">
                You need to be logged in to take the quiz.
              </p>
              <button
                onClick={() => router.push("/login")}
                className="bw-btn bw-btn-primary"
              >
                Go to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (done) {
    return (
      <div className="bw-container max-w-lg">
        <h1 className="text-2xl font-semibold mb-4">Quiz Complete! ✅</h1>
        <p className="text-[var(--color-text-muted)] mb-4">
          Your profile has been saved. These insights will power personalized
          budgeting advice.
        </p>
        {summary?.summary && (
          <div className="bw-card p-4 text-sm mb-3 whitespace-pre-wrap">
            {summary.summary}
          </div>
        )}
        <div className="bw-card p-4 bg-blue-900/20 border-blue-500/30 mb-4">
          <p className="text-sm text-blue-300">
            {redirecting
              ? "Redirecting to dashboard in a moment..."
              : "Preparing your dashboard..."}
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
        <div className="w-full max-w-[420px] px-4 md:px-0">
          <h1 className="text-2xl font-semibold mb-2 text-center md:text-left">
            Spending Profile Quiz
          </h1>
          <p className="text-sm text-[var(--color-text-muted)] mb-6 text-center md:text-left">
            Don't worry if you're not sure—you can update these values in{" "}
            <span className="font-medium text-[var(--color-text)]">
              Settings
            </span>{" "}
            later.
          </p>

          <div className="bw-card p-6 space-y-6 shadow-lg">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            {!currentQ && (
              <div className="flex flex-col items-center justify-center py-8 space-y-4">
                <div className="w-8 h-8 border-2 border-[var(--buttoncolor1)] border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-[var(--color-text-muted)] animate-pulse">
                  {loading ? "Loading first question..." : "Preparing quiz..."}
                </p>
              </div>
            )}
            {currentQ && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                <QuizQuestion
                  question={currentQ}
                  value={answer}
                  onChange={setAnswer}
                  disabled={loading}
                />
                <div className="flex justify-end mt-6">
                  <button
                    disabled={loading || !answer}
                    onClick={handleSubmit}
                    className="bw-btn bw-btn-primary w-full md:w-auto flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Thinking...</span>
                      </>
                    ) : (
                      "Next"
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
