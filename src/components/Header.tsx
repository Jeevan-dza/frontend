import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Radio, 
  Satellite, 
  Clock, 
  ShieldAlert, 
  Search, 
  Menu, 
  X, 
  Sliders, 
  Terminal,
  Activity,
  ChevronRight
} from 'lucide-react';

interface HeaderProps {
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar, isSidebarOpen }) => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentUtc, setCurrentUtc] = useState<string>('');
  const [quickQuery, setQuickQuery] = useState('');
  const [alertOpen, setAlertOpen] = useState(true);

  useEffect(() => {
    const updateTimes = () => {
      const now = new Date();
      // IST time
      setCurrentTime(
        now.toLocaleTimeString('en-IN', {
          timeZone: 'Asia/Kolkata',
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        })
      );
      // UTC time
      setCurrentUtc(
        now.toLocaleTimeString('en-US', {
          timeZone: 'UTC',
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        })
      );
    };
    updateTimes();
    const interval = setInterval(updateTimes, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickQuery.trim()) return;
    navigate(`/dashboard?q=${encodeURIComponent(quickQuery.trim())}`);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#050816]/90 backdrop-blur-xl">
      {/* Red Alert Banner */}
      {alertOpen && (
        <div className="bg-red-950/70 border-b border-red-500/30 px-3 py-1 text-xs text-red-200 flex items-center justify-between">
          <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            <span className="font-semibold text-red-300 font-mono tracking-wider">[ACTIVE SIH DISASTER ALERT]</span>
            <span className="truncate">Assam Brahmaputra Basin: Inundation detected across 4,210 km². RISAT-2BR1 radar pass active.</span>
            <Link 
              to="/compare" 
              className="ml-auto flex items-center gap-1 font-mono text-cyan-400 hover:text-cyan-300 underline underline-offset-2 shrink-0"
            >
              Analyze Before vs After <ChevronRight className="w-3 h-3" />
            </Link>
            <button 
              onClick={() => setAlertOpen(false)}
              className="ml-2 text-red-400 hover:text-white p-0.5"
              aria-label="Dismiss alert"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      <div className="flex h-14 items-center justify-between px-3 md:px-6">
        {/* Left: Mobile Toggle + Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="md:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors"
            aria-label="Toggle navigation menu"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="relative flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 p-0.5 shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-shadow">
              <div className="w-full h-full bg-[#050816] rounded-[7px] flex items-center justify-center">
                <Satellite className="w-5 h-5 text-cyan-400 transition-transform group-hover:rotate-12 duration-300" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-tech text-base md:text-lg font-bold tracking-wider text-white">
                  SATQUERY<span className="text-cyan-400">.AI</span>
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-blue-950/80 border border-blue-500/40 text-blue-300">
                  ISRO • ESA
                </span>
              </div>
              <p className="hidden md:block text-[10px] text-slate-400 font-mono tracking-tight -mt-0.5">
                AUTONOMOUS GEOSPATIAL INTELLIGENCE PLATFORM
              </p>
            </div>
          </Link>
        </div>

        {/* Center: Quick Query Bar */}
        <div className="hidden lg:flex flex-1 max-w-lg mx-6">
          <form onSubmit={handleQuickSearch} className="w-full relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={quickQuery}
              onChange={(e) => setQuickQuery(e.target.value)}
              placeholder="Ask Earth AI: 'Find flooded roads in Assam'..."
              className="w-full pl-9 pr-24 py-1.5 bg-[#0F172A]/90 border border-slate-700/70 rounded-lg text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 transition-all font-sans"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2 py-0.5 rounded text-[11px] font-mono bg-blue-600/30 text-blue-300 border border-blue-500/40 hover:bg-blue-600 hover:text-white transition-colors"
            >
              QUERY ↵
            </button>
          </form>
        </div>

        {/* Right: Telemetry, Clocks, Status */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Constellation Telemetry pill */}
          <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#0F172A] border border-slate-800 text-xs font-mono text-slate-300">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-emerald-400 font-semibold">5 ORBITERS LIVE</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">SAR RADAR 24/7</span>
          </div>

          {/* Mission Time Clock */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#0F172A] border border-slate-800 text-[11px] font-mono text-cyan-300">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <div className="flex flex-col text-right leading-none">
              <span>{currentTime || '00:00:00'} IST</span>
              <span className="text-[9px] text-slate-400">{currentUtc || '00:00:00'} UTC</span>
            </div>
          </div>

          <Link
            to="/dashboard"
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-medium tracking-wide shadow-md shadow-cyan-900/30 transition-all active:scale-95"
          >
            <Activity className="w-3.5 h-3.5" />
            <span>MISSION VIEW</span>
          </Link>
        </div>
      </div>
    </header>
  );
};
