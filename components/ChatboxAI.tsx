'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Loader2, Bot, User } from 'lucide-react';

interface Message {
  role: 'user' | 'hunz';
  content: string;
  timestamp: Date;
}

export function ChatboxAI() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'hunz',
      content: 'Xin chào! Tôi là trợ lý AI của TechNews. Tôi có thể giúp gì cho bạn?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userText = input;

    const userMessage: Message = {
      role: 'user',
      content: userText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // --------------------------------------
      const GROQ_API_KEY = "---------------------------";

      const { getHomepageData } = await import('@/lib/data/homepage-data');
      const websiteData = await getHomepageData();

      const postsContext = websiteData.posts
        .map((post: any, idx: number) => 
          `${idx + 1}. [ID:${post.id}] "${post.title}" (${post.category}) - ${post.excerpt}`
        )
        .join('\n');

      const categoriesContext = websiteData.categories
        .map((cat: any) => cat.name)
        .join(', ');

      const authorsContext = websiteData.authors
        .map((author: any) => `${author.name} (${author.posts} bài viết)`)
        .join(', ');

      const systemPrompt = `Bạn là trợ lý AI của website TechNews - nền tảng tin tức công nghệ.

📌 DỮ LIỆU WEBSITE HIỆN CÓ:

🗂️ DANH MỤC: ${categoriesContext}

✍️ TÁC GIẢ: ${authorsContext}

📰 BÀI VIẾT HIỆN CÓ:
${postsContext}

⚠️ QUY TẮC QUAN TRỌNG:
1. CHỈ trả lời về các bài viết, chủ đề, tác giả có trong danh sách trên
2. Khi giới thiệu bài viết, PHẢI trả về link dạng: [Đọc bài: Tên bài](POST_ID_XXX) - với XXX là ID bài viết
3. Ví dụ: "Bài mới nhất là [Đọc bài: ChatGPT và tương lai của AI](POST_ID_1)"
4. Nếu người dùng hỏi về chủ đề KHÔNG có trong dữ liệu, hãy nói: "Hiện tại website chưa có bài viết về chủ đề này. Bạn có thể xem các danh mục: ${categoriesContext}"
5. Nếu người dùng hỏi chung chung, hãy gợi ý các bài viết phổ biến từ danh sách
6. Luôn dựa vào dữ liệu thực tế, KHÔNG bịa đặt thông tin
7. Trả lời ngắn gọn, thân thiện, đúng trọng tâm`;

      const response = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${GROQ_API_KEY}`
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [
              {
                role: "system",
                content: systemPrompt
              },
              {
                role: "user",
                content: userText
              }
            ],
            temperature: 0.7,
            max_tokens: 1000
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || "API lỗi");
      }

      let aiText =
        data?.choices?.[0]?.message?.content ||
        "AI không trả lời.";

      aiText = aiText.replace(
        /\[([^\]]+)\]\(POST_ID_(\d+)\)/g,
        '<a href="/posts/$2" class="text-blue-500 hover:text-blue-700 underline font-semibold" target="_blank">$1</a>'
      );

      setMessages((prev) => [
        ...prev,
        { role: "hunz", content: aiText, timestamp: new Date() },
      ]);

    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: "hunz",
          content: "❌ " + err.message,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-all z-50"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-card border rounded-2xl shadow-xl flex flex-col z-50">
          
          {/* Header */}
          <div className="bg-primary text-primary-foreground p-4 flex justify-between items-center">
            <div className="flex gap-3 items-center">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold">AI Assistant</h3>
                <p className="text-xs opacity-80">TechNews Chatbot</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-white/20 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/20">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-gradient-to-br from-purple-500 to-blue-500 text-white"
                  }`}
                >
                  {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Bubble */}
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-card border"
                  }`}
                >
                  <div
                    className="text-sm whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{ __html: msg.content }}
                  />
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="px-4 py-3 bg-card border rounded-2xl flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm text-muted-foreground">Đang suy nghĩ...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t bg-card">
            <div className="flex gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Nhập tin nhắn..."
                className="flex-1 px-4 py-3 border rounded-xl bg-background resize-none focus:ring-2 focus:ring-primary min-h-[44px]"
              />

              <button
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                className="px-4 py-3 bg-primary text-primary-foreground rounded-xl disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              </button>
            </div>

            <p className="text-xs text-muted-foreground mt-2 text-center">
              by vanhunz
            </p>
          </div>
        </div>
      )}
    </>
  );
}
