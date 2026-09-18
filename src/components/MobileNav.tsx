import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  LayoutDashboard, 
  GitCompare, 
  Satellite, 
  BarChart3,
  FolderArchive
} from 'lucide-react';

export const MobileNav: React.FC = () => {
  const items = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/compare', label: 'Compare', icon: GitCompare },
    { to: '/satellite', label: 'Sensors', icon: Satellite },
    { to: '/analytics', label: 'Analytics', icon: BarChart3 },
    { to: '/history', label: 'History', icon: FolderArchive },

  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#070D1E]/95 backdrop-blur-xl border-t border-slate-800 px-2 py-1.5 flex items-center justify-around">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `
              flex flex-col items-center gap-0.5 px-2.5 py-1 rounded-lg transition-colors
              ${isActive ? 'text-cyan-400 font-semibold' : 'text-slate-400 hover:text-slate-200'}
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
