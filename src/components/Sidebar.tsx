import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Home, 
  LayoutDashboard, 
  GitCompare, 
  Satellite, 
  FolderArchive, 
  BarChart3, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Radio
} from 'lucide-react';

const NAV_ITEMS = [
  {
    to: '/',
    label: 'Home',
    icon: Home,
    badge: null,
    description: 'AI Search & Mission Portal'
  },
  {
    to: '/dashboard',
    label: 'Analysis Dashboard',
    icon: LayoutDashboard,
    badge: 'LIVE',
    badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
    description: 'Interactive Map & AI Card'
  },
  {
    to: '/compare',
    label: 'Before vs After',
    icon: GitCompare,
    badge: 'STAR',
    badgeColor: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40',
    description: 'Dual Map Comparison Slider'
  },
  {
    to: '/history',
    label: 'Historical Disasters',
    icon: FolderArchive,
    badge: '4 EVENTS',
    badgeColor: 'bg-purple-500/20 text-purple-400 border-purple-500/40',
    description: 'Assam, Bihar, Wayanad, Punjab'
  },
  {
    to: '/satellite',
    label: 'Satellite Explorer',
    icon: Satellite,
    badge: 'SAR',
    badgeColor: 'bg-blue-500/20 text-blue-400 border-blue-500/40',
    description: 'Multi-Mission Tasking & Sensors'
  },
  {
    to: '/analytics',
    label: 'Geospatial Analytics',
    icon: BarChart3,
    badge: 'CHARTS',
    badgeColor: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40',
    description: 'Multi-Year Trends & River Basins'
  },
  {
    to: '/settings',
    label: 'Platform Settings',
    icon: Settings,
    badge: null,
    description: 'GIS Preferences & Profile'
  }
];

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile
}) => {
  const location = useLocation();
  const navItems = NAV_ITEMS;

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm md:hidden transition-opacity"
        />
      )}

      <aside
        className={`
          fixed md:static inset-y-0 left-0 z-40
          flex flex-col bg-[#070D1E] border-r border-slate-800/80
          transition-all duration-300 ease-in-out
          ${collapsed ? 'w-20' : 'w-64'}
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          h-[calc(100vh-3.5rem)]
        `}
      >
        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5">
          <div className="px-2 pb-2 text-[10px] font-mono uppercase tracking-widest text-slate-400 flex items-center justify-between">
            {!collapsed && <span>OPERATIONAL MODULES</span>}
            <span className="h-px bg-slate-800 flex-1 ml-2"></span>
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to || (item.to !== '/' && location.pathname.startsWith(item.to));

            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onCloseMobile}
                title={collapsed ? item.label : undefined}
                className={({ isActive }) => `
                  group relative flex items-center gap-3 px-3 py-2.5 rounded-xl
                  text-sm font-medium transition-all duration-200
                  ${isActive 
                    ? 'bg-gradient-to-r from-blue-600/20 to-cyan-500/10 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-950/50' 
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50 border border-transparent'
                  }
                `}
              >
                {/* Active side indicator glow */}
                {isActive && (
                  <span className="absolute -left-1 top-2 bottom-2 w-1.5 rounded-r bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
                )}

                <div className={`
                  p-1.5 rounded-lg transition-colors shrink-0
                  ${isActive 
                    ? 'bg-cyan-500/20 text-cyan-300' 
                    : 'bg-slate-800/40 text-slate-400 group-hover:text-cyan-400 group-hover:bg-slate-800'
                  }
                `}>
                  <Icon className="w-5 h-5" />
                </div>

                {!collapsed && (
                  <div className="flex-1 min-w-0 flex items-center justify-between">
                    <div className="truncate">
                      <div className="font-tech text-[13px] tracking-wide text-slate-200 group-hover:text-white font-medium">
                        {item.label}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">
                        {item.description}
                      </div>
                    </div>
                    {item.badge && (
                      <span className={`
                        ml-1.5 px-1.5 py-0.5 rounded text-[9px] font-mono font-semibold border shrink-0
                        ${item.badgeColor || 'bg-slate-800 text-slate-300 border-slate-700'}
                      `}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* System telemetry footer */}
        <div className="p-3 border-t border-slate-800/80 bg-[#050816]/70">
          {!collapsed ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span className="flex items-center gap-1.5 text-cyan-400">
                  <Radio className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
                  SAR INGESTION
                </span>
                <span className="text-emerald-400">ONLINE</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full w-[94%] rounded-full animate-pulse" />
              </div>
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1">
                <span>PYTORCH INFER: 42ms</span>
                <span>F1-SCORE: 96.8%</span>
              </div>
            </div>
          ) : (
            <div className="flex justify-center" title="System Online">
              <Radio className="w-5 h-5 text-cyan-400 animate-pulse" />
            </div>
          )}

          {/* Desktop collapse button */}
          <button
            onClick={onToggleCollapse}
            className="hidden md:flex mt-3 w-full items-center justify-center p-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-white text-xs font-mono transition-colors"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
      </aside>
    </>
  );
};
