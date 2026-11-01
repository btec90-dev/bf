/**
 * Utility to calculate gestational age, DPA, DDR, and progress
 * based on clinical formulas (HAS / CNGOF: 41 SA = 287 days from DDR, or 273 days from conception).
 */

export interface PregnancyCalculation {
  gestationalWeeks: number; // SA (e.g. 8)
  gestationalDays: number; // 0 to 6
  dpaDate: string; // YYYY-MM-DD
  ddrDate: string; // YYYY-MM-DD
  conceptionDate: string; // YYYY-MM-DD
  daysRemaining: number;
  daysPassed: number;
  progressPercent: number;
  trimester: 1 | 2 | 3;
}

const TOTAL_PREGNANCY_DAYS = 287; // 41 SA

export function formatDateToIso(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseIsoDate(str: string): Date {
  const parts = str.split('-');
  if (parts.length === 3) {
    return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]), 12, 0, 0);
  }
  return new Date();
}

export function calculatePregnancy(
  method: 'dpa' | 'ddr' | 'conception',
  dateStr: string,
  referenceDate: Date = new Date()
): PregnancyCalculation {
  const inputDate = parseIsoDate(dateStr);
  let ddr: Date;
  let dpa: Date;
  let conception: Date;

  if (method === 'dpa') {
    dpa = new Date(inputDate.getTime());
    ddr = new Date(dpa.getTime() - TOTAL_PREGNANCY_DAYS * 86400000);
    conception = new Date(dpa.getTime() - 273 * 86400000);
  } else if (method === 'conception') {
    conception = new Date(inputDate.getTime());
    ddr = new Date(conception.getTime() - 14 * 86400000);
    dpa = new Date(conception.getTime() + 273 * 86400000);
  } else {
    // ddr
    ddr = new Date(inputDate.getTime());
    conception = new Date(ddr.getTime() + 14 * 86400000);
    dpa = new Date(ddr.getTime() + TOTAL_PREGNANCY_DAYS * 86400000);
  }

  const today = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), referenceDate.getDate(), 12, 0, 0);
  const diffMs = today.getTime() - ddr.getTime();
  const diffDays = Math.max(0, Math.floor(diffMs / 86400000));

  const rawWeeks = Math.floor(diffDays / 7);
  const gestationalWeeks = Math.min(41, Math.max(1, rawWeeks + 1)); // SA starts at 1
  const gestationalDays = diffDays % 7;

  const remainingMs = dpa.getTime() - today.getTime();
  const daysRemaining = Math.max(0, Math.ceil(remainingMs / 86400000));
  const daysPassed = Math.min(TOTAL_PREGNANCY_DAYS, diffDays);
  const progressPercent = Math.min(100, Math.max(1, Math.round((daysPassed / TOTAL_PREGNANCY_DAYS) * 100)));

  let trimester: 1 | 2 | 3 = 1;
  if (gestationalWeeks >= 14 && gestationalWeeks <= 26) {
    trimester = 2;
  } else if (gestationalWeeks >= 27) {
    trimester = 3;
  }

  return {
    gestationalWeeks,
    gestationalDays,
    dpaDate: formatDateToIso(dpa),
    ddrDate: formatDateToIso(ddr),
    conceptionDate: formatDateToIso(conception),
    daysRemaining,
    daysPassed,
    progressPercent,
    trimester,
  };
}
