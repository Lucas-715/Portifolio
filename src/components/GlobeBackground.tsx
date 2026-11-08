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

interface Meteor {
  x: number;
  y: number;
  dx: number;
  dy: number;
  length: number;
  speed: number;
  alpha: number;
  life: number;
  maxLife: number;
  color: string;
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

    const handlePowerSurge = (e: Event) => {
      const custom = e as CustomEvent<{ level?: number; isFiring?: boolean }>;
      if (custom.detail) {
        if (custom.detail.isFiring) {
          targetSurge = 1.35;
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
      const op = Math.max(0.6, 1 - scroll / 3800);
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

    // Precompute high-density globe dot matrix
    const dots: { lat: number; lon: number; isLand: boolean }[] = [];
    for (let lat = -80; lat <= 80; lat += 2.8) {
      const cosLat = Math.cos((lat * Math.PI) / 180);
      const stepLon = Math.max(2.8, 2.8 / Math.max(0.18, cosLat));
      for (let lon = -180; lon < 180; lon += stepLon) {
        dots.push({
          lat: (lat * Math.PI) / 180,
          lon: (lon * Math.PI) / 180,
          isLand: isLandMass(lat, lon),
        });
      }
    }

    // Dynamic deep space stars (135 stars with varying depths & diffraction sparkles)
    const stars = Array.from({ length: 135 }).map((_, i) => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.0003,
      vy: (Math.random() - 0.5) * 0.0003,
      r: Math.random() < 0.12 ? Math.random() * 1.8 + 1.2 : Math.random() * 1.1 + 0.35,
      alpha: Math.random() * 0.6 + 0.25,
      phase: Math.random() * Math.PI * 2,
      isBright: i < 14,
      colorType: Math.random() > 0.65 ? 'cyan' : Math.random() > 0.35 ? 'violet' : 'white',
    }));

    // Constellation lines linking small celestial clusters
    const constellationPairs = [
      [2, 5],
      [5, 9],
      [9, 11],
      [18, 22],
      [22, 27],
      [34, 40],
      [40, 48],
    ];

    // Orbital energy arcs connecting global hubs
    const arcs = [
      { lat1: -0.085, lon1: -0.66, lat2: -0.41, lon2: -0.81, progress: 0 },
      { lat1: -0.085, lon1: -0.66, lat2: 0.65, lon2: -1.3, progress: 0.4 },
      { lat1: -0.41, lon1: -0.81, lat2: 0.88, lon2: 0.05, progress: 0.75 },
      { lat1: 0.65, lon1: -1.3, lat2: 0.58, lon2: 2.1, progress: 0.2 },
    ];

    // Shooting stars / meteors manager
    const meteors: Meteor[] = [];
    let meteorCooldown = 40;

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
      // 1. DEEP SPACE LIVING NEBULAS & AURORAS
      // ==========================================
      // Nebula 1: Upper-left Cyan-Indigo Aurora
      const neb1X = w * 0.28 + Math.sin(tick * 0.6) * 50 + mouseX * 45;
      const neb1Y = h * 0.28 + Math.cos(tick * 0.5) * 35 + mouseY * 30;
      const nebula1 = ctx.createRadialGradient(neb1X, neb1Y, 30, neb1X, neb1Y, Math.max(w * 0.65, 520));
      nebula1.addColorStop(0, 'rgba(0, 240, 255, 0.09)');
      nebula1.addColorStop(0.4, 'rgba(99, 102, 241, 0.045)');
      nebula1.addColorStop(0.8, 'rgba(10, 6, 28, 0.02)');
      nebula1.addColorStop(1, 'rgba(4, 2, 10, 0)');
      ctx.fillStyle = nebula1;
      ctx.fillRect(0, 0, w, h);

      // Nebula 2: Deep Violet-Fuchsia Cosmic Core (Right side)
      const neb2X = w * 0.78 + Math.cos(tick * 0.65) * 45 - mouseX * 40;
      const neb2Y = h * 0.55 + Math.sin(tick * 0.75) * 40 - mouseY * 25;
      const nebula2 = ctx.createRadialGradient(neb2X, neb2Y, 20, neb2X, neb2Y, Math.max(w * 0.6, 480));
      nebula2.addColorStop(0, 'rgba(189, 0, 255, 0.08)');
      nebula2.addColorStop(0.45, 'rgba(217, 70, 239, 0.035)');
      nebula2.addColorStop(0.85, 'rgba(4, 2, 10, 0.015)');
      nebula2.addColorStop(1, 'rgba(4, 2, 10, 0)');
      ctx.fillStyle = nebula2;
      ctx.fillRect(0, 0, w, h);

      // Power Surge background reaction (Laser cannon attack)
      if (surgeFactor > 0.01) {
        const bgGrad = ctx.createRadialGradient(w / 2, h * 0.55, 50, w / 2, h * 0.55, Math.max(w, h));
        bgGrad.addColorStop(0, `rgba(239, 68, 68, ${0.45 * surgeFactor})`);
        bgGrad.addColorStop(0.45, `rgba(185, 28, 28, ${0.28 * surgeFactor})`);
        bgGrad.addColorStop(0.85, `rgba(88, 28, 28, ${0.15 * surgeFactor})`);
        bgGrad.addColorStop(1, 'rgba(4, 2, 10, 0)');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);
      }

      // ==========================================
      // 2. CONSTELLATION CONNECTION LINES
      // ==========================================
      ctx.lineWidth = 0.6;
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.12)';
      for (const [idx1, idx2] of constellationPairs) {
        const s1 = stars[idx1];
        const s2 = stars[idx2];
        if (s1 && s2) {
          const x1 = s1.x * w + mouseX * 18;
          const y1 = s1.y * h + mouseY * 12;
          const x2 = s2.x * w + mouseX * 18;
          const y2 = s2.y * h + mouseY * 12;
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        }
      }

      // ==========================================
      // 3. TWINKLING STARS WITH DIFFRACTION SPARKLES
      // ==========================================
      for (const s of stars) {
        s.x += s.vx;
        s.y += s.vy;
        if (s.x < 0) s.x = 1;
        if (s.x > 1) s.x = 0;
        if (s.y < 0) s.y = 1;
        if (s.y > 1) s.y = 0;

        const twinkle = s.alpha + Math.sin(tick * 2.8 + s.phase) * 0.22;
        const currentAlpha = Math.max(0.14, twinkle);
        let starColor = 'rgba(255, 255, 255,';
        if (s.colorType === 'cyan') starColor = 'rgba(0, 240, 255,';
        else if (s.colorType === 'violet') starColor = 'rgba(189, 0, 255,';

        const px = s.x * w + mouseX * 22;
        const py = s.y * h + mouseY * 16;

        ctx.fillStyle = `${starColor} ${currentAlpha})`;
        ctx.beginPath();
        ctx.arc(px, py, s.r, 0, Math.PI * 2);
        ctx.fill();

        // 4-point cross diffraction sparkle for bright stars
        if (s.isBright) {
          const spikeLen = s.r * 3.6;
          ctx.strokeStyle = `rgba(255, 255, 255, ${currentAlpha * 0.65})`;
          ctx.lineWidth = 0.75;
          ctx.beginPath();
          ctx.moveTo(px - spikeLen, py);
          ctx.lineTo(px + spikeLen, py);
          ctx.moveTo(px, py - spikeLen);
          ctx.lineTo(px, py + spikeLen);
          ctx.stroke();
        }
      }

      // ==========================================
      // 4. METEORS / SHOOTING STARS
      // ==========================================
      meteorCooldown--;
      if (meteorCooldown <= 0) {
        meteorCooldown = Math.floor(Math.random() * 180 + 120); // every ~3-5 seconds
        const startX = Math.random() * w * 0.85 + w * 0.15;
        const startY = Math.random() * h * 0.4;
        const angle = (Math.PI / 180) * (135 + (Math.random() - 0.5) * 22);
        const speed = Math.random() * 6 + 10;
        meteors.push({
          x: startX,
          y: startY,
          dx: Math.cos(angle) * speed,
          dy: Math.sin(angle) * speed,
          length: Math.random() * 70 + 60,
          speed,
          alpha: 1,
          life: 0,
          maxLife: Math.floor(Math.random() * 40 + 30),
          color: Math.random() > 0.4 ? '#00f0ff' : '#bd00ff',
        });
      }

      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i];
        m.life++;
        m.x += m.dx;
        m.y += m.dy;
        m.alpha = Math.max(0, 1 - m.life / m.maxLife);

        ctx.save();
        ctx.translate(m.x, m.y);
        const headingAngle = Math.atan2(m.dy, m.dx);
        ctx.rotate(headingAngle);

        const mGrad = ctx.createLinearGradient(0, 0, -m.length, 0);
        mGrad.addColorStop(0, `rgba(255, 255, 255, ${m.alpha})`);
        mGrad.addColorStop(0.2, m.color === '#00f0ff' ? `rgba(0, 240, 255, ${m.alpha * 0.9})` : `rgba(189, 0, 255, ${m.alpha * 0.9})`);
        mGrad.addColorStop(1, 'rgba(0, 240, 255, 0)');

        ctx.strokeStyle = mGrad;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-m.length, 0);
        ctx.stroke();

        ctx.fillStyle = `rgba(255, 255, 255, ${m.alpha})`;
        ctx.beginPath();
        ctx.arc(0, 0, 1.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        if (m.life >= m.maxLife) {
          meteors.splice(i, 1);
        }
      }

      // =========================================================================
      // 5. THE CELESTIAL PLANET & RADIANT ATMOSPHERIC RIM (BORDA BRILHANTE)
      // Perfeita simetria e alinhamento geométrico com o Hero Section
      // =========================================================================
      const cx = w / 2 + mouseX * 28;
      const cy = h * 0.58 + mouseY * 18;
      const radius = Math.min(w * 0.44, h * 0.53, 445);

      // (A) Extended Cosmic Atmosphere Corona (Glow suave no espaço ao redor)
      const coronaGlow = ctx.createRadialGradient(cx, cy, radius * 0.85, cx, cy, radius * 1.35);
      const cR = Math.round(0 + 255 * surgeFactor);
      const cG = Math.round(240 * (1 - surgeFactor * 0.8));
      const cB = Math.round(255 * (1 - surgeFactor * 0.8));
      coronaGlow.addColorStop(0, `rgba(${cR}, ${cG}, ${cB}, ${0.28 + 0.35 * surgeFactor})`);
      coronaGlow.addColorStop(0.4, `rgba(168, 85, 247, ${0.14 + 0.2 * surgeFactor})`);
      coronaGlow.addColorStop(0.8, 'rgba(10, 6, 28, 0.03)');
      coronaGlow.addColorStop(1, 'rgba(4, 2, 10, 0)');
      ctx.fillStyle = coronaGlow;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 1.35, 0, Math.PI * 2);
      ctx.fill();

      // (B) Planet Obsidian Dark Core
      const sphereGrad = ctx.createRadialGradient(
        cx,
        cy - radius * 0.5,
        radius * 0.1,
        cx,
        cy,
        radius
      );
      if (surgeFactor > 0.05) {
        sphereGrad.addColorStop(0, '#2b0711');
        sphereGrad.addColorStop(0.7, '#140308');
        sphereGrad.addColorStop(1, '#050103');
      } else {
        sphereGrad.addColorStop(0, '#0c071d');
        sphereGrad.addColorStop(0.5, '#070412');
        sphereGrad.addColorStop(1, '#020106');
      }
      ctx.fillStyle = sphereGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();

      // (C) Inner Horizon Atmospheric Haze
      const innerHaze = ctx.createRadialGradient(cx, cy, radius * 0.86, cx, cy, radius);
      innerHaze.addColorStop(0, 'rgba(0, 240, 255, 0)');
      innerHaze.addColorStop(0.7, 'rgba(0, 240, 255, 0.08)');
      innerHaze.addColorStop(1, 'rgba(0, 240, 255, 0.28)');
      ctx.fillStyle = innerHaze;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();

      // (D) Render Globe 3D Points Matrix (Continents & Network Nodes)
      for (const d of dots) {
        const x3d = Math.cos(d.lat) * Math.sin(d.lon + rotation);
        const y3d = Math.sin(d.lat);
        const z3d = Math.cos(d.lat) * Math.cos(d.lon + rotation);

        if (z3d > 0) {
          const px = cx + x3d * radius;
          const py = cy - y3d * radius;
          const baseAlpha = z3d * (d.isLand ? 0.95 : 0.22);
          const dotRadius = (z3d * (d.isLand ? 1.6 : 0.85)) + (surgeFactor * 0.5);

          if (surgeFactor > 0.08) {
            ctx.fillStyle = d.isLand
              ? `rgba(255, 60, 90, ${baseAlpha * (0.85 + surgeFactor * 0.4)})`
              : `rgba(180, 20, 40, ${baseAlpha * 0.4})`;
          } else {
            ctx.fillStyle = d.isLand
              ? `rgba(0, 240, 255, ${baseAlpha})`
              : `rgba(168, 85, 247, ${baseAlpha * 0.45})`;
          }

          ctx.beginPath();
          ctx.arc(px, py, Math.max(0.4, dotRadius), 0, Math.PI * 2);
          ctx.fill();

          // Pulsing digital city lights on land
          if (d.isLand && Math.sin(d.lat * 12 + d.lon * 15) > 0.84) {
            const cityPulse = Math.sin(tick * 3 + d.lat * 8) * 0.5 + 0.5;
            ctx.fillStyle = `rgba(255, 255, 255, ${baseAlpha * 0.95})`;
            ctx.beginPath();
            ctx.arc(px, py, dotRadius * 1.3, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = `rgba(0, 240, 255, ${baseAlpha * 0.45 * cityPulse})`;
            ctx.beginPath();
            ctx.arc(px, py, dotRadius * 2.8, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      // (E) Render Orbital Energy Arcs
      for (const arc of arcs) {
        arc.progress = (arc.progress + 0.0055) % 1;
        const lat = arc.lat1 + (arc.lat2 - arc.lat1) * arc.progress;
        const lon = arc.lon1 + (arc.lon2 - arc.lon1) * arc.progress;

        const x3d = Math.cos(lat) * Math.sin(lon + rotation);
        const y3d = Math.sin(lat);
        const z3d = Math.cos(lat) * Math.cos(lon + rotation);

        if (z3d > 0.15) {
          const elevation = Math.sin(arc.progress * Math.PI) * 20;
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

      // (F) BORDA DO PLANETA BRILHANTE (RADIANT ATMOSPHERIC LIMB & INCANDESCENT HORIZON)
      // 1. Atmosphere scattering halo arc
      const rimScatter = ctx.createRadialGradient(cx, cy, radius * 0.96, cx, cy, radius * 1.14);
      rimScatter.addColorStop(0, 'rgba(0, 240, 255, 0.85)');
      rimScatter.addColorStop(0.35, 'rgba(0, 210, 255, 0.55)');
      rimScatter.addColorStop(0.7, 'rgba(168, 85, 247, 0.22)');
      rimScatter.addColorStop(1, 'rgba(0, 240, 255, 0)');
      ctx.fillStyle = rimScatter;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 1.14, 0, Math.PI * 2);
      ctx.fill();

      // 2. Razor-sharp incandescent upper horizon arc (Linha brilhante da borda)
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, radius, Math.PI * 0.8, Math.PI * 2.2);
      const rimStroke = ctx.createLinearGradient(cx - radius * 0.85, cy, cx + radius * 0.85, cy);
      rimStroke.addColorStop(0, 'rgba(0, 240, 255, 0.2)');
      rimStroke.addColorStop(0.25, 'rgba(0, 240, 255, 0.95)');
      rimStroke.addColorStop(0.5, '#ffffff');
      rimStroke.addColorStop(0.75, 'rgba(0, 240, 255, 0.95)');
      rimStroke.addColorStop(1, 'rgba(0, 240, 255, 0.2)');
      ctx.strokeStyle = rimStroke;
      ctx.lineWidth = 2.4;
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = 22;
      ctx.stroke();
      ctx.restore();

      // 3. Celestial Dawn / Starburst Flare no topo do planeta
      const apexX = cx;
      const apexY = cy - radius;
      const flareGrad = ctx.createRadialGradient(apexX, apexY, 0, apexX, apexY, 120);
      flareGrad.addColorStop(0, 'rgba(255, 255, 255, 0.92)');
      flareGrad.addColorStop(0.2, 'rgba(0, 240, 255, 0.65)');
      flareGrad.addColorStop(0.6, 'rgba(168, 85, 247, 0.2)');
      flareGrad.addColorStop(1, 'rgba(0, 240, 255, 0)');
      ctx.fillStyle = flareGrad;
      ctx.beginPath();
      ctx.arc(apexX, apexY, 120, 0, Math.PI * 2);
      ctx.fill();

      // Horizontal lens flare streak across the apex
      const streakGrad = ctx.createLinearGradient(apexX - 190, apexY, apexX + 190, apexY);
      streakGrad.addColorStop(0, 'rgba(0, 240, 255, 0)');
      streakGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.9)');
      streakGrad.addColorStop(1, 'rgba(0, 240, 255, 0)');
      ctx.fillStyle = streakGrad;
      ctx.fillRect(apexX - 190, apexY - 1.2, 380, 2.4);

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
