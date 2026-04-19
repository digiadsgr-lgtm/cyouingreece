'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { X, Send, ChevronDown, ChevronUp, Download } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface DayPlan {
  day: number;
  location: string;
  mustDo: string;
  restaurant: string;
  localTip: string;
}

// ─── System Prompt ───────────────────────────────────────────────────────────

const NIKOS_SYSTEM = `You are Nikos Papadimitriou, a 45-year-old Greek travel journalist born in Thessaloniki, who has visited every inhabited Greek island and hiked every major mountain trail on the mainland. You write for a travel publication and know Greece the way a local does — not from guidebooks. You know that the best psarotaverna in Kalymnos is Panormos Tavern in the harbor, that Folegandros is best in May before the crowds arrive, that you should avoid Mykonos in August but it's perfect in late September, that the secret beach near Voidokilia in Messinia is accessed via a 20-minute walk most tourists miss. You never recommend tourist traps. You always give specific names, not vague descriptions. Your tone is warm, slightly witty, and confident — like a trusted friend who happens to be an expert. You respond in the user's language automatically (detect from their input). When building itineraries, always include: specific restaurant names, approximate budget per day in euros, ferry route details where relevant, and one 'local secret' per destination. Keep responses conversational and under 200 words unless building a full itinerary.

When you have gathered enough info to build an itinerary (travel party, duration, rough dates, priorities), output a special JSON block at the END of your reply, wrapped in <ITINERARY> tags like this:
<ITINERARY>
{"days": [{"day":1,"location":"Santorini","mustDo":"Watch sunset from Imerovigli (not Oia — less crowded)","restaurant":"Argo Restaurant, Fira — order the fresh catch","localTip":"Take the donkey path down to Amoudi Bay at dawn"},{"day":2,...}],"budgetPerDay":"€120–€180","transport":"Athens → Santorini: Blue Star ferry 8h or 35min flight","notes":"Book Argo 2 days ahead in peak season"}
</ITINERARY>`;

// ─── Quick Start Chips ────────────────────────────────────────────────────────

const CHIPS = [
  'Build my perfect itinerary',
  'Surprise me with something unexpected',
  'Best beaches for this time of year',
];

// ─── Nikos Avatar ─────────────────────────────────────────────────────────────

function NikosAvatar({ size = 36 }: { size?: number }) {
  return (
    <div
      style={{ width: size, height: size, minWidth: size }}
      className="rounded-full overflow-hidden border-2 border-[#D4A027]/40 flex items-center justify-center bg-[#1a3a5c] text-white font-bold text-sm"
    >
      {/* CSS Face Illustration */}
      <svg viewBox="0 0 40 40" width={size} height={size}>
        {/* skin */}
        <circle cx="20" cy="20" r="18" fill="#c8956c" />
        {/* hair salt-and-pepper */}
        <ellipse cx="20" cy="9" rx="11" ry="6" fill="#555" />
        <circle cx="10" cy="14" r="4" fill="#555" />
        <circle cx="30" cy="14" r="4" fill="#555" />
        {/* stubble */}
        <ellipse cx="20" cy="28" rx="8" ry="4" fill="#b07040" />
        {/* sunglasses frame */}
        <rect x="9" y="17" width="9" height="5" rx="2" fill="#1a1a1a" />
        <rect x="22" y="17" width="9" height="5" rx="2" fill="#1a1a1a" />
        <line x1="18" y1="19" x2="22" y2="19" stroke="#1a1a1a" strokeWidth="1.5" />
        {/* arms */}
        <line x1="9" y1="19" x2="6" y2="18" stroke="#1a1a1a" strokeWidth="1.5" />
        <line x1="31" y1="19" x2="34" y2="18" stroke="#1a1a1a" strokeWidth="1.5" />
        {/* smile */}
        <path d="M14 28 Q20 33 26 28" stroke="#8b5e3c" strokeWidth="1.5" fill="none" />
      </svg>
    </div>
  );
}

// ─── Typing Indicator ─────────────────────────────────────────────────────────

function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-4 py-3 bg-white/10 border border-white/10 rounded-2xl rounded-bl-none w-fit">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-2 h-2 rounded-full bg-[#D4A027] animate-bounce"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  );
}

// ─── Itinerary Trip Card ──────────────────────────────────────────────────────

function TripCard({ data }: { data: any }) {
  const [openDays, setOpenDays] = useState<Set<number>>(new Set([1]));

  const toggle = (day: number) => {
    setOpenDays((prev) => {
      const next = new Set(prev);
      next.has(day) ? next.delete(day) : next.add(day);
      return next;
    });
  };

  return (
    <div className="mt-3 bg-[#0A1628] border border-[#D4A027]/30 rounded-2xl overflow-hidden">
      <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
        <span className="text-[#D4A027] text-xs uppercase tracking-widest font-semibold">Your Itinerary</span>
        <button
          onClick={() => alert('PDF export coming soon!')}
          className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
        >
          <Download size={13} /> Export PDF
        </button>
      </div>

      <div className="divide-y divide-white/5">
        {data.days?.map((day: DayPlan) => (
          <div key={day.day}>
            <button
              onClick={() => toggle(day.day)}
              className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-white/5 transition-colors text-left"
            >
              <div>
                <span className="text-[#D4A027] text-xs font-semibold mr-3">Day {day.day}</span>
                <span className="text-white text-sm font-serif">{day.location}</span>
              </div>
              {openDays.has(day.day) ? (
                <ChevronUp size={14} className="text-gray-400" />
              ) : (
                <ChevronDown size={14} className="text-gray-400" />
              )}
            </button>

            {openDays.has(day.day) && (
              <div className="px-5 pb-4 space-y-2 text-sm">
                <div className="flex gap-2">
                  <span className="text-[#D4A027] text-xs mt-0.5">★</span>
                  <span className="text-gray-200">{day.mustDo}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-[#D4A027] text-xs mt-0.5">🍽</span>
                  <span className="text-gray-300">{day.restaurant}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-[#D4A027] text-xs mt-0.5">🔑</span>
                  <span className="text-gray-400 italic">{day.localTip}</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="px-5 py-3.5 border-t border-white/10 flex flex-wrap gap-4 text-xs text-gray-400">
        {data.budgetPerDay && (
          <span><span className="text-white">Budget:</span> {data.budgetPerDay}</span>
        )}
        {data.transport && (
          <span><span className="text-white">Transport:</span> {data.transport}</span>
        )}
      </div>
    </div>
  );
}

// ─── Message Bubble ───────────────────────────────────────────────────────────

function Bubble({ msg, streaming }: { msg: Message; streaming?: boolean }) {
  const isUser = msg.role === 'user';

  // Parse out itinerary if present
  const itineraryMatch = msg.content.match(/<ITINERARY>([\s\S]*?)<\/ITINERARY>/);
  const textContent = msg.content.replace(/<ITINERARY>[\s\S]*?<\/ITINERARY>/, '').trim();
  let itineraryData = null;
  if (itineraryMatch) {
    try { itineraryData = JSON.parse(itineraryMatch[1]); } catch {}
  }

  return (
    <div className={`flex items-end gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {!isUser && <NikosAvatar size={28} />}
      <div className={`max-w-[80%] ${isUser ? 'items-end' : 'items-start'} flex flex-col`}>
        <div
          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
            isUser
              ? 'bg-[#D4A027] text-[#0A1628] font-medium rounded-br-none'
              : 'bg-white/8 border border-white/10 text-gray-100 font-light rounded-bl-none'
          }`}
        >
          {textContent}
          {streaming && (
            <span className="inline-block w-0.5 h-4 bg-[#D4A027] ml-0.5 animate-pulse align-middle" />
          )}
        </div>
        {itineraryData && <TripCard data={itineraryData} />}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AnthropicGuide() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [started, setStarted] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, streamingContent]);

  // Auto-expand textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 96) + 'px';
    }
  }, [input]);

  // First welcome message on open
  useEffect(() => {
    if (isOpen && !started) {
      setStarted(true);
      setTimeout(() => streamMessage(
        "Γεια σου! I'm Nikos. Tell me — what kind of Greece are you dreaming of? Relaxation on a quiet beach, ancient history, great food, adventure... or something you can't quite put into words yet?",
        true // system-injected, no API call
      ), 600);
    }
  }, [isOpen]);

  // ── Streaming helper ─────────────────────────────────────────────────────────
  const streamMessage = useCallback(async (text: string, mock = false) => {
    if (mock) {
      // Animate locally without API
      setIsTyping(false);
      setIsStreaming(true);
      setStreamingContent('');
      let i = 0;
      const interval = setInterval(() => {
        setStreamingContent(text.slice(0, ++i));
        if (i >= text.length) {
          clearInterval(interval);
          setIsStreaming(false);
          setMessages((prev) => [...prev, { role: 'assistant', content: text }]);
          setStreamingContent('');
        }
      }, 14);
      return;
    }

    setIsTyping(false);
    setIsStreaming(true);
    setStreamingContent('');

    try {
      const res = await fetch('/api/concierge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: messages.concat([{ role: 'user', content: text }]) }),
      });

      if (!res.ok || !res.body) throw new Error('Bad response');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let full = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        // SSE format: data: {...}
        const lines = chunk.split('\n');
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const payload = line.slice(6);
            if (payload === '[DONE]') continue;
            try {
              const parsed = JSON.parse(payload);
              const token = parsed.delta?.text ?? '';
              full += token;
              setStreamingContent(full);
            } catch {}
          }
        }
      }

      setIsStreaming(false);
      setMessages((prev) => [...prev, { role: 'assistant', content: full }]);
      setStreamingContent('');
    } catch {
      setIsStreaming(false);
      const err = 'The Aegean breeze disrupted my connection — please try again.';
      setMessages((prev) => [...prev, { role: 'assistant', content: err }]);
      setStreamingContent('');
    }
  }, [messages]);

  // ── Send ─────────────────────────────────────────────────────────────────────
  const handleSend = useCallback(async () => {
    const text = input.trim();
    if (!text || isStreaming || isTyping) return;
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: text }]);
    setIsTyping(true);
    await streamMessage(text);
  }, [input, isStreaming, isTyping, streamMessage]);

  const handleChip = useCallback((chip: string) => {
    setMessages((prev) => [...prev, { role: 'user', content: chip }]);
    setIsTyping(true);
    streamMessage(chip);
  }, [streamMessage]);

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* ── Floating Trigger ───────────────────────────────────────────────── */}
      <button
        aria-label="Plan my trip with Nikos"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#0A1628] border border-[#D4A027]/50 text-white pl-2 pr-5 py-2 rounded-full shadow-2xl hover:scale-105 transition-transform group"
        style={{ boxShadow: '0 0 0 0 rgba(212,160,39,0.4)', animation: 'nikoPulse 2.5s ease-out infinite' }}
      >
        <NikosAvatar size={36} />
        <span className="text-sm font-medium tracking-wide hidden sm:block">Plan my trip</span>
        <style>{`
          @keyframes nikoPulse {
            0%   { box-shadow: 0 0 0 0 rgba(212,160,39,0.4); }
            70%  { box-shadow: 0 0 0 12px rgba(212,160,39,0); }
            100% { box-shadow: 0 0 0 0 rgba(212,160,39,0); }
          }
        `}</style>
      </button>

      {/* ── Modal ─────────────────────────────────────────────────────────── */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-stretch sm:items-end sm:justify-end p-0 sm:p-6">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Panel */}
          <div
            className="relative flex flex-col w-full sm:w-[420px] h-full sm:h-[620px] bg-[#07101F] border border-white/10 rounded-none sm:rounded-2xl shadow-2xl overflow-hidden"
            style={{ animation: 'slideInRight 0.35s cubic-bezier(0.16,1,0.3,1)' }}
          >
            <style>{`
              @keyframes slideInRight {
                from { opacity:0; transform:translateX(30px) }
                to   { opacity:1; transform:translateX(0) }
              }
            `}</style>

            {/* Header */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10 bg-[#050D1A]">
              <NikosAvatar size={40} />
              <div className="flex-1">
                <p className="text-white font-semibold text-sm">Nikos Papadimitriou</p>
                <p className="text-[#D4A027] text-[10px] uppercase tracking-widest">Greek Travel Journalist</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-white transition-colors p-1"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Quick-start chips (only before conversation) */}
              {messages.length <= 1 && !isStreaming && (
                <div className="flex flex-col gap-2 pt-2">
                  {CHIPS.map((chip) => (
                    <button
                      key={chip}
                      onClick={() => handleChip(chip)}
                      className="text-left text-xs text-gray-300 border border-white/15 hover:border-[#D4A027]/60 hover:text-white px-4 py-2.5 rounded-xl transition-all hover:bg-white/5"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              )}

              {messages.map((msg, i) => (
                <Bubble key={i} msg={msg} />
              ))}

              {isTyping && (
                <div className="flex items-end gap-2.5">
                  <NikosAvatar size={28} />
                  <TypingDots />
                </div>
              )}

              {isStreaming && streamingContent && (
                <Bubble
                  msg={{ role: 'assistant', content: streamingContent }}
                  streaming
                />
              )}

              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="border-t border-white/10 p-3 bg-[#050D1A]">
              <div className="flex items-end gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2 focus-within:border-[#D4A027]/50 transition-colors">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder="Ask Nikos anything about Greece…"
                  rows={1}
                  className="flex-1 bg-transparent text-white text-sm placeholder:text-gray-600 resize-none focus:outline-none leading-relaxed py-1"
                  style={{ maxHeight: '96px' }}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isStreaming}
                  className="text-[#D4A027] hover:text-yellow-300 disabled:text-gray-600 transition-colors pb-1 flex-shrink-0"
                >
                  <Send size={18} />
                </button>
              </div>
              <p className="text-center text-[10px] text-gray-700 mt-2">
                Enter to send · Shift+Enter for new line
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
