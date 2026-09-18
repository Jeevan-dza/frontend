import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { 
  BarChart3, 
  TrendingUp, 
  Satellite, 
  AlertTriangle, 
  Globe2, 
  ShieldCheck, 
  Layers, 
  Download,
  CheckCircle2
} from 'lucide-react';
import { ANALYTICS_DATA } from '../data/mockData';

// Register Chart.js elements
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Chart.js dark theme options
const BASE_CHART_OPTIONS = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
      labels: {
        color: '#94a3b8',
        font: { family: 'JetBrains Mono', size: 11 }
      }
    },
    tooltip: {
      backgroundColor: '#0f172a',
      titleColor: '#38bdf8',
      bodyColor: '#f8fafc',
      borderColor: '#334155',
      borderWidth: 1,
      padding: 10
    }
  },
  scales: {
    x: {
      ticks: { color: '#64748b', font: { family: 'JetBrains Mono', size: 10 } },
      grid: { color: 'rgba(51, 65, 85, 0.25)' }
    },
    y: {
      ticks: { color: '#64748b', font: { family: 'JetBrains Mono', size: 10 } },
      grid: { color: 'rgba(51, 65, 85, 0.25)' }
    }
  }
};

export const AnalyticsPage: React.FC = () => {
  const [exportToast, setExportToast] = React.useState<string | null>(null);

  const handleExport = () => {
    const csvRows = [
      ['Metric', 'Value'],
      ['Total Disasters', ANALYTICS_DATA.summary.totalDisasters],
      ['Flood Events', ANALYTICS_DATA.summary.floodEvents],
      ['Images Processed', ANALYTICS_DATA.summary.imagesProcessed],
      ['Monitoring Regions', ANALYTICS_DATA.summary.monitoringRegions],
      ['SAR Coverage (km\u00b2)', ANALYTICS_DATA.summary.sarCoverageSqKm],
      ['Model Accuracy Avg', ANALYTICS_DATA.summary.modelAccuracyAvg],
    ];
    const csvContent = csvRows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'satquery-analytics-summary.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setExportToast('Analytics dataset exported as CSV successfully!');
    setTimeout(() => setExportToast(null), 3500);
  };

  const baseChartOptions = BASE_CHART_OPTIONS;

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs tracking-wider uppercase">
            <BarChart3 className="w-4 h-4" />
            <span>Planetary Inundation & Historical Trends</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold font-tech text-white mt-1">
            GEOSPATIAL INTELLIGENCE ANALYTICS
          </h1>
          <p className="text-sm text-slate-400">
            Temporal disaster occurrence curves, river basin surge frequencies, and satellite sensor ingestion throughput.
          </p>
        </div>

        <div className="flex flex-col items-start md:items-end gap-2 self-start md:self-auto">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0F172A] border border-slate-700 hover:border-cyan-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 text-cyan-300 text-xs font-mono transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>EXPORT CSV / JSON</span>
          </button>
          {exportToast && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-mono">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>{exportToast}</span>
            </div>
          )}
        </div>
      </div>

      {/* METRICS CARDS: Total Disasters, Flood Events, Images Processed, Monitoring Regions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#0F172A] border border-slate-800 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-mono uppercase">Total Disasters</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-bold font-tech text-white">
            {ANALYTICS_DATA.summary.totalDisasters}
          </div>
          <div className="text-xs font-mono text-cyan-400 mt-1">
            Across 28 Indian States & UTs
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0F172A] border border-cyan-500/30 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-mono uppercase">Flood Events</span>
            <Layers className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-bold font-tech text-cyan-400">
            {ANALYTICS_DATA.summary.floodEvents}
          </div>
          <div className="text-xs font-mono text-slate-400 mt-1">
            47.8% of all monitored incidents
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0F172A] border border-slate-800 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-mono uppercase">Images Processed</span>
            <Satellite className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-bold font-tech text-emerald-400">
            {ANALYTICS_DATA.summary.imagesProcessed.toLocaleString()}
          </div>
          <div className="text-xs font-mono text-slate-400 mt-1">
            Radar SAR + Optical MSI Tiles
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0F172A] border border-slate-800 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-mono uppercase">Monitoring Regions</span>
            <Globe2 className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-3xl font-bold font-tech text-blue-400">
            {ANALYTICS_DATA.summary.monitoringRegions}
          </div>
          <div className="text-xs font-mono text-slate-400 mt-1">
            {ANALYTICS_DATA.summary.sarCoverageSqKm} km² Continuous SAR
          </div>
        </div>
      </div>

      {/* CHARTS GRID:
          1. Disaster Trends (Annual comparison)
          2. State-wise Analysis
          3. Flood Frequency by River Basin
          4. Monthly Monitoring
      */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Disaster Trends */}
        <div className="p-6 rounded-2xl bg-[#0F172A] border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-tech font-bold text-base text-white">
                DISASTER MULTI-YEAR TRENDS (2021 - 2026)
              </h2>
              <p className="text-xs text-slate-400">
                Frequency curves by disaster classification category.
              </p>
            </div>
            <span className="px-2.5 py-1 rounded bg-blue-950 text-blue-300 border border-blue-800 text-[10px] font-mono">
              ANNUAL SERIES
            </span>
          </div>
          <div className="h-72 w-full">
            <Line data={ANALYTICS_DATA.disasterTrends} options={baseChartOptions} />
          </div>
        </div>

        {/* Chart 2: State-wise Vulnerability */}
        <div className="p-6 rounded-2xl bg-[#0F172A] border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-tech font-bold text-base text-white">
                STATE-WISE INCIDENT VULNERABILITY
              </h2>
              <p className="text-xs text-slate-400">
                Highest frequency high-severity disaster events tracked.
              </p>
            </div>
            <span className="px-2.5 py-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-mono">
              STATE RISK INDEX
            </span>
          </div>
          <div className="h-72 w-full">
            <Bar data={ANALYTICS_DATA.stateWiseVulnerability} options={baseChartOptions} />
          </div>
        </div>

        {/* Chart 3: Flood Frequency by River Basin */}
        <div className="p-6 rounded-2xl bg-[#0F172A] border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-tech font-bold text-base text-white">
                FLOOD FREQUENCY & PEAK INUNDATION (RIVER BASINS)
              </h2>
              <p className="text-xs text-slate-400">
                Peak inundated land surface in square kilometers.
              </p>
            </div>
            <span className="px-2.5 py-1 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 text-[10px] font-mono">
              BASIN DELUGE
            </span>
          </div>
          <div className="h-72 w-full">
            <Bar data={ANALYTICS_DATA.riverBasinInundation} options={baseChartOptions} />
          </div>
        </div>

        {/* Chart 4: Monthly Monitoring & Sentinel Acquisitions */}
        <div className="p-6 rounded-2xl bg-[#0F172A] border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-tech font-bold text-base text-white">
                MONTHLY SENSOR TILE INGESTION RATE
              </h2>
              <p className="text-xs text-slate-400">
                Radar (Sentinel-1) vs Optical (Sentinel-2) volume throughout seasonal monsoons.
              </p>
            </div>
            <span className="px-2.5 py-1 rounded bg-purple-950 text-purple-300 border border-purple-800 text-[10px] font-mono">
              THROUGHPUT
            </span>
          </div>
          <div className="h-72 w-full">
            <Line data={ANALYTICS_DATA.monthlyAcquisitions} options={baseChartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};
