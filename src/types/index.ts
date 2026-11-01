export type TabType = 'home' | 'chrono' | 'suivi' | 'guide' | 'trousseau';

export type CalendarEventType = 'gyn' | 'injection' | 'memo' | 'journal' | 'exam';

export interface CalendarEvent {
  id: string;
  date: string; // YYYY-MM-DD
  time?: string; // HH:mm
  title: string;
  type: CalendarEventType;
  notes?: string;
  completed?: boolean;
  location?: string;
}

export type PregnancyMethod = 'dpa' | 'ddr' | 'conception';

export interface PregnancyConfig {
  method: PregnancyMethod;
  date: string; // YYYY-MM-DD
}

export interface PmaConfig {
  cycleStartDate: string; // YYYY-MM-DD
  protocolName: string;
  status: string;
  morningInjectionTime: string;
  eveningInjectionTime: string;
  clinicName: string;
  clinicPhone: string;
  emergencyPhone: string;
  clinicEmail: string;
}

export type MedicationSafetyStatus = 'safe' | 'unsafe' | 'caution';

export interface TimelineWeek {
  week: number; // SA
  trimester: 1 | 2 | 3;
  sizeComparison: string;
  approxSize: string;
  fetalDevelopment: string;
  maternalChanges: string;
  medicalMilestone: string;
}

export interface ObstetricMilestone {
  period: string; // e.g. "Semaines 8 à 10"
  title: string;
  location: string;
  description: string;
  keyExams: string[];
}

export interface MedicationItem {
  id: string;
  name: string;
  status: MedicationSafetyStatus;
  fdaCategory: string;
  clinicalSummary: string;
  fetalRisks: string;
  safeAlternatives: string;
}

export interface GlossaryItem {
  term: string;
  definition: string;
}

export interface ChecklistItem {
  id: string;
  label: string;
  quantity: string;
  isEssential: boolean;
  note: string;
  category: 'baby' | 'mom';
}

export interface BloodPressureLog {
  id: string;
  systolic: number;
  diastolic: number;
  pulse?: number;
  timestamp: string;
  notes?: string;
}

export type GlucoseContext = 'fasting' | 'post1h' | 'post2h' | 'random';

export interface GlucoseLog {
  id: string;
  value: number; // mg/dL
  context: GlucoseContext;
  timestamp: string;
  notes?: string;
}

export interface WeightLog {
  id: string;
  weight: number; // kg
  timestamp: string;
  notes?: string;
}

export interface KickLog {
  id: string;
  timestamp: string;
  durationSeconds: number;
  kickCount: number;
  completed: boolean;
}

export interface ContractionLog {
  id: string;
  startTime: string;
  durationSeconds: number;
  intervalSeconds?: number;
}

export interface BabyCareLog {
  id: string;
  type: 'nursing' | 'bottle' | 'pumping' | 'diaper' | 'sleep';
  timestamp: string;
  details: {
    // Nursing
    side?: 'left' | 'right' | 'both';
    leftDurationSeconds?: number;
    rightDurationSeconds?: number;
    // Bottle
    volumeMl?: number;
    milkType?: 'maternal' | 'formula';
    // Pumping
    pumpSide?: 'left' | 'right' | 'both';
    pumpVolumeMl?: number;
    storageMethod?: 'fridge' | 'freezer';
    // Diaper
    diaperType?: 'wet' | 'dirty' | 'mixed';
    texture?: 'golden' | 'grainy' | 'meconium' | 'normal';
    // Sleep
    sleepDurationMinutes?: number;
    sleepEndTime?: string;
  };
  notes?: string;
}

export interface UltrasoundMemory {
  id: string;
  title: string;
  week: number;
  date: string;
  imageUrl?: string;
  biparietalDiameter?: string;
  femurLength?: string;
  estimatedWeight?: string;
  notes: string;
}

export interface BirthPlanAnswer {
  questionId: string;
  selectedOption: string;
  personalNote?: string;
}
