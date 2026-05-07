'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Compass, MapPin, Wind } from 'lucide-react';

interface WeatherData {
  current: {
    temp: number;
    feels_like: number;
    description: string;
    icon: string;
    humidity: number;
    wind_speed: number;
  };
}

interface LocationSlide {
  name: string;
  lat: number;
  lng: number;
  weather: WeatherData | null;
}

interface Props {
  locations: LocationSlide[];
}

const slideImages: Record<string, string> = {
  'Athens': 'https://images.unsplash.com/photo-1555993539-1732b0258235?q=80&w=1920&auto=format&fit=crop', // Acropolis
  'Santorini': 'https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=1920&auto=format&fit=crop',
  'Mykonos': 'https://images.unsplash.com/photo-1601581875309-fafbf2d3ed3a?q=80&w=1920&auto=format&fit=crop',
  'Rhodes': 'https://images.unsplash.com/photo-1560961803-1c390508cb58?q=80&w=1920&auto=format&fit=crop',
  'Crete': 'https://images.unsplash.com/photo-1516483638261-f40af5bf2225?q=80&w=1920&auto=format&fit=crop', // Beautiful beach
  'Corfu': 'https://images.unsplash.com/photo-1620311210874-ce4eb878f895?q=80&w=1920&auto=format&fit=crop',
  'Milos': 'https://images.unsplash.com/photo-1621251390453-61bba10eb0b3?q=80&w=1920&auto=format&fit=crop',
  'Ithaca': 'https://images.unsplash.com/photo-1614713568393-4a3dce7a8f15?q=80&w=1920&auto=format&fit=crop'
};

const slideHeadlines: Record<string, string> = {
  'Athens': "The cradle of western thought, still pulsating.",
  'Santorini': "A masterpiece carved into a volcanic caldera.",
  'Mykonos': "Where the Aegean breeze meets endless energy.",
  'Rhodes': "Knights, ancient ruins, and golden sands.",
  'Crete': "A continent disguised as an island.",
  'Corfu': "Venetian elegance wrapped in Ionian green.",
  'Milos': "Sculpted by the elements, shaped by the sea.",
  'Ithaca': "The legendary homeland. The ultimate destination."
};

export default function SmartHero({ locations }: Props) {
  const [slideIdx, setSlideIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSlideIdx(prev => (prev + 1) % locations.length);
    }, 6000); // 6 seconds per slide
    return () => clearInterval(interval);
  }, [locations.length]);

  if (!locations || locations.length === 0) return null;

  const currentSlide = locations[slideIdx];
  const image = slideImages[currentSlide.name] || slideImages['Athens'];
  const headline = slideHeadlines[currentSlide.name] || "Greece is not a destination. It's a feeling.";
  
  const cords = `${Math.abs(currentSlide.lat).toFixed(4)}° ${currentSlide.lat >= 0 ? 'N' : 'S'}, ${Math.abs(currentSlide.lng).toFixed(4)}° ${currentSlide.lng >= 0 ? 'E' : 'W'}`;
  const tempStr = currentSlide.weather ? `${currentSlide.weather.current.temp}°C, ${currentSlide.weather.current.description}` : "25°C, Clear";
  const windStr = currentSlide.weather ? `${(currentSlide.weather.current.wind_speed * 3.6).toFixed(1)} km/h` : "12 km/h";

  return (
    <section className="relative h-screen w-full flex flex-col justify-end overflow-hidden bg-[#0A1628] select-none">
      {/* Background Slideshow */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={currentSlide.name}
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 2, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full"
          >
            <img 
              src={image} 
              className="w-full h-full object-cover origin-center" 
              alt={currentSlide.name} 
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Elegant Gradients */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
      <div className="absolute inset-0 z-[1] bg-gradient-to-r from-black/60 via-transparent to-transparent opacity-80" />
      <div className="absolute inset-0 z-[1] bg-black/10" />
      
      {/* Travel Metadata (Top Right) */}
      <div className="absolute top-32 right-12 z-20 hidden md:flex flex-col items-end gap-2 text-white/70 font-mono text-xs uppercase tracking-widest">
        <div className="flex items-center gap-2">
          <MapPin size={14} className="text-[#D4A027]" />
          <AnimatePresence mode="wait">
            <motion.span
              key={cords}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
            >
              {cords}
            </motion.span>
          </AnimatePresence>
        </div>
        <div className="flex items-center gap-2">
          <Wind size={14} className="text-[#D4A027]" />
          <AnimatePresence mode="wait">
            <motion.span
              key={windStr}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
            >
              Wind: {windStr}
            </motion.span>
          </AnimatePresence>
        </div>
        <div className="flex items-center gap-2 mt-4">
          <span className="text-xl mr-1">{currentSlide.weather?.current.icon || '☀️'}</span>
          <AnimatePresence mode="wait">
            <motion.span
              key={tempStr}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              className="text-white font-bold"
            >
              {tempStr}
            </motion.span>
          </AnimatePresence>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <Compass size={14} className="text-white/40" />
          <span className="text-white/40">Live Open-Meteo Feed</span>
        </div>
      </div>

      {/* Main Content (Bottom Left) */}
      <div className="relative z-10 w-full px-6 md:px-12 pb-32 max-w-[1600px] mx-auto">
        <div className="max-w-4xl">
          <div className="flex items-center gap-4 mb-6">
            <span className="w-8 h-px bg-[#D4A027]" />
            <AnimatePresence mode="wait">
              <motion.span 
                key={currentSlide.name}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-[#D4A027] text-[10px] font-black uppercase tracking-[0.4em]"
              >
                {currentSlide.name}
              </motion.span>
            </AnimatePresence>
          </div>
          
          <div className="relative h-[120px] md:h-[180px] flex items-end">
            <AnimatePresence mode="wait">
              <motion.h1
                key={headline}
                initial={{ opacity: 0, filter: "blur(10px)", y: 20 }}
                animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                exit={{ opacity: 0, filter: "blur(10px)", y: -20 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="text-[clamp(2.5rem,5vw,5rem)] font-serif font-light text-white leading-[1.1] tracking-tight absolute bottom-0 drop-shadow-lg max-w-3xl"
              >
                {headline}
              </motion.h1>
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-8 mt-8">
            <Link href={`/destination/${currentSlide.name.toLowerCase()}`} className="group relative px-10 py-5 bg-[#D4A027] text-[#0A1628] text-[11px] font-bold tracking-[0.4em] uppercase overflow-hidden transition-all hover:scale-105">
              <span className="relative z-10">Explore {currentSlide.name}</span>
            </Link>
            
            <Link href="/encyclopaedia" className="group flex items-center gap-4 text-white text-[11px] font-bold tracking-[0.4em] uppercase hover:text-[#D4A027] transition-colors">
              <span className="w-12 h-px bg-white/30 group-hover:bg-[#D4A027] transition-colors" />
              The Full Archive
            </Link>
          </div>
        </div>
      </div>

      {/* Minimal Bottom Ticker */}
      <div className="absolute bottom-0 left-0 w-full z-20 py-6 border-t border-white/10 bg-black/40 backdrop-blur-sm">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex gap-8 items-center overflow-x-auto w-full md:w-auto no-scrollbar">
            <span className="text-[9px] uppercase tracking-[0.5em] text-[#D4A027] font-black shrink-0">Locations Feed</span>
            {locations.map((loc, idx) => (
              <button 
                key={loc.name} 
                onClick={() => setSlideIdx(idx)}
                className={`group flex shrink-0 transition-colors ${idx === slideIdx ? 'text-[#D4A027]' : 'text-white/50 hover:text-white'}`}
              >
                <span className="text-[11px] uppercase tracking-[0.2em]">
                  {loc.name}
                </span>
              </button>
            ))}
          </div>
          
          <div className="hidden md:flex items-center gap-4">
            <div className="w-[1px] h-8 bg-white/20" />
            <span className="text-[9px] uppercase tracking-[0.3em] text-white/40">Scroll to dive in</span>
            <motion.div 
              animate={{ y: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-px h-6 bg-white/60"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
