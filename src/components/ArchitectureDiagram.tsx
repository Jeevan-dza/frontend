import React, { useState } from 'react';
import { 
  MessageSquare, 
  Brain, 
  Filter, 
  Satellite, 
  Cpu, 
  Layers, 
  CheckCircle2, 
  Eye, 
  ArrowDown, 
  Database, 
  Server, 
  Code2, 
  Sparkles,
  Zap,
  Activity,
  Play,
  RotateCcw
} from 'lucide-react';

export const ArchitectureDiagram: React.FC = () => {
  const [activePipelineStep, setActivePipelineStep] = useState<number>(0);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  const pipelineSteps = [
    {
      title: 'User Query',
      subtitle: 'Natural Language Prompt',
      icon: MessageSquare,
      desc: 'User inputs request: "Find flooded roads in Assam" or uploads boundary GeoJSON.',
      tech: 'React / Web Speech / Prompt Preprocessor',
      latency: '15 ms',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Natural Language Understanding',
      subtitle: 'Multimodal Spatial LLM',
      icon: Brain,
      desc: 'Extracts spatial bounding box (AOI), temporal window, disaster category, and target infrastructure.',
      tech: 'Gemini / Llama-3-Spatial / Named Entity Tagger',
      latency: '140 ms',
      color: 'from-cyan-500 to-teal-500'
    },
    {
      title: 'Task Classification',
      subtitle: 'Sensor Selection & Routing',
      icon: Filter,
      desc: 'Automated policy engine decides optimal payload: SAR (radar) for cloud cover or Optical for NDVI.',
      tech: 'FastAPI Dispatcher / Celery Task Queue',
      latency: '25 ms',
      color: 'from-teal-500 to-emerald-500'
    },
    {
      title: 'Satellite Retrieval',
      subtitle: 'STAC API Query & Ingestion',
      icon: Satellite,
      desc: 'Queries Copernicus Hub, ISRO Bhuvan Open Data, and USGS EarthExplorer for sub-hour scenes.',
      tech: 'STAC Spec / Sentinel Hub API / GDAL VSI',
      latency: '380 ms',
      color: 'from-emerald-500 to-green-500'
    },
    {
      title: 'PyTorch Analysis',
      subtitle: 'Deep Feature Inference',
      icon: Cpu,
      desc: 'Applies bitemporal Siamese feature extractor to correlate pre-event vs post-event sensor matrices.',
      tech: 'PyTorch 2.4 / CUDA 12 / TensorRT FP16',
      latency: '420 ms',
      color: 'from-amber-500 to-orange-500'
    },
    {
      title: 'Flood Segmentation',
      subtitle: 'UNet++ Water Delineation',
      icon: Layers,
      desc: 'Generates pixel-accurate water and damage raster masks using radar backscatter thresholding.',
      tech: 'TorchVision / SAR Gamma-Naught Despeckling',
      latency: '310 ms',
      color: 'from-orange-500 to-red-500'
    },
    {
      title: 'GIS Validation',
      subtitle: 'Topological Vector Intersection',
      icon: CheckCircle2,
      desc: 'Intersects raster mask with OpenStreetMap road networks, bridge vectors, and cadastral boundaries.',
      tech: 'PostgreSQL / PostGIS / Shapely / GeoPandas',
      latency: '160 ms',
      color: 'from-pink-500 to-purple-500'
    },
    {
      title: 'Interactive Results',
      subtitle: 'Client Map Render & SitRep',
      icon: Eye,
      desc: 'Streams GeoJSON vectors, dual-sync swipe rasters, damage statistics, and AI emergency summary.',
      tech: 'Leaflet.js / GeoJSON / WebSockets / Tailwind',
      latency: '45 ms',
      color: 'from-purple-500 to-blue-500'
    }
  ];

  const handleRunSimulation = () => {
    setIsSimulating(true);
    setActivePipelineStep(0);
    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step < pipelineSteps.length) {
        setActivePipelineStep(step);
      } else {
        clearInterval(interval);
        setIsSimulating(false);
      }
    }, 700);
  };

  return (
    <div className="space-y-16 py-8">
      {/* SECTION 1: AI ANALYSIS PIPELINE */}
      <div className="bg-[#0A1024]/90 border border-slate-800 rounded-2xl p-6 md:p-8 backdrop-blur-md shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs tracking-wider uppercase">
              <Zap className="w-4 h-4" />
              <span>Real-Time Autonomous Workflow</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold font-tech text-white mt-1">
              AI ANALYSIS PIPELINE FLOWCHART
            </h2>
            <p className="text-sm text-slate-400 max-w-2xl">
              How SatQuery AI converts natural language queries into verified disaster intelligence vectors in under 1.5 seconds.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRunSimulation}
              disabled={isSimulating}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 disabled:opacity-50 text-white text-xs font-mono tracking-wider shadow-lg shadow-cyan-900/30 transition-all active:scale-95"
            >
              <Play className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
              <span>{isSimulating ? 'SIMULATING EXECUTION...' : 'RUN PIPELINE SIMULATION'}</span>
            </button>
            <button
              onClick={() => { setActivePipelineStep(0); setIsSimulating(false); }}
              className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
              title="Reset"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Animated Flowchart Steps */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {pipelineSteps.map((step, idx) => {
            const Icon = step.icon;
            const isCurrent = activePipelineStep === idx;
            const isPassed = activePipelineStep > idx;

            return (
              <div
                key={step.title}
                onClick={() => setActivePipelineStep(idx)}
                className={`
                  relative cursor-pointer rounded-xl p-4 transition-all duration-300 border
                  ${isCurrent 
                    ? 'bg-[#0F172A] border-cyan-400 shadow-lg shadow-cyan-500/20 scale-[1.02]' 
                    : isPassed 
                      ? 'bg-slate-900/60 border-slate-700/60 text-slate-300' 
                      : 'bg-slate-950/40 border-slate-800/60 text-slate-400 opacity-70 hover:opacity-100 hover:border-slate-700'
                  }
                `}
              >
                {/* Step number badge */}
                <div className="flex items-center justify-between mb-3">
                  <span className={`
                    w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold
                    ${isCurrent 
                      ? 'bg-cyan-500 text-[#050816]' 
                      : isPassed 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' 
                        : 'bg-slate-800 text-slate-400'
                    }
                  `}>
                    {idx + 1}
                  </span>
                  <span className="font-mono text-[10px] text-cyan-400/80 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-900/60">
                    {step.latency}
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-1.5">
                  <div className={`p-1.5 rounded-lg bg-gradient-to-br ${step.color} text-white shadow-sm`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="font-tech font-bold text-sm text-white tracking-wide">
                    {step.title}
                  </h3>
                </div>

                <p className="text-[11px] font-mono text-cyan-300/80 mb-2">
                  {step.subtitle}
                </p>

                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                  {step.desc}
                </p>

                <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span className="truncate max-w-[130px]">{step.tech}</span>
                  {isCurrent && (
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Active Step Deep Inspector */}
        <div className="mt-6 p-4 rounded-xl bg-slate-900/80 border border-cyan-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 font-mono text-xs">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 font-bold">
              STEP 0{activePipelineStep + 1} SELECTED
            </span>
            <span className="text-white font-semibold">
              {pipelineSteps[activePipelineStep].title}
            </span>
            <span className="text-slate-400 hidden sm:inline">
              — {pipelineSteps[activePipelineStep].desc}
            </span>
          </div>
          <div className="flex items-center gap-4 text-slate-400 shrink-0">
            <span>Stack: <strong className="text-slate-200">{pipelineSteps[activePipelineStep].tech}</strong></span>
            <span>Processing: <strong className="text-cyan-400">{pipelineSteps[activePipelineStep].latency}</strong></span>
          </div>
        </div>
      </div>

      {/* SECTION 2: TECHNOLOGY ARCHITECTURE SECTION */}
      <div className="bg-[#0A1024]/90 border border-slate-800 rounded-2xl p-6 md:p-8 backdrop-blur-md shadow-2xl">
        <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs tracking-wider uppercase">
          <Server className="w-4 h-4" />
          <span>Full Stack & Deep Learning Ecosystem</span>
        </div>
        <h2 className="text-xl md:text-2xl font-bold font-tech text-white mt-1">
          TECHNOLOGY ARCHITECTURE NODE DIAGRAM
        </h2>
        <p className="text-sm text-slate-400 max-w-2xl mb-8">
          Enterprise multi-tier topology connecting high-throughput earth observation downlinks with client-side accelerated geospatial rendering.
        </p>

        {/* Node diagram tiers */}
        <div className="space-y-4">
          {/* Tier 1: Frontend */}
          <div className="p-5 rounded-xl bg-[#0F172A] border border-blue-500/30 relative group hover:border-blue-400 transition-colors">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
                  <Code2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-tech text-base font-bold text-white">Tier 1: High-Performance Presentation Client</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/20 text-blue-300 border border-blue-500/30">FRONTEND</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Reactive client handling dual-map swipe synchronized canvases, responsive controls, and high-frequency telemetry.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {['React 19', 'Tailwind CSS v4', 'Leaflet.js GIS', 'Framer Motion', 'Chart.js Telemetry', 'Lucide Icons'].map(tag => (
                  <span key={tag} className="px-2.5 py-1 rounded-lg text-xs font-mono bg-blue-950/60 text-blue-200 border border-blue-800/60">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-center -my-2 relative z-10">
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-400">
              <ArrowDown className="w-4 h-4" />
            </div>
          </div>

          {/* Tier 2: Backend */}
          <div className="p-5 rounded-xl bg-[#0F172A] border border-cyan-500/30 relative group hover:border-cyan-400 transition-colors">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-600/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                  <Server className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-tech text-base font-bold text-white">Tier 2: Asynchronous Microservice Gateway</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">BACKEND API</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    High-throughput asynchronous server coordinating tile pipelines, STAC metadata, and WebSocket event broadcasts.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {['FastAPI Python', 'Uvicorn ASGI', 'Pydantic V2', 'WebSockets', 'Celery Async Workers', 'Redis Cache'].map(tag => (
                  <span key={tag} className="px-2.5 py-1 rounded-lg text-xs font-mono bg-cyan-950/60 text-cyan-200 border border-cyan-800/60">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-center -my-2 relative z-10">
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-400">
              <ArrowDown className="w-4 h-4" />
            </div>
          </div>

          {/* Tier 3: AI Inference Engine */}
          <div className="p-5 rounded-xl bg-[#0F172A] border border-emerald-500/30 relative group hover:border-emerald-400 transition-colors">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-tech text-base font-bold text-white">Tier 3: Deep Geospatial Intelligence Models</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">AI CORE</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    GPU-accelerated computer vision networks specializing in synthetic aperture radar (SAR) water extraction and bitemporal change detection.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {['PyTorch 2.4', 'TorchVision', 'UNet++ ResNet-101', 'SAR Flood Detection', 'Bitemporal Change Detection', 'Segment Anything Geo'].map(tag => (
                  <span key={tag} className="px-2.5 py-1 rounded-lg text-xs font-mono bg-emerald-950/60 text-emerald-200 border border-emerald-800/60">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-center -my-2 relative z-10">
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-400">
              <ArrowDown className="w-4 h-4" />
            </div>
          </div>

          {/* Tier 4: Spatial Database */}
          <div className="p-5 rounded-xl bg-[#0F172A] border border-purple-500/30 relative group hover:border-purple-400 transition-colors">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-tech text-base font-bold text-white">Tier 4: Enterprise Spatial Data Lakehouse</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30">SPATIAL DB</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Spatial index storage indexing road networks, admin boundaries, relief center coordinates, and disaster polygon logs.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {['PostgreSQL 16', 'PostGIS 3.4 Spatial', 'R-Tree Spatial Indexing', 'GeoPackage Stores', 'Cloud Optimized GeoTIFF (COG)'].map(tag => (
                  <span key={tag} className="px-2.5 py-1 rounded-lg text-xs font-mono bg-purple-950/60 text-purple-200 border border-purple-800/60">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-center -my-2 relative z-10">
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-400">
              <ArrowDown className="w-4 h-4" />
            </div>
          </div>

          {/* Tier 5: Satellite Feeds */}
          <div className="p-5 rounded-xl bg-[#0F172A] border border-amber-500/30 relative group hover:border-amber-400 transition-colors">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-600/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <Satellite className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-tech text-base font-bold text-white">Tier 5: Planetary Sensor Constellation Feeds</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30">SPACE SEGMENT</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Direct automated downlink connectors to active Earth observation platforms across microwave radar and multispectral sensors.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {['Sentinel-1 SAR C-Band', 'Sentinel-2 MSI Optical', 'ISRO Cartosat-3 (0.28m)', 'ISRO RISAT-2BR1 (Radar)', 'ISRO Bhuvan Open Data', 'NASA Landsat-9'].map(tag => (
                  <span key={tag} className="px-2.5 py-1 rounded-lg text-xs font-mono bg-amber-950/60 text-amber-200 border border-amber-800/60">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
