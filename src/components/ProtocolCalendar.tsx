import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  Trash2,
  CheckCircle2,
  Circle,
  Syringe,
  Stethoscope,
  FileText,
  Bookmark,
  MapPin,
  X,
  CloudCheck,
} from 'lucide-react';
import { CalendarEvent, CalendarEventType } from '../types';

interface Props {
  events: CalendarEvent[];
  onAddEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  onUpdateEvent: (event: CalendarEvent) => void;
  onDeleteEvent: (id: string) => void;
  selectedDate: string; // YYYY-MM-DD
  onSelectDate: (date: string) => void;
}

const MONTH_NAMES = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];

const DAY_NAMES = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

export const ProtocolCalendar: React.FC<Props> = ({
  events,
  onAddEvent,
  onUpdateEvent,
  onDeleteEvent,
  selectedDate,
  onSelectDate,
}) => {
  // Current viewed month & year
  const initialDateParts = selectedDate.split('-').map(Number);
  const [viewYear, setViewYear] = useState<number>(initialDateParts[0] || new Date().getFullYear());
  const [viewMonth, setViewMonth] = useState<number>((initialDateParts[1] || new Date().getMonth() + 1) - 1);

  // Modal / form state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [eventTitle, setEventTitle] = useState('');
  const [eventTime, setEventTime] = useState('09:00');
  const [eventType, setEventType] = useState<CalendarEventType>('gyn');
  const [eventLocation, setEventLocation] = useState('');
  const [eventNotes, setEventNotes] = useState('');
  const [targetDateForNew, setTargetDateForNew] = useState(selectedDate);

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  // Helper for French date display
  const formatSelectedDateHeader = (dateStr: string) => {
    try {
      const parts = dateStr.split('-').map(Number);
      const d = new Date(parts[0], parts[1] - 1, parts[2], 12);
      const formatted = d.toLocaleDateString('fr-FR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
      // Capitalize first letter
      return formatted.charAt(0).toUpperCase() + formatted.slice(1);
    } catch {
      return dateStr;
    }
  };

  // Generate calendar grid for viewYear & viewMonth
  const firstDayOfMonth = new Date(viewYear, viewMonth, 1);
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  // Day of week for 1st of month: 0=Sun, 1=Mon, ..., 6=Sat
  // Convert to Mon=0 ... Sun=6
  let startDayOfWeek = firstDayOfMonth.getDay() - 1;
  if (startDayOfWeek === -1) startDayOfWeek = 6;

  // Previous month trailing days
  const prevMonthDaysCount = new Date(viewYear, viewMonth, 0).getDate();
  const calendarCells: { dateStr: string; dayNumber: number; isCurrentMonth: boolean }[] = [];

  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const d = prevMonthDaysCount - i;
    const m = viewMonth === 0 ? 12 : viewMonth;
    const y = viewMonth === 0 ? viewYear - 1 : viewYear;
    const dateStr = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    calendarCells.push({ dateStr, dayNumber: d, isCurrentMonth: false });
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const m = viewMonth + 1;
    const dateStr = `${viewYear}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    calendarCells.push({ dateStr, dayNumber: d, isCurrentMonth: true });
  }

  // Next month leading days to complete grid
  const remainingSlots = 42 - calendarCells.length; // 6 rows * 7 columns
  if (remainingSlots > 0 && remainingSlots < 7) {
    for (let d = 1; d <= remainingSlots; d++) {
      const m = viewMonth === 11 ? 1 : viewMonth + 2;
      const y = viewMonth === 11 ? viewYear + 1 : viewYear;
      const dateStr = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      calendarCells.push({ dateStr, dayNumber: d, isCurrentMonth: false });
    }
  }

  // Filter events for selected date
  const selectedDateEvents = events.filter((e) => e.date === selectedDate);

  // Open modal with preselected type
  const handleQuickAdd = (type: CalendarEventType) => {
    setEditingEventId(null);
    setEventType(type);
    setTargetDateForNew(selectedDate);
    if (type === 'gyn') {
      setEventTitle('Consultation Prénatale');
      setEventTime('10:00');
      setEventLocation('Cabinet Gynécologue');
      setEventNotes('Tension, Doppler fœtal, examen du col.');
    } else if (type === 'injection') {
      setEventTitle('Injection Traitement (08h / 20h)');
      setEventTime('20:00');
      setEventLocation('À domicile');
      setEventNotes('Injection sous-cutanée abdominale.');
    } else if (type === 'journal') {
      setEventTitle('Note du jour / Journal de grossesse');
      setEventTime('14:00');
      setEventLocation('');
      setEventNotes('Mouvements fœtaux bien ressentis aujourd\'hui.');
    } else if (type === 'memo') {
      setEventTitle('Mémo médical / Prise de sang');
      setEventTime('08:30');
      setEventLocation('Laboratoire d\'analyses');
      setEventNotes('À jeun pour bilan sérologique.');
    } else {
      setEventTitle('Examen Échographie');
      setEventTime('11:00');
      setEventLocation('Centre d\'Échographie');
      setEventNotes('Boire un verre d\'eau avant la séance.');
    }
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (evt: CalendarEvent) => {
    setEditingEventId(evt.id);
    setEventTitle(evt.title);
    setEventTime(evt.time || '09:00');
    setEventType(evt.type);
    setEventLocation(evt.location || '');
    setEventNotes(evt.notes || '');
    setTargetDateForNew(evt.date);
    setIsAddModalOpen(true);
  };

  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle.trim()) return;

    if (editingEventId) {
      const existing = events.find((ev) => ev.id === editingEventId);
      if (existing) {
        onUpdateEvent({
          ...existing,
          title: eventTitle.trim(),
          date: targetDateForNew,
          time: eventTime,
          type: eventType,
          location: eventLocation.trim(),
          notes: eventNotes.trim(),
        });
      }
    } else {
      onAddEvent({
        title: eventTitle.trim(),
        date: targetDateForNew,
        time: eventTime,
        type: eventType,
        location: eventLocation.trim(),
        notes: eventNotes.trim(),
        completed: false,
      });
    }

    setIsAddModalOpen(false);
    setEditingEventId(null);
  };

  const getTypeColor = (type: CalendarEventType) => {
    switch (type) {
      case 'gyn':
        return {
          dot: 'bg-indigo-600 dark:bg-indigo-400',
          badge: 'bg-indigo-50 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/60',
          icon: <Stethoscope className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />,
          label: 'Visite GYN',
        };
      case 'injection':
        return {
          dot: 'bg-rose-600 dark:bg-rose-400',
          badge: 'bg-rose-50 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800/60',
          icon: <Syringe className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />,
          label: 'Injections',
        };
      case 'memo':
        return {
          dot: 'bg-amber-600 dark:bg-amber-400',
          badge: 'bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800/60',
          icon: <Bookmark className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />,
          label: 'Mémos/Notes',
        };
      case 'journal':
        return {
          dot: 'bg-[#8a5732] dark:bg-[#d49970]',
          badge: 'bg-[#faf6f0] text-[#784824] dark:bg-[#342921] dark:text-[#eedacb] border-[#ebdcc9] dark:border-[#47372b]',
          icon: <FileText className="w-3.5 h-3.5 text-[#8a5732]" />,
          label: 'Journal',
        };
      case 'exam':
      default:
        return {
          dot: 'bg-emerald-600 dark:bg-emerald-400',
          badge: 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60',
          icon: <CalendarIcon className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />,
          label: 'Examens',
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Monthly Calendar Card */}
      <div className="bg-[#FFFDF8] dark:bg-[#231d18] border border-[#e8dec8] dark:border-[#382d24] rounded-2xl p-4 sm:p-6 shadow-xs">
        {/* Month Navigation & Title */}
        <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-3 pb-4 border-b border-[#e8dec8] dark:border-[#382d24]">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-[#443126] dark:text-[#eedacb]" />
            <h2 className="text-base sm:text-lg font-bold text-[#3B281E] dark:text-white">
              Calendrier du Protocole
            </h2>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 self-start xs:self-auto">
            <button
              type="button"
              onClick={prevMonth}
              className="p-1.5 rounded-lg hover:bg-[#F3ECE2] dark:hover:bg-[#342921] text-[#443126] dark:text-[#eedacb] transition-colors cursor-pointer"
              aria-label="Mois précédent"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="font-bold text-xs sm:text-base text-[#3B281E] dark:text-white min-w-[110px] sm:min-w-[140px] text-center">
              {MONTH_NAMES[viewMonth]} {viewYear}
            </span>
            <button
              type="button"
              onClick={nextMonth}
              className="p-1.5 rounded-lg hover:bg-[#F3ECE2] dark:hover:bg-[#342921] text-[#443126] dark:text-[#eedacb] transition-colors cursor-pointer"
              aria-label="Mois suivant"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Category Dot Legends */}
        <div className="flex flex-wrap items-center gap-4 py-3 text-xs text-[#5c4c3e] dark:text-[#c4b5a6] border-b border-[#e8dec8]/60 dark:border-[#382d24]/60">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 dark:bg-indigo-400" />
            <span>Visite GYN</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-600 dark:bg-rose-400" />
            <span>Injections</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-600 dark:bg-amber-400" />
            <span>Mémos/Notes</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
            <span>Examens / Écho</span>
          </div>
        </div>

        {/* Calendar Grid Header (Days of week) */}
        <div className="grid grid-cols-7 gap-1 text-center py-2 text-xs font-semibold text-[#7d6c5d] dark:text-[#a8988a]">
          {DAY_NAMES.map((name) => (
            <div key={name} className="py-1">
              {name}
            </div>
          ))}
        </div>

        {/* Calendar Grid Cells */}
        <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
          {calendarCells.map((cell) => {
            const isSelected = cell.dateStr === selectedDate;
            const todayStr = new Date().toISOString().split('T')[0];
            const isToday = cell.dateStr === todayStr;

            // Events for this date
            const cellEvents = events.filter((e) => e.date === cell.dateStr);

            return (
              <button
                key={cell.dateStr}
                type="button"
                onClick={() => onSelectDate(cell.dateStr)}
                className={`min-h-[58px] sm:min-h-[70px] p-1 sm:p-1.5 rounded-xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-[#F3ECE2] dark:bg-[#342921] border-[#443126] dark:border-[#eedacb] ring-2 ring-[#443126]/20'
                    : cell.isCurrentMonth
                    ? 'bg-white dark:bg-[#201a15] border-[#ebdcc9] dark:border-[#382d24] hover:border-[#bda58d] hover:bg-[#FAF6EE] dark:hover:bg-[#28201a]'
                    : 'bg-[#faf7f2]/50 dark:bg-[#1a1512]/50 border-transparent text-[#bdaea1] dark:text-[#554538]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                      isToday
                        ? 'bg-[#443126] text-white dark:bg-[#eedacb] dark:text-[#2d221a]'
                        : isSelected
                        ? 'text-[#3B281E] dark:text-white font-extrabold'
                        : cell.isCurrentMonth
                        ? 'text-[#3d2e23] dark:text-[#ded5cc]'
                        : 'text-[#baa99b] dark:text-[#554538]'
                    }`}
                  >
                    {cell.dayNumber}
                  </span>
                  {cellEvents.length > 0 && (
                    <span className="text-[10px] font-mono text-[#7d6c5d] dark:text-[#a8988a] hidden sm:inline">
                      {cellEvents.length}
                    </span>
                  )}
                </div>

                {/* Event Indicator Dots */}
                <div className="flex flex-wrap gap-1 mt-1">
                  {cellEvents.slice(0, 4).map((evt) => {
                    const c = getTypeColor(evt.type);
                    return (
                      <span
                        key={evt.id}
                        className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${c.dot} shrink-0`}
                        title={evt.title}
                      />
                    );
                  })}
                  {cellEvents.length > 4 && (
                    <span className="text-[9px] text-[#7d6c5d] leading-none">+</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Selected Date Header & Quick Action Bar */}
      <div className="bg-[#FFFDF8] dark:bg-[#231d18] border border-[#e8dec8] dark:border-[#382d24] rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#e8dec8] dark:border-[#382d24]">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-[#443126] dark:text-[#eedacb]" />
            <div>
              <h3 className="font-bold text-base sm:text-lg text-[#3B281E] dark:text-white">
                {formatSelectedDateHeader(selectedDate)}
              </h3>
              <div className="flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-400 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Synchronisé</span>
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => handleQuickAdd('gyn')}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 text-indigo-800 dark:text-indigo-200 border border-indigo-200 dark:border-indigo-800/60 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ GYN</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickAdd('injection')}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/60 dark:hover:bg-rose-900/60 text-rose-800 dark:text-rose-200 border border-rose-200 dark:border-rose-800/60 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Injection</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickAdd('memo')}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/60 dark:hover:bg-amber-900/60 text-amber-800 dark:text-amber-200 border border-amber-200 dark:border-amber-800/60 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Mémo</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickAdd('journal')}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#FAF6EE] hover:bg-[#F3ECE2] dark:bg-[#342921] dark:hover:bg-[#403328] text-[#443126] dark:text-[#eedacb] border border-[#ebdcc9] dark:border-[#47372b] transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Journal</span>
            </button>
          </div>
        </div>

        {/* 3. Event Listing for Selected Date */}
        {selectedDateEvents.length === 0 ? (
          <div className="py-8 text-center space-y-3">
            <p className="text-xs sm:text-sm text-[#7d6c5d] dark:text-[#a8988a]">
              Aucun événement prévu pour cette date ({selectedDate}).
            </p>
            <button
              type="button"
              onClick={() => handleQuickAdd('memo')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#443126] hover:bg-[#3B281E] text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Ajouter un événement / rendez-vous</span>
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {selectedDateEvents.map((evt) => {
              const meta = getTypeColor(evt.type);
              return (
                <div
                  key={evt.id}
                  className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    evt.completed
                      ? 'bg-[#F4F7F2] dark:bg-[#1f281e] border-emerald-300 dark:border-emerald-800/60 opacity-80'
                      : 'bg-white dark:bg-[#201a15] border-[#ebdcc9] dark:border-[#382d24] shadow-xs'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      type="button"
                      onClick={() => onUpdateEvent({ ...evt, completed: !evt.completed })}
                      className="mt-0.5 text-emerald-700 dark:text-emerald-400 cursor-pointer"
                      title={evt.completed ? 'Marquer comme non fait' : 'Marquer comme fait'}
                    >
                      {evt.completed ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <Circle className="w-5 h-5 text-[#bfaea0] dark:text-[#5a483a]" />
                      )}
                    </button>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${meta.badge}`}>
                          {meta.label}
                        </span>
                        {evt.time && (
                          <span className="flex items-center gap-1 text-xs font-mono font-bold text-[#5c4c3e] dark:text-[#c4b5a6]">
                            <Clock className="w-3 h-3 text-[#7d6c5d]" />
                            {evt.time}
                          </span>
                        )}
                        <span className={`text-xs sm:text-sm font-bold ${evt.completed ? 'line-through text-[#9e8d7f]' : 'text-[#3B281E] dark:text-white'}`}>
                          {evt.title}
                        </span>
                      </div>

                      {evt.location && (
                        <p className="flex items-center gap-1 text-xs text-[#7d6c5d] dark:text-[#a8988a]">
                          <MapPin className="w-3 h-3 text-[#7d6c5d]" />
                          {evt.location}
                        </p>
                      )}

                      {evt.notes && (
                        <p className="text-xs text-[#5c4c3e] dark:text-[#c4b5a6] leading-relaxed">
                          {evt.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(evt)}
                      className="px-2.5 py-1 text-xs font-medium text-[#443126] dark:text-[#eedacb] hover:bg-[#F3ECE2] dark:hover:bg-[#342921] rounded-lg transition-colors cursor-pointer"
                    >
                      Modifier
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteEvent(evt.id)}
                      className="p-1.5 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition-colors cursor-pointer"
                      title="Supprimer l'événement"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. Add/Edit Event Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
          <div className="bg-[#FFFDF8] dark:bg-[#231d18] border border-[#e8dec8] dark:border-[#382d24] rounded-2xl sm:rounded-3xl max-w-lg w-full p-4 sm:p-6 shadow-2xl space-y-4 animate-scale-up max-h-[92vh] overflow-y-auto my-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#e8dec8] dark:border-[#382d24]">
              <h3 className="font-bold text-base text-[#3B281E] dark:text-white">
                {editingEventId ? 'Modifier l\'Événement' : '+ Nouvel Événement ou Rendez-vous'}
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-lg text-[#7d6c5d] hover:bg-[#F3ECE2] dark:hover:bg-[#342921] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEvent} className="space-y-4">
              <div>
                <label className="text-[11px] font-semibold text-[#7d6c5d] uppercase block mb-1">
                  Type d'événement
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5 text-xs">
                  {[
                    { id: 'gyn', label: 'GYN' },
                    { id: 'injection', label: 'Injection' },
                    { id: 'memo', label: 'Mémo' },
                    { id: 'journal', label: 'Journal' },
                    { id: 'exam', label: 'Examen' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setEventType(t.id as CalendarEventType)}
                      className={`p-2 rounded-lg border text-center font-medium cursor-pointer transition-colors ${
                        eventType === t.id
                          ? 'bg-[#443126] text-white border-[#443126] dark:bg-[#eedacb] dark:text-[#2d221a]'
                          : 'bg-white dark:bg-[#201a15] border-[#ebdcc9] dark:border-[#382d24] text-[#5c4c3e] dark:text-[#c4b5a6]'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#7d6c5d] uppercase block mb-1">
                  Titre du rendez-vous / mémo
                </label>
                <input
                  type="text"
                  required
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  placeholder="Ex: Échographie de viabilité, Injection Gonal-F..."
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-white dark:bg-[#201a15] border border-[#ebdcc9] dark:border-[#382d24] text-[#3B281E] dark:text-white focus:outline-none focus:border-[#443126]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-[#7d6c5d] uppercase block mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    value={targetDateForNew}
                    onChange={(e) => setTargetDateForNew(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-[#201a15] border border-[#ebdcc9] dark:border-[#382d24] text-[#3B281E] dark:text-white focus:outline-none focus:border-[#443126]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-[#7d6c5d] uppercase block mb-1">
                    Heure
                  </label>
                  <input
                    type="time"
                    value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-[#201a15] border border-[#ebdcc9] dark:border-[#382d24] text-[#3B281E] dark:text-white focus:outline-none focus:border-[#443126]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#7d6c5d] uppercase block mb-1">
                  Lieu / Clinique (optionnel)
                </label>
                <input
                  type="text"
                  value={eventLocation}
                  onChange={(e) => setEventLocation(e.target.value)}
                  placeholder="Ex: Hôpital Necker, Cabinet Dr. Martin..."
                  className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-[#201a15] border border-[#ebdcc9] dark:border-[#382d24] text-[#3B281E] dark:text-white focus:outline-none focus:border-[#443126]"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#7d6c5d] uppercase block mb-1">
                  Notes ou consignes médicales
                </label>
                <textarea
                  rows={3}
                  value={eventNotes}
                  onChange={(e) => setEventNotes(e.target.value)}
                  placeholder="Ex: Venir avec la vessie pleine, apporter ordonnance et carte vitale..."
                  className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-[#201a15] border border-[#ebdcc9] dark:border-[#382d24] text-[#3B281E] dark:text-white focus:outline-none focus:border-[#443126]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#e8dec8] dark:border-[#382d24]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#7d6c5d] hover:bg-[#F3ECE2] dark:hover:bg-[#342921] rounded-xl transition-colors cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-[#443126] hover:bg-[#3B281E] active:scale-95 rounded-xl transition-all shadow-sm cursor-pointer"
                >
                  {editingEventId ? 'Enregistrer les modifications' : '+ Ajouter l\'événement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
