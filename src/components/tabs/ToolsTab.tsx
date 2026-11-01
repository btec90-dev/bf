import React, { useState, useEffect } from 'react';
import {
  Heart,
  Activity,
  TrendingUp,
  Clock,
  Baby,
  ShieldCheck,
  Plus,
  Play,
  Square,
  RotateCcw,
  AlertTriangle,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  HelpCircle,
  Calendar,
  Share2,
} from 'lucide-react';
import {
  BloodPressureLog,
  GlucoseLog,
  WeightLog,
  KickLog,
  ContractionLog,
  GlucoseContext,
  MedicationSafetyStatus,
} from '../../types';
import { MEDICATIONS_DATABASE } from '../../data/medicationsData';
import { analyzeBloodPressure, analyzeGlucose, analyzeWeightGain } from '../../utils/clinicalEngine';

interface Props {
  bpLogs: BloodPressureLog[];
  onAddBP: (log: Omit<BloodPressureLog, 'id'>) => void;
  glucoseLogs: GlucoseLog[];
  onAddGlucose: (log: Omit<GlucoseLog, 'id'>) => void;
  weightLogs: WeightLog[];
  onAddWeight: (log: Omit<WeightLog, 'id'>) => void;
  kickLogs: KickLog[];
  onSaveKickSession: (log: Omit<KickLog, 'id'>) => void;
  contractionLogs: ContractionLog[];
  onSaveContraction: (log: Omit<ContractionLog, 'id'>) => void;
  onClearContractions: () => void;
  onOpenExport: () => void;
}

export const ToolsTab: React.FC<Props> = ({
  bpLogs,
  onAddBP,
  glucoseLogs,
  onAddGlucose,
  weightLogs,
  onAddWeight,
  kickLogs,
  onSaveKickSession,
  contractionLogs,
  onSaveContraction,
  onClearContractions,
  onOpenExport,
}) => {
  const [activeTool, setActiveTool] = useState<
    'bp' | 'glucose' | 'weight' | 'kicks' | 'contractions' | 'meds'
  >('bp');

  // FORM STATES: BP
  const [sysInput, setSysInput] = useState<number>(118);
  const [diaInput, setDiaInput] = useState<number>(75);
  const [pulseInput, setPulseInput] = useState<number>(78);

  // FORM STATES: Glucose
  const [glucoseVal, setGlucoseVal] = useState<number>(88);
  const [glucoseContext, setGlucoseContext] = useState<GlucoseContext>('fasting');

  // FORM STATES: Weight
  const [weightVal, setWeightVal] = useState<number>(64.5);

  // KICK COUNTER STATE
  const [kickCount, setKickCount] = useState<number>(0);
  const [isKickTracking, setIsKickTracking] = useState<boolean>(false);
  const [kickStartTime, setKickStartTime] = useState<number | null>(null);
  const [kickElapsedSeconds, setKickElapsedSeconds] = useState<number>(0);

  // CONTRACTION TIMER STATE
  const [isContracting, setIsContracting] = useState<boolean>(false);
  const [contractionStart, setContractionStart] = useState<number | null>(null);
  const [contractionElapsed, setContractionElapsed] = useState<number>(0);

  // MEDICATION SEARCH & FILTER
  const [medQuery, setMedQuery] = useState('');
  const [medStatusFilter, setMedStatusFilter] = useState<MedicationSafetyStatus | 'all'>('all');

  // Kick counter tick
  useEffect(() => {
    let interval: number;
    if (isKickTracking && kickStartTime) {
      interval = window.setInterval(() => {
        if (kickStartTime) {
          setKickElapsedSeconds(Math.floor((Date.now() - kickStartTime) / 1000));
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isKickTracking, kickStartTime]);

  // Contraction timer tick
  useEffect(() => {
    let interval: number;
    if (isContracting) {
      interval = window.setInterval(() => {
        if (contractionStart) {
          setContractionElapsed(Math.floor((Date.now() - contractionStart) / 1000));
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isContracting, contractionStart]);

  // Handle kick counter click
  const handleKickTap = () => {
    if (!isKickTracking) {
      setIsKickTracking(true);
      setKickStartTime(Date.now());
      setKickCount(1);
      setKickElapsedSeconds(0);
      return;
    }

    const nextCount = kickCount + 1;
    setKickCount(nextCount);

    if (nextCount >= 10) {
      const totalSeconds = kickStartTime ? Math.floor((Date.now() - kickStartTime) / 1000) : 0;
      onSaveKickSession({
        timestamp: new Date().toISOString(),
        durationSeconds: totalSeconds,
        kickCount: 10,
        completed: true,
      });
      setIsKickTracking(false);
      setKickStartTime(null);
    }
  };

  const handleResetKicks = () => {
    setIsKickTracking(false);
    setKickStartTime(null);
    setKickCount(0);
    setKickElapsedSeconds(0);
  };

  // Contraction Timer handlers
  const handleToggleContraction = () => {
    if (!isContracting) {
      setIsContracting(true);
      setContractionStart(Date.now());
      setContractionElapsed(0);
    } else {
      const now = Date.now();
      const dur = contractionStart ? Math.floor((now - contractionStart) / 1000) : 0;

      let intervalSec: number | undefined;
      if (contractionLogs.length > 0 && contractionStart) {
        const lastStartTime = new Date(contractionLogs[0].startTime).getTime();
        intervalSec = Math.floor((contractionStart - lastStartTime) / 1000);
      }

      onSaveContraction({
        startTime: new Date(contractionStart || now).toISOString(),
        durationSeconds: dur,
        intervalSeconds: intervalSec,
      });

      setIsContracting(false);
      setContractionStart(null);
      setContractionElapsed(0);
    }
  };

  // Format seconds to mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // 5-1-1 Rule Evaluation
  const recentContractions = contractionLogs.slice(0, 4);
  const rule511Match =
    recentContractions.length >= 3 &&
    recentContractions.every((c) => c.durationSeconds >= 45) &&
    recentContractions.every((c) => (c.intervalSeconds ? c.intervalSeconds <= 360 : true));

  // Weight gain alert calculation
  const weightAlert = analyzeWeightGain(weightLogs);

  // Filtered Medications
  const filteredMeds = MEDICATIONS_DATABASE.filter((m) => {
    const matchesQuery =
      m.name.toLowerCase().includes(medQuery.toLowerCase()) ||
      m.clinicalSummary.toLowerCase().includes(medQuery.toLowerCase()) ||
      m.safeAlternatives.toLowerCase().includes(medQuery.toLowerCase());
    const matchesStatus = medStatusFilter === 'all' || m.status === medStatusFilter;
    return matchesQuery && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#8a5732] dark:text-[#d49970] font-semibold uppercase tracking-wider">
            <span>Outils &amp; Constantes Vitales</span>
            <span aria-hidden="true">·</span>
            <span>Moteur Diagnostique ACOG &amp; CDC</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#2d221a] dark:text-white mt-0.5">
            Suivi des Constantes, Compteurs &amp; Médicaments
          </h1>
        </div>

        <button
          type="button"
          onClick={onOpenExport}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-[#744421] dark:text-[#eedacb] bg-[#f4ece2] dark:bg-[#342921] hover:bg-[#ebdcc9] dark:hover:bg-[#43352b] border border-[#e4d7c8] dark:border-[#47372b] rounded-xl transition-all cursor-pointer shadow-xs self-start sm:self-auto shrink-0"
        >
          <Share2 className="w-4 h-4 text-[#8a5732] dark:text-[#d49970]" />
          <span>Exporter pour la sage-femme (CSV/JSON)</span>
        </button>
      </div>

      {/* Segmented Control Bar for Tools */}
      <div className="flex items-center gap-1.5 p-1.5 bg-[#ede4d8] dark:bg-[#2b221b] rounded-2xl overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTool('bp')}
          className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl transition-colors whitespace-nowrap cursor-pointer ${
            activeTool === 'bp'
              ? 'bg-white dark:bg-[#3d3127] text-[#2d221a] dark:text-white shadow-xs'
              : 'text-[#665444] dark:text-[#c4b5a6] hover:text-[#2d221a]'
          }`}
        >
          <Heart className="w-3.5 h-3.5 text-[#8a5732]" />
          <span>Tensiomètre ACOG</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTool('glucose')}
          className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl transition-colors whitespace-nowrap cursor-pointer ${
            activeTool === 'glucose'
              ? 'bg-white dark:bg-[#3d3127] text-[#2d221a] dark:text-white shadow-xs'
              : 'text-[#665444] dark:text-[#c4b5a6] hover:text-[#2d221a]'
          }`}
        >
          <Activity className="w-3.5 h-3.5 text-sky-700 dark:text-sky-400" />
          <span>Glycémie &amp; Diabète</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTool('weight')}
          className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl transition-colors whitespace-nowrap cursor-pointer ${
            activeTool === 'weight'
              ? 'bg-white dark:bg-[#3d3127] text-[#2d221a] dark:text-white shadow-xs'
              : 'text-[#665444] dark:text-[#c4b5a6] hover:text-[#2d221a]'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
          <span>Suivi Pondéral</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTool('kicks')}
          className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl transition-colors whitespace-nowrap cursor-pointer ${
            activeTool === 'kicks'
              ? 'bg-white dark:bg-[#3d3127] text-[#2d221a] dark:text-white shadow-xs'
              : 'text-[#665444] dark:text-[#c4b5a6] hover:text-[#2d221a]'
          }`}
        >
          <Baby className="w-3.5 h-3.5 text-[#7b4d29] dark:text-[#debba4]" />
          <span>Compteur de Coups</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTool('contractions')}
          className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl transition-colors whitespace-nowrap cursor-pointer ${
            activeTool === 'contractions'
              ? 'bg-white dark:bg-[#3d3127] text-[#2d221a] dark:text-white shadow-xs'
              : 'text-[#665444] dark:text-[#c4b5a6] hover:text-[#2d221a]'
          }`}
        >
          <Clock className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
          <span>Chronomètre Contractions</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTool('meds')}
          className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl transition-colors whitespace-nowrap cursor-pointer ${
            activeTool === 'meds'
              ? 'bg-white dark:bg-[#3d3127] text-[#2d221a] dark:text-white shadow-xs'
              : 'text-[#665444] dark:text-[#c4b5a6] hover:text-[#2d221a]'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
          <span>Sécurité Médicaments (28)</span>
        </button>
      </div>

      {/* 1. BLOOD PRESSURE TOOL */}
      {activeTool === 'bp' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* BP Entry & Real-time Analysis */}
          <div className="lg:col-span-6 bg-white dark:bg-[#231d18] border border-[#e5dcd1] dark:border-[#382d24] rounded-2xl p-5 sm:p-7 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#eee5da] dark:border-[#382d24]">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-[#8a5732]" />
                <h2 className="font-bold text-[#2d221a] dark:text-white text-base">
                  Enregistrer une Tension Artérielle
                </h2>
              </div>
              <span className="text-[11px] font-mono text-[#7d6c5d] dark:text-[#a8988a]">Classification ACOG</span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-[#7d6c5d] uppercase tracking-wider block mb-1">
                  Systolique
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={sysInput}
                    onChange={(e) => setSysInput(Number(e.target.value))}
                    min="70"
                    max="220"
                    className="w-full px-3 py-2 text-sm font-mono font-bold rounded-xl bg-[#faf6f0] dark:bg-[#2b221b] border border-[#ebdcc9] dark:border-[#3d3128] text-[#2d221a] dark:text-white focus:outline-none focus:border-[#8a5732]"
                  />
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-[#7d6c5d]">
                    mmHg
                  </span>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#7d6c5d] uppercase tracking-wider block mb-1">
                  Diastolique
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={diaInput}
                    onChange={(e) => setDiaInput(Number(e.target.value))}
                    min="40"
                    max="140"
                    className="w-full px-3 py-2 text-sm font-mono font-bold rounded-xl bg-[#faf6f0] dark:bg-[#2b221b] border border-[#ebdcc9] dark:border-[#3d3128] text-[#2d221a] dark:text-white focus:outline-none focus:border-[#8a5732]"
                  />
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-[#7d6c5d]">
                    mmHg
                  </span>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#7d6c5d] uppercase tracking-wider block mb-1">
                  Pouls
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={pulseInput}
                    onChange={(e) => setPulseInput(Number(e.target.value))}
                    min="40"
                    max="180"
                    className="w-full px-3 py-2 text-sm font-mono font-bold rounded-xl bg-[#faf6f0] dark:bg-[#2b221b] border border-[#ebdcc9] dark:border-[#3d3128] text-[#2d221a] dark:text-white focus:outline-none focus:border-[#8a5732]"
                  />
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-[#7d6c5d]">
                    bpm
                  </span>
                </div>
              </div>
            </div>

            {/* Live Instant Diagnostic Feedback */}
            {(() => {
              const analysis = analyzeBloodPressure(sysInput, diaInput);
              return (
                <div className={`p-4 rounded-xl border ${analysis.badgeBg} text-xs space-y-1.5`}>
                  <div className="flex items-center justify-between font-bold">
                    <span>{analysis.label}</span>
                    {analysis.isUrgent && <AlertTriangle className="w-4 h-4 text-rose-600 animate-bounce" />}
                  </div>
                  <p className="leading-relaxed">{analysis.recommendation}</p>
                </div>
              );
            })()}

            <button
              onClick={() => {
                onAddBP({
                  systolic: sysInput,
                  diastolic: diaInput,
                  pulse: pulseInput,
                  timestamp: new Date().toISOString(),
                });
              }}
              type="button"
              className="w-full py-2.5 px-4 rounded-xl bg-[#8a5732] hover:bg-[#744421] active:bg-[#603518] text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Enregistrer la mesure</span>
            </button>
          </div>

          {/* BP History Log */}
          <div className="lg:col-span-6 bg-white dark:bg-[#231d18] border border-[#e5dcd1] dark:border-[#382d24] rounded-2xl p-5 sm:p-7 shadow-xs">
            <h3 className="font-bold text-[#2d221a] dark:text-white text-base pb-3 border-b border-[#eee5da] dark:border-[#382d24] mb-3">
              Historique des Mesures Tensionnelles
            </h3>

            {bpLogs.length === 0 ? (
              <p className="text-xs text-[#7d6c5d] py-8 text-center">Aucune mesure enregistrée pour l'instant.</p>
            ) : (
              <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
                {bpLogs.map((log) => {
                  const a = analyzeBloodPressure(log.systolic, log.diastolic);
                  const dateStr = new Date(log.timestamp).toLocaleString('fr-FR', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  });
                  return (
                    <div
                      key={log.id}
                      className="p-3 rounded-xl bg-[#faf6f0] dark:bg-[#2b221b] border border-[#ebdcc9] dark:border-[#3d3128] flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-sm text-[#2d221a] dark:text-white">
                            {log.systolic}/{log.diastolic} mmHg
                          </span>
                          {log.pulse && <span className="text-[11px] text-[#7d6c5d] font-mono">({log.pulse} bpm)</span>}
                        </div>
                        <span className={`text-[11px] font-medium block mt-0.5 ${a.colorClass}`}>
                          {a.label}
                        </span>
                      </div>
                      <span className="text-[11px] text-[#7d6c5d] font-mono">{dateStr}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. GLUCOSE TOOL */}
      {activeTool === 'glucose' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-6 bg-white dark:bg-[#231d18] border border-[#e5dcd1] dark:border-[#382d24] rounded-2xl p-5 sm:p-7 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#eee5da] dark:border-[#382d24]">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-sky-700 dark:text-sky-400" />
                <h2 className="font-bold text-[#2d221a] dark:text-white text-base">
                  Relevé Glycémique (Diabète Gestationnel)
                </h2>
              </div>
              <span className="text-[11px] font-mono text-[#7d6c5d]">Seuils HAS</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-[#7d6c5d] uppercase tracking-wider block mb-1">
                  Glycémie mesurée
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={glucoseVal}
                    onChange={(e) => setGlucoseVal(Number(e.target.value))}
                    min="40"
                    max="350"
                    className="w-full px-3 py-2 text-sm font-mono font-bold rounded-xl bg-[#faf6f0] dark:bg-[#2b221b] border border-[#ebdcc9] dark:border-[#3d3128] text-[#2d221a] dark:text-white focus:outline-none focus:border-[#8a5732]"
                  />
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-[#7d6c5d]">
                    mg/dL
                  </span>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#7d6c5d] uppercase tracking-wider block mb-1">
                  Moment du relevé
                </label>
                <select
                  value={glucoseContext}
                  onChange={(e) => setGlucoseContext(e.target.value as GlucoseContext)}
                  className="w-full px-3 py-2 text-xs font-semibold rounded-xl bg-[#faf6f0] dark:bg-[#2b221b] border border-[#ebdcc9] dark:border-[#3d3128] text-[#2d221a] dark:text-white focus:outline-none focus:border-[#8a5732]"
                >
                  <option value="fasting">À jeun (Matin)</option>
                  <option value="post1h">1h après repas</option>
                  <option value="post2h">2h après repas</option>
                  <option value="random">Aléatoire / Nuit</option>
                </select>
              </div>
            </div>

            {/* Diagnostic target feedback */}
            {(() => {
              const gAnalysis = analyzeGlucose(glucoseVal, glucoseContext);
              return (
                <div className={`p-4 rounded-xl border bg-[#faf6f0] dark:bg-[#2b221b] border-[#ebdcc9] dark:border-[#3d3128] text-xs space-y-1.5`}>
                  <div className="flex items-center justify-between font-bold">
                    <span className={gAnalysis.colorClass}>{gAnalysis.interpretation}</span>
                    <span className="font-mono text-[11px] text-[#7d6c5d]">{gAnalysis.targetLabel}</span>
                  </div>
                  <p className="leading-relaxed text-[#5c4c3e] dark:text-[#c4b5a6]">{gAnalysis.recommendation}</p>
                </div>
              );
            })()}

            <button
              onClick={() => {
                onAddGlucose({
                  value: glucoseVal,
                  context: glucoseContext,
                  timestamp: new Date().toISOString(),
                });
              }}
              type="button"
              className="w-full py-2.5 px-4 rounded-xl bg-[#8a5732] hover:bg-[#744421] active:bg-[#603518] text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Enregistrer le taux</span>
            </button>
          </div>

          <div className="lg:col-span-6 bg-white dark:bg-[#231d18] border border-[#e5dcd1] dark:border-[#382d24] rounded-2xl p-5 sm:p-7 shadow-xs">
            <h3 className="font-bold text-[#2d221a] dark:text-white text-base pb-3 border-b border-[#eee5da] dark:border-[#382d24] mb-3">
              Historique Glycémique
            </h3>
            {glucoseLogs.length === 0 ? (
              <p className="text-xs text-[#7d6c5d] py-8 text-center">Aucun relevé glycémique pour l'instant.</p>
            ) : (
              <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
                {glucoseLogs.map((log) => {
                  const g = analyzeGlucose(log.value, log.context);
                  const dateStr = new Date(log.timestamp).toLocaleString('fr-FR', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  });
                  return (
                    <div
                      key={log.id}
                      className="p-3 rounded-xl bg-[#faf6f0] dark:bg-[#2b221b] border border-[#ebdcc9] dark:border-[#3d3128] flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-sm text-[#2d221a] dark:text-white">
                            {log.value} mg/dL
                          </span>
                          <span className="text-[11px] text-[#7d6c5d] font-medium capitalize">({log.context})</span>
                        </div>
                        <span className={`text-[11px] font-medium block mt-0.5 ${g.colorClass}`}>
                          {g.interpretation}
                        </span>
                      </div>
                      <span className="text-[11px] text-[#7d6c5d] font-mono">{dateStr}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. WEIGHT TOOL */}
      {activeTool === 'weight' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-6 bg-white dark:bg-[#231d18] border border-[#e5dcd1] dark:border-[#382d24] rounded-2xl p-5 sm:p-7 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#eee5da] dark:border-[#382d24]">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                <h2 className="font-bold text-[#2d221a] dark:text-white text-base">
                  Pesée Maternelle &amp; Alerte Rétention
                </h2>
              </div>
              <span className="text-[11px] font-mono text-[#7d6c5d]">Suivi IMC</span>
            </div>

            {weightAlert.hasAlert && (
              <div className="p-4 rounded-xl bg-[#fcf2f2] dark:bg-[#341d1d] border border-rose-300 dark:border-rose-900 text-xs text-rose-950 dark:text-rose-200 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold">Vigilance Pré-éclampsie :</strong>
                  <p className="mt-0.5 leading-relaxed">{weightAlert.alertMessage}</p>
                </div>
              </div>
            )}

            <div>
              <label className="text-[11px] font-semibold text-[#7d6c5d] uppercase tracking-wider block mb-1">
                Poids mesuré
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  value={weightVal}
                  onChange={(e) => setWeightVal(Number(e.target.value))}
                  min="35"
                  max="180"
                  className="w-full px-3 py-2 text-sm font-mono font-bold rounded-xl bg-[#faf6f0] dark:bg-[#2b221b] border border-[#ebdcc9] dark:border-[#3d3128] text-[#2d221a] dark:text-white focus:outline-none focus:border-[#8a5732]"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#7d6c5d] font-mono">
                  kg
                </span>
              </div>
            </div>

            <p className="text-xs text-[#5c4c3e] dark:text-[#c4b5a6] leading-relaxed">
              <strong>Conseil obstétrical :</strong> Pesez-vous une fois par semaine, le matin à jeun et dans les mêmes conditions. Une prise de poids soudaine de plus de 1,5 kg en quelques jours peut indiquer une rétention d'eau aiguë liée à une élévation tensionnelle.
            </p>

            <button
              onClick={() => {
                onAddWeight({
                  weight: weightVal,
                  timestamp: new Date().toISOString(),
                });
              }}
              type="button"
              className="w-full py-2.5 px-4 rounded-xl bg-[#8a5732] hover:bg-[#744421] active:bg-[#603518] text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Enregistrer la pesée</span>
            </button>
          </div>

          <div className="lg:col-span-6 bg-white dark:bg-[#231d18] border border-[#e5dcd1] dark:border-[#382d24] rounded-2xl p-5 sm:p-7 shadow-xs">
            <h3 className="font-bold text-[#2d221a] dark:text-white text-base pb-3 border-b border-[#eee5da] dark:border-[#382d24] mb-3">
              Historique Pondéral
            </h3>
            {weightLogs.length === 0 ? (
              <p className="text-xs text-[#7d6c5d] py-8 text-center">Aucune pesée enregistrée pour l'instant.</p>
            ) : (
              <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
                {weightLogs.map((log) => {
                  const dateStr = new Date(log.timestamp).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  });
                  return (
                    <div
                      key={log.id}
                      className="p-3 rounded-xl bg-[#faf6f0] dark:bg-[#2b221b] border border-[#ebdcc9] dark:border-[#3d3128] flex items-center justify-between text-xs"
                    >
                      <span className="font-mono font-bold text-sm text-[#2d221a] dark:text-white">
                        {log.weight.toFixed(1)} kg
                      </span>
                      <span className="text-[11px] text-[#7d6c5d] font-mono">{dateStr}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. KICK COUNTER TOOL */}
      {activeTool === 'kicks' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7 bg-white dark:bg-[#231d18] border border-[#e5dcd1] dark:border-[#382d24] rounded-2xl p-6 sm:p-8 shadow-xs text-center space-y-6">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#8a5732] dark:text-[#d49970]">
                Protocole des 10 Mouvements Fœtaux
              </span>
              <h2 className="text-2xl font-bold text-[#2d221a] dark:text-white mt-1">
                Compteur de Coups de Bébé
              </h2>
              <p className="text-xs text-[#5c4c3e] dark:text-[#c4b5a6] max-w-md mx-auto mt-1">
                Allongez-vous confortablement sur le côté gauche. Comptez le temps nécessaire pour ressentir 10 mouvements ou coups distincts de votre bébé.
              </p>
            </div>

            {/* Kick Circle Button - Light Brown / Caramel Gradient */}
            <div className="flex flex-col items-center justify-center">
              <button
                type="button"
                onClick={handleKickTap}
                className="w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-gradient-to-tr from-[#8a5732] via-[#a36940] to-[#6d4021] text-white shadow-xl shadow-[#8a5732]/25 active:scale-95 transition-all flex flex-col items-center justify-center cursor-pointer group"
              >
                <Baby className="w-10 h-10 group-hover:scale-110 transition-transform mb-1" />
                <span className="text-3xl font-black font-mono tracking-tight">{kickCount} / 10</span>
                <span className="text-[11px] uppercase tracking-wider font-semibold opacity-90 mt-1">
                  {isKickTracking ? 'Touchez pour +1 coup' : 'Démarrer session'}
                </span>
              </button>
            </div>

            {/* Timer Display & Reset */}
            <div className="flex items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2 font-mono text-[#2d221a] dark:text-[#e4ded6]">
                <Clock className="w-4 h-4 text-[#8a5732]" />
                <span className="font-bold text-lg">{formatTime(kickElapsedSeconds)}</span>
              </div>
              <button
                type="button"
                onClick={handleResetKicks}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#7d6c5d] hover:text-[#2d221a] hover:bg-[#ede4d8] dark:hover:bg-[#342921] transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Réinitialiser</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 bg-white dark:bg-[#231d18] border border-[#e5dcd1] dark:border-[#382d24] rounded-2xl p-5 sm:p-7 shadow-xs">
            <h3 className="font-bold text-[#2d221a] dark:text-white text-base pb-3 border-b border-[#eee5da] dark:border-[#382d24] mb-3">
              Historique des Séances (10 Coups)
            </h3>
            {kickLogs.length === 0 ? (
              <p className="text-xs text-[#7d6c5d] py-8 text-center">Aucune séance terminée pour le moment.</p>
            ) : (
              <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
                {kickLogs.map((log) => {
                  const dateStr = new Date(log.timestamp).toLocaleString('fr-FR', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  });
                  return (
                    <div
                      key={log.id}
                      className="p-3 rounded-xl bg-[#faf6f0] dark:bg-[#2b221b] border border-[#ebdcc9] dark:border-[#3d3128] flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-1.5 font-bold text-[#6d4021] dark:text-[#edd4c2]">
                          <CheckCircle className="w-3.5 h-3.5 text-[#8a5732]" />
                          <span>10 coups atteints en {formatTime(log.durationSeconds)}</span>
                        </div>
                        <span className="text-[11px] text-[#7d6c5d] mt-0.5 block">Activité fœtale normale</span>
                      </div>
                      <span className="text-[11px] text-[#7d6c5d] font-mono">{dateStr}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 5. CONTRACTION TIMER TOOL */}
      {activeTool === 'contractions' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7 bg-white dark:bg-[#231d18] border border-[#e5dcd1] dark:border-[#382d24] rounded-2xl p-6 sm:p-8 shadow-xs text-center space-y-6">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#8a5732] dark:text-[#d49970]">
                Protocole Règle 5-1-1 Maternité
              </span>
              <h2 className="text-2xl font-bold text-[#2d221a] dark:text-white mt-1">
                Chronomètre de Contractions
              </h2>
              <p className="text-xs text-[#5c4c3e] dark:text-[#c4b5a6] max-w-md mx-auto mt-1">
                Touchez au début d'une contraction, puis touchez à nouveau dès qu'elle se relâche. L'intervalle entre chaque début est calculé automatiquement.
              </p>
            </div>

            {/* 5-1-1 Alert Banner if triggered */}
            {rule511Match && (
              <div className="p-4 rounded-xl bg-[#8a5732] text-white text-xs font-semibold shadow-md flex items-center justify-between gap-3 text-left">
                <div>
                  <strong className="block text-sm">Départ en Maternité recommandé !</strong>
                  <span>Règle 5-1-1 vérifiée : contractions espacées de moins de 5 min durant plus d'une heure.</span>
                </div>
                <span className="text-xs bg-white text-[#744421] font-bold px-2.5 py-1 rounded-lg shrink-0">
                  Appelez la salle de naissance
                </span>
              </div>
            )}

            {/* Timer Action Button */}
            <div className="flex flex-col items-center justify-center">
              <button
                type="button"
                onClick={handleToggleContraction}
                className={`w-36 h-36 sm:w-44 sm:h-44 rounded-full text-white shadow-xl active:scale-95 transition-all flex flex-col items-center justify-center cursor-pointer ${
                  isContracting
                    ? 'bg-[#8a5732] shadow-[#8a5732]/30 animate-pulse'
                    : 'bg-[#2d221a] dark:bg-[#3d3127] hover:bg-[#3d3127] dark:hover:bg-[#4d3e33] shadow-md'
                }`}
              >
                {isContracting ? <Square className="w-8 h-8 mb-1" /> : <Play className="w-8 h-8 ml-1 mb-1" />}
                <span className="text-2xl font-black font-mono">
                  {formatTime(contractionElapsed)}
                </span>
                <span className="text-[11px] uppercase tracking-wider font-semibold opacity-90 mt-1">
                  {isContracting ? 'Arrêter la contraction' : 'Début contraction'}
                </span>
              </button>
            </div>

            <div className="flex items-center justify-center gap-4 text-xs">
              <button
                type="button"
                onClick={onClearContractions}
                className="text-[#7d6c5d] hover:text-[#2d221a] dark:hover:text-white underline cursor-pointer"
              >
                Effacer l'historique de cette série
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 bg-white dark:bg-[#231d18] border border-[#e5dcd1] dark:border-[#382d24] rounded-2xl p-5 sm:p-7 shadow-xs">
            <h3 className="font-bold text-[#2d221a] dark:text-white text-base pb-3 border-b border-[#eee5da] dark:border-[#382d24] mb-3">
              Historique des Contractions Récentes
            </h3>
            {contractionLogs.length === 0 ? (
              <p className="text-xs text-[#7d6c5d] py-8 text-center">Aucune contraction enregistrée pour le moment.</p>
            ) : (
              <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
                {contractionLogs.map((c) => {
                  const timeStr = new Date(c.startTime).toLocaleTimeString('fr-FR', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  });
                  return (
                    <div
                      key={c.id}
                      className="p-3 rounded-xl bg-[#faf6f0] dark:bg-[#2b221b] border border-[#ebdcc9] dark:border-[#3d3128] flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-[#2d221a] dark:text-white">
                            Durée : {formatTime(c.durationSeconds)}
                          </span>
                        </div>
                        {c.intervalSeconds && (
                          <span className="text-[11px] text-[#8a5732] dark:text-[#d49970] block mt-0.5">
                            Intervalle : {Math.round(c.intervalSeconds / 60)} min
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-[#7d6c5d] font-mono">{timeStr}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 6. MEDICATION SAFETY DATABASE (28 SUBSTANCES) */}
      {activeTool === 'meds' && (
        <div className="space-y-5">
          <div className="bg-white dark:bg-[#231d18] border border-[#e5dcd1] dark:border-[#382d24] rounded-2xl p-5 sm:p-7 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-[#eee5da] dark:border-[#382d24]">
              <div>
                <h2 className="text-lg font-bold text-[#2d221a] dark:text-white">
                  Base de Sécurité Médicamenteuse &amp; Grossesse (28 Substances)
                </h2>
                <p className="text-xs text-[#7d6c5d] dark:text-[#a8988a]">
                  Évaluation validée selon les référentiels du CRAT (Centre de Référence sur les Agents Tératogènes) et de la FDA
                </p>
              </div>

              {/* Search input */}
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-[#8a5732] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Rechercher (ex: Paracétamol, Spasfon, Advil)..."
                  value={medQuery}
                  onChange={(e) => setMedQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-[#faf6f0] dark:bg-[#2b221b] border border-[#ebdcc9] dark:border-[#3d3128] text-[#2d221a] dark:text-white placeholder:text-[#9e8d7f] focus:outline-none focus:border-[#8a5732]"
                />
              </div>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-2 pt-4 flex-wrap">
              <button
                type="button"
                onClick={() => setMedStatusFilter('all')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  medStatusFilter === 'all'
                    ? 'bg-[#2d221a] text-white dark:bg-white dark:text-[#2d221a]'
                    : 'bg-[#ede4d8] dark:bg-[#2b221b] text-[#665444] dark:text-[#c4b5a6]'
                }`}
              >
                Tous (28)
              </button>
              <button
                type="button"
                onClick={() => setMedStatusFilter('safe')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  medStatusFilter === 'safe'
                    ? 'bg-emerald-700 text-white'
                    : 'bg-[#edf3ea] dark:bg-[#253224] text-emerald-800 dark:text-emerald-300'
                }`}
              >
                Sûr (Safe)
              </button>
              <button
                type="button"
                onClick={() => setMedStatusFilter('caution')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  medStatusFilter === 'caution'
                    ? 'bg-amber-700 text-white'
                    : 'bg-[#f7f0e3] dark:bg-[#3a3021] text-amber-800 dark:text-amber-300'
                }`}
              >
                Prudence / Avis Médical
              </button>
              <button
                type="button"
                onClick={() => setMedStatusFilter('unsafe')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  medStatusFilter === 'unsafe'
                    ? 'bg-[#8a5732] text-white'
                    : 'bg-[#faf6f0] dark:bg-[#2b221b] text-[#8a5732] dark:text-[#d49970]'
                }`}
              >
                Interdit (Unsafe / Avoid)
              </button>
            </div>

            {/* Medication Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              {filteredMeds.map((med) => {
                const isSafe = med.status === 'safe';
                const isCaution = med.status === 'caution';

                return (
                  <div
                    key={med.id}
                    className={`p-4 rounded-xl border flex flex-col justify-between text-xs ${
                      isSafe
                        ? 'bg-[#edf3ea]/60 dark:bg-[#253224]/30 border-emerald-300/60 dark:border-emerald-900/40'
                        : isCaution
                        ? 'bg-[#f7f0e3]/60 dark:bg-[#3a3021]/30 border-amber-300/60 dark:border-amber-900/40'
                        : 'bg-[#faf6f0] dark:bg-[#2b221b] border-[#ebdcc9] dark:border-[#3d3128]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 pb-2 border-b border-[#ebdcc9]/50 dark:border-[#3d3128]">
                        <span
                          className={`font-semibold text-[11px] uppercase tracking-wide px-2 py-0.5 rounded ${
                            isSafe
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200'
                              : isCaution
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200'
                              : 'bg-[#ecdccb] text-[#5e3518] dark:bg-[#3d3025] dark:text-[#f3dfcf]'
                          }`}
                        >
                          {isSafe ? 'Sûr (Safe)' : isCaution ? 'Prudence / Avis Médical' : 'Interdit (Unsafe)'}
                        </span>
                        <span className="text-[11px] text-[#7d6c5d] font-mono">{med.fdaCategory}</span>
                      </div>

                      <h3 className="font-bold text-sm text-[#2d221a] dark:text-white mt-2.5">
                        {med.name}
                      </h3>

                      <p className="text-[#5c4c3e] dark:text-[#c4b5a6] mt-2 leading-relaxed">
                        {med.clinicalSummary}
                      </p>

                      {med.fetalRisks !== 'Aucun aux doses thérapeutiques usuelles.' &&
                        med.fetalRisks !== 'Aucun.' && (
                          <div className="mt-2.5 p-2 rounded bg-white/80 dark:bg-[#231d18]/80 border border-[#ebdcc9] dark:border-[#3d3128]">
                            <strong className="text-[#2d221a] dark:text-white block text-[11px]">
                              Risques Fœtaux Éventuels :
                            </strong>
                            <span className="text-[#5c4c3e] dark:text-[#c4b5a6]">{med.fetalRisks}</span>
                          </div>
                        )}
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-[#ebdcc9]/50 dark:border-[#3d3128] text-[11px]">
                      <strong className="text-[#2d221a] dark:text-white">Alternatives Sûres : </strong>
                      <span className="text-[#5c4c3e] dark:text-[#c4b5a6]">{med.safeAlternatives}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
