"use client";

export default function InteractiveMap() {
  return (
    <div className="w-full h-48 md:h-80 rounded-2xl glass-dark flex items-center justify-center relative overflow-hidden border border-slate-700/50 mt-6 shadow-xl">
      <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center">
        <span className="text-slate-400 font-mono text-sm tracking-widest uppercase animate-pulse">
          Location Map Rendering...
        </span>
      </div>
    </div>
  );
}
