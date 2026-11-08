import React, { useEffect, useRef } from 'react';
import { GLOBE_LAND_DOTS } from '../data/globeDots';

// Key metropolitan hubs for glowing city clusters (lat, lon in radians)
const CITY_HUBS = [
  { lat: (-15.79 * Math.PI) / 180, lon: (-47.88 * Math.PI) / 180, name: 'Brasilia' },
  { lat: (-23.55 * Math.PI) / 180, lon: (-46.63 * Math.PI) / 180, name: 'Sao Paulo' },
  { lat: (-3.73 * Math.PI) / 180, lon: (-38.52 * Math.PI) / 180, name: 'Fortaleza' },
  { lat: (40.71 * Math.PI) / 180, lon: (-74.0 * Math.PI) / 180, name: 'New York' },
  { lat: (37.77 * Math.PI) / 180, lon: (-122.41 * Math.PI) / 180, name: 'San Francisco' },
  { lat: (51.5 * Math.PI) / 180, lon: (-0.12 * Math.PI) / 180, name: 'London' },
  { lat: (48.85 * Math.PI) / 180, lon: (2.35 * Math.PI) / 180, name: 'Paris' },
  { lat: (35.67 * Math.PI) / 180, lon: (139.65 * Math.PI) / 180, name: 'Tokyo' },
  { lat: (1.35 * Math.PI) / 180, lon: (103.81 * Math.PI) / 180, name: 'Singapore' },
  { lat: (25.2 * Math.PI) / 180, lon: (55.27 * Math.PI) / 180, name: 'Dubai' },
];

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

    // Power surge dynamic variables (reaction to Lucky laser cannon)
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

    // Fade background softly on scroll down
    const handleScroll = () => {
      const scroll = window.scrollY;
      const op = Math.max(0.45, 1 - scroll / 3200);
      container.style.opacity = op.toString();
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 0.25;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 0.15;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Precompute dots in radians with city proximity info
    const precomputedDots = GLOBE_LAND_DOTS.map(([latDeg, lonDeg]) => {
      const lat = (latDeg * Math.PI) / 180;
      const lon = (lonDeg * Math.PI) / 180;
      const cosLat = Math.cos(lat);
      const sinLat = Math.sin(lat);

      let isNearCity = false;
      for (const hub of CITY_HUBS) {
        const dLat = lat - hub.lat;
        const dLon = lon - hub.lon;
        if (dLat * dLat + dLon * dLon < 0.035) {
          isNearCity = true;
          break;
        }
      }

      return {
        lat,
        lon,
        cosLat,
        sinLat,
        isNearCity,
      };
    });

    // Deep space stars (clean, subtle, identical to Sellix aesthetic)
    const stars = Array.from({ length: 110 }).map(() => ({
      x: Math.random(),
      y: Math.random() * 0.75, // focused in upper celestial space
      r: Math.random() * 1.2 + 0.35,
      alpha: Math.random() * 0.65 + 0.2,
      phase: Math.random() * Math.PI * 2,
    }));

    // Orbital data trajectory loop progress
    let orbitProgress = 0;
    let tick = 0;

    const render = () => {
      tick += 0.012;
      rotation += 0.0017;
      orbitProgress = (orbitProgress + 0.004) % 1;

      // Interpolate power surge
      surgeFactor += (targetSurge - surgeFactor) * 0.07;
      if (surgeFactor < 0.005) surgeFactor = 0;

      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // ==========================================
      // 1. DEEP SPACE BACKGROUND & FINE STARS
      // ==========================================
      for (const s of stars) {
        const twinkle = s.alpha + Math.sin(tick * 2.2 + s.phase) * 0.2;
        const alpha = Math.max(0.12, twinkle);
        const px = s.x * w + mouseX * 18;
        const py = s.y * h + mouseY * 12;

        ctx.fillStyle = `rgba(240, 235, 255, ${alpha})`;
        ctx.beginPath();
        ctx.arc(px, py, s.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // =========================================================================
      // 2. MONUMENTAL PLANET DOME (IDENTICAL TO SELLIX REFERENCE)
      // =========================================================================
      // Large spherical dome rising from bottom center into the hero section
      const radius = Math.min(w * 0.48, h * 0.64, 540);
      const cx = w / 2 + mouseX * 24;
      const cy = h * 0.72 + mouseY * 14;

      // (A) OUTWARD SPREADING NEON PURPLE ATMOSPHERE CORONA
      // Wide, soft, luminous purple haze extending into space
      const coronaRadius = radius * 1.24;
      const corona = ctx.createRadialGradient(cx, cy, radius * 0.92, cx, cy, coronaRadius);
      const purpleR = Math.round(168 + (255 - 168) * surgeFactor);
      const purpleG = Math.round(85 * (1 - surgeFactor));
      const purpleB = Math.round(247 * (1 - surgeFactor * 0.5));

      corona.addColorStop(0, `rgba(${purpleR}, ${purpleG}, ${purpleB}, ${0.72 + 0.25 * surgeFactor})`);
      corona.addColorStop(0.35, `rgba(139, 92, 246, ${0.42 + 0.2 * surgeFactor})`);
      corona.addColorStop(0.7, `rgba(88, 28, 135, ${0.14 + 0.1 * surgeFactor})`);
      corona.addColorStop(1, 'rgba(5, 2, 10, 0)');

      ctx.fillStyle = corona;
      ctx.beginPath();
      ctx.arc(cx, cy, coronaRadius, 0, Math.PI * 2);
      ctx.fill();

      // (B) FLANK LIMB ACCENTS (Extra thick purple atmospheric glow on sides)
      const flankLeft = ctx.createRadialGradient(
        cx - radius * 0.88,
        cy,
        radius * 0.1,
        cx - radius * 0.88,
        cy,
        radius * 0.45
      );
      flankLeft.addColorStop(0, `rgba(${purpleR}, ${purpleG}, ${purpleB}, 0.35)`);
      flankLeft.addColorStop(1, 'rgba(5, 2, 10, 0)');
      ctx.fillStyle = flankLeft;
      ctx.beginPath();
      ctx.arc(cx - radius * 0.88, cy, radius * 0.45, 0, Math.PI * 2);
      ctx.fill();

      const flankRight = ctx.createRadialGradient(
        cx + radius * 0.88,
        cy,
        radius * 0.1,
        cx + radius * 0.88,
        cy,
        radius * 0.45
      );
      flankRight.addColorStop(0, `rgba(${purpleR}, ${purpleG}, ${purpleB}, 0.35)`);
      flankRight.addColorStop(1, 'rgba(5, 2, 10, 0)');
      ctx.fillStyle = flankRight;
      ctx.beginPath();
      ctx.arc(cx + radius * 0.88, cy, radius * 0.45, 0, Math.PI * 2);
      ctx.fill();

      // (C) PLANET OBSIDIAN DARK CORE
      // Deep space black inside the planet with subtle atmospheric gradient
      const sphereCore = ctx.createRadialGradient(
        cx,
        cy - radius * 0.45,
        radius * 0.08,
        cx,
        cy,
        radius
      );
      if (surgeFactor > 0.05) {
        sphereCore.addColorStop(0, '#260815');
        sphereCore.addColorStop(0.7, '#12030a');
        sphereCore.addColorStop(1, '#050104');
      } else {
        sphereCore.addColorStop(0, '#0c071d');
        sphereCore.addColorStop(0.55, '#060310');
        sphereCore.addColorStop(1, '#030107');
      }

      ctx.fillStyle = sphereCore;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();

      // (D) INNER ATMOSPHERIC HORIZON HAZE (Subtle blue-purple haze on the inner rim)
      const innerHaze = ctx.createRadialGradient(cx, cy, radius * 0.86, cx, cy, radius);
      innerHaze.addColorStop(0, 'rgba(168, 85, 247, 0)');
      innerHaze.addColorStop(0.7, 'rgba(168, 85, 247, 0.12)');
      innerHaze.addColorStop(1, 'rgba(192, 132, 252, 0.35)');
      ctx.fillStyle = innerHaze;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();

      // =========================================================================
      // 3. GEOGRAPHICALLY ACCURATE DOTTED CONTINENTS & PULSING CITY NODES
      // =========================================================================
      const cityPulse = Math.sin(tick * 3.5) * 0.5 + 0.5;

      for (let i = 0; i < precomputedDots.length; i++) {
        const d = precomputedDots[i];
        const x3d = d.cosLat * Math.sin(d.lon + rotation);
        const y3d = d.sinLat;
        const z3d = d.cosLat * Math.cos(d.lon + rotation);

        if (z3d > 0.02) {
          const px = cx + x3d * radius;
          const py = cy - y3d * radius;

          const dotRadius = Math.max(0.65, z3d * 2.15);
          const alpha = Math.min(1.0, z3d * 1.25);

          // Glowing metropolitan city nodes
          if (d.isNearCity) {
            // Soft lavender-purple glow around the city hub
            ctx.fillStyle = `rgba(${purpleR}, ${purpleG}, ${purpleB}, ${alpha * (0.35 + 0.25 * cityPulse)})`;
            ctx.beginPath();
            ctx.arc(px, py, dotRadius * 3.5, 0, Math.PI * 2);
            ctx.fill();

            // Intense white-hot core
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.beginPath();
            ctx.arc(px, py, dotRadius * 1.3, 0, Math.PI * 2);
            ctx.fill();
          } else {
            // Standard continental land dots (pure crisp white-lavender)
            ctx.fillStyle = `rgba(242, 235, 255, ${alpha * 0.95})`;
            ctx.beginPath();
            ctx.arc(px, py, dotRadius, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      // =========================================================================
      // 4. 3D ORBITAL LIGHT TRAJECTORY PATH (OCLUSÃO 3D: PARTE DE TRÁS ESCONDIDA)
      // =========================================================================
      const orbitRadius = radius * 1.07;
      const inc = (26 * Math.PI) / 180; // Inclinação da órbita em relação ao observador
      const roll = (-14 * Math.PI) / 180; // Diagonal no plano da tela
      const cosInc = Math.cos(inc);
      const sinInc = Math.sin(inc);
      const cosRoll = Math.cos(roll);
      const sinRoll = Math.sin(roll);

      const getOrbitCoord = (theta: number) => {
        const ox = Math.cos(theta) * orbitRadius;
        const oy = Math.sin(theta) * orbitRadius * sinInc;
        const oz = Math.sin(theta) * orbitRadius * cosInc; // oz > 0 = na frente do globo; oz < 0 = atrás do globo

        const rotX = ox * cosRoll - oy * sinRoll;
        const rotY = ox * sinRoll + oy * cosRoll;

        return {
          x: cx + rotX,
          y: cy + rotY,
          oz,
        };
      };

      ctx.save();

      // (A) DESENHAR APENAS A PARTE DA FRENTE DO ANEL (theta de PI até 0)
      // A parte de trás (theta de 0 a -PI / oz < 0) fica ATRÁS do globo e NÃO É DESENHADA!
      ctx.beginPath();
      const orbitSteps = 90;
      let isFirstPoint = true;

      for (let s = 0; s <= orbitSteps; s++) {
        // Theta varia de PI (borda esquerda) até 0 (borda direita) onde oz >= 0 (frente)
        const theta = Math.PI - (s / orbitSteps) * Math.PI;
        const pt = getOrbitCoord(theta);

        if (isFirstPoint) {
          ctx.moveTo(pt.x, pt.y);
          isFirstPoint = false;
        } else {
          ctx.lineTo(pt.x, pt.y);
        }
      }

      // Traço suave do anel na frente do globo
      const orbitGrad = ctx.createLinearGradient(cx - radius * 0.9, cy, cx + radius * 0.9, cy);
      orbitGrad.addColorStop(0, 'rgba(168, 85, 247, 0.15)');
      orbitGrad.addColorStop(0.2, 'rgba(192, 132, 252, 0.45)');
      orbitGrad.addColorStop(0.5, 'rgba(216, 180, 254, 0.6)');
      orbitGrad.addColorStop(0.8, 'rgba(192, 132, 252, 0.45)');
      orbitGrad.addColorStop(1, 'rgba(168, 85, 247, 0.15)');

      ctx.strokeStyle = orbitGrad;
      ctx.lineWidth = 1.4;
      ctx.stroke();

      // (B) PULSO LUMINOSO (ESCONDIDO QUANDO ESTIVER ATRÁS DO GLOBO)
      // O pulso percorre o ciclo completo (0 a 2*PI).
      // Quando oz < 0 (parte de trás), ele NÃO É DESENHADO!
      const currentPulseTheta = Math.PI - (orbitProgress * Math.PI * 2);
      const pulsePt = getOrbitCoord(currentPulseTheta);

      if (pulsePt.oz >= 0) {
        // Pulso está na frente do globo: renderizar com brilho e cauda
        const depthFactor = Math.min(1.0, pulsePt.oz / (orbitRadius * cosInc));

        // Rastro/cauda do pulso
        const tailCount = 7;
        for (let t = 1; t <= tailCount; t++) {
          const tailTheta = currentPulseTheta + t * 0.045;
          const tailPt = getOrbitCoord(tailTheta);
          if (tailPt.oz >= 0) {
            const tailAlpha = (1 - t / tailCount) * 0.7 * depthFactor;
            ctx.fillStyle = `rgba(192, 132, 252, ${tailAlpha})`;
            ctx.beginPath();
            ctx.arc(tailPt.x, tailPt.y, Math.max(0.8, 2.2 - t * 0.25), 0, Math.PI * 2);
            ctx.fill();
          }
        }

        // Brilho radiante do pulso
        const pulseGlow = ctx.createRadialGradient(pulsePt.x, pulsePt.y, 0, pulsePt.x, pulsePt.y, 16);
        pulseGlow.addColorStop(0, `rgba(255, 255, 255, ${0.95 * depthFactor})`);
        pulseGlow.addColorStop(0.35, `rgba(192, 132, 252, ${0.85 * depthFactor})`);
        pulseGlow.addColorStop(0.7, `rgba(168, 85, 247, ${0.35 * depthFactor})`);
        pulseGlow.addColorStop(1, 'rgba(168, 85, 247, 0)');
        ctx.fillStyle = pulseGlow;
        ctx.beginPath();
        ctx.arc(pulsePt.x, pulsePt.y, 16, 0, Math.PI * 2);
        ctx.fill();

        // Núcleo branco incandescente do pulso
        ctx.fillStyle = `rgba(255, 255, 255, ${depthFactor})`;
        ctx.beginPath();
        ctx.arc(pulsePt.x, pulsePt.y, 2.6, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();

      // =========================================================================
      // 5. INCANDESCENT ATMOSPHERIC CREST RIM (BORDA BRILHANTE IDENTICA AO VÍDEO)
      // =========================================================================
      ctx.save();
      ctx.beginPath();
      // Arc curving over the upper dome of the planet
      ctx.arc(cx, cy, radius, Math.PI * 0.84, Math.PI * 2.16);
      const rimStroke = ctx.createLinearGradient(cx - radius * 0.9, cy, cx + radius * 0.9, cy);
      rimStroke.addColorStop(0, 'rgba(168, 85, 247, 0.2)');
      rimStroke.addColorStop(0.2, 'rgba(192, 132, 252, 0.92)');
      rimStroke.addColorStop(0.5, '#ffffff'); // Pure incandescent white crest at the apex
      rimStroke.addColorStop(0.8, 'rgba(192, 132, 252, 0.92)');
      rimStroke.addColorStop(1, 'rgba(168, 85, 247, 0.2)');

      ctx.strokeStyle = rimStroke;
      ctx.lineWidth = 2.6;
      ctx.shadowColor = `rgb(${purpleR}, ${purpleG}, ${purpleB})`;
      ctx.shadowBlur = 24;
      ctx.stroke();
      ctx.restore();

      // Apex soft aurora starburst bloom
      const apexX = cx;
      const apexY = cy - radius;
      const apexBloom = ctx.createRadialGradient(apexX, apexY, 0, apexX, apexY, 95);
      apexBloom.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
      apexBloom.addColorStop(0.25, `rgba(${purpleR}, ${purpleG}, ${purpleB}, 0.65)`);
      apexBloom.addColorStop(0.7, 'rgba(139, 92, 246, 0.15)');
      apexBloom.addColorStop(1, 'rgba(139, 92, 246, 0)');
      ctx.fillStyle = apexBloom;
      ctx.beginPath();
      ctx.arc(apexX, apexY, 95, 0, Math.PI * 2);
      ctx.fill();

      // Horizontal subtle lens streak across apex
      const apexStreak = ctx.createLinearGradient(apexX - 160, apexY, apexX + 160, apexY);
      apexStreak.addColorStop(0, 'rgba(168, 85, 247, 0)');
      apexStreak.addColorStop(0.5, 'rgba(255, 255, 255, 0.85)');
      apexStreak.addColorStop(1, 'rgba(168, 85, 247, 0)');
      ctx.fillStyle = apexStreak;
      ctx.fillRect(apexX - 160, apexY - 1.2, 320, 2.4);

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
