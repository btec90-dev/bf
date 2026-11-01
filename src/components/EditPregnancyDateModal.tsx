import React, { useState } from 'react';
import { Calendar, X, Sparkles, Check, Info } from 'lucide-react';
import { PregnancyConfig, PregnancyMethod } from '../types';
import { calculatePregnancy } from '../utils/pregnancyCalculator';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  config: PregnancyConfig;
  onSave: (config: PregnancyConfig) => void;
}

export const EditPregnancyDateModal: React.FC<Props> = ({
  isOpen,
  onClose,
  config,
  onSave,
}) => {
  const [method, setMethod] = useState<PregnancyMethod>(config.method);
  const [date, setDate] = useState<string>(config.date);

  if (!isOpen) return null;

  // Live preview
  const preview = calculatePregnancy(method, date);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ method, date });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
      <div className="bg-[#FFFDF8] dark:bg-[#231d18] border border-[#e8dec8] dark:border-[#382d24] rounded-2xl sm:rounded-3xl max-w-md w-full p-4 sm:p-6 shadow-2xl space-y-4 sm:space-y-5 animate-scale-up my-auto max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#e8dec8] dark:border-[#382d24]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#F3ECE2] dark:bg-[#342921] flex items-center justify-center text-[#443126] dark:text-[#eedacb]">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#3B281E] dark:text-white">
                Modifier la Date de Grossesse
              </h3>
              <p className="text-xs text-[#7d6c5d] dark:text-[#a8988a]">
                Recalculez instantanément votre terme (SA)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#7d6c5d] hover:bg-[#F3ECE2] dark:hover:bg-[#342921] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Method Selection */}
          <div>
            <label className="text-[11px] font-semibold text-[#7d6c5d] uppercase block mb-1.5">
              Méthode de calcul
            </label>
            <div className="space-y-2">
              <label
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  method === 'dpa'
                    ? 'bg-[#F3ECE2] dark:bg-[#342921] border-[#443126] dark:border-[#eedacb] ring-1 ring-[#443126]/20'
                    : 'bg-white dark:bg-[#201a15] border-[#ebdcc9] dark:border-[#382d24]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <input
                    type="radio"
                    name="method"
                    value="dpa"
                    checked={method === 'dpa'}
                    onChange={() => setMethod('dpa')}
                    className="text-[#443126] focus:ring-[#443126]"
                  />
                  <div>
                    <span className="text-xs font-bold text-[#3B281E] dark:text-white block">
                      Date Prévue d'Accouchement (DPA)
                    </span>
                    <span className="text-[11px] text-[#7d6c5d] dark:text-[#a8988a]">
                      Date estimée par échographie ou gynécologue
                    </span>
                  </div>
                </div>
              </label>

              <label
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  method === 'ddr'
                    ? 'bg-[#F3ECE2] dark:bg-[#342921] border-[#443126] dark:border-[#eedacb] ring-1 ring-[#443126]/20'
                    : 'bg-white dark:bg-[#201a15] border-[#ebdcc9] dark:border-[#382d24]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <input
                    type="radio"
                    name="method"
                    value="ddr"
                    checked={method === 'ddr'}
                    onChange={() => setMethod('ddr')}
                    className="text-[#443126] focus:ring-[#443126]"
                  />
                  <div>
                    <span className="text-xs font-bold text-[#3B281E] dark:text-white block">
                      Date des Dernières Règles (DDR)
                    </span>
                    <span className="text-[11px] text-[#7d6c5d] dark:text-[#a8988a]">
                      Premier jour de votre dernier cycle naturel
                    </span>
                  </div>
                </div>
              </label>

              <label
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  method === 'conception'
                    ? 'bg-[#F3ECE2] dark:bg-[#342921] border-[#443126] dark:border-[#eedacb] ring-1 ring-[#443126]/20'
                    : 'bg-white dark:bg-[#201a15] border-[#ebdcc9] dark:border-[#382d24]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <input
                    type="radio"
                    name="method"
                    value="conception"
                    checked={method === 'conception'}
                    onChange={() => setMethod('conception')}
                    className="text-[#443126] focus:ring-[#443126]"
                  />
                  <div>
                    <span className="text-xs font-bold text-[#3B281E] dark:text-white block">
                      Conception / Transfert PMA (FIV/TEC)
                    </span>
                    <span className="text-[11px] text-[#7d6c5d] dark:text-[#a8988a]">
                      Date de fécondation ou de transfert d'embryon
                    </span>
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Date Picker Input */}
          <div>
            <label className="text-[11px] font-semibold text-[#7d6c5d] uppercase block mb-1">
              {method === 'dpa'
                ? 'Date d\'accouchement prévue'
                : method === 'ddr'
                ? 'Premier jour des dernières règles'
                : 'Date de transfert / conception'}
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-white dark:bg-[#201a15] border border-[#ebdcc9] dark:border-[#382d24] text-[#3B281E] dark:text-white focus:outline-none focus:border-[#443126]"
            />
          </div>

          {/* Live Preview Box */}
          <div className="p-4 rounded-2xl bg-[#FAF6EE] dark:bg-[#2c231c] border border-[#ebdcc9] dark:border-[#382d24] space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#443126] dark:text-[#eedacb]">
              <Sparkles className="w-4 h-4" />
              <span>Aperçu du calcul en temps réel</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-1">
              <div className="bg-white dark:bg-[#201a15] p-2.5 rounded-xl border border-[#ebdcc9] dark:border-[#3d3128]">
                <span className="text-[10px] text-[#7d6c5d] uppercase block">Terme actuel</span>
                <span className="text-sm font-bold font-mono text-[#3B281E] dark:text-white">
                  Semaine {preview.gestationalWeeks} SA
                </span>
                <span className="text-[10px] text-[#7d6c5d] block">
                  +{preview.gestationalDays}j (Mois {Math.min(9, Math.ceil(preview.gestationalWeeks / 4.5))})
                </span>
              </div>

              <div className="bg-white dark:bg-[#201a15] p-2.5 rounded-xl border border-[#ebdcc9] dark:border-[#3d3128]">
                <span className="text-[10px] text-[#7d6c5d] uppercase block">DPA recalculée</span>
                <span className="text-sm font-bold font-mono text-[#3B281E] dark:text-white">
                  {preview.dpaDate}
                </span>
                <span className="text-[10px] text-[#7d6c5d] block">
                  J - {preview.daysRemaining} jours restants
                </span>
              </div>
            </div>

            <p className="text-[11px] text-[#7d6c5d] dark:text-[#a8988a] pt-1">
              Conforme au protocole HAS (41 SA complètes = 287 jours). Toutes les semaines et jalons de l'app se mettront à jour immédiatement.
            </p>
          </div>

          {/* Footer buttons */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#e8dec8] dark:border-[#382d24]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#7d6c5d] hover:bg-[#F3ECE2] dark:hover:bg-[#342921] rounded-xl transition-colors cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-[#443126] hover:bg-[#3B281E] active:scale-95 rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Appliquer et synchroniser</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
