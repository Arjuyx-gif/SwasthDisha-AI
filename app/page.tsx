'use client';

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { mockAnemia, mockLiver } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Loader2, Upload, FileText, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LandingPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('Scanning report...');
  
  const { language, toggleLanguage, setReportData } = useStore();
  const router = useRouter();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const droppedFile = acceptedFiles[0];
    if (droppedFile) {
      setFile(droppedFile);
      setPreview(URL.createObjectURL(droppedFile));
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png'],
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
  });

  const loadingSequence = ['Scanning report...', 'Extracting values...', 'Mapping biomarkers...', 'Generating insights...'];

  const handleSubmit = async () => {
    if (!file) return;

    setLoading(true);
    let sequenceIndex = 0;
    const interval = setInterval(() => {
      sequenceIndex = (sequenceIndex + 1) % loadingSequence.length;
      setLoadingText(loadingSequence[sequenceIndex]);
    }, 2000);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64 = (reader.result as string).split(',')[1];
        const res = await fetch('/api/analyze-report', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            base64Image: base64,
            mimeType: file.type,
            language: language,
            isPDF: file.type === 'application/pdf',
          }),
        });

        const data = await res.json();
        const { saveReportToHistory } = useStore.getState();
        setReportData(data);
        saveReportToHistory();
        clearInterval(interval);
        router.push('/dashboard');
      };
    } catch (error) {
      console.error('Upload error:', error);
      setLoading(false);
      clearInterval(interval);
    }
  };

  const features = [
    { icon: '🧬', label: 'AI Report Analysis' },
    { icon: '🥗', label: 'Diet Intelligence' },
    { icon: '💪', label: 'Adaptive Exercise' },
    { icon: '🗣️', label: 'Bilingual Support' },
  ];

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#070B14] relative overflow-hidden">
      {/* Glowing blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] bg-cyan-500 rounded-full blur-[160px] opacity-10" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[50%] h-[50%] bg-violet-600 rounded-full blur-[160px] opacity-10" />
        <div className="absolute top-[40%] left-[50%] w-[25%] h-[25%] bg-cyan-400 rounded-full blur-[120px] opacity-5" />
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(rgba(6,182,212,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.03) 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }} />

      <motion.div 
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="z-10 w-full max-w-2xl text-center space-y-8"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-xs font-semibold tracking-widest uppercase"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          Powered by LLaMA 3.3 · 70B
        </motion.div>

        <header className="space-y-3">
          <h1 className="text-6xl font-black tracking-tight">
            Swasth<span className="bg-gradient-to-r from-cyan-400 to-violet-500 bg-clip-text text-transparent">Disha</span>
            <span className="text-slate-400 font-light"> AI</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-md mx-auto">
            Upload your lab report. Get instant AI-powered health insights, personalized and explained clearly.
          </p>
        </header>

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-2">
          {features.map((f) => (
            <span key={f.label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/50 text-slate-300 text-xs font-medium">
              <span>{f.icon}</span> {f.label}
            </span>
          ))}
        </div>

        {/* Language toggle */}
        <div className="flex justify-center gap-3">
          <Button 
            variant={language === 'EN' ? 'default' : 'outline'}
            className={language === 'EN' 
              ? 'bg-cyan-500 hover:bg-cyan-600 text-white border-0' 
              : 'border-slate-700 text-slate-400 hover:border-cyan-500/50 hover:text-cyan-400'}
            onClick={() => language !== 'EN' && toggleLanguage()}
          >
            English
          </Button>
          <Button 
            variant={language === 'HI' ? 'default' : 'outline'}
            className={language === 'HI' 
              ? 'bg-cyan-500 hover:bg-cyan-600 text-white border-0' 
              : 'border-slate-700 text-slate-400 hover:border-cyan-500/50 hover:text-cyan-400'}
            onClick={() => language !== 'HI' && toggleLanguage()}
          >
            हिन्दी
          </Button>
        </div>

        {/* Upload card */}
        <Card className="p-8 bg-slate-900/60 border-slate-800/60 relative group overflow-hidden backdrop-blur-sm">
          {/* Top glow line */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
          
          <div 
            {...getRootProps()} 
            className={`
              border-2 border-dashed rounded-xl p-12 transition-all cursor-pointer flex flex-col items-center justify-center gap-4
              ${isDragActive ? 'border-cyan-400 bg-cyan-500/5' : 'border-slate-700 hover:border-cyan-500/40 hover:bg-cyan-500/5'}
              ${file ? 'border-cyan-400 bg-cyan-500/5' : ''}
            `}
          >
            <input {...getInputProps()} />
            
            {preview ? (
              <div className="relative w-44 h-44 rounded-xl overflow-hidden border border-slate-700 shadow-2xl shadow-cyan-500/10">
                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
              </div>
            ) : (
              <>
                <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700/50 group-hover:border-cyan-500/30 transition-colors float-anim">
                  <Upload className="w-8 h-8 text-cyan-400" />
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-slate-200">Drop your lab report here</p>
                  <p className="text-sm text-slate-500 mt-1">or click to browse &nbsp;·&nbsp; PDF, JPG, PNG</p>
                </div>
              </>
            )}
          </div>

          <AnimatePresence>
            {file && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="pt-6"
              >
                <Button 
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full h-14 text-lg bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-white border-0 gap-2 shadow-lg shadow-cyan-500/20"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      {loadingText}
                    </>
                  ) : (
                    <>
                      Analyze Report <ChevronRight className="w-5 h-5" />
                    </>
                  )}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-8 flex flex-col items-center gap-3">
            <div className="flex items-center gap-2 text-slate-600 text-sm">
              <div className="h-px w-12 bg-slate-800" />
              <span>or try a demo</span>
              <div className="h-px w-12 bg-slate-800" />
            </div>
            <div className="flex gap-3">
              <Button 
                variant="ghost" 
                onClick={() => {
                  const { saveReportToHistory } = useStore.getState();
                  setReportData(mockAnemia);
                  saveReportToHistory();
                  router.push('/dashboard');
                }}
                className="text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 gap-2 text-sm border border-slate-800 hover:border-cyan-500/30"
              >
                <FileText className="w-4 h-4" /> Anemia Report
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => {
                  const { saveReportToHistory } = useStore.getState();
                  setReportData(mockLiver);
                  saveReportToHistory();
                  router.push('/dashboard');
                }}
                className="text-slate-400 hover:text-violet-400 hover:bg-violet-500/10 gap-2 text-sm border border-slate-800 hover:border-violet-500/30"
              >
                <FileText className="w-4 h-4" /> Liver Report
              </Button>
            </div>
          </div>
        </Card>

        <p className="text-slate-600 text-xs">
          Your data is processed securely and never stored permanently.
        </p>
      </motion.div>

      {/* Floating AI indicator */}
      <div className="fixed bottom-24 right-8">
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="w-14 h-14 bg-slate-900 rounded-full border border-cyan-500/40 flex items-center justify-center shadow-lg shadow-cyan-500/10"
        >
          <span className="text-2xl">🩺</span>
        </motion.div>
      </div>
    </main>
  );
}
