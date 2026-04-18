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
    { id: 'destinations', label: 'Where would you like to explore?', field: 'destinations', placeholder: 'e.g. Santorini, Cyclades, Ionian Islands...' },
    { id: 'duration', label: 'How long will you stay?', field: 'duration', placeholder: 'e.g. 7 Days of relaxation...' },
    { id: 'budget', label: 'Select your preferred accommodation style.', field: 'budget', placeholder: 'e.g. Premium Villas, High-End Boutique...' },
    { id: 'preferences', label: 'What experiences inspire you?', field: 'preferences', placeholder: 'e.g. Private Catamarans, Local Gastronomy, Secluded beaches...' }
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
    <section className="py-24 relative z-10 w-full flex justify-center px-4 -mt-32">
      <div className="w-full max-w-4xl glass-light p-10 md:p-14 rounded-2xl relative overflow-hidden">
        
        {/* Elegant Header */}
        <div className="flex items-center justify-center border-b border-gray-200 pb-8 mb-10">
          <div className="text-center">
            <h2 className="text-3xl font-serif text-[#003366] mb-2 tracking-wide">Your Personal Travel Concierge</h2>
            <p className="text-sm tracking-widest uppercase text-[#D4AF37] font-semibold">AI Architected Itineraries</p>
          </div>
        </div>

        {!itinerary ? (
          <div className="relative min-h-[300px] flex flex-col justify-between">
            <AnimatePresence mode="wait">
              {isGenerating ? (
                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center py-16">
                  <div className="w-16 h-16 border-2 border-t-[#D4AF37] border-r-transparent border-b-[#003366] border-l-transparent rounded-full animate-spin mb-6"></div>
                  <p className="text-[#003366] font-serif text-xl mb-2">Curating Your Journey...</p>
                  <p className="text-xs text-gray-500 uppercase tracking-widest">Bridging data with cultural nodes</p>
                </motion.div>
              ) : (
                <motion.div
                  key={step}
                  initial={{ x: 30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -30, opacity: 0 }}
                  transition={{ ease: "easeInOut", duration: 0.5 }}
                  className="w-full text-center"
                >
                  <label className="block text-[#003366] text-2xl font-serif mb-8">
                    {steps[step].label}
                  </label>
                  <input
                    type="text"
                    value={formData[steps[step].field as keyof typeof formData]}
                    onChange={(e) => setFormData({ ...formData, [steps[step].field]: e.target.value })}
                    placeholder={steps[step].placeholder}
                    className="w-full max-w-2xl bg-transparent border-b-2 border-gray-300 text-[#1E293B] px-4 py-3 placeholder-gray-400 focus:outline-none focus:border-[#D4AF37] text-lg font-light transition-colors text-center"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {!isGenerating && (
              <div className="flex justify-between items-center mt-16 pt-6">
                <div className="flex space-x-3">
                  {steps.map((_, idx) => (
                    <div key={idx} className={`w-2 h-2 rounded-full ${idx === step ? 'bg-[#D4AF37] transform scale-125' : 'bg-gray-300'} transition-all duration-300`}></div>
                  ))}
                </div>
                
                <div className="flex space-x-4">
                  {step > 0 && (
                    <button onClick={handleBack} className="px-6 py-3 text-gray-500 font-semibold text-sm tracking-wider uppercase hover:text-[#003366] transition-colors">
                      Back
                    </button>
                  )}
                  {step < steps.length - 1 ? (
                    <button onClick={handleNext} className="px-8 py-3 bg-[#003366] text-white font-semibold text-sm tracking-wider uppercase hover:bg-[#D4AF37] transition-colors shadow-lg">
                      Next Step
                    </button>
                  ) : (
                    <button onClick={handleGenerate} className="px-8 py-3 bg-[#D4AF37] text-white font-semibold text-sm tracking-wider uppercase hover:bg-[#003366] transition-colors shadow-lg">
                      Assemble Itinerary
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
            <div className="text-center mb-10">
              <h3 className="text-3xl font-serif text-[#003366] mb-4">{itinerary.title}</h3>
              <div className="w-24 h-[1px] bg-[#D4AF37] mx-auto"></div>
            </div>
            
            <div className="flex flex-col space-y-8">
              {itinerary.days?.map((day: any, i: number) => (
                <div key={i} className="flex flex-col md:flex-row gap-6 p-6 border border-gray-100 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow">
                  <div className="md:w-1/4 pb-4 md:pb-0 md:border-r border-gray-100 flex flex-col justify-center">
                    <span className="text-[#D4AF37] uppercase tracking-widest text-xs font-bold mb-1">Day {day.day}</span>
                    <h4 className="text-xl font-serif text-[#003366]">{day.title}</h4>
                  </div>
                  <div className="md:w-3/4 flex flex-col justify-center">
                    <p className="text-gray-600 font-light text-base leading-relaxed mb-4">{day.description}</p>
                    <div className="flex flex-wrap gap-2 mt-auto">
                      {day.poi_slugs?.map((poi: string, j: number) => (
                        <span key={j} className="text-xs font-medium px-3 py-1 bg-blue-50 text-[#003366] rounded-full border border-blue-100 uppercase tracking-widest">
                          {poi.replace('-', ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <button onClick={() => setItinerary(null)} className="w-full py-4 mt-8 border border-[#003366] text-[#003366] font-semibold tracking-wider uppercase text-sm hover:bg-[#003366] hover:text-white transition-all rounded">
              Plan Another Journey
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
