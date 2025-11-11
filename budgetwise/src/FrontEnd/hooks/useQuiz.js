/**
 * useQuiz - client hook managing AI onboarding quiz lifecycle
 *
 * Responsibilities:
 * - Keep chat history (assistant+user turns) sent to the server
 * - Fetch next step from /api/quiz and normalize result
 * - Track question number, loading/error, and completion summary
 *
 * Contract with /api/quiz:
 * - Request: { history: Array<{role:'assistant'|'user', content:string}> }
 * - Response JSON:
 *   - { status: 'question', id, text, inputType, options? }
 *   - { status: 'complete', profile: object, summary: string }
 */
import { useCallback, useEffect, useMemo, useState } from 'react';

export default function useQuiz({ apiPath = '/api/quiz', onComplete } = {}) {
  const [history, setHistory] = useState([
    { role: 'user', content: "Hi! I'm ready to start the budgeting quiz." },
  ]);
  const [currentQ, setCurrentQ] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [summary, setSummary] = useState(null);

  const questionCount = useMemo(
    () => history.filter((m) => m.role === 'assistant').length,
    [history]
  );

  const displayQuestionNumber = useMemo(() => {
    if (!currentQ) return 0;
    return Math.max(1, questionCount);
  }, [currentQ, questionCount]);

  const fetchNext = useCallback(async (h) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(apiPath, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ history: h }),
      });
      const payload = await res.json();
      if (!res.ok) throw new Error(payload?.error || 'AI error');

      const data = payload?.data;
      if (data?.status === 'question') {
        setCurrentQ(data);
        setHistory((prev) => [...prev, { role: 'assistant', content: data.text }]);
      } else if (data?.status === 'complete') {
        setDone(true);
        setSummary({ profile: data.profile, summary: data.summary });
        if (typeof onComplete === 'function') {
          try { onComplete({ profile: data.profile, summary: data.summary, history: h }); } catch {}
        }
      } else {
        throw new Error('Unexpected AI response format');
      }
    } catch (e) {
      setError(e?.message || 'Failed to contact AI');
    } finally {
      setLoading(false);
    }
  }, [apiPath, onComplete]);

  // Auto-start quiz on mount
  useEffect(() => {
    fetchNext(history);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submitAnswer = useCallback(async (answer, q = currentQ) => {
    if (!q || !answer) return;
    const userTurn = { role: 'user', content: `Answer to ${q.id}: ${answer}` };
    const nextHistory = [...history, userTurn];
    setHistory(nextHistory);
    await fetchNext(nextHistory);
  }, [currentQ, history, fetchNext]);

  return {
    // state
    currentQ,
    loading,
    error,
    done,
    summary,
    displayQuestionNumber,
    // actions
    submitAnswer,
  };
}
