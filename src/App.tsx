import React, { useState, useEffect } from 'react';
import { TabType, BloodPressureLog, GlucoseLog, WeightLog, KickLog, ContractionLog, BabyCareLog, UltrasoundMemory } from './types';
import { Navbar } from './components/Navbar';
import { HomeTab } from './components/tabs/HomeTab';
import { TimelineTab } from './components/tabs/TimelineTab';
import { GuideTab } from './components/tabs/GuideTab';
import { ToolsTab } from './components/tabs/ToolsTab';
import { BabyJournalTab } from './components/tabs/BabyJournalTab';
import { ExportHealthModal } from './components/ExportHealthModal';
import confetti from 'canvas-confetti';

const STORAGE_KEYS = {
  TAB: 'maman_bebe_tab',
  WEEK: 'maman_bebe_week',
  THEME: 'maman_bebe_theme',
  BP: 'maman_bebe_bp',
  GLUCOSE: 'maman_bebe_glucose',
  WEIGHT: 'maman_bebe_weight',
  KICKS: 'maman_bebe_kicks',
  CONTRACTIONS: 'maman_bebe_contractions',
  BABY_LOGS: 'maman_bebe_baby_logs',
  CHECKLIST: 'maman_bebe_checklist',
  BIRTH_PLAN: 'maman_bebe_birth_plan',
  ULTRASOUNDS: 'maman_bebe_ultrasounds',
};

// Initial realistic seeds
const INITIAL_BP: BloodPressureLog[] = [
  {
    id: 'bp-1',
    systolic: 118,
    diastolic: 76,
    pulse: 78,
    timestamp: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    notes: 'Mesure au repos en décubitus',
  },
  {
    id: 'bp-2',
    systolic: 122,
    diastolic: 78,
    pulse: 82,
    timestamp: new Date(Date.now() - 28 * 3600 * 1000).toISOString(),
    notes: 'Mesure matinale',
  },
];

const INITIAL_GLUCOSE: GlucoseLog[] = [
  {
    id: 'glu-1',
    value: 86,
    context: 'fasting',
    timestamp: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
  },
  {
    id: 'glu-2',
    value: 114,
    context: 'post2h',
    timestamp: new Date(Date.now() - 18 * 3600 * 1000).toISOString(),
  },
];

const INITIAL_WEIGHT: WeightLog[] = [
  {
    id: 'wt-1',
    weight: 64.2,
    timestamp: new Date(Date.now() - 2 * 86400 * 1000).toISOString(),
  },
  {
    id: 'wt-2',
    weight: 63.8,
    timestamp: new Date(Date.now() - 9 * 86400 * 1000).toISOString(),
  },
];

const INITIAL_ULTRASOUNDS: UltrasoundMemory[] = [
  {
    id: 'echo-t1',
    title: 'Échographie du 1er Trimestre (T1)',
    week: 12,
    date: '15/05/2026',
    biparietalDiameter: '21 mm',
    femurLength: '7.8 mm',
    estimatedWeight: '55 g',
    notes: 'Clarté nucale normale à 1.2 mm. Vitalité fœtale excellente.',
  },
  {
    id: 'echo-t2',
    title: 'Échographie Morphologique (T2)',
    week: 22,
    date: '28/07/2026',
    biparietalDiameter: '54 mm',
    femurLength: '38 mm',
    estimatedWeight: '480 g',
    notes: 'Morphologie normale complète, 4 cavités cardiaques parfaites, placenta postérieur haut inséré.',
  },
];

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>(() => {
    return (localStorage.getItem(STORAGE_KEYS.TAB) as TabType) || 'home';
  });

  const [currentWeek, setCurrentWeek] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.WEEK);
    return saved ? Number(saved) : 22; // default week 22
  });

  const [isDark, setIsDark] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_KEYS.THEME) === 'dark';
  });

  const [isExportOpen, setIsExportOpen] = useState(false);

  // Vitals State
  const [bpLogs, setBpLogs] = useState<BloodPressureLog[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BP);
    return saved ? JSON.parse(saved) : INITIAL_BP;
  });

  const [glucoseLogs, setGlucoseLogs] = useState<GlucoseLog[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.GLUCOSE);
    return saved ? JSON.parse(saved) : INITIAL_GLUCOSE;
  });

  const [weightLogs, setWeightLogs] = useState<WeightLog[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.WEIGHT);
    return saved ? JSON.parse(saved) : INITIAL_WEIGHT;
  });

  const [kickLogs, setKickLogs] = useState<KickLog[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.KICKS);
    return saved ? JSON.parse(saved) : [];
  });

  const [contractionLogs, setContractionLogs] = useState<ContractionLog[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CONTRACTIONS);
    return saved ? JSON.parse(saved) : [];
  });

  const [babyLogs, setBabyLogs] = useState<BabyCareLog[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BABY_LOGS);
    return saved ? JSON.parse(saved) : [];
  });

  const [checkedChecklistIds, setCheckedChecklistIds] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CHECKLIST);
    return saved ? JSON.parse(saved) : { pyjamas: true, bodys: true, 'valise-maman': true };
  });

  const [birthPlanAnswers, setBirthPlanAnswers] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BIRTH_PLAN);
    return saved
      ? JSON.parse(saved)
      : {
          ambiance: 'Oui, ambiance tamisée et playlist personnelle.',
          pain_relief: 'Ballon de grossesse, marche et bains chauds.',
          epidural: 'Péridurale ambulatoire (dosée pour conserver la mobilité des jambes).',
          pushing: 'Poussée spontanée au réflexe d\'éjection et selon les contractions.',
          newborn_welcome: 'Peau à peau immédiat et ininterrompu d\'au moins 2 heures.',
        };
  });

  const [ultrasounds, setUltrasounds] = useState<UltrasoundMemory[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ULTRASOUNDS);
    return saved ? JSON.parse(saved) : INITIAL_ULTRASOUNDS;
  });

  // Sync Tab
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TAB, currentTab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentTab]);

  // Sync Week
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WEEK, String(currentWeek));
  }, [currentWeek]);

  // Sync Theme
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.THEME, isDark ? 'dark' : 'light');
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  }, [isDark]);

  // Persist handlers
  const handleAddBP = (log: Omit<BloodPressureLog, 'id'>) => {
    const newEntry: BloodPressureLog = { ...log, id: 'bp-' + Date.now() };
    const updated = [newEntry, ...bpLogs];
    setBpLogs(updated);
    localStorage.setItem(STORAGE_KEYS.BP, JSON.stringify(updated));
  };

  const handleAddGlucose = (log: Omit<GlucoseLog, 'id'>) => {
    const newEntry: GlucoseLog = { ...log, id: 'glu-' + Date.now() };
    const updated = [newEntry, ...glucoseLogs];
    setGlucoseLogs(updated);
    localStorage.setItem(STORAGE_KEYS.GLUCOSE, JSON.stringify(updated));
  };

  const handleAddWeight = (log: Omit<WeightLog, 'id'>) => {
    const newEntry: WeightLog = { ...log, id: 'wt-' + Date.now() };
    const updated = [newEntry, ...weightLogs];
    setWeightLogs(updated);
    localStorage.setItem(STORAGE_KEYS.WEIGHT, JSON.stringify(updated));
  };

  const handleSaveKickSession = (log: Omit<KickLog, 'id'>) => {
    const newEntry: KickLog = { ...log, id: 'kick-' + Date.now() };
    const updated = [newEntry, ...kickLogs];
    setKickLogs(updated);
    localStorage.setItem(STORAGE_KEYS.KICKS, JSON.stringify(updated));

    // Celebratory small confetti
    try {
      confetti({ particleCount: 35, spread: 60, origin: { y: 0.6 } });
    } catch {}
  };

  const handleSaveContraction = (log: Omit<ContractionLog, 'id'>) => {
    const newEntry: ContractionLog = { ...log, id: 'ct-' + Date.now() };
    const updated = [newEntry, ...contractionLogs];
    setContractionLogs(updated);
    localStorage.setItem(STORAGE_KEYS.CONTRACTIONS, JSON.stringify(updated));
  };

  const handleClearContractions = () => {
    setContractionLogs([]);
    localStorage.setItem(STORAGE_KEYS.CONTRACTIONS, JSON.stringify([]));
  };

  const handleAddBabyLog = (log: Omit<BabyCareLog, 'id'>) => {
    const newEntry: BabyCareLog = { ...log, id: 'baby-' + Date.now() };
    const updated = [newEntry, ...babyLogs];
    setBabyLogs(updated);
    localStorage.setItem(STORAGE_KEYS.BABY_LOGS, JSON.stringify(updated));
  };

  const handleToggleChecklistItem = (id: string) => {
    const updated = { ...checkedChecklistIds, [id]: !checkedChecklistIds[id] };
    setCheckedChecklistIds(updated);
    localStorage.setItem(STORAGE_KEYS.CHECKLIST, JSON.stringify(updated));
  };

  const handleSaveBirthPlanAnswer = (topicId: string, answer: string) => {
    const updated = { ...birthPlanAnswers, [topicId]: answer };
    setBirthPlanAnswers(updated);
    localStorage.setItem(STORAGE_KEYS.BIRTH_PLAN, JSON.stringify(updated));
  };

  const handleAddUltrasound = (item: Omit<UltrasoundMemory, 'id'>) => {
    const newEntry: UltrasoundMemory = { ...item, id: 'echo-' + Date.now() };
    const updated = [newEntry, ...ultrasounds];
    setUltrasounds(updated);
    localStorage.setItem(STORAGE_KEYS.ULTRASOUNDS, JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-[#f8f5ee] dark:bg-[#191512] text-[#2c221c] dark:text-[#f3ece5] flex flex-col font-sans transition-colors duration-200">
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        onOpenExport={() => setIsExportOpen(true)}
        isDark={isDark}
        onToggleTheme={() => setIsDark(!isDark)}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-24 lg:pb-12">
        {currentTab === 'home' && (
          <HomeTab
            currentWeek={currentWeek}
            onSelectWeek={setCurrentWeek}
            onNavigateTab={setCurrentTab}
            bpLogs={bpLogs}
            glucoseLogs={glucoseLogs}
            weightLogs={weightLogs}
            onOpenExport={() => setIsExportOpen(true)}
          />
        )}

        {currentTab === 'timeline' && (
          <TimelineTab currentWeek={currentWeek} onSelectWeek={setCurrentWeek} />
        )}

        {currentTab === 'guide' && <GuideTab />}

        {currentTab === 'tools' && (
          <ToolsTab
            bpLogs={bpLogs}
            onAddBP={handleAddBP}
            glucoseLogs={glucoseLogs}
            onAddGlucose={handleAddGlucose}
            weightLogs={weightLogs}
            onAddWeight={handleAddWeight}
            kickLogs={kickLogs}
            onSaveKickSession={handleSaveKickSession}
            contractionLogs={contractionLogs}
            onSaveContraction={handleSaveContraction}
            onClearContractions={handleClearContractions}
            onOpenExport={() => setIsExportOpen(true)}
          />
        )}

        {currentTab === 'baby' && (
          <BabyJournalTab
            checkedChecklistIds={checkedChecklistIds}
            onToggleChecklistItem={handleToggleChecklistItem}
            birthPlanAnswers={birthPlanAnswers}
            onSaveBirthPlanAnswer={handleSaveBirthPlanAnswer}
            babyLogs={babyLogs}
            onAddBabyLog={handleAddBabyLog}
            ultrasounds={ultrasounds}
            onAddUltrasound={handleAddUltrasound}
          />
        )}
      </main>

      {/* Export Health Logs Modal for Midwife */}
      <ExportHealthModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        bpLogs={bpLogs}
        glucoseLogs={glucoseLogs}
        weightLogs={weightLogs}
        currentWeek={currentWeek}
      />

      {/* Quiet Footer */}
      <footer className="border-t border-[#e5d9cb] dark:border-[#2f2620] py-6 text-xs text-[#7e6d5e] dark:text-[#9e8d7f] bg-[#f1ebe2]/80 dark:bg-[#201b17]/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#2d221a] dark:text-[#f8f1eb]">B&amp;F</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-[#7e6d5e] dark:text-[#a69688]">com.aistudio.grossesse.mbtxyz</span>
            <span aria-hidden="true">·</span>
            <span className="text-[#7e6d5e] dark:text-[#a69688]">Synchronisation Active (410bala@gmail.com)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
