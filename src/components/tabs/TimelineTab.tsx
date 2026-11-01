import React, { useState } from 'react';
import {
  Calendar,
  Sparkles,
  Stethoscope,
  ChevronRight,
  Plus,
  CheckCircle2,
  Circle,
  Layers,
  Table,
  Info,
  Edit3,
} from 'lucide-react';
import { TIMELINE_WEEKS } from '../../data/pregnancyData';
import { OBSTETRIC_MILESTONES } from '../../data/consultationsData';
import { ThreeDWombVisualizer } from '../ThreeDWombVisualizer';
import { ProtocolCalendar } from '../ProtocolCalendar';
import { CalendarEvent } from '../../types';

interface Props {
  currentWeek: number;
  onSelectWeek: (w: number) => void;
  events: CalendarEvent[];
  onAddEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  onUpdateEvent: (event: CalendarEvent) => void;
  onDeleteEvent: (id: string) => void;
  selectedDate: string;
  onSelectDate: (date: string) => void;
  onOpenEditPregnancyDate: () => void;
  dpaDate: string;
}

export const TimelineTab: React.FC<Props> = ({
  currentWeek,
  onSelectWeek,
  events,
  onAddEvent,
  onUpdateEvent,
  onDeleteEvent,
  selectedDate,
  onSelectDate,
  onOpenEditPregnancyDate,
  dpaDate,
}) => {
  const [subTab, setSubTab] = useState<'calendar' | 'consultations' | 'fetal3d'>('calendar');
  const [selectedTrimester, setSelectedTrimester] = useState<number | 'all'>('all');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  // Custom added consultations
  const [completedMilestones, setCompletedMilestones] = useState<Record<number, boolean>>({
    0: true, // First one completed by default
  });

  // Modal to add a custom consultation / exam
  const [isAddConsultationOpen, setIsAddConsultationOpen] = useState(false);
  const [newConsultationTitle, setNewConsultationTitle] = useState('');
  const [newConsultationPeriod, setNewConsultationPeriod] = useState(`Semaine ${currentWeek} SA`);
  const [newConsultationLocation, setNewConsultationLocation] = useState('Maternité / Cabinet');
  const [newConsultationDesc, setNewConsultationDesc] = useState('');

  const filteredWeeks = TIMELINE_WEEKS.filter((w) => {
    if (selectedTrimester === 'all') return true;
    return w.trimester === selectedTrimester;
  });

  const activeWeekData =
    TIMELINE_WEEKS.find((w) => w.week === currentWeek) || TIMELINE_WEEKS[21];

  const handleCreateConsultation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newConsultationTitle.trim()) return;

    onAddEvent({
      title: newConsultationTitle.trim(),
      date: selectedDate,
      time: '10:00',
      type: 'gyn',
      location: newConsultationLocation.trim(),
      notes: newConsultationDesc.trim(),
      completed: false,
    });

    setIsAddConsultationOpen(false);
    setNewConsultationTitle('');
    setNewConsultationDesc('');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header & Sub-Tabs Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#443126] dark:text-[#eedacb] font-semibold uppercase tracking-wider">
            <span>Chrono &amp; Calendrier Médical</span>
            <span aria-hidden="true">·</span>
            <span>Semaine {currentWeek} SA</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#3B281E] dark:text-white mt-0.5">
            Planning, Consultations &amp; Développement Fœtal
          </h1>
        </div>

        {/* 3 Sub-tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-[#E8DEC8]/60 dark:bg-[#2b221b] rounded-xl overflow-x-auto self-start sm:self-auto border border-[#ebdcc9] dark:border-[#382d24]">
          <button
            type="button"
            onClick={() => setSubTab('calendar')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              subTab === 'calendar'
                ? 'bg-white dark:bg-[#3d3127] text-[#3B281E] dark:text-white shadow-xs'
                : 'text-[#5c4c3e] dark:text-[#c4b5a6] hover:text-[#3B281E]'
            }`}
          >
            Calendrier du Protocole
          </button>
          <button
            type="button"
            onClick={() => setSubTab('consultations')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              subTab === 'consultations'
                ? 'bg-white dark:bg-[#3d3127] text-[#3B281E] dark:text-white shadow-xs'
                : 'text-[#5c4c3e] dark:text-[#c4b5a6] hover:text-[#3B281E]'
            }`}
          >
            Consultations &amp; Examens
          </button>
          <button
            type="button"
            onClick={() => setSubTab('fetal3d')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              subTab === 'fetal3d'
                ? 'bg-white dark:bg-[#3d3127] text-[#3B281E] dark:text-white shadow-xs'
                : 'text-[#5c4c3e] dark:text-[#c4b5a6] hover:text-[#3B281E]'
            }`}
          >
            Développement Fœtal 3D
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: CALENDRIER DU PROTOCOLE (CLICKABLE, EDITABLE, SYNCED) */}
      {subTab === 'calendar' && (
        <ProtocolCalendar
          events={events}
          onAddEvent={onAddEvent}
          onUpdateEvent={onUpdateEvent}
          onDeleteEvent={onDeleteEvent}
          selectedDate={selectedDate}
          onSelectDate={onSelectDate}
        />
      )}

      {/* SUB-TAB 2: CONSULTATIONS & EXAMENS */}
      {subTab === 'consultations' && (
        <div className="space-y-6">
          {/* Explanatory card with editable date notice & Add Consultation CTA */}
          <div className="bg-[#FFFDF8] dark:bg-[#231d18] border border-[#E8DEC8] dark:border-[#382d24] rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-[#443126] dark:text-[#eedacb]" />
                <span className="text-xs font-bold text-[#3B281E] dark:text-white uppercase tracking-wider">
                  Parcours Médical &amp; Recommandations HAS
                </span>
              </div>
              <p className="text-xs text-[#5c4c3e] dark:text-[#c4b5a6] leading-relaxed max-w-2xl">
                Toutes les dates de consultations sont calculées automatiquement par rapport à votre terme (DPA :{' '}
                <strong className="text-[#3B281E] dark:text-white">{dpaDate}</strong>).
                Vous pouvez modifier la date à tout moment.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={onOpenEditPregnancyDate}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#FAF6EE] dark:bg-[#342921] border border-[#ebdcc9] dark:border-[#47372b] text-xs font-semibold text-[#443126] dark:text-[#eedacb] cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Modifier la date</span>
              </button>
              <button
                type="button"
                onClick={() => setIsAddConsultationOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#443126] hover:bg-[#3B281E] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Ajouter une consultation / examen</span>
              </button>
            </div>
          </div>

          {/* Timeline list container: Parcours des Consultations */}
          <div className="bg-[#FFFDF8] dark:bg-[#231d18] border border-[#E8DEC8] dark:border-[#382d24] rounded-2xl p-4 sm:p-5 md:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8DEC8] dark:border-[#382d24]">
              <h2 className="text-base font-bold text-[#3B281E] dark:text-white">
                Parcours des Consultations ({OBSTETRIC_MILESTONES.length} Jalons HAS)
              </h2>
              <span className="text-xs font-mono text-[#7d6c5d]">CNGOF &amp; HAS</span>
            </div>

            <div className="space-y-4">
              {OBSTETRIC_MILESTONES.map((item, idx) => {
                const isChecked = !!completedMilestones[idx];
                return (
                  <div
                    key={idx}
                    className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                      isChecked
                        ? 'bg-[#F4F7F2] dark:bg-[#1f281e] border-emerald-300 dark:border-emerald-800/60'
                        : 'bg-white dark:bg-[#201a15] border-[#ebdcc9] dark:border-[#382d24]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            setCompletedMilestones((prev) => ({
                              ...prev,
                              [idx]: !prev[idx],
                            }))
                          }
                          className="mt-0.5 text-emerald-700 dark:text-emerald-400 cursor-pointer"
                          title={isChecked ? 'Marquer comme à faire' : 'Marquer comme réalisé'}
                        >
                          {isChecked ? (
                            <CheckCircle2 className="w-5 h-5" />
                          ) : (
                            <Circle className="w-5 h-5 text-[#bfaea0] dark:text-[#5a483a]" />
                          )}
                        </button>

                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs font-mono font-bold text-[#443126] dark:text-[#eedacb]">
                              {item.period}
                            </span>
                            <span aria-hidden="true">·</span>
                            <span className="text-xs text-[#7d6c5d]">{item.location}</span>
                          </div>

                          <h3
                            className={`text-sm sm:text-base font-bold ${
                              isChecked
                                ? 'line-through text-[#9e8d7f]'
                                : 'text-[#3B281E] dark:text-white'
                            }`}
                          >
                            {item.title}
                          </h3>

                          <p className="text-xs text-[#5c4c3e] dark:text-[#c4b5a6] leading-relaxed">
                            {item.description}
                          </p>

                          <div className="pt-2 flex flex-wrap gap-1.5">
                            {item.keyExams.map((exam, eIdx) => (
                              <span
                                key={eIdx}
                                className="text-[11px] px-2 py-0.5 rounded-md bg-[#FAF6EE] dark:bg-[#2b221b] border border-[#ebdcc9] dark:border-[#3d3128] text-[#5c4c3e] dark:text-[#c4b5a6]"
                              >
                                {exam}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          onAddEvent({
                            title: item.title,
                            date: selectedDate,
                            time: '09:30',
                            type: 'exam',
                            location: item.location,
                            notes: item.description,
                            completed: false,
                          });
                        }}
                        className="text-xs font-semibold text-[#443126] dark:text-[#eedacb] hover:underline whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        + Ajouter au calendrier
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Add Consultation Modal */}
          {isAddConsultationOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
              <div className="bg-[#FFFDF8] dark:bg-[#231d18] border border-[#E8DEC8] dark:border-[#382d24] rounded-2xl sm:rounded-3xl max-w-md w-full p-4 sm:p-6 shadow-2xl space-y-4 my-auto max-h-[92vh] overflow-y-auto">
                <h3 className="font-bold text-base text-[#3B281E] dark:text-white">
                  + Ajouter une Consultation ou un Examen
                </h3>

                <form onSubmit={handleCreateConsultation} className="space-y-3">
                  <div>
                    <label className="text-[11px] font-semibold text-[#7d6c5d] uppercase block mb-1">
                      Intitulé de la consultation
                    </label>
                    <input
                      type="text"
                      required
                      value={newConsultationTitle}
                      onChange={(e) => setNewConsultationTitle(e.target.value)}
                      placeholder="Ex: Rendez-vous Anesthésiste, Test HGPO..."
                      className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-[#201a15] border border-[#ebdcc9] dark:border-[#382d24] text-[#3B281E] dark:text-white focus:outline-none focus:border-[#443126]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-[#7d6c5d] uppercase block mb-1">
                      Période / Terme (SA)
                    </label>
                    <input
                      type="text"
                      value={newConsultationPeriod}
                      onChange={(e) => setNewConsultationPeriod(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-[#201a15] border border-[#ebdcc9] dark:border-[#382d24] text-[#3B281E] dark:text-white focus:outline-none focus:border-[#443126]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-[#7d6c5d] uppercase block mb-1">
                      Lieu / Cabinet
                    </label>
                    <input
                      type="text"
                      value={newConsultationLocation}
                      onChange={(e) => setNewConsultationLocation(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-[#201a15] border border-[#ebdcc9] dark:border-[#382d24] text-[#3B281E] dark:text-white focus:outline-none focus:border-[#443126]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-[#7d6c5d] uppercase block mb-1">
                      Consignes ou examens prévus
                    </label>
                    <textarea
                      rows={2}
                      value={newConsultationDesc}
                      onChange={(e) => setNewConsultationDesc(e.target.value)}
                      placeholder="Ex: Prise de sang à jeun, analyse d'urine..."
                      className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-[#201a15] border border-[#ebdcc9] dark:border-[#382d24] text-[#3B281E] dark:text-white focus:outline-none focus:border-[#443126]"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAddConsultationOpen(false)}
                      className="px-3 py-1.5 text-xs text-[#7d6c5d] cursor-pointer"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-xs font-bold text-white bg-[#443126] hover:bg-[#3B281E] rounded-xl shadow-xs cursor-pointer"
                    >
                      Enregistrer
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 3: DÉVELOPPEMENT FŒTAL 3D & SEMAINE PAR SEMAINE */}
      {subTab === 'fetal3d' && (
        <div className="space-y-6">
          {/* 3D Womb Visualizer */}
          <ThreeDWombVisualizer currentWeek={currentWeek} onWeekChange={onSelectWeek} />

          {/* Active Week Spotlight Card */}
          <div className="bg-[#FFFDF8] dark:bg-[#231d18] border border-[#E8DEC8] dark:border-[#382d24] rounded-2xl p-5 sm:p-7 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E8DEC8] dark:border-[#382d24] gap-3">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-[#443126] dark:text-[#eedacb] uppercase tracking-wider">
                  <span>
                    {activeWeekData.trimester === 1
                      ? '1er Trimestre'
                      : activeWeekData.trimester === 2
                      ? '2e Trimestre'
                      : '3e Trimestre'}
                  </span>
                  <span>·</span>
                  <span>Semaine d'Aménorrhée</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-[#3B281E] dark:text-white mt-0.5">
                  Semaine {activeWeekData.week} SA
                </h2>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-[11px] text-[#7d6c5d] dark:text-[#a8988a] uppercase tracking-wider block">
                    Taille comparée
                  </span>
                  <span className="text-sm font-bold text-[#3B281E] dark:text-white">
                    {activeWeekData.sizeComparison}
                  </span>
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-[#FAF6EE] dark:bg-[#342921] text-[#443126] dark:text-[#eedacb] font-mono font-bold text-xs border border-[#ebdcc9] dark:border-[#47372b]">
                  {activeWeekData.approxSize}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="p-4 rounded-xl bg-[#FAF6EE] dark:bg-[#2b221b] border border-[#ebdcc9] dark:border-[#3d3128]">
                <div className="flex items-center gap-2 text-[#443126] dark:text-[#eedacb] font-bold text-xs uppercase tracking-wider mb-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Développement Fœtal</span>
                </div>
                <p className="text-xs sm:text-sm text-[#3d2e23] dark:text-[#e4ded6] leading-relaxed">
                  {activeWeekData.fetalDevelopment}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#FAF6EE] dark:bg-[#2b221b] border border-[#ebdcc9] dark:border-[#3d3128]">
                <div className="flex items-center gap-2 text-[#443126] dark:text-[#eedacb] font-bold text-xs uppercase tracking-wider mb-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Changements Maman</span>
                </div>
                <p className="text-xs sm:text-sm text-[#3d2e23] dark:text-[#e4ded6] leading-relaxed">
                  {activeWeekData.maternalChanges}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#FAF6EE] dark:bg-[#2b221b] border border-[#ebdcc9] dark:border-[#3d3128]">
                <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 font-bold text-xs uppercase tracking-wider mb-2">
                  <Stethoscope className="w-4 h-4" />
                  <span>Jalon Médical</span>
                </div>
                <p className="text-xs sm:text-sm text-[#3d2e23] dark:text-[#e4ded6] leading-relaxed">
                  {activeWeekData.medicalMilestone}
                </p>
              </div>
            </div>
          </div>

          {/* Trimester Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-1.5 p-1 bg-[#E8DEC8]/60 dark:bg-[#2b221b] rounded-xl overflow-x-auto border border-[#ebdcc9] dark:border-[#382d24]">
              <button
                type="button"
                onClick={() => setSelectedTrimester('all')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  selectedTrimester === 'all'
                    ? 'bg-white dark:bg-[#3d3127] text-[#3B281E] dark:text-white shadow-xs'
                    : 'text-[#5c4c3e] dark:text-[#c4b5a6] hover:text-[#3B281E]'
                }`}
              >
                Toutes les semaines (1-40 SA)
              </button>
              <button
                type="button"
                onClick={() => setSelectedTrimester(1)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  selectedTrimester === 1
                    ? 'bg-white dark:bg-[#3d3127] text-[#3B281E] dark:text-white shadow-xs'
                    : 'text-[#5c4c3e] dark:text-[#c4b5a6] hover:text-[#3B281E]'
                }`}
              >
                1er Trimestre (1-13)
              </button>
              <button
                type="button"
                onClick={() => setSelectedTrimester(2)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  selectedTrimester === 2
                    ? 'bg-white dark:bg-[#3d3127] text-[#3B281E] dark:text-white shadow-xs'
                    : 'text-[#5c4c3e] dark:text-[#c4b5a6] hover:text-[#3B281E]'
                }`}
              >
                2e Trimestre (14-26)
              </button>
              <button
                type="button"
                onClick={() => setSelectedTrimester(3)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  selectedTrimester === 3
                    ? 'bg-white dark:bg-[#3d3127] text-[#3B281E] dark:text-white shadow-xs'
                    : 'text-[#5c4c3e] dark:text-[#c4b5a6] hover:text-[#3B281E]'
                }`}
              >
                3e Trimestre (27-40)
              </button>
            </div>

            {/* View Mode */}
            <div className="flex items-center gap-1 self-end sm:self-auto">
              <button
                type="button"
                onClick={() => setViewMode('cards')}
                className={`p-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  viewMode === 'cards'
                    ? 'bg-[#E8DEC8] text-[#3B281E] dark:bg-[#3d3025] dark:text-[#f3dfcf]'
                    : 'text-[#7d6c5d] hover:text-[#3B281E] dark:text-[#a8988a]'
                }`}
                title="Affichage en cartes"
              >
                <Layers className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`p-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  viewMode === 'table'
                    ? 'bg-[#E8DEC8] text-[#3B281E] dark:bg-[#3d3025] dark:text-[#f3dfcf]'
                    : 'text-[#7d6c5d] hover:text-[#3B281E] dark:text-[#a8988a]'
                }`}
                title="Affichage en tableau comparatif"
              >
                <Table className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Cards View */}
          {viewMode === 'cards' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredWeeks.map((item) => {
                const isCurrent = item.week === currentWeek;
                return (
                  <div
                    key={item.week}
                    onClick={() => onSelectWeek(item.week)}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-[#FAF6EE] dark:bg-[#2d231b] border-[#443126] dark:border-[#eedacb] shadow-md ring-2 ring-[#443126]/20'
                        : 'bg-white dark:bg-[#231d18] border-[#ebdcc9] dark:border-[#382d24] hover:border-[#bda58d] hover:shadow-xs'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-[#ebdcc9] dark:border-[#382d24]">
                      <div>
                        <span className="text-[11px] font-semibold text-[#443126] dark:text-[#eedacb] uppercase tracking-wide">
                          {item.trimester === 1 ? 'T1' : item.trimester === 2 ? 'T2' : 'T3'}
                        </span>
                        <h3 className="font-bold text-base text-[#3B281E] dark:text-white">
                          Semaine {item.week} SA
                        </h3>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-semibold text-[#3B281E] dark:text-white block truncate max-w-[120px]">
                          {item.sizeComparison}
                        </span>
                        <span className="text-[11px] font-mono text-[#7d6c5d] dark:text-[#a8988a]">
                          {item.approxSize}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 space-y-2 text-xs">
                      <div>
                        <strong className="text-[#3B281E] dark:text-[#f2ebe4]">Fœtus : </strong>
                        <span className="text-[#5c4c3e] dark:text-[#c4b5a6] leading-relaxed">
                          {item.fetalDevelopment}
                        </span>
                      </div>
                      <div>
                        <strong className="text-[#3B281E] dark:text-[#f2ebe4]">Maman : </strong>
                        <span className="text-[#5c4c3e] dark:text-[#c4b5a6] leading-relaxed">
                          {item.maternalChanges}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 pt-2.5 border-t border-[#ebdcc9] dark:border-[#382d24] flex items-center justify-between text-[11px] text-[#7d6c5d]">
                      <span className="truncate max-w-[200px] italic">{item.medicalMilestone}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-[#443126] dark:text-[#eedacb] shrink-0" />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white dark:bg-[#231d18] border border-[#ebdcc9] dark:border-[#382d24] rounded-2xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF6EE] dark:bg-[#2e241c] border-b border-[#e2d5c4] dark:border-[#3d3128] text-[#5c4a3b] dark:text-[#d9ccc0] font-semibold uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-4">SA</th>
                      <th className="py-3 px-4">Trimestre</th>
                      <th className="py-3 px-4">Taille Fœtale Comparée</th>
                      <th className="py-3 px-4 min-w-[240px]">Développement du Fœtus</th>
                      <th className="py-3 px-4 min-w-[220px]">Changements Maman</th>
                      <th className="py-3 px-4 min-w-[220px]">Jalons Médicaux Clés</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#ebdcc9] dark:divide-[#382d24] text-[#3d2e23] dark:text-[#ded5cc]">
                    {filteredWeeks.map((row) => {
                      const isCurrent = row.week === currentWeek;
                      return (
                        <tr
                          key={row.week}
                          onClick={() => onSelectWeek(row.week)}
                          className={`hover:bg-[#FAF6EE]/60 dark:hover:bg-[#2a221b]/60 cursor-pointer transition-colors ${
                            isCurrent ? 'bg-[#FAF6EE] dark:bg-[#33281e] font-medium' : ''
                          }`}
                        >
                          <td className="py-3 px-4 font-bold font-mono text-[#3B281E] dark:text-white whitespace-nowrap">
                            {row.week} SA
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            {row.trimester === 1
                              ? '1er Trim.'
                              : row.trimester === 2
                              ? '2e Trim.'
                              : '3e Trim.'}
                          </td>
                          <td className="py-3 px-4 font-semibold text-[#3B281E] dark:text-white whitespace-nowrap">
                            {row.sizeComparison}{' '}
                            <span className="text-[#7d6c5d] font-normal">({row.approxSize})</span>
                          </td>
                          <td className="py-3 px-4 leading-relaxed">{row.fetalDevelopment}</td>
                          <td className="py-3 px-4 leading-relaxed">{row.maternalChanges}</td>
                          <td className="py-3 px-4 leading-relaxed text-[#443126] dark:text-[#eedacb] font-medium">
                            {row.medicalMilestone}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
