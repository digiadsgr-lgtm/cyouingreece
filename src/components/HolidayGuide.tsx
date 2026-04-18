"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import InteractiveMap from "./InteractiveMap";

type FormData = {
  destinations: string;
  duration: string;
  budget: string;
  preferences: string;
};

type GeneratedDay = {
  day: number;
  title: string;
  description: string;
  poi_slugs: string[];
};

type Recommendation = {
  title: string;
  days: GeneratedDay[];
};

export default function HolidayGuide() {
  const [step, setStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<Recommendation | null>(null);
  const [formData, setFormData] = useState<FormData>({
    destinations: "Cyclades",
    duration: "7 days",
    budget: "Luxury",
    preferences: "Gastronomy, private secluded beaches",
  });

  const generateItinerary = async () => {
    setIsGenerating(true);
    setStep(4); // Moving to loading step

    try {
      const response = await fetch('/api/guide', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const nextStep = () => setStep((s) => s + 1);
  const resetForm = () => {
    setStep(0);
    setResult(null);
  };

  // Step Content Renderer
  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <motion.div 
            key="step0"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col gap-6 w-full max-w-lg mx-auto"
          >
            <h3 className="text-2xl font-semibold mb-2">Where would you like to escape?</h3>
            <div className="flex gap-4">
              {['Cyclades', 'Ionian Islands', 'Crete', 'Peloponnese'].map((region) => (
                <button 
                  key={region}
                  onClick={() => { setFormData({ ...formData, destinations: region }); nextStep(); }}
                  className="px-4 py-3 rounded-xl border border-slate-700 hover:border-blue-500 hover:bg-blue-500/10 transition-all font-medium text-slate-300 w-full"
                >
                  {region}
                </button>
              ))}
            </div>
          </motion.div>
        );
      case 1:
        return (
          <motion.div 
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col gap-6 w-full max-w-lg mx-auto"
          >
            <h3 className="text-2xl font-semibold mb-2">How long is your journey?</h3>
            <div className="flex gap-4">
              {['3 Days', '7 Days', '14 Days'].map((duration) => (
                <button 
                  key={duration}
                  onClick={() => { setFormData({ ...formData, duration }); nextStep(); }}
                  className="px-4 py-3 rounded-xl border border-slate-700 hover:border-blue-500 hover:bg-blue-500/10 transition-all font-medium text-slate-300 w-full"
                >
                  {duration}
                </button>
              ))}
            </div>
          </motion.div>
        );
      case 2:
        return (
          <motion.div 
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col gap-6 w-full max-w-lg mx-auto"
          >
            <h3 className="text-2xl font-semibold mb-2">What is your aesthetic?</h3>
            <textarea 
               value={formData.preferences}
               onChange={(e) => setFormData({ ...formData, preferences: e.target.value })}
               className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
               rows={4}
               placeholder="E.g., Fine dining, archaeological sites, private beaches..."
            />
            <button 
              onClick={generateItinerary}
              className="mt-4 px-6 py-4 bg-white text-black font-bold rounded-xl hover:bg-blue-100 transition-colors"
            >
              Architect My Itinerary
            </button>
          </motion.div>
        );
      case 4:
        if (isGenerating) {
           return (
             <motion.div 
               key="loading"
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="flex flex-col items-center justify-center py-20"
             >
                <div className="w-16 h-16 border-4 border-slate-700 border-t-white rounded-full animate-spin"></div>
                <h3 className="mt-8 text-xl font-light text-slate-300 tracking-wider">Consulting GPT-4 Tourism Engine...</h3>
             </motion.div>
           );
        }
        if (result) {
          return (
            <motion.div 
               key="result"
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="w-full text-left"
            >
              <h2 className="text-3xl font-bold mb-8 text-white">{result.title}</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  {result.days.map((day) => (
                    <div key={day.day} className="glass-dark p-6 rounded-2xl relative overflow-hidden group">
                      <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 opacity-50 group-hover:opacity-100 transition-opacity" />
                      <h4 className="text-xl font-bold mb-2 text-white">Day {day.day}: {day.title}</h4>
                      <p className="text-slate-400 font-light mb-4 text-sm leading-relaxed">{day.description}</p>
                      
                      {day.poi_slugs && day.poi_slugs.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-4">
                          {day.poi_slugs.map((slug) => (
                            <span key={slug} className="text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-full border border-slate-700 hover:border-slate-500 cursor-pointer transition-colors">
                              {slug.replace('-', ' ').toUpperCase()}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="hidden lg:block relative sticky top-6">
                  <h4 className="text-xl font-semibold mb-4 text-white">Route Map</h4>
                  <InteractiveMap />
                  <button 
                    onClick={resetForm}
                    className="w-full mt-6 px-4 py-3 border border-slate-700 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    Start Over
                  </button>
                </div>
              </div>
            </motion.div>
          );
        }
        return null;
      default:
        return null;
    }
  };

  return (
    <section className="w-full py-24 bg-slate-950 text-white min-h-screen flex items-center justify-center">
      <div className="container mx-auto px-4 max-w-4xl text-center">
        {step < 4 && (
          <div className="mb-12">
            <span className="text-blue-500 uppercase tracking-widest text-sm font-semibold mb-2 block">AI Holiday Engineer</span>
            <h2 className="text-4xl lg:text-5xl font-extrabold mb-4">Design Your Experience</h2>
            <p className="text-slate-400">Interact with our predictive engine to curate your exact parameters.</p>
          </div>
        )}
        
        <div className="relative min-h-[400px]">
          <AnimatePresence mode="wait">
            {renderStep()}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
