'use client';
import { Play } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  url: string;
  title?: string;
  thumbnailUrl?: string; // Optional fallback if we want custom thumbnails
}

export default function YouTubeEmbed({ url, title, thumbnailUrl }: Props) {
  const [isPlaying, setIsPlaying] = useState(false);

  // Extract video ID from various YouTube URL formats
  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = getYouTubeId(url);

  if (!videoId) return null;

  // Use YouTube's high-res default thumbnail if no custom one is provided
  const coverImage = thumbnailUrl || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  return (
    <div className="relative w-full aspect-video rounded-2xl overflow-hidden group bg-black/5 border border-white/10 shadow-2xl">
      <AnimatePresence>
        {!isPlaying ? (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-10 cursor-pointer"
            onClick={() => setIsPlaying(true)}
          >
            {/* Thumbnail Image */}
            <img 
              src={coverImage} 
              alt={title || "Play Video"} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            
            {/* Cinematic Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
            
            {/* Play Button UI */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-[0_0_40px_rgba(0,0,0,0.5)] group-hover:scale-110 group-hover:bg-[#D4A027]/90 group-hover:border-[#D4A027] transition-all duration-500">
                <Play className="w-8 h-8 md:w-10 md:h-10 text-white ml-2 group-hover:text-black transition-colors" />
              </div>
              <span className="mt-6 text-[10px] md:text-xs font-bold uppercase tracking-[0.4em] text-white/70 group-hover:text-white transition-colors">
                Play Documentary
              </span>
            </div>
            
            {/* Title Overlay */}
            {title && (
              <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8 right-8">
                <h3 className="text-xl md:text-3xl font-serif text-white tracking-tight drop-shadow-md">
                  {title}
                </h3>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.iframe
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 w-full h-full z-0"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}
      </AnimatePresence>
    </div>
  );
}
