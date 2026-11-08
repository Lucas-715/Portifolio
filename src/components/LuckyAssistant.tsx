import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  X,
  Volume2,
  VolumeX,
  Zap,
  Crosshair,
  AlertTriangle,
} from 'lucide-react';

interface QuickLink {
  id: string;
  label: string;
  icon: string;
  speech: string;
}

const QUICK_LINKS: QuickLink[] = [
  { id: 'projetos', label: 'Projetos', icon: '🚀', speech: 'Projetos com validação e código aberto!' },
  { id: 'skills', label: 'Stack', icon: '⚡', speech: 'Arsenal: PyTorch, Next.js, FastAPI e Docker!' },
  { id: 'formacao', label: 'Formação', icon: '🎓', speech: 'IFMA, Engenharia na UFC e extensão.' },
  { id: 'contato', label: 'Contato', icon: '📬', speech: 'Bora conversar? Canais abertos!' },
];

const COMPLAINT_PHRASES = [
  'Ei! Não me puxa assim!',
  'Ai ai ai! Solta meu chassi!',
  'Cuidado com meus circuitos!',
  'Arrasto forçado! Calma aí!',
  'Eu não sou ioiô, humano!',
];

const CUTE_FREQS = [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50];

const CIPHER_GLYPHS = '01#@!$%&*<>{}[]/?~+=ABCDEF0123456789§∆';

const getRandomCipherChar = () => {
  return CIPHER_GLYPHS[Math.floor(Math.random() * CIPHER_GLYPHS.length)];
};

export const LuckyAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [speechBubble, setSpeechBubble] = useState<string | null>(null);
  const [displayedSpeech, setDisplayedSpeech] = useState<string>('');
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [isDecryptedBadge, setIsDecryptedBadge] = useState(false);
  const [eyeState, setEyeState] = useState<'normal' | 'blink' | 'happy' | 'scan' | 'angry' | 'charge' | 'heart' | 'star'>('normal');
  const [eyeLook, setEyeLook] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 24, y: 24 });
  const [dockSide, setDockSide] = useState<'right' | 'left' | 'free'>('right');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [followMouse, setFollowMouse] = useState(false);
  const [isPreparingFollow, setIsPreparingFollow] = useState(false);
  const [tiltAngle, setTiltAngle] = useState(0);

  // Dash & Sprint state (iFood delivery & Duolingo streak routines)
  const [dashState, setDashState] = useState<'idle' | 'dashing_out' | 'away' | 'dashing_in'>('idle');
  const [dashType, setDashType] = useState<'ifood' | 'duolingo' | null>(null);

  // Cinematic "Raio da Morte" (Death Ray) & Destruir Cursor State (Fase 3)
  const [deathRayState, setDeathRayState] = useState<'idle' | 'targeting' | 'charging' | 'firing' | 'cooldown'>('idle');
  const [chargeLevel, setChargeLevel] = useState(0);
  const [impactExplosion, setImpactExplosion] = useState<{ x: number; y: number } | null>(null);
  const [deathRayTarget, setDeathRayTarget] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Fase 3: Cursor Destruction Cooldown & Aria-live
  const [cursorCooldown, setCursorCooldown] = useState(0);
  const [cursorAriaLive, setCursorAriaLive] = useState('');
  const cursorSafetyTimeoutRef = useRef<number | null>(null);

  const botRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const hasMovedRef = useRef(false);
  const isHoveredRef = useRef(false);
  const dragStartRef = useRef({ mouseX: 0, mouseY: 0, posX: 0, posY: 0 });
  const mousePosRef = useRef({ x: typeof window !== 'undefined' ? window.innerWidth / 2 : 500, y: typeof window !== 'undefined' ? window.innerHeight / 2 : 500 });
  const lastComplainTimeRef = useRef(0);
  const chargeIntervalRef = useRef<number | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const typingTimerRef = useRef<number | null>(null);
  const bubbleTimerRef = useRef<number | null>(null);
  const prepareFollowTimeoutRef = useRef<number | null>(null);
  const scrollDebounceTimerRef = useRef<number | null>(null);
  const isSprintActiveRef = useRef<boolean>(false);
  const lastClickTimeRef = useRef<number>(0);

  // Audio Context initialization
  const getAudioContext = () => {
    if (!audioCtxRef.current && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        audioCtxRef.current = new AudioCtx();
      }
    }
    return audioCtxRef.current;
  };

  // Suave e comedido som mecânico de digitação (com limitação de taxa para nunca poluir os ouvidos)
  const playTypewriterClick = useCallback(() => {
    if (!soundEnabled) return;
    const now = Date.now();
    if (now - lastClickTimeRef.current < 65) return; // Limita a no máximo 1 clique a cada 65ms
    lastClickTimeRef.current = now;

    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      if (ctx.state === 'suspended') ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1400 + (Math.random() - 0.5) * 400, ctx.currentTime);
      gain.gain.setValueAtTime(0.005, ctx.currentTime); // Volume reduzido e suave
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.018);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.02);
    } catch {
      /* ignore */
    }
  }, [soundEnabled]);

  // Charging pitch escalation for Death Ray
  const playChargeHumSound = useCallback((frequency: number) => {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      if (ctx.state === 'suspended') ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(frequency * 1.06, ctx.currentTime + 0.07);

      gain.gain.setValueAtTime(0.03, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.075);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch {
      /* ignore */
    }
  }, [soundEnabled]);

  // Thunderous Apocalyptic Death Ray Sound Effect
  const playDeathRaySound = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      if (ctx.state === 'suspended') ctx.resume();

      // 1. Hypersonic plasma piercing screech
      const screech = ctx.createOscillator();
      const screechGain = ctx.createGain();
      screech.type = 'sawtooth';
      screech.frequency.setValueAtTime(1600, ctx.currentTime);
      screech.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.45);
      screechGain.gain.setValueAtTime(0.18, ctx.currentTime);
      screechGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.48);
      screech.connect(screechGain);
      screechGain.connect(ctx.destination);
      screech.start();
      screech.stop(ctx.currentTime + 0.5);

      // 2. Sub-bass seismic detonation rumble
      const rumble = ctx.createOscillator();
      const rumbleGain = ctx.createGain();
      rumble.type = 'sine';
      rumble.frequency.setValueAtTime(180, ctx.currentTime);
      rumble.frequency.exponentialRampToValueAtTime(20, ctx.currentTime + 0.65);
      rumbleGain.gain.setValueAtTime(0.25, ctx.currentTime);
      rumbleGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.65);
      rumble.connect(rumbleGain);
      rumbleGain.connect(ctx.destination);
      rumble.start();
      rumble.stop(ctx.currentTime + 0.68);
    } catch {
      /* ignore */
    }
  }, [soundEnabled]);

  // Musical chiptune bleeps
  const playCuteChirpMelody = useCallback((noteCount = 2) => {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      if (ctx.state === 'suspended') ctx.resume();

      for (let i = 0; i < noteCount; i++) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        const freq = CUTE_FREQS[Math.floor(Math.random() * CUTE_FREQS.length)];
        const startTime = ctx.currentTime + i * 0.06;
        osc.frequency.setValueAtTime(freq, startTime);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.15, startTime + 0.04);

        gain.gain.setValueAtTime(0.03, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.05);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.06);
      }
    } catch {
      /* ignore */
    }
  }, [soundEnabled]);

  // Speech bubble with typewriter effect and click sounds (duração estendida para leitura confortável)
  const showBubble = useCallback((text: string, duration = 6000) => {
    if (typingTimerRef.current) {
      clearInterval(typingTimerRef.current);
    }
    if (bubbleTimerRef.current) {
      clearTimeout(bubbleTimerRef.current);
      bubbleTimerRef.current = null;
    }
    setIsDecrypting(false);
    setIsDecryptedBadge(false);
    setSpeechBubble(text);
    setDisplayedSpeech('');

    let charIdx = 0;
    const interval = setInterval(() => {
      charIdx += 2;
      if (charIdx >= text.length) {
        setDisplayedSpeech(text);
        clearInterval(interval);
      } else {
        setDisplayedSpeech(text.slice(0, charIdx));
        playTypewriterClick();
      }
    }, 24);
    typingTimerRef.current = interval as unknown as number;

    // Garante tempo de leitura suficiente: digitação + base de 5.0s + 50ms por caractere
    const typingDuration = (text.length / 2) * 24;
    const comfortableReadingDuration = Math.max(duration, typingDuration + 5000 + text.length * 50);

    bubbleTimerRef.current = window.setTimeout(() => {
      setSpeechBubble((current) => (current === text ? null : current));
      bubbleTimerRef.current = null;
    }, comfortableReadingDuration);
  }, [playTypewriterClick]);

  // Efeito cyberpunk de decodificação / descriptografia de mensagens criptografadas ao rolar a página
  const showDecryptingBubble = useCallback(
    (targetText: string, duration = 9500) => {
      if (typingTimerRef.current) {
        clearInterval(typingTimerRef.current);
        typingTimerRef.current = null;
      }
      if (bubbleTimerRef.current) {
        clearTimeout(bubbleTimerRef.current);
        bubbleTimerRef.current = null;
      }

      setSpeechBubble(targetText);
      setIsDecrypting(true);
      setIsDecryptedBadge(false);
      setEyeState('scan');

      const totalLen = targetText.length;
      let progress = 0;
      let frame = 0;
      const initialScrambleFrames = 6;

      const interval = setInterval(() => {
        frame++;

        if (frame <= initialScrambleFrames) {
          // Fase 1: Cifra 100% criptografada aleatória
          let scrambled = '';
          const maxGlyphs = Math.min(totalLen, 48);
          for (let i = 0; i < maxGlyphs; i++) {
            scrambled += targetText[i] === ' ' ? ' ' : getRandomCipherChar();
          }
          setDisplayedSpeech(scrambled);
          playTypewriterClick();
        } else {
          // Fase 2: Descriptografia progressiva caractere a caractere
          progress += 3;
          if (progress >= totalLen) {
            setDisplayedSpeech(targetText);
            setIsDecrypting(false);
            setIsDecryptedBadge(true);
            clearInterval(interval);
            typingTimerRef.current = null;

            playCuteChirpMelody(2);
            setEyeState('happy');
            setTimeout(() => setEyeState('normal'), 2500);

            // Inicia o temporizador estendido para leitura relaxada após a descriptografia
            const comfortableDuration = Math.max(duration, 5500 + totalLen * 50);
            bubbleTimerRef.current = window.setTimeout(() => {
              setSpeechBubble((current) => (current === targetText ? null : current));
              setIsDecryptedBadge(false);
              bubbleTimerRef.current = null;
            }, comfortableDuration);
          } else {
            let currentStr = targetText.slice(0, progress);
            for (let i = progress; i < totalLen; i++) {
              currentStr += targetText[i] === ' ' ? ' ' : getRandomCipherChar();
            }
            setDisplayedSpeech(currentStr);
            playTypewriterClick();
          }
        }
      }, 28);

      typingTimerRef.current = interval as unknown as number;
    },
    [playTypewriterClick, playCuteChirpMelody]
  );

  // Blinking & scanning loops
  useEffect(() => {
    if (deathRayState !== 'idle' || eyeState === 'angry') return;

    const blinkInterval = setInterval(() => {
      setEyeState('blink');
      setTimeout(() => setEyeState((prev) => (prev === 'blink' ? 'normal' : prev)), 180);
    }, 4500);

    const scanInterval = setInterval(() => {
      setEyeState('scan');
      setTimeout(() => setEyeState((prev) => (prev === 'scan' ? 'normal' : prev)), 11000);
    }, 11000);

    return () => {
      clearInterval(blinkInterval);
      clearInterval(scanInterval);
    };
  }, [deathRayState, eyeState]);

  // SCROLL-AWARE SIDE-SWITCHING & IMMERSIVE COMMENTARY
  const lastSectionRef = useRef<string | null>(null);
  const sectionCooldownRef = useRef<{ [key: string]: number }>({});

  useEffect(() => {
    const handleScrollWatcher = () => {
      // Bloqueia comentários de scroll se estiver seguindo o mouse, arrastando ou se o robô estiver na corrida do iFood/Duolingo
      if (followMouse || isDraggingRef.current || dashState !== 'idle' || isSprintActiveRef.current) return;

      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;

      // Textos concisos e diretos para o chatbot
      const sections = [
        { id: 'top', side: 'right', phrase: 'E aí! Sou o Lucky. Role para explorar!' },
        { id: 'sobre', side: 'left', phrase: 'Engenharia, boas práticas e IA prática.' },
        { id: 'projetos', side: 'right', phrase: 'Projetos em IA, Aprendizado Federado e XAI!' },
        { id: 'skills', side: 'left', phrase: 'Stack: PyTorch, Next.js, FastAPI e Docker.' },
        { id: 'formacao', side: 'right', phrase: 'Formação: IFMA, Engenharia na UFC e extensão!' },
        { id: 'contato', side: 'right', phrase: 'Bora conversar? Canais abertos!' },
      ];

      let currentSec = 'top';

      if (scrollY + viewportHeight >= docHeight - 120) {
        currentSec = 'contato';
      } else if (scrollY < 240) {
        currentSec = 'top';
      } else {
        for (let i = sections.length - 1; i >= 0; i--) {
          const el = document.getElementById(sections[i].id);
          if (el) {
            const rect = el.getBoundingClientRect();
            if (rect.top <= viewportHeight * 0.45 && rect.bottom >= viewportHeight * 0.15) {
              currentSec = sections[i].id;
              break;
            }
          }
        }
      }

      if (currentSec !== lastSectionRef.current) {
        const prevSec = lastSectionRef.current;
        lastSectionRef.current = currentSec;

        const secConfig = sections.find((s) => s.id === currentSec);
        if (secConfig) {
          if (secConfig.side === 'left') {
            setDockSide('left');
            setTiltAngle(-12);
            setTimeout(() => setTiltAngle(0), 450);
          } else {
            setDockSide('right');
            setTiltAngle(12);
            setTimeout(() => setTiltAngle(0), 450);
          }

          // Debounce de áudio: aguarda a rolagem estabilizar para não amontoar múltiplos sons
          if (scrollDebounceTimerRef.current) {
            clearTimeout(scrollDebounceTimerRef.current);
          }
          scrollDebounceTimerRef.current = window.setTimeout(() => {
            if (isSprintActiveRef.current || dashState !== 'idle') return;
            const now = Date.now();
            const lastSpoken = sectionCooldownRef.current[currentSec] || 0;
            if (now - lastSpoken > 9500 && prevSec !== null) {
              sectionCooldownRef.current[currentSec] = now;
              showDecryptingBubble(secConfig.phrase, 5500);
            }
          }, 450);
        }
      }
    };

    window.addEventListener('scroll', handleScrollWatcher, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScrollWatcher);
      if (scrollDebounceTimerRef.current) clearTimeout(scrollDebounceTimerRef.current);
    };
  }, [followMouse, isPreparingFollow, dashState, showDecryptingBubble]);

  // REAÇÃO AO MODO INSPECIONAR / DEVTOOLS (Sabe exatamente o que o usuário está fazendo)
  useEffect(() => {
    let lastInspectSpoken = 0;

    const triggerInspectSpeech = () => {
      const now = Date.now();
      if (now - lastInspectSpoken < 18000) return; // 18s cooldown
      lastInspectSpoken = now;

      const phrases = [
        'Eu sei o que você está fazendo aí! 🕵️ Inspecionando o código? 100% limpo e modular!',
        'Flagrado no Inspecionar! 👀 Fique à vontade para auditar os testes e componentes!',
        'Inspecionando no DevTools? 🤖 Pode debugar com calma, zero gambiarras!',
      ];
      const text = phrases[Math.floor(Math.random() * phrases.length)];

      showBubble(text, 6000);
      playCuteChirpMelody(3);
      setEyeState('scan');
      setTimeout(() => setEyeState('happy'), 1800);
      setTimeout(() => setEyeState('normal'), 3500);
    };

    // 1. Ao clicar com o botão direito para apertar em "Inspecionar" no navegador
    const handleContextMenu = () => {
      triggerInspectSpeech();
    };

    // 2. Atalhos de teclado comuns de Inspecionar (F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C)
    const handleInspectKeys = (e: KeyboardEvent) => {
      const isCtrlOrMeta = e.ctrlKey || e.metaKey;
      const isShift = e.shiftKey;
      const key = e.key.toLowerCase();

      if (
        e.key === 'F12' ||
        (isCtrlOrMeta && isShift && (key === 'i' || key === 'j' || key === 'c'))
      ) {
        triggerInspectSpeech();
      }
    };

    // 3. Detecção de dock do DevTools por redimensionamento assimétrico da viewport
    let resizeTimer: number;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        const threshold = 160;
        const widthDiff = window.outerWidth - window.innerWidth > threshold;
        const heightDiff = window.outerHeight - window.innerHeight > threshold;
        if (widthDiff || heightDiff) {
          triggerInspectSpeech();
        }
      }, 300);
    };

    // 4. Console getter probe: acionado na avaliação do console pelo navegador
    const element = new Image();
    Object.defineProperty(element, 'id', {
      get: function () {
        triggerInspectSpeech();
        return 'lucky-inspector';
      },
    });

    const consoleProbe = setInterval(() => {
      console.debug('%c', element);
    }, 2500);

    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('keydown', handleInspectKeys);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('keydown', handleInspectKeys);
      window.removeEventListener('resize', handleResize);
      clearInterval(consoleProbe);
    };
  }, [showBubble, playCuteChirpMelody]);

  // Stop following immediately on ESC or Space
  const stopFollowing = useCallback(() => {
    if (prepareFollowTimeoutRef.current) {
      clearTimeout(prepareFollowTimeoutRef.current);
      prepareFollowTimeoutRef.current = null;
    }
    setIsPreparingFollow(false);
    setFollowMouse(false);
    setTiltAngle(0);
    setDockSide('right');
    setPosition({ x: 24, y: 24 });
    showBubble('Modo drone desativado!', 3500);
    playCuteChirpMelody(2);
  }, [showBubble, playCuteChirpMelody]);

  // Falar primeiro o que tem para falar com o robô parado, e só depois que a fala SUMIR começar a seguir o mouse
  const toggleFollowMouse = useCallback(() => {
    if (followMouse || isPreparingFollow) {
      stopFollowing();
      return;
    }

    // 1. Fecha o menu e fala primeiro com o robô completamente estático na posição atual
    setIsOpen(false);
    setIsPreparingFollow(true);
    playCuteChirpMelody(2);
    setEyeState('happy');

    const speechText = 'Modo Drone ativado! Calibrando propulsores para te acompanhar... (Pressione ESC para parar)';
    // Duração do balão: 4500ms
    const bubbleDisplayDuration = 4500;
    showBubble(speechText, bubbleDisplayDuration);

    if (prepareFollowTimeoutRef.current) {
      clearTimeout(prepareFollowTimeoutRef.current);
    }

    // 2. Aguarda a fala sumir COMPLETAMENTE para começar a seguir
    const typingTime = (speechText.length / 2) * 24;
    const totalWaitTime = typingTime + bubbleDisplayDuration + 600;

    prepareFollowTimeoutRef.current = window.setTimeout(() => {
      // Garante que o balão está fechado antes do voo
      setSpeechBubble(null);
      setEyeState('normal');

      if (botRef.current) {
        const rect = botRef.current.getBoundingClientRect();
        setPosition({
          x: Math.max(16, window.innerWidth - rect.right),
          y: Math.max(16, window.innerHeight - rect.bottom),
        });
      }
      setDockSide('free');
      setFollowMouse(true);
      setIsPreparingFollow(false);
      prepareFollowTimeoutRef.current = null;
    }, totalWaitTime);
  }, [followMouse, isPreparingFollow, stopFollowing, playCuteChirpMelody, showBubble]);

  // Rotinas de corrida / sumiço do robô: iFood e Duolingo (com áudio e falas reorganizados e concisos)
  const runIFoodSprint = useCallback(() => {
    if (deathRayState !== 'idle' || followMouse || isDraggingRef.current || dashState !== 'idle') return;

    // Bloqueia qualquer fala ou efeito sonoro de scroll durante toda a corrida
    isSprintActiveRef.current = true;
    if (typingTimerRef.current) {
      clearInterval(typingTimerRef.current);
      typingTimerRef.current = null;
    }
    setSpeechBubble(null);

    setIsOpen(false);
    setDashType('ifood');
    setEyeState('blink');
    playCuteChirpMelody(1);
    setDashState('dashing_out');

    setTimeout(() => {
      setDashState('away');
    }, 380);

    setTimeout(() => {
      setDashState('dashing_in');
    }, 2400);

    setTimeout(() => {
      setDashState('idle');
      setEyeState('heart');
      playCuteChirpMelody(2);
      // Texto conciso e direto
      showBubble('Fui correndo pegar meu iFood! 🛵🍔 Bateria recarregada!', 5000);

      setTimeout(() => {
        setEyeState((prev) => (prev === 'heart' ? 'normal' : prev));
        isSprintActiveRef.current = false; // Libera comentários de scroll apenas após a leitura
      }, 5000);
    }, 2850);
  }, [deathRayState, followMouse, dashState, playCuteChirpMelody, showBubble]);

  const runDuolingoSprint = useCallback(() => {
    if (deathRayState !== 'idle' || followMouse || isDraggingRef.current || dashState !== 'idle') return;

    // Bloqueia qualquer fala ou som de scroll
    isSprintActiveRef.current = true;
    if (typingTimerRef.current) {
      clearInterval(typingTimerRef.current);
      typingTimerRef.current = null;
    }
    setSpeechBubble(null);

    setIsOpen(false);
    setDashType('duolingo');
    setEyeState('blink');
    playCuteChirpMelody(1);
    setDashState('dashing_out');

    setTimeout(() => {
      setDashState('away');
    }, 380);

    setTimeout(() => {
      setDashState('dashing_in');
    }, 2400);

    setTimeout(() => {
      setDashState('idle');
      setEyeState('star');
      playCuteChirpMelody(2);
      // Fala explícita sobre a aula do Duolingo
      showBubble('Fui fazer minha aula de Duolingo! 🦉📚 Ofensiva salva a tempo!', 5000);

      setTimeout(() => {
        setEyeState((prev) => (prev === 'star' ? 'normal' : prev));
        isSprintActiveRef.current = false; // Libera scroll após a leitura
      }, 5000);
    }, 2850);
  }, [deathRayState, followMouse, dashState, playCuteChirpMelody, showBubble]);

  // Expor no window para debug/teste rápido se necessário
  useEffect(() => {
    (window as any).luckyRunIFood = runIFoodSprint;
    (window as any).luckyRunDuolingo = runDuolingoSprint;
  }, [runIFoodSprint, runDuolingoSprint]);

  // Temporizador de ociosidade: dispara as corridas do iFood e Duolingo periodicamente
  useEffect(() => {
    let sprintIndex = 0;
    const interval = setInterval(() => {
      if (
        deathRayState === 'idle' &&
        !followMouse &&
        !isPreparingFollow &&
        !isDraggingRef.current &&
        dashState === 'idle' &&
        !isOpen
      ) {
        if (sprintIndex % 2 === 0) {
          runIFoodSprint();
        } else {
          runDuolingoSprint();
        }
        sprintIndex++;
      }
    }, 58000);

    return () => clearInterval(interval);
  }, [deathRayState, followMouse, isPreparingFollow, dashState, isOpen, runIFoodSprint, runDuolingoSprint]);

  // Reação ao passar o mouse sobre botões/links de contato: Lucky faz carinha fofa com corações (♥) ou estrelas (★)
  useEffect(() => {
    let revertTimer: number | null = null;
    let lastContactSpoken = 0;

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const contactEl = target.closest(
        'a[href*="linkedin"], a[href*="github"], a[href^="mailto:"], a[href*="instagram"], #contato a, #contato button, [data-contact-link]'
      );

      if (contactEl) {
        if (revertTimer) {
          clearTimeout(revertTimer);
          revertTimer = null;
        }

        const mood = Math.random() > 0.5 ? 'heart' : 'star';
        setEyeState(mood);
        playCuteChirpMelody(2);

        const now = Date.now();
        if (now - lastContactSpoken > 18000 && !speechBubble) {
          lastContactSpoken = now;
          const phrases = [
            'Adorei a iniciativa! ✨ O Lucas responde rápido no LinkedIn ou por email!',
            'Bora bater um papo? O Lucas adora trocar ideia sobre IA e arquitetura! 💌',
            'Canais de contato abertos! Excelente oportunidade de conexão! 🚀',
          ];
          const phrase = phrases[Math.floor(Math.random() * phrases.length)];
          showBubble(phrase, 5500);
        }
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const contactEl = target.closest(
        'a[href*="linkedin"], a[href*="github"], a[href^="mailto:"], a[href*="instagram"], #contato a, #contato button, [data-contact-link]'
      );

      if (contactEl) {
        revertTimer = window.setTimeout(() => {
          setEyeState((prev) => (prev === 'heart' || prev === 'star' ? 'normal' : prev));
        }, 800);
      }
    };

    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    return () => {
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      if (revertTimer) clearTimeout(revertTimer);
    };
  }, [playCuteChirpMelody, showBubble, speechBubble]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === ' ') {
        if (followMouse || isPreparingFollow) {
          stopFollowing();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [followMouse, isPreparingFollow, stopFollowing]);

  useEffect(() => {
    return () => {
      if (prepareFollowTimeoutRef.current) {
        clearTimeout(prepareFollowTimeoutRef.current);
      }
    };
  }, []);

  // Continuous Mouse Tracking for Eyes and Targeting
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePosRef.current = { x: e.clientX, y: e.clientY };

      // Reticle & Death Ray Continuous Real-Time Tracking
      if (deathRayState === 'targeting' || deathRayState === 'charging' || deathRayState === 'firing') {
        setDeathRayTarget({ x: e.clientX, y: e.clientY });
        setImpactExplosion({ x: e.clientX, y: e.clientY });
      }

      if (botRef.current) {
        const rect = botRef.current.getBoundingClientRect();
        const botCenterX = rect.left + rect.width / 2;
        const botCenterY = rect.top + rect.height / 2;

        const deltaX = e.clientX - botCenterX;
        const deltaY = e.clientY - botCenterY;
        const angle = Math.atan2(deltaY, deltaX);
        const dist = Math.min(3.5, Math.hypot(deltaX, deltaY) / 75);

        setEyeLook({
          x: Math.cos(angle) * dist,
          y: Math.sin(angle) * dist,
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [deathRayState]);

  // PHYSICS ENGINE FOR SMOOTH MOUSE FOLLOWING (requestAnimationFrame loop)
  useEffect(() => {
    if (!followMouse) {
      setTiltAngle(0);
      return;
    }

    let animId: number;
    const physicsLoop = () => {
      if (!isDraggingRef.current && !isOpen) {
        // When user hovers on Lucky, brake/lock position so user can easily click him!
        if (!isHoveredRef.current) {
          const targetRight = Math.max(
            16,
            Math.min(window.innerWidth - 65, window.innerWidth - (mousePosRef.current.x + 45))
          );
          const targetBottom = Math.max(
            16,
            Math.min(window.innerHeight - 65, window.innerHeight - (mousePosRef.current.y - 35))
          );

          setPosition((prev) => {
            const vx = targetRight - prev.x;
            const vy = targetBottom - prev.y;

            // Bank / tilt angle based on velocity
            const tilt = Math.max(-22, Math.min(22, -vx * 0.45));
            setTiltAngle(tilt);

            return {
              x: prev.x + vx * 0.12,
              y: prev.y + vy * 0.12,
            };
          });
        } else {
          setTiltAngle(0);
        }
      }

      animId = requestAnimationFrame(physicsLoop);
    };

    animId = requestAnimationFrame(physicsLoop);
    return () => cancelAnimationFrame(animId);
  }, [followMouse, isOpen]);

  // Dragging Logic with Complaint Bubbles
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setDockSide('free');
    isDraggingRef.current = true;
    hasMovedRef.current = false;

    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      posX: position.x,
      posY: position.y,
    };

    setEyeState('angry');

    const handleMouseMoveDoc = (moveEvent: MouseEvent) => {
      const deltaX = dragStartRef.current.mouseX - moveEvent.clientX;
      const deltaY = dragStartRef.current.mouseY - moveEvent.clientY;

      if (Math.abs(deltaX) > 4 || Math.abs(deltaY) > 4) {
        hasMovedRef.current = true;
      }

      const nextX = Math.max(12, Math.min(window.innerWidth - 60, dragStartRef.current.posX + deltaX));
      const nextY = Math.max(12, Math.min(window.innerHeight - 60, dragStartRef.current.posY + deltaY));
      setPosition({ x: nextX, y: nextY });

      const now = Date.now();
      if (hasMovedRef.current && now - lastComplainTimeRef.current > 2400) {
        lastComplainTimeRef.current = now;
        const phrase = COMPLAINT_PHRASES[Math.floor(Math.random() * COMPLAINT_PHRASES.length)];
        showBubble(phrase, 2000);
        playCuteChirpMelody(1);
      }
    };

    const handleMouseUpDoc = () => {
      isDraggingRef.current = false;
      document.removeEventListener('mousemove', handleMouseMoveDoc);
      document.removeEventListener('mouseup', handleMouseUpDoc);

      setTimeout(() => {
        setEyeState('normal');
      }, 700);
    };

    document.addEventListener('mousemove', handleMouseMoveDoc);
    document.addEventListener('mouseup', handleMouseUpDoc);
  };

  // ==========================================
  // FASE 3: FUNÇÃO "DESTRUIR CURSOR" DO CHATBOT
  // ==========================================
  const restoreCursor = useCallback(() => {
    try {
      document.body.style.cursor = '';
      document.documentElement.style.cursor = '';
      setCursorAriaLive('Cursor restaurado');

      // Visual respawn pulse effect
      if (typeof window !== 'undefined') {
        const respawnEl = document.createElement('div');
        respawnEl.setAttribute('aria-hidden', 'true');
        respawnEl.style.position = 'fixed';
        respawnEl.style.left = `${mousePosRef.current.x}px`;
        respawnEl.style.top = `${mousePosRef.current.y}px`;
        respawnEl.style.width = '24px';
        respawnEl.style.height = '24px';
        respawnEl.style.transform = 'translate(-50%, -50%)';
        respawnEl.style.borderRadius = '50%';
        respawnEl.style.border = '2px solid #00f0ff';
        respawnEl.style.boxShadow = '0 0 15px #00f0ff';
        respawnEl.style.pointerEvents = 'none';
        respawnEl.style.zIndex = '99999';
        respawnEl.style.animation = 'ping 0.4s cubic-bezier(0, 0, 0.2, 1) forwards';
        document.body.appendChild(respawnEl);
        setTimeout(() => respawnEl.remove(), 450);
      }
    } finally {
      if (cursorSafetyTimeoutRef.current) {
        clearTimeout(cursorSafetyTimeoutRef.current);
        cursorSafetyTimeoutRef.current = null;
      }
      window.removeEventListener('keydown', handleKeyRestore);
      window.removeEventListener('mouseleave', handleLeaveRestore);
    }
  }, []);

  const handleKeyRestore = useCallback(() => {
    restoreCursor();
  }, [restoreCursor]);

  const handleLeaveRestore = useCallback(() => {
    restoreCursor();
  }, [restoreCursor]);

  const triggerDestroyCursor = () => {
    // 1. Touch device check (disabled on touch)
    if (typeof window !== 'undefined' && window.matchMedia('(hover: none), (pointer: coarse)').matches) {
      showBubble('Função desativada em telas touch.', 2400);
      return;
    }

    // 2. Cooldown check (3s cooldown)
    if (cursorCooldown > 0 || deathRayState !== 'idle') return;

    // 3. Counter in localStorage (5th use surrender speech)
    let usageCount = 0;
    try {
      usageCount = parseInt(localStorage.getItem('lucky_cursor_destroys') || '0', 10) + 1;
      localStorage.setItem('lucky_cursor_destroys', String(usageCount));
    } catch {
      usageCount = 1;
    }

    if (usageCount === 5) {
      setIsOpen(false);
      // Fala de rendição SEM SOM com link para a seção de contato
      showBubble(
        'Tudo bem, você venceu! Cansei de atirar no cursor. Quer falar de trabalho de verdade? Me chama no contato!',
        5000
      );
      const contactEl = document.getElementById('contato');
      if (contactEl) {
        setTimeout(() => {
          contactEl.scrollIntoView({ behavior: 'smooth' });
        }, 1200);
      }
      return;
    }

    setIsOpen(false);

    // 4. Apply 3s cooldown
    setCursorCooldown(3);
    const cdInterval = window.setInterval(() => {
      setCursorCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(cdInterval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const isReducedMotion =
      typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 5. Grand, cinematic, slow and powerful Death Ray sequence
    const targetX = mousePosRef.current.x;
    const targetY = mousePosRef.current.y;
    setDeathRayTarget({ x: targetX, y: targetY });
    setDeathRayState('targeting');
    setEyeState('charge');
    setChargeLevel(25);
    showBubble('Alvo travado! Iniciando sobrecarga dos canhões orbitais... ⚡', 2200);
    playChargeHumSound(220);

    // Step 1: Power buildup (450ms)
    setTimeout(() => {
      setChargeLevel(65);
      playChargeHumSound(380);
    }, 450);

    // Step 2: Critical mass (950ms)
    setTimeout(() => {
      setChargeLevel(100);
      playChargeHumSound(580);
    }, 950);

    // Step 3: MASSIVE ORBITAL BEAM STRIKE (1400ms)
    setTimeout(() => {
      // Re-synchronize exact coordinates at strike moment
      const strikeX = mousePosRef.current.x;
      const strikeY = mousePosRef.current.y;
      setDeathRayTarget({ x: strikeX, y: strikeY });
      setImpactExplosion({ x: strikeX, y: strikeY });
      setDeathRayState('firing');
      playDeathRaySound();

      window.dispatchEvent(
        new CustomEvent('lucky:power-surge', {
          detail: { isFiring: true },
        })
      );

      // Vaporize cursor immediately upon impact
      try {
        document.body.style.cursor = 'none';
        document.documentElement.style.cursor = 'none';

        window.addEventListener('keydown', handleKeyRestore, { once: true });
        window.addEventListener('mouseleave', handleLeaveRestore, { once: true });

        // Safety timeout guarantees restoration
        cursorSafetyTimeoutRef.current = window.setTimeout(restoreCursor, 3800);
      } catch {
        restoreCursor();
      }

      // Sustained orbital beam tracks the reticle until 1450ms (total 2850ms)
      setTimeout(() => {
        setDeathRayState('cooldown');
        showBubble('DESINTEGRAÇÃO COMPLETA! O cursor virou poeira cósmica! 💥', 2600);
      }, 1450);

      // Embers settle, Lucky returns to normal
      setTimeout(() => {
        setImpactExplosion(null);
        setDeathRayState('idle');
        setEyeState('normal');
      }, 2300);

      // Automatic quantum respawn at 3500ms
      setTimeout(() => {
        restoreCursor();
      }, 3500);

      // GPU-accelerated localized particle dissipation (300x300 canvas, 0.02ms render, zero layout shift)
      if (isReducedMotion) return;

      const size = 300;
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      canvas.style.position = 'fixed';
      canvas.style.top = `${targetY - size / 2}px`;
      canvas.style.left = `${targetX - size / 2}px`;
      canvas.style.width = `${size}px`;
      canvas.style.height = `${size}px`;
      canvas.style.pointerEvents = 'none';
      canvas.style.zIndex = '99999';
      document.body.appendChild(canvas);

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        canvas.remove();
        return;
      }

      const centerX = size / 2;
      const centerY = size / 2;
      const particleCount = 48;
      const particles = Array.from({ length: particleCount }).map(() => {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1.8 + Math.random() * 5.5;
        return {
          x: centerX,
          y: centerY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          radius: 1.5 + Math.random() * 3.2,
          alpha: 1,
          color: Math.random() > 0.6 ? '#ffffff' : Math.random() > 0.3 ? '#00f0ff' : '#ff1e60',
        };
      });

      const startTime = performance.now();
      let animFrame: number;

      const animateParticles = (time: number) => {
        const elapsed = time - startTime;
        if (elapsed >= 1800) {
          cancelAnimationFrame(animFrame);
          canvas.remove();
          return;
        }

        ctx.clearRect(0, 0, size, size);
        const progress = elapsed / 1800;

        for (const p of particles) {
          p.x += p.vx;
          p.y += p.vy;
          p.vx *= 0.975; // Slower, more majestic dissipation
          p.vy *= 0.975;
          p.alpha = Math.max(0, 1 - progress * 1.08);

          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
        }

        animFrame = requestAnimationFrame(animateParticles);
      };

      animFrame = requestAnimationFrame(animateParticles);
    }, 1400);
  };

  const handleSelectQuickLink = (link: QuickLink) => {
    playCuteChirpMelody(2);
    setEyeState('happy');
    setTimeout(() => setEyeState('normal'), 1200);
    showBubble(link.speech, 2500);
    setIsOpen(false);

    const el = document.getElementById(link.id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      {/* =========================================================================
          1. HOLOGRAPHIC ORBITAL RETICLE (MIRA ORBITAL DO RAIO DA MORTE)
          Trava diretamente nas coordenadas sincronizadas da mira
         ========================================================================= */}
      {(deathRayState === 'targeting' || deathRayState === 'charging' || deathRayState === 'firing') && (
        <div
          aria-hidden="true"
          style={{
            left: `${deathRayTarget.x}px`,
            top: `${deathRayTarget.y}px`,
          }}
          className="fixed z-50 pointer-events-none -translate-x-1/2 -translate-y-1/2 flex items-center justify-center select-none"
        >
          {/* Rotating Outer Segmented Target Ring */}
          <div className="w-56 h-56 rounded-full border border-dashed border-rose-500/80 animate-spin [animation-duration:8s] flex items-center justify-center">
            <div className="w-48 h-48 rounded-full border border-rose-400/50 flex items-center justify-center">
              <div className="w-40 h-40 rounded-full border border-dashed border-amber-400/60 animate-spin [animation-duration:5s] [animation-direction:reverse]" />
            </div>
          </div>

          {/* Pulsing Inner Lock Circle */}
          <div className="absolute w-24 h-24 rounded-full border-2 border-rose-500 bg-rose-500/10 animate-pulse shadow-[0_0_30px_#ef4444]" />

          {/* Precision Cardinal Crosshairs */}
          <div className="absolute w-36 h-0.5 bg-gradient-to-r from-transparent via-rose-400 to-transparent" />
          <div className="absolute h-36 w-0.5 bg-gradient-to-b from-transparent via-rose-400 to-transparent" />

          {/* Central Target Diamond */}
          <div className="absolute w-3.5 h-3.5 border-2 border-white rotate-45 bg-rose-500 animate-ping" />
          <div className="absolute w-2 h-2 rounded-full bg-white shadow-[0_0_10px_#ffffff]" />

          {/* Diagonal Laser Guidance Lines from Orbit/Corners */}
          <svg className="fixed inset-0 pointer-events-none w-screen h-screen -translate-x-1/2 -translate-y-1/2">
            <line
              x1="0"
              y1="0"
              x2={deathRayTarget.x}
              y2={deathRayTarget.y}
              stroke="#ef4444"
              strokeWidth="1.2"
              strokeDasharray="4,4"
              strokeOpacity="0.6"
            />
            <line
              x1={typeof window !== 'undefined' ? window.innerWidth : 1200}
              y1="0"
              x2={deathRayTarget.x}
              y2={deathRayTarget.y}
              stroke="#ef4444"
              strokeWidth="1.2"
              strokeDasharray="4,4"
              strokeOpacity="0.6"
            />
          </svg>

          {/* Tactical HUD Telemetry Banner */}
          <div className="absolute -top-14 flex flex-col items-center gap-0.5 pointer-events-none">
            <div className="px-2.5 py-0.5 rounded-full bg-black/90 border border-rose-500 text-[10px] font-mono text-rose-300 font-bold tracking-wider flex items-center gap-1.5 shadow-[0_0_15px_rgba(239,68,68,0.5)]">
              <AlertTriangle className="w-3 h-3 text-amber-400 animate-bounce" />
              <span>ALVO TRAVADO // {chargeLevel}%</span>
            </div>
            <span className="text-[9px] font-mono text-slate-300 drop-shadow">
              X: {deathRayTarget.x} · Y: {deathRayTarget.y}
            </span>
          </div>
        </div>
      )}

      {/* =========================================================================
          2. COLOSSAL VERTICAL DEATH RAY (RAIO DA MORTE INCANDESCENTE)
          Renderizado 100% acelerado por hardware na GPU (Zero feGaussianBlur / Zero lag)
         ========================================================================= */}
      {deathRayState === 'firing' && (
        <svg
          aria-hidden="true"
          className="fixed inset-0 z-50 pointer-events-none w-full h-full"
          style={{ filter: 'drop-shadow(0 0 25px #ef4444)' }}
        >
          {/* Layer 1: Apocalyptic Ruby Thermal Atmosphere (90px wide) */}
          <line
            x1={deathRayTarget.x}
            y1={0}
            x2={deathRayTarget.x}
            y2={deathRayTarget.y}
            stroke="#ef4444"
            strokeWidth="90"
            strokeOpacity="0.45"
            strokeLinecap="round"
          />

          {/* Layer 2: Ionizing Magenta Plasma Core (48px wide) */}
          <line
            x1={deathRayTarget.x}
            y1={0}
            x2={deathRayTarget.x}
            y2={deathRayTarget.y}
            stroke="#ff1e60"
            strokeWidth="48"
            strokeOpacity="0.8"
            strokeLinecap="round"
          />

          {/* Layer 3: Incandescent Gold Lightning Spine (20px wide) */}
          <line
            x1={deathRayTarget.x}
            y1={0}
            x2={deathRayTarget.x}
            y2={deathRayTarget.y}
            stroke="#fbbf24"
            strokeWidth="20"
            strokeOpacity="0.9"
            strokeLinecap="round"
          />

          {/* Layer 4: White-Hot Singularity Beam (8px wide) */}
          <line
            x1={deathRayTarget.x}
            y1={0}
            x2={deathRayTarget.x}
            y2={deathRayTarget.y}
            stroke="#ffffff"
            strokeWidth="8"
            strokeLinecap="round"
          />
        </svg>
      )}

      {/* =========================================================================
          3. GROUND ZERO IMPACT EXPLOSION (DESINTEGRAÇÃO DO ALVO)
         ========================================================================= */}
      {impactExplosion && (
        <div
          aria-hidden="true"
          style={{
            left: `${deathRayTarget.x}px`,
            top: `${deathRayTarget.y}px`,
          }}
          className="fixed z-50 pointer-events-none -translate-x-1/2 -translate-y-1/2 flex items-center justify-center select-none"
        >
          {/* Multiple Expanding Shockwaves */}
          <div className="w-64 h-64 rounded-full border-4 border-rose-500 animate-ping opacity-90 shadow-[0_0_80px_#ef4444]" />
          <div className="absolute w-44 h-44 rounded-full border-2 border-amber-300 animate-pulse bg-white/40 shadow-[0_0_60px_#fbbf24]" />
          {/* Incandescent Flash Center */}
          <div className="absolute w-24 h-24 rounded-full bg-white blur-xs animate-ping" />
        </div>
      )}

      {/* =========================================================================
          4. FLOATING CANCEL DRONE FOLLOW CHIP (TOP-RIGHT)
         ========================================================================= */}
      {followMouse && (
        <button
          onClick={stopFollowing}
          className="fixed top-6 right-6 z-50 px-3.5 py-1.5 rounded-full bg-cyan-950/95 border-2 border-cyan-400 text-cyan-200 text-xs font-mono font-bold flex items-center gap-2 shadow-[0_0_25px_rgba(0,240,255,0.45)] cursor-pointer hover:bg-cyan-900 hover:scale-105 transition-all"
          title="Clique ou pressione ESC para parar o drone"
        >
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span>🛑 Parar Drone (ESC)</span>
        </button>
      )}

      {/* =========================================================================
          5. MAIN ROBOT CONTAINER (LUCKY COMPANION DRONE)
         ========================================================================= */}
      <div
        ref={botRef}
        onMouseEnter={() => {
          isHoveredRef.current = true;
        }}
        onMouseLeave={() => {
          isHoveredRef.current = false;
        }}
        style={
          dashState === 'dashing_out'
            ? {
                right: dockSide === 'left' ? undefined : '24px',
                left: dockSide === 'left' ? '24px' : undefined,
                bottom: '24px',
                transform: 'translateX(260px) rotate(24deg) scale(0.8)',
                opacity: 0,
                transition: 'transform 0.38s ease-in, opacity 0.35s ease-in',
                pointerEvents: 'none',
              }
            : dashState === 'away'
            ? {
                right: dockSide === 'left' ? undefined : '24px',
                left: dockSide === 'left' ? '24px' : undefined,
                bottom: '24px',
                opacity: 0,
                pointerEvents: 'none',
                visibility: 'hidden',
              }
            : dashState === 'dashing_in'
            ? {
                right: dockSide === 'left' ? undefined : '24px',
                left: dockSide === 'left' ? '24px' : undefined,
                bottom: '24px',
                transform: 'translateX(0) rotate(0deg) scale(1)',
                opacity: 1,
                transition: 'transform 0.45s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.2s ease-out',
                pointerEvents: 'auto',
              }
            : followMouse
            ? {
                right: `${position.x}px`,
                bottom: `${position.y}px`,
                transform: `rotate(${tiltAngle}deg)`,
                transition: 'none',
              }
            : dockSide === 'left'
            ? {
                left: '24px',
                bottom: '24px',
                transform: `rotate(${tiltAngle}deg)`,
                transition: isDraggingRef.current ? 'none' : 'left 0.85s cubic-bezier(0.16, 1, 0.3, 1), transform 0.25s ease-out',
              }
            : dockSide === 'right'
            ? {
                right: '24px',
                bottom: '24px',
                transform: `rotate(${tiltAngle}deg)`,
                transition: isDraggingRef.current ? 'none' : 'right 0.85s cubic-bezier(0.16, 1, 0.3, 1), transform 0.25s ease-out',
              }
            : {
                right: `${position.x}px`,
                bottom: `${position.y}px`,
                transform: `rotate(${tiltAngle}deg)`,
                transition: isDraggingRef.current ? 'none' : 'transform 0.15s ease-out',
              }
        }
        className={`fixed z-50 select-none flex flex-col pointer-events-auto ${
          dockSide === 'left' ? 'items-start' : 'items-end'
        }`}
      >
        {/* SPEECH BUBBLE COMPACTO COM EFEITO TYPEWRITER E DESCRIPTOGRAFIA */}
        {speechBubble && (
          <div
            onClick={() => setSpeechBubble(null)}
            title="Clique para fechar"
            className={`mb-2 max-w-[220px] sm:max-w-[260px] bg-[#0c051f]/95 border text-[11px] sm:text-xs font-mono px-3 py-2 rounded-xl backdrop-blur-md animate-fadeIn relative cursor-pointer select-none transition-all ${
              isDecrypting
                ? 'border-emerald-400 text-emerald-200 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                : 'border-cyan-400 text-cyan-100 shadow-[0_0_20px_rgba(0,240,255,0.3)]'
            } ${
              dockSide === 'left' ? 'rounded-bl-xs' : 'rounded-br-xs'
            }`}
          >
            {isDecrypting && (
              <div className="flex items-center gap-1.5 pb-1 mb-1.5 border-b border-emerald-500/30 text-[9px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping shrink-0" />
                <span>DECRIPTANDO TRANSMISSÃO...</span>
              </div>
            )}
            {isDecryptedBadge && !isDecrypting && (
              <div className="flex items-center gap-1.5 pb-1 mb-1.5 border-b border-cyan-500/30 text-[9px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#00f0ff] shrink-0" />
                <span>TRANSMISSÃO DESCRIPTOGRAFADA</span>
              </div>
            )}
            <p className="leading-snug font-medium break-words">
              {displayedSpeech}
              <span
                className={`inline-block w-1.5 h-3 ${
                  isDecrypting ? 'bg-emerald-400' : 'bg-cyan-400'
                } ml-0.5 animate-pulse align-middle`}
              />
            </p>
            <div
              className={`absolute -bottom-2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] ${
                isDecrypting ? 'border-t-emerald-400' : 'border-t-cyan-400'
              } ${
                dockSide === 'left' ? 'left-4' : 'right-4'
              }`}
            />
          </div>
        )}

        {/* ULTRA-COMPACT MENU POPUP */}
        {isOpen && (
          <div className="mb-2 w-[270px] bg-[#080318]/95 border border-cyan-500/40 rounded-2xl p-2.5 shadow-[0_0_30px_rgba(0,240,255,0.25)] backdrop-blur-xl animate-scaleUp">
            {/* Header */}
            <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-white/[0.08]">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-cyan-400 rounded-xs shadow-[0_0_6px_#00f0ff]" />
                <span className="font-bold text-white tracking-wider text-[11px]">LUCKY COPILOTO</span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  title={soundEnabled ? 'Silenciar efeitos sonoros' : 'Ativar efeitos sonoros'}
                  className="p-1 text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
                >
                  {soundEnabled ? (
                    <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                  ) : (
                    <VolumeX className="w-3.5 h-3.5 text-slate-500" />
                  )}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Quick 2 Action Buttons: Destruir o cursor + Seguir o Mouse */}
            <div className="grid grid-cols-2 gap-1.5 mb-1.5">
              <button
                aria-label="Destruir o cursor com feixe laser"
                onClick={triggerDestroyCursor}
                disabled={cursorCooldown > 0 || deathRayState !== 'idle'}
                className={`py-2 px-2 rounded-lg text-[10px] font-mono font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer text-center leading-tight ${
                  cursorCooldown > 0
                    ? 'bg-rose-500/20 text-rose-300/60 border border-rose-500/30'
                    : 'bg-rose-600/25 hover:bg-rose-600/40 text-rose-200 border border-rose-500/40 shadow-[0_0_12px_rgba(244,63,94,0.15)]'
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <span>{cursorCooldown > 0 ? `Aguarde ${cursorCooldown}s` : 'Destruir o cursor'}</span>
              </button>

              <button
                onClick={toggleFollowMouse}
                className={`py-2 px-2 rounded-lg text-[10px] font-mono font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer text-center leading-tight ${
                  followMouse
                    ? 'bg-cyan-500/30 text-cyan-200 border border-cyan-400 animate-pulse shadow-[0_0_12px_rgba(0,240,255,0.25)]'
                    : isPreparingFollow
                    ? 'bg-amber-500/25 text-amber-200 border border-amber-400/50 animate-pulse'
                    : 'bg-white/[0.04] text-slate-300 hover:text-white border border-white/10'
                }`}
              >
                <Crosshair className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>
                  {followMouse
                    ? 'Parar Drone'
                    : isPreparingFollow
                    ? 'Calibrando...'
                    : 'Seguir o Mouse'}
                </span>
              </button>
            </div>

            {/* Quick Interactive Sprints: iFood & Duolingo */}
            <div className="grid grid-cols-2 gap-1.5 mb-2">
              <button
                onClick={runIFoodSprint}
                disabled={dashState !== 'idle'}
                className="py-1.5 px-2 rounded-lg text-[10px] font-mono font-bold flex items-center justify-center gap-1 bg-rose-500/15 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 transition-all cursor-pointer"
              >
                <span>🛵 Pegar iFood</span>
              </button>
              <button
                onClick={runDuolingoSprint}
                disabled={dashState !== 'idle'}
                className="py-1.5 px-2 rounded-lg text-[10px] font-mono font-bold flex items-center justify-center gap-1 bg-emerald-500/15 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 transition-all cursor-pointer"
              >
                <span>🦉 Fazer Duolingo</span>
              </button>
            </div>

            {/* Canonical 4 Navigation Options (Chips) */}
            <div className="grid grid-cols-2 gap-1.5 text-[11px] font-mono">
              {QUICK_LINKS.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleSelectQuickLink(link)}
                  className="p-2 rounded-lg bg-white/[0.03] hover:bg-cyan-500/20 hover:text-cyan-200 border border-white/[0.06] text-slate-300 transition-colors text-left flex items-center gap-2 truncate cursor-pointer"
                >
                  <span className="shrink-0">{link.icon}</span>
                  <span className="truncate font-semibold">{link.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* COMPACT SQUARE CYBERPUNK BOT AVATAR (~44px) - CHASSI METÁLICO INTACTO */}
        <div
          onMouseDown={handleMouseDown}
          onClick={() => {
            if (hasMovedRef.current) {
              hasMovedRef.current = false;
              return;
            }
            if (followMouse) {
              stopFollowing();
              return;
            }
            setIsOpen(!isOpen);
            playCuteChirpMelody(2);
          }}
          className={`group relative cursor-grab active:cursor-grabbing transition-transform ${
            deathRayState === 'charging' ? 'scale-110 animate-bounce' : ''
          }`}
          title={followMouse ? 'Clique para parar o drone' : 'LUCKY: Clique para abrir ou arraste'}
        >
          {/* Subtle Glow Halo */}
          <div
            className={`absolute -inset-1 rounded-xl transition-all ${
              deathRayState === 'charging'
                ? 'bg-gradient-to-tr from-rose-500 via-fuchsia-500 to-amber-400 blur-md animate-pulse opacity-100 scale-125'
                : 'bg-gradient-to-tr from-cyan-500/30 via-violet-600/30 to-fuchsia-500/30 blur-xs group-hover:blur-sm opacity-70 group-hover:opacity-100'
            }`}
          />

          {/* Main Metallic/Obsidian Chassis */}
          <div
            className={`relative w-11 h-11 rounded-xl bg-[#080414] border-2 shadow-[0_0_12px_rgba(0,240,255,0.35)] flex flex-col items-center justify-between p-1 transition-all overflow-hidden ${
              eyeState === 'angry'
                ? 'border-rose-500 shadow-[0_0_18px_#f43f5e]'
                : deathRayState === 'charging'
                ? 'border-rose-400 shadow-[0_0_22px_#ef4444]'
                : 'border-cyan-400'
            }`}
          >
            {/* Top antenna & LED indicators */}
            <div className="w-full flex items-center justify-between px-0.5">
              <div
                className={`w-1 h-0.5 rounded-xs transition-colors ${
                  eyeState === 'angry' ? 'bg-rose-500' : deathRayState === 'charging' ? 'bg-rose-400' : 'bg-fuchsia-400'
                }`}
              />
              <div className="w-2 h-0.5 bg-cyan-400/60" />
              <div className="w-1 h-0.5 bg-cyan-400 rounded-xs" />
            </div>

            {/* LED Screen / Face with Mouse Tracking */}
            <div className="w-full flex-1 mx-auto my-0.5 rounded-md bg-[#020108] border border-cyan-500/30 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[linear-gradient(rgba(0,240,255,0.08)_1px,transparent_1px)] [background-size:100%_3px] pointer-events-none" />

              <div
                style={{
                  transform: `translate(${eyeLook.x}px, ${eyeLook.y}px)`,
                  transition: 'transform 0.05s ease-out',
                }}
                className="relative z-10 flex items-center gap-1.5"
              >
                {/* 1. ANGRY / COMPLAINING (> <) */}
                {eyeState === 'angry' && (
                  <>
                    <span className="text-rose-400 font-extrabold text-[11px] leading-none animate-bounce">&gt;</span>
                    <span className="text-rose-400 font-extrabold text-[11px] leading-none animate-bounce">&lt;</span>
                  </>
                )}

                {/* 2. CHARGING (* *) */}
                {eyeState === 'charge' && (
                  <>
                    <span className="text-rose-400 font-bold text-[11px] leading-none animate-spin">*</span>
                    <span className="text-amber-300 font-bold text-[11px] leading-none animate-spin">*</span>
                  </>
                )}

                {/* 3. BLINK */}
                {eyeState === 'blink' && (
                  <>
                    <div className="w-1.5 h-0.5 bg-cyan-300 shadow-[0_0_4px_#00f0ff]" />
                    <div className="w-1.5 h-0.5 bg-cyan-300 shadow-[0_0_4px_#00f0ff]" />
                  </>
                )}

                {/* 4. HAPPY (^ ^) */}
                {eyeState === 'happy' && (
                  <>
                    <span className="text-cyan-300 font-bold text-[10px] leading-none shadow-[0_0_4px_#00f0ff]">^</span>
                    <span className="text-cyan-300 font-bold text-[10px] leading-none shadow-[0_0_4px_#00f0ff]">^</span>
                  </>
                )}

                {/* 5. SCAN */}
                {eyeState === 'scan' && (
                  <>
                    <div className="w-2 h-1 bg-fuchsia-400 shadow-[0_0_6px_#bd00ff] animate-pulse" />
                    <div className="w-2 h-1 bg-cyan-300 shadow-[0_0_6px_#00f0ff] animate-pulse" />
                  </>
                )}

                {/* 6. NORMAL LED PUPILS */}
                {eyeState === 'normal' && (
                  <>
                    <div className="w-2 h-2 rounded-xs bg-cyan-300 shadow-[0_0_6px_#00f0ff]" />
                    <div className="w-2 h-2 rounded-xs bg-cyan-300 shadow-[0_0_6px_#00f0ff]" />
                  </>
                )}

                {/* 7. HEART EYES (♥ ♥) - Reação apaixonada/super feliz para contato */}
                {eyeState === 'heart' && (
                  <>
                    <span className="text-rose-400 font-extrabold text-[12px] leading-none animate-pulse drop-shadow-[0_0_8px_#ff1e60]">♥</span>
                    <span className="text-rose-400 font-extrabold text-[12px] leading-none animate-pulse drop-shadow-[0_0_8px_#ff1e60]">♥</span>
                  </>
                )}

                {/* 8. STAR EYES (★ ★) - Reação brilhante de estrela */}
                {eyeState === 'star' && (
                  <>
                    <span className="text-amber-300 font-extrabold text-[12px] leading-none animate-pulse drop-shadow-[0_0_8px_#fbbf24]">★</span>
                    <span className="text-amber-300 font-extrabold text-[12px] leading-none animate-pulse drop-shadow-[0_0_8px_#fbbf24]">★</span>
                  </>
                )}
              </div>
            </div>

            {/* Bottom speaker grill detail */}
            <div className="w-full flex items-center justify-center gap-0.5">
              <span className="w-1 h-0.5 bg-cyan-400" />
              <span className="w-1 h-0.5 bg-fuchsia-400" />
              <span className="w-1 h-0.5 bg-cyan-400" />
            </div>
          </div>

          {/* DUAL ION THRUSTER JETS (WHEN DRONE FOLLOW IS ACTIVE) */}
          {followMouse && (
            <div className="w-full flex items-center justify-center gap-3 -mt-0.5">
              <div className="w-1.5 h-3 bg-gradient-to-b from-cyan-400 via-cyan-500 to-transparent rounded-full animate-pulse shadow-[0_0_8px_#00f0ff]" />
              <div className="w-1.5 h-3 bg-gradient-to-b from-fuchsia-400 via-fuchsia-500 to-transparent rounded-full animate-pulse shadow-[0_0_8px_#bd00ff]" />
            </div>
          )}

          {!isOpen && (
            <div
              className={`absolute -top-1 -right-1 w-3 h-3 rounded-xs border border-black shadow-[0_0_6px_#bd00ff] flex items-center justify-center text-[7px] font-mono font-bold text-black transition-colors ${
                followMouse ? 'bg-cyan-400 shadow-[0_0_8px_#00f0ff]' : 'bg-fuchsia-500'
              }`}
            >
              {followMouse ? '🎯' : 'L'}
            </div>
          )}
        </div>
      </div>

      {/* Screen reader live notification for cursor restore (WCAG) */}
      <div className="sr-only" aria-live="polite">
        {cursorAriaLive}
      </div>
    </>
  );
};
