'use client';

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { mockAnemia, mockLiver } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { Loader2, Upload, FileText, ChevronRight, Zap, ShieldCheck, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LandingPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('Scanning report...');

  const { language, toggleLanguage, setReportData } = useStore();
  const router = useRouter();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const f = acceptedFiles[0];
    if (f) { setFile(f); setPreview(URL.createObjectURL(f)); }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png'], 'application/pdf': ['.pdf'] },
    maxFiles: 1,
  });

  const loadingSequence = ['Scanning report…', 'Extracting values…', 'Mapping biomarkers…', 'Generating insights…'];

  const handleSubmit = async () => {
    if (!file) return;
    setLoading(true);
    let idx = 0;
    const iv = setInterval(() => {
      idx = (idx + 1) % loadingSequence.length;
      setLoadingText(loadingSequence[idx]);
    }, 2000);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64 = (reader.result as string).split(',')[1];
        const res = await fetch('/api/analyze-report', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ base64Image: base64, mimeType: file.type, language, isPDF: file.type === 'application/pdf' }),
        });
        const data = await res.json();
        const { saveReportToHistory } = useStore.getState();
        setReportData(data);
        saveReportToHistory();
        clearInterval(iv);
        router.push('/dashboard');
      };
    } catch {
      setLoading(false);
      clearInterval(iv);
    }
  };

  const howItWorks = [
    { step: '01', icon: '📤', title: 'Upload Report', desc: 'Drop any blood test, liver panel, or CBC PDF/image.' },
    { step: '02', icon: '🧠', title: 'AI Analyzes', desc: 'LLaMA 3 reads every biomarker & generates plain-language insights.' },
    { step: '03', icon: '🌿', title: 'Act on It', desc: 'Get a personalized diet plan, exercise tips & chat with Dr. Umeed.' },
  ];

  const stats = [
    { value: '2,400+', label: 'Reports Analyzed', icon: '📊' },
    { value: '98%',    label: 'Accuracy Rate',    icon: '🎯' },
    { value: '2',      label: 'Languages',         icon: '🌐' },
    { value: '<3s',    label: 'Response Time',     icon: '⚡' },
  ];

  return (
    <main className="min-h-screen bg-[#070A0E] relative overflow-hidden flex flex-col">

      {/* Background blobs — saffron + green instead of cyan/violet */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-[#f97c0a] blur-[180px] opacity-[0.06]" />
        <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full bg-[#10b981] blur-[180px] opacity-[0.06]" />
      </div>

      {/* Top bar */}
      <header className="relative z-10 flex items-center justify-between px-6 md:px-12 py-5 border-b border-[#1a2030]">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🩺</span>
          <span className="font-bold text-lg tracking-tight text-white">
            Swasth<span className="text-[#f97c0a]">Disha</span>
            <span className="text-[#5a677d] font-light"> AI</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-[#1a2030] text-[#5a677d] hover:text-white hover:border-[#f97c0a]/40 text-xs font-semibold transition-all"
          >
            <Globe className="w-3.5 h-3.5" />
            {language === 'EN' ? 'हिन्दी' : 'English'}
          </button>
          <span className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded border border-[#f97c0a]/20 bg-[#f97c0a]/5 text-[#f97c0a] text-[10px] font-bold uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
            Beta Live
          </span>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          {/* Pill badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#f97c0a]/25 bg-[#f97c0a]/8 text-[#f97c0a] text-[11px] font-bold tracking-widest uppercase mb-8">
            <Zap className="w-3 h-3" /> Powered by LLaMA 3.1 · Instant · Bilingual
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-none mb-6 text-white">
            Understand Your<br />
            <span className="text-primary-grad">Health Report</span><br />
            <span className="text-[#5a677d] font-light text-4xl md:text-5xl">in plain language.</span>
          </h1>

          <p className="text-[#8a97aa] text-lg max-w-xl mx-auto mb-12 leading-relaxed">
            Upload any lab report. SwasthDisha AI maps every biomarker, explains it simply in English or Hindi, and hands you a personalised action plan.
          </p>

          {/* Stats row */}
          <div className="flex flex-wrap justify-center gap-6 mb-14">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col items-center">
                <span className="text-2xl font-bold text-white">{s.icon} {s.value}</span>
                <span className="text-[11px] text-[#5a677d] font-medium mt-0.5">{s.label}</span>
              </div>
            ))}
          </div>

          {/* Upload card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-lg mx-auto"
          >
            <div className="bg-[#0d1117] border border-[#1a2030] rounded-lg p-6 relative overflow-hidden">
              {/* top accent line */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#f97c0a] to-transparent opacity-60" />

              {/* Drop zone */}
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-md p-8 flex flex-col items-center gap-4 cursor-pointer transition-all
                  ${isDragActive ? 'border-[#f97c0a] bg-[#f97c0a]/5' : 'border-[#1a2030] hover:border-[#f97c0a]/40 hover:bg-[#f97c0a]/3'}
                  ${file ? 'border-[#10b981]/60 bg-[#10b981]/5' : ''}`}
              >
                <input {...getInputProps()} />
                {preview ? (
                  <div className="w-32 h-32 rounded overflow-hidden border border-[#1a2030]">
                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <>
                    <div className="p-4 bg-[#f97c0a]/10 border border-[#f97c0a]/20 rounded float-anim">
                      <Upload className="w-8 h-8 text-[#f97c0a]" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#e4e9ef]">Drop your lab report here</p>
                      <p className="text-sm text-[#5a677d] mt-1">or click to browse &nbsp;·&nbsp; PDF, JPG, PNG</p>
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
                    className="mt-4"
                  >
                    <button
                      onClick={handleSubmit}
                      disabled={loading}
                      className="w-full h-12 rounded bg-gradient-to-r from-[#f97c0a] to-[#ea5f04] hover:from-[#ff8f20] hover:to-[#f97c0a] text-white font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#f97c0a]/20 disabled:opacity-60"
                    >
                      {loading ? <><Loader2 className="w-4 h-4 animate-spin" />{loadingText}</> : <>Analyze Report <ChevronRight className="w-4 h-4" /></>}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Demo buttons */}
              <div className="mt-5">
                <div className="flex items-center gap-2 text-[#5a677d] text-sm mb-3 justify-center">
                  <div className="h-px flex-1 bg-[#1a2030]" />
                  <span className="text-xs">or try a demo report</span>
                  <div className="h-px flex-1 bg-[#1a2030]" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => { const { saveReportToHistory } = useStore.getState(); setReportData(mockAnemia); saveReportToHistory(); router.push('/dashboard'); }}
                    className="flex items-center justify-center gap-2 py-2.5 rounded border border-[#f97c0a]/25 bg-[#f97c0a]/5 text-[#f97c0a] text-sm font-semibold hover:bg-[#f97c0a]/10 hover:border-[#f97c0a]/50 transition-all"
                  >
                    <FileText className="w-4 h-4" /> Anemia Report
                  </button>
                  <button
                    onClick={() => { const { saveReportToHistory } = useStore.getState(); setReportData(mockLiver); saveReportToHistory(); router.push('/dashboard'); }}
                    className="flex items-center justify-center gap-2 py-2.5 rounded border border-[#10b981]/25 bg-[#10b981]/5 text-[#10b981] text-sm font-semibold hover:bg-[#10b981]/10 hover:border-[#10b981]/50 transition-all"
                  >
                    <FileText className="w-4 h-4" /> Liver Report
                  </button>
                </div>
              </div>

              <p className="text-[#2a3545] text-[11px] text-center mt-4 flex items-center justify-center gap-1">
                <ShieldCheck className="w-3 h-3 text-[#10b981]" /> Data processed in-session only. Never stored permanently.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ── How It Works strip ── */}
      <section className="relative z-10 border-t border-[#1a2030] px-6 md:px-12 py-12">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-[11px] text-[#5a677d] uppercase font-bold tracking-[0.3em] mb-10">How It Works</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {howItWorks.map((h) => (
              <motion.div
                key={h.step}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex gap-4 items-start"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded border border-[#1a2030] bg-[#0d1117] flex items-center justify-center text-xl">
                  {h.icon}
                </div>
                <div>
                  <p className="text-[10px] text-[#f97c0a] font-bold uppercase tracking-widest mb-1">Step {h.step}</p>
                  <h3 className="text-white font-semibold text-sm mb-1">{h.title}</h3>
                  <p className="text-[#5a677d] text-xs leading-relaxed">{h.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
