import React, { useState, useEffect } from 'react';
import { AdminLogin } from './components/AdminLogin';
import { trackUserActivity } from './lib/activityTracker';
import { supabase } from './lib/supabaseClient';
import { AdminPanel } from './components/AdminPanel';
import { Header } from './components/Header';
import { PreviewBanner } from './components/PreviewBanner';
import { ToolHub } from './components/ToolHub';
import { FinalPaycheckTool } from './components/FinalPaycheckTool';
import { OvertimeTool } from './components/OvertimeTool';
import { Form1099Tool } from './components/Form1099Tool';
import { StateComparisonTable } from './components/StateComparisonTable';
import { StateDetailModal } from './components/StateDetailModal';
import { TrustSection } from './components/TrustSection';
import { Footer } from './components/Footer';

export default function App() {
  const [activeTab, setActiveTab] = useState<
  'hub' | 'final-paycheck' | 'overtime' | '1099' | 'compare' | 'trust' | 'admin' | 'admin-login'
>('overtime');

  const [selectedState, setSelectedState] = useState<string>('CA');
  const [isAdmin, setIsAdmin] = useState(false);

useEffect(() => {
  const checkAdmin = async () => {
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      setIsAdmin(false);
      return;
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    setIsAdmin(profile?.role === 'admin');
  };

  checkAdmin();
}, []);
  const [deepDiveStateCode, setDeepDiveStateCode] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('theme');
      if (stored) return stored === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  const handleStateSelectFromAnywhere = (code: string) => {
    setSelectedState(code);
    setActiveTab('final-paycheck');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FFF9F5] dark:bg-[#121214] text-neutral-900 dark:text-neutral-100 font-sans antialiased flex flex-col transition-colors duration-200 selection:bg-orange-500/20 selection:text-[#FF6200]">
      {/* Top Compliance Notice Banner */}
      <PreviewBanner onOpenTrust={() => setActiveTab('trust')} />

      {/* Main SaaS Navigation Header */}
      <Header
  activeTab={activeTab}
  isAdmin={isAdmin}
        onSelectTab={async (tab) => {
  setActiveTab(tab as any);
  await trackUserActivity('navigation', {
    destination: tab,
  });
  window.scrollTo({ top: 0, behavior: 'smooth' });
}}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
      />

      {/* Main Content Area */}
      <main id="main-content" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {activeTab === 'hub' && (
          <ToolHub
            onSelectTool={(toolKey) => {
              setActiveTab(toolKey as any);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSelectState={handleStateSelectFromAnywhere}
          />
        )}

        {activeTab === 'overtime' && (
          <OvertimeTool />
        )}

        {activeTab === 'final-paycheck' && (
          <FinalPaycheckTool
            selectedStateCode={selectedState}
            onStateSelect={(code) => setSelectedState(code)}
            onOpenStateDeepDive={(code) => setDeepDiveStateCode(code)}
            onOpenStateComparison={() => {
              setActiveTab('compare');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeTab === '1099' && (
          <Form1099Tool />
        )}

        {activeTab === 'compare' && (
          <StateComparisonTable
            onSelectState={handleStateSelectFromAnywhere}
            onOpenStateDeepDive={(code) => setDeepDiveStateCode(code)}
          />
        )}

        {activeTab === 'trust' && (
          <TrustSection />
        )}
        {activeTab === 'admin-login' && <AdminLogin />}
        {activeTab === 'admin' && <AdminPanel />}
      </main>

      {/* Detailed Modal if triggered */}
      {deepDiveStateCode && (
        <StateDetailModal
          stateCode={deepDiveStateCode}
          onClose={() => setDeepDiveStateCode(null)}
          onSelectForCalculator={(code) => {
            setSelectedState(code);
            setDeepDiveStateCode(null);
            setActiveTab('final-paycheck');
          }}
        />
      )}

      {/* Modern SaaS Footer */}
      <Footer
        onNavigate={(tab) => {
          setActiveTab(tab as any);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
}
