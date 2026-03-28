'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  AlertCircle,
  CheckCircle2,
  FileText,
  Globe,
  MessageSquare,
  ShieldCheck,
  Target,
  TrendingUp,
  Bot,
  Activity,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LabTable } from '@/components/LabTable';
import { Checklist } from '@/components/Checklist';
import { DoctorChat } from '@/components/DoctorChat';
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from 'recharts';
import TypewriterText from '@/components/TypewriterText';

export default function Dashboard() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'ABNORMAL' | 'NORMAL'>('ALL');

  useEffect(() => { setIsMounted(true); }, []);

  const { reportText, language, summary, hindiSummary, jargonMap, ai_confidence_score, labValues, toggleLanguage, t } = useStore();

  // Compute a rough "health score" from lab values
  const normalCount  = labValues.filter((v: any) => v.status === 'NORMAL').length;
  const totalCount   = labValues.length;
  const healthScore  = totalCount > 0 ? Math.round((normalCount / totalCount) * 100) : 0;
  const abnormalCount = totalCount - normalCount;

  const scoreColor = healthScore >= 80 ? '#10b981' : healthScore >= 60 ? '#f97c0a' : '#ef4444';

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
  const item      = { hidden: { y: 20, opacity: 0 }, show: { y: 0, opacity: 1 } };

  return (
    <div className="min-h-screen bg-[#070A0E] pb-28 pt-8 px-4 md:px-8">
      <DoctorChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

      <div className="max-w-7xl mx-auto space-y-6">

        {/* ── Top Bar ── */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Swasth<span className="text-[#f97c0a]">Disha</span>
              <span className="text-[#5a677d] font-light text-xl"> AI</span>
            </h2>
            <p className="text-[#5a677d] text-sm font-medium mt-0.5">{t('dashboard_subtitle')}</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleLanguage}
              className="border-[#1a2030] bg-transparent hover:bg-[#1a2030] text-[#8a97aa] hover:text-white h-9 gap-2 font-semibold text-xs rounded transition-all"
            >
              <Globe className="w-3.5 h-3.5" />
              {language === 'EN' ? t('translate_to_hindi') : t('switch_to_english')}
            </Button>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setIsChatOpen(true)}
              className="relative flex items-center gap-2 px-5 py-2.5 bg-[#f97c0a] hover:bg-[#ea5f04] text-white font-bold text-sm rounded shadow-lg shadow-[#f97c0a]/25 transition-all"
            >
              <Bot className="w-4 h-4" />
              Ask Dr. Umeed
              <span className="absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full bg-[#10b981] border-2 border-[#070A0E] animate-pulse" />
            </motion.button>
          </div>
        </div>

        {/* ── Health Score Hero Strip ── */}
        {totalCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {/* Score */}
            <div className="md:col-span-1 bg-[#0d1117] border border-[#1a2030] rounded p-4 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-[3px] h-full" style={{ background: scoreColor }} />
              <p className="text-[10px] text-[#5a677d] font-bold uppercase tracking-widest mb-1">{t('health_score')}</p>
              <div className="flex items-end gap-2">
                <span className="text-5xl font-bold" style={{ color: scoreColor }}>{healthScore}</span>
                <span className="text-[#5a677d] text-sm mb-1">/100</span>
              </div>
              <div className="mt-2 h-1.5 bg-[#1a2030] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${healthScore}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="h-full rounded-full"
                  style={{ background: scoreColor }}
                />
              </div>
            </div>

            {/* Normal */}
            <div className="bg-[#0d1117] border border-[#1a2030] rounded p-4 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-[3px] h-full bg-[#10b981]" />
              <p className="text-[10px] text-[#5a677d] font-bold uppercase tracking-widest mb-1">{t('normal')}</p>
              <span className="text-4xl font-bold text-[#10b981]">{normalCount}</span>
              <p className="text-[11px] text-[#5a677d] mt-1">{t('biomarkers_in_range')}</p>
            </div>

            {/* Abnormal */}
            <div className="bg-[#0d1117] border border-[#1a2030] rounded p-4 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-[3px] h-full bg-[#f97c0a]" />
              <p className="text-[10px] text-[#5a677d] font-bold uppercase tracking-widest mb-1">{t('attention')}</p>
              <span className="text-4xl font-bold text-[#f97c0a]">{abnormalCount}</span>
              <p className="text-[11px] text-[#5a677d] mt-1">{t('need_attention')}</p>
            </div>

            {/* AI Confidence */}
            <div className="bg-[#0d1117] border border-[#1a2030] rounded p-4 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-[3px] h-full bg-[#6366f1]" />
              <p className="text-[10px] text-[#5a677d] font-bold uppercase tracking-widest mb-1">{t('ai_confidence')}</p>
              <span className="text-4xl font-bold text-[#6366f1]">{ai_confidence_score || 0}%</span>
              <p className="text-[11px] text-[#5a677d] mt-1">{t('analysis_confidence')}</p>
            </div>
          </motion.div>
        )}

        {/* ── Main Grid ── */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-12 gap-5"
        >
          {/* AI Explanation — NOW FULL WIDTH FIRST */}
          <motion.div variants={item} className="md:col-span-12">
            <div className="bg-[#0d1117] border border-[#1a2030] rounded p-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#f97c0a]/60 to-transparent" />
              <div className="flex justify-between items-center mb-5">
                <div className="flex items-center gap-2 text-[#f97c0a]">
                  <ShieldCheck className="w-5 h-5" />
                  <h3 className="font-bold text-sm uppercase tracking-widest">{t('doctor_explanation')}</h3>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleLanguage}
                  className="border-[#1a2030] bg-transparent hover:bg-[#1a2030] text-[#8a97aa] hover:text-white h-8 gap-2 font-semibold text-[10px] uppercase tracking-wider rounded transition-all"
                >
                  <Globe className="w-3 h-3" />
                  {language === 'EN' ? t('translate_to_hindi') : t('switch_to_english')}
                </Button>
              </div>
              <div className="text-[#c8d3e0] text-base font-medium leading-relaxed min-h-[80px]">
                <TypewriterText text={language === 'EN' ? summary : hindiSummary} speed={15} />
              </div>
            </div>
          </motion.div>

          {/* Lab Table */}
          <motion.div variants={item} className="md:col-span-8">
            <div className="bg-[#0d1117] border border-[#1a2030] rounded overflow-hidden">
              <div className="p-5 border-b border-[#1a2030] flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#f97c0a]">
                  <Target className="w-4 h-4" />
                  <h3 className="font-bold text-sm uppercase tracking-widest">{t('lab_parameters')}</h3>
                </div>
                <div className="flex items-center gap-2">
                  {(['ALL', 'ABNORMAL', 'NORMAL'] as const).map(f => (
                    <button
                      key={f}
                      onClick={() => setActiveFilter(f)}
                      className={`px-3 py-1 text-[9px] font-bold uppercase rounded border transition-all ${
                        activeFilter === f
                          ? f === 'NORMAL'
                            ? 'bg-[#10b981]/15 border-[#10b981]/40 text-[#10b981]'
                            : f === 'ABNORMAL'
                            ? 'bg-[#f97c0a]/15 border-[#f97c0a]/40 text-[#f97c0a]'
                            : 'bg-[#1a2030] border-[#2a3545] text-white'
                          : 'border-[#1a2030] text-[#5a677d] hover:text-[#8a97aa]'
                      }`}
                    >
                      {f === 'ALL' ? t('filter_all') : f === 'ABNORMAL' ? t('filter_abnormal') : t('filter_normal')}
                    </button>
                  ))}
                  <Badge className="bg-[#10b981]/10 text-[#10b981] border-[#10b981]/20 font-bold uppercase tracking-widest text-[9px] px-2 py-1 ml-1">
                    {t('clinical_sync')}
                  </Badge>
                </div>
              </div>
              <div className="p-5">
                <LabTable />
              </div>
            </div>
          </motion.div>

          {/* Action Plan */}
          <motion.div variants={item} className="md:col-span-4">
            <div className="bg-[#0d1117] border border-[#1a2030] rounded p-5 h-full relative overflow-hidden">
              <div className="absolute top-0 left-0 w-[3px] h-full bg-gradient-to-b from-[#10b981] to-transparent" />
              <div className="flex items-center gap-2 mb-5 text-[#10b981]">
                <CheckCircle2 className="w-4 h-4" />
                <h3 className="font-bold text-sm uppercase tracking-widest">{t('action_plan')}</h3>
              </div>
              <Checklist />
            </div>
          </motion.div>

          {/* Report Source */}
          <motion.div variants={item} className="md:col-span-12">
            <div className="bg-[#0d1117] border border-[#1a2030] rounded p-5 relative overflow-hidden">
              <div className="flex items-center gap-2 mb-4 text-[#5a677d]">
                <FileText className="w-4 h-4" />
                <h3 className="font-bold text-xs uppercase tracking-widest">{t('report_source')}</h3>
              </div>
              <p className="text-[#5a677d] text-xs font-mono leading-relaxed whitespace-pre-wrap line-clamp-4">
                {reportText ? reportText.substring(0, 600) + '…' : 'No report data loaded.'}
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Footer tag */}
      <div className="fixed bottom-16 right-6 hidden xl:flex flex-col items-end opacity-20 hover:opacity-60 transition-opacity cursor-default">
        <span className="text-[9px] font-bold tracking-[0.4em] text-[#f97c0a]">SWASTHDISHA AI CORE</span>
        <span className="text-[8px] text-[#5a677d]">VERSION 2.0 · LLaMA 3.1 8B</span>
      </div>
    </div>
  );
}
