import React, { useEffect, useRef } from 'react';

export const EarthGlobe: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let rotation = 0;

    // Resize handler
    const handleResize = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Ground targets on the globe (India centric)
    const targets = [
      { name: 'Assam Floods', lat: 26.2, lng: 92.5, color: '#06B6D4', pulse: 0 },
      { name: 'Wayanad Slopes', lat: 11.5, lng: 76.1, color: '#EF4444', pulse: 0.5 },
      { name: 'Kosi Basin', lat: 26.1, lng: 86.6, color: '#3B82F6', pulse: 0.2 },
      { name: 'Bengaluru Sprawl', lat: 12.9, lng: 77.6, color: '#F59E0B', pulse: 0.8 },
      { name: 'ISRO Telemetry Master', lat: 13.0, lng: 77.5, color: '#10B981', pulse: 0.4 }
    ];

    // Satellites orbiting
    const satellites = [
      { name: 'SENTINEL-1A (SAR)', radius: 175, speed: 0.012, angle: 0, color: '#06B6D4', orbitTilt: 0.4 },
      { name: 'CARTOSAT-3 (0.28m)', radius: 195, speed: -0.015, angle: Math.PI / 3, color: '#38BDF8', orbitTilt: -0.6 },
      { name: 'RISAT-2BR1 (Radar)', radius: 160, speed: 0.018, angle: Math.PI, color: '#10B981', orbitTilt: 0.8 }
    ];

    const render = () => {
      if (!canvas) return;
      const width = canvas.width / (window.devicePixelRatio || 1);
      const height = canvas.height / (window.devicePixelRatio || 1);
      const cx = width / 2;
      const cy = height / 2;
      const globeRadius = Math.min(width, height) * 0.36;

      ctx.clearRect(0, 0, width, height);

      rotation += 0.003;

      // Draw atmospheric glow
      const atmosGrad = ctx.createRadialGradient(cx, cy, globeRadius * 0.8, cx, cy, globeRadius * 1.35);
      atmosGrad.addColorStop(0, 'rgba(6, 182, 212, 0.25)');
      atmosGrad.addColorStop(0.5, 'rgba(59, 130, 246, 0.12)');
      atmosGrad.addColorStop(1, 'rgba(5, 8, 22, 0)');
      ctx.fillStyle = atmosGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, globeRadius * 1.35, 0, Math.PI * 2);
      ctx.fill();

      // Draw outer orbit ellipses
      satellites.forEach(sat => {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(sat.orbitTilt);
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.18)';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 6]);
        ctx.beginPath();
        ctx.ellipse(0, 0, sat.radius, sat.radius * 0.45, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      });

      // Globe sphere background
      const sphereGrad = ctx.createRadialGradient(
        cx - globeRadius * 0.35, 
        cy - globeRadius * 0.35, 
        globeRadius * 0.1, 
        cx, 
        cy, 
        globeRadius
      );
      sphereGrad.addColorStop(0, '#0f2744');
      sphereGrad.addColorStop(0.5, '#09152b');
      sphereGrad.addColorStop(1, '#050a17');
      ctx.fillStyle = sphereGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, globeRadius, 0, Math.PI * 2);
      ctx.fill();

      // Globe boundary ring
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.5)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.arc(cx, cy, globeRadius, 0, Math.PI * 2);
      ctx.stroke();

      // Draw latitude lines
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, globeRadius, 0, Math.PI * 2);
      ctx.clip(); // clip to globe

      const latCount = 7;
      for (let i = -latCount; i <= latCount; i++) {
        const latY = cy + (i / latCount) * (globeRadius * 0.85);
        const latWidth = Math.sqrt(Math.max(0, globeRadius * globeRadius - Math.pow(latY - cy, 2)));
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.12)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.ellipse(cx, latY, latWidth, latWidth * 0.2, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Draw rotating longitude lines
      const lonCount = 14;
      for (let i = 0; i < lonCount; i++) {
        const angle = rotation + (i * Math.PI) / (lonCount / 2);
        const sin = Math.sin(angle);
        const cos = Math.cos(angle);

        // Only draw visible hemisphere
        if (cos > -0.2) {
          ctx.strokeStyle = `rgba(56, 189, 248, ${Math.max(0.04, cos * 0.22)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.ellipse(cx, cy, globeRadius * Math.abs(sin), globeRadius, 0, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      // Draw stylized continents / geo-points grid
      const time = Date.now() * 0.001;
      for (let lat = -60; lat <= 60; lat += 15) {
        for (let lng = 0; lng < 360; lng += 15) {
          const radLat = (lat * Math.PI) / 180;
          const radLng = ((lng * Math.PI) / 180) + rotation;
          const x3d = Math.cos(radLat) * Math.sin(radLng);
          const y3d = -Math.sin(radLat);
          const z3d = Math.cos(radLat) * Math.cos(radLng);

          if (z3d > 0) { // front face
            const px = cx + x3d * globeRadius * 0.96;
            const py = cy + y3d * globeRadius * 0.96;
            const alpha = z3d * 0.45;
            ctx.fillStyle = `rgba(6, 182, 212, ${alpha})`;
            ctx.beginPath();
            ctx.arc(px, py, 1.2, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      // Draw India & Key Disaster Ground Nodes
      targets.forEach((target, index) => {
        const radLat = (target.lat * Math.PI) / 180;
        const radLng = ((target.lng * Math.PI) / 180) + rotation * 0.8;
        const x3d = Math.cos(radLat) * Math.sin(radLng);
        const y3d = -Math.sin(radLat);
        const z3d = Math.cos(radLat) * Math.cos(radLng);

        if (z3d > 0.1) {
          const px = cx + x3d * globeRadius * 0.97;
          const py = cy + y3d * globeRadius * 0.97;
          const pulse = (time * 2 + target.pulse * 4) % 2;

          // Pulse waves
          ctx.strokeStyle = target.color;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(px, py, 4 + pulse * 14, 0, Math.PI * 2);
          ctx.stroke();

          // Center solid point
          ctx.fillStyle = target.color;
          ctx.beginPath();
          ctx.arc(px, py, 3.5, 0, Math.PI * 2);
          ctx.fill();

          // Label
          ctx.fillStyle = '#f8fafc';
          ctx.font = '10px "JetBrains Mono", monospace';
          ctx.fillText(target.name, px + 10, py - 4);
        }
      });

      ctx.restore(); // restore clip

      // Draw Orbiting Satellites on top
      satellites.forEach(sat => {
        sat.angle += sat.speed;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(sat.orbitTilt);

        const satX = sat.radius * Math.cos(sat.angle);
        const satY = sat.radius * 0.45 * Math.sin(sat.angle);

        // Sat position unrotated
        ctx.fillStyle = sat.color;
        ctx.beginPath();
        ctx.arc(satX, satY, 4, 0, Math.PI * 2);
        ctx.fill();

        // Solar panels
        ctx.fillStyle = '#38BDF8';
        ctx.fillRect(satX - 8, satY - 1, 16, 2);

        // Downlink beam to globe center
        const beamGrad = ctx.createLinearGradient(satX, satY, 0, 0);
        beamGrad.addColorStop(0, `${sat.color}88`);
        beamGrad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.strokeStyle = beamGrad;
        ctx.lineWidth = 1;
        ctx.setLineDash([2, 4]);
        ctx.beginPath();
        ctx.moveTo(satX, satY);
        ctx.lineTo(0, 0);
        ctx.stroke();

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="relative w-full h-[400px] md:h-[500px] flex items-center justify-center overflow-hidden">
      <canvas
        ref={canvasRef}
        className="w-full h-full max-w-[650px] max-h-[500px]"
        style={{ filter: 'drop-shadow(0 0 45px rgba(6, 182, 212, 0.25))' }}
      />
      {/* HUD Telemetry overlay chips */}
      <div className="absolute top-4 left-4 font-mono text-[10px] text-cyan-400/80 bg-slate-900/80 border border-cyan-500/20 px-3 py-1.5 rounded-lg backdrop-blur-md hidden sm:block">
        <div>ORBIT ELEVATION: 693.4 KM [SSO]</div>
        <div>INCLINATION: 98.18° • REVISIT: 6D</div>
      </div>
      <div className="absolute bottom-4 right-4 font-mono text-[10px] text-emerald-400/80 bg-slate-900/80 border border-emerald-500/20 px-3 py-1.5 rounded-lg backdrop-blur-md hidden sm:block">
        <div>DOWNLINK FREQ: 8.4 GHz (X-BAND)</div>
        <div>DATA RATE: 520 Mbps CONTINUOUS</div>
      </div>
    </div>
  );
};
