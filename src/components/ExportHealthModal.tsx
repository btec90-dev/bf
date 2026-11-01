import React, { useState } from 'react';
import { X, Download, FileSpreadsheet, FileJson, Copy, Check, Share2, Stethoscope, FileText } from 'lucide-react';
import { BloodPressureLog, GlucoseLog, WeightLog } from '../types';
import { analyzeBloodPressure, analyzeGlucose } from '../utils/clinicalEngine';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  bpLogs: BloodPressureLog[];
  glucoseLogs: GlucoseLog[];
  weightLogs: WeightLog[];
  currentWeek: number;
}

export const ExportHealthModal: React.FC<Props> = ({
  isOpen,
  onClose,
  bpLogs,
  glucoseLogs,
  weightLogs,
  currentWeek,
}) => {
  const [format, setFormat] = useState<'csv' | 'json'>('csv');
  const [includeBP, setIncludeBP] = useState(true);
  const [includeGlucose, setIncludeGlucose] = useState(true);
  const [includeWeight, setIncludeWeight] = useState(true);
  const [isCopied, setIsCopied] = useState(false);

  if (!isOpen) return null;

  const todayStr = new Date().toISOString().split('T')[0];

  // Generate CSV string with UTF-8 BOM for French Excel compatibility
  const generateCSV = (): string => {
    const lines: string[] = [];

    // Header info
    lines.push('RAPPORT DE SANTÉ MATERNELLE — B&F (MAMAN & BÉBÉ)');
    lines.push('Dossier patient;Personnel & Confidentiel (B&F)');
    lines.push(`Terme de la grossesse;${currentWeek} SA`);
    lines.push(`Date de l'export;${new Date().toLocaleDateString('fr-FR')} ${new Date().toLocaleTimeString('fr-FR')}`);
    lines.push('');

    // Blood Pressure section
    if (includeBP) {
      lines.push('--- RELEVÉS DE TENSION ARTÉRIELLE (ACOG) ---');
      lines.push('Date;Heure;Systolique (mmHg);Diastolique (mmHg);Pouls (bpm);Diagnostic ACOG;Recommandation;Notes');
      if (bpLogs.length === 0) {
        lines.push('Aucun relevé enregistré;;;;;;;');
      } else {
        bpLogs.forEach((log) => {
          const d = new Date(log.timestamp);
          const date = d.toLocaleDateString('fr-FR');
          const time = d.toLocaleTimeString('fr-FR');
          const analysis = analyzeBloodPressure(log.systolic, log.diastolic);
          const notes = (log.notes || '').replace(/;/g, ',');
          const cleanRec = analysis.recommendation.replace(/;/g, ',');
          lines.push(
            `${date};${time};${log.systolic};${log.diastolic};${log.pulse || '—'};${analysis.label};${cleanRec};${notes}`
          );
        });
      }
      lines.push('');
    }

    // Glucose section
    if (includeGlucose) {
      lines.push('--- RELEVÉS DE GLYCÉMIE & DIABÈTE GESTATIONNEL (HAS) ---');
      lines.push('Date;Heure;Contexte;Glycémie (mg/dL);Cible HAS;Interprétation;Notes');
      if (glucoseLogs.length === 0) {
        lines.push('Aucun relevé enregistré;;;;;;');
      } else {
        glucoseLogs.forEach((log) => {
          const d = new Date(log.timestamp);
          const date = d.toLocaleDateString('fr-FR');
          const time = d.toLocaleTimeString('fr-FR');
          const analysis = analyzeGlucose(log.value, log.context);
          const contextLabel =
            log.context === 'fasting'
              ? 'À jeun'
              : log.context === 'post1h'
              ? '1h post-prandial'
              : log.context === 'post2h'
              ? '2h post-prandial'
              : 'Aléatoire';
          const notes = (log.notes || '').replace(/;/g, ',');
          lines.push(
            `${date};${time};${contextLabel};${log.value};${analysis.targetLabel};${analysis.interpretation};${notes}`
          );
        });
      }
      lines.push('');
    }

    // Weight section
    if (includeWeight) {
      lines.push('--- SUIVI PONDÉRAL MATERNEL ---');
      lines.push('Date;Heure;Poids (kg);Notes');
      if (weightLogs.length === 0) {
        lines.push('Aucun relevé enregistré;;;');
      } else {
        weightLogs.forEach((log) => {
          const d = new Date(log.timestamp);
          const date = d.toLocaleDateString('fr-FR');
          const time = d.toLocaleTimeString('fr-FR');
          const notes = (log.notes || '').replace(/;/g, ',');
          lines.push(`${date};${time};${log.weight.toFixed(1)};${notes}`);
        });
      }
      lines.push('');
    }

    // Medical metadata footer
    lines.push('--- MENTIONS MÉDICALES ---');
    lines.push('Interprétations conformes aux référentiels ACOG, HAS et CRAT');
    lines.push('Document confidentiel édité par la patiente pour son suivi obstétrical');

    return '\uFEFF' + lines.join('\r\n');
  };

  // Generate structured JSON string
  const generateJSON = (): string => {
    const exportData = {
      exportMetadata: {
        application: 'B&F Carnet Obstétrical',
        appId: 'com.aistudio.grossesse.mbtxyz',
        patientAccount: 'Dossier Personnel & Confidentiel (B&F)',
        currentWeekAmenorrhea: currentWeek,
        generatedAt: new Date().toISOString(),
        standards: ['ACOG Guidelines', 'HAS Recommandations Prénatales', 'CRAT'],
      },
      bloodPressure: includeBP
        ? bpLogs.map((log) => ({
            ...log,
            clinicalAnalysis: analyzeBloodPressure(log.systolic, log.diastolic),
          }))
        : undefined,
      glucose: includeGlucose
        ? glucoseLogs.map((log) => ({
            ...log,
            clinicalAnalysis: analyzeGlucose(log.value, log.context),
          }))
        : undefined,
      weight: includeWeight ? weightLogs : undefined,
    };

    return JSON.stringify(exportData, null, 2);
  };

  const handleDownload = () => {
    let content: string;
    let mimeType: string;
    let extension: string;

    if (format === 'csv') {
      content = generateCSV();
      mimeType = 'text/csv;charset=utf-8;';
      extension = 'csv';
    } else {
      content = generateJSON();
      mimeType = 'application/json;charset=utf-8;';
      extension = 'json';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `releves-sante-maternite-${todayStr}.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopySummary = async () => {
    const summaryLines: string[] = [
      `Bonjour, voici mon récapitulatif de santé à ${currentWeek} SA :`,
      ``,
    ];

    if (includeBP && bpLogs.length > 0) {
      summaryLines.push(`• Tension récente : ${bpLogs[0].systolic}/${bpLogs[0].diastolic} mmHg`);
    }

    if (includeGlucose && glucoseLogs.length > 0) {
      summaryLines.push(`• Dernière glycémie : ${glucoseLogs[0].value} mg/dL (${glucoseLogs[0].context})`);
    }

    if (includeWeight && weightLogs.length > 0) {
      summaryLines.push(`• Poids actuel : ${weightLogs[0].weight.toFixed(1)} kg`);
    }

    summaryLines.push(``);
    summaryLines.push(`Transmis via B&F Espace Maternité.`);

    try {
      await navigator.clipboard.writeText(summaryLines.join('\n'));
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const totalRecords =
    (includeBP ? bpLogs.length : 0) +
    (includeGlucose ? glucoseLogs.length : 0) +
    (includeWeight ? weightLogs.length : 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white dark:bg-[#231d18] rounded-2xl shadow-2xl border border-[#ddcfc0] dark:border-[#382d24] p-4 sm:p-6 md:p-7 max-h-[92vh] overflow-y-auto my-auto">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#eee5da] dark:border-[#382d24]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#f4ece2] dark:bg-[#342921] text-[#784824] dark:text-[#eedacb] flex items-center justify-center shrink-0">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#2d221a] dark:text-white">
                Exporter mes Relevés de Santé
              </h2>
              <div className="flex items-center gap-2 text-xs text-[#7d6c5d] dark:text-[#a8988a] mt-0.5">
                <span>Partage direct avec votre sage-femme</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono">{currentWeek} SA</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            type="button"
            className="p-1.5 rounded-lg text-[#7d6c5d] hover:text-[#2d221a] dark:hover:text-white hover:bg-[#ede4d8] dark:hover:bg-[#342921] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Format Selector */}
        <div className="mt-5 space-y-4">
          <div>
            <label className="text-xs font-bold text-[#665444] dark:text-[#c4b5a6] uppercase tracking-wider block mb-2">
              1. Format de Fichier Souhaité
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormat('csv')}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  format === 'csv'
                    ? 'bg-[#faf6f0] dark:bg-[#2b221b] border-[#8a5732] ring-2 ring-[#8a5732]/20'
                    : 'bg-[#faf6f0] dark:bg-[#2b221b] border-[#ebdcc9] dark:border-[#3d3128] hover:border-[#bda58d]'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-sm text-[#2d221a] dark:text-white">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                  <span>Format CSV</span>
                </div>
                <p className="text-[11px] text-[#7d6c5d] dark:text-[#a8988a] mt-1">
                  Recommandé pour Excel, Numbers, tableurs et consultation médicale.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setFormat('json')}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  format === 'json'
                    ? 'bg-[#faf6f0] dark:bg-[#2b221b] border-[#8a5732] ring-2 ring-[#8a5732]/20'
                    : 'bg-[#faf6f0] dark:bg-[#2b221b] border-[#ebdcc9] dark:border-[#3d3128] hover:border-[#bda58d]'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-sm text-[#2d221a] dark:text-white">
                  <FileJson className="w-4 h-4 text-sky-700 dark:text-sky-400" />
                  <span>Format JSON</span>
                </div>
                <p className="text-[11px] text-[#7d6c5d] dark:text-[#a8988a] mt-1">
                  Sauvegarde brute structurée avec toutes les métadonnées cliniques.
                </p>
              </button>
            </div>
          </div>

          {/* Module Selection Checkboxes */}
          <div>
            <label className="text-xs font-bold text-[#665444] dark:text-[#c4b5a6] uppercase tracking-wider block mb-2">
              2. Données Médicales à Inclure
            </label>
            <div className="space-y-2">
              <label className="flex items-center justify-between p-3 rounded-xl bg-[#faf6f0] dark:bg-[#2b221b] border border-[#ebdcc9] dark:border-[#3d3128] text-xs cursor-pointer select-none">
                <div className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={includeBP}
                    onChange={(e) => setIncludeBP(e.target.checked)}
                    className="w-4 h-4 rounded text-[#8a5732] focus:ring-[#8a5732] accent-[#8a5732]"
                  />
                  <span className="font-semibold text-[#2d221a] dark:text-white">Tension Artérielle ACOG</span>
                </div>
                <span className="text-[11px] font-mono text-[#7d6c5d]">{bpLogs.length} mesure(s)</span>
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-[#faf6f0] dark:bg-[#2b221b] border border-[#ebdcc9] dark:border-[#3d3128] text-xs cursor-pointer select-none">
                <div className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={includeGlucose}
                    onChange={(e) => setIncludeGlucose(e.target.checked)}
                    className="w-4 h-4 rounded text-[#8a5732] focus:ring-[#8a5732] accent-[#8a5732]"
                  />
                  <span className="font-semibold text-[#2d221a] dark:text-white">Glycémie &amp; Diabète Gestationnel</span>
                </div>
                <span className="text-[11px] font-mono text-[#7d6c5d]">{glucoseLogs.length} relevé(s)</span>
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-[#faf6f0] dark:bg-[#2b221b] border border-[#ebdcc9] dark:border-[#3d3128] text-xs cursor-pointer select-none">
                <div className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={includeWeight}
                    onChange={(e) => setIncludeWeight(e.target.checked)}
                    className="w-4 h-4 rounded text-[#8a5732] focus:ring-[#8a5732] accent-[#8a5732]"
                  />
                  <span className="font-semibold text-[#2d221a] dark:text-white">Pesées &amp; Suivi Pondéral</span>
                </div>
                <span className="text-[11px] font-mono text-[#7d6c5d]">{weightLogs.length} pesée(s)</span>
              </label>
            </div>
          </div>

          {/* Quick Summary Preview Box */}
          <div className="p-3.5 rounded-xl bg-[#faf6f0] dark:bg-[#2b221b] border border-[#ebdcc9] dark:border-[#3d3128] text-xs space-y-1.5">
            <div className="flex items-center justify-between font-bold text-[#6d4021] dark:text-[#eedacb]">
              <span className="flex items-center gap-1.5">
                <Stethoscope className="w-3.5 h-3.5 text-[#8a5732]" />
                <span>Résumé Clinique Prêt pour la Consultation</span>
              </span>
              <span className="font-mono text-[11px]">{totalRecords} enregistrements</span>
            </div>
            <p className="text-[#5c4c3e] dark:text-[#c4b5a6] text-[11px] leading-relaxed">
              Le fichier généré comprend les valeurs chiffrées exactes, les horodatages et les diagnostics d'interprétation selon les grilles ACOG et HAS.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 pt-4 border-t border-[#eee5da] dark:border-[#382d24] flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleCopySummary}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#ede4d8] dark:bg-[#2b221b] hover:bg-[#e4d6c6] text-[#2d221a] dark:text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{isCopied ? 'Copié dans le presse-papier !' : 'Copier texte pour email/SMS'}</span>
          </button>

          <div className="w-full sm:w-auto flex items-center gap-2">
            <button
              onClick={onClose}
              type="button"
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-medium text-[#7d6c5d] hover:bg-[#ede4d8] dark:hover:bg-[#2b221b] transition-colors cursor-pointer"
            >
              Annuler
            </button>
            <button
              onClick={handleDownload}
              type="button"
              disabled={totalRecords === 0}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#8a5732] hover:bg-[#744421] active:bg-[#603518] disabled:opacity-50 text-white font-bold text-xs shadow-sm transition-all cursor-pointer whitespace-nowrap"
            >
              <Download className="w-4 h-4" />
              <span>Télécharger ({format.toUpperCase()})</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
