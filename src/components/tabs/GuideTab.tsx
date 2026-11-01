import React, { useState } from 'react';
import {
  AlertOctagon,
  Apple,
  Pill,
  Droplets,
  BookOpen,
  Search,
  ShieldAlert,
  ChevronRight,
  ExternalLink,
  Info,
} from 'lucide-react';
import {
  FOOD_RESTRICTIONS,
  HYGIENE_AND_NUTRITION,
  WARNING_SIGNS,
  GLOSSARY_ITEMS,
} from '../../data/guidelinesData';

interface Props {}

export const GuideTab: React.FC<Props> = () => {
  const [glossaryQuery, setGlossaryQuery] = useState('');
  const [selectedSubTab, setSelectedSubTab] = useState<'nutrition' | 'warnings' | 'glossary'>('nutrition');

  const filteredGlossary = GLOSSARY_ITEMS.filter(
    (item) =>
      item.term.toLowerCase().includes(glossaryQuery.toLowerCase()) ||
      item.definition.toLowerCase().includes(glossaryQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#8a5732] dark:text-[#d49970] font-semibold uppercase tracking-wider">
            <span>Guide Médical &amp; Hygiène de Vie</span>
            <span aria-hidden="true">·</span>
            <span>Référentiel Santé Maternelle</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#2d221a] dark:text-white mt-0.5">
            Règles Nutritionnelles, Alertes &amp; Glossaire
          </h1>
        </div>

        {/* Sub-tabs switch */}
        <div className="flex items-center gap-1 p-1 bg-[#ede4d8] dark:bg-[#2b221b] rounded-xl self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setSelectedSubTab('nutrition')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              selectedSubTab === 'nutrition'
                ? 'bg-white dark:bg-[#3d3127] text-[#2d221a] dark:text-white shadow-xs'
                : 'text-[#665444] dark:text-[#c4b5a6] hover:text-[#2d221a]'
            }`}
          >
            Nutrition &amp; Hygiène
          </button>
          <button
            type="button"
            onClick={() => setSelectedSubTab('warnings')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              selectedSubTab === 'warnings'
                ? 'bg-white dark:bg-[#3d3127] text-[#2d221a] dark:text-white shadow-xs'
                : 'text-[#665444] dark:text-[#c4b5a6] hover:text-[#2d221a]'
            }`}
          >
            Signaux d'Alerte (7)
          </button>
          <button
            type="button"
            onClick={() => setSelectedSubTab('glossary')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              selectedSubTab === 'glossary'
                ? 'bg-white dark:bg-[#3d3127] text-[#2d221a] dark:text-white shadow-xs'
                : 'text-[#665444] dark:text-[#c4b5a6] hover:text-[#2d221a]'
            }`}
          >
            Glossaire Obstétrical
          </button>
        </div>
      </div>

      {selectedSubTab === 'nutrition' && (
        <div className="space-y-6">
          {/* Foods to Avoid Absolument (Interdictions) */}
          <div className="bg-white dark:bg-[#231d18] border border-[#e5dcd1] dark:border-[#382d24] rounded-2xl p-5 sm:p-7 shadow-xs">
            <div className="flex items-center gap-3 pb-4 border-b border-[#eee5da] dark:border-[#382d24]">
              <div className="w-10 h-10 rounded-xl bg-[#f4ece2] dark:bg-[#342921] text-[#784824] dark:text-[#eedacb] flex items-center justify-center shrink-0">
                <AlertOctagon className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#2d221a] dark:text-white">
                  Aliments à Éviter Absolument (Interdictions Médicales)
                </h2>
                <p className="text-xs text-[#7d6c5d] dark:text-[#a8988a]">
                  Prévention de la toxoplasmose, de la listériose et des intoxications bactériennes
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
              {FOOD_RESTRICTIONS.map((food, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-[#faf6f0] dark:bg-[#2b221b] border border-[#ebdcc9] dark:border-[#3d3128] text-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-[11px] font-semibold text-[#8a5732] dark:text-[#d49970] uppercase tracking-wide">
                      <span>{food.category}</span>
                      <span className="text-[10px] bg-[#ecdccb] dark:bg-[#3d3025] text-[#5e3518] dark:text-[#f3dfcf] px-1.5 py-0.5 rounded font-medium">Proscrit</span>
                    </div>
                    <h3 className="font-bold text-sm text-[#2d221a] dark:text-white mt-1">
                      {food.title}
                    </h3>
                    <p className="text-[#665444] dark:text-[#bdafa2] mt-1 italic">
                      Exemples : {food.examples}
                    </p>
                    <div className="mt-2.5 p-2 rounded bg-white/80 dark:bg-[#231d18]/80 border border-[#ebdcc9] dark:border-[#3d3128]">
                      <strong className="text-[#6d4021] dark:text-[#edd4c2] block text-[11px]">Risque infectieux :</strong>
                      <span className="text-[#5c3c21] dark:text-[#d9ccc0]">{food.risk}</span>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-[#ebdcc9] dark:border-[#3d3128] text-[11px] text-[#2d221a] dark:text-[#ded5cc]">
                    <strong>Règle : </strong>{food.recommendation}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Fruits, Légumes & Suppléments & Hydratation */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Fruits & Légumes */}
            <div className="bg-white dark:bg-[#231d18] border border-[#e5dcd1] dark:border-[#382d24] rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-sm mb-3">
                  <Apple className="w-4 h-4" />
                  <span>Fruits et Légumes Crus</span>
                </div>
                <p className="text-xs text-[#5c4c3e] dark:text-[#c4b5a6] leading-relaxed">
                  {HYGIENE_AND_NUTRITION.fruitVeg}
                </p>
              </div>
              <div className="mt-4 p-2.5 rounded-lg bg-[#edf3ea] dark:bg-[#253224] border border-[#d2e2cd] dark:border-[#334631] text-[11px] text-emerald-900 dark:text-emerald-200">
                <strong>Conseil toxoplasmose :</strong> Portez des gants pour jardiner et pour nettoyer le bac à litière des chats.
              </div>
            </div>

            {/* Suppléments Recommandés */}
            <div className="bg-white dark:bg-[#231d18] border border-[#e5dcd1] dark:border-[#382d24] rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-[#7b4d29] dark:text-[#debba4] font-bold text-sm mb-3">
                  <Pill className="w-4 h-4" />
                  <span>Suppléments Recommandés</span>
                </div>
                <div className="space-y-3">
                  {HYGIENE_AND_NUTRITION.supplements.map((s, idx) => (
                    <div key={idx} className="text-xs pb-2 border-b border-[#eee5da] dark:border-[#382d24] last:border-0 last:pb-0">
                      <p className="font-semibold text-[#2d221a] dark:text-white">{s.name}</p>
                      <p className="text-[11px] text-[#7d6c5d] dark:text-[#a8988a] mt-0.5">{s.timing}</p>
                      <p className="text-[#5c4c3e] dark:text-[#c4b5a6] mt-0.5 italic">{s.purpose}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Hydratation et Boissons */}
            <div className="bg-white dark:bg-[#231d18] border border-[#e5dcd1] dark:border-[#382d24] rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-sky-700 dark:text-sky-400 font-bold text-sm mb-3">
                  <Droplets className="w-4 h-4" />
                  <span>Hydratation &amp; Boissons</span>
                </div>
                <ul className="space-y-2 text-xs text-[#5c4c3e] dark:text-[#c4b5a6]">
                  {HYGIENE_AND_NUTRITION.hydration.map((h, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-600 mt-1.5 shrink-0" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-4 p-2.5 rounded-lg bg-[#eef3f7] dark:bg-[#212d38] border border-[#cbe0ec] dark:border-[#2f3e4e] text-[11px] text-sky-900 dark:text-sky-200">
                <strong>Zéro alcool :</strong> Recommandation absolue de l'OMS dès le projet de conception.
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedSubTab === 'warnings' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-[#7a4825] via-[#8c5630] to-[#5e3417] text-white rounded-2xl p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg shadow-[#7a4825]/20">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#faede1]">
                <ShieldAlert className="w-4 h-4" />
                <span>Protocoles d'Urgence Immédiate</span>
              </div>
              <h2 className="text-xl font-bold text-white mt-1">
                Signaux d'Alerte Médicale (Urgences Maternité)
              </h2>
              <p className="text-xs text-[#f6e5d5] mt-1 max-w-xl">
                La présence d'un seul de ces signes justifie une consultation sans délai aux urgences de votre maternité de rattachement ou un appel au SAMU (15).
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
              <a
                href="tel:15"
                className="px-4 py-2.5 rounded-xl bg-white text-[#6d4021] hover:bg-[#faf6f0] font-bold text-xs shadow-md whitespace-nowrap transition-all flex items-center gap-1.5"
              >
                <span>Appel SAMU (15)</span>
              </a>
              <a
                href="tel:112"
                className="px-4 py-2.5 rounded-xl bg-[#2d221a] hover:bg-[#3d3127] text-white font-bold text-xs whitespace-nowrap transition-all border border-white/20"
              >
                <span>Urgence 112</span>
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {WARNING_SIGNS.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-[#231d18] border border-[#e5dcd1] dark:border-[#382d24] rounded-2xl p-5 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-[#eee5da] dark:border-[#382d24]">
                    <span className="text-xs font-bold text-[#8a5732] dark:text-[#d49970] uppercase tracking-wider">
                      {item.urgency}
                    </span>
                    <span className="text-[10px] font-mono bg-[#f4ece2] dark:bg-[#342921] text-[#784824] dark:text-[#eedacb] px-2 py-0.5 rounded">
                      Obstétrique
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-[#2d221a] dark:text-white mt-3">
                    {item.title}
                  </h3>

                  <p className="text-xs text-[#5c4c3e] dark:text-[#c4b5a6] mt-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#eee5da] dark:border-[#382d24] flex justify-between items-center text-xs">
                  <span className="text-[#7d6c5d]">Conduite à tenir :</span>
                  <span className="font-semibold text-[#8a5732] dark:text-[#d49970]">Ne pas attendre le lendemain</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedSubTab === 'glossary' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-[#231d18] border border-[#e5dcd1] dark:border-[#382d24] rounded-2xl p-5 sm:p-7 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#eee5da] dark:border-[#382d24]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#f4ece2] dark:bg-[#342921] text-[#784824] dark:text-[#eedacb] flex items-center justify-center shrink-0">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[#2d221a] dark:text-white">
                    Glossaire Médical Obstétrical
                  </h2>
                  <p className="text-xs text-[#7d6c5d] dark:text-[#a8988a]">
                    Définitions claires et validées des termes obstétricaux et échographiques
                  </p>
                </div>
              </div>

              {/* Search Bar */}
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-[#8a5732] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Rechercher un terme (ex: DPNI, SA, SGB)..."
                  value={glossaryQuery}
                  onChange={(e) => setGlossaryQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-[#faf6f0] dark:bg-[#2b221b] border border-[#ebdcc9] dark:border-[#3d3128] text-[#2d221a] dark:text-white placeholder:text-[#9e8d7f] focus:outline-none focus:border-[#8a5732]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              {filteredGlossary.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-[#faf6f0] dark:bg-[#2b221b] border border-[#ebdcc9] dark:border-[#3d3128] text-xs flex flex-col justify-between"
                >
                  <div>
                    <h3 className="font-bold text-sm text-[#2d221a] dark:text-white pb-2 border-b border-[#ebdcc9] dark:border-[#3d3128]">
                      {item.term}
                    </h3>
                    <p className="text-[#5c4c3e] dark:text-[#c4b5a6] mt-2.5 leading-relaxed">
                      {item.definition}
                    </p>
                  </div>
                  <div className="mt-3 text-[11px] text-[#7d6c5d] text-right">
                    Terme médical officiel
                  </div>
                </div>
              ))}
            </div>

            {filteredGlossary.length === 0 && (
              <div className="text-center py-10 text-xs text-[#7d6c5d]">
                Aucun résultat pour "{glossaryQuery}". Essayez avec "SA", "DPA" ou "DPNI".
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
