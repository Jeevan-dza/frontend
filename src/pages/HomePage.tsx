import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Search, 
  ArrowRight, 
  Satellite, 
  Sparkles, 
  Play,
  Activity,
  ChevronRight,
  GitCompare,
  Layers,
  Flame,
  Droplets,
  TreeDeciduous,
  ShieldAlert
} from 'lucide-react';
import { EarthGlobe } from '../components/EarthGlobe';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchPrompt, setSearchPrompt] = useState('');

  const exampleQueries = [
    { title: 'Find flooded roads in Assam', query: 'Find flooded roads in Assam', icon: Droplets, target: '/dashboard' },
    { title: 'Detect deforestation in Karnataka', query: 'Detect deforestation in Karnataka', icon: TreeDeciduous, target: '/dashboard' },
    { title: 'Compare Kerala before and after floods', query: 'Compare Kerala before and after floods', icon: GitCompare, target: '/compare' },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchPrompt.trim()) return;

    if (searchPrompt.toLowerCase().includes('compare') || searchPrompt.toLowerCase().includes('before and after') || searchPrompt.toLowerCase().includes('kerala')) {
      navigate(`/compare?q=${encodeURIComponent(searchPrompt.trim())}`);
    } else {
      navigate(`/dashboard?q=${encodeURIComponent(searchPrompt.trim())}`);
    }
  };

  const handleSelectExample = (item: typeof exampleQueries[0]) => {
    navigate(`${item.target}?q=${encodeURIComponent(item.query)}`);
  };

  return (
    <div className="min-h-screen text-[#F8FAFC] pb-16">
      {/* HERO SECTION */}
      <section className="relative pt-6 md:pt-12 pb-14 px-4 md:px-8 max-w-7xl mx-auto overflow-hidden">
        {/* Subtle cosmic / atmospheric glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[650px] h-[450px] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 -right-24 w-[350px] h-[350px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Hero Content */}
          <div className="lg:col-span-7 space-y-6 z-10 text-left">
            {/* Top Mission Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0F172A]/90 border border-cyan-500/30 backdrop-blur-md">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              <span className="text-xs font-mono font-bold tracking-wider text-cyan-300 uppercase">
                ISRO Inspired • Smart India Hackathon Prototype
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-tech leading-[1.08] text-white">
              SatQuery <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-teal-300 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(6,182,212,0.4)]">AI</span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-slate-300 max-w-xl font-sans font-light italic text-cyan-200/90 leading-relaxed">
              "Ask questions about Earth using satellite imagery."
            </p>

            <p className="text-sm text-slate-400 max-w-lg font-sans">
              Instant AI detection of floods, deforestation, and natural disasters powered by Sentinel SAR and optical constellations.
            </p>

            {/* Large AI Search Bar */}
            <div className="bg-[#0F172A]/95 border border-cyan-500/50 rounded-2xl p-2 shadow-2xl backdrop-blur-xl max-w-xl group focus-within:border-cyan-400 focus-within:shadow-[0_0_20px_rgba(6,182,212,0.25)] transition-all">
              <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
                <div className="pl-3 text-cyan-400">
                  <Search className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={searchPrompt}
                  onChange={(e) => setSearchPrompt(e.target.value)}
                  placeholder="Ask anything about Earth... (e.g. Find flooded roads in Assam)"
                  className="flex-1 bg-transparent px-2 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none font-sans"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-[#050816] text-xs font-mono font-bold tracking-wider flex items-center gap-1.5 shadow-lg shadow-cyan-900/40 transition-all active:scale-95 shrink-0"
                >
                  <span>QUERY</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>

            {/* Example Queries */}
            <div className="space-y-2 max-w-xl">
              <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>EXAMPLE QUERIES:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {exampleQueries.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.title}
                      onClick={() => handleSelectExample(item)}
                      className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#0F172A]/90 border border-slate-800 hover:border-cyan-500/60 hover:bg-slate-800 text-xs font-sans text-slate-300 hover:text-white transition-all group active:scale-95"
                    >
                      <Icon className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
                      <span>{item.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Buttons: Launch Analysis & View Demo */}
            <div className="pt-3 flex flex-wrap items-center gap-4">
              <Link
                to="/dashboard"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-[#050816] font-tech font-bold text-sm tracking-wider shadow-lg shadow-cyan-500/25 flex items-center gap-2 transition-all active:scale-95"
              >
                <Satellite className="w-4 h-4" />
                <span>Launch Analysis</span>
              </Link>

              <Link
                to="/compare"
                className="px-6 py-3 rounded-xl bg-[#0F172A] hover:bg-slate-800 border border-cyan-500/30 hover:border-cyan-500/60 text-cyan-300 hover:text-white font-tech font-medium text-sm tracking-wide flex items-center gap-2 transition-all shadow-md active:scale-95"
              >
                <Play className="w-4 h-4 text-cyan-400 fill-cyan-400/20" />
                <span>View Demo</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Earth from space & Satellite graphics */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="relative w-full flex flex-col items-center">
              <EarthGlobe />
              {/* Satellite Telemetry Tag */}
              <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0F172A]/80 border border-slate-800 text-[11px] font-mono text-slate-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Sentinel-1 SAR Radar & ISRO RISAT Constellation In Orbit</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK PROTOTYPE HIGHLIGHT CARDS (Clean SIH Presentation) */}
      <section className="px-4 md:px-8 max-w-7xl mx-auto mt-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Interactive Analysis */}
          <Link
            to="/dashboard"
            className="p-6 rounded-2xl bg-[#0F172A] border border-slate-800 hover:border-cyan-500/50 transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-4 group-hover:scale-110 transition-transform">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold font-tech text-white group-hover:text-cyan-300 transition-colors">
                Interactive Analysis Map
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Execute natural language queries to inspect SAR flood polygons, severed roads, and emergency shelters.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-mono text-cyan-400 mt-4 group-hover:translate-x-1 transition-transform">
              <span>Open Dashboard</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </Link>

          {/* Card 2: Before vs After Slider */}
          <Link
            to="/compare"
            className="p-6 rounded-2xl bg-[#0F172A] border border-cyan-500/30 hover:border-cyan-500/60 shadow-lg shadow-cyan-950/30 transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-110 transition-transform">
                <GitCompare className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold font-tech text-white group-hover:text-cyan-300 transition-colors">
                  Before vs After Slider
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  DEMO STAR
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Synchronized pre and post disaster maps with an interactive comparison slider and automated AI damage summaries.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-mono text-cyan-400 mt-4 group-hover:translate-x-1 transition-transform">
              <span>Launch Comparison</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </Link>

          {/* Card 3: Historical Disasters */}
          <Link
            to="/history"
            className="p-6 rounded-2xl bg-[#0F172A] border border-slate-800 hover:border-cyan-500/50 transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-4 group-hover:scale-110 transition-transform">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold font-tech text-white group-hover:text-cyan-300 transition-colors">
                Historical Disaster Library
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Pre-indexed multi-temporal disaster catalog covering Assam Floods, Bihar Floods, Wayanad Landslide, and Punjab Floods.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-mono text-cyan-400 mt-4 group-hover:translate-x-1 transition-transform">
              <span>Explore Disasters</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
};

