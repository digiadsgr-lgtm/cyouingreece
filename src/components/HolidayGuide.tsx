'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function HolidayGuide() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    destinations: '',
    duration: '',
    budget: '',
    preferences: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [itinerary, setItinerary] = useState<any>(null);

  const steps = [
    { id: 'geo_params', label: 'TARGET SECTORS', field: 'destinations', placeholder: 'Input Coordinates (e.g. Cyclades, Crete)...' },
    { id: 'time_matrix', label: 'TEMPORAL SPAN', field: 'duration', placeholder: 'Duration in cycles (e.g. 7 Days)...' },
    { id: 'resource_alloc', label: 'RESOURCE ALLOCATION', field: 'budget', placeholder: 'Budget parameters (Mid, Premium, Unlimited)...' },
    { id: 'user_directive', label: 'USER DIRECTIVES', field: 'preferences', placeholder: 'Specify variables (Gastronomy, Archaeology, Isolation)...' }
  ];

  const handleNext = () => { if (step < steps.length - 1) setStep(step + 1); };
  const handleBack = () => { if (step > 0) setStep(step - 1); };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/guide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      setItinerary(data);
    } catch (err) {
      console.error(err);
    }
    setIsGenerating(false);
  };

  return (
    <section className="py-24 relative z-10 w-full flex justify-center px-4">
      <div className="w-full max-w-4xl glass-panel p-8 md:p-12 rounded-[2rem] relative overflow-hidden">
        {/* Terminal Header */}
        <div className="flex items-center justify-between border-b border-[rgba(0,255,255,0.2)] pb-6 mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-3 h-3 bg-[#0ff] rounded-full animate-pulse shadow-[0_0_10px_#0ff]"></div>
            <h2 className="text-2xl font-space tracking-[0.2em] uppercase neon-text">Oracle UI // Node 7</h2>
          </div>
          <div className="text-[10px] text-[rgba(255,255,255,0.5)] font-space tracking-widest hidden md:block">
            SECURITY CLEARANCE: VERIFIED
          </div>
        </div>

        {!itinerary ? (
          <div className="relative min-h-[300px] flex flex-col justify-between">
            <AnimatePresence mode="wait">
              {isGenerating ? (
                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center py-20">
                  <div className="w-16 h-16 border-4 border-t-[#0ff] border-r-transparent border-b-[#b026ff] border-l-transparent rounded-full animate-spin mb-8 shadow-[0_0_20px_rgba(0,255,255,0.5)]"></div>
                  <p className="text-[#0ff] font-space tracking-[0.3em] text-sm animate-pulse">COMPUTING QUANTUM PROBABILITIES...</p>
                  <p className="text-[10px] text-gray-500 mt-2 font-space">EXTRACTING DATA FROM AEGEAN NODES</p>
                </motion.div>
              ) : (
                <motion.div
                  key={step}
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -50, opacity: 0 }}
                  transition={{ ease: "easeInOut", duration: 0.4 }}
                  className="w-full"
                >
                  <label className="block text-[#0ff] text-sm font-space tracking-widest mb-4">
                    [&nbsp;{steps[step].label}&nbsp;]
                  </label>
                  <input
                    type="text"
                    value={formData[steps[step].field as keyof typeof formData]}
                    onChange={(e) => setFormData({ ...formData, [steps[step].field]: e.target.value })}
                    placeholder={steps[step].placeholder}
                    className="w-full bg-[rgba(0,0,0,0.5)] border border-[rgba(0,255,255,0.2)] text-white p-4 rounded focus:outline-none focus:border-[#0ff] focus:shadow-[0_0_15px_rgba(0,255,255,0.2)] font-space text-lg transition-all"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {!isGenerating && (
              <div className="flex justify-between items-center mt-12 border-t border-[rgba(0,255,255,0.1)] pt-6">
                <div className="flex space-x-2">
                  {steps.map((_, idx) => (
                    <div key={idx} className={`w-3 h-1 ${idx === step ? 'bg-[#0ff] shadow-[0_0_5px_#0ff]' : 'bg-gray-700'} transition-all duration-300`}></div>
                  ))}
                </div>
                
                <div className="flex space-x-4">
                  {step > 0 && (
                    <button onClick={handleBack} className="px-6 py-2 border border-gray-600 text-gray-400 font-space text-sm tracking-widest uppercase hover:bg-gray-800 transition-colors">
                      &lt; Abort
                    </button>
                  )}
                  {step < steps.length - 1 ? (
                    <button onClick={handleNext} className="px-6 py-2 bg-[rgba(0,255,255,0.1)] border border-[#0ff] text-[#0ff] font-space text-sm tracking-widest uppercase hover:bg-[#0ff] hover:text-black transition-all shadow-[0_0_10px_rgba(0,255,255,0.2)]">
                      Engage &gt;
                    </button>
                  ) : (
                    <button onClick={handleGenerate} className="px-6 py-2 bg-[rgba(176,38,255,0.1)] border border-[#b026ff] text-[#b026ff] font-space text-sm tracking-widest uppercase hover:bg-[#b026ff] hover:text-white transition-all shadow-[0_0_15px_rgba(176,38,255,0.4)]">
                      Execute Matrix
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-space neon-text uppercase mb-2">Operation: {itinerary.title}</h3>
              <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#0ff] to-transparent"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {itinerary.days?.map((day: any, i: number) => (
                <div key={i} className="bg-[rgba(0,0,0,0.6)] border border-l-4 border-l-[#0ff] border-t-transparent border-r-transparent border-b-transparent p-6 hover:bg-[rgba(0,255,255,0.05)] transition-all">
                  <h4 className="text-lg font-space text-[#0ff] mb-2">Cycle {day.day}: {day.title}</h4>
                  <p className="text-gray-300 text-sm font-light mb-4">{day.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {day.poi_slugs?.map((poi: string, j: number) => (
                      <span key={j} className="text-[10px] font-space px-2 py-1 bg-[rgba(176,38,255,0.2)] text-[#e8bbf5] border border-[rgba(176,38,255,0.3)]">
                        NODE_{poi.toUpperCase()}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => setItinerary(null)} className="w-full py-4 mt-8 bg-[rgba(0,255,255,0.05)] border border-[#0ff] text-[#0ff] font-space tracking-[0.2em] uppercase text-sm hover:bg-[#0ff] hover:text-black transition-all">
              Initialize New Query
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
