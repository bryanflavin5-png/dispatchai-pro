import React, { useState, useRef, useEffect } from 'react';
import { getAIAdvice } from '../services/geminiService';
import { ChatMessage, Driver, Load } from '../types';
import { Bot, Send, X, Loader2, Sparkles } from 'lucide-react';

interface AIAssistantProps {
  drivers: Driver[];
  loads: Load[];
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ drivers, loads }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: 'Hello! I am your AI Dispatch Assistant. I can help you find the best driver for a load, draft updates for customers, or analyze your current fleet status. How can I help?',
      timestamp: new Date()
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const responseText = await getAIAdvice(input, { drivers, loads });

    const aiMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: responseText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, aiMsg]);
    setLoading(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 z-50 flex items-center gap-2"
      >
        <Bot size={24} />
        <span className="font-medium hidden md:inline">Ask AI</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col z-50 overflow-hidden font-sans">
      {/* Header */}
      <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-blue-500 p-1.5 rounded-lg">
            <Sparkles size={16} className="text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">Dispatch Copilot</h3>
            <p className="text-xs text-slate-400">Powered by Gemini 2.5</p>
          </div>
        </div>
        <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors">
          <X size={20} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-slate-50 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl p-3 text-sm leading-relaxed shadow-sm ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-white text-slate-700 border border-slate-200 rounded-bl-none'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-none p-3 shadow-sm">
              <Loader2 size={20} className="animate-spin text-blue-600" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 bg-white border-t border-slate-100">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about drivers, routes, or drafts..."
            className="flex-1 bg-slate-100 border-0 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white p-3 rounded-xl transition-colors"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
