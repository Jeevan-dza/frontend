import React, { useState, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { MobileNav } from './components/MobileNav';

// Lazy-loaded Pages for sub-second initial bundle load
const HomePage = lazy(() => import('./pages/HomePage').then(m => ({ default: m.HomePage })));
const DashboardPage = lazy(() => import('./pages/DashboardPage').then(m => ({ default: m.DashboardPage })));
const ComparePage = lazy(() => import('./pages/ComparePage').then(m => ({ default: m.ComparePage })));
const HistoryPage = lazy(() => import('./pages/HistoryPage').then(m => ({ default: m.HistoryPage })));
const SatellitePage = lazy(() => import('./pages/SatellitePage').then(m => ({ default: m.SatellitePage })));
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage').then(m => ({ default: m.AnalyticsPage })));
const SettingsPage = lazy(() => import('./pages/SettingsPage').then(m => ({ default: m.SettingsPage })));

// Mission Telemetry Suspense Loader
const TelemetryLoader: React.FC = () => (
  <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
    <div className="relative w-16 h-16 mb-4">
      <div className="absolute inset-0 rounded-full border-2 border-cyan-500/20 animate-ping" />
      <div className="absolute inset-0 rounded-full border-2 border-t-cyan-400 border-r-transparent border-b-cyan-500 border-l-transparent animate-spin" />
      <div className="absolute inset-2 rounded-full border border-blue-500/40 border-dashed animate-spin [animation-direction:reverse] [animation-duration:4s]" />
    </div>
    <div className="font-tech text-cyan-300 font-bold text-sm tracking-widest uppercase">
      INITIALIZING MISSION VIEWPORT
    </div>
    <div className="font-mono text-slate-400 text-xs mt-1">
      Synthesizing Sentinel SAR &amp; MOSDAC Geospatial Pipeline...
    </div>
  </div>
);

export default function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#050816] text-[#F8FAFC] flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
        {/* Top Mission Header */}
        <Header 
          onToggleSidebar={() => setMobileOpen(!mobileOpen)}
          isSidebarOpen={mobileOpen}
        />

        <div className="flex-1 flex overflow-hidden">
          {/* Collapsible Sidebar Navigation */}
          <Sidebar
            collapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
            mobileOpen={mobileOpen}
            onCloseMobile={() => setMobileOpen(false)}
          />

          {/* Main Application Routes Viewport */}
          <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
            <Suspense fallback={<TelemetryLoader />}>
              <Routes>
                {/* Mission Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/compare" element={<ComparePage />} />
                <Route path="/history" element={<HistoryPage />} />
                <Route path="/satellite" element={<SatellitePage />} />
                <Route path="/analytics" element={<AnalyticsPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="*" element={<HomePage />} />
              </Routes>
            </Suspense>
          </main>
        </div>

        {/* Mobile Bottom Navigation */}
        <MobileNav />
      </div>
    </BrowserRouter>
  );
}

