import { GlucoseContext } from '../types';

export interface BPAnalysis {
  category: 'optimal' | 'elevated' | 'stage1' | 'stage2' | 'severe';
  label: string;
  isUrgent: boolean;
  recommendation: string;
  colorClass: string;
  badgeBg: string;
}

export function analyzeBloodPressure(systolic: number, diastolic: number): BPAnalysis {
  if (systolic >= 160 || diastolic >= 110) {
    return {
      category: 'severe',
      label: 'Alerte Critique (Hypertension Sévère / Urgence Pré-éclampsie)',
      isUrgent: true,
      recommendation: 'Urgence Maternité immédiate (appeler le 15 ou se rendre directement aux urgences obstétricales).',
      colorClass: 'text-rose-600 dark:text-rose-400',
      badgeBg: 'bg-rose-100 dark:bg-rose-950/60 border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-200',
    };
  }

  if ((systolic >= 140 && systolic <= 159) || (diastolic >= 90 && diastolic <= 109)) {
    return {
      category: 'stage2',
      label: 'Hypertension Gestationnelle (Stade 2)',
      isUrgent: false,
      recommendation: 'Repos 15 min au calme, renouveler la mesure. Si la valeur persiste, contacter rapidement votre sage-femme ou gynécologue.',
      colorClass: 'text-amber-600 dark:text-amber-400',
      badgeBg: 'bg-amber-100 dark:bg-amber-950/60 border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-200',
    };
  }

  if ((systolic >= 130 && systolic <= 139) || (diastolic >= 80 && diastolic <= 89)) {
    return {
      category: 'stage1',
      label: 'Hypertension Stade 1',
      isUrgent: false,
      recommendation: 'Surveillance rapprochée. Vérifier l\'absence d\'œdèmes soudains, de troubles visuels ou de maux de tête.',
      colorClass: 'text-amber-600 dark:text-amber-400',
      badgeBg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900 text-amber-700 dark:text-amber-300',
    };
  }

  if (systolic >= 120 && systolic <= 129 && diastolic < 80) {
    return {
      category: 'elevated',
      label: 'Tension Élevée (Pré-hypertension)',
      isUrgent: false,
      recommendation: 'Bien s\'hydrater et se reposer allongée sur le côté gauche (décubitus latéral gauche pour favoriser la perfusion utérine).',
      colorClass: 'text-blue-600 dark:text-blue-400',
      badgeBg: 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300',
    };
  }

  return {
    category: 'optimal',
    label: 'Tension Optimale',
    isUrgent: false,
    recommendation: 'Excellente perfusion placentaire et sécurité maternelle.',
    colorClass: 'text-emerald-600 dark:text-emerald-400',
    badgeBg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300',
  };
}

export interface GlucoseAnalysis {
  status: 'hypo' | 'target' | 'elevated' | 'marked';
  targetLabel: string;
  interpretation: string;
  recommendation: string;
  isUrgent: boolean;
  colorClass: string;
}

export function analyzeGlucose(value: number, context: GlucoseContext): GlucoseAnalysis {
  if (value < 60) {
    return {
      status: 'hypo',
      targetLabel: '< 60 mg/dL',
      interpretation: 'Hypoglycémie',
      recommendation: 'Consommer immédiatement 15g de sucre rapide (demi-verre de jus de fruit, 3 morceaux de sucre) et re-mesurer après 15 min.',
      isUrgent: true,
      colorClass: 'text-rose-600 dark:text-rose-400',
    };
  }

  let target = 95;
  if (context === 'fasting') target = 95;
  else if (context === 'post1h') target = 140;
  else if (context === 'post2h') target = 120;
  else target = 140;

  if (value <= target) {
    return {
      status: 'target',
      targetLabel: `Objectif ≤ ${target} mg/dL`,
      interpretation: 'Dans la cible optimale',
      recommendation: 'Excellente régulation glycémique fœto-maternelle.',
      isUrgent: false,
      colorClass: 'text-emerald-600 dark:text-emerald-400',
    };
  }

  if (value > target + 40) {
    return {
      status: 'marked',
      targetLabel: `Cible: ≤ ${target} mg/dL (actuel: +${value - target})`,
      interpretation: 'Hyperglycémie Marquée',
      recommendation: 'Dépassement de plus de 40 mg/dL au-delà de la cible. Noter le repas et contacter votre diabétologue ou équipe de suivi.',
      isUrgent: false,
      colorClass: 'text-rose-600 dark:text-rose-400',
    };
  }

  return {
    status: 'elevated',
    targetLabel: `Cible: ≤ ${target} mg/dL`,
    interpretation: 'Légèrement au-dessus de la cible',
    recommendation: 'Ajuster les glucides lents du repas, privilégier une marche de 15 minutes post-repas et surveiller.',
    isUrgent: false,
    colorClass: 'text-amber-600 dark:text-amber-400',
  };
}

export function analyzeWeightGain(logs: { weight: number; timestamp: string }[]): {
  hasAlert: boolean;
  alertMessage?: string;
  recentGain?: number;
} {
  if (logs.length < 2) return { hasAlert: false };

  const sorted = [...logs].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  const latest = sorted[0];

  // Look for any log within the last 8 days
  const now = new Date(latest.timestamp).getTime();
  const eightDaysAgo = now - 8 * 24 * 60 * 60 * 1000;

  const compareLog = sorted.find((l, idx) => {
    if (idx === 0) return false;
    const time = new Date(l.timestamp).getTime();
    return time >= eightDaysAgo;
  });

  if (compareLog) {
    const diff = latest.weight - compareLog.weight;
    if (diff >= 1.5) {
      return {
        hasAlert: true,
        recentGain: diff,
        alertMessage: 'Alerte Rétention d\'Eau Aiguë : Prise de poids de +' + diff.toFixed(1) + ' kg en moins de 8 jours. Signe d\'appel possible de rétention hydrique liée à une pré-éclampsie ; contrôlez immédiatement votre tension artérielle.',
      };
    }
  }

  return { hasAlert: false };
}
