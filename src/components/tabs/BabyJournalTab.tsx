import React, { useState, useEffect } from 'react';
import {
  Baby,
  Sparkles,
  ClipboardCheck,
  CheckCircle2,
  Circle,
  FileText,
  Clock,
  Play,
  Square,
  RotateCcw,
  Plus,
  Moon,
  Trash2,
  Calendar,
  Image as ImageIcon,
  Printer,
  ChevronRight,
  Heart,
} from 'lucide-react';
import { ChecklistItem, BabyCareLog, UltrasoundMemory, BirthPlanAnswer } from '../../types';
import { CHECKLIST_ITEMS, BIRTH_PLAN_TOPICS } from '../../data/guidelinesData';

interface Props {
  checkedChecklistIds: Record<string, boolean>;
  onToggleChecklistItem: (id: string) => void;
  birthPlanAnswers: Record<string, string>;
  onSaveBirthPlanAnswer: (topicId: string, answer: string) => void;
  babyLogs: BabyCareLog[];
  onAddBabyLog: (log: Omit<BabyCareLog, 'id'>) => void;
  ultrasounds: UltrasoundMemory[];
  onAddUltrasound: (item: Omit<UltrasoundMemory, 'id'>) => void;
}

export const BabyJournalTab: React.FC<Props> = ({
  checkedChecklistIds,
  onToggleChecklistItem,
  birthPlanAnswers,
  onSaveBirthPlanAnswer,
  babyLogs,
  onAddBabyLog,
  ultrasounds,
  onAddUltrasound,
}) => {
  const [subTab, setSubTab] = useState<'daily' | 'checklist' | 'birthplan' | 'ultrasound'>('daily');

  // NURSING TRACKER STATE
  const [nursingSide, setNursingSide] = useState<'left' | 'right'>('left');
  const [isNursingRunning, setIsNursingRunning] = useState<boolean>(false);
  const [leftSeconds, setLeftSeconds] = useState<number>(0);
  const [rightSeconds, setRightSeconds] = useState<number>(0);

  // BOTTLE STATE
  const [bottleVolume, setBottleVolume] = useState<number>(90);
  const [bottleMilkType, setBottleMilkType] = useState<'maternal' | 'formula'>('maternal');

  // PUMPING STATE
  const [pumpVolume, setPumpVolume] = useState<number>(60);
  const [pumpStorage, setPumpStorage] = useState<'fridge' | 'freezer'>('fridge');

  // DIAPER STATE
  const [diaperType, setDiaperType] = useState<'wet' | 'dirty' | 'mixed'>('wet');
  const [diaperTexture, setDiaperTexture] = useState<'golden' | 'grainy' | 'meconium' | 'normal'>('golden');

  // SLEEP STATE
  const [sleepMinutes, setSleepMinutes] = useState<number>(90);

  // NEW ULTRASOUND STATE
  const [echoTitle, setEchoTitle] = useState('Échographie Morphologique T2');
  const [echoWeek, setEchoWeek] = useState(22);
  const [echoBip, setEchoBip] = useState('54 mm');
  const [echoFemur, setEchoFemur] = useState('38 mm');
  const [echoWeight, setEchoWeight] = useState('480 g');
  const [echoNotes, setEchoNotes] = useState('Organes vitaux normaux, liquide amniotique clair et abondant.');

  // Nursing timer
  useEffect(() => {
    let interval: number;
    if (isNursingRunning) {
      interval = window.setInterval(() => {
        if (nursingSide === 'left') {
          setLeftSeconds((prev) => prev + 1);
        } else {
          setRightSeconds((prev) => prev + 1);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isNursingRunning, nursingSide]);

  // Determine last nursing log to suggest opposite side
  const lastNursingLog = babyLogs.find((l) => l.type === 'nursing');
  const suggestedNextSide =
    lastNursingLog?.details.side === 'left' ? 'right' : lastNursingLog?.details.side === 'right' ? 'left' : 'right';

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleFinishNursing = () => {
    setIsNursingRunning(false);
    onAddBabyLog({
      type: 'nursing',
      timestamp: new Date().toISOString(),
      details: {
        side: nursingSide,
        leftDurationSeconds: leftSeconds,
        rightDurationSeconds: rightSeconds,
      },
      notes: `Sein ${nursingSide === 'left' ? 'Gauche' : 'Droit'} (${formatSeconds(
        nursingSide === 'left' ? leftSeconds : rightSeconds
      )})`,
    });
    setLeftSeconds(0);
    setRightSeconds(0);
  };

  // Checklist counts
  const totalChecklist = CHECKLIST_ITEMS.length;
  const completedChecklist = CHECKLIST_ITEMS.filter((i) => !!checkedChecklistIds[i.id]).length;
  const checklistPercent = Math.round((completedChecklist / totalChecklist) * 100);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#8a5732] dark:text-[#d49970] font-semibold uppercase tracking-wider">
            <span>Bébé, Journal &amp; Préparatifs</span>
            <span aria-hidden="true">·</span>
            <span>Maternité &amp; Post-Partum</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#2d221a] dark:text-white mt-0.5">
            Journal Quotidien, Trousseau &amp; Projet de Naissance
          </h1>
        </div>

        {/* Sub-tab navigation */}
        <div className="flex items-center gap-1.5 p-1 bg-[#ede4d8] dark:bg-[#2b221b] rounded-xl overflow-x-auto self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setSubTab('daily')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              subTab === 'daily'
                ? 'bg-white dark:bg-[#3d3127] text-[#2d221a] dark:text-white shadow-xs'
                : 'text-[#665444] dark:text-[#c4b5a6] hover:text-[#2d221a]'
            }`}
          >
            Journal Quotidien
          </button>
          <button
            type="button"
            onClick={() => setSubTab('checklist')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              subTab === 'checklist'
                ? 'bg-white dark:bg-[#3d3127] text-[#2d221a] dark:text-white shadow-xs'
                : 'text-[#665444] dark:text-[#c4b5a6] hover:text-[#2d221a]'
            }`}
          >
            Trousseau &amp; Valise ({checklistPercent}%)
          </button>
          <button
            type="button"
            onClick={() => setSubTab('birthplan')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              subTab === 'birthplan'
                ? 'bg-white dark:bg-[#3d3127] text-[#2d221a] dark:text-white shadow-xs'
                : 'text-[#665444] dark:text-[#c4b5a6] hover:text-[#2d221a]'
            }`}
          >
            Projet de Naissance
          </button>
          <button
            type="button"
            onClick={() => setSubTab('ultrasound')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              subTab === 'ultrasound'
                ? 'bg-white dark:bg-[#3d3127] text-[#2d221a] dark:text-white shadow-xs'
                : 'text-[#665444] dark:text-[#c4b5a6] hover:text-[#2d221a]'
            }`}
          >
            Échographies
          </button>
        </div>
      </div>

      {/* 1. DAILY BABY CARE TRACKING TOOLS */}
      {subTab === 'daily' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Trackers */}
          <div className="lg:col-span-7 space-y-5">
            {/* Suggestion banner */}
            <div className="p-4 rounded-2xl bg-[#faf6f0] dark:bg-[#2b221b] border border-[#ebdcc9] dark:border-[#3d3128] text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-[#8a5732]" />
                <span className="font-semibold text-[#2d221a] dark:text-white">
                  Équilibrage de la lactation :
                </span>
                <span className="text-[#5c4c3e] dark:text-[#c4b5a6]">
                  Prochaine tétée recommandée sur le{' '}
                  <strong className="text-[#8a5732] dark:text-[#d49970]">
                    Sein {suggestedNextSide === 'left' ? 'Gauche' : 'Droit'}
                  </strong>
                </span>
              </div>
            </div>

            {/* A. Allaitement au Sein (Nursing Tracker) */}
            <div className="bg-white dark:bg-[#231d18] border border-[#e5dcd1] dark:border-[#382d24] rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#eee5da] dark:border-[#382d24]">
                <h3 className="font-bold text-[#2d221a] dark:text-white text-base flex items-center gap-2">
                  <Baby className="w-4 h-4 text-[#8a5732]" />
                  <span>Allaitement au Sein (Chronomètre par Sein)</span>
                </h3>
                <span className="text-xs text-[#7d6c5d] font-mono">Lactation</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Left Breast */}
                <div
                  className={`p-4 rounded-xl border text-center transition-all ${
                    nursingSide === 'left' && isNursingRunning
                      ? 'bg-[#faf6f0] dark:bg-[#2b221b] border-[#8a5732] ring-2 ring-[#8a5732]/20'
                      : 'bg-[#faf6f0] dark:bg-[#2b221b] border-[#ebdcc9] dark:border-[#3d3128]'
                  }`}
                >
                  <p className="text-xs font-semibold text-[#7d6c5d] uppercase">Sein Gauche</p>
                  <p className="text-2xl font-bold font-mono text-[#2d221a] dark:text-white mt-1">
                    {formatSeconds(leftSeconds)}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setNursingSide('left');
                      setIsNursingRunning(true);
                    }}
                    className="mt-3 w-full py-1.5 px-3 rounded-lg text-xs font-semibold bg-[#8a5732] hover:bg-[#744421] active:bg-[#603518] text-white transition-colors cursor-pointer"
                  >
                    Téter à Gauche
                  </button>
                </div>

                {/* Right Breast */}
                <div
                  className={`p-4 rounded-xl border text-center transition-all ${
                    nursingSide === 'right' && isNursingRunning
                      ? 'bg-[#faf6f0] dark:bg-[#2b221b] border-[#8a5732] ring-2 ring-[#8a5732]/20'
                      : 'bg-[#faf6f0] dark:bg-[#2b221b] border-[#ebdcc9] dark:border-[#3d3128]'
                  }`}
                >
                  <p className="text-xs font-semibold text-[#7d6c5d] uppercase">Sein Droit</p>
                  <p className="text-2xl font-bold font-mono text-[#2d221a] dark:text-white mt-1">
                    {formatSeconds(rightSeconds)}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setNursingSide('right');
                      setIsNursingRunning(true);
                    }}
                    className="mt-3 w-full py-1.5 px-3 rounded-lg text-xs font-semibold bg-[#8a5732] hover:bg-[#744421] active:bg-[#603518] text-white transition-colors cursor-pointer"
                  >
                    Téter à Droite
                  </button>
                </div>
              </div>

              {isNursingRunning && (
                <button
                  type="button"
                  onClick={handleFinishNursing}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#2d221a] hover:bg-[#3d3127] text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Square className="w-4 h-4 text-[#eedacb]" />
                  <span>Terminer et enregistrer la tétée</span>
                </button>
              )}
            </div>

            {/* B. Biberon & Tire-Lait */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Biberon */}
              <div className="bg-white dark:bg-[#231d18] border border-[#e5dcd1] dark:border-[#382d24] rounded-2xl p-5 shadow-xs space-y-3">
                <h4 className="font-bold text-sm text-[#2d221a] dark:text-white pb-2 border-b border-[#eee5da] dark:border-[#382d24]">
                  Biberon (ml &amp; Lait)
                </h4>

                <div>
                  <label className="text-[11px] font-semibold text-[#7d6c5d] uppercase block mb-1">
                    Quantité bue
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="10"
                      value={bottleVolume}
                      onChange={(e) => setBottleVolume(Number(e.target.value))}
                      className="w-full px-3 py-1.5 text-xs font-mono font-bold rounded-lg bg-[#faf6f0] dark:bg-[#2b221b] border border-[#ebdcc9] dark:border-[#3d3128] text-[#2d221a] dark:text-white"
                    />
                    <span className="text-xs text-[#7d6c5d] font-mono">ml</span>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-[#7d6c5d] uppercase block mb-1">
                    Type de lait
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setBottleMilkType('maternal')}
                      className={`p-1.5 rounded-lg border text-center font-medium cursor-pointer ${
                        bottleMilkType === 'maternal'
                          ? 'bg-[#faf6f0] border-[#8a5732] text-[#8a5732] dark:bg-[#2b221b]'
                          : 'bg-[#faf6f0] dark:bg-[#2b221b] border-[#ebdcc9] dark:border-[#3d3128] text-[#665444] dark:text-[#c4b5a6]'
                      }`}
                    >
                      Maternel exprimé
                    </button>
                    <button
                      type="button"
                      onClick={() => setBottleMilkType('formula')}
                      className={`p-1.5 rounded-lg border text-center font-medium cursor-pointer ${
                        bottleMilkType === 'formula'
                          ? 'bg-[#faf6f0] border-[#8a5732] text-[#8a5732] dark:bg-[#2b221b]'
                          : 'bg-[#faf6f0] dark:bg-[#2b221b] border-[#ebdcc9] dark:border-[#3d3128] text-[#665444] dark:text-[#c4b5a6]'
                      }`}
                    >
                      Préparation infantile
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onAddBabyLog({
                      type: 'bottle',
                      timestamp: new Date().toISOString(),
                      details: {
                        volumeMl: bottleVolume,
                        milkType: bottleMilkType,
                      },
                      notes: `Biberon ${bottleVolume} ml (${
                        bottleMilkType === 'maternal' ? 'Lait maternel' : 'Préparation'
                      })`,
                    });
                  }}
                  className="w-full py-2 rounded-lg bg-sky-700 hover:bg-sky-800 text-white font-semibold text-xs transition-colors cursor-pointer"
                >
                  + Enregistrer Biberon
                </button>
              </div>

              {/* Tire-Lait */}
              <div className="bg-white dark:bg-[#231d18] border border-[#e5dcd1] dark:border-[#382d24] rounded-2xl p-5 shadow-xs space-y-3">
                <h4 className="font-bold text-sm text-[#2d221a] dark:text-white pb-2 border-b border-[#eee5da] dark:border-[#382d24]">
                  Tire-Lait (Expression)
                </h4>

                <div>
                  <label className="text-[11px] font-semibold text-[#7d6c5d] uppercase block mb-1">
                    Volume exprimé
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="10"
                      value={pumpVolume}
                      onChange={(e) => setPumpVolume(Number(e.target.value))}
                      className="w-full px-3 py-1.5 text-xs font-mono font-bold rounded-lg bg-[#faf6f0] dark:bg-[#2b221b] border border-[#ebdcc9] dark:border-[#3d3128] text-[#2d221a] dark:text-white"
                    />
                    <span className="text-xs text-[#7d6c5d] font-mono">ml</span>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-[#7d6c5d] uppercase block mb-1">
                    Conservation
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setPumpStorage('fridge')}
                      className={`p-1.5 rounded-lg border text-center font-medium cursor-pointer ${
                        pumpStorage === 'fridge'
                          ? 'bg-[#faf6f0] border-[#8a5732] text-[#8a5732] dark:bg-[#2b221b]'
                          : 'bg-[#faf6f0] dark:bg-[#2b221b] border-[#ebdcc9] dark:border-[#3d3128] text-[#665444] dark:text-[#c4b5a6]'
                      }`}
                    >
                      Réfrigérateur (48h)
                    </button>
                    <button
                      type="button"
                      onClick={() => setPumpStorage('freezer')}
                      className={`p-1.5 rounded-lg border text-center font-medium cursor-pointer ${
                        pumpStorage === 'freezer'
                          ? 'bg-[#faf6f0] border-[#8a5732] text-[#8a5732] dark:bg-[#2b221b]'
                          : 'bg-[#faf6f0] dark:bg-[#2b221b] border-[#ebdcc9] dark:border-[#3d3128] text-[#665444] dark:text-[#c4b5a6]'
                      }`}
                    >
                      Congélateur (4 mois)
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onAddBabyLog({
                      type: 'pumping',
                      timestamp: new Date().toISOString(),
                      details: {
                        pumpVolumeMl: pumpVolume,
                        storageMethod: pumpStorage,
                      },
                      notes: `Expression ${pumpVolume} ml (${pumpStorage === 'fridge' ? 'Frigo' : 'Congélateur'})`,
                    });
                  }}
                  className="w-full py-2 rounded-lg bg-[#8a5732] hover:bg-[#744421] text-white font-semibold text-xs transition-colors cursor-pointer"
                >
                  + Enregistrer Expression
                </button>
              </div>
            </div>

            {/* C. Couches & Sommeil */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Couches */}
              <div className="bg-white dark:bg-[#231d18] border border-[#e5dcd1] dark:border-[#382d24] rounded-2xl p-5 shadow-xs space-y-3">
                <h4 className="font-bold text-sm text-[#2d221a] dark:text-white pb-2 border-b border-[#eee5da] dark:border-[#382d24]">
                  Suivi des Couches
                </h4>

                <div className="grid grid-cols-3 gap-1.5 text-xs">
                  <button
                    type="button"
                    onClick={() => setDiaperType('wet')}
                    className={`p-1.5 rounded-lg border text-center font-medium cursor-pointer ${
                      diaperType === 'wet'
                        ? 'bg-[#faf6f0] border-[#8a5732] text-[#8a5732] dark:bg-[#2b221b]'
                        : 'bg-[#faf6f0] dark:bg-[#2b221b] border-[#ebdcc9] dark:border-[#3d3128] text-[#665444] dark:text-[#c4b5a6]'
                    }`}
                  >
                    Urine
                  </button>
                  <button
                    type="button"
                    onClick={() => setDiaperType('dirty')}
                    className={`p-1.5 rounded-lg border text-center font-medium cursor-pointer ${
                      diaperType === 'dirty'
                        ? 'bg-[#faf6f0] border-[#8a5732] text-[#8a5732] dark:bg-[#2b221b]'
                        : 'bg-[#faf6f0] dark:bg-[#2b221b] border-[#ebdcc9] dark:border-[#3d3128] text-[#665444] dark:text-[#c4b5a6]'
                    }`}
                  >
                    Selle
                  </button>
                  <button
                    type="button"
                    onClick={() => setDiaperType('mixed')}
                    className={`p-1.5 rounded-lg border text-center font-medium cursor-pointer ${
                      diaperType === 'mixed'
                        ? 'bg-[#faf6f0] border-[#8a5732] text-[#8a5732] dark:bg-[#2b221b]'
                        : 'bg-[#faf6f0] dark:bg-[#2b221b] border-[#ebdcc9] dark:border-[#3d3128] text-[#665444] dark:text-[#c4b5a6]'
                    }`}
                  >
                    Mixte
                  </button>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-[#7d6c5d] uppercase block mb-1">
                    Texture &amp; Aspect
                  </label>
                  <div className="grid grid-cols-3 gap-1.5 text-[11px]">
                    {[
                      { id: 'golden', label: "Jaune d'or" },
                      { id: 'grainy', label: 'Granuleuse' },
                      { id: 'meconium', label: 'Méconium' },
                    ].map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setDiaperTexture(t.id as unknown as 'golden')}
                        className={`p-1.5 rounded-lg border text-center cursor-pointer ${
                          diaperTexture === t.id
                            ? 'bg-[#f4ece2] text-[#784824] border-[#8a5732] font-semibold dark:bg-[#342921] dark:text-[#eedacb]'
                            : 'bg-[#faf6f0] dark:bg-[#2b221b] border-[#ebdcc9] dark:border-[#3d3128] text-[#665444] dark:text-[#c4b5a6]'
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onAddBabyLog({
                      type: 'diaper',
                      timestamp: new Date().toISOString(),
                      details: {
                        diaperType,
                        texture: diaperTexture,
                      },
                      notes: `Couche ${diaperType === 'wet' ? 'Urine' : diaperType === 'dirty' ? 'Selle' : 'Mixte'} (${diaperTexture})`,
                    });
                  }}
                  className="w-full py-2 rounded-lg bg-[#8a5732] hover:bg-[#744421] text-white font-semibold text-xs transition-colors cursor-pointer"
                >
                  + Enregistrer Couche
                </button>
              </div>

              {/* Sommeil */}
              <div className="bg-white dark:bg-[#231d18] border border-[#e5dcd1] dark:border-[#382d24] rounded-2xl p-5 shadow-xs space-y-3">
                <h4 className="font-bold text-sm text-[#2d221a] dark:text-white pb-2 border-b border-[#eee5da] dark:border-[#382d24]">
                  Sommeil de Bébé
                </h4>

                <div>
                  <label className="text-[11px] font-semibold text-[#7d6c5d] uppercase block mb-1">
                    Durée de la sieste / sommeil
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="15"
                      value={sleepMinutes}
                      onChange={(e) => setSleepMinutes(Number(e.target.value))}
                      className="w-full px-3 py-1.5 text-xs font-mono font-bold rounded-lg bg-[#faf6f0] dark:bg-[#2b221b] border border-[#ebdcc9] dark:border-[#3d3128] text-[#2d221a] dark:text-white"
                    />
                    <span className="text-xs text-[#7d6c5d] font-mono">minutes</span>
                  </div>
                </div>

                <p className="text-[11px] text-[#7d6c5d] italic">
                  Position de couchage toujours sur le dos, matelas ferme, sans oreiller.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    onAddBabyLog({
                      type: 'sleep',
                      timestamp: new Date().toISOString(),
                      details: {
                        sleepDurationMinutes: sleepMinutes,
                      },
                      notes: `Sommeil ${Math.floor(sleepMinutes / 60)}h ${sleepMinutes % 60}min`,
                    });
                  }}
                  className="w-full py-2 rounded-lg bg-[#7b4d29] hover:bg-[#683e1e] text-white font-semibold text-xs transition-colors cursor-pointer mt-4"
                >
                  + Enregistrer Sommeil
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Feed Log History */}
          <div className="lg:col-span-5 bg-white dark:bg-[#231d18] border border-[#e5dcd1] dark:border-[#382d24] rounded-2xl p-5 sm:p-7 shadow-xs">
            <h3 className="font-bold text-[#2d221a] dark:text-white text-base pb-3 border-b border-[#eee5da] dark:border-[#382d24] mb-3">
              Journal des Soins Récents
            </h3>

            {babyLogs.length === 0 ? (
              <p className="text-xs text-[#7d6c5d] py-12 text-center">
                Aucun soin enregistré aujourd'hui. Enregistrez une première tétée, biberon ou couche ci-contre.
              </p>
            ) : (
              <div className="space-y-2.5 max-h-[560px] overflow-y-auto pr-1">
                {babyLogs.map((log) => {
                  const dateStr = new Date(log.timestamp).toLocaleTimeString('fr-FR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  });
                  return (
                    <div
                      key={log.id}
                      className="p-3 rounded-xl bg-[#faf6f0] dark:bg-[#2b221b] border border-[#ebdcc9] dark:border-[#3d3128] flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-bold text-[#2d221a] dark:text-white block">
                          {log.notes || log.type}
                        </span>
                        <span className="text-[11px] text-[#7d6c5d] capitalize">{log.type}</span>
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

      {/* 2. MATERNITY BAG & BABY TROUSSEAU CHECKLIST */}
      {subTab === 'checklist' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-[#231d18] border border-[#e5dcd1] dark:border-[#382d24] rounded-2xl p-5 sm:p-7 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#eee5da] dark:border-[#382d24]">
              <div>
                <h2 className="text-lg font-bold text-[#2d221a] dark:text-white">
                  Trousseau Bébé &amp; Valise de Maternité
                </h2>
                <p className="text-xs text-[#7d6c5d] dark:text-[#a8988a]">
                  Checklist officielle des indispensables pour le séjour en maternité et le retour à domicile
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-xs font-semibold text-[#2d221a] dark:text-white">
                    {completedChecklist} / {totalChecklist} indispensables
                  </span>
                  <div className="w-32 h-2 bg-[#ede4d8] dark:bg-[#2b221b] rounded-full overflow-hidden mt-1">
                    <div
                      className="h-full bg-[#8a5732] rounded-full transition-all duration-300"
                      style={{ width: `${checklistPercent}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6 mt-6">
              {/* Trousseau Bébé */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#8a5732] dark:text-[#d49970] mb-3 flex items-center gap-2">
                  <Baby className="w-4 h-4" />
                  <span>Trousseau Bébé (Nouveau-né)</span>
                </h3>

                <div className="space-y-2.5">
                  {CHECKLIST_ITEMS.filter((i) => i.category === 'baby').map((item) => {
                    const isChecked = !!checkedChecklistIds[item.id];
                    return (
                      <div
                        key={item.id}
                        onClick={() => onToggleChecklistItem(item.id)}
                        className={`p-4 rounded-xl border transition-all cursor-pointer select-none flex items-start gap-3 ${
                          isChecked
                            ? 'bg-[#f4f7f2] dark:bg-[#212b20] border-emerald-300 dark:border-emerald-800/60'
                            : 'bg-[#faf6f0] dark:bg-[#2b221b] border-[#ebdcc9] dark:border-[#3d3128] hover:border-[#bda58d]'
                        }`}
                      >
                        <div className="mt-0.5 shrink-0 text-emerald-700 dark:text-emerald-400">
                          {isChecked ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5 text-[#bfaea0] dark:text-[#5a483a]" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className={`text-xs sm:text-sm font-bold ${isChecked ? 'line-through text-[#9e8d7f]' : 'text-[#2d221a] dark:text-white'}`}>
                              {item.label}
                            </span>
                            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white dark:bg-[#342921] text-[#665444] dark:text-[#c4b5a6] border border-[#ebdcc9] dark:border-[#47372b]">
                              Qté : {item.quantity}
                            </span>
                          </div>
                          <p className="text-xs text-[#7d6c5d] dark:text-[#a8988a] mt-1 leading-relaxed">
                            {item.note}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Valise Maman & Post-Partum */}
              <div className="pt-4 border-t border-[#eee5da] dark:border-[#382d24]">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#7b4d29] dark:text-[#debba4] mb-3 flex items-center gap-2">
                  <ClipboardCheck className="w-4 h-4" />
                  <span>Valise Maman &amp; Post-Partum</span>
                </h3>

                <div className="space-y-2.5">
                  {CHECKLIST_ITEMS.filter((i) => i.category === 'mom').map((item) => {
                    const isChecked = !!checkedChecklistIds[item.id];
                    return (
                      <div
                        key={item.id}
                        onClick={() => onToggleChecklistItem(item.id)}
                        className={`p-4 rounded-xl border transition-all cursor-pointer select-none flex items-start gap-3 ${
                          isChecked
                            ? 'bg-[#f4f7f2] dark:bg-[#212b20] border-emerald-300 dark:border-emerald-800/60'
                            : 'bg-[#faf6f0] dark:bg-[#2b221b] border-[#ebdcc9] dark:border-[#3d3128] hover:border-[#bda58d]'
                        }`}
                      >
                        <div className="mt-0.5 shrink-0 text-emerald-700 dark:text-emerald-400">
                          {isChecked ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5 text-[#bfaea0] dark:text-[#5a483a]" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className={`text-xs sm:text-sm font-bold ${isChecked ? 'line-through text-[#9e8d7f]' : 'text-[#2d221a] dark:text-white'}`}>
                              {item.label}
                            </span>
                            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white dark:bg-[#342921] text-[#665444] dark:text-[#c4b5a6] border border-[#ebdcc9] dark:border-[#47372b]">
                              Qté : {item.quantity}
                            </span>
                          </div>
                          <p className="text-xs text-[#7d6c5d] dark:text-[#a8988a] mt-1 leading-relaxed">
                            {item.note}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. BIRTH PROJECT QUESTIONNAIRE (PROJET DE NAISSANCE) */}
      {subTab === 'birthplan' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-[#231d18] border border-[#e5dcd1] dark:border-[#382d24] rounded-2xl p-5 sm:p-7 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#eee5da] dark:border-[#382d24]">
              <div>
                <h2 className="text-lg font-bold text-[#2d221a] dark:text-white">
                  Questionnaire du Projet de Naissance
                </h2>
                <p className="text-xs text-[#7d6c5d] dark:text-[#a8988a]">
                  Formalisez vos souhaits pour le travail, la gestion de la douleur, l'expulsion et l'accueil du nouveau-né à remettre à votre sage-femme
                </p>
              </div>

              <button
                type="button"
                onClick={() => window.print()}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#2d221a] text-white dark:bg-white dark:text-[#2d221a] text-xs font-bold hover:opacity-90 transition-opacity self-start sm:self-auto cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimer mon projet</span>
              </button>
            </div>

            <div className="space-y-6 mt-6">
              {BIRTH_PLAN_TOPICS.map((topic, tIdx) => {
                const currentSelection = birthPlanAnswers[topic.id];
                return (
                  <div
                    key={topic.id}
                    className="p-5 rounded-2xl bg-[#faf6f0] dark:bg-[#2b221b] border border-[#ebdcc9] dark:border-[#3d3128] space-y-3"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-[#8a5732] dark:text-[#eedacb] bg-[#ede2d3] dark:bg-[#382d24] px-2 py-0.5 rounded">
                        0{tIdx + 1}
                      </span>
                      <h3 className="font-bold text-sm text-[#2d221a] dark:text-white">
                        {topic.title}
                      </h3>
                    </div>

                    <p className="text-xs text-[#5c4c3e] dark:text-[#c4b5a6] font-medium">
                      {topic.question}
                    </p>

                    <div className="space-y-2 pt-1">
                      {topic.options.map((opt, oIdx) => {
                        const isSelected = currentSelection === opt;
                        return (
                          <div
                            key={oIdx}
                            onClick={() => onSaveBirthPlanAnswer(topic.id, opt)}
                            className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between ${
                              isSelected
                                ? 'bg-white dark:bg-[#342921] border-[#8a5732] text-[#2d221a] dark:text-white font-semibold shadow-xs'
                                : 'bg-white dark:bg-[#231d18] border-[#ebdcc9] dark:border-[#3d3128] text-[#5c4c3e] dark:text-[#c4b5a6] hover:border-[#bda58d]'
                            }`}
                          >
                            <span>{opt}</span>
                            <div className="w-4 h-4 rounded-full border border-[#ebdcc9] dark:border-[#524135] flex items-center justify-center shrink-0 ml-2">
                              {isSelected ? (
                                <div className="w-2.5 h-2.5 rounded-full bg-[#8a5732]" />
                              ) : null}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 4. ULTRASOUND ALBUM & BIOMETRY */}
      {subTab === 'ultrasound' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-[#231d18] border border-[#e5dcd1] dark:border-[#382d24] rounded-2xl p-5 sm:p-7 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#eee5da] dark:border-[#382d24]">
              <div>
                <h2 className="text-lg font-bold text-[#2d221a] dark:text-white">
                  Album d'Échographies &amp; Biométrie Fœtale
                </h2>
                <p className="text-xs text-[#7d6c5d] dark:text-[#a8988a]">
                  Conservez les clichés, les mesures de biométrie (BIP, fémur) et le compte-rendu médical de chaque échographie
                </p>
              </div>
            </div>

            {/* List of ultrasounds */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              {ultrasounds.map((u) => (
                <div
                  key={u.id}
                  className="p-5 rounded-2xl bg-[#faf6f0] dark:bg-[#2b221b] border border-[#ebdcc9] dark:border-[#3d3128] text-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between pb-2 border-b border-[#ebdcc9]/50 dark:border-[#3d3128]">
                      <span className="font-mono font-bold text-[#8a5732] dark:text-[#d49970]">
                        {u.week} SA
                      </span>
                      <span className="text-[#7d6c5d] font-mono">{u.date}</span>
                    </div>

                    <h3 className="font-bold text-sm text-[#2d221a] dark:text-white mt-2.5">
                      {u.title}
                    </h3>

                    <div className="grid grid-cols-3 gap-2 my-3 p-2.5 rounded-xl bg-white dark:bg-[#231d18] border border-[#ebdcc9] dark:border-[#3d3128] text-center">
                      <div>
                        <span className="text-[10px] text-[#7d6c5d] uppercase block">Diamètre BIP</span>
                        <span className="font-bold font-mono text-[#2d221a] dark:text-white">{u.biparietalDiameter || '—'}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#7d6c5d] uppercase block">Fémur</span>
                        <span className="font-bold font-mono text-[#2d221a] dark:text-white">{u.femurLength || '—'}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#7d6c5d] uppercase block">Poids Est.</span>
                        <span className="font-bold font-mono text-[#2d221a] dark:text-white">{u.estimatedWeight || '—'}</span>
                      </div>
                    </div>

                    <p className="text-[#5c4c3e] dark:text-[#c4b5a6] leading-relaxed italic">
                      « {u.notes} »
                    </p>
                  </div>

                  <div className="mt-4 pt-2.5 border-t border-[#ebdcc9]/50 dark:border-[#3d3128] flex justify-between items-center text-[11px] text-[#7d6c5d]">
                    <span>Cliché archivé dans le dossier</span>
                    <span className="text-[#8a5732] dark:text-[#d49970] font-medium">Conforme aux courbes OMS</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Form to add a new ultrasound record */}
            <div className="mt-8 p-5 rounded-2xl bg-[#faf6f0] dark:bg-[#2b221b] border border-[#ebdcc9] dark:border-[#3d3128]">
              <h3 className="font-bold text-sm text-[#2d221a] dark:text-white mb-3">
                + Ajouter une Nouvelle Échographie au Dossier
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs mb-3">
                <div>
                  <label className="text-[11px] font-semibold text-[#7d6c5d] block mb-1">Titre de l'examen</label>
                  <input
                    type="text"
                    value={echoTitle}
                    onChange={(e) => setEchoTitle(e.target.value)}
                    className="w-full p-2 rounded-lg bg-white dark:bg-[#231d18] border border-[#ebdcc9] dark:border-[#3d3128] text-[#2d221a] dark:text-white focus:outline-none focus:border-[#8a5732]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-[#7d6c5d] block mb-1">Terme (SA)</label>
                  <input
                    type="number"
                    value={echoWeek}
                    onChange={(e) => setEchoWeek(Number(e.target.value))}
                    className="w-full p-2 rounded-lg bg-white dark:bg-[#231d18] border border-[#ebdcc9] dark:border-[#3d3128] text-[#2d221a] dark:text-white focus:outline-none focus:border-[#8a5732]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-[#7d6c5d] block mb-1">Poids Estimé</label>
                  <input
                    type="text"
                    value={echoWeight}
                    onChange={(e) => setEchoWeight(e.target.value)}
                    className="w-full p-2 rounded-lg bg-white dark:bg-[#231d18] border border-[#ebdcc9] dark:border-[#3d3128] text-[#2d221a] dark:text-white focus:outline-none focus:border-[#8a5732]"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  onAddUltrasound({
                    title: echoTitle,
                    week: echoWeek,
                    date: new Date().toLocaleDateString('fr-FR'),
                    biparietalDiameter: echoBip,
                    femurLength: echoFemur,
                    estimatedWeight: echoWeight,
                    notes: echoNotes,
                  });
                }}
                className="py-2 px-4 rounded-xl bg-[#8a5732] hover:bg-[#744421] text-white font-bold text-xs transition-colors cursor-pointer"
              >
                Enregistrer l'échographie
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
