import React, { useState } from 'react';
import {
  X,
  Syringe,
  Phone,
  Mail,
  Calendar,
  Clock,
  AlertTriangle,
  Save,
  Check,
} from 'lucide-react';
import { PmaConfig } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  config: PmaConfig;
  onSave: (config: PmaConfig) => void;
}

export const PmaProtocolModal: React.FC<Props> = ({
  isOpen,
  onClose,
  config,
  onSave,
}) => {
  const [cycleStartDate, setCycleStartDate] = useState(config.cycleStartDate);
  const [protocolName, setProtocolName] = useState(config.protocolName);
  const [status, setStatus] = useState(config.status);
  const [morningTime, setMorningTime] = useState(config.morningInjectionTime);
  const [eveningTime, setEveningTime] = useState(config.eveningInjectionTime);
  const [clinicName, setClinicName] = useState(config.clinicName);
  const [clinicPhone, setClinicPhone] = useState(config.clinicPhone);
  const [emergencyPhone, setEmergencyPhone] = useState(config.emergencyPhone);
  const [clinicEmail, setClinicEmail] = useState(config.clinicEmail);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      cycleStartDate,
      protocolName,
      status,
      morningInjectionTime: morningTime,
      eveningInjectionTime: eveningTime,
      clinicName,
      clinicPhone,
      emergencyPhone,
      clinicEmail,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-[#FFFDF8] dark:bg-[#231d18] border border-[#e8dec8] dark:border-[#382d24] rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-scale-up max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-[#e8dec8] dark:border-[#382d24]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#F3ECE2] dark:bg-[#342921] flex items-center justify-center text-[#443126] dark:text-[#eedacb]">
              <Syringe className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#3B281E] dark:text-white">
                Protocole PMA &amp; Réglages Clinique
              </h3>
              <p className="text-xs text-[#7d6c5d] dark:text-[#a8988a]">
                Coordonnées du centre référent et rappels d'injections
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-[#7d6c5d] uppercase block mb-1">
                Date début de cycle (J1)
              </label>
              <input
                type="date"
                required
                value={cycleStartDate}
                onChange={(e) => setCycleStartDate(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-[#201a15] border border-[#ebdcc9] dark:border-[#382d24] text-[#3B281E] dark:text-white focus:outline-none focus:border-[#443126]"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-[#7d6c5d] uppercase block mb-1">
                Statut actuel
              </label>
              <input
                type="text"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                placeholder="Ex: Protocole en cours, Nothing right now..."
                className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-[#201a15] border border-[#ebdcc9] dark:border-[#382d24] text-[#3B281E] dark:text-white focus:outline-none focus:border-[#443126]"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-[#7d6c5d] uppercase block mb-1">
              Nom du protocole
            </label>
            <input
              type="text"
              value={protocolName}
              onChange={(e) => setProtocolName(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-[#201a15] border border-[#ebdcc9] dark:border-[#382d24] text-[#3B281E] dark:text-white focus:outline-none focus:border-[#443126]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-[#7d6c5d] uppercase block mb-1">
                Rappel Injection Matin
              </label>
              <input
                type="time"
                value={morningTime}
                onChange={(e) => setMorningTime(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-[#201a15] border border-[#ebdcc9] dark:border-[#382d24] text-[#3B281E] dark:text-white focus:outline-none focus:border-[#443126]"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-[#7d6c5d] uppercase block mb-1">
                Rappel Injection Soir
              </label>
              <input
                type="time"
                value={eveningTime}
                onChange={(e) => setEveningTime(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-[#201a15] border border-[#ebdcc9] dark:border-[#382d24] text-[#3B281E] dark:text-white focus:outline-none focus:border-[#443126]"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-[#e8dec8] dark:border-[#382d24]">
            <h4 className="text-xs font-bold text-[#3B281E] dark:text-white mb-2">
              Coordonnées de l'Équipe Médicale
            </h4>
            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-[#7d6c5d] uppercase block mb-1">
                  Nom du Centre Médical
                </label>
                <input
                  type="text"
                  value={clinicName}
                  onChange={(e) => setClinicName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-[#201a15] border border-[#ebdcc9] dark:border-[#382d24] text-[#3B281E] dark:text-white focus:outline-none focus:border-[#443126]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-[#7d6c5d] uppercase block mb-1">
                    Téléphone Secrétariat
                  </label>
                  <input
                    type="tel"
                    value={clinicPhone}
                    onChange={(e) => setClinicPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-[#201a15] border border-[#ebdcc9] dark:border-[#382d24] text-[#3B281E] dark:text-white focus:outline-none focus:border-[#443126]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-[#7d6c5d] uppercase block mb-1">
                    Ligne d'Urgence PMA
                  </label>
                  <input
                    type="tel"
                    value={emergencyPhone}
                    onChange={(e) => setEmergencyPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-[#201a15] border border-[#ebdcc9] dark:border-[#382d24] text-[#3B281E] dark:text-white focus:outline-none focus:border-[#443126]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#7d6c5d] uppercase block mb-1">
                  Email de Coordination
                </label>
                <input
                  type="email"
                  value={clinicEmail}
                  onChange={(e) => setClinicEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-[#201a15] border border-[#ebdcc9] dark:border-[#382d24] text-[#3B281E] dark:text-white focus:outline-none focus:border-[#443126]"
                />
              </div>
            </div>
          </div>

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
              <span>Enregistrer</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
