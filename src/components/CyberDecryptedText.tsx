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
  const containerRef = useRef<HTMLElement | null>(null);
  const hasTriggeredRef = useRef<boolean>(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const startDecryption = () => {
      if (hasTriggeredRef.current) return;
      hasTriggeredRef.current = true;
      setIsDecrypting(true);

      const totalLen = text.length;
      let frame = 0;
      let revealedChars = 0;

      const timer = setTimeout(() => {
        const interval = setInterval(() => {
          frame++;

          if (frame < scrambleLoops) {
            // Fase 1: Cifra cyberpunk aleatória intensa
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
            // Fase 2: Descriptografia progressiva caractere a caractere (ritmo cinematográfico)
            revealedChars += 1;
            if (revealedChars >= totalLen) {
              setDisplayText(text);
              setIsDecrypting(false);
              clearInterval(interval);
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

      return () => clearTimeout(timer);
    };

    if (triggerOnScroll && typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !hasTriggeredRef.current) {
              startDecryption();
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.25 }
      );

      observer.observe(el);
      return () => observer.disconnect();
    } else {
      startDecryption();
    }
  }, [text, speed, delay, scrambleLoops, triggerOnScroll]);

  const Tag = tag as any;

  return (
    <Tag
      ref={containerRef}
      className={`${className} ${
        isDecrypting ? 'text-cyan-300 drop-shadow-[0_0_14px_rgba(0,240,255,0.7)]' : ''
      } transition-colors duration-200`}
    >
      {displayText}
    </Tag>
  );
};

