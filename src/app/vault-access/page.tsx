


export default function VaultAccess() {
  return (
    <main className="bg-[#0A0A0A] min-h-screen">

      <section className="pt-32 pb-20 px-6 max-w-3xl mx-auto min-h-[80vh] flex flex-col justify-center items-center">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif text-brand-golden tracking-widest uppercase mb-4">Vault Access</h1>
          <p className="text-white/60 uppercase tracking-widest text-xs leading-relaxed max-w-lg mx-auto">
            Exclusive intelligence, private villa access, and bespoke travel arrangements for our members.
          </p>
        </div>

        <form className="w-full max-w-md border border-white/10 p-8 bg-[#111]/50 backdrop-blur-md">
          <div className="mb-6">
            <label className="block text-white/40 text-[10px] uppercase tracking-[0.2em] mb-2">Access Key</label>
            <input 
              type="password" 
              className="w-full bg-transparent border-b border-white/20 focus:border-brand-golden text-white py-2 px-1 outline-none transition-colors"
              placeholder="Enter your member key"
            />
            <p className="text-white/30 text-[10px] mt-2 italic">
              *The Vault is a conceptual VIP area for premium members. (Preview Code: NIKOS2026)
            </p>
          </div>
          <button type="button" className="w-full bg-white text-black py-4 uppercase tracking-[0.2em] text-xs font-semibold hover:bg-brand-golden hover:text-white transition-colors duration-500">
            Enter the Vault
          </button>
          
          <div className="mt-8 text-center">
            <p className="text-white/40 text-[10px] uppercase tracking-[0.1em]">Not a member?</p>
            <button type="button" className="text-brand-golden text-[10px] uppercase tracking-[0.2em] mt-2 underline underline-offset-4 hover:text-white transition-colors">
              Request Invitation
            </button>
          </div>
        </form>
      </section>

    </main>
  );
}
