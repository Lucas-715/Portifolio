import React, { useEffect, useRef, useState } from 'react';
import {
  X,
  ExternalLink,
  Github,
  TrendingUp,
  Table as TableIcon,
  CheckCircle2,
  Clock,
  CircleDot,
  Terminal,
  Cpu,
  Activity,
  Maximize2,
} from 'lucide-react';
import { MainProject } from '../data/portfolioData';

// Real rounds data extracted from results/uci_seed_46/historico_validacao.csv
const REAL_ROUNDS_DATA = [
  { round: 1, central: 0.891, fedAvg: 0.405, fedProx: 0.389 },
  { round: 2, central: 0.940, fedAvg: 0.757, fedProx: 0.691 },
  { round: 3, central: 0.939, fedAvg: 0.823, fedProx: 0.806 },
  { round: 4, central: 0.924, fedAvg: 0.777, fedProx: 0.764 },
  { round: 5, central: 0.949, fedAvg: 0.891, fedProx: 0.886 },
  { round: 6, central: 0.953, fedAvg: 0.878, fedProx: 0.873 },
  { round: 7, central: 0.953, fedAvg: 0.811, fedProx: 0.813 },
  { round: 8, central: 0.953, fedAvg: 0.878, fedProx: 0.874 },
  { round: 9, central: 0.938, fedAvg: 0.914, fedProx: 0.911 },
  { round: 10, central: 0.939, fedAvg: 0.928, fedProx: 0.924 },
  { round: 11, central: 0.944, fedAvg: 0.908, fedProx: 0.904 },
  { round: 12, central: 0.947, fedAvg: 0.886, fedProx: 0.882 },
  { round: 13, central: 0.956, fedAvg: 0.927, fedProx: 0.923 },
  { round: 14, central: 0.941, fedAvg: 0.944, fedProx: 0.941 },
  { round: 15, central: 0.887, fedAvg: 0.942, fedProx: 0.939 },
];

interface ProjectDetailsDrawerProps {
  project: MainProject | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenLightbox?: (url: string) => void;
}

export const ProjectDetailsDrawer: React.FC<ProjectDetailsDrawerProps> = ({
  project,
  isOpen,
  onClose,
  onOpenLightbox,
}) => {
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const [flTab, setFlTab] = useState<'table' | 'chart'>('table');
  const [flScenario, setFlScenario] = useState<'natural' | 'severe'>('natural');
  const [activeGalleryIdx, setActiveGalleryIdx] = useState(0);

  // Focus trap & ESC listener
  useEffect(() => {
    if (!isOpen) return;

    // Save previous active element to restore focus on close
    const previousActiveElement = document.activeElement as HTMLElement | null;

    // Focus close button on open
    setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === 'Tab' && drawerRef.current) {
        const focusables = drawerRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;

        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    // Lock body scroll
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
      previousActiveElement?.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen || !project) return null;

  // SVG Chart calculation for FL-XAI
  const svgW = 460;
  const svgH = 140;
  const padX = 35;
  const padY = 16;
  const plotW = svgW - padX - 15;
  const plotH = svgH - padY - 20;

  const scaleX = (r: number) => padX + ((r - 1) / 14) * plotW;
  const scaleY = (v: number) => padY + (1 - (v - 0.35) / 0.65) * plotH;

  const buildPath = (key: 'central' | 'fedAvg' | 'fedProx') =>
    REAL_ROUNDS_DATA.map((d, i) => `${i === 0 ? 'M' : 'L'} ${scaleX(d.round).toFixed(1)} ${scaleY(d[key]).toFixed(1)}`).join(' ');

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="drawer-title"
      className="fixed inset-0 z-[120] flex justify-end"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity animate-fadeIn"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Container */}
      <div
        ref={drawerRef}
        className="relative z-10 w-full max-w-2xl h-full bg-[#070314] border-l border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.9)] flex flex-col justify-between overflow-hidden animate-slideInRight"
      >
        {/* Drawer Header */}
        <div className="p-6 border-b border-white/[0.08] flex items-center justify-between bg-black/40">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-500/15 border border-cyan-500/30 text-cyan-300">
                {project.statusBadge}
              </span>
              <span className="text-xs font-mono text-slate-400">
                {project.number} // Detalhes Técnicos
              </span>
            </div>
            <h2 id="drawer-title" className="font-display text-2xl font-bold text-white">
              {project.title}
            </h2>
          </div>

          <button
            ref={closeButtonRef}
            onClick={onClose}
            aria-label="Fechar painel de detalhes"
            className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer border border-white/10 focus-visible:ring-2 focus-visible:ring-cyan-400"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Drawer Scrollable Body */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 [&_img]:max-w-full [&_*]:min-w-0 space-y-6 text-slate-200">
          {/* Summary & Proof Line */}
          <div className="p-4 rounded-2xl bg-black/50 border border-white/[0.08] space-y-2">
            <p className="text-sm font-sans text-slate-200 leading-relaxed">
              {project.summary}
            </p>
            <div className="pt-2 border-t border-white/[0.06] flex items-center gap-2 text-xs font-mono text-cyan-300 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span>{project.proofLine}</span>
            </div>
          </div>

          {/* Screenshot Showcase inside Drawer */}
          {project.screenshots && project.screenshots.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase text-slate-400 block font-semibold">
                Capturas de Tela do Repositório ({project.screenshots.length})
              </span>
              <div
                className="relative rounded-xl overflow-hidden border border-white/10 aspect-video bg-black cursor-pointer group"
                onClick={() => onOpenLightbox?.(project.screenshots[activeGalleryIdx].url)}
              >
                <img
                  src={project.screenshots[activeGalleryIdx].url}
                  alt={project.screenshots[activeGalleryIdx].title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs font-mono text-cyan-200 font-semibold truncate pr-2">
                      {project.screenshots[activeGalleryIdx].title}
                    </span>
                    <span className="p-1 rounded-md bg-black/60 text-white flex items-center gap-1 text-[11px] font-mono">
                      <Maximize2 className="w-3 h-3 text-cyan-300" aria-hidden="true" /> Ampliar
                    </span>
                  </div>
                </div>
              </div>

          {/* Thumbnails */}
          <div className="flex flex-wrap gap-2">
            {project.screenshots.map((s, idx) => (
              <button
                key={s.url}
                onClick={() => setActiveGalleryIdx(idx)}
                aria-label={`Ver captura ${idx + 1}: ${s.title}`}
                className={`flex-1 min-w-[130px] p-1.5 rounded-lg border text-left transition-all cursor-pointer ${activeGalleryIdx === idx
                    ? 'border-cyan-400 bg-cyan-500/20 text-cyan-200 font-bold'
                    : 'border-white/10 bg-black/40 text-slate-400 hover:text-slate-200'
                  }`}
              >
                <span className="block text-xs font-mono truncate">
                  {idx + 1}. {s.title.split('(')[0]}
                </span>
              </button>
            ))}
          </div>
            </div>
          )}

          {/* Problema Investigado */}
          <div className="p-4 rounded-2xl bg-black/40 border border-white/[0.06] space-y-1">
            <span className="text-xs font-mono uppercase text-slate-400 block font-semibold">
              Problema Investigado
            </span>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
              {project.problem}
            </p>
          </div>

          {/* Abordagem & Metodologia */}
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase text-cyan-400 block font-bold">
              {project.approachTitle}
            </span>
            <div className="space-y-1.5 text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              {project.approach.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>

          {/* Minha Contribuição Individual & Decisões Técnicas */}
          {project.myContribution && project.myContribution.length > 0 && (
            <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-mono uppercase text-cyan-300 font-bold">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" aria-hidden="true" />
                <span>Minha Contribuição & Decisões de Engenharia</span>
              </div>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-200 font-sans leading-relaxed">
                {project.myContribution.map((contrib, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-cyan-400 font-mono text-xs mt-0.5 shrink-0" aria-hidden="true">▸</span>
                    <span>{contrib}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 1. SE FOR FEDERATED-XAI-LAB: TABELA / CURVA / NOTA ESTATÍSTICA / XAI */}
          {project.id === 'federated-xai-lab' && (
            <div className="space-y-4 pt-2 border-t border-white/[0.08]">
              {/* Highlight Metric Box */}
              <div className="p-4 rounded-xl bg-black/60 border border-cyan-500/40">
                <div className="flex items-center justify-between text-xs font-mono text-slate-300 mb-1">
                  <span>
                    {flScenario === 'natural'
                      ? 'Particionamento Natural (6 clientes)'
                      : 'Não-IID Severo (Dirichlet α=0,15)'}
                  </span>
                  <span className="text-cyan-300 font-semibold">9 Indivíduos Não Vistos</span>
                </div>
                <div className="text-2xl font-display font-bold text-white">
                  Macro-F1: {flScenario === 'natural' ? '0,9270' : '0,8637'}{' '}
                  <span className="text-sm font-mono text-cyan-300 font-normal">
                    ± {flScenario === 'natural' ? '0,0089' : '0,0739'}
                  </span>
                </div>
                <div className="text-xs text-slate-400 mt-1 font-mono">
                  5 sementes (42–46) · 6 clientes · 15 rodadas de comunicação
                </div>
              </div>

              {/* Single Clean Tab Set with Full Untruncated Labels */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setFlTab('table')}
                    className={`px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${flTab === 'table'
                        ? 'bg-cyan-500/25 text-cyan-200 border border-cyan-400/50 font-bold'
                        : 'text-slate-400 hover:text-white border border-transparent'
                      }`}
                  >
                    <TableIcon className="w-3.5 h-3.5 text-cyan-400" aria-hidden="true" />
                    <span>Tabela de Resultados</span>
                  </button>
                  <button
                    onClick={() => setFlTab('chart')}
                    className={`px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${flTab === 'chart'
                        ? 'bg-cyan-500/25 text-cyan-200 border border-cyan-400/50 font-bold'
                        : 'text-slate-400 hover:text-white border border-transparent'
                      }`}
                  >
                    <TrendingUp className="w-3.5 h-3.5 text-cyan-400" aria-hidden="true" />
                    <span>Curva de Convergência (15 Rodadas)</span>
                  </button>
                </div>

                {/* Scenario Toggle */}
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400">Cenário:</span>
                  <button
                    onClick={() => setFlScenario('natural')}
                    className={`px-2 py-0.5 rounded text-xs transition-colors cursor-pointer ${flScenario === 'natural'
                        ? 'bg-white/10 text-cyan-300 border border-cyan-400/40 font-bold'
                        : 'text-slate-400 hover:text-slate-200 border border-transparent'
                      }`}
                  >
                    Natural
                  </button>
                  <button
                    onClick={() => setFlScenario('severe')}
                    className={`px-2 py-0.5 rounded text-xs transition-colors cursor-pointer ${flScenario === 'severe'
                        ? 'bg-white/10 text-cyan-300 border border-cyan-400/40 font-bold'
                        : 'text-slate-400 hover:text-slate-200 border border-transparent'
                      }`}
                  >
                    Dirichlet α=0,15
                  </button>
                </div>
              </div>

              {/* Table or Chart View */}
              {flTab === 'table' ? (
                <div className="rounded-xl border border-white/10 overflow-x-auto max-w-full">
                  <table className="min-w-full text-xs font-mono text-left">
                    <thead className="bg-black/80 text-slate-300 uppercase text-[10px] border-b border-white/10">
                      <tr>
                        <th className="py-2.5 px-3">Abordagem</th>
                        <th className="py-2.5 px-3 text-cyan-300">Macro-F1</th>
                        <th className="py-2.5 px-3">Acurácia</th>
                        <th className="py-2.5 px-3">Cosseno XAI</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 bg-black/40 text-slate-200">
                      {flScenario === 'natural' ? (
                        <>
                          <tr>
                            <td className="py-2.5 px-3 font-semibold text-slate-400">Centralizado</td>
                            <td className="py-2.5 px-3 font-bold text-white">0,8955 ± 0,0728</td>
                            <td className="py-2.5 px-3">90,34 ± 5,74%</td>
                            <td className="py-2.5 px-3 text-slate-500">—</td>
                          </tr>
                          <tr className="bg-cyan-500/[0.08]">
                            <td className="py-2.5 px-3 font-semibold text-cyan-300">FedAvg</td>
                            <td className="py-2.5 px-3 font-bold text-cyan-300">0,9270 ± 0,0089</td>
                            <td className="py-2.5 px-3">92,81 ± 0,92%</td>
                            <td className="py-2.5 px-3 text-cyan-300">0,892 ± 0,031</td>
                          </tr>
                          <tr>
                            <td className="py-2.5 px-3 font-semibold text-fuchsia-300">FedProx (μ=0,3)</td>
                            <td className="py-2.5 px-3 font-bold text-white">0,9233 ± 0,0109</td>
                            <td className="py-2.5 px-3">92,45 ± 1,10%</td>
                            <td className="py-2.5 px-3 text-fuchsia-300">0,887 ± 0,028</td>
                          </tr>
                        </>
                      ) : (
                        <>
                          <tr>
                            <td className="py-2.5 px-3 font-semibold text-slate-400">Centralizado</td>
                            <td className="py-2.5 px-3 font-bold text-white">0,8955 ± 0,0728</td>
                            <td className="py-2.5 px-3">90,34 ± 5,74%</td>
                            <td className="py-2.5 px-3 text-slate-500">—</td>
                          </tr>
                          <tr className="bg-cyan-500/[0.08]">
                            <td className="py-2.5 px-3 font-semibold text-cyan-300">FedAvg</td>
                            <td className="py-2.5 px-3 font-bold text-cyan-300">0,8637 ± 0,0739</td>
                            <td className="py-2.5 px-3">87,52 ± 5,50%</td>
                            <td className="py-2.5 px-3 text-cyan-300">0,614 ± 0,052</td>
                          </tr>
                          <tr>
                            <td className="py-2.5 px-3 font-semibold text-fuchsia-300">FedProx (μ=0,3)</td>
                            <td className="py-2.5 px-3 font-bold text-white">0,8613 ± 0,0705</td>
                            <td className="py-2.5 px-3">87,24 ± 5,24%</td>
                            <td className="py-2.5 px-3 text-fuchsia-300">0,608 ± 0,049</td>
                          </tr>
                        </>
                      )}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-black/60 border border-white/10 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-300">
                    <span>Evolução de Macro-F1 por Rodada (1 a 15)</span>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <span className="w-2.5 h-0.5 bg-cyan-400 inline-block" /> FedAvg
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-2.5 h-0.5 bg-fuchsia-400 inline-block" /> FedProx
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-2.5 h-0.5 bg-slate-400 inline-block border-t border-dashed" /> Central
                      </span>
                    </div>
                  </div>

                  <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full h-28 overflow-visible">
                    {[0.4, 0.6, 0.8, 1.0].map((val) => (
                      <g key={val}>
                        <line
                          x1={padX}
                          y1={scaleY(val)}
                          x2={svgW - 15}
                          y2={scaleY(val)}
                          stroke="rgba(255,255,255,0.08)"
                          strokeDasharray="2,2"
                        />
                        <text
                          x={padX - 6}
                          y={scaleY(val) + 3}
                          fill="#94a3b8"
                          fontSize="9"
                          fontFamily="monospace"
                          textAnchor="end"
                        >
                          {val.toFixed(1)}
                        </text>
                      </g>
                    ))}

                    {[1, 5, 10, 15].map((r) => (
                      <text
                        key={r}
                        x={scaleX(r)}
                        y={svgH - 4}
                        fill="#94a3b8"
                        fontSize="9"
                        fontFamily="monospace"
                        textAnchor="middle"
                      >
                        R{r}
                      </text>
                    ))}

                    <path
                      d={buildPath('central')}
                      fill="none"
                      stroke="#94a3b8"
                      strokeWidth="1.6"
                      strokeDasharray="4,3"
                    />
                    <path
                      d={buildPath('fedProx')}
                      fill="none"
                      stroke="#d946ef"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d={buildPath('fedAvg')}
                      fill="none"
                      stroke="#00f0ff"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              )}

              {/* Statistical Note (Versão curta sem Wilcoxon) */}
              <p className="text-xs font-mono text-slate-300 leading-relaxed italic bg-black/40 p-3 rounded-xl border border-white/5">
                {flScenario === 'natural' ? '* Nota estatística (cenário natural): FedAvg × FedProx sem evidência de diferença (5 sementes; teste pareado t de Student com p = 0,0184 e correção de Bonferroni com limiar de 0,0125). Centralizado apresentou maior variância entre sementes. Detalhamento completo no README.' : '* Nota estatística: o teste pareado (p = 0,0184; Bonferroni 0,0125) refere-se ao cenário natural. Para Dirichlet (α = 0,15), consulte o detalhamento no README.'}
              </p>

              {/* Integrated Gradients (XAI) Box */}
              <div className="p-4 rounded-xl bg-black/40 border border-white/10 text-xs text-slate-200 leading-relaxed font-sans">
                <div className="flex items-center justify-between text-xs font-mono font-bold text-cyan-300 mb-1">
                  <span>Integrated Gradients (XAI):</span>
                  <span className="text-xs text-slate-300">
                    {flScenario === 'natural'
                      ? 'Similaridade de Cosseno: 0,892 ± 0,031'
                      : 'Similaridade de Cosseno: 0,614 ± 0,052'}
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  {flScenario === 'natural'
                    ? 'Similaridade de cosseno (0 a 1) entre os vetores de atribuição do Integrated Gradients locais e globais. No particionamento natural por voluntário, o valor de 0,892 indica explicações bem alinhadas.'
                    : 'Mesma métrica (cosseno entre atribuições locais e globais). Em heterogeneidade severa via Dirichlet (α = 0,15), o valor cai para 0,614, com clientes divergindo ao priorizar canais pontuais de sensores.'}
                </p>
              </div>
            </div>
          )}

          {/* 2. SE FOR GAMBIT-LAB OU GAMEHUNTER: PILARES ARQUITETURAIS */}
          {project.pillars && project.pillars.length > 0 && (
            <div className="space-y-3 pt-2 border-t border-white/[0.08]">
              <span className="text-xs font-mono uppercase text-slate-400 block font-semibold">
                Eixos da Arquitetura & Status de Implementação
              </span>
              <div className="space-y-2.5">
                {project.pillars.map((pillar) => (
                  <div
                    key={pillar.title}
                    className="p-3.5 rounded-xl bg-black/40 border border-white/[0.08] space-y-1"
                  >
                    <div className="flex items-center justify-between text-xs font-mono font-bold">
                      <span className="text-white">{pillar.title}</span>
                      <span
                        className={`text-[11px] px-2 py-0.5 rounded flex items-center gap-1 ${pillar.status === 'implementado'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : pillar.status === 'em_andamento'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                              : 'bg-white/[0.05] text-slate-400 border border-white/10'
                          }`}
                      >
                        {pillar.status === 'implementado' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />}
                        {pillar.status === 'em_andamento' && <Clock className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />}
                        {pillar.status === 'planejado' && <CircleDot className="w-3.5 h-3.5 text-slate-400" />}
                        <span>{pillar.statusLabel}</span>
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed font-sans">
                      {pillar.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tecnologias Utilizadas */}
          <div className="pt-2 border-t border-white/[0.08]">
            <span className="text-xs font-mono uppercase text-slate-400 block mb-2 font-semibold">
              Tecnologias & Ferramentas
            </span>
            <div className="flex flex-wrap gap-1.5">
              {project.technologies.map((t) => (
                <span
                  key={t}
                  className="px-2.5 py-1 rounded-lg text-xs font-mono bg-white/[0.04] border border-white/[0.08] text-slate-300"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Drawer Footer Actions */}
        <div className="p-4 sm:p-6 border-t border-white/[0.08] bg-black/50 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-cyber-primary px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 font-mono font-bold"
            >
              <Github className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Ver no GitHub</span>
            </a>

            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-cyber-ghost px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 border border-cyan-500/30 text-cyan-200 font-mono"
              >
                <ExternalLink className="w-3.5 h-3.5 text-cyan-400" aria-hidden="true" />
                <span>{project.demoLabel || 'Ver Demonstração'}</span>
              </a>
            )}
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-mono text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

