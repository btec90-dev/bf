import React from 'react';
import { TabType } from '../types';
import {
  Home,
  TrendingUp,
  Activity,
  BookOpen,
  CheckSquare,
  FileDown,
  Moon,
  Sun,
  Globe,
} from 'lucide-react';

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
    { id: 'chrono', label: 'Chrono', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'suivi', label: 'Suivi', icon: <Activity className="w-4 h-4" /> },
    { id: 'guide', label: 'Guide', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'trousseau', label: 'Trousseau', icon: <CheckSquare className="w-4 h-4" /> },
  ];

  return (
    <>
      {/* TOP HEADER BAR (Light brown / sand tone matching palette #F3ECE2 / #E8DEC8) */}
      <header className="sticky top-0 z-40 bg-[#F3ECE2]/95 dark:bg-[#231d18]/95 backdrop-blur-md border-b border-[#E8DEC8] dark:border-[#382d24] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between gap-4">
          {/* Left: Avatar + Title & Subtitle */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Mother & Baby Silhouette Avatar */}
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#E8DEC8] dark:bg-[#342921] border border-[#d6c7b2] dark:border-[#47372b] flex items-center justify-center text-[#443126] dark:text-[#eedacb] shadow-xs shrink-0 overflow-hidden">
              <svg
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8 text-[#443126] dark:text-[#eedacb]"
                aria-label="Avatar Maman et Bébé"
              >
                <circle cx="20" cy="13" r="6" fill="currentColor" fillOpacity="0.85" />
                <path
                  d="M10 34C10 27.3726 14.4772 22 20 22C25.5228 22 30 27.3726 30 34"
                  stroke="currentColor"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                <circle cx="26" cy="22" r="3.5" fill="#C59A7A" />
                <path
                  d="M23 31C23 27.6863 25.6863 25 29 25"
                  stroke="#C59A7A"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <button
              type="button"
              onClick={() => onTabChange('home')}
              className="text-left group cursor-pointer focus:outline-none"
            >
              <span className="text-xl sm:text-2xl font-black tracking-tight text-[#443126] dark:text-[#f8f2eb] whitespace-nowrap block group-hover:text-[#6a4f3b] transition-colors">
                B&amp;F
              </span>
              <span className="text-[11px] sm:text-xs text-[#7d6c5d] dark:text-[#b09e90] font-medium tracking-tight block truncate max-w-[220px] sm:max-w-none">
                Maman &amp; Bébé · Un jour, un pas, un battement de cœur à la fois
              </span>
            </button>
          </div>

          {/* Desktop Nav Links (5 Tabs) */}
          <nav className="hidden lg:flex items-center gap-1.5">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  type="button"
                  className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                    isActive
                      ? 'text-[#FFFDF8] bg-[#443126] dark:bg-[#eedacb] dark:text-[#2d221a] shadow-xs'
                      : 'text-[#5c4c3e] dark:text-[#d5c7b9] hover:text-[#3B281E] dark:hover:text-white hover:bg-[#E8DEC8]/60 dark:hover:bg-[#342b23]/60'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right: Quick Action Icons (PDF Export, Language FR, Theme) */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Language Selector */}
            <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#E8DEC8]/60 dark:bg-[#342921] border border-[#d6c7b2] dark:border-[#47372b] text-xs font-bold text-[#443126] dark:text-[#eedacb]">
              <Globe className="w-3.5 h-3.5" />
              <span>FR</span>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={onToggleTheme}
              type="button"
              className="p-2 rounded-xl text-[#6b5849] hover:text-[#2d221a] dark:text-[#baa99b] dark:hover:text-white hover:bg-[#E8DEC8]/60 dark:hover:bg-[#342921] transition-colors cursor-pointer"
              title={isDark ? 'Passer en mode clair' : 'Passer en mode sombre'}
              aria-label="Changer de thème"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* PDF Export Button */}
            <button
              onClick={onOpenExport}
              type="button"
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-white bg-[#443126] hover:bg-[#3B281E] active:scale-95 rounded-xl shadow-xs transition-all whitespace-nowrap shrink-0 cursor-pointer"
              title="Exporter les relevés en PDF / CSV / JSON"
            >
              <FileDown className="w-4 h-4" />
              <span className="hidden sm:inline">Export PDF</span>
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE FIXED BOTTOM NAVIGATION BAR (5 Tabs) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#F3ECE2]/95 dark:bg-[#231d18]/95 backdrop-blur-lg border-t border-[#E8DEC8] dark:border-[#382d24] pb-safe">
        <div className="grid grid-cols-5 items-center h-16 px-1">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                type="button"
                className={`flex flex-col items-center justify-center h-full pt-1 pb-1 transition-colors cursor-pointer ${
                  isActive
                    ? 'text-[#443126] dark:text-[#eedacb] font-bold'
                    : 'text-[#7d6c5d] dark:text-[#a89688] hover:text-[#3B281E] dark:hover:text-white'
                }`}
              >
                <div
                  className={`p-1.5 rounded-xl transition-all ${
                    isActive ? 'bg-[#E8DEC8] dark:bg-[#3d3128] scale-105' : ''
                  }`}
                >
                  {item.icon}
                </div>
                <span className="text-[10px] tracking-tight mt-0.5 truncate max-w-[64px]">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
