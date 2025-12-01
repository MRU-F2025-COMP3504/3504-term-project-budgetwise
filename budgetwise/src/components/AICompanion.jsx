"use client";
import { useState, useEffect, useRef } from "react";
import { Bot, X, Send, MessageCircle, Edit2, Check, Sparkles } from "lucide-react";
import api from "@/services/api";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function AICompanion() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "system", content: "Ask me about affordability or spending insights." }
  ]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Companion Name State
  const [buddyName, setBuddyName] = useState("BudgetBuddy");
  const [isNaming, setIsNaming] = useState(false);
  const [tempName, setTempName] = useState("");

  const messagesEndRef = useRef(null);

  // Load state from localStorage
  useEffect(() => {
    // Load Chat History
    const savedChat = localStorage.getItem("bw_ai_chat_history");
    if (savedChat) {
      try {
        const parsed = JSON.parse(savedChat);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
        }
      } catch (e) {
        console.error("Failed to parse chat history", e);
      }
    }

    // Load Buddy Name
    const savedName = localStorage.getItem("bw_ai_buddy_name");
    if (savedName) {
      setBuddyName(savedName);
    }

    setIsLoaded(true);
  }, []);

  // Save Chat History
  useEffect(() => {
    if (isLoaded && messages.length > 0) {
      localStorage.setItem("bw_ai_chat_history", JSON.stringify(messages));
    }
  }, [messages, isLoaded]);

  // Save Buddy Name
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("bw_ai_buddy_name", buddyName);
    }
  }, [buddyName, isLoaded]);

  // Scroll to bottom on new message
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;
    
    const userMessage = { role: "user", content: userInput.trim() };
    setMessages(prev => [...prev, userMessage]);
    setUserInput("");
    setLoading(true);
    
    try {
      const { data } = await api.ai.chat(userInput.trim(), { messages });
      const assistantReply = data.reply || "I'm having trouble connecting right now.";
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

  const handleNameSave = () => {
    if (tempName.trim()) {
      setBuddyName(tempName.trim());
    }
    setIsNaming(false);
  };

  const startNaming = () => {
    setTempName(buddyName);
    setIsNaming(true);
  };

  const handleClearChat = () => {
    const initialMsg = [{ role: "system", content: "Ask me about affordability or spending insights." }];
    setMessages(initialMsg);
    localStorage.removeItem("bw_ai_chat_history");
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
      
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-[350px] md:w-[400px] h-[500px] bg-[var(--card-bg)] border border-[var(--color-border)] rounded-2xl shadow-2xl flex flex-col overflow-hidden pointer-events-auto animate-in slide-in-from-bottom-5 fade-in duration-200">
          {/* Header */}
          <div className="p-4 border-b border-[var(--color-border)] bg-[var(--surface-raised)] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-lg">
                <Bot size={18} />
              </div>
              
              {isNaming ? (
                <div className="flex items-center gap-1">
                  <input 
                    className="bw-input py-1 px-2 text-sm w-32"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleNameSave()}
                    autoFocus
                  />
                  <button onClick={handleNameSave} className="p-1 hover:text-green-400 text-[var(--color-text-muted)]">
                    <Check size={14} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 group cursor-pointer" onClick={startNaming} title="Click to rename">
                  <h3 className="font-semibold text-[var(--color-text)]">{buddyName}</h3>
                  <Edit2 size={12} className="opacity-0 group-hover:opacity-100 text-[var(--color-text-muted)] transition-opacity" />
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
               <button 
                onClick={handleClearChat}
                className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-danger)] transition-colors"
                title="Clear History"
              >
                Clear
              </button>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors p-1"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[var(--background)]">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                    message.role === "user"
                      ? "bg-[var(--buttoncolor1)] text-white rounded-tr-none"
                      : message.role === "assistant"
                      ? "bg-[var(--surface-raised)] text-[var(--color-text)] rounded-tl-none border border-[var(--color-border)] markdown-content"
                      : "hidden" // Hide system messages
                  }`}
                >
                  {message.role === "assistant" ? (
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
                  ) : (
                    message.content
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-[var(--surface-raised)] p-3 rounded-2xl rounded-tl-none border border-[var(--color-border)] flex gap-1 items-center">
                  <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 bg-[var(--card-bg)] border-t border-[var(--color-border)]">
            <div className="relative">
              <input
                className="bw-input w-full pr-10 py-3 rounded-xl"
                placeholder={`Ask ${buddyName}...`}
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={loading}
              />
              <button
                onClick={handleSendMessage}
                disabled={loading || !userInput.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-indigo-500 hover:text-indigo-400 disabled:opacity-50 transition-colors"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`pointer-events-auto w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 ${
          isOpen 
            ? "bg-[var(--surface-raised)] text-[var(--color-text)] border border-[var(--color-border)]" 
            : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white animate-pulse-slow"
        }`}
      >
        {isOpen ? (
          <X size={24} />
        ) : (
          <div className="relative">
            <Sparkles size={24} />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-pink-500"></span>
            </span>
          </div>
        )}
      </button>
    </div>
  );
}
