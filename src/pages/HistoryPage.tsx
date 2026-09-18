import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FolderArchive, 
  Calendar, 
  MapPin, 
  AlertTriangle, 
  ArrowRight, 
  Search,
  CheckCircle2,
  Sliders,
  Eye
} from 'lucide-react';

interface DisasterCardItem {
  id: string;
  title: string;
  date: string;
  state: string;
  severity: 'Critical' | 'Severe' | 'High';
  severityColor: string;
  summary: string;
  image: string;
  targetUrl: string;
}

export const HistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  // The 4 prominent examples specified by user:
  // * Assam Floods
  // * Bihar Floods
  // * Wayanad Landslide
  // * Punjab Floods
  const disasterList: DisasterCardItem[] = [
    {
      id: 'assam-floods',
      title: 'Assam Floods',
      date: 'July 2024',
      state: 'Assam',
      severity: 'Critical',
      severityColor: 'bg-red-950/90 text-red-300 border-red-500/50',
      summary: 'Brahmaputra river overspill across 28 districts, inundating over 340 km² and severing National Highway 37.',
      image: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=800&q=80',
      targetUrl: '/dashboard?q=Find+flooded+roads+in+Assam'
    },
    {
      id: 'bihar-floods',
      title: 'Bihar Floods',
      date: 'August 2023',
      state: 'Bihar',
      severity: 'Severe',
      severityColor: 'bg-orange-950/90 text-orange-300 border-orange-500/50',
      summary: 'Kosi and Gandak river surges affecting Supaul, Madhepura, and Saharsa with widespread embankment displacement.',
      image: 'https://images.unsplash.com/photo-1516214104703-d870798883c5?auto=format&fit=crop&w=800&q=80',
      targetUrl: '/dashboard?q=Bihar+floods+inundation+analysis'
    },
    {
      id: 'wayanad-landslide',
      title: 'Wayanad Landslide',
      date: 'July 2024',
      state: 'Kerala',
      severity: 'Critical',
      severityColor: 'bg-red-950/90 text-red-300 border-red-500/50',
      summary: 'Catastrophic debris flow in Meppadi and Chooralmala quantified through Sentinel-1 SAR backscatter coherence loss.',
      image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
      targetUrl: '/compare?q=Wayanad+landslide+debris+change'
    },
    {
      id: 'punjab-floods',
      title: 'Punjab Floods',
      date: 'July 2023',
      state: 'Punjab',
      severity: 'High',
      severityColor: 'bg-amber-950/90 text-amber-300 border-amber-500/50',
      summary: 'Sutlej and Ghaggar overflow submerging extensive agricultural paddies in Patiala, Ropar, and Ferozepur.',
      image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
      targetUrl: '/dashboard?q=Punjab+floods+crop+inundation'
    }
  ];

  const filteredList = disasterList.filter(d => 
    d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.date.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-wider">
            <FolderArchive className="w-4 h-4" />
            <span>DISASTER CATALOG ARCHIVE</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold font-tech text-white mt-1">
            HISTORICAL DISASTERS
          </h1>
          <p className="text-sm text-slate-300">
            Select a past disaster event to load instant satellite analysis and impact telemetry.
          </p>
        </div>

        {/* Quick Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search disasters or states..."
            className="w-full pl-9 pr-4 py-2 bg-[#0F172A] border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 font-sans"
          />
        </div>
      </div>

      {/* SIMPLE CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {filteredList.map((card) => (
          <div
            key={card.id}
            className="rounded-2xl bg-[#0F172A] border border-slate-800 hover:border-cyan-500/50 overflow-hidden shadow-xl hover:shadow-cyan-950/30 transition-all flex flex-col justify-between group"
          >
            {/* Image Banner */}
            <div className="relative h-48 w-full overflow-hidden bg-slate-950">
              <img
                src={card.image}
                alt={card.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/40 to-transparent" />

              {/* Severity Pill (Required) */}
              <div className="absolute top-3 left-3">
                <span className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold uppercase tracking-wider border shadow-md ${card.severityColor}`}>
                  {card.severity}
                </span>
              </div>

              {/* State Pill (Required) */}
              <div className="absolute top-3 right-3">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0F172A]/90 border border-slate-700 text-xs font-mono text-cyan-300 shadow-md">
                  <MapPin className="w-3 h-3 text-cyan-400" />
                  <span>{card.state}</span>
                </div>
              </div>

              {/* Date (Required) */}
              <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-xs font-mono text-slate-200 bg-[#050816]/80 px-2.5 py-1 rounded-lg border border-slate-800">
                <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                <span>Date: <strong>{card.date}</strong></span>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <h3 className="text-xl font-bold font-tech text-white group-hover:text-cyan-300 transition-colors">
                  {card.title}
                </h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  {card.summary}
                </p>
              </div>

              {/* Specifications Display: Date, State, Severity */}
              <div className="pt-3 border-t border-slate-800 grid grid-cols-3 gap-2 text-xs font-mono">
                <div className="bg-[#070D1E] p-2 rounded-xl border border-slate-800/80">
                  <span className="text-[10px] text-slate-400 block uppercase">Date</span>
                  <span className="font-bold text-white mt-0.5 block truncate">{card.date}</span>
                </div>
                <div className="bg-[#070D1E] p-2 rounded-xl border border-slate-800/80">
                  <span className="text-[10px] text-slate-400 block uppercase">State</span>
                  <span className="font-bold text-cyan-300 mt-0.5 block truncate">{card.state}</span>
                </div>
                <div className="bg-[#070D1E] p-2 rounded-xl border border-slate-800/80">
                  <span className="text-[10px] text-slate-400 block uppercase">Severity</span>
                  <span className="font-bold text-red-400 mt-0.5 block truncate">{card.severity}</span>
                </div>
              </div>

              {/* Required Button: View Analysis */}
              <button
                onClick={() => navigate(card.targetUrl)}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-[#050816] text-xs font-mono font-bold tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-cyan-950/40 transition-all active:scale-95"
              >
                <span>VIEW ANALYSIS</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
