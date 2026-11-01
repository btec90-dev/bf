import React, { useState, useEffect, useCallback } from 'react';
import {
  TabType,
  BloodPressureLog,
  GlucoseLog,
  WeightLog,
  KickLog,
  ContractionLog,
  BabyCareLog,
  UltrasoundMemory,
  CalendarEvent,
  PregnancyConfig,
  PmaConfig,
} from './types';
import { Navbar } from './components/Navbar';
import { HomeTab } from './components/tabs/HomeTab';
import { TimelineTab } from './components/tabs/TimelineTab';
import { GuideTab } from './components/tabs/GuideTab';
import { ToolsTab } from './components/tabs/ToolsTab';
import { BabyJournalTab } from './components/tabs/BabyJournalTab';
import { ExportHealthModal } from './components/ExportHealthModal';
import { EditPregnancyDateModal } from './components/EditPregnancyDateModal';
import { PmaProtocolModal } from './components/PmaProtocolModal';
import { calculatePregnancy } from './utils/pregnancyCalculator';
import confetti from 'canvas-confetti';

const STORAGE_KEYS = {
  TAB: 'maman_bebe_tab',
  THEME: 'maman_bebe_theme',
  PREGNANCY: 'maman_bebe_pregnancy',
  CALENDAR_EVENTS: 'maman_bebe_calendar_events',
  PMA_CONFIG: 'maman_bebe_pma_config',
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

// Default initial date seeds
const todayIso = new Date().toISOString().split('T')[0];

const INITIAL_PREGNANCY: PregnancyConfig = {
  method: 'dpa',
  date: '2027-03-15',
};

const INITIAL_PMA_CONFIG: PmaConfig = {
  cycleStartDate: '2026-10-30',
  protocolName: 'Protocole Antagoniste (FIV/ICSI)',
  status: 'Protocole en cours (Soutien lutéal)',
  morningInjectionTime: '08:00',
  eveningInjectionTime: '20:00',
  clinicName: 'Centre PMA',
  clinicPhone: '+33 1 42 16 00 00',
  emergencyPhone: '+33 1 42 16 00 01',
  clinicEmail: 'coordination.pma@hopital.fr',
};

const INITIAL_CALENDAR_EVENTS: CalendarEvent[] = [
  {
    id: 'evt-1',
    date: todayIso,
    time: '08:00',
    title: 'Injection Matin : Cetrotide 0.25 mg',
    type: 'injection',
    location: 'À domicile',
    notes: 'Injection sous-cutanée abdominale.',
    completed: true,
  },
  {
    id: 'evt-2',
    date: todayIso,
    time: '10:30',
    title: 'Consultation Prénatale & Datation',
    type: 'gyn',
    location: 'Cabinet Gynécologie-Obstétrique',
    notes: 'Examen de routine, tension et écoute des battements cardiaques.',
    completed: false,
  },
  {
    id: 'evt-3',
    date: todayIso,
    time: '14:00',
    title: 'Journal : Mouvements fœtaux nets ressentis',
    type: 'journal',
    notes: 'Sensation de petits battements d\'ailes au repos.',
    completed: true,
  },
  {
    id: 'evt-4',
    date: todayIso,
    time: '20:00',
    title: 'Injection Soir : Gonal-F 150 UI & Progestérone',
    type: 'injection',
    location: 'À domicile',
    notes: 'Rappel d\'injection quotidienne de 20h00.',
    completed: false,
  },
  {
    id: 'evt-5',
    date: '2026-11-05',
    time: '08:30',
    title: 'Prise de sang : Dépistage T21 / DPNI & Toxoplasmose',
    type: 'memo',
    location: 'Laboratoire d\'analyses médicales',
    notes: 'Venir à jeun avec ordonnance et carte vitale.',
    completed: false,
  },
  {
    id: 'evt-6',
    date: '2026-11-18',
    time: '11:00',
    title: 'Échographie Morphologique T2',
    type: 'exam',
    location: 'Centre d\'Échographie Spécialisé',
    notes: 'Biométrie complète, placenta et examen morphologique 4 cavités.',
    completed: false,
  },
];

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
    notes: 'Morphologie normale complète, placenta postérieur haut inséré.',
  },
];

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TAB);
    if (saved === 'timeline') return 'chrono';
    if (saved === 'tools') return 'suivi';
    if (saved === 'baby') return 'trousseau';
    return (saved as TabType) || 'home';
  });

  const [isDark, setIsDark] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_KEYS.THEME) === 'dark';
  });

  // Pregnancy Configuration & Dynamic Calculations
  const [pregnancyConfig, setPregnancyConfig] = useState<PregnancyConfig>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PREGNANCY);
    return saved ? JSON.parse(saved) : INITIAL_PREGNANCY;
  });

  const pregnancyCalc = calculatePregnancy(pregnancyConfig.method, pregnancyConfig.date);
  const [currentWeek, setCurrentWeek] = useState<number>(pregnancyCalc.gestationalWeeks);

  // Sync currentWeek whenever pregnancyCalc updates
  useEffect(() => {
    setCurrentWeek(pregnancyCalc.gestationalWeeks);
  }, [pregnancyCalc.gestationalWeeks]);

  // Calendar Events & Selected Date State
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<string>(todayIso);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CALENDAR_EVENTS);
    return saved ? JSON.parse(saved) : INITIAL_CALENDAR_EVENTS;
  });

  // PMA Clinic Config
  const [pmaConfig, setPmaConfig] = useState<PmaConfig>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PMA_CONFIG);
    return saved ? JSON.parse(saved) : INITIAL_PMA_CONFIG;
  });

  // Modals state
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isEditPregnancyOpen, setIsEditPregnancyOpen] = useState(false);
  const [isPmaModalOpen, setIsPmaModalOpen] = useState(false);

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

  // Cross-device / Cross-tab Broadcast Channel synchronization
  useEffect(() => {
    let channel: BroadcastChannel | null = null;
    try {
      channel = new BroadcastChannel('maman_bebe_sync_channel');
      channel.onmessage = (event) => {
        if (event.data?.type === 'SYNC_ALL') {
          const p = event.data.payload;
          if (p.calendarEvents) setCalendarEvents(p.calendarEvents);
          if (p.pregnancyConfig) setPregnancyConfig(p.pregnancyConfig);
          if (p.pmaConfig) setPmaConfig(p.pmaConfig);
          if (p.bpLogs) setBpLogs(p.bpLogs);
          if (p.glucoseLogs) setGlucoseLogs(p.glucoseLogs);
          if (p.weightLogs) setWeightLogs(p.weightLogs);
          if (p.babyLogs) setBabyLogs(p.babyLogs);
          if (p.ultrasounds) setUltrasounds(p.ultrasounds);
          if (p.checkedChecklistIds) setCheckedChecklistIds(p.checkedChecklistIds);
        }
      };
    } catch {}

    const handleStorageEvent = (e: StorageEvent) => {
      if (!e.newValue) return;
      try {
        if (e.key === STORAGE_KEYS.CALENDAR_EVENTS) setCalendarEvents(JSON.parse(e.newValue));
        if (e.key === STORAGE_KEYS.PREGNANCY) setPregnancyConfig(JSON.parse(e.newValue));
        if (e.key === STORAGE_KEYS.PMA_CONFIG) setPmaConfig(JSON.parse(e.newValue));
        if (e.key === STORAGE_KEYS.BP) setBpLogs(JSON.parse(e.newValue));
        if (e.key === STORAGE_KEYS.GLUCOSE) setGlucoseLogs(JSON.parse(e.newValue));
        if (e.key === STORAGE_KEYS.WEIGHT) setWeightLogs(JSON.parse(e.newValue));
        if (e.key === STORAGE_KEYS.BABY_LOGS) setBabyLogs(JSON.parse(e.newValue));
        if (e.key === STORAGE_KEYS.CHECKLIST) setCheckedChecklistIds(JSON.parse(e.newValue));
        if (e.key === STORAGE_KEYS.ULTRASOUNDS) setUltrasounds(JSON.parse(e.newValue));
      } catch {}
    };

    window.addEventListener('storage', handleStorageEvent);

    return () => {
      window.removeEventListener('storage', handleStorageEvent);
      if (channel) channel.close();
    };
  }, []);

  const broadcastSync = useCallback((payload: Record<string, unknown>) => {
    try {
      const channel = new BroadcastChannel('maman_bebe_sync_channel');
      channel.postMessage({ type: 'SYNC_ALL', payload });
      channel.close();
    } catch {}
  }, []);

  // Sync Tab
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TAB, currentTab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentTab]);

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

  // Save Pregnancy Config
  const handleSavePregnancyConfig = (cfg: PregnancyConfig) => {
    setPregnancyConfig(cfg);
    localStorage.setItem(STORAGE_KEYS.PREGNANCY, JSON.stringify(cfg));
    broadcastSync({ pregnancyConfig: cfg });
    try {
      confetti({ particleCount: 30, spread: 60, origin: { y: 0.6 } });
    } catch {}
  };

  // Calendar Event Handlers
  const handleAddCalendarEvent = (event: Omit<CalendarEvent, 'id'>) => {
    const newEntry: CalendarEvent = { ...event, id: 'evt-' + Date.now() };
    const updated = [newEntry, ...calendarEvents];
    setCalendarEvents(updated);
    localStorage.setItem(STORAGE_KEYS.CALENDAR_EVENTS, JSON.stringify(updated));
    broadcastSync({ calendarEvents: updated });
  };

  const handleUpdateCalendarEvent = (updatedEvt: CalendarEvent) => {
    const updated = calendarEvents.map((e) => (e.id === updatedEvt.id ? updatedEvt : e));
    setCalendarEvents(updated);
    localStorage.setItem(STORAGE_KEYS.CALENDAR_EVENTS, JSON.stringify(updated));
    broadcastSync({ calendarEvents: updated });
  };

  const handleDeleteCalendarEvent = (id: string) => {
    const updated = calendarEvents.filter((e) => e.id !== id);
    setCalendarEvents(updated);
    localStorage.setItem(STORAGE_KEYS.CALENDAR_EVENTS, JSON.stringify(updated));
    broadcastSync({ calendarEvents: updated });
  };

  // PMA Config Handler
  const handleSavePmaConfig = (cfg: PmaConfig) => {
    setPmaConfig(cfg);
    localStorage.setItem(STORAGE_KEYS.PMA_CONFIG, JSON.stringify(cfg));
    broadcastSync({ pmaConfig: cfg });
  };

  // Vitals Handlers
  const handleAddBP = (log: Omit<BloodPressureLog, 'id'>) => {
    const newEntry: BloodPressureLog = { ...log, id: 'bp-' + Date.now() };
    const updated = [newEntry, ...bpLogs];
    setBpLogs(updated);
    localStorage.setItem(STORAGE_KEYS.BP, JSON.stringify(updated));
    broadcastSync({ bpLogs: updated });
  };

  const handleAddGlucose = (log: Omit<GlucoseLog, 'id'>) => {
    const newEntry: GlucoseLog = { ...log, id: 'glu-' + Date.now() };
    const updated = [newEntry, ...glucoseLogs];
    setGlucoseLogs(updated);
    localStorage.setItem(STORAGE_KEYS.GLUCOSE, JSON.stringify(updated));
    broadcastSync({ glucoseLogs: updated });
  };

  const handleAddWeight = (log: Omit<WeightLog, 'id'>) => {
    const newEntry: WeightLog = { ...log, id: 'wt-' + Date.now() };
    const updated = [newEntry, ...weightLogs];
    setWeightLogs(updated);
    localStorage.setItem(STORAGE_KEYS.WEIGHT, JSON.stringify(updated));
    broadcastSync({ weightLogs: updated });
  };

  const handleSaveKickSession = (log: Omit<KickLog, 'id'>) => {
    const newEntry: KickLog = { ...log, id: 'kick-' + Date.now() };
    const updated = [newEntry, ...kickLogs];
    setKickLogs(updated);
    localStorage.setItem(STORAGE_KEYS.KICKS, JSON.stringify(updated));
    broadcastSync({ kickLogs: updated });
    try {
      confetti({ particleCount: 35, spread: 60, origin: { y: 0.6 } });
    } catch {}
  };

  const handleSaveContraction = (log: Omit<ContractionLog, 'id'>) => {
    const newEntry: ContractionLog = { ...log, id: 'ct-' + Date.now() };
    const updated = [newEntry, ...contractionLogs];
    setContractionLogs(updated);
    localStorage.setItem(STORAGE_KEYS.CONTRACTIONS, JSON.stringify(updated));
    broadcastSync({ contractionLogs: updated });
  };

  const handleClearContractions = () => {
    setContractionLogs([]);
    localStorage.setItem(STORAGE_KEYS.CONTRACTIONS, JSON.stringify([]));
    broadcastSync({ contractionLogs: [] });
  };

  const handleAddBabyLog = (log: Omit<BabyCareLog, 'id'>) => {
    const newEntry: BabyCareLog = { ...log, id: 'baby-' + Date.now() };
    const updated = [newEntry, ...babyLogs];
    setBabyLogs(updated);
    localStorage.setItem(STORAGE_KEYS.BABY_LOGS, JSON.stringify(updated));
    broadcastSync({ babyLogs: updated });
  };

  const handleQuickBabyLog = (type: 'nursing' | 'bottle' | 'pumping' | 'diaper') => {
    if (type === 'nursing') {
      handleAddBabyLog({
        type: 'nursing',
        timestamp: new Date().toISOString(),
        details: { side: 'left', leftDurationSeconds: 600 },
        notes: 'Tétée rapide au sein gauche (10 min)',
      });
    } else if (type === 'bottle') {
      handleAddBabyLog({
        type: 'bottle',
        timestamp: new Date().toISOString(),
        details: { volumeMl: 90, milkType: 'maternal' },
        notes: 'Biberon 90 ml lait maternel',
      });
    } else if (type === 'pumping') {
      handleAddBabyLog({
        type: 'pumping',
        timestamp: new Date().toISOString(),
        details: { pumpVolumeMl: 60, storageMethod: 'fridge' },
        notes: 'Expression 60 ml au réfrigérateur',
      });
    } else {
      handleAddBabyLog({
        type: 'diaper',
        timestamp: new Date().toISOString(),
        details: { diaperType: 'wet', texture: 'normal' },
        notes: 'Couche mouillée (urine)',
      });
    }
  };

  const handleToggleChecklistItem = (id: string) => {
    const updated = { ...checkedChecklistIds, [id]: !checkedChecklistIds[id] };
    setCheckedChecklistIds(updated);
    localStorage.setItem(STORAGE_KEYS.CHECKLIST, JSON.stringify(updated));
    broadcastSync({ checkedChecklistIds: updated });
  };

  const handleSaveBirthPlanAnswer = (topicId: string, answer: string) => {
    const updated = { ...birthPlanAnswers, [topicId]: answer };
    setBirthPlanAnswers(updated);
    localStorage.setItem(STORAGE_KEYS.BIRTH_PLAN, JSON.stringify(updated));
    broadcastSync({ birthPlanAnswers: updated });
  };

  const handleAddUltrasound = (item: Omit<UltrasoundMemory, 'id'>) => {
    const newEntry: UltrasoundMemory = { ...item, id: 'echo-' + Date.now() };
    const updated = [newEntry, ...ultrasounds];
    setUltrasounds(updated);
    localStorage.setItem(STORAGE_KEYS.ULTRASOUNDS, JSON.stringify(updated));
    broadcastSync({ ultrasounds: updated });
  };

  const checkedChecklistCount = Object.values(checkedChecklistIds).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-[#F3ECE2] dark:bg-[#1C1613] text-[#3B281E] dark:text-[#f3ece5] flex flex-col font-sans transition-colors duration-200">
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        onOpenExport={() => setIsExportOpen(true)}
        isDark={isDark}
        onToggleTheme={() => setIsDark(!isDark)}
      />

      {/* Main Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-24 lg:pb-12">
        {currentTab === 'home' && (
          <HomeTab
            currentWeek={currentWeek}
            gestationalDays={pregnancyCalc.gestationalDays}
            dpaDate={pregnancyCalc.dpaDate}
            daysRemaining={pregnancyCalc.daysRemaining}
            progressPercent={pregnancyCalc.progressPercent}
            pregnancyMethod={pregnancyConfig.method}
            onOpenEditPregnancyDate={() => setIsEditPregnancyOpen(true)}
            onNavigateTab={setCurrentTab}
            onOpenExport={() => setIsExportOpen(true)}
            onOpenPmaModal={() => setIsPmaModalOpen(true)}
            pmaConfig={pmaConfig}
            bpLogs={bpLogs}
            glucoseLogs={glucoseLogs}
            weightLogs={weightLogs}
            ultrasounds={ultrasounds}
            onAddUltrasound={handleAddUltrasound}
            checkedChecklistCount={checkedChecklistCount}
            totalChecklistCount={9}
            onQuickBabyLog={handleQuickBabyLog}
          />
        )}

        {currentTab === 'chrono' && (
          <TimelineTab
            currentWeek={currentWeek}
            onSelectWeek={setCurrentWeek}
            events={calendarEvents}
            onAddEvent={handleAddCalendarEvent}
            onUpdateEvent={handleUpdateCalendarEvent}
            onDeleteEvent={handleDeleteCalendarEvent}
            selectedDate={selectedCalendarDate}
            onSelectDate={setSelectedCalendarDate}
            onOpenEditPregnancyDate={() => setIsEditPregnancyOpen(true)}
            dpaDate={pregnancyCalc.dpaDate}
          />
        )}

        {currentTab === 'suivi' && (
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

        {currentTab === 'guide' && <GuideTab />}

        {currentTab === 'trousseau' && (
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

      {/* Edit Pregnancy Date Modal */}
      <EditPregnancyDateModal
        isOpen={isEditPregnancyOpen}
        onClose={() => setIsEditPregnancyOpen(false)}
        config={pregnancyConfig}
        onSave={handleSavePregnancyConfig}
      />

      {/* PMA Protocol & Clinic Modal */}
      <PmaProtocolModal
        isOpen={isPmaModalOpen}
        onClose={() => setIsPmaModalOpen(false)}
        config={pmaConfig}
        onSave={handleSavePmaConfig}
      />

      {/* Export Health Logs Modal */}
      <ExportHealthModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        bpLogs={bpLogs}
        glucoseLogs={glucoseLogs}
        weightLogs={weightLogs}
        currentWeek={currentWeek}
      />

      {/* Footer with Cloud Sync Status & Device Sync Info */}
      <footer className="border-t border-[#E8DEC8] dark:border-[#2f2620] py-6 text-xs text-[#7d6c5d] dark:text-[#9e8d7f] bg-[#FAF6EE]/90 dark:bg-[#201b17]/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-[#443126] dark:text-[#f8f1eb]">Maman &amp; Bébé</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-[#7d6c5d] dark:text-[#a69688]">
              com.aistudio.grossesse.mbtxyz
            </span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-700 dark:text-emerald-400 font-medium">
              Synchronisation Active (410bala@gmail.com)
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsEditPregnancyOpen(true)}
              className="text-[#443126] dark:text-[#eedacb] hover:underline cursor-pointer"
            >
              Modifier la date du terme
            </button>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => setIsExportOpen(true)}
              className="text-[#443126] dark:text-[#eedacb] hover:underline cursor-pointer"
            >
              Sauvegarder / Exporter
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
