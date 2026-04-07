'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore, UserProfile } from '@/lib/store';
import { getDailyTargets } from '@/lib/nutritionEngine';
import { X, User, Activity, Flame } from 'lucide-react';

interface Props { isOpen: boolean; onClose: () => void; dietaryFlags: string[]; }

const ACTIVITY_OPTIONS = [
  { value: 'sedentary', label: 'Sedentary',  sub: 'Desk job, no exercise',     icon: '🪑' },
  { value: 'light',     label: 'Light',       sub: '1–3 days/week exercise',   icon: '🚶' },
  { value: 'moderate',  label: 'Moderate',    sub: '3–5 days/week exercise',   icon: '🏃' },
  { value: 'active',    label: 'Very Active', sub: '6–7 days hard training',   icon: '⚡' },
] as const;

const MULTIPLIERS = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725 };

function calcRawTDEE(p: UserProfile) {
  const bmr = p.gender === 'male'
    ? 10 * p.weightKg + 6.25 * p.heightCm - 5 * p.age + 5
    : 10 * p.weightKg + 6.25 * p.heightCm - 5 * p.age - 161;
  return Math.round(bmr * MULTIPLIERS[p.activityLevel]);
}

export default function UserProfileModal({ isOpen, onClose, dietaryFlags }: Props) {
  const { userProfile, setUserProfile } = useStore();

  const [form, setForm] = useState<UserProfile>(userProfile ?? {
    gender: 'male', age: 25, weightKg: 65, heightCm: 170, activityLevel: 'light', goal: 'maintain',
  });

  // Separate raw string state so the user can freely type/backspace
  // without being clamped to min on every keystroke
  const [rawValues, setRawValues] = useState({
    age:      String((userProfile ?? { age: 25 }).age),
    weightKg: String((userProfile ?? { weightKg: 65 }).weightKg),
    heightCm: String((userProfile ?? { heightCm: 170 }).heightCm),
  });

  const rawTDEE    = calcRawTDEE(form);                        // Pure BMR × activity
  const adjustedTarget = getDailyTargets(dietaryFlags, form).calories; // Condition-adjusted

  const save = () => { setUserProfile(form); onClose(); };

  const field = (key: keyof UserProfile, value: any) =>
    setForm((f) => ({ ...f, [key]: value }));

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            className="fixed bottom-0 left-0 right-0 md:right-auto md:top-0 md:w-[420px] z-50 bg-[#0d1117] border-t md:border-t-0 md:border-r border-[#1a2030] overflow-y-auto"
            initial={{ y: '100%', x: 0 }} animate={{ y: 0, x: 0 }} exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            style={{ maxHeight: '92vh' }}
          >
            {/* Header */}
            <div className="sticky top-0 bg-[#0d1117] border-b border-[#1a2030] px-6 py-4 flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded bg-[#f97c0a]/10 border border-[#f97c0a]/20">
                  <User className="w-4 h-4 text-[#f97c0a]" />
                </div>
                <div>
                  <h2 className="font-bold text-white text-sm">Your Health Profile</h2>
                  <p className="text-[10px] text-[#5a677d]">Used to personalise your calorie target</p>
                </div>
              </div>
              <button onClick={onClose} className="p-1.5 rounded hover:bg-[#1a2030] text-[#5a677d] hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Live TDEE Preview */}
              <div className="bg-[#f97c0a]/8 border border-[#f97c0a]/20 rounded p-4">
                <div className="flex items-center gap-2 text-[#f97c0a] mb-3">
                  <Flame className="w-5 h-5" />
                  <span className="text-sm font-bold">Your Daily Calorie Target</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-center">
                    <p className="text-[10px] text-[#5a677d] uppercase tracking-widest mb-1">Base TDEE</p>
                    <p className="text-xl font-bold text-[#8a97aa]">{rawTDEE.toLocaleString()}</p>
                  </div>
                  {rawTDEE !== adjustedTarget && (
                    <>
                      <div className="text-[#5a677d] text-lg">×{(adjustedTarget / rawTDEE).toFixed(2)}</div>
                      <div className="text-[10px] text-[#5a677d] text-center">
                        <p className="uppercase tracking-widest mb-1">Condition adj.</p>
                        <p className="text-[9px] text-[#3d4f63]">(medical flag)</p>
                      </div>
                      <div className="text-[#5a677d] text-lg">=</div>
                    </>
                  )}
                  <div className="text-center">
                    <p className="text-[10px] text-[#5a677d] uppercase tracking-widest mb-1">Your Target</p>
                    <motion.p
                      key={adjustedTarget}
                      initial={{ scale: 1.2, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-3xl font-bold text-white"
                    >
                      {adjustedTarget.toLocaleString()}
                      <span className="text-sm text-[#5a677d] font-normal ml-1">kcal</span>
                    </motion.p>
                  </div>
                </div>
              </div>

              {/* Gender */}
              <div>
                <label className="text-[10px] font-bold text-[#5a677d] uppercase tracking-widest mb-3 flex items-center gap-2">
                  <User className="w-3 h-3" /> Biological Sex
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {(['male', 'female'] as const).map((g) => (
                    <button
                      key={g}
                      onClick={() => field('gender', g)}
                      className={`py-3 rounded border font-bold text-sm capitalize transition-all
                        ${form.gender === g
                          ? 'border-[#f97c0a]/50 bg-[#f97c0a]/10 text-[#f97c0a]'
                          : 'border-[#1a2030] text-[#5a677d] hover:border-[#1e2a3a] hover:text-[#8a97aa]'}`}
                    >
                      {g === 'male' ? '👨 Male' : '👩 Female'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Age / Weight / Height */}
              <div className="grid grid-cols-3 gap-4">
                {[
                { key: 'age',       label: 'Age',    unit: 'yrs', icon: '🎂', min: 10,  max: 100, step: 1 },
                { key: 'weightKg',  label: 'Weight', unit: 'kg',  icon: '⚖️', min: 30,  max: 200, step: 1 },
                { key: 'heightCm',  label: 'Height', unit: 'cm',  icon: '📏', min: 100, max: 250, step: 1 },
              ].map(({ key, label, unit, icon, min, max, step }) => {
                const numVal = form[key as keyof UserProfile] as number;
                const raw    = rawValues[key as keyof typeof rawValues];
                const dec = () => {
                  const next = Math.max(min, numVal - step);
                  setRawValues(r => ({ ...r, [key]: String(next) }));
                  field(key as keyof UserProfile, next);
                };
                const inc = () => {
                  const next = Math.min(max, numVal + step);
                  setRawValues(r => ({ ...r, [key]: String(next) }));
                  field(key as keyof UserProfile, next);
                };
                return (
                  <div key={key}>
                    <label className="text-[10px] font-bold text-[#5a677d] uppercase tracking-widest mb-2 block">
                      {icon} {label}
                    </label>
                    <div className="flex items-center bg-[#1a2030] border border-[#1e2a3a] rounded overflow-hidden focus-within:border-[#f97c0a]/50 transition-colors">
                      <button
                        type="button"
                        onClick={dec}
                        className="px-2.5 py-3 text-[#5a677d] hover:text-white hover:bg-[#f97c0a]/10 transition-colors text-lg leading-none select-none"
                      >−</button>
                      <div className="flex-1 text-center">
                        <input
                          type="text"
                          inputMode="numeric"
                          value={raw}
                          onChange={(e) => {
                            // Allow free typing — only digits, no clamping yet
                            const cleaned = e.target.value.replace(/\D/g, '');
                            setRawValues(r => ({ ...r, [key]: cleaned }));
                          }}
                          onBlur={() => {
                            // On blur: parse, clamp, and sync back to form + rawValues
                            const n = parseInt(raw, 10);
                            const clamped = isNaN(n) ? min : Math.min(max, Math.max(min, n));
                            setRawValues(r => ({ ...r, [key]: String(clamped) }));
                            field(key as keyof UserProfile, clamped);
                          }}
                          className="w-full bg-transparent text-white font-bold text-lg text-center focus:outline-none py-2"
                        />
                        <div className="text-[9px] text-[#5a677d] pb-1 -mt-1">{unit}</div>
                      </div>
                      <button
                        type="button"
                        onClick={inc}
                        className="px-2.5 py-3 text-[#5a677d] hover:text-white hover:bg-[#f97c0a]/10 transition-colors text-lg leading-none select-none"
                      >+</button>
                    </div>
                  </div>
                );
              })}
              </div>

              {/* Activity Level */}
              <div>
                <label className="text-[10px] font-bold text-[#5a677d] uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Activity className="w-3 h-3" /> Activity Level
                </label>
                <div className="space-y-2">
                  {ACTIVITY_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => field('activityLevel', opt.value)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded border transition-all text-left
                        ${form.activityLevel === opt.value
                          ? 'border-[#f97c0a]/40 bg-[#f97c0a]/8 text-white'
                          : 'border-[#1a2030] text-[#5a677d] hover:border-[#1e2a3a] hover:text-[#8a97aa]'}`}
                    >
                      <span className="text-xl">{opt.icon}</span>
                      <div className="flex-1">
                        <p className={`text-sm font-bold ${form.activityLevel === opt.value ? 'text-[#f97c0a]' : ''}`}>
                          {opt.label}
                        </p>
                        <p className="text-[10px] text-[#5a677d]">{opt.sub}</p>
                      </div>
                      <span className={`text-[10px] font-bold tabular-nums ${form.activityLevel === opt.value ? 'text-[#f97c0a]' : 'text-[#3d4f63]'}`}>
                        ×{MULTIPLIERS[opt.value]}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Goal */}
              <div>
                <label className="text-[10px] font-bold text-[#5a677d] uppercase tracking-widest mb-3 flex items-center gap-2">
                  🎯 Your Goal
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {([
                    { value: 'lose',     label: 'Lose Weight',    icon: '📉', sub: '−400 kcal/day' },
                    { value: 'maintain', label: 'Maintain',       icon: '⚖️', sub: 'Eat at TDEE' },
                    { value: 'gain',     label: 'Gain / Build',   icon: '📈', sub: '+300 kcal/day' },
                  ] as const).map((g) => (
                    <button
                      key={g.value}
                      onClick={() => field('goal', g.value)}
                      className={`flex flex-col items-center gap-1 py-3 px-2 rounded border text-center transition-all
                        ${ form.goal === g.value
                          ? g.value === 'lose'     ? 'border-[#ef4444]/50 bg-[#ef4444]/10 text-[#ef4444]'
                          : g.value === 'gain'     ? 'border-[#10b981]/50 bg-[#10b981]/10 text-[#10b981]'
                          :                          'border-[#f97c0a]/50 bg-[#f97c0a]/10 text-[#f97c0a]'
                          : 'border-[#1a2030] text-[#5a677d] hover:border-[#1e2a3a] hover:text-[#8a97aa]'
                        }`}
                    >
                      <span className="text-xl">{g.icon}</span>
                      <span className="text-[10px] font-bold uppercase tracking-wider leading-tight">{g.label}</span>
                      <span className="text-[9px] opacity-70">{g.sub}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* How it's calculated */}
              <div className="bg-[#070A0E] border border-[#1a2030] rounded p-4 text-[11px] text-[#5a677d] space-y-1 font-mono">
                <p className="text-[#3d4f63] uppercase text-[9px] font-bold tracking-widest mb-2">Mifflin-St Jeor Formula</p>
                <p>BMR = (10 × {form.weightKg}) + (6.25 × {form.heightCm}) − (5 × {form.age}) {form.gender === 'male' ? '+ 5' : '− 161'}</p>
                <p>TDEE = BMR × {MULTIPLIERS[form.activityLevel]} = {rawTDEE.toLocaleString()} kcal</p>
                {rawTDEE !== adjustedTarget && (
                  <p className="text-[#f97c0a]">Medical condition adj. = ×{(adjustedTarget / rawTDEE).toFixed(2)}</p>
                )}
                {form.goal !== 'maintain' && (
                  <p className="text-[#f97c0a]">Goal offset = {form.goal === 'lose' ? '−400' : '+300'} kcal</p>
                )}
                <p className="text-[#f97c0a] font-bold">Final target = {adjustedTarget.toLocaleString()} kcal/day</p>
              </div>

              {/* Save */}
              <button
                onClick={save}
                className="w-full py-3.5 bg-gradient-to-r from-[#f97c0a] to-[#ea5f04] hover:from-[#ff8f20] hover:to-[#f97c0a] text-white font-bold rounded text-sm shadow-lg shadow-[#f97c0a]/20 transition-all"
              >
                Save Profile & Update Rings
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
