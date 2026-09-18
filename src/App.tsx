import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { MobileNav } from './components/MobileNav';

// Pages
import { HomePage } from './pages/HomePage';
import { DashboardPage } from './pages/DashboardPage';
import { ComparePage } from './pages/ComparePage';
import { HistoryPage } from './pages/HistoryPage';

import { SatellitePage } from './pages/SatellitePage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { SettingsPage } from './pages/SettingsPage';

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
          </main>
        </div>

        {/* Mobile Bottom Navigation */}
        <MobileNav />
      </div>
    </BrowserRouter>
  );
}

