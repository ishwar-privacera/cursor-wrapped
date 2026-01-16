import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UsageStats } from '../types';
import { ArrowRight, Sparkles, Zap, DollarSign, Calendar, Cpu } from 'lucide-react';

interface StoryModeProps {
  stats: UsageStats;
  onComplete: () => void;
}

const slides = [
  {
    id: 'intro',
    duration: 5000,
    render: () => (
      <div className="flex flex-col items-center justify-center text-center p-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-6xl md:text-8xl mb-6"
        >
          ✨
        </motion.div>
        <motion.h2 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 mb-4"
        >
          Your AI Journey
        </motion.h2>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-xl text-gray-400"
        >
          It's been a very productive era. Let's rewind.
        </motion.p>
      </div>
    )
  },
  {
    id: 'tokens',
    duration: 6000,
    render: (stats: UsageStats) => (
      <div className="flex flex-col items-center justify-center text-center p-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', bounce: 0.5 }}
          className="w-24 h-24 bg-blue-500/20 rounded-full flex items-center justify-center mb-8"
        >
          <Zap className="w-12 h-12 text-blue-400" />
        </motion.div>
        <motion.h3 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-2xl text-gray-400 mb-2"
        >
          Total Knowledge Processed
        </motion.h3>
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="text-5xl md:text-8xl font-black text-white mb-4"
        >
          {(stats.totalTokens / 1000000).toFixed(2)}M
        </motion.div>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-xl text-blue-300"
        >
          tokens exchanged with the machine.
        </motion.p>
      </div>
    )
  },
  {
    id: 'model',
    duration: 6000,
    render: (stats: UsageStats) => (
      <div className="flex flex-col items-center justify-center text-center p-8">
        <motion.div
          initial={{ rotate: -180, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          className="mb-8"
        >
          <Cpu className="w-20 h-20 text-emerald-400" />
        </motion.div>
        <motion.h3 className="text-2xl text-gray-400 mb-4">Your Partner in Code</motion.h3>
        <motion.div 
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="text-4xl md:text-6xl font-bold text-white mb-2 break-all"
        >
          {stats.mostUsedModel.name}
        </motion.div>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-lg text-emerald-300"
        >
          You called it <strong>{stats.mostUsedModel.count}</strong> times.
        </motion.p>
      </div>
    )
  },
  {
    id: 'cost',
    duration: 5000,
    render: (stats: UsageStats) => (
      <div className="flex flex-col items-center justify-center text-center p-8">
        <motion.div
           initial={{ y: -50, opacity: 0 }}
           animate={{ y: 0, opacity: 1 }}
           className="mb-6"
        >
          <DollarSign className="w-24 h-24 text-yellow-400" />
        </motion.div>
        <motion.h3 className="text-2xl text-gray-400 mb-2">Total Investment</motion.h3>
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-6xl md:text-9xl font-bold text-white mb-4"
        >
          ${stats.totalCost.toFixed(2)}
        </motion.div>
        <motion.p className="text-yellow-200/80 text-lg">
          Money well spent on productivity?
        </motion.p>
      </div>
    )
  },
  {
    id: 'day',
    duration: 5000,
    render: (stats: UsageStats) => (
      <div className="flex flex-col items-center justify-center text-center p-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="mb-6"
        >
          <Calendar className="w-20 h-20 text-pink-400" />
        </motion.div>
        <motion.h3 className="text-2xl text-gray-400 mb-4">Your Power Day</motion.h3>
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500"
        >
          {stats.mostProductiveDay}s
        </motion.div>
        <motion.p className="text-gray-400 mt-4 text-lg">
          The day you ship the most.
        </motion.p>
      </div>
    )
  }
];

export const StoryMode: React.FC<StoryModeProps> = ({ stats, onComplete }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const timer = setTimeout(() => {
      if (currentSlide < slides.length - 1) {
        setCurrentSlide(prev => prev + 1);
      } else {
        onComplete();
      }
    }, slides[currentSlide].duration);

    return () => clearTimeout(timer);
  }, [currentSlide, isPaused, onComplete]);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  const progress = ((currentSlide + 1) / slides.length) * 100;

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-purple-900/20 to-transparent pointer-events-none"></div>
      
      {/* Progress Bar */}
      <div className="absolute top-8 left-8 right-8 h-1 bg-gray-800 rounded-full overflow-hidden">
        <motion.div 
          className="h-full bg-white"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Slide Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 1.05, y: -20 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative z-10 w-full max-w-4xl"
        >
          {slides[currentSlide].render(stats)}
        </motion.div>
      </AnimatePresence>

      {/* Controls */}
      <div className="absolute bottom-12 w-full flex justify-center gap-4 z-20">
         <button 
           onClick={() => setIsPaused(!isPaused)}
           className="text-white/50 hover:text-white transition-colors text-sm uppercase tracking-widest"
         >
           {isPaused ? "Resume" : "Pause"}
         </button>
         <button 
           onClick={handleNext}
           className="bg-white text-black px-6 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-gray-200 transition-colors"
         >
           {currentSlide === slides.length - 1 ? "See Dashboard" : "Next"} <ArrowRight size={16} />
         </button>
      </div>
    </div>
  );
};