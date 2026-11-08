import React, { useEffect, useRef } from 'react';
import { GLOBE_LAND_DOTS } from '../data/globeDots';

// Key metropolitan hubs for glowing city clusters (lat, lon in radians)
const CITY_HUBS = [
  { lat: (-4.9403 * Math.PI) / 180, lon: (-37.9750 * Math.PI) / 180, name: 'Russas' },
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

    // Check prefers-reduced-motion
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Visibility & Scroll-based render pausing to eliminate background thread work
    let isVisible = true;
    let isScrolledIntoView = true;

    const checkScrollVisibility = () => {
      // Pause RAF if scrolled more than 1.4 viewports down (past the hero globe)
      const scrolledPast = window.scrollY > window.innerHeight * 1.35;
      isScrolledIntoView = !scrolledPast;
      if (isScrolledIntoView && isVisible && !animationFrameId && !prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    const handleVisibilityChange = () => {
      isVisible = document.visibilityState === 'visible';
      if (isVisible && isScrolledIntoView && !animationFrameId && !prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    // Fade background softly on scroll down & check visibility
    const handleScroll = () => {
      const scroll = window.scrollY;
      const op = Math.max(0.45, 1 - scroll / 3200);
      container.style.opacity = op.toString();
      checkScrollVisibility();
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 0.25;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 0.15;
    };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
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

    function render() {
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
          let alpha = Math.min(1.0, z3d * 1.25);

          // Suave atenuação dos pontos luminosos que passam diretamente atrás do texto da hero
          const dxText = (px - cx) / (radius * 0.58);
          const dyText = (py - (cy - radius * 0.44)) / (radius * 0.35);
          const textDist = Math.hypot(dxText, dyText);
          if (textDist < 1.0) {
            alpha *= Math.max(0.14, Math.pow(textDist, 1.6));
          }

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
      // 3.5. BEACON DE RUSSAS, CEARÁ (UFC CAMPUS RUSSAS)
      // =========================================================================
      // Coordenadas geográficas: 4.9403° S, 37.9750° W
      const RUSSAS_LAT = (-4.9403 * Math.PI) / 180;
      const RUSSAS_LON = (-37.9750 * Math.PI) / 180;
      const rCosLat = Math.cos(RUSSAS_LAT);
      const rSinLat = Math.sin(RUSSAS_LAT);

      const rx3d = rCosLat * Math.sin(RUSSAS_LON + rotation);
      const ry3d = rSinLat;
      const rz3d = rCosLat * Math.cos(RUSSAS_LON + rotation);

      // Visível no hemisfério frontal voltado para o usuário
      if (rz3d > 0.04) {
        const rpx = cx + rx3d * radius;
        const rpy = cy - ry3d * radius;
        const rAlpha = Math.min(1.0, rz3d * 1.6);

        ctx.save();

        // 1. Ondas de Radar Concêntricas em Expansão
        for (let p = 0; p < 2; p++) {
          const pingProgress = (tick * 1.5 + p * 0.5) % 1;
          const pingR = 3 + pingProgress * 22;
          const pingOpacity = (1 - pingProgress) * 0.8 * rAlpha;

          ctx.strokeStyle = `rgba(0, 240, 255, ${pingOpacity})`;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.arc(rpx, rpy, pingR, 0, Math.PI * 2);
          ctx.stroke();
        }

        // 2. Halo radiante de destaque
        const pinGlow = ctx.createRadialGradient(rpx, rpy, 0, rpx, rpy, 13);
        pinGlow.addColorStop(0, `rgba(255, 255, 255, ${rAlpha})`);
        pinGlow.addColorStop(0.35, `rgba(0, 240, 255, ${0.9 * rAlpha})`);
        pinGlow.addColorStop(0.7, `rgba(168, 85, 247, ${0.4 * rAlpha})`);
        pinGlow.addColorStop(1, 'rgba(0, 240, 255, 0)');
        ctx.fillStyle = pinGlow;
        ctx.beginPath();
        ctx.arc(rpx, rpy, 13, 0, Math.PI * 2);
        ctx.fill();

        // 3. Ponto focal sólido
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(rpx, rpy, 2.7, 0, Math.PI * 2);
        ctx.fill();

        // 4. Tag técnica HUD com linha conectora
        const elbowX = rpx + 18;
        const elbowY = rpy - 16;
        const lineEndX = elbowX + 16;

        ctx.strokeStyle = `rgba(0, 240, 255, ${0.75 * rAlpha})`;
        ctx.lineWidth = 1.1;
        ctx.beginPath();
        ctx.moveTo(rpx, rpy);
        ctx.lineTo(elbowX, elbowY);
        ctx.lineTo(lineEndX, elbowY);
        ctx.stroke();

        // Pill badge
        const tagW = 84;
        const tagH = 20;
        const tagX = lineEndX + 3;
        const tagY = elbowY - tagH / 2;

        ctx.fillStyle = `rgba(8, 3, 24, ${0.88 * rAlpha})`;
        ctx.strokeStyle = `rgba(0, 240, 255, ${0.6 * rAlpha})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(tagX, tagY, tagW, tagH, 4);
        ctx.fill();
        ctx.stroke();

        // Ponto indicador no badge
        ctx.fillStyle = `rgba(0, 240, 255, ${rAlpha})`;
        ctx.beginPath();
        ctx.arc(tagX + 8, tagY + tagH / 2, 2.2, 0, Math.PI * 2);
        ctx.fill();

        // Texto da marcação
        ctx.font = '600 9.5px monospace, sans-serif';
        ctx.fillStyle = `rgba(255, 255, 255, ${0.95 * rAlpha})`;
        ctx.textBaseline = 'middle';
        ctx.fillText('Russas, CE', tagX + 15, tagY + tagH / 2);

        ctx.restore();
      }

      // =========================================================================
      // 4. 3D ORBITAL LIGHT TRAJECTORY PATH (OCLUSÃO COMPLETA NA BORDA DO GLOBO)
      // =========================================================================
      // Dá a volta completa no espaço ao redor do planeta;
      // A linha e o pulso só somem no momento exato em que triscarem no disco do globo!
      const orbitRadius = radius * 1.15;
      const inc = (28 * Math.PI) / 180; // Inclinação da órbita em relação ao observador
      const roll = (-12 * Math.PI) / 180; // Diagonal no plano da tela
      const cosInc = Math.cos(inc);
      const sinInc = Math.sin(inc);
      const cosRoll = Math.cos(roll);
      const sinRoll = Math.sin(roll);

      const getOrbitCoord = (theta: number) => {
        const ox = Math.cos(theta) * orbitRadius;
        const oy = Math.sin(theta) * orbitRadius * sinInc;
        const oz = Math.sin(theta) * orbitRadius * cosInc; // oz > 0 = frente; oz < 0 = trás

        const rotX = ox * cosRoll - oy * sinRoll;
        const rotY = ox * sinRoll + oy * cosRoll;

        return {
          x: cx + rotX,
          y: cy + rotY,
          oz,
        };
      };

      // Checa visibilidade: se oz >= 0 (frente do globo), sempre visível.
      // Se oz < 0 (atrás), visível no espaço aberto (dist >= radius), e some exatamente quando trisca no globo (dist < radius).
      const checkOrbitVisibility = (coord: { x: number; y: number; oz: number }) => {
        const d = Math.hypot(coord.x - cx, coord.y - cy);
        return coord.oz >= -0.5 || d >= radius;
      };

      // Busca binária rápida para encontrar o ponto exato da borda do globo onde dist == radius
      const findHorizonEdge = (thA: number, thB: number, targetVis: boolean) => {
        let t1 = thA;
        let t2 = thB;
        for (let iter = 0; iter < 7; iter++) {
          const tMid = (t1 + t2) / 2;
          const midPt = getOrbitCoord(tMid);
          const isMidVis = checkOrbitVisibility(midPt);
          if (isMidVis === targetVis) {
            t2 = tMid;
          } else {
            t1 = tMid;
          }
        }
        return getOrbitCoord((t1 + t2) / 2);
      };

      ctx.save();

      // (A) DESENHO DO ANEL ORBITAL
      const orbitSteps = 300;
      let drawing = false;
      let lastVisible: boolean | null = null;
      let lastTheta = 0;

      ctx.beginPath();
      for (let s = 0; s <= orbitSteps; s++) {
        const theta = (s / orbitSteps) * Math.PI * 2;
        const pt = getOrbitCoord(theta);
        const isVis = checkOrbitVisibility(pt);

        if (s === 0) {
          if (isVis) {
            ctx.moveTo(pt.x, pt.y);
            drawing = true;
          }
          lastVisible = isVis;
          lastTheta = theta;
          continue;
        }

        if (lastVisible && !isVis) {
          // Entrando na oclusão: vai até triscar exatamente na borda do globo
          const edgePt = findHorizonEdge(lastTheta, theta, false);
          ctx.lineTo(edgePt.x, edgePt.y);
          drawing = false;
        } else if (!lastVisible && isVis) {
          // Saindo da oclusão: retoma exatamente a partir da borda do globo
          const edgePt = findHorizonEdge(lastTheta, theta, true);
          ctx.moveTo(edgePt.x, edgePt.y);
          ctx.lineTo(pt.x, pt.y);
          drawing = true;
        } else if (isVis) {
          if (!drawing) {
            ctx.moveTo(pt.x, pt.y);
            drawing = true;
          } else {
            ctx.lineTo(pt.x, pt.y);
          }
        }

        lastVisible = isVis;
        lastTheta = theta;
      }

      ctx.strokeStyle = 'rgba(192, 132, 252, 0.42)';
      ctx.lineWidth = 1.35;
      ctx.stroke();

      // (B) PULSO LUMINOSO ORBITAL
      // Percorre os 360° da órbita. Some apenas quando triscar e passar atrás do globo!
      const currentPulseTheta = (orbitProgress * Math.PI * 2);
      const pulsePt = getOrbitCoord(currentPulseTheta);
      const isPulseVis = checkOrbitVisibility(pulsePt);

      if (isPulseVis) {
        const isBehindInSpace = pulsePt.oz < 0;
        const depthFactor = isBehindInSpace
          ? 0.55
          : Math.min(1.0, 0.35 + 0.65 * (pulsePt.oz / (orbitRadius * cosInc)));

        // Rastro luminoso do pulso
        const tailCount = 8;
        for (let t = 1; t <= tailCount; t++) {
          const tailTheta = (currentPulseTheta - t * 0.035 + Math.PI * 2) % (Math.PI * 2);
          const tailPt = getOrbitCoord(tailTheta);
          if (checkOrbitVisibility(tailPt)) {
            const tailAlpha = (1 - t / tailCount) * (isBehindInSpace ? 0.35 : 0.75) * depthFactor;
            ctx.fillStyle = `rgba(192, 132, 252, ${tailAlpha})`;
            ctx.beginPath();
            ctx.arc(tailPt.x, tailPt.y, Math.max(0.7, 2.2 - t * 0.2), 0, Math.PI * 2);
            ctx.fill();
          }
        }

        // Brilho radiante do pulso
        const flareR = isBehindInSpace ? 11 : 16;
        const pulseGlow = ctx.createRadialGradient(pulsePt.x, pulsePt.y, 0, pulsePt.x, pulsePt.y, flareR);
        pulseGlow.addColorStop(0, `rgba(255, 255, 255, ${0.95 * depthFactor})`);
        pulseGlow.addColorStop(0.35, `rgba(192, 132, 252, ${0.85 * depthFactor})`);
        pulseGlow.addColorStop(0.7, `rgba(168, 85, 247, ${0.35 * depthFactor})`);
        pulseGlow.addColorStop(1, 'rgba(168, 85, 247, 0)');
        ctx.fillStyle = pulseGlow;
        ctx.beginPath();
        ctx.arc(pulsePt.x, pulsePt.y, flareR, 0, Math.PI * 2);
        ctx.fill();

        // Núcleo branco incandescente do pulso
        ctx.fillStyle = `rgba(255, 255, 255, ${depthFactor})`;
        ctx.beginPath();
        ctx.arc(pulsePt.x, pulsePt.y, isBehindInSpace ? 1.8 : 2.5, 0, Math.PI * 2);
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

      // Check visibility before scheduling next frame to eliminate idle CPU/GPU work
      if (prefersReducedMotion) {
        animationFrameId = 0;
        return;
      }

      if (!isVisible || !isScrolledIntoView) {
        animationFrameId = 0;
        return;
      }

      animationFrameId = requestAnimationFrame(render);
    }

    // Attach listeners and start animation loop
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    render();

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
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
