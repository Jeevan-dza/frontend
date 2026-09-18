import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  LayoutDashboard, 
  GitCompare, 
  BarChart3,
  FolderArchive
} from 'lucide-react';

export const MobileNav: React.FC = () => {
  const items = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/compare', label: 'Compare', icon: GitCompare },
    { to: '/history', label: 'History', icon: FolderArchive },
    { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <nav
      aria-label="Mobile navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#070D1E]/95 backdrop-blur-xl border-t border-slate-800 px-1 py-1.5 flex items-center justify-around"
    >
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            aria-label={item.label}
            className={({ isActive }) => `
              flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400
              ${isActive
                ? 'text-cyan-400 bg-cyan-500/10'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }
            `}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] font-tech tracking-tight">{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
};
