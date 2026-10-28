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
    scrollToBottom();
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
    <div className="flex-1 flex flex-col max-w-3xl mx-auto w-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-8 space-y-8">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-warm-500 mb-12">
              Start a conversation or try one of these:
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {SUGGESTED_QUESTIONS.map((question) => (
                <button
                  key={question}
                  onClick={() => sendMessage(question)}
                  className="p-4 min-h-12 text-left text-sm text-warm-600 border border-warm-100 hover:border-warm-300 transition-colors"
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
                className={`max-w-[80%] px-5 py-4 ${
                  message.role === "user"
                    ? "bg-charcoal text-white"
                    : "bg-warm-50 text-charcoal"
                }`}
              >
                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                  {message.content}
                </div>
              </div>
            </div>
          ))
        )}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-warm-50 px-5 py-4">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-warm-300 rounded-full animate-bounce" />
                <div
                  className="w-2 h-2 bg-warm-300 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                />
                <div
                  className="w-2 h-2 bg-warm-300 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                />
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="flex justify-center">
            <div className="bg-red-50 text-red-700 px-4 py-2 text-sm">
              {error}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-warm-100 p-4 md:p-6">
        <form onSubmit={handleSubmit} className="flex gap-3 md:gap-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about ceramics..."
            disabled={isLoading}
            className="flex-1 min-w-0 px-4 py-3 text-base md:text-sm bg-transparent border-b border-warm-200 focus:border-charcoal outline-none transition-colors"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-6 py-3 min-h-11 text-xs uppercase tracking-widest bg-charcoal text-white hover:bg-charcoal-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </form>
        <p className="text-xs text-warm-400 mt-4 text-center">
          AI responses are for educational purposes. Always verify information for critical applications.
        </p>
      </div>
    </div>
  );
}
