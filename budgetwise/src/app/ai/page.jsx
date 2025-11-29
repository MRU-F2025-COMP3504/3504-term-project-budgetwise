"use client";
import { useState } from "react";
import api from "@/services/api";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function AIPage() {
  const [messages, setMessages] = useState([
    { role: "system", content: "Ask me about affordability or spending insights." }
  ]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;
    
    const userMessage = { role: "user", content: userInput.trim() };
    setMessages(prev => [...prev, userMessage]);
    setUserInput("");
    setLoading(true);
    
    try {
      const { data } = await api.ai.chat(userInput.trim(), { messages });
      const assistantReply = data.reply || "This is a stub response until /api/ai is implemented.";
      setMessages(prev => [...prev, { role: "assistant", content: assistantReply }]);
    } catch (err) {
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: `Error: ${err.message}` 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="bw-container max-w-2xl">
      <h1 className="text-2xl font-semibold mb-4">AI Assistant</h1>
      
      <div className="bw-card p-4 space-y-3 h-[480px] flex flex-col">
        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto space-y-2">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`p-2 rounded-md text-sm ${
                message.role === "user"
                  ? "bg-[var(--buttoncolor1)] text-white ml-auto max-w-[75%]"
                  : message.role === "assistant"
                  ? "bg-[var(--surface-raised)] max-w-[75%] markdown-content"
                  : "text-[var(--textcolor3)] text-xs italic"
              }`}
            >
              {message.role === "assistant" ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
              ) : (
                message.content
              )}
            </div>
          ))}
          {loading && (
            <p className="text-xs text-[var(--color-text-muted)]">AI is thinking...</p>
          )}
        </div>
        
        {/* Input Area */}
        <div className="flex gap-2">
          <input
            className="bw-input flex-1"
            placeholder="e.g., Can I afford a $60 dinner this Friday?"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
          />
          <button
            onClick={handleSendMessage}
            disabled={loading || !userInput.trim()}
            className="bw-btn bw-btn-accent"
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
