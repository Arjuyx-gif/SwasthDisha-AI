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
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
  });

  const loadingSequence = [
    'Scanning report...',
    'Extracting values...',
    'Mapping biomarkers...',
    'Generating insights...',
  ];

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
    { icon: '🗣️', label: 'Bilingual Support' },
  ];

  const stats = [
    { value: '2,400+', label: 'Reports Analyzed' },
    { value: '98%', label: 'Accuracy' },
    { value: '2', label: 'Languages' },
  ];

  return (
    <main className="min-h-screen flex items-center justify-center p-6 lg:p-12 bg-[#070B14] relative overflow-hidden">
      {/* Glowing blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-15%] w-[55%] h-[55%] bg-cyan-500 rounded-full blur-[180px] opacity-10" />
        <div className="absolute bottom-[-20%] right-[-15%] w-[55%] h-[55%] bg-violet-600 rounded-full blur-[180px] opacity-10" />
        <div className="absolute top-[50%] left-[45%] w-[20%] h-[20%] bg-cyan-400 rounded-full blur-[100px] opacity-5" />
      </div>

      {/* Grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(6,182,212,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.03) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Two-column split hero */}
      <div className="z-10 w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

        {/* ── LEFT COLUMN: Branding & Info ── */}
        <motion.div
          initial={{ opacity: 0, x: -32 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="flex flex-col gap-7"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 self-start px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-xs font-semibold tracking-widest uppercase"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            Powered by LLaMA 3.3 · 70B
          </motion.div>

          {/* Heading */}
          <motion.header
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <h1 className="text-6xl xl:text-7xl font-black tracking-tight leading-none">
              Swasth
              <span className="bg-gradient-to-r from-cyan-400 to-violet-500 bg-clip-text text-transparent">
                Disha
              </span>
              <br />
              <span className="text-slate-400 font-light text-5xl xl:text-6xl">AI</span>
            </h1>
            <p className="text-slate-400 text-lg mt-5 max-w-sm leading-relaxed">
              Upload your lab report. Get instant AI-powered health insights, personalized and explained clearly.
            </p>
          </motion.header>

          {/* Feature pills */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="flex flex-wrap gap-2"
          >
            {features.map((f) => (
              <span
                key={f.label}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/50 text-slate-300 text-xs font-medium hover:border-cyan-500/30 hover:text-cyan-300 transition-colors"
              >
                <span>{f.icon}</span> {f.label}
              </span>
            ))}
          </motion.div>

          {/* Language toggle */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex gap-3"
          >
            <Button
              variant={language === 'EN' ? 'default' : 'outline'}
              className={
                language === 'EN'
                  ? 'bg-cyan-500 hover:bg-cyan-600 text-white border-0'
                  : 'border-slate-700 text-slate-400 hover:border-cyan-500/50 hover:text-cyan-400'
              }
              onClick={() => language !== 'EN' && toggleLanguage()}
            >
              English
            </Button>
            <Button
              variant={language === 'HI' ? 'default' : 'outline'}
              className={
                language === 'HI'
                  ? 'bg-cyan-500 hover:bg-cyan-600 text-white border-0'
                  : 'border-slate-700 text-slate-400 hover:border-cyan-500/50 hover:text-cyan-400'
              }
              onClick={() => language !== 'HI' && toggleLanguage()}
            >
              हिन्दी
            </Button>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.38 }}
            className="flex items-center gap-8 pt-2 border-t border-slate-800"
          >
            {stats.map((s, i) => (
              <div key={i} className="flex flex-col">
                <span className="text-2xl font-black text-white">{s.value}</span>
                <span className="text-xs text-slate-500 font-medium mt-0.5">{s.label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* ── RIGHT COLUMN: Upload Card ── */}
        <motion.div
          initial={{ opacity: 0, x: 32 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
        >
          <Card className="p-8 bg-slate-900/60 border-slate-800/60 relative group overflow-hidden backdrop-blur-sm shadow-2xl shadow-black/40">
            {/* Top glow line */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/60 to-transparent" />
            {/* Left side accent */}
            <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-cyan-500/30 to-transparent" />

            <div className="mb-6">
              <h2 className="text-slate-200 font-bold text-lg">Analyze your report</h2>
              <p className="text-slate-500 text-sm mt-1">
                Upload a blood test, liver panel, or any lab report
              </p>
            </div>

            <div
              {...getRootProps()}
              className={`
                border-2 border-dashed rounded-xl p-10 transition-all cursor-pointer flex flex-col items-center justify-center gap-4
                ${isDragActive ? 'border-cyan-400 bg-cyan-500/5' : 'border-slate-700 hover:border-cyan-500/40 hover:bg-cyan-500/5'}
                ${file ? 'border-cyan-400 bg-cyan-500/5' : ''}
              `}
            >
              <input {...getInputProps()} />

              {preview ? (
                <div className="relative w-40 h-40 rounded-xl overflow-hidden border border-slate-700 shadow-2xl shadow-cyan-500/10">
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                </div>
              ) : (
                <>
                  <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700/50 group-hover:border-cyan-500/30 transition-colors float-anim">
                    <Upload className="w-8 h-8 text-cyan-400" />
                  </div>
                  <div className="text-center">
                    <p className="text-base font-semibold text-slate-200">Drop your lab report here</p>
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
                  className="pt-5"
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

            <div className="mt-7 flex flex-col items-center gap-3">
              <div className="flex items-center gap-2 text-slate-600 text-sm">
                <div className="h-px w-12 bg-slate-800" />
                <span>or try a demo</span>
                <div className="h-px w-12 bg-slate-800" />
              </div>
              <div className="flex gap-3 w-full">
                <Button
                  variant="ghost"
                  onClick={() => {
                    const { saveReportToHistory } = useStore.getState();
                    setReportData(mockAnemia);
                    saveReportToHistory();
                    router.push('/dashboard');
                  }}
                  className="flex-1 text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 gap-2 text-sm border border-slate-800 hover:border-cyan-500/30"
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
                  className="flex-1 text-slate-400 hover:text-violet-400 hover:bg-violet-500/10 gap-2 text-sm border border-slate-800 hover:border-violet-500/30"
                >
                  <FileText className="w-4 h-4" /> Liver Report
                </Button>
              </div>
            </div>

            <p className="text-slate-600 text-xs text-center mt-5">
              Your data is processed securely and never stored permanently.
            </p>
          </Card>
        </motion.div>
      </div>
    </main>
  );
}
