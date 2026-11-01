import React, { useState } from 'react';
import { Calendar, Sparkles, User, Stethoscope, ChevronRight, ListFilter, Table, Layers } from 'lucide-react';
import { TIMELINE_WEEKS } from '../../data/pregnancyData';
import { OBSTETRIC_MILESTONES } from '../../data/consultationsData';
import { ThreeDWombVisualizer } from '../ThreeDWombVisualizer';

interface Props {
  currentWeek: number;
  onSelectWeek: (w: number) => void;
}

export const TimelineTab: React.FC<Props> = ({ currentWeek, onSelectWeek }) => {
  const [selectedTrimester, setSelectedTrimester] = useState<number | 'all'>('all');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [activeTabSub, setActiveTabSub] = useState<'weeks' | 'milestones'>('weeks');

  const filteredWeeks = TIMELINE_WEEKS.filter((w) => {
    if (selectedTrimester === 'all') return true;
    return w.trimester === selectedTrimester;
  });

  const activeWeekData = TIMELINE_WEEKS.find((w) => w.week === currentWeek) || TIMELINE_WEEKS[21];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Title & Subtitle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#8a5732] dark:text-[#d49970] font-semibold uppercase tracking-wider">
            <span>Chronologie Obstétricale &amp; Fœtale</span>
            <span aria-hidden="true">·</span>
            <span>Semaine 1 à 41 SA</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#2d221a] dark:text-white mt-0.5">
            Évolution Fœtale et Maternelle
          </h1>
        </div>

        {/* View mode toggle: Weeks vs Milestones */}
        <div className="flex items-center gap-1 p-1 bg-[#ede4d8] dark:bg-[#2b221b] rounded-xl self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTabSub('weeks')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTabSub === 'weeks'
                ? 'bg-white dark:bg-[#3d3127] text-[#2d221a] dark:text-white shadow-xs'
                : 'text-[#665444] dark:text-[#c4b5a6] hover:text-[#2d221a]'
            }`}
          >
            Semaine par Semaine
          </button>
          <button
            type="button"
            onClick={() => setActiveTabSub('milestones')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTabSub === 'milestones'
                ? 'bg-white dark:bg-[#3d3127] text-[#2d221a] dark:text-white shadow-xs'
                : 'text-[#665444] dark:text-[#c4b5a6] hover:text-[#2d221a]'
            }`}
          >
            Consultations Clés (8)
          </button>
        </div>
      </div>

      {/* 3D Womb Visualizer ("Dans le Ventre 3D") */}
      <ThreeDWombVisualizer currentWeek={currentWeek} onWeekChange={onSelectWeek} />

      {activeTabSub === 'weeks' ? (
        <>
          {/* Active Week Spotlight Card */}
          <div className="bg-white dark:bg-[#231d18] border border-[#e5dcd1] dark:border-[#382d24] rounded-2xl p-5 sm:p-7 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#eee5da] dark:border-[#382d24] gap-3">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-[#8a5732] dark:text-[#d49970] uppercase tracking-wider">
                  <span>{activeWeekData.trimester === 1 ? '1er Trimestre' : activeWeekData.trimester === 2 ? '2e Trimestre' : '3e Trimestre'}</span>
                  <span>·</span>
                  <span>Semaine d'Aménorrhée</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-[#2d221a] dark:text-white mt-0.5">
                  Semaine {activeWeekData.week} SA
                </h2>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-[11px] text-[#7d6c5d] dark:text-[#a8988a] uppercase tracking-wider block">Taille comparée</span>
                  <span className="text-sm font-bold text-[#2d221a] dark:text-white">{activeWeekData.sizeComparison}</span>
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-[#f4ece2] dark:bg-[#342921] text-[#784824] dark:text-[#eedacb] font-mono font-bold text-xs border border-[#e4d7c8] dark:border-[#47372b]">
                  {activeWeekData.approxSize}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              {/* Fetal Development */}
              <div className="p-4 rounded-xl bg-[#faf6f0] dark:bg-[#2b221b] border border-[#ebdcc9] dark:border-[#3d3128]">
                <div className="flex items-center gap-2 text-[#8a5732] dark:text-[#d49970] font-bold text-xs uppercase tracking-wider mb-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Développement Fœtal</span>
                </div>
                <p className="text-xs sm:text-sm text-[#3d2e23] dark:text-[#e4ded6] leading-relaxed">
                  {activeWeekData.fetalDevelopment}
                </p>
              </div>

              {/* Maternal Changes */}
              <div className="p-4 rounded-xl bg-[#faf6f0] dark:bg-[#2b221b] border border-[#ebdcc9] dark:border-[#3d3128]">
                <div className="flex items-center gap-2 text-[#7b4d29] dark:text-[#debba4] font-bold text-xs uppercase tracking-wider mb-2">
                  <User className="w-4 h-4" />
                  <span>Changements chez la Maman</span>
                </div>
                <p className="text-xs sm:text-sm text-[#3d2e23] dark:text-[#e4ded6] leading-relaxed">
                  {activeWeekData.maternalChanges}
                </p>
              </div>

              {/* Key Medical Milestone */}
              <div className="p-4 rounded-xl bg-[#faf6f0] dark:bg-[#2b221b] border border-[#ebdcc9] dark:border-[#3d3128]">
                <div className="flex items-center gap-2 text-sky-700 dark:text-sky-300 font-bold text-xs uppercase tracking-wider mb-2">
                  <Stethoscope className="w-4 h-4" />
                  <span>Jalon Médical Clé</span>
                </div>
                <p className="text-xs sm:text-sm text-[#3d2e23] dark:text-[#e4ded6] leading-relaxed">
                  {activeWeekData.medicalMilestone}
                </p>
              </div>
            </div>
          </div>

          {/* Filter Bar & View Mode Segmented Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            {/* Trimester Filters */}
            <div className="flex items-center gap-1.5 p-1 bg-[#ede4d8] dark:bg-[#2b221b] rounded-xl overflow-x-auto">
              <button
                type="button"
                onClick={() => setSelectedTrimester('all')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  selectedTrimester === 'all'
                    ? 'bg-white dark:bg-[#3d3127] text-[#2d221a] dark:text-white shadow-xs'
                    : 'text-[#665444] dark:text-[#c4b5a6] hover:text-[#2d221a]'
                }`}
              >
                Toutes les semaines (1-40 SA)
              </button>
              <button
                type="button"
                onClick={() => setSelectedTrimester(1)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  selectedTrimester === 1
                    ? 'bg-white dark:bg-[#3d3127] text-[#2d221a] dark:text-white shadow-xs'
                    : 'text-[#665444] dark:text-[#c4b5a6] hover:text-[#2d221a]'
                }`}
              >
                1er Trimestre (1-13)
              </button>
              <button
                type="button"
                onClick={() => setSelectedTrimester(2)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  selectedTrimester === 2
                    ? 'bg-white dark:bg-[#3d3127] text-[#2d221a] dark:text-white shadow-xs'
                    : 'text-[#665444] dark:text-[#c4b5a6] hover:text-[#2d221a]'
                }`}
              >
                2e Trimestre (14-26)
              </button>
              <button
                type="button"
                onClick={() => setSelectedTrimester(3)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  selectedTrimester === 3
                    ? 'bg-white dark:bg-[#3d3127] text-[#2d221a] dark:text-white shadow-xs'
                    : 'text-[#665444] dark:text-[#c4b5a6] hover:text-[#2d221a]'
                }`}
              >
                3e Trimestre (27-40)
              </button>
            </div>

            {/* Display View Mode Switch: Cards vs Full Table */}
            <div className="flex items-center gap-1 self-end sm:self-auto">
              <button
                type="button"
                onClick={() => setViewMode('cards')}
                className={`p-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  viewMode === 'cards'
                    ? 'bg-[#ecdccb] text-[#5e3518] dark:bg-[#3d3025] dark:text-[#f3dfcf]'
                    : 'text-[#7d6c5d] hover:text-[#2d221a] dark:text-[#a8988a]'
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
                    ? 'bg-[#ecdccb] text-[#5e3518] dark:bg-[#3d3025] dark:text-[#f3dfcf]'
                    : 'text-[#7d6c5d] hover:text-[#2d221a] dark:text-[#a8988a]'
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
                        ? 'bg-[#fbf7f1] dark:bg-[#2d231b] border-[#8a5732] shadow-md ring-2 ring-[#8a5732]/20'
                        : 'bg-white dark:bg-[#231d18] border-[#e5dcd1] dark:border-[#382d24] hover:border-[#bda58d] dark:hover:border-[#6a5445] hover:shadow-xs'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-[#eee5da] dark:border-[#382d24]">
                      <div>
                        <span className="text-[11px] font-semibold text-[#8a5732] dark:text-[#d49970] uppercase tracking-wide">
                          {item.trimester === 1 ? 'T1' : item.trimester === 2 ? 'T2' : 'T3'}
                        </span>
                        <h3 className="font-bold text-base text-[#2d221a] dark:text-white">
                          Semaine {item.week} SA
                        </h3>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-semibold text-[#2d221a] dark:text-white block truncate max-w-[120px]">
                          {item.sizeComparison}
                        </span>
                        <span className="text-[11px] font-mono text-[#7d6c5d] dark:text-[#a8988a]">{item.approxSize}</span>
                      </div>
                    </div>

                    <div className="mt-3 space-y-2 text-xs">
                      <div>
                        <strong className="text-[#2d221a] dark:text-[#f2ebe4]">Fœtus : </strong>
                        <span className="text-[#5c4c3e] dark:text-[#c4b5a6] leading-relaxed">
                          {item.fetalDevelopment}
                        </span>
                      </div>
                      <div>
                        <strong className="text-[#2d221a] dark:text-[#f2ebe4]">Maman : </strong>
                        <span className="text-[#5c4c3e] dark:text-[#c4b5a6] leading-relaxed">
                          {item.maternalChanges}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 pt-2.5 border-t border-[#eee5da] dark:border-[#382d24] flex items-center justify-between text-[11px] text-[#7d6c5d]">
                      <span className="truncate max-w-[200px] italic">{item.medicalMilestone}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-[#8a5732] shrink-0" />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Table View */
            <div className="bg-white dark:bg-[#231d18] border border-[#e5dcd1] dark:border-[#382d24] rounded-2xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#f4ede3] dark:bg-[#2e241c] border-b border-[#e2d5c4] dark:border-[#3d3128] text-[#5c4a3b] dark:text-[#d9ccc0] font-semibold uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-4">SA</th>
                      <th className="py-3 px-4">Trimestre</th>
                      <th className="py-3 px-4">Taille Fœtale Comparée</th>
                      <th className="py-3 px-4 min-w-[240px]">Développement du Fœtus</th>
                      <th className="py-3 px-4 min-w-[220px]">Changements Maman</th>
                      <th className="py-3 px-4 min-w-[220px]">Jalons Médicaux Clés</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#eee5da] dark:divide-[#382d24] text-[#3d2e23] dark:text-[#ded5cc]">
                    {filteredWeeks.map((row) => {
                      const isCurrent = row.week === currentWeek;
                      return (
                        <tr
                          key={row.week}
                          onClick={() => onSelectWeek(row.week)}
                          className={`hover:bg-[#f6eee4]/60 dark:hover:bg-[#2a221b]/60 cursor-pointer transition-colors ${
                            isCurrent ? 'bg-[#fbf7f1] dark:bg-[#33281e] font-medium' : ''
                          }`}
                        >
                          <td className="py-3 px-4 font-bold font-mono text-[#2d221a] dark:text-white whitespace-nowrap">
                            {row.week} SA
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            {row.trimester === 1 ? '1er Trim.' : row.trimester === 2 ? '2e Trim.' : '3e Trim.'}
                          </td>
                          <td className="py-3 px-4 font-semibold text-[#2d221a] dark:text-white whitespace-nowrap">
                            {row.sizeComparison} <span className="text-[#7d6c5d] font-normal">({row.approxSize})</span>
                          </td>
                          <td className="py-3 px-4 leading-relaxed">{row.fetalDevelopment}</td>
                          <td className="py-3 px-4 leading-relaxed">{row.maternalChanges}</td>
                          <td className="py-3 px-4 leading-relaxed text-[#8a5732] dark:text-[#d49970] font-medium">
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
        </>
      ) : (
        /* Obstetric Milestones */
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-[#f5ece1] dark:bg-[#2d231b] border border-[#e2d5c4] dark:border-[#403327] text-xs text-[#5c3c21] dark:text-[#eedacb]">
            <strong>Calendrier Prénatal Officiel :</strong> 8 étapes médicales et consultations obligatoires de la fertilité au terme, conformément aux recommandations de la Haute Autorité de Santé (HAS).
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {OBSTETRIC_MILESTONES.map((item, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-[#231d18] border border-[#e5dcd1] dark:border-[#382d24] rounded-2xl p-5 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs pb-2 border-b border-[#eee5da] dark:border-[#382d24]">
                    <span className="font-mono font-bold text-[#8a5732] dark:text-[#d49970]">
                      {item.period}
                    </span>
                    <span className="text-[#7d6c5d] dark:text-[#a8988a] text-[11px]">{item.location}</span>
                  </div>

                  <h3 className="font-bold text-base text-[#2d221a] dark:text-white mt-2.5">
                    {item.title}
                  </h3>

                  <p className="text-xs text-[#5c4c3e] dark:text-[#c4b5a6] mt-2 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="mt-4 space-y-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#7d6c5d] block">
                      Examens Clés &amp; Prescriptions :
                    </span>
                    {item.keyExams.map((exam, eIdx) => (
                      <div key={eIdx} className="flex items-center gap-2 text-xs text-[#2d221a] dark:text-[#ded5cc]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#8a5732] shrink-0" />
                        <span>{exam}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-[#eee5da] dark:border-[#382d24] flex justify-between items-center text-xs text-[#7d6c5d]">
                  <span>Étape obligatoire</span>
                  <span className="font-mono">HAS / CNGOF</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
