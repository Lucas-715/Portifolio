import React, { useEffect, useRef } from 'react';

function isLandMass(lat: number, lon: number): boolean {
  // South America
  if (lat >= -54 && lat <= 12 && lon >= -81 && lon <= -34) {
    if (lat > -5 && lon > -80 && lon < -48) return true;
    if (lat <= -5 && lat >= -25 && lon >= -76 && lon <= -35) return true;
    if (lat < -25 && lon >= -73 && lon <= -48 + (lat + 25) * 0.5) return true;
    return false;
  }
  // North America
  if (lat >= 15 && lat <= 70 && lon >= -165 && lon <= -55) {
    if (lat < 30 && lon > -115 && lon < -80) return true;
    if (lat >= 30 && lat <= 55 && lon >= -125 && lon <= -65) return true;
    if (lat > 55 && lon >= -160 && lon <= -60) return true;
    return false;
  }
  // Europe
  if (lat >= 36 && lat <= 70 && lon >= -10 && lon <= 45) return true;
  // Africa
  if (lat >= -34 && lat <= 35 && lon >= -17 && lon <= 50) {
    if (lat > 5 && lon >= -17 && lon <= 48) return true;
    if (lat <= 5 && lon >= 10 && lon <= 42) return true;
    return false;
  }
  // Asia
  if (lat >= 8 && lat <= 72 && lon >= 45 && lon <= 145) {
    if (lat > 20 && lon >= 45 && lon <= 135) return true;
    if (lat <= 20 && lon >= 72 && lon <= 125) return true;
    return false;
  }
  // Australia
  if (lat >= -38 && lat <= -12 && lon >= 114 && lon <= 153) return true;
  return false;
}

export const GlobeBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let rotation = -0.75;
    let mouseX = 0;
    let mouseY = 0;

    // Power surge dynamic variables
    let surgeFactor = 0;
    let targetSurge = 0;
    let shockwaveRadius = 0;

    const handlePowerSurge = (e: Event) => {
      const custom = e as CustomEvent<{ level?: number; isFiring?: boolean }>;
      if (custom.detail) {
        if (custom.detail.isFiring) {
          targetSurge = 1.35;
          shockwaveRadius = 10;
          setTimeout(() => {
            targetSurge = 0;
          }, 450);
        } else if (typeof custom.detail.level === 'number') {
          targetSurge = (custom.detail.level / 100) * 0.9;
        }
      }
    };
    window.addEventListener('lucky:power-surge', handlePowerSurge);

    // Keep background vibrant and living across the entire page scroll
    const handleScroll = () => {
      const scroll = window.scrollY;
      const op = Math.max(0.55, 1 - scroll / 3600);
      container.style.opacity = op.toString();
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 0.28;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 0.18;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Precompute globe dot matrix
    const dots: { lat: number; lon: number; isLand: boolean }[] = [];
    for (let lat = -80; lat <= 80; lat += 3.4) {
      const cosLat = Math.cos((lat * Math.PI) / 180);
      const stepLon = Math.max(3.4, 3.4 / Math.max(0.2, cosLat));
      for (let lon = -180; lon < 180; lon += stepLon) {
        dots.push({
          lat: (lat * Math.PI) / 180,
          lon: (lon * Math.PI) / 180,
          isLand: isLandMass(lat, lon),
        });
      }
    }

    // Dynamic drifting stardust particles
    const stars = Array.from({ length: 95 }).map(() => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.00035,
      vy: (Math.random() - 0.5) * 0.00035,
      r: Math.random() * 1.5 + 0.35,
      alpha: Math.random() * 0.55 + 0.2,
      phase: Math.random() * Math.PI * 2,
      colorType: Math.random() > 0.65 ? 'cyan' : Math.random() > 0.35 ? 'violet' : 'white',
    }));

    // Orbital energy arcs connecting global hubs
    const arcs = [
      { lat1: -0.085, lon1: -0.66, lat2: -0.41, lon2: -0.81, progress: 0 },
      { lat1: -0.085, lon1: -0.66, lat2: 0.65, lon2: -1.3, progress: 0.4 },
      { lat1: -0.41, lon1: -0.81, lat2: 0.88, lon2: 0.05, progress: 0.75 },
    ];

    let tick = 0;

    const render = () => {
      tick += 0.012;
      rotation += 0.0019;

      // Smoothly interpolate power surge factor
      surgeFactor += (targetSurge - surgeFactor) * 0.07;
      if (surgeFactor < 0.005) surgeFactor = 0;

      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // ==========================================
      // LIVING CYBER NEBULAS & AURORA LIGHT DRIFT
      // ==========================================
      // Nebula 1: Cyan-Indigo Atmospheric Glow (Upper-Left)
      const neb1X = w * 0.3 + Math.sin(tick * 0.7) * 45 + mouseX * 50;
      const neb1Y = h * 0.35 + Math.cos(tick * 0.5) * 35 + mouseY * 30;
      const nebula1 = ctx.createRadialGradient(neb1X, neb1Y, 20, neb1X, neb1Y, Math.max(w * 0.65, 450));
      nebula1.addColorStop(0, 'rgba(0, 240, 255, 0.075)');
      nebula1.addColorStop(0.45, 'rgba(189, 0, 255, 0.035)');
      nebula1.addColorStop(0.8, 'rgba(10, 6, 28, 0.015)');
      nebula1.addColorStop(1, 'rgba(4, 2, 10, 0)');
      ctx.fillStyle = nebula1;
      ctx.fillRect(0, 0, w, h);

      // Nebula 2: Violet-Fuchsia Deep Cosmic Core (Bottom-Right)
      const neb2X = w * 0.72 + Math.cos(tick * 0.6) * 40 - mouseX * 40;
      const neb2Y = h * 0.68 + Math.sin(tick * 0.8) * 35 - mouseY * 25;
      const nebula2 = ctx.createRadialGradient(neb2X, neb2Y, 20, neb2X, neb2Y, Math.max(w * 0.6, 400));
      nebula2.addColorStop(0, 'rgba(189, 0, 255, 0.065)');
      nebula2.addColorStop(0.5, 'rgba(0, 240, 255, 0.025)');
      nebula2.addColorStop(1, 'rgba(4, 2, 10, 0)');
      ctx.fillStyle = nebula2;
      ctx.fillRect(0, 0, w, h);

      // Crimson Power Surge Background Shift (Laser attack reaction)
      if (surgeFactor > 0.01) {
        const bgGrad = ctx.createRadialGradient(w / 2, h * 0.6, 50, w / 2, h * 0.6, Math.max(w, h));
        bgGrad.addColorStop(0, `rgba(239, 68, 68, ${0.45 * surgeFactor})`);
        bgGrad.addColorStop(0.45, `rgba(185, 28, 28, ${0.28 * surgeFactor})`);
        bgGrad.addColorStop(0.85, `rgba(88, 28, 28, ${0.15 * surgeFactor})`);
        bgGrad.addColorStop(1, 'rgba(4, 2, 10, 0)');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);
      }

      // ==========================================
      // LIVING STARDUST WITH CELESTIAL DRIFT
      // ==========================================
      for (const s of stars) {
        s.x += s.vx;
        s.y += s.vy;
        if (s.x < 0) s.x = 1;
        if (s.x > 1) s.x = 0;
        if (s.y < 0) s.y = 1;
        if (s.y > 1) s.y = 0;

        const twinkle = s.alpha + Math.sin(tick * 2.5 + s.phase) * 0.2;
        let starColor = 'rgba(255, 255, 255,';
        if (s.colorType === 'cyan') starColor = 'rgba(0, 240, 255,';
        else if (s.colorType === 'violet') starColor = 'rgba(189, 0, 255,';

        ctx.fillStyle = `${starColor} ${Math.max(0.12, twinkle)})`;
        ctx.beginPath();
        const px = s.x * w + mouseX * 20;
        const py = s.y * h + mouseY * 15;
        ctx.arc(px, py, s.r, 0, Math.PI * 2);
        ctx.fill();
      }

      const cx = w / 2 + mouseX * 35;
      const cy = h * 0.62 + mouseY * 20;
      const radius = Math.min(w * 0.44, h * 0.56, 450);

      // Ambient Halo
      const outerGlow = ctx.createRadialGradient(cx, cy, radius * 0.7, cx, cy, radius * 1.45);
      const haloR = Math.round(189 + (255 - 189) * surgeFactor);
      const haloG = Math.round(0 + 30 * surgeFactor);
      const haloB = Math.round(255 * (1 - surgeFactor));
      outerGlow.addColorStop(0, `rgba(${haloR}, ${haloG}, ${haloB}, ${0.25 + 0.35 * surgeFactor})`);
      outerGlow.addColorStop(0.5, `rgba(${Math.round(240 * surgeFactor)}, ${Math.round(240 * (1 - surgeFactor))}, ${Math.round(255 * (1 - surgeFactor))}, ${0.12 + 0.25 * surgeFactor})`);
      outerGlow.addColorStop(1, 'rgba(4, 2, 10, 0)');
      ctx.fillStyle = outerGlow;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 1.45, 0, Math.PI * 2);
      ctx.fill();

      // Globe Dark Core
      const sphereGrad = ctx.createRadialGradient(
        cx - radius * 0.2,
        cy - radius * 0.3,
        radius * 0.1,
        cx,
        cy,
        radius
      );
      if (surgeFactor > 0.05) {
        sphereGrad.addColorStop(0, '#2b0711');
        sphereGrad.addColorStop(0.7, '#150308');
        sphereGrad.addColorStop(1, '#050103');
      } else {
        sphereGrad.addColorStop(0, '#0f0a1c');
        sphereGrad.addColorStop(0.7, '#070410');
        sphereGrad.addColorStop(1, '#020106');
      }
      ctx.fillStyle = sphereGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();

      // Render Globe 3D Points
      for (const d of dots) {
        const x3d = Math.cos(d.lat) * Math.sin(d.lon + rotation);
        const y3d = Math.sin(d.lat);
        const z3d = Math.cos(d.lat) * Math.cos(d.lon + rotation);

        if (z3d > 0) {
          const px = cx + x3d * radius;
          const py = cy - y3d * radius;
          const baseAlpha = z3d * (d.isLand ? 0.95 : 0.28);
          const dotRadius = (z3d * (d.isLand ? 1.6 : 0.9)) + (surgeFactor * 0.5);

          if (surgeFactor > 0.08) {
            ctx.fillStyle = d.isLand
              ? `rgba(255, 60, 90, ${baseAlpha * (0.8 + surgeFactor * 0.4)})`
              : `rgba(180, 20, 40, ${baseAlpha * 0.5})`;
          } else {
            ctx.fillStyle = d.isLand
              ? `rgba(0, 240, 255, ${baseAlpha})`
              : `rgba(189, 0, 255, ${baseAlpha * 0.5})`;
          }

          ctx.beginPath();
          ctx.arc(px, py, Math.max(0.4, dotRadius), 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Render Energy Arcs
      for (const arc of arcs) {
        arc.progress = (arc.progress + 0.006) % 1;
        const lat = arc.lat1 + (arc.lat2 - arc.lat1) * arc.progress;
        const lon = arc.lon1 + (arc.lon2 - arc.lon1) * arc.progress;

        const x3d = Math.cos(lat) * Math.sin(lon + rotation);
        const y3d = Math.sin(lat);
        const z3d = Math.cos(lat) * Math.cos(lon + rotation);

        if (z3d > 0.15) {
          const elevation = Math.sin(arc.progress * Math.PI) * 22;
          const px = cx + x3d * (radius + elevation);
          const py = cy - y3d * (radius + elevation);

          const arcGrad = ctx.createRadialGradient(px, py, 1, px, py, 12);
          arcGrad.addColorStop(0, surgeFactor > 0.1 ? '#ff1e60' : '#00f0ff');
          arcGrad.addColorStop(1, 'rgba(0, 240, 255, 0)');
          ctx.fillStyle = arcGrad;
          ctx.beginPath();
          ctx.arc(px, py, 12, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(px, py, 2.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('lucky:power-surge', handlePowerSurge);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden transition-opacity duration-700"
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};
