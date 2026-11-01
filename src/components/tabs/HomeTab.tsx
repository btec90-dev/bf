import React from 'react';
import {
  Calendar,
  Heart,
  Activity,
  ShieldCheck,
  Baby,
  Clock,
  ArrowRight,
  Sparkles,
  ChevronRight,
  TrendingUp,
  Share2,
} from 'lucide-react';
import { TabType, BloodPressureLog, GlucoseLog, WeightLog } from '../../types';
import { TIMELINE_WEEKS } from '../../data/pregnancyData';
import { OBSTETRIC_MILESTONES } from '../../data/consultationsData';
import { analyzeBloodPressure, analyzeGlucose } from '../../utils/clinicalEngine';

interface Props {
  currentWeek: number;
  onSelectWeek: (w: number) => void;
  onNavigateTab: (tab: TabType) => void;
  onOpenExport?: () => void;
  bpLogs: BloodPressureLog[];
  glucoseLogs: GlucoseLog[];
  weightLogs: WeightLog[];
}

export const HomeTab: React.FC<Props> = ({
  currentWeek,
  onSelectWeek,
  onNavigateTab,
  onOpenExport,
  bpLogs,
  glucoseLogs,
  weightLogs,
}) => {
  const currentWeekData = TIMELINE_WEEKS.find((w) => w.week === currentWeek) || TIMELINE_WEEKS[21];

  // Calculate approximate countdown based on 40/41 weeks (280 days total)
  const daysTotal = 280;
  const daysPassed = (currentWeek - 1) * 7 + 4;
  const daysRemaining = Math.max(0, daysTotal - daysPassed);
  const progressPercent = Math.min(100, Math.round((daysPassed / daysTotal) * 100));

  // Latest Vitals
  const latestBP = bpLogs.length > 0 ? bpLogs[0] : null;
  const bpAnalysis = latestBP ? analyzeBloodPressure(latestBP.systolic, latestBP.diastolic) : null;

  const latestGlucose = glucoseLogs.length > 0 ? glucoseLogs[0] : null;
  const glucoseAnalysis = latestGlucose ? analyzeGlucose(latestGlucose.value, latestGlucose.context) : null;

  const latestWeight = weightLogs.length > 0 ? weightLogs[0] : null;

  // Next Milestone
  const nextMilestone = OBSTETRIC_MILESTONES.find((m) => {
    const match = m.period.match(/\d+/g);
    if (!match) return false;
    const end = Number(match[match.length - 1]);
    return end >= currentWeek;
  }) || OBSTETRIC_MILESTONES[OBSTETRIC_MILESTONES.length - 1];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Cloud Sync Status Header & User Profile strip */}
      <div className="bg-white dark:bg-[#231d18] border border-[#e5dcd1] dark:border-[#382d24] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#f3ece2] dark:bg-[#382d24] text-[#784824] dark:text-[#eedacb] flex items-center justify-center font-bold text-sm shrink-0">
            BF
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-[#2d221a] dark:text-white">
                Bienvenue dans votre Espace Maternité
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
            onClick={() => onNavigateTab('timeline')}
            className="text-xs font-semibold text-[#8a5732] dark:text-[#d49970] hover:text-[#744421] dark:hover:text-[#f3d2be] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Voir la chronologie complète</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Hero Pregnancy Summary Card & DPA Countdown - Warm Light Brown / Chestnut Palette */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#804e29] via-[#945f37] to-[#6a3d1d] text-white p-6 sm:p-8 shadow-lg shadow-[#804e29]/20">
        {/* Soft warm glow */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 rounded-full bg-white/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8">
            <div className="flex items-center gap-2.5 text-xs text-[#faede1] font-semibold tracking-wide uppercase">
              <span>{currentWeekData.trimester === 1 ? '1er Trimestre' : currentWeekData.trimester === 2 ? '2e Trimestre' : '3e Trimestre'}</span>
              <span>·</span>
              <span>Semaine {currentWeek} SA</span>
              <span>·</span>
              <span>Mois {Math.min(9, Math.ceil(currentWeek / 4.5))}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1 text-white">
              Bébé a la taille d'une {currentWeekData.sizeComparison.toLowerCase()}
            </h2>

            <p className="mt-2 text-[#f6e5d5] text-sm leading-relaxed max-w-2xl">
              {currentWeekData.fetalDevelopment}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-4 text-xs">
              <div className="bg-white/15 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/20">
                <span className="text-[#faede1] block text-[10px] uppercase font-medium">Longueur approximative</span>
                <span className="font-bold text-base font-mono">{currentWeekData.approxSize}</span>
              </div>
              <div className="bg-white/15 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/20">
                <span className="text-[#faede1] block text-[10px] uppercase font-medium">Compte à rebours DPA</span>
                <span className="font-bold text-base font-mono">J - {daysRemaining} jours</span>
              </div>
              <div className="bg-white/15 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/20">
                <span className="text-[#faede1] block text-[10px] uppercase font-medium">Progression</span>
                <span className="font-bold text-base font-mono">{progressPercent}%</span>
              </div>
            </div>
          </div>

          {/* Mini Interactive Womb Shortcut */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mb-3 animate-pulse">
              <Baby className="w-8 h-8 text-white" />
            </div>
            <p className="font-bold text-sm text-white">Dans le Ventre 3D</p>
            <p className="text-xs text-[#faede1] mt-1">Explorez l'anatomie fœtale interactive</p>
            <button
              onClick={() => onNavigateTab('timeline')}
              type="button"
              className="mt-4 px-4 py-2 rounded-xl bg-[#faf6f0] text-[#6d4021] hover:bg-white text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
            >
              Lancer la vue 3D
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6 pt-4 border-t border-white/20">
          <div className="flex items-center justify-between text-xs text-[#faede1] mb-1.5 font-medium">
            <span>Début de grossesse (1 SA)</span>
            <span>Mi-parcours (20 SA)</span>
            <span>Terme prévu (41 SA)</span>
          </div>
          <div className="w-full h-2.5 bg-black/20 rounded-full overflow-hidden p-0.5">
            <div
              className="h-full bg-white rounded-full transition-all duration-500 ease-out shadow-xs"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* 2-Column Dashboard Split: Maternal Vitals + Next Obstetric Milestone */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Maternal Vitals Quick Summary */}
        <div className="lg:col-span-7 bg-white dark:bg-[#231d18] border border-[#e5dcd1] dark:border-[#382d24] rounded-2xl p-5 sm:p-6 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#eee5da] dark:border-[#382d24]">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#8a5732]" />
                <h3 className="font-bold text-[#2d221a] dark:text-white text-base">
                  Constantes Vitales Récentes (Maman)
                </h3>
              </div>
              <div className="flex items-center gap-3">
                {onOpenExport && (
                  <button
                    onClick={onOpenExport}
                    type="button"
                    className="text-xs font-semibold text-[#8a5732] dark:text-[#d49970] hover:text-[#744421] dark:hover:text-[#f3d2be] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Exporter (CSV/JSON)</span>
                  </button>
                )}
                <button
                  onClick={() => onNavigateTab('tools')}
                  type="button"
                  className="text-xs font-semibold text-[#665444] dark:text-[#c4b5a6] hover:text-[#2d221a] dark:hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  <span>Accéder aux outils</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Vitals KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
              {/* BP Card */}
              <div className="p-3.5 rounded-xl bg-[#faf6f0] dark:bg-[#2b221b] border border-[#ebdcc9] dark:border-[#3d3128]">
                <div className="flex items-center justify-between text-xs text-[#7d6c5d] dark:text-[#a8988a] mb-1">
                  <span>Tension Artérielle</span>
                  <Heart className="w-3.5 h-3.5 text-[#8a5732]" />
                </div>
                {latestBP ? (
                  <>
                    <p className="text-xl font-bold font-mono text-[#2d221a] dark:text-white">
                      {latestBP.systolic}/{latestBP.diastolic}
                      <span className="text-[11px] font-normal text-[#7d6c5d] ml-1">mmHg</span>
                    </p>
                    <p className={`text-[11px] font-medium mt-1 truncate ${bpAnalysis?.colorClass}`}>
                      {bpAnalysis?.label.split('(')[0]}
                    </p>
                  </>
                ) : (
                  <div className="py-1">
                    <p className="text-xs text-[#7d6c5d]">Aucune mesure</p>
                    <button
                      onClick={() => onNavigateTab('tools')}
                      className="text-xs text-[#8a5732] font-semibold hover:underline mt-1 block"
                    >
                      + Mesurer
                    </button>
                  </div>
                )}
              </div>

              {/* Glucose Card */}
              <div className="p-3.5 rounded-xl bg-[#faf6f0] dark:bg-[#2b221b] border border-[#ebdcc9] dark:border-[#3d3128]">
                <div className="flex items-center justify-between text-xs text-[#7d6c5d] dark:text-[#a8988a] mb-1">
                  <span>Glycémie</span>
                  <Activity className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                </div>
                {latestGlucose ? (
                  <>
                    <p className="text-xl font-bold font-mono text-[#2d221a] dark:text-white">
                      {latestGlucose.value}
                      <span className="text-[11px] font-normal text-[#7d6c5d] ml-1">mg/dL</span>
                    </p>
                    <p className={`text-[11px] font-medium mt-1 truncate ${glucoseAnalysis?.colorClass}`}>
                      {glucoseAnalysis?.interpretation}
                    </p>
                  </>
                ) : (
                  <div className="py-1">
                    <p className="text-xs text-[#7d6c5d]">Aucun relevé</p>
                    <button
                      onClick={() => onNavigateTab('tools')}
                      className="text-xs text-[#8a5732] font-semibold hover:underline mt-1 block"
                    >
                      + Ajouter
                    </button>
                  </div>
                )}
              </div>

              {/* Weight Card */}
              <div className="p-3.5 rounded-xl bg-[#faf6f0] dark:bg-[#2b221b] border border-[#ebdcc9] dark:border-[#3d3128]">
                <div className="flex items-center justify-between text-xs text-[#7d6c5d] dark:text-[#a8988a] mb-1">
                  <span>Pesée</span>
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                </div>
                {latestWeight ? (
                  <>
                    <p className="text-xl font-bold font-mono text-[#2d221a] dark:text-white">
                      {latestWeight.weight.toFixed(1)}
                      <span className="text-[11px] font-normal text-[#7d6c5d] ml-1">kg</span>
                    </p>
                    <p className="text-[11px] font-medium text-emerald-700 dark:text-emerald-400 mt-1">
                      Gain régulier
                    </p>
                  </>
                ) : (
                  <div className="py-1">
                    <p className="text-xs text-[#7d6c5d]">Non renseigné</p>
                    <button
                      onClick={() => onNavigateTab('tools')}
                      className="text-xs text-[#8a5732] font-semibold hover:underline mt-1 block"
                    >
                      + Peser
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#eee5da] dark:border-[#382d24] flex items-center justify-between text-xs text-[#7d6c5d] dark:text-[#a8988a]">
            <span>Interprétation automatique conforme aux référentiels ACOG &amp; CDC</span>
            <span className="font-mono text-[#8a5732] dark:text-[#d49970]">Temps réel</span>
          </div>
        </div>

        {/* Right: Next Obstetric Milestone */}
        <div className="lg:col-span-5 bg-white dark:bg-[#231d18] border border-[#e5dcd1] dark:border-[#382d24] rounded-2xl p-5 sm:p-6 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#eee5da] dark:border-[#382d24]">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#8a5732]" />
                <h3 className="font-bold text-[#2d221a] dark:text-white text-base">
                  Prochain Jalon Obstétrical
                </h3>
              </div>
              <span className="text-xs font-semibold text-[#8a5732] dark:text-[#d49970] font-mono">
                {nextMilestone.period}
              </span>
            </div>

            <div className="mt-3">
              <h4 className="font-bold text-sm text-[#2d221a] dark:text-white">
                {nextMilestone.title}
              </h4>
              <p className="text-xs text-[#7d6c5d] dark:text-[#a8988a] mt-0.5">
                Lieu : {nextMilestone.location}
              </p>
              <p className="text-xs text-[#5c4c3e] dark:text-[#c4b5a6] mt-2 leading-relaxed">
                {nextMilestone.description}
              </p>

              <div className="mt-3 space-y-1">
                <span className="text-[11px] font-semibold text-[#7d6c5d] uppercase tracking-wider block">
                  Examens prévus :
                </span>
                {nextMilestone.keyExams.map((exam, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 text-xs text-[#2d221a] dark:text-[#e4ded6]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8a5732] shrink-0" />
                    <span>{exam}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#eee5da] dark:border-[#382d24] flex justify-end">
            <button
              onClick={() => onNavigateTab('timeline')}
              type="button"
              className="text-xs font-semibold text-[#8a5732] dark:text-[#d49970] hover:text-[#744421] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Consulter tous les rendez-vous</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Action Grid (Outils & Journaux) */}
      <div>
        <h3 className="text-xs font-bold text-[#665444] dark:text-[#c4b5a6] uppercase tracking-wider mb-3">
          Accès Rapide aux Outils Cliniques &amp; Pratiques
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <button
            type="button"
            onClick={() => onNavigateTab('tools')}
            className="p-4 rounded-xl bg-white dark:bg-[#231d18] border border-[#e5dcd1] dark:border-[#382d24] hover:border-[#bda58d] dark:hover:border-[#6a5445] text-left transition-all hover:shadow-xs group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-lg bg-[#f4ece2] dark:bg-[#342921] text-[#8a5732] dark:text-[#e4cfbf] flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <Clock className="w-4 h-4" />
            </div>
            <p className="text-xs font-bold text-[#2d221a] dark:text-white">Chronomètre Contractions</p>
            <span className="text-[11px] text-[#7d6c5d] dark:text-[#a8988a] mt-0.5 block">Règle 5-1-1 Maternité</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab('tools')}
            className="p-4 rounded-xl bg-white dark:bg-[#231d18] border border-[#e5dcd1] dark:border-[#382d24] hover:border-[#bda58d] dark:hover:border-[#6a5445] text-left transition-all hover:shadow-xs group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-lg bg-[#f0e8dc] dark:bg-[#332a22] text-[#7b4d29] dark:text-[#debba4] flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <Baby className="w-4 h-4" />
            </div>
            <p className="text-xs font-bold text-[#2d221a] dark:text-white">Compteur de Coups</p>
            <span className="text-[11px] text-[#7d6c5d] dark:text-[#a8988a] mt-0.5 block">Protocole 10 mouvements</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab('tools')}
            className="p-4 rounded-xl bg-white dark:bg-[#231d18] border border-[#e5dcd1] dark:border-[#382d24] hover:border-[#bda58d] dark:hover:border-[#6a5445] text-left transition-all hover:shadow-xs group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-lg bg-[#edf3ea] dark:bg-[#253224] text-emerald-700 dark:text-emerald-300 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <p className="text-xs font-bold text-[#2d221a] dark:text-white">Sécurité Médicaments</p>
            <span className="text-[11px] text-[#7d6c5d] dark:text-[#a8988a] mt-0.5 block">Base 28 substances</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab('baby')}
            className="p-4 rounded-xl bg-white dark:bg-[#231d18] border border-[#e5dcd1] dark:border-[#382d24] hover:border-[#bda58d] dark:hover:border-[#6a5445] text-left transition-all hover:shadow-xs group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-lg bg-[#f7f0e3] dark:bg-[#3a3021] text-amber-700 dark:text-amber-300 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4" />
            </div>
            <p className="text-xs font-bold text-[#2d221a] dark:text-white">Projet de Naissance</p>
            <span className="text-[11px] text-[#7d6c5d] dark:text-[#a8988a] mt-0.5 block">5 thèmes d'accouchement</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab('baby')}
            className="p-4 rounded-xl bg-white dark:bg-[#231d18] border border-[#e5dcd1] dark:border-[#382d24] hover:border-[#bda58d] dark:hover:border-[#6a5445] text-left transition-all hover:shadow-xs group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-lg bg-[#eef3f7] dark:bg-[#212d38] text-sky-700 dark:text-sky-300 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <Activity className="w-4 h-4" />
            </div>
            <p className="text-xs font-bold text-[#2d221a] dark:text-white">Journal Quotidien Bébé</p>
            <span className="text-[11px] text-[#7d6c5d] dark:text-[#a8988a] mt-0.5 block">Tétées, biberons, couches</span>
          </button>
        </div>
      </div>
    </div>
  );
};
