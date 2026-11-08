import React, { useState, useEffect, useRef, useCallback } from 'react';

export const BatmanEasterEgg: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const keySequenceRef = useRef<string>('');
  const timeoutRef = useRef<number | null>(null);

  // Sintetizador de áudio cinematográfico do Bat-Sinal (acorde escuro e estrondoso estilo Hans Zimmer)
  const playBatSignalTheme = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const now = ctx.currentTime;

      // 1. Trompa / Brass Sombrio (Motivo de 2 notas: Ré -> Fá)
      const playHornNote = (freq: number, startTime: number, duration: number) => {
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc1.type = 'sawtooth';
        osc2.type = 'triangle';
        osc1.frequency.setValueAtTime(freq, startTime);
        osc2.frequency.setValueAtTime(freq * 1.004, startTime); // detune para coro espesso

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(350, startTime);
        filter.frequency.exponentialRampToValueAtTime(1400, startTime + duration * 0.4);
        filter.frequency.exponentialRampToValueAtTime(300, startTime + duration);

        gain.gain.setValueAtTime(0.0001, startTime);
        gain.gain.linearRampToValueAtTime(0.18, startTime + 0.12);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc1.start(startTime);
        osc2.start(startTime);
        osc1.stop(startTime + duration);
        osc2.stop(startTime + duration);
      };

      // Nota 1 (Ré baixo 146.8 Hz)
      playHornNote(146.83, now, 1.2);
      // Nota 2 (Fá épico 174.6 Hz)
      playHornNote(174.61, now + 0.9, 1.6);

      // 2. Trovão / Sub-bass no céu
      const rumble = ctx.createOscillator();
      const rumbleGain = ctx.createGain();
      rumble.type = 'sine';
      rumble.frequency.setValueAtTime(65, now);
      rumble.frequency.exponentialRampToValueAtTime(25, now + 2.2);

      rumbleGain.gain.setValueAtTime(0.22, now);
      rumbleGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.5);

      rumble.connect(rumbleGain);
      rumbleGain.connect(ctx.destination);
      rumble.start(now);
      rumble.stop(now + 2.5);
    } catch {
      /* ignore */
    }
  }, []);

  const triggerBatSignal = useCallback(() => {
    if (isActive) return;
    setIsActive(true);
    playBatSignalTheme();

    // Notifica o chatbot Lucky para reagir ao Bat-Sinal
    window.dispatchEvent(
      new CustomEvent('batman:signal', {
        detail: { active: true },
      })
    );

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => {
      setIsActive(false);
      timeoutRef.current = null;
    }, 7500);
  }, [isActive, playBatSignalTheme]);

  // Detector de teclado: digitar "batman" em qualquer lugar ativa o easter egg
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      const char = e.key.toLowerCase();
      if (/^[a-z]$/.test(char)) {
        keySequenceRef.current = (keySequenceRef.current + char).slice(-8);
        if (keySequenceRef.current.includes('batman')) {
          keySequenceRef.current = '';
          triggerBatSignal();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [triggerBatSignal]);

  return (
    <>
      {/* ======================================================== */}
      {/* 1. SILHUETA DO BATMAN NA BEIRADA DA SEÇÃO DE CONTATO    */}
      {/* ======================================================== */}
      <div
        className="absolute -top-12 right-6 sm:right-10 z-20 select-none group cursor-pointer"
        onClick={triggerBatSignal}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        title="Easter Egg: O Cavaleiro das Trevas vigia este código (ou digite 'batman')"
        aria-label="Easter Egg do Batman"
      >
        {/* Tooltip sutil ao passar o mouse */}
        <div
          className={`absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-black/90 border border-amber-400/50 text-[10px] font-mono text-amber-300 whitespace-nowrap transition-all duration-300 pointer-events-none shadow-[0_0_12px_rgba(251,191,36,0.3)] ${
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'
          }`}
        >
          🦇 I am the night...
        </div>

        {/* SVG da Silhueta do Batman no Parapeito / Gárgula */}
        <svg
          viewBox="0 0 70 85"
          className={`w-11 h-14 sm:w-13 sm:h-16 transition-all duration-300 drop-shadow-[0_0_12px_rgba(0,0,0,0.9)] ${
            isHovered
              ? 'scale-105 filter drop-shadow-[0_0_15px_rgba(251,191,36,0.6)]'
              : 'opacity-40 hover:opacity-100'
          }`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Base da gárgula / parapeito */}
          <path
            d="M8 82 H62 L55 70 H15 Z"
            fill="#090514"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="0.8"
          />

          {/* Capa fluida descendo */}
          <path
            d="M20 38 Q10 52 14 74 Q24 64 32 72 Q42 63 52 74 Q56 50 46 38 Z"
            fill="#030108"
          />

          {/* Corpo musculoso do Cavaleiro das Trevas */}
          <path
            d="M25 35 L22 55 L33 65 L44 55 L41 35 Z"
            fill="#080410"
          />

          {/* Ombros e Capuz clássico com orelhas pontiagudas */}
          <path
            d="M18 36 C19 32 24 24 28 23 L28 10 L31 20 L35 21 L39 20 L42 10 L42 23 C46 24 51 32 52 36 C46 38 41 35 33 35 C25 35 20 38 18 36 Z"
            fill="#020106"
          />

          {/* Olhos brancos brilhantes da máscara (acendem no hover ou no sinal) */}
          <polygon
            points="29,23 32,24 30,26"
            fill={isHovered || isActive ? '#ffffff' : '#94a3b8'}
            className={isHovered || isActive ? 'drop-shadow-[0_0_6px_#00f0ff]' : ''}
          />
          <polygon
            points="37,23 34,24 36,26"
            fill={isHovered || isActive ? '#ffffff' : '#94a3b8'}
            className={isHovered || isActive ? 'drop-shadow-[0_0_6px_#00f0ff]' : ''}
          />
        </svg>
      </div>

      {/* ======================================================== */}
      {/* 2. O BAT-SINAL PROJETADO NO CÉU DA PÁGINA (ESTRONDOSO)   */}
      {/* ======================================================== */}
      {isActive && (
        <div
          className="fixed inset-0 z-[120] pointer-events-none overflow-hidden transition-opacity duration-1000 animate-fadeIn"
          aria-hidden="true"
        >
          {/* Luz volumétrica do holofote subindo em diagonal */}
          <div
            className="absolute -bottom-20 left-1/4 w-[160px] h-[130vh] origin-bottom -rotate-12 blur-2xl opacity-75"
            style={{
              background:
                'linear-gradient(to top, rgba(253, 224, 71, 0.45) 0%, rgba(250, 204, 21, 0.25) 50%, rgba(250, 204, 21, 0.02) 100%)',
            }}
          />

          {/* Halo radiante do Bat-Sinal nas nuvens cósmicas */}
          <div className="absolute top-[12%] left-[38%] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
            {/* Círculo de luz amarela/âmbar do holofote */}
            <div className="w-56 h-44 sm:w-80 sm:h-60 rounded-[50%] bg-gradient-to-tr from-amber-300/90 via-yellow-200/80 to-amber-400/90 shadow-[0_0_120px_rgba(251,191,36,0.9),inset_0_0_40px_rgba(251,191,36,0.8)] blur-xs animate-pulse flex items-center justify-center border-4 border-amber-200/50">
              {/* O Ícone Clássico do Morcego / Bat-Insignia na projeção */}
              <svg
                viewBox="0 0 100 60"
                className="w-36 h-24 sm:w-52 sm:h-34 text-black fill-current drop-shadow-[0_0_20px_rgba(0,0,0,0.95)]"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M50 18 Q46 10 44 2 Q47 11 50 14 Q53 11 56 2 Q54 10 50 18 M50 18 C38 17 28 5 15 15 C8 22 2 34 0 45 C14 43 25 35 32 28 C34 38 43 45 50 54 C57 45 66 38 68 28 C75 35 86 43 100 45 C98 34 92 22 85 15 C72 5 62 17 50 18 Z" />
              </svg>
            </div>

            {/* Auréola de névoa ao redor */}
            <div className="absolute w-72 h-60 sm:w-96 sm:h-80 rounded-[50%] bg-amber-400/25 blur-3xl" />
          </div>

          {/* Banner cyberpunk estilizado avisando da presença */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl bg-black/90 border border-amber-400/60 shadow-[0_0_30px_rgba(251,191,36,0.5)] text-center backdrop-blur-md">
            <span className="text-xs font-mono font-bold text-amber-300 tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span>GOTHAM CITY: BAT-SINAL ATIVADO</span>
            </span>
          </div>
        </div>
      )}
    </>
  );
};
