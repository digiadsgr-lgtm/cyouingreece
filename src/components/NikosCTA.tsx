'use client';

export default function NikosCTA() {
  return (
    <button
      onClick={() => {
        const b = document.querySelector<HTMLButtonElement>('[aria-label="Plan my trip with Nikos"]');
        b?.click();
      }}
      className="inline-flex items-center gap-4 px-10 py-5 border border-[#D4A027]/60 text-[#D4A027] text-xs tracking-[0.25em] uppercase font-bold hover:bg-[#D4A027] hover:text-[#0A1628] transition-all duration-300"
    >
      Start the conversation
    </button>
  );
}
