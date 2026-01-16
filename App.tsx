import React, { useState, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { motion, AnimatePresence } from 'framer-motion';
import { AppState, UsageStats } from './types';
import { parseCSV, analyzeData } from './utils/csvParser';
import { StoryMode } from './components/StoryMode';
import { Dashboard } from './components/Dashboard';
import { Upload, FileText, Loader2, Sparkles } from 'lucide-react';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(AppState.UPLOAD);
  const [stats, setStats] = useState<UsageStats | null>(null);
  const [loadingText, setLoadingText] = useState('Initializing...');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setState(AppState.PROCESSING);
    
    // Simulate complex analysis steps for visual flair
    const steps = [
      "Reading CSV...",
      "Parsing tokens...",
      "Calculating costs...",
      "Identifying patterns...",
      "Generating report..."
    ];

    let stepIndex = 0;
    const interval = setInterval(() => {
      setLoadingText(steps[stepIndex]);
      stepIndex++;
      if (stepIndex >= steps.length) clearInterval(interval);
    }, 400);

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setTimeout(() => {
        const parsedData = parseCSV(text);
        const analyzed = analyzeData(parsedData);
        setStats(analyzed);
        setState(AppState.STORY);
      }, 2500); // Artificial delay to let the animation play
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    setStats(null);
    setState(AppState.UPLOAD);
  };

  return (
    <div className="w-full min-h-screen bg-[#050505] text-white font-sans overflow-hidden relative">
      <AnimatePresence mode="wait">
        
        {/* PHASE 1: UPLOAD */}
        {state === AppState.UPLOAD && (
          <motion.div 
            key="upload"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
            className="flex flex-col items-center justify-center min-h-screen p-6 relative z-10"
          >
            {/* Decorative Background Elements */}
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-600/20 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-600/20 rounded-full blur-[100px] pointer-events-none" />

            <div className="text-center max-w-2xl mx-auto">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="mb-8"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
                  <Sparkles size={14} className="text-yellow-400" />
                  <span className="text-xs uppercase tracking-widest text-gray-300">2025 Retrospective</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                  Cursor Usage <br />
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                    Wrapped
                  </span>
                </h1>
                <p className="text-lg text-gray-400 mb-10 leading-relaxed">
                  Upload your usage CSV to discover your AI coding habits, top models, and productivity trends in a cinematic experience.
                </p>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                <input 
                  type="file" 
                  accept=".csv" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                  className="hidden" 
                />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="group relative inline-flex h-14 items-center justify-center overflow-hidden rounded-full bg-white px-8 font-medium text-neutral-900 transition-all duration-300 hover:bg-neutral-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2 focus:ring-offset-neutral-900"
                >
                  <span className="mr-2"><Upload size={20} /></span>
                  <span>Analyze my CSV</span>
                  <div className="absolute inset-0 -z-10 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 transition-opacity duration-500 group-hover:opacity-10" />
                </button>
                
                <p className="mt-4 text-xs text-gray-500 flex items-center justify-center gap-2">
                  <FileText size={12} /> Supports standard Cursor usage export format
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* PHASE 2: PROCESSING */}
        {state === AppState.PROCESSING && (
          <motion.div 
            key="processing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black"
          >
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="mb-8"
            >
              <Loader2 size={64} className="text-indigo-500" />
            </motion.div>
            <motion.h2 
              key={loadingText}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-2xl font-light text-white tracking-widest uppercase"
            >
              {loadingText}
            </motion.h2>
          </motion.div>
        )}

        {/* PHASE 3: STORY MODE */}
        {state === AppState.STORY && stats && (
          <StoryMode 
            stats={stats} 
            onComplete={() => setState(AppState.DASHBOARD)} 
          />
        )}

        {/* PHASE 4: DASHBOARD */}
        {state === AppState.DASHBOARD && stats && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <Dashboard stats={stats} onReset={handleReset} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;