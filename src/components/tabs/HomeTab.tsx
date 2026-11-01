import React, { useRef } from 'react';
import {
  Calendar,
  Heart,
  Activity,
  ShieldCheck,
  Baby,
  ArrowRight,
  ChevronRight,
  TrendingUp,
  Share2,
  Camera,
  Plus,
  Phone,
  Mail,
  Syringe,
  Sparkles,
  Clock,
  CheckCircle2,
  Edit3,
  AlertTriangle,
  FileText,
} from 'lucide-react';
import {
  TabType,
  BloodPressureLog,
  GlucoseLog,
  WeightLog,
  UltrasoundMemory,
  PmaConfig,
} from '../../types';
import { TIMELINE_WEEKS } from '../../data/pregnancyData';
import { OBSTETRIC_MILESTONES } from '../../data/consultationsData';
import { analyzeBloodPressure, analyzeGlucose } from '../../utils/clinicalEngine';

interface Props {
  currentWeek: number;
  gestationalDays: number;
  dpaDate: string;
  daysRemaining: number;
  progressPercent: number;
  pregnancyMethod: string;
  onOpenEditPregnancyDate: () => void;
  onNavigateTab: (tab: TabType) => void;
  onOpenExport?: () => void;
  onOpenPmaModal: () => void;
  pmaConfig: PmaConfig;
  bpLogs: BloodPressureLog[];
  glucoseLogs: GlucoseLog[];
  weightLogs: WeightLog[];
  ultrasounds: UltrasoundMemory[];
  onAddUltrasound: (item: Omit<UltrasoundMemory, 'id'>) => void;
  checkedChecklistCount: number;
  totalChecklistCount: number;
  onQuickBabyLog: (type: 'nursing' | 'bottle' | 'pumping' | 'diaper') => void;
}

export const HomeTab: React.FC<Props> = ({
  currentWeek,
  gestationalDays,
  dpaDate,
  daysRemaining,
  progressPercent,
  onOpenEditPregnancyDate,
  onNavigateTab,
  onOpenExport,
  onOpenPmaModal,
  pmaConfig,
  bpLogs,
  glucoseLogs,
  weightLogs,
  ultrasounds,
  onAddUltrasound,
  checkedChecklistCount,
  totalChecklistCount,
  onQuickBabyLog,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentWeekData =
    TIMELINE_WEEKS.find((w) => w.week === currentWeek) || TIMELINE_WEEKS[21];

  // Latest Vitals
  const latestBP = bpLogs.length > 0 ? bpLogs[0] : null;
  const bpAnalysis = latestBP ? analyzeBloodPressure(latestBP.systolic, latestBP.diastolic) : null;

  const latestGlucose = glucoseLogs.length > 0 ? glucoseLogs[0] : null;
  const glucoseAnalysis = latestGlucose ? analyzeGlucose(latestGlucose.value, latestGlucose.context) : null;

  const latestWeight = weightLogs.length > 0 ? weightLogs[0] : null;

  // Next Milestone
  const nextMilestone =
    OBSTETRIC_MILESTONES.find((m) => {
      const match = m.period.match(/\d+/g);
      if (!match) return false;
      const end = Number(match[match.length - 1]);
      return end >= currentWeek;
    }) || OBSTETRIC_MILESTONES[OBSTETRIC_MILESTONES.length - 1];

  const checklistProgress =
    totalChecklistCount > 0
      ? Math.round((checkedChecklistCount / totalChecklistCount) * 100)
      : 0;

  // Handle mock photo upload
  const handlePhotoCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onAddUltrasound({
          title: `Cliché Écho Semaine ${currentWeek} SA`,
          week: currentWeek,
          date: new Date().toLocaleDateString('fr-FR'),
          imageUrl: reader.result as string,
          notes: 'Photo ajoutée depuis le terminal mobile / appareil photo.',
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Hidden file input for ultrasound camera */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        capture="environment"
        onChange={handlePhotoCapture}
        className="hidden"
      />

      {/* Cloud Sync Status Header & User Profile strip */}
      <div className="bg-[#FFFDF8] dark:bg-[#231d18] border border-[#E8DEC8] dark:border-[#382d24] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#F3ECE2] dark:bg-[#382d24] text-[#443126] dark:text-[#eedacb] flex items-center justify-center font-bold text-sm shrink-0 border border-[#d8c8b4] dark:border-[#47372b]">
            MB
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-[#3B281E] dark:text-white">
                Bienvenue dans votre Espace Grossesse &amp; PMA
              </h1>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#7d6c5d] dark:text-[#a8988a] mt-0.5">
              <span className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Synchronisation Cloud Active
              </span>
              <span aria-hidden="true">·</span>
              <span className="font-mono text-[#5c4c3e] dark:text-[#c4b5a6]">410bala@gmail.com</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenEditPregnancyDate}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#443126] dark:text-[#eedacb] bg-[#F3ECE2] hover:bg-[#E8DEC8] dark:bg-[#342921] dark:hover:bg-[#403328] rounded-xl border border-[#ebdcc9] dark:border-[#47372b] transition-colors cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5 text-[#443126] dark:text-[#eedacb]" />
            <span>Modifier la date du terme</span>
          </button>
        </div>
      </div>

      {/* 1. ACCÈS RAPIDE: TROUSSEAU BÉBÉ & MAMAN */}
      <div className="bg-[#FFFDF8] dark:bg-[#231d18] border border-[#E8DEC8] dark:border-[#382d24] rounded-2xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#443126] dark:text-[#eedacb]">
                Accès Rapide
              </span>
              <span aria-hidden="true">·</span>
              <span className="text-xs text-[#7d6c5d] dark:text-[#a8988a]">Préparatifs Maternité</span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-[#3B281E] dark:text-white">
              Trousseau Bébé &amp; Valise Maman
            </h2>
            <div className="flex items-center gap-3 pt-1">
              <span className="text-xs font-semibold text-[#5c4c3e] dark:text-[#c4b5a6]">
                {checkedChecklistCount} sur {totalChecklistCount} articles prêts
              </span>
              <div className="w-36 h-2 bg-[#F3ECE2] dark:bg-[#342921] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#443126] dark:bg-[#eedacb] rounded-full transition-all duration-300"
                  style={{ width: `${checklistProgress}%` }}
                />
              </div>
              <span className="text-xs font-mono font-bold text-[#443126] dark:text-[#eedacb]">
                {checklistProgress}%
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigateTab('trousseau')}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#443126] hover:bg-[#3B281E] active:scale-95 text-white text-xs sm:text-sm font-bold shadow-xs transition-all self-start sm:self-auto cursor-pointer"
          >
            <span>Ouvrir le Trousseau &amp; Préparatifs</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. DANS VOTRE VENTRE EN 3D (FEATURED DARK CARD) */}
      <div className="relative overflow-hidden rounded-3xl bg-[#3B281E] text-white p-6 sm:p-8 shadow-xl shadow-[#3B281E]/25 border border-[#523c2e]">
        {/* Warm glow element */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 rounded-full bg-white/5 blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 space-y-3">
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#faede1] font-semibold tracking-wide">
              <span className="px-2.5 py-0.5 rounded-md bg-white/15 text-[11px] font-bold uppercase tracking-wider">
                Dans votre Ventre en 3D
              </span>
              <span>·</span>
              <span className="text-[#f6e5d5]">
                {currentWeekData.trimester === 1
                  ? '1er Trimestre'
                  : currentWeekData.trimester === 2
                  ? '2e Trimestre'
                  : '3e Trimestre'}
              </span>
              <span>·</span>
              <span className="text-[#f6e5d5]">
                DPA : {dpaDate} (J - {daysRemaining} jours)
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Semaine {currentWeek} : 🍇 {currentWeekData.sizeComparison} ({currentWeekData.approxSize})
            </h2>

            <p className="text-[#f6e5d5] text-xs sm:text-sm leading-relaxed max-w-2xl">
              {currentWeekData.fetalDevelopment}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => onNavigateTab('chrono')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FAF6EE] hover:bg-white text-[#3B281E] text-xs sm:text-sm font-bold transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#8a5732]" />
                <span>Explorer le Fœtus en 3D &amp; Faits Clés →</span>
              </button>
              <button
                type="button"
                onClick={onOpenEditPregnancyDate}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#f6e5d5] text-xs font-semibold transition-colors cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Ajuster le terme ({currentWeek} SA + {gestationalDays}j)</span>
              </button>
            </div>
          </div>

          {/* 3D Visual Preview Badge */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-center">
            <div className="w-16 h-16 rounded-full bg-white/15 flex items-center justify-center mb-3 animate-pulse">
              <Baby className="w-8 h-8 text-white" />
            </div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-mono font-bold text-white mb-1">
              <span>3D INTERACTIF</span>
            </div>
            <p className="text-xs text-[#faede1]">
              Vue anatomique complète à {currentWeek} SA
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6 pt-4 border-t border-white/15">
          <div className="flex items-center justify-between text-xs text-[#faede1] mb-1.5 font-medium">
            <span>Début (1 SA)</span>
            <span>Semaine actuelle ({currentWeek} SA)</span>
            <span>Terme officiel (41 SA)</span>
          </div>
          <div className="w-full h-2.5 bg-black/25 rounded-full overflow-hidden p-0.5">
            <div
              className="h-full bg-white rounded-full transition-all duration-500 ease-out shadow-xs"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* 3. SUIVI QUOTIDIEN DE BÉBÉ (NOUVEAU-NÉ) */}
      <div className="bg-[#FFFDF8] dark:bg-[#231d18] border border-[#E8DEC8] dark:border-[#382d24] rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E8DEC8] dark:border-[#382d24]">
          <div>
            <h3 className="font-bold text-base sm:text-lg text-[#3B281E] dark:text-white">
              Suivi Quotidien de Bébé (Nouveau-né)
            </h3>
            <p className="text-xs text-[#7d6c5d] dark:text-[#a8988a]">
              Enregistrez rapidement une activité en un clic
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigateTab('trousseau')}
            className="text-xs font-semibold text-[#443126] dark:text-[#eedacb] hover:underline flex items-center gap-1 cursor-pointer self-start sm:self-auto"
          >
            <span>+ Noter une activité / Ouvrir le Tracker</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 4 Quick Log Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            type="button"
            onClick={() => onQuickBabyLog('nursing')}
            className="p-3.5 rounded-xl bg-[#FAF6EE] dark:bg-[#2b221b] border border-[#ebdcc9] dark:border-[#3d3128] hover:border-[#443126] dark:hover:border-[#eedacb] text-center transition-all group cursor-pointer"
          >
            <span className="text-2xl block mb-1">🤱</span>
            <span className="text-xs font-bold text-[#3B281E] dark:text-white block">Tétée</span>
            <span className="text-[11px] text-[#7d6c5d] dark:text-[#a8988a]">Sein G / D</span>
          </button>

          <button
            type="button"
            onClick={() => onQuickBabyLog('bottle')}
            className="p-3.5 rounded-xl bg-[#FAF6EE] dark:bg-[#2b221b] border border-[#ebdcc9] dark:border-[#3d3128] hover:border-[#443126] dark:hover:border-[#eedacb] text-center transition-all group cursor-pointer"
          >
            <span className="text-2xl block mb-1">🍼</span>
            <span className="text-xs font-bold text-[#3B281E] dark:text-white block">Biberon</span>
            <span className="text-[11px] text-[#7d6c5d] dark:text-[#a8988a]">Quantité ml</span>
          </button>

          <button
            type="button"
            onClick={() => onQuickBabyLog('pumping')}
            className="p-3.5 rounded-xl bg-[#FAF6EE] dark:bg-[#2b221b] border border-[#ebdcc9] dark:border-[#3d3128] hover:border-[#443126] dark:hover:border-[#eedacb] text-center transition-all group cursor-pointer"
          >
            <span className="text-2xl block mb-1">🥛</span>
            <span className="text-xs font-bold text-[#3B281E] dark:text-white block">Tire-lait</span>
            <span className="text-[11px] text-[#7d6c5d] dark:text-[#a8988a]">Expression</span>
          </button>

          <button
            type="button"
            onClick={() => onQuickBabyLog('diaper')}
            className="p-3.5 rounded-xl bg-[#FAF6EE] dark:bg-[#2b221b] border border-[#ebdcc9] dark:border-[#3d3128] hover:border-[#443126] dark:hover:border-[#eedacb] text-center transition-all group cursor-pointer"
          >
            <span className="text-2xl block mb-1">🩹</span>
            <span className="text-xs font-bold text-[#3B281E] dark:text-white block">Couche</span>
            <span className="text-[11px] text-[#7d6c5d] dark:text-[#a8988a]">Urine &amp; selle</span>
          </button>
        </div>
      </div>

      {/* 4. SECTION NAVIGATION CARDS (CHEVRON LIST ITEMS) */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-[#7d6c5d] dark:text-[#a8988a] uppercase tracking-wider">
          Modules &amp; Parcours Médical
        </h3>

        <div className="space-y-2.5">
          {/* Card 1: Chronologie Inversée & Étapes */}
          <div
            onClick={() => onNavigateTab('chrono')}
            className="p-4 sm:p-5 rounded-2xl bg-[#FFFDF8] dark:bg-[#231d18] border border-[#E8DEC8] dark:border-[#382d24] hover:border-[#bda58d] dark:hover:border-[#6a5445] transition-all flex items-center justify-between gap-4 cursor-pointer shadow-xs group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FAF6EE] dark:bg-[#342921] text-[#443126] dark:text-[#eedacb] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#3B281E] dark:text-white">
                  Chronologie Inversée &amp; Étapes
                </h4>
                <p className="text-xs text-[#7d6c5d] dark:text-[#a8988a]">
                  Du présent vers l'accouchement et jalons
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-[#7d6c5d] group-hover:text-[#443126] dark:group-hover:text-white group-hover:translate-x-1 transition-all" />
          </div>

          {/* Card 2: Suivi & Outils (Coups, Poids, Injections) */}
          <div
            onClick={() => onNavigateTab('suivi')}
            className="p-4 sm:p-5 rounded-2xl bg-[#FFFDF8] dark:bg-[#231d18] border border-[#E8DEC8] dark:border-[#382d24] hover:border-[#bda58d] dark:hover:border-[#6a5445] transition-all flex items-center justify-between gap-4 cursor-pointer shadow-xs group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FAF6EE] dark:bg-[#342921] text-[#443126] dark:text-[#eedacb] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#3B281E] dark:text-white">
                  Suivi &amp; Outils (Coups, Poids, Injections)
                </h4>
                <p className="text-xs text-[#7d6c5d] dark:text-[#a8988a]">
                  Compteur de coups, historique des pesées et protocole
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-[#7d6c5d] group-hover:text-[#443126] dark:group-hover:text-white group-hover:translate-x-1 transition-all" />
          </div>

          {/* Card 3: Projet de Naissance & Carnet Intime */}
          <div
            onClick={() => onNavigateTab('trousseau')}
            className="p-4 sm:p-5 rounded-2xl bg-[#FFFDF8] dark:bg-[#231d18] border border-[#E8DEC8] dark:border-[#382d24] hover:border-[#bda58d] dark:hover:border-[#6a5445] transition-all flex items-center justify-between gap-4 cursor-pointer shadow-xs group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FAF6EE] dark:bg-[#342921] text-[#443126] dark:text-[#eedacb] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#3B281E] dark:text-white">
                  Projet de Naissance &amp; Carnet Intime
                </h4>
                <p className="text-xs text-[#7d6c5d] dark:text-[#a8988a]">
                  Export PDF pour les professionnels de santé
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-[#7d6c5d] group-hover:text-[#443126] dark:group-hover:text-white group-hover:translate-x-1 transition-all" />
          </div>

          {/* Card 4: Protocole PMA, Rappels & Réglages */}
          <div
            onClick={onOpenPmaModal}
            className="p-4 sm:p-5 rounded-2xl bg-[#FFFDF8] dark:bg-[#231d18] border border-[#E8DEC8] dark:border-[#382d24] hover:border-[#bda58d] dark:hover:border-[#6a5445] transition-all flex items-center justify-between gap-4 cursor-pointer shadow-xs group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FAF6EE] dark:bg-[#342921] text-[#443126] dark:text-[#eedacb] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Syringe className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#3B281E] dark:text-white">
                  Protocole PMA, Rappels &amp; Réglages
                </h4>
                <p className="text-xs text-[#7d6c5d] dark:text-[#a8988a]">
                  Traitements, dosages quotidiens, rappels push &amp; téléphone clinique
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-[#7d6c5d] group-hover:text-[#443126] dark:group-hover:text-white group-hover:translate-x-1 transition-all" />
          </div>
        </div>
      </div>

      {/* 5. WIDGET CENTRE PMA */}
      <div className="bg-[#FFFDF8] dark:bg-[#231d18] border border-[#E8DEC8] dark:border-[#382d24] rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E8DEC8] dark:border-[#382d24]">
          <div className="flex items-center gap-2">
            <Syringe className="w-4 h-4 text-[#443126] dark:text-[#eedacb]" />
            <h3 className="font-bold text-base text-[#3B281E] dark:text-white">
              Widget Centre PMA &amp; Coordination
            </h3>
          </div>
          <button
            type="button"
            onClick={onOpenPmaModal}
            className="text-xs font-semibold text-[#443126] dark:text-[#eedacb] hover:underline flex items-center gap-1 cursor-pointer self-start sm:self-auto"
          >
            <span>Modifier le centre</span>
            <Edit3 className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-[#FAF6EE] dark:bg-[#2b221b] border border-[#ebdcc9] dark:border-[#3d3128]">
            <span className="text-[11px] text-[#7d6c5d] uppercase block">Début de Cycle</span>
            <span className="font-bold font-mono text-sm text-[#3B281E] dark:text-white">
              Cycle J1 : {pmaConfig.cycleStartDate}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-[#FAF6EE] dark:bg-[#2b221b] border border-[#ebdcc9] dark:border-[#3d3128]">
            <span className="text-[11px] text-[#7d6c5d] uppercase block">Statut Immédiat</span>
            <span className="font-bold text-sm text-[#3B281E] dark:text-white">
              {pmaConfig.status || 'Nothing right now'}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-[#FAF6EE] dark:bg-[#2b221b] border border-[#ebdcc9] dark:border-[#3d3128] sm:col-span-2 lg:col-span-1">
            <span className="text-[11px] text-[#7d6c5d] uppercase block">Protocole</span>
            <span className="font-bold text-sm text-[#3B281E] dark:text-white truncate block">
              {pmaConfig.protocolName}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <a
            href={`tel:${pmaConfig.clinicPhone}`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#443126] hover:bg-[#3B281E] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Appeler ({pmaConfig.clinicPhone})</span>
          </a>

          <a
            href={`mailto:${pmaConfig.clinicEmail}`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FAF6EE] hover:bg-[#F3ECE2] dark:bg-[#342921] dark:hover:bg-[#403328] text-[#443126] dark:text-[#eedacb] border border-[#ebdcc9] dark:border-[#47372b] text-xs font-bold transition-colors cursor-pointer"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Email ({pmaConfig.clinicEmail})</span>
          </a>
        </div>
      </div>

      {/* 6. ULTRASOUND & MEDICAL MILESTONES (CLICHÉS & MÉDICAMENTS) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Galerie Clichés d'Échographie */}
        <div className="lg:col-span-7 bg-[#FFFDF8] dark:bg-[#231d18] border border-[#E8DEC8] dark:border-[#382d24] rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E8DEC8] dark:border-[#382d24]">
            <div>
              <h3 className="font-bold text-base text-[#3B281E] dark:text-white">
                Galerie Clichés d'Échographie
              </h3>
              <p className="text-xs text-[#7d6c5d] dark:text-[#a8988a]">
                {ultrasounds.length} cliché(s) &amp; photos archivés
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                onAddUltrasound({
                  title: `Échographie Semaine ${currentWeek} SA`,
                  week: currentWeek,
                  date: new Date().toLocaleDateString('fr-FR'),
                  notes: 'Nouvelle échographie ajoutée au carnet de maternité.',
                });
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FAF6EE] dark:bg-[#342921] text-[#443126] dark:text-[#eedacb] text-xs font-semibold border border-[#ebdcc9] dark:border-[#47372b] cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Ajouter cliché</span>
            </button>
          </div>

          {/* Empty state or items list */}
          {ultrasounds.length === 0 ? (
            <div className="p-6 rounded-2xl border-2 border-dashed border-[#ebdcc9] dark:border-[#3d3128] text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#FAF6EE] dark:bg-[#342921] text-[#443126] dark:text-[#eedacb] flex items-center justify-center mx-auto">
                <Camera className="w-6 h-6" />
              </div>
              <p className="text-xs text-[#5c4c3e] dark:text-[#c4b5a6] max-w-sm mx-auto">
                Prenez directement une photo de votre compte-rendu ou de vos clichés d'échographie pour les conserver dans votre dossier.
              </p>
              <div className="flex items-center justify-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 rounded-xl bg-[#443126] hover:bg-[#3B281E] text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Prendre photo</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onAddUltrasound({
                      title: `Échographie Semaine ${currentWeek} SA`,
                      week: currentWeek,
                      date: new Date().toLocaleDateString('fr-FR'),
                      notes: 'Cliché archivé dans le dossier médical.',
                    });
                  }}
                  className="px-4 py-2 rounded-xl bg-[#FAF6EE] dark:bg-[#342921] text-[#443126] dark:text-[#eedacb] border border-[#ebdcc9] dark:border-[#47372b] text-xs font-bold cursor-pointer"
                >
                  Ajouter cliché
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {ultrasounds.map((u) => (
                <div
                  key={u.id}
                  className="p-3.5 rounded-xl bg-[#FAF6EE] dark:bg-[#2b221b] border border-[#ebdcc9] dark:border-[#3d3128] flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#3B281E] dark:text-white">
                        {u.title}
                      </span>
                      <span className="font-mono text-[#7d6c5d]">{u.week} SA</span>
                    </div>
                    <p className="text-[#5c4c3e] dark:text-[#c4b5a6] text-[11px] line-clamp-1">
                      {u.notes}
                    </p>
                  </div>
                  <span className="text-[11px] font-mono text-[#7d6c5d]">{u.date}</span>
                </div>
              ))}
              <div className="pt-1 flex justify-center">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs font-semibold text-[#443126] dark:text-[#eedacb] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Prendre une autre photo</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right: Prochain rappel & Médicaments & Prochaine étape */}
        <div className="lg:col-span-5 space-y-4">
          {/* Prochain rappel d'injection */}
          <div className="bg-[#FFFDF8] dark:bg-[#231d18] border border-[#E8DEC8] dark:border-[#382d24] rounded-2xl p-4 sm:p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Syringe className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                <span className="text-xs font-bold text-[#3B281E] dark:text-white">
                  Prochain rappel d'injection
                </span>
              </div>
              <span className="text-[11px] font-semibold text-rose-800 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded-full border border-rose-200 dark:border-rose-800/60">
                {pmaConfig.eveningInjectionTime
                  ? `Soir : ${pmaConfig.eveningInjectionTime}`
                  : 'Aucune injection en attente'}
              </span>
            </div>
            <p className="text-xs text-[#5c4c3e] dark:text-[#c4b5a6] mt-2 leading-relaxed">
              Rappels programmés : Matin à {pmaConfig.morningInjectionTime || '08:00'} et Soir à{' '}
              {pmaConfig.eveningInjectionTime || '20:00'}.
            </p>
          </div>

          {/* Médicaments & Sécurité Grossesse Banner */}
          <div className="bg-[#FFFDF8] dark:bg-[#231d18] border border-[#E8DEC8] dark:border-[#382d24] rounded-2xl p-4 sm:p-5 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                <span className="text-xs font-bold text-[#3B281E] dark:text-white">
                  Médicaments &amp; Sécurité Grossesse
                </span>
              </div>
              <button
                type="button"
                onClick={() => onNavigateTab('guide')}
                className="text-xs font-semibold text-[#443126] dark:text-[#eedacb] hover:underline cursor-pointer"
              >
                Base 28 substances →
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2 text-[11px] pt-1">
              <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-300 font-medium text-center">
                <span>Doliprane</span>
                <span className="block text-[10px] text-emerald-700">✓ Sûr (T1-T3)</span>
              </div>
              <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-300 font-medium text-center">
                <span>Spasfon</span>
                <span className="block text-[10px] text-emerald-700">✓ Sûr (T1-T3)</span>
              </div>
              <div className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800/60 text-rose-900 dark:text-rose-300 font-medium text-center">
                <span>Advil / AINS</span>
                <span className="block text-[10px] text-rose-700">✗ Interdit dès T3</span>
              </div>
            </div>
          </div>

          {/* Prochaine Étape Banner */}
          <div className="bg-[#FFFDF8] dark:bg-[#231d18] border border-[#E8DEC8] dark:border-[#382d24] rounded-2xl p-4 sm:p-5 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#3B281E] dark:text-white flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#443126] dark:text-[#eedacb]" />
                <span>Prochaine Étape Clinique</span>
              </span>
              <span className="font-mono text-xs text-[#443126] dark:text-[#eedacb] font-bold">
                {nextMilestone.period}
              </span>
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-[#3B281E] dark:text-white">
              {nextMilestone.title}
            </h4>
            <p className="text-xs text-[#5c4c3e] dark:text-[#c4b5a6] leading-relaxed">
              {nextMilestone.description}
            </p>
            <div className="pt-1 flex justify-end">
              <button
                type="button"
                onClick={() => onNavigateTab('chrono')}
                className="text-xs font-semibold text-[#443126] dark:text-[#eedacb] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Voir le calendrier complet</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
