import React from 'react';
import { TabType } from '../types';
import { Home, Calendar, BookOpen, Activity, Baby, Share2, Moon, Sun } from 'lucide-react';

interface Props {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
  onOpenExport: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

export const Navbar: React.FC<Props> = ({
  currentTab,
  onTabChange,
  onOpenExport,
  isDark,
  onToggleTheme,
}) => {
  const navItems: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Accueil', icon: <Home className="w-4 h-4" /> },
    { id: 'timeline', label: 'Chronologie', icon: <Calendar className="w-4 h-4" /> },
    { id: 'guide', label: 'Guide & Glossaire', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'tools', label: 'Outils & Constantes', icon: <Activity className="w-4 h-4" /> },
    { id: 'baby', label: 'Bébé & Journal', icon: <Baby className="w-4 h-4" /> },
  ];

  return (
    <>
      {/* DESKTOP TOP BAR (Strict 3-Zone Contract with Light Brown styling) */}
      <header className="sticky top-0 z-40 bg-[#eee7de]/95 dark:bg-[#231d18]/95 backdrop-blur-md border-b border-[#ddcfc0] dark:border-[#382d24] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Brand wordmark (single line text element) */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => onTabChange('home')}
              className="text-left group cursor-pointer focus:outline-none"
            >
              <span className="text-xl font-bold tracking-tight text-[#2d221a] dark:text-[#f8f2eb] whitespace-nowrap block">
                B&amp;F
              </span>
              <span className="text-[11px] text-[#7d6857] dark:text-[#b09e90] font-mono tracking-tight block">
                com.aistudio.grossesse.mbtxyz
              </span>
            </button>
          </div>

          {/* Zone 2: 5 single-line navigation links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  type="button"
                  className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'text-[#2b1c11] dark:text-[#faeee6] bg-[#ded2c4] dark:bg-[#3d3128] font-semibold'
                      : 'text-[#614e3e] dark:text-[#d5c7b9] hover:text-[#2c1d12] dark:hover:text-white hover:bg-[#e4d8cb]/60 dark:hover:bg-[#342b23]/60'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 primary action & theme toggle */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={onToggleTheme}
              type="button"
              className="p-2 rounded-lg text-[#6b5849] hover:text-[#2d221a] dark:text-[#baa99b] dark:hover:text-white hover:bg-[#e4d8cb]/60 dark:hover:bg-[#342b23] transition-colors cursor-pointer"
              title={isDark ? 'Passer en mode clair' : 'Passer en mode sombre'}
              aria-label="Changer de thème"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              onClick={onOpenExport}
              type="button"
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-[#8a5732] hover:bg-[#744421] active:bg-[#5f3516] rounded-lg shadow-sm shadow-[#8a5732]/20 transition-all whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Exporter mes relevés</span>
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE FIXED BOTTOM TAB BAR (Ergonomic thumb zone) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#eee7de]/95 dark:bg-[#231d18]/95 backdrop-blur-lg border-t border-[#ddcfc0] dark:border-[#382d24] pb-safe">
        <div className="grid grid-cols-5 items-center h-16 px-1">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                type="button"
                className={`flex flex-col items-center justify-center h-full pt-1 pb-1 transition-colors ${
                  isActive
                    ? 'text-[#8a5732] dark:text-[#d99f74] font-semibold'
                    : 'text-[#7d6857] dark:text-[#a89688] hover:text-[#2d221a] dark:hover:text-white'
                }`}
              >
                <div className={`p-1 rounded-md ${isActive ? 'bg-[#ded2c4] dark:bg-[#3d3128]' : ''}`}>
                  {item.icon}
                </div>
                <span className="text-[10px] tracking-tight mt-0.5 truncate max-w-[64px]">
                  {item.label.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
