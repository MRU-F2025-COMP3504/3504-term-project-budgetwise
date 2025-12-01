"use client";
import { useState, useEffect } from "react";
import api from "@/services/api";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function AIPage() {
  const [messages, setMessages] = useState([
    { role: "system", content: "Ask me about affordability or spending insights." }
  ]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("bw_ai_chat_history");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
        }
      } catch (e) {
        console.error("Failed to parse chat history", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever messages change
  useEffect(() => {
    if (isLoaded && messages.length > 0) {
      localStorage.setItem("bw_ai_chat_history", JSON.stringify(messages));
    }
  }, [messages, isLoaded]);

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

  const handleClearChat = () => {
    const initialMsg = [{ role: "system", content: "Ask me about affordability or spending insights." }];
    setMessages(initialMsg);
    localStorage.removeItem("bw_ai_chat_history");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="bw-container max-w-2xl">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">AI Assistant</h1>
        <button 
          onClick={handleClearChat}
          className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-danger)] transition-colors px-3 py-1 rounded border border-[var(--color-border)] hover:border-[var(--color-danger)]"
          title="Clear conversation history"
        >
          Clear Chat
        </button>
      </div>
      
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
