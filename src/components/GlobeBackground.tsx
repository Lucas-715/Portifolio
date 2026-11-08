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

    // Power surge dynamic variables (0 = normal, 1 = maximum crimson surge)
    let surgeFactor = 0;
    let targetSurge = 0;
    let shockwaveRadius = 0;
    let shockwaveAlpha = 0;

    const handlePowerSurge = (e: Event) => {
      const custom = e as CustomEvent<{ level?: number; isFiring?: boolean }>;
      if (custom.detail) {
        if (custom.detail.isFiring) {
          targetSurge = 1.35;
          shockwaveRadius = 10;
          shockwaveAlpha = 0.95;
          // Slowly cool down back to zero
          setTimeout(() => {
            targetSurge = 0;
          }, 450);
        } else if (typeof custom.detail.level === 'number') {
          targetSurge = (custom.detail.level / 100) * 0.9;
        }
      }
    };
    window.addEventListener('lucky:power-surge', handlePowerSurge);

    // Passive scroll listener for container opacity & offscreen performance
    let isOffscreen = false;
    const handleScroll = () => {
      const scroll = window.scrollY;
      isOffscreen = scroll > window.innerHeight * 0.95;
      const op = Math.max(0.1, 1 - scroll / 1200);
      container.style.opacity = op.toString();
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 0.22;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 0.12;
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

    const stars = Array.from({ length: 85 }).map(() => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.3 + 0.3,
      alpha: Math.random() * 0.45 + 0.15,
      phase: Math.random() * Math.PI * 2,
    }));

    // Orbital energy arcs connecting global hubs
    const arcs = [
      { lat1: -0.085, lon1: -0.66, lat2: -0.41, lon2: -0.81, progress: 0 },
      { lat1: -0.085, lon1: -0.66, lat2: 0.65, lon2: -1.3, progress: 0.4 },
      { lat1: -0.41, lon1: -0.81, lat2: 0.88, lon2: 0.05, progress: 0.75 },
    ];

    let tick = 0;

    const render = () => {
      // Offscreen performance bypass: when user scrolled down to content, skip heavy canvas draw cycles
      if (isOffscreen && surgeFactor < 0.01) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      tick += 0.012;
      rotation += 0.0018;

      // Smoothly interpolate power surge factor
      surgeFactor += (targetSurge - surgeFactor) * 0.07;
      if (surgeFactor < 0.005) surgeFactor = 0;

      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Crimson Power Surge Background Shift
      if (surgeFactor > 0.01) {
        const bgGrad = ctx.createRadialGradient(w / 2, h * 0.6, 50, w / 2, h * 0.6, Math.max(w, h));
        bgGrad.addColorStop(0, `rgba(239, 68, 68, ${0.45 * surgeFactor})`);
        bgGrad.addColorStop(0.45, `rgba(185, 28, 28, ${0.28 * surgeFactor})`);
        bgGrad.addColorStop(0.85, `rgba(88, 28, 28, ${0.15 * surgeFactor})`);
        bgGrad.addColorStop(1, 'rgba(4, 2, 10, 0)');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);
      }

      // Stars
      for (const s of stars) {
        const twinkle = s.alpha + Math.sin(tick * 2 + s.phase) * 0.15;
        const starR = Math.min(255, Math.round(186 + 69 * surgeFactor));
        const starG = Math.min(255, Math.round(230 * (1 - surgeFactor * 0.6)));
        const starB = Math.min(255, Math.round(253 * (1 - surgeFactor * 0.7)));
        ctx.fillStyle = `rgba(${starR}, ${starG}, ${starB}, ${Math.max(0.08, twinkle)})`;
        ctx.beginPath();
        ctx.arc(s.x * w, s.y * h, s.r, 0, Math.PI * 2);
        ctx.fill();
      }

      const cx = w / 2 + mouseX * 30;
      const cy = h * 0.62 + mouseY * 18;
      const radius = Math.min(w * 0.44, h * 0.56, 450);

      // Ambient Halo — interpolates from Cyber Violet/Cyan to Glowing Crimson Overdrive
      const outerGlow = ctx.createRadialGradient(cx, cy, radius * 0.7, cx, cy, radius * 1.45);
      const haloR = Math.round(189 + (255 - 189) * surgeFactor);
      const haloG = Math.round(0 + 30 * surgeFactor);
      const haloB = Math.round(255 * (1 - surgeFactor));
      outerGlow.addColorStop(0, `rgba(${haloR}, ${haloG}, ${haloB}, ${0.22 + 0.35 * surgeFactor})`);
      outerGlow.addColorStop(0.5, `rgba(${Math.round(240 * surgeFactor)}, ${Math.round(240 * (1 - surgeFactor))}, ${Math.round(255 * (1 - surgeFactor))}, ${0.10 + 0.25 * surgeFactor})`);
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
        sphereGrad.addColorStop(0.65, '#160207');
        sphereGrad.addColorStop(0.95, '#2e040c');
        sphereGrad.addColorStop(1, '#ff2244');
      } else {
        sphereGrad.addColorStop(0, '#12072e');
        sphereGrad.addColorStop(0.65, '#05020e');
        sphereGrad.addColorStop(0.95, '#0c051f');
        sphereGrad.addColorStop(1, '#00f0ff');
      }
      ctx.fillStyle = sphereGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();

      // Outer Rim Ring
      const rimR = Math.round(255 * surgeFactor);
      const rimG = Math.round(240 * (1 - surgeFactor));
      const rimB = Math.round(255 * (1 - surgeFactor));
      ctx.strokeStyle = `rgba(${rimR || 0}, ${rimG}, ${rimB}, ${0.35 + 0.45 * surgeFactor})`;
      ctx.lineWidth = 1.4 + surgeFactor * 1.5;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.stroke();

      const tilt = 0.22 + mouseY * 0.2;
      const cosTilt = Math.cos(tilt);
      const sinTilt = Math.sin(tilt);

      const project = (lat: number, lon: number, alt = 1) => {
        const r = radius * alt;
        const rotLon = lon + rotation + mouseX;
        const x = r * Math.cos(lat) * Math.sin(rotLon);
        const y0 = r * Math.sin(lat);
        const z0 = r * Math.cos(lat) * Math.cos(rotLon);

        const y = y0 * cosTilt - z0 * sinTilt;
        const z = y0 * sinTilt + z0 * cosTilt;
        return { x: cx + x, y: cy - y, z };
      };

      // Matrix Continents
      for (const dot of dots) {
        const p = project(dot.lat, dot.lon);
        if (p.z > 0) {
          const depthAlpha = Math.min(1, p.z / (radius * 0.65));
          if (dot.isLand) {
            const landR = Math.round(255 * surgeFactor);
            const landG = Math.round(240 * (1 - surgeFactor) + 60 * surgeFactor);
            const landB = Math.round(255 * (1 - surgeFactor));
            ctx.fillStyle = `rgba(${landR}, ${landG}, ${landB}, ${(0.72 + 0.25 * surgeFactor) * depthAlpha})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, 1.5 + surgeFactor * 0.4, 0, Math.PI * 2);
            ctx.fill();
          } else {
            const ocR = Math.round(189 + (255 - 189) * surgeFactor);
            const ocG = Math.round(30 * surgeFactor);
            const ocB = Math.round(255 * (1 - surgeFactor));
            ctx.fillStyle = `rgba(${ocR}, ${ocG}, ${ocB}, ${(0.12 + 0.2 * surgeFactor) * depthAlpha})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, 0.85, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      // Orbital Arcs
      for (const arc of arcs) {
        arc.progress = (arc.progress + 0.005) % 1;
        const p1 = project(arc.lat1, arc.lon1, 1.01);
        const p2 = project(arc.lat2, arc.lon2, 1.01);
        const midLat = (arc.lat1 + arc.lat2) / 2;
        const midLon = (arc.lon1 + arc.lon2) / 2;
        const pMid = project(midLat, midLon, 1.22);

        if (p1.z > -radius * 0.15 && p2.z > -radius * 0.15) {
          const arcColor = surgeFactor > 0.3 ? '#ff2255' : '#00f0ff';
          ctx.strokeStyle = surgeFactor > 0.3 ? 'rgba(255, 50, 80, 0.55)' : 'rgba(0, 240, 255, 0.25)';
          ctx.lineWidth = 1.2 + surgeFactor * 1.0;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.quadraticCurveTo(pMid.x, pMid.y, p2.x, p2.y);
          ctx.stroke();

          const t = arc.progress;
          const invT = 1 - t;
          const px = invT * invT * p1.x + 2 * invT * t * pMid.x + t * t * p2.x;
          const py = invT * invT * p1.y + 2 * invT * t * pMid.y + t * t * p2.y;

          ctx.fillStyle = '#ffffff';
          ctx.shadowColor = arcColor;
          ctx.shadowBlur = 8 + surgeFactor * 12;
          ctx.beginPath();
          ctx.arc(px, py, 2.4 + surgeFactor * 1.2, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }

      // Dynamic Shockwave Ripple on Firing
      if (shockwaveAlpha > 0.01) {
        shockwaveRadius += 16;
        shockwaveAlpha *= 0.94;
        ctx.strokeStyle = `rgba(239, 68, 68, ${shockwaveAlpha})`;
        ctx.lineWidth = 4 * shockwaveAlpha;
        ctx.shadowColor = '#ef4444';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(cx, cy, shockwaveRadius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('lucky:power-surge', handlePowerSurge);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-500 will-change-transform"
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#04020a]/35 to-[#04020a]/95" />
    </div>
  );
};
