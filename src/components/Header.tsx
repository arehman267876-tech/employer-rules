import React, { useState } from 'react';
import {
  Clock,
  Calendar,
  FileText,
  TableProperties,
  ShieldCheck,
  Moon,
  Sun,
  Menu,
  X,
  Scale,
  LayoutDashboard
} from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  isAdmin?: boolean;
  setActiveTab?: (tab: string) => void;
  onSelectTab?: (tab: string) => void;
  isDarkMode: boolean;
  setIsDarkMode?: (dark: boolean) => void;
  onToggleDarkMode?: () => void;
  onOpenStateDirectory?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  isAdmin = false,
  setActiveTab,
  onSelectTab,
  isDarkMode,
  setIsDarkMode,
  onToggleDarkMode
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleTabChange = (tab: string) => {
    if (setActiveTab) setActiveTab(tab);
    if (onSelectTab) onSelectTab(tab);
    setMobileMenuOpen(false);
  };

  const handleToggleDark = () => {
    if (onToggleDarkMode) onToggleDarkMode();
    else if (setIsDarkMode) setIsDarkMode(!isDarkMode);
  };

  const navItems = [
    {
      id: 'overtime',
      name: 'Overtime',
      fullName: 'Overtime Calculator',
      desc: 'FLSA 40-hour rule, California daily/7th day & state rules',
      icon: Clock
    },
    {
      id: 'final-paycheck',
      name: 'Final Paycheck',
      fullName: 'Final Paycheck Finder',
      desc: 'Discharge vs resignation deadlines & waiting penalties',
      icon: Calendar
    },
    {
      id: '1099',
      name: '1099 Checker',
      fullName: '1099 Filing Checker',
      desc: '2026 ($2,000) vs 2025 ($600) filing requirements',
      icon: FileText
    },
    {
      id: 'compare',
      name: '50-State Matrix',
      fullName: '50-State Labor Matrix',
      desc: 'State-by-state wage and statutory comparisons',
      icon: TableProperties
    },
        {
      id: 'trust',
      name: 'Legal Policy',
      fullName: 'Verification Policy & SLA',
      desc: 'Counsel-audited records & 7-day correction SLA',
      icon: ShieldCheck
    },
    
    
    {
      id: isAdmin ? 'admin' : 'admin-login',
      name: isAdmin ? 'Admin' : 'Admin Login',
      fullName: isAdmin ? 'Admin Dashboard' : 'Admin Login',
      desc: 'Manage rules, users and activity',
      icon: LayoutDashboard
    }
  ];
  

  return (
    <header
      id="app-header"
      className={`sticky top-0 z-50 transition-colors border-b ${
        isDarkMode
          ? 'bg-[#18181B]/95 border-neutral-800 text-neutral-100'
          : 'bg-white/95 border-neutral-200 text-neutral-900'
      } backdrop-blur-md`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3 sm:gap-6">
          {/* Brand Logo: EmployerRules */}
          <div className="flex items-center gap-6 shrink-0">
            <button
              id="brand-logo-btn"
              onClick={() => handleTabChange('overtime')}
              className="flex items-center gap-2.5 focus:outline-none group text-left"
            >
              {/* Modern geometric scales logo */}
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FF6200] to-[#E55800] text-white flex items-center justify-center font-bold shadow-sm shadow-orange-500/20 group-hover:scale-105 transition-transform shrink-0">
                <Scale className="w-4 h-4 text-white" />
              </div>

              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-neutral-900 dark:text-white whitespace-nowrap">
                  EmployerRules<span className="text-[#FF6200]">.</span>
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-orange-100 text-[#FF6200] dark:bg-orange-950/50 dark:text-orange-400 whitespace-nowrap hidden sm:inline-block">
                  USA
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Tabs - Single row, clean whitespace-nowrap */}
          <nav className="hidden xl:flex items-center gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id)}
                  className={`px-3 py-2 text-sm font-semibold rounded-lg transition-all flex items-center gap-2 whitespace-nowrap ${
                    isActive
                      ? 'bg-orange-50 dark:bg-orange-950/40 text-[#FF6200] shadow-xs'
                      : 'text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800/60'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive ? 'text-[#FF6200]' : 'text-neutral-400 dark:text-neutral-500'
                    }`}
                  />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>

          {/* Compact Tablet Navigation (lg screens, slightly shorter labels) */}
          <nav className="hidden lg:flex xl:hidden items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id)}
                  className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
                    isActive
                      ? 'bg-orange-50 dark:bg-orange-950/40 text-[#FF6200]'
                      : 'text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800/60'
                  }`}
                >
                  <Icon
                    className={`w-3.5 h-3.5 shrink-0 ${
                      isActive ? 'text-[#FF6200]' : 'text-neutral-400'
                    }`}
                  />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Area: Status badge & theme toggle */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* 2026 USA Status Badge */}
            <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-bold text-neutral-700 dark:text-neutral-300 px-2.5 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 border border-neutral-200/80 dark:border-neutral-700 whitespace-nowrap">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>2026 USA Rules</span>
            </div>

            {/* Dark / Light Mode Toggle */}
            <button
              onClick={handleToggleDark}
              className="p-2 rounded-lg text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              aria-label="Open navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-3 border-t border-neutral-200 dark:border-neutral-800 space-y-1 animate-in fade-in slide-in-from-top-1 duration-150">
            <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
              USA Compliance Calculators
            </div>
            {navItems.map((tool) => {
              const Icon = tool.icon;
              const isActive = activeTab === tool.id;
              return (
                <button
                  key={tool.id}
                  onClick={() => handleTabChange(tool.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                    isActive
                      ? 'bg-orange-50 text-[#FF6200] dark:bg-orange-950/40 font-bold'
                      : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-[#FF6200]" />
                    <span className="whitespace-nowrap">{tool.fullName}</span>
                  </div>
                  {tool.id === 'overtime' && (
                    <span className="text-[10px] bg-orange-100 text-[#FF6200] dark:bg-orange-900/50 dark:text-orange-300 px-2 py-0.5 rounded-full font-bold">
                      Popular
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
};
