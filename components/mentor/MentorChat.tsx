"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTED_QUESTIONS = [
  "How do I fix a glaze that's crawling?",
  "What's the difference between stoneware and porcelain?",
  "How do I achieve a matte finish at cone 6?",
  "What should I know about wood firing?",
  "How do I center clay on the wheel?",
  "What causes bloating in high-fire clay?",
];

export function MentorChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (messages.length) scrollToBottom();
  }, [messages]);

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    setError(null);
    const userMessage: Message = { role: "user", content };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to get response");
      }

      const data = await response.json();
      const assistantMessage: Message = {
        role: "assistant",
        content: data.message,
      };
      setMessages([...newMessages, assistantMessage]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="flex-1 flex flex-col w-full">
      {/* Messages */}
      <div className="flex-1 py-6 md:py-10 space-y-6">
        {messages.length === 0 ? (
          <div>
            <p className="eyebrow mb-4">Start with one of these, or ask your own</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {SUGGESTED_QUESTIONS.map((question) => (
                <button
                  key={question}
                  onClick={() => sendMessage(question)}
                  className="p-4 min-h-12 text-left font-serif text-[1.15rem] leading-snug text-ink-2 border border-line bg-paper-soft hover:border-line-strong hover:text-ink transition-colors duration-400"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((message, i) => (
            <div
              key={i}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[88%] md:max-w-[80%] px-5 py-4 ${
                  message.role === "user"
                    ? "bg-ink text-paper rounded-2xl rounded-br-sm"
                    : "bg-paper-soft border border-line text-ink rounded-2xl rounded-bl-sm"
                }`}
              >
                <div className="whitespace-pre-wrap text-body-md leading-relaxed">
                  {message.content}
                </div>
              </div>
            </div>
          ))
        )}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-paper-soft border border-line rounded-2xl rounded-bl-sm px-5 py-4" role="status" aria-label="The mentor is thinking">
              <div className="flex gap-1.5">
                <div className="w-1.5 h-1.5 bg-terracotta rounded-full animate-breathe" />
                <div className="w-1.5 h-1.5 bg-terracotta rounded-full animate-breathe" style={{ animationDelay: "0.3s" }} />
                <div className="w-1.5 h-1.5 bg-terracotta rounded-full animate-breathe" style={{ animationDelay: "0.6s" }} />
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="flex justify-center">
            <div className="bg-terracotta-wash text-rust px-4 py-2 text-body-sm">
              {error}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="sticky bottom-[var(--tabbar)] md:bottom-0 bg-paper/95 backdrop-blur-md border-t border-line py-3 md:py-5">
        <form onSubmit={handleSubmit} className="flex gap-3 md:gap-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about clay, glaze, firing…"
            disabled={isLoading}
            className="flex-1 min-w-0 px-4 min-h-12 text-base bg-paper-soft border border-line-strong rounded-full focus:border-ink outline-none transition-colors duration-400 placeholder:text-ink-3/70"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="btn-primary rounded-full min-h-12 px-6"
          >
            Send
          </button>
        </form>
        <p className="text-[11px] text-ink-3 mt-2 text-center">
          An AI mentor. Check anything safety-related (kilns, toxic materials) against a trusted source.
        </p>
      </div>
    </div>
  );
}
