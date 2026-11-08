import React, { useEffect, useState } from 'react';
import {
  Github,
  Linkedin,
  Mail,
  ArrowUpRight,
  ExternalLink,
  X,
} from 'lucide-react';
import { GlobeBackground } from './components/GlobeBackground';
import { LuckyAssistant } from './components/LuckyAssistant';
import { TechSkillsLogos } from './components/TechSkillsLogos';
import { CompactProjectCard } from './components/CompactProjectCard';
import { ProjectDetailsDrawer } from './components/ProjectDetailsDrawer';
import { TimelineSection } from './components/TimelineSection';
import { CyberDecryptedText } from './components/CyberDecryptedText';
import {
  MAIN_PROJECTS,
  OTHER_PROJECTS,
  CONTACT_INFO,
  TARGET_COMPANY,
  MainProject,
} from './data/portfolioData';

export function App() {
  const [isIfoodRef, setIsIfoodRef] = useState(false);
  const [activeDrawerProject, setActiveDrawerProject] = useState<MainProject | null>(null);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  // Check URL parameter for ?ref=ifood
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      setIsIfoodRef(params.get('ref') === 'ifood');
    }
  }, []);

  return (
    <div className="relative min-h-screen bg-[#04020a] text-slate-100 selection:bg-cyan-500/30 selection:text-white overflow-x-hidden">
      {/* 1. 3D ORBITAL GLOBE */}
      <GlobeBackground />

      {/* 2. COMPACT CYBERPUNK ASSISTANT (LUCKY) */}
      <LuckyAssistant />

      {/* 3. OPTIONAL DYNAMIC CONTEXT BANNER (?ref=ifood) */}
      {isIfoodRef && (
        <aside
          aria-label="Notificação de contexto"
          className="fixed top-4 inset-x-0 z-30 px-6 pointer-events-none"
        >
          <div className="max-w-xl mx-auto px-4 py-2 rounded-full bg-rose-950/90 border border-rose-500/40 backdrop-blur-md shadow-[0_0_20px_rgba(244,63,94,0.3)] flex items-center justify-between text-xs font-mono text-rose-200 pointer-events-auto">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              <span>Contexto ativo: Candidatura Trilha AI Engineer</span>
            </span>
            <a
              href="#projetos"
              className="text-white underline hover:text-cyan-300 transition-colors ml-2 font-bold"
            >
              Ver Projetos →
            </a>
          </div>
        </aside>
      )}

      {/* MAIN CONTENT */}
      <main id="top" className="relative z-10 pt-4">
        {/* HERO SECTION */}
        <section className="min-h-[88vh] flex flex-col items-center justify-center pt-8 pb-14 px-6 sm:px-12 text-center">
          <div className="max-w-2xl mx-auto flex flex-col items-center relative z-10">
            <CyberDecryptedText
              text="Lucas Almeida"
              tag="h1"
              delay={100}
              speed={24}
              className="font-display text-5xl sm:text-7xl md:text-8xl font-extrabold tracking-tight text-cyber-gradient leading-[1.04] drop-shadow-[0_4px_28px_rgba(0,0,0,0.95)]"
            />

            <CyberDecryptedText
              text="Engenharia de Software · Aprendizado Federado · Desenvolvimento Full Stack"
              tag="p"
              delay={280}
              speed={18}
              className="mt-3 text-sm sm:text-lg md:text-xl font-medium text-slate-100 tracking-wide drop-shadow-[0_2px_14px_rgba(0,0,0,0.9)] max-w-xl mx-auto"
            />

            <p className="mt-4 max-w-xl text-xs sm:text-sm text-slate-200 leading-relaxed font-normal drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)] mx-auto">
              Graduando em <strong className="text-white font-semibold">Engenharia de Software (UFC)</strong> e <strong className="text-white font-semibold">Técnico em Informática (IFMA)</strong>. Projetos acadêmicos e autorais com foco em Aprendizado Federado (FL), explicabilidade de modelos (XAI) e prototipação de sistemas com LLMs.
            </p>

            <div className="mt-7 flex flex-wrap items-center justify-center gap-3.5">
              <a
                href="#projetos"
                className="btn-cyber-primary px-6 py-2.5 rounded-full text-xs sm:text-sm flex items-center gap-2 font-mono font-bold cursor-pointer"
              >
                <span>Explorar Projetos</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
              <a
                href={CONTACT_INFO.github}
                target="_blank"
                rel="noopener noreferrer"
                data-contact-link="true"
                className="btn-cyber-ghost px-6 py-2.5 rounded-full text-xs sm:text-sm flex items-center gap-2 font-mono cursor-pointer"
              >
                <Github className="w-4 h-4" />
                <span>github.com/Lucas-715</span>
              </a>
            </div>
          </div>
        </section>

        {/* SOBRE MIM */}
        <section id="sobre" className="py-16 px-6 sm:px-12 max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-7 cyber-card rounded-3xl p-7 sm:p-8 flex flex-col justify-between">
              <div>
                <CyberDecryptedText
                  text="PERFIL & ABORDAGEM"
                  tag="span"
                  className="text-xs font-mono text-cyan-400 uppercase tracking-wider block mb-2 font-semibold"
                />
                <CyberDecryptedText
                  text="Unir engenharia de software estruturada à experimentação prática em inteligência artificial."
                  tag="h2"
                  className="font-display text-xl sm:text-2xl font-bold text-white mb-3 leading-snug"
                />
                <div className="space-y-3 text-slate-200 text-xs sm:text-sm leading-relaxed">
                  <p>
                    Minha abordagem prioriza <strong>organização modular</strong>, <strong>testes automatizados (pytest)</strong> e <strong>documentação clara de decisões</strong>.
                  </p>
                  <p>
                    Em projetos acadêmicos e autorais, desenvolvo desde interfaces com Vue.js 3 e Next.js até experimentos de Machine Learning com PyTorch com múltiplas sementes e desvio padrão.
                  </p>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs font-mono">
                <span className="text-slate-300">Formação base:</span>
                <span className="text-cyan-300 font-semibold">UFC (Eng. Software) & IFMA (Técnico)</span>
              </div>
            </div>

            <div className="md:col-span-5 cyber-card rounded-3xl p-7 sm:p-8 flex flex-col justify-between bg-gradient-to-b from-cyan-500/[0.04] to-transparent">
              <div>
                <CyberDecryptedText
                  text="ÁREAS DE ATUAÇÃO"
                  tag="span"
                  className="text-xs font-mono text-cyan-400 uppercase tracking-wider block mb-2 font-semibold"
                />
                <h3 className="font-display text-xl font-bold text-white mb-3">
                  Pilares Técnicos
                </h3>
                <div className="space-y-2 text-xs font-mono">
                  {[
                    { label: 'Aprendizado Federado', detail: 'FedAvg e FedProx em PyTorch sob dados heterogêneos' },
                    { label: 'Explicabilidade (XAI)', detail: 'Integrated Gradients e similaridade de cosseno' },
                    { label: 'Sistemas com LLMs', detail: 'Desacoplamento de regras formais e orquestração' },
                    { label: 'Full Stack', detail: 'Next.js, TypeScript, Prisma ORM e SQLite' },
                  ].map((p) => (
                    <div key={p.label} className="p-2.5 rounded-xl bg-black/40 border border-white/[0.06]">
                      <span className="text-cyan-300 font-bold block">{p.label}</span>
                      <span className="text-slate-300 text-xs font-sans block mt-0.5">{p.detail}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs font-mono">
                <span className="text-slate-300">Repositórios:</span>
                <a
                  href={CONTACT_INFO.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-contact-link="true"
                  className="text-cyan-300 hover:text-white flex items-center gap-1 transition-colors"
                >
                  <span>Lucas-715</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* PROJETOS EM DESTAQUE — BENTO ASSIMÉTRICO COMPACTO */}
        <section id="projetos" className="py-14 px-6 sm:px-12 max-w-5xl mx-auto scroll-mt-20">
          <div className="mb-8">
            <CyberDecryptedText
              text="PROJETOS EM DESTAQUE"
              tag="span"
              className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-semibold"
            />
            <CyberDecryptedText
              text="Engenharia, Pesquisa e Aplicações"
              tag="h2"
              className="font-display text-2xl sm:text-3xl font-bold text-white mt-1"
            />
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl font-sans">
              Projetos com código aberto no GitHub, validação prática e prototipação de sistemas.
            </p>
          </div>

          {/* BENTO GRID: FL-XAI (12 cols topo), Gambit (6 cols), GameHunter (6 cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Card 1: FL-XAI (Maior / Flagship) */}
            <div className="lg:col-span-12">
              <CompactProjectCard
                project={MAIN_PROJECTS[0]}
                variant="flagship"
                onOpenDetails={(p) => setActiveDrawerProject(p)}
                onOpenLightbox={(img) => setLightboxImage(img)}
              />
            </div>

            {/* Card 2: Gambit-Lab (6 cols - Simétrico) */}
            <div className="lg:col-span-6 flex">
              <CompactProjectCard
                project={MAIN_PROJECTS[1]}
                variant="medium"
                onOpenDetails={(p) => setActiveDrawerProject(p)}
                onOpenLightbox={(img) => setLightboxImage(img)}
              />
            </div>

            {/* Card 3: GameHunter (6 cols - Simétrico) */}
            <div className="lg:col-span-6 flex">
              <CompactProjectCard
                project={MAIN_PROJECTS[2]}
                variant="medium"
                onOpenDetails={(p) => setActiveDrawerProject(p)}
                onOpenLightbox={(img) => setLightboxImage(img)}
              />
            </div>
          </div>
        </section>

        {/* OUTROS PROJETOS & EXPERIMENTOS (FILEIRA COMPACTA DE CHIPS) */}
        <section className="py-6 px-6 sm:px-12 max-w-5xl mx-auto">
          <div className="cyber-card rounded-2xl p-5 border border-white/[0.08] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-semibold">
                OUTROS PROJETOS & EXPERIMENTOS
              </span>
              <a
                href={CONTACT_INFO.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-mono text-slate-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
              >
                <span>Ver todos no GitHub</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {OTHER_PROJECTS.map((proj) => (
                <a
                  key={proj.title}
                  href={proj.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-xl bg-black/40 border border-white/[0.06] hover:border-cyan-400/50 hover:bg-white/[0.02] transition-all flex items-center justify-between group cursor-pointer"
                >
                  <div className="pr-2 truncate">
                    <span className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors block truncate">
                      {proj.title}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400 block truncate">
                      {proj.category}
                    </span>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-cyan-300 shrink-0" />
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ARSENAL TECNOLÓGICO — RESTRIÇÃO INVIOLÁVEL (NÃO ALTERAR NADA) */}
        <section id="skills" className="py-16 px-6 sm:px-12 max-w-5xl mx-auto scroll-mt-20">
          <div className="mb-8">
            <CyberDecryptedText
              text="ARSENAL TECNOLÓGICO"
              tag="span"
              className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-semibold"
            />
            <CyberDecryptedText
              text="Conhecimentos Técnicos"
              tag="h2"
              className="font-display text-2xl sm:text-3xl font-bold text-white mt-1"
            />
            <p className="text-xs text-slate-400 mt-1">
              Tecnologias e ferramentas utilizadas em projetos de desenvolvimento e pesquisa.
            </p>
          </div>

          <TechSkillsLogos />
        </section>

        {/* FORMAÇÃO E EXPERIÊNCIA — GANTT HORIZONTAL DE DUAS FAIXAS */}
        <TimelineSection />

        {/* CONTATO COMPLETO */}
        <footer id="contato" className="pt-6 pb-20 px-6 sm:px-12 max-w-5xl mx-auto text-center scroll-mt-20">
          <div className="cyber-card rounded-3xl p-7 sm:p-10 border border-white/[0.08]">
            <CyberDecryptedText
              text="CONTATO & CONEXÃO"
              tag="span"
              className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-semibold"
            />
            <CyberDecryptedText
              text="Vamos conversar"
              tag="h2"
              className="font-display text-2xl sm:text-3xl font-bold text-white mt-1"
            />
            <p className="mt-2 max-w-xl mx-auto text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              {TARGET_COMPANY
                ? `Interessado em discutir Inteligência Artificial, Aprendizado Federado, arquitetura de sistemas ou a oportunidade no ${TARGET_COMPANY}? Meus canais estão abertos.`
                : 'Interessado em discutir Inteligência Artificial, Aprendizado Federado, arquitetura de sistemas ou oportunidades de estágio? Meus canais estão abertos.'}
            </p>

            {/* Contact Chips with Lucky interactive trigger */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <a
                href={CONTACT_INFO.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                data-contact-link="true"
                className="btn-cyber-primary px-4 py-2 rounded-xl text-xs flex items-center gap-2 font-mono group cursor-pointer"
              >
                <Linkedin className="w-4 h-4 text-cyan-300 group-hover:scale-110 transition-transform" />
                <span>LinkedIn</span>
              </a>

              <a
                href={CONTACT_INFO.github}
                target="_blank"
                rel="noopener noreferrer"
                data-contact-link="true"
                className="btn-cyber-ghost px-4 py-2 rounded-xl text-xs flex items-center gap-2 font-mono group cursor-pointer"
              >
                <Github className="w-4 h-4 text-slate-300 group-hover:text-cyan-300 group-hover:scale-110 transition-all" />
                <span>GitHub</span>
              </a>

              <a
                href={`mailto:${CONTACT_INFO.email}`}
                data-contact-link="true"
                className="btn-cyber-ghost px-4 py-2 rounded-xl text-xs flex items-center gap-2 font-mono group cursor-pointer"
              >
                <Mail className="w-4 h-4 text-rose-400 group-hover:scale-110 transition-transform" />
                <span>{CONTACT_INFO.email}</span>
              </a>
            </div>

            <div className="mt-8 pt-5 border-t border-white/[0.06] text-xs font-mono text-slate-400 flex flex-col sm:flex-row items-center justify-center gap-2">
              <span>Lucas de Souza Almeida · Engenharia de Software (UFC)</span>
            </div>
          </div>
        </footer>
      </main>

      {/* 5. PAINEL LATERAL "DETALHES" (DRAWER ACESSÍVEL) */}
      <ProjectDetailsDrawer
        project={activeDrawerProject}
        isOpen={Boolean(activeDrawerProject)}
        onClose={() => setActiveDrawerProject(null)}
        onOpenLightbox={(img) => setLightboxImage(img)}
      />

      {/* 6. FULL-SCREEN LIGHTBOX MODAL */}
      {lightboxImage && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Visualizador de imagem ampliada"
          className="fixed inset-0 z-[150] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer animate-fadeIn"
          onClick={() => setLightboxImage(null)}
        >
          <div className="relative max-w-5xl max-h-[90vh] flex flex-col items-center">
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute -top-10 right-0 text-white hover:text-cyan-400 p-2 text-xs font-mono flex items-center gap-1 cursor-pointer"
            >
              <X className="w-4 h-4" /> Fechar (ESC)
            </button>
            <img
              src={lightboxImage}
              alt="Captura ampliada do projeto"
              className="rounded-2xl border border-cyan-400/50 shadow-[0_0_50px_rgba(0,240,255,0.35)] max-h-[85vh] object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
