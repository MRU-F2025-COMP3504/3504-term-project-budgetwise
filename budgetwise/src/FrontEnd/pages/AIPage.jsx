"use client";
import { useState } from "react";

export default function AIPage() {
  const [messages, setMessages] = useState([
    { role: "system", content: "Ask me about affordability or spending insights." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function send() {
    if (!input.trim()) return;
    const userMsg = { role: "user", content: input.trim() };
    setMessages(m => [...m, userMsg]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMsg] })
      });
      let data = {};
      try { data = await res.json(); } catch { /* ignore */ }
      const reply = data.reply || "This is a stub response until /api/ai is implemented.";
      setMessages(m => [...m, { role: "assistant", content: reply }]);
    } catch {
      setMessages(m => [...m, { role: "assistant", content: "Error contacting AI service." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bw-container max-w-2xl">
      <h1 className="text-2xl font-semibold mb-4">AI Assistant</h1>
      <div className="bw-card p-4 space-y-3 h-[480px] flex flex-col">
        <div className="flex-1 overflow-y-auto space-y-2">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`p-2 rounded-md text-sm ${
                m.role === "user"
                  ? "bg-[var(--buttoncolor1)] text-white ml-auto max-w-[75%]"
                  : m.role === "assistant"
                  ? "bg-[var(--surface-raised)] max-w-[75%]"
                  : "text-[var(--textcolor3)] text-xs italic"
              }`}
            >
              {m.content}
            </div>
          ))}
          {loading && <p className="text-xs text-[var(--color-text-muted)]">Thinking...</p>}
        </div>
        <div className="flex gap-2">
          <input
            className="bw-input flex-1"
            placeholder="e.g., Can I afford a $60 dinner this Friday?"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") send(); }}
          />
          <button
            onClick={send}
            disabled={loading}
            className="bw-btn bw-btn-accent"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
