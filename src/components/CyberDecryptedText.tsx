import React, { useState, useEffect, useRef } from 'react';

const CIPHER_GLYPHS = '01#@!$%&*<>{}[]/?~+=ABCDEF§∆9876543210';

interface CyberDecryptedTextProps {
  text: string;
  tag?: 'h1' | 'h2' | 'h3' | 'span' | 'p' | 'div';
  className?: string;
  speed?: number;
  delay?: number;
  scrambleLoops?: number;
  triggerOnScroll?: boolean;
}

export const CyberDecryptedText: React.FC<CyberDecryptedTextProps> = ({
  text,
  tag = 'span',
  className = '',
  speed = 20,
  delay = 70,
  scrambleLoops = 14,
  triggerOnScroll = true,
}) => {
  const [displayText, setDisplayText] = useState<string>(text);
  const [isDecrypting, setIsDecrypting] = useState<boolean>(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);
  const containerRef = useRef<HTMLElement | null>(null);
  const hasTriggeredRef = useRef<boolean>(false);
  const intervalRef = useRef<any>(null);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(mq.matches);
      const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
      mq.addEventListener?.('change', listener);
      return () => mq.removeEventListener?.('change', listener);
    }
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) {
      setDisplayText(text);
      setIsDecrypting(false);
      return;
    }

    const el = containerRef.current;
    if (!el) return;

    const cleanupTimers = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };

    const startDecryption = () => {
      if (hasTriggeredRef.current) return;
      hasTriggeredRef.current = true;
      setIsDecrypting(true);

      const totalLen = text.length;
      let frame = 0;
      let revealedChars = 0;

      timerRef.current = setTimeout(() => {
        intervalRef.current = setInterval(() => {
          frame++;

          if (frame < scrambleLoops) {
            // Fase 1: Cifra cyberpunk aleatória intensa preservando quebras e espaços
            let scrambled = '';
            for (let i = 0; i < totalLen; i++) {
              if (text[i] === ' ' || text[i] === '\n') {
                scrambled += text[i];
              } else {
                scrambled += CIPHER_GLYPHS[Math.floor(Math.random() * CIPHER_GLYPHS.length)];
              }
            }
            setDisplayText(scrambled);
          } else {
            // Fase 2: Descriptografia progressiva caractere a caractere
            revealedChars += 1;
            if (revealedChars >= totalLen) {
              setDisplayText(text);
              setIsDecrypting(false);
              clearInterval(intervalRef.current);
            } else {
              let current = text.slice(0, revealedChars);
              for (let i = revealedChars; i < totalLen; i++) {
                if (text[i] === ' ' || text[i] === '\n') {
                  current += text[i];
                } else {
                  current += CIPHER_GLYPHS[Math.floor(Math.random() * CIPHER_GLYPHS.length)];
                }
              }
              setDisplayText(current);
            }
          }
        }, speed);
      }, delay);
    };

    let observer: IntersectionObserver | null = null;

    if (triggerOnScroll && typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !hasTriggeredRef.current) {
              startDecryption();
              observer?.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.25 }
      );
      observer.observe(el);
    } else {
      startDecryption();
    }

    return () => {
      cleanupTimers();
      if (observer) observer.disconnect();
    };
  }, [text, speed, delay, scrambleLoops, triggerOnScroll, prefersReducedMotion]);

  const Tag = tag as any;

  if (prefersReducedMotion) {
    return (
      <Tag ref={containerRef} className={className}>
        {text}
      </Tag>
    );
  }

  return (
    <Tag
      ref={containerRef}
      className={`${className} transition-colors duration-200`}
    >
      {/* Texto estável e estático para tecnologias assistivas (leitores de tela) */}
      <span className="sr-only">{text}</span>
      {/* Camada visual com animação que não afeta a árvore de acessibilidade nem causa layout shift cumulativo */}
      <span
        aria-hidden="true"
        className={isDecrypting ? 'text-cyan-300 drop-shadow-[0_0_14px_rgba(0,240,255,0.7)]' : ''}
      >
        {displayText}
      </span>
    </Tag>
  );
};
