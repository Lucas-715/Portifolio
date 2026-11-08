import React, { useState } from 'react';
import {
  Activity,
  Terminal,
  Cpu,
  CheckCircle2,
  Clock,
  CircleDot,
  TrendingUp,
  Table as TableIcon,
  Maximize2,
  X,
  ExternalLink,
} from 'lucide-react';
import { MAIN_PROJECTS, ProjectScreenshot } from '../data/portfolioData';

// Real rounds data extracted from results/uci_seed_46/historico_validacao.csv (Participantes naturais)
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

interface ScreenshotGalleryProps {
  screenshots: ProjectScreenshot[];
  activeIdx: number;
  onSelect: (idx: number) => void;
  onEnlarge: (url: string) => void;
  accentColor?: string;
}

const ScreenshotGallery: React.FC<ScreenshotGalleryProps> = ({
  screenshots,
  activeIdx,
  onSelect,
  onEnlarge,
  accentColor = 'cyan',
}) => {
  if (!screenshots || screenshots.length === 0) return null;
  const current = screenshots[activeIdx] || screenshots[0];

  const borderAccent =
    accentColor === 'violet'
      ? 'border-violet-500/40 hover:border-violet-400'
      : accentColor === 'emerald'
      ? 'border-emerald-500/40 hover:border-emerald-400'
      : 'border-cyan-500/40 hover:border-cyan-400';

  const glowShadow =
    accentColor === 'violet'
      ? 'shadow-[0_0_25px_rgba(189,0,255,0.2)]'
      : accentColor === 'emerald'
      ? 'shadow-[0_0_25px_rgba(16,185,129,0.2)]'
      : 'shadow-[0_0_25px_rgba(0,240,255,0.2)]';

  const activePill =
    accentColor === 'violet'
      ? 'border-violet-400 bg-violet-500/20 text-violet-200'
      : accentColor === 'emerald'
      ? 'border-emerald-400 bg-emerald-500/20 text-emerald-200'
      : 'border-cyan-400 bg-cyan-500/20 text-cyan-200';

  return (
    <div className="space-y-2.5">
      {/* Featured Screenshot Container */}
      <div
        className={`relative group rounded-xl overflow-hidden border ${borderAccent} bg-black/80 aspect-video flex items-center justify-center cursor-pointer transition-all ${glowShadow}`}
        onClick={() => onEnlarge(current.url)}
        title="Clique para ampliar em tela cheia"
      >
        <img
          src={current.url}
          alt={current.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Caption Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex items-end p-3 pointer-events-none">
          <div className="flex items-center justify-between w-full">
            <span className="text-xs font-mono font-semibold text-white drop-shadow truncate pr-2">
              {current.title}
            </span>
            <span className="px-2 py-1 rounded-md bg-black/70 text-cyan-300 text-[10px] font-mono border border-white/10 flex items-center gap-1 group-hover:bg-cyan-500/30 group-hover:text-white transition-colors">
              <Maximize2 className="w-3 h-3" />
              <span>Ampliar</span>
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Thumbnail Buttons */}
      <div className="grid grid-cols-3 gap-1.5">
        {screenshots.map((s, idx) => (
          <button
            key={s.url}
            type="button"
            onClick={() => onSelect(idx)}
            className={`p-1.5 rounded-lg border text-left transition-all cursor-pointer ${
              activeIdx === idx
                ? `${activePill} font-bold shadow-[0_0_10px_rgba(0,240,255,0.15)]`
                : 'border-white/10 bg-black/40 hover:border-white/20 text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="block text-[11px] font-mono truncate">
              {idx + 1}. {s.title.split('(')[0].replace('Dashboard de ', '').replace('Workspace Nocturne: ', '')}
            </span>
          </button>
        ))}
      </div>

      {/* Screenshot Description */}
      <p className="text-[11px] text-slate-300 font-sans italic leading-relaxed px-0.5">
        {current.description}
      </p>
    </div>
  );
};

export const ProjectMockup: React.FC<{ projectId: string }> = ({ projectId }) => {
  const [metricTab, setMetricTab] = useState<'table' | 'chart'>('table');
  const [scenario, setScenario] = useState<'natural' | 'severe'>('natural');
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [enlargedPhoto, setEnlargedPhoto] = useState<string | null>(null);

  const project = MAIN_PROJECTS.find((p) => p.id === projectId);
  const screenshots = project?.screenshots || [];

  // ==========================================
  // 1. FEDERATED-XAI-LAB MOCKUP
  // ==========================================
  if (projectId === 'federated-xai-lab') {
    const svgW = 440;
    const svgH = 130;
    const padX = 35;
    const padY = 16;
    const plotW = svgW - padX - 15;
    const plotH = svgH - padY - 20;

    const scaleX = (r: number) => padX + ((r - 1) / 14) * plotW;
    const scaleY = (v: number) => padY + (1 - (v - 0.35) / 0.65) * plotH;

    const buildPath = (key: 'central' | 'fedAvg' | 'fedProx') =>
      REAL_ROUNDS_DATA.map((d, i) => `${i === 0 ? 'M' : 'L'} ${scaleX(d.round).toFixed(1)} ${scaleY(d[key]).toFixed(1)}`).join(' ');

    return (
      <div className="cyber-card rounded-2xl p-6 border border-white/[0.08] flex flex-col justify-between h-full space-y-4">
        {/* Lightbox Modal */}
        {enlargedPhoto && (
          <div
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
            onClick={() => setEnlargedPhoto(null)}
          >
            <div className="relative max-w-4xl max-h-[90vh] flex flex-col items-center">
              <button
                onClick={() => setEnlargedPhoto(null)}
                className="absolute -top-10 right-0 text-white hover:text-cyan-400 p-2 text-sm font-mono flex items-center gap-1 cursor-pointer"
              >
                <X className="w-5 h-5" /> Fechar
              </button>
              <img
                src={enlargedPhoto}
                alt="Captura ampliada do projeto"
                className="rounded-xl border border-cyan-400/50 shadow-[0_0_40px_rgba(0,240,255,0.3)] max-h-[80vh] object-contain"
              />
            </div>
          </div>
        )}

        <div className="space-y-4">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/[0.08] text-xs font-mono">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span className="text-white font-bold tracking-wider">fl-xai // evidências do repo</span>
            </div>
            <span className="text-cyan-300 font-bold px-2 py-0.5 rounded bg-cyan-500/15 border border-cyan-500/30">
              FRAMEWORK EXPERIMENTAL
            </span>
          </div>

          {/* 1. VISUAL SCREENSHOT SHOWCASE (SEMPRE VISÍVEL NO TOPO) */}
          <ScreenshotGallery
            screenshots={screenshots}
            activeIdx={activePhotoIdx}
            onSelect={setActivePhotoIdx}
            onEnlarge={setEnlargedPhoto}
            accentColor="cyan"
          />

          {/* 2. HIGHLIGHT METRIC CARD */}
          <div className="p-3.5 rounded-xl bg-black/60 border border-cyan-500/35">
            <div className="flex items-center justify-between text-xs font-mono text-slate-300 mb-1">
              <span>{scenario === 'natural' ? 'Particionamento Natural (6 clientes)' : 'Não-IID Severo (Dirichlet α=0,15)'}</span>
              <span className="text-cyan-300 font-semibold">9 Indivíduos Não Vistos</span>
            </div>
            <div className="text-2xl sm:text-3xl font-display font-bold text-white">
              Macro-F1: {scenario === 'natural' ? '0,9270' : '0,8637'}{' '}
              <span className="text-sm font-mono text-cyan-300 font-normal">
                ± {scenario === 'natural' ? '0,0089' : '0,0739'}
              </span>
            </div>
            <div className="text-xs text-slate-300 mt-1 font-mono">
              5 sementes (42–46) · 6 clientes · 15 rodadas de comunicação
            </div>
          </div>

          {/* Sub-tab switcher: Tabela vs Curva de Convergência */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setMetricTab('table')}
                className={`px-2.5 py-1 rounded text-xs transition-all cursor-pointer flex items-center gap-1.5 ${
                  metricTab === 'table'
                    ? 'bg-cyan-500/25 text-cyan-200 border border-cyan-400/50 font-bold'
                    : 'text-slate-400 hover:text-white border border-transparent'
                }`}
              >
                <TableIcon className="w-3 h-3 text-cyan-400" />
                <span>Tabela</span>
              </button>
              <button
                onClick={() => setMetricTab('chart')}
                className={`px-2.5 py-1 rounded text-xs transition-all cursor-pointer flex items-center gap-1.5 ${
                  metricTab === 'chart'
                    ? 'bg-cyan-500/25 text-cyan-200 border border-cyan-400/50 font-bold'
                    : 'text-slate-400 hover:text-white border border-transparent'
                }`}
              >
                <TrendingUp className="w-3 h-3 text-cyan-400" />
                <span>Curva (15 Rodadas)</span>
              </button>
            </div>

            {/* Scenario toggle */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-slate-400">Cenário:</span>
              <button
                onClick={() => setScenario('natural')}
                className={`px-2 py-0.5 rounded text-[11px] transition-colors cursor-pointer ${
                  scenario === 'natural'
                    ? 'bg-white/10 text-cyan-300 border border-cyan-400/40 font-bold'
                    : 'text-slate-400 hover:text-slate-200 border border-transparent'
                }`}
              >
                Natural
              </button>
              <button
                onClick={() => setScenario('severe')}
                className={`px-2 py-0.5 rounded text-[11px] transition-colors cursor-pointer ${
                  scenario === 'severe'
                    ? 'bg-white/10 text-cyan-300 border border-cyan-400/40 font-bold'
                    : 'text-slate-400 hover:text-slate-200 border border-transparent'
                }`}
              >
                Dirichlet α=0,15
              </button>
            </div>
          </div>

          {/* Table or Chart View */}
          {metricTab === 'table' ? (
            <div className="rounded-xl border border-white/10 overflow-hidden">
              <table className="w-full text-xs font-mono text-left">
                <thead className="bg-black/80 text-slate-300 uppercase text-[10px] border-b border-white/10">
                  <tr>
                    <th className="py-2 px-3">Modelo</th>
                    <th className="py-2 px-3 text-cyan-300">Macro-F1</th>
                    <th className="py-2 px-3">Acurácia</th>
                    <th className="py-2 px-3">Cosseno XAI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 bg-black/40 text-slate-200">
                  {scenario === 'natural' ? (
                    <>
                      <tr>
                        <td className="py-2 px-3 font-semibold text-slate-400">Centralizado</td>
                        <td className="py-2 px-3 font-bold text-white">0,8955 ± 0,0728</td>
                        <td className="py-2 px-3">90,34 ± 5,74%</td>
                        <td className="py-2 px-3 text-slate-500">—</td>
                      </tr>
                      <tr className="bg-cyan-500/[0.06]">
                        <td className="py-2 px-3 font-semibold text-cyan-300">FedAvg</td>
                        <td className="py-2 px-3 font-bold text-cyan-300">0,9270 ± 0,0089</td>
                        <td className="py-2 px-3">92,81 ± 0,92%</td>
                        <td className="py-2 px-3 text-cyan-300">0,892 ± 0,031</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-semibold text-fuchsia-300">FedProx (μ=0,3)</td>
                        <td className="py-2 px-3 font-bold text-white">0,9233 ± 0,0109</td>
                        <td className="py-2 px-3">92,45 ± 1,10%</td>
                        <td className="py-2 px-3 text-fuchsia-300">0,887 ± 0,028</td>
                      </tr>
                    </>
                  ) : (
                    <>
                      <tr>
                        <td className="py-2 px-3 font-semibold text-slate-400">Centralizado</td>
                        <td className="py-2 px-3 font-bold text-white">0,8955 ± 0,0728</td>
                        <td className="py-2 px-3">90,34 ± 5,74%</td>
                        <td className="py-2 px-3 text-slate-500">—</td>
                      </tr>
                      <tr className="bg-cyan-500/[0.06]">
                        <td className="py-2 px-3 font-semibold text-cyan-300">FedAvg</td>
                        <td className="py-2 px-3 font-bold text-cyan-300">0,8637 ± 0,0739</td>
                        <td className="py-2 px-3">87,52 ± 5,50%</td>
                        <td className="py-2 px-3 text-cyan-300">0,614 ± 0,052</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-semibold text-fuchsia-300">FedProx (μ=0,3)</td>
                        <td className="py-2 px-3 font-bold text-white">0,8613 ± 0,0705</td>
                        <td className="py-2 px-3">87,24 ± 5,24%</td>
                        <td className="py-2 px-3 text-fuchsia-300">0,608 ± 0,049</td>
                      </tr>
                    </>
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-black/60 border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-300">
                <span>Evolução de Macro-F1 (Rodadas 1 a 15)</span>
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

              <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full h-24 overflow-visible">
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

          {/* Technical Note */}
          <p className="text-[11px] font-mono text-slate-300 leading-relaxed italic">
            * Nota: Diferença FedAvg × FedProx dentro do desvio padrão (5 sementes; teste pareado t de Student com p = 0,0184 nominal e teste de Wilcoxon com p = 0,0625, sem evidência de diferença após correção de Bonferroni com limiar de 0,0125). Centralizado apresentou maior variância entre sementes.
          </p>

          {/* Explainability Metric Box */}
          <div className="p-3 rounded-xl bg-black/40 border border-white/10 text-xs text-slate-200 leading-relaxed font-sans">
            <div className="flex items-center justify-between text-xs font-mono font-bold text-cyan-300 mb-0.5">
              <span>Integrated Gradients (XAI):</span>
              <span className="text-xs text-slate-300">
                {scenario === 'natural' ? 'Cosseno: 0,892 ± 0,031' : 'Cosseno: 0,614 ± 0,052'}
              </span>
            </div>
            <p className="text-[11px] text-slate-300">
              {scenario === 'natural'
                ? 'No particionamento natural por voluntário, os modelos federados mantêm alta estabilidade explicativa, com concordância de 89,2% entre vetores de atribuição locais e globais.'
                : 'Em heterogeneidade severa via Dirichlet (α = 0,15), a concordância cai para 61,4%, com clientes divergindo ao priorizar canais pontuais de sensores.'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // 2. GAMBIT-LAB MOCKUP
  // ==========================================
  if (projectId === 'gambit-lab') {
    return (
      <div className="cyber-card rounded-2xl p-6 border border-white/[0.08] flex flex-col justify-between h-full space-y-4">
        {/* Lightbox Modal */}
        {enlargedPhoto && (
          <div
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
            onClick={() => setEnlargedPhoto(null)}
          >
            <div className="relative max-w-4xl max-h-[90vh] flex flex-col items-center">
              <button
                onClick={() => setEnlargedPhoto(null)}
                className="absolute -top-10 right-0 text-white hover:text-cyan-400 p-2 text-sm font-mono flex items-center gap-1 cursor-pointer"
              >
                <X className="w-5 h-5" /> Fechar
              </button>
              <img
                src={enlargedPhoto}
                alt="Captura ampliada do Gambit-Lab"
                className="rounded-xl border border-violet-400/50 shadow-[0_0_40px_rgba(189,0,255,0.3)] max-h-[80vh] object-contain"
              />
            </div>
          </div>
        )}

        <div className="space-y-4">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/[0.08] text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-violet-400 shadow-[0_0_8px_#bd00ff]" />
              <span className="text-white font-bold tracking-wider">gambit-lab // arquitetura & telas</span>
            </div>
            <span className="text-amber-300 font-bold px-2 py-0.5 rounded bg-amber-500/15 border border-amber-500/30">
              PROTÓTIPO
            </span>
          </div>

          {/* 1. VISUAL SCREENSHOT SHOWCASE (SEMPRE VISÍVEL NO TOPO) */}
          <ScreenshotGallery
            screenshots={screenshots}
            activeIdx={activePhotoIdx}
            onSelect={setActivePhotoIdx}
            onEnlarge={setEnlargedPhoto}
            accentColor="violet"
          />

          {/* 2. 3 CORE DECOUPLED AXES PILLARS */}
          <div className="space-y-2.5 text-xs font-mono">
            {/* Axis 1 */}
            <div className="p-3 rounded-xl bg-black/40 border border-emerald-500/30">
              <div className="text-emerald-300 font-bold mb-0.5 flex items-center justify-between">
                <span>01. VALIDADE FORMAL (REGRAS)</span>
                <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono flex items-center gap-1 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ✓ implementado
                </span>
              </div>
              <p className="text-slate-300 leading-relaxed font-sans text-xs">
                Ações restritas por transições canônicas de estado (Xadrez e Go). O LLM não pode inventar lances ou violar invariantes do tabuleiro.
              </p>
            </div>

            {/* Axis 2 */}
            <div className="p-3 rounded-xl bg-black/40 border border-amber-500/30">
              <div className="text-amber-300 font-bold mb-0.5 flex items-center justify-between">
                <span>02. DINÂMICA DE DEBATE</span>
                <span className="text-[11px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono flex items-center gap-1 font-bold">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  ◐ em andamento
                </span>
              </div>
              <p className="text-slate-300 leading-relaxed font-sans text-xs">
                Agente Proponente submete hipóteses estruturadas; Agente Crítico testa contradições e fragilidades lógicas em rodadas delimitadas.
              </p>
            </div>

            {/* Axis 3 */}
            <div className="p-3 rounded-xl bg-black/40 border border-fuchsia-500/30">
              <div className="text-fuchsia-300 font-bold mb-0.5 flex items-center justify-between">
                <span>03. AUDITORIA FACTUAL INDEPENDENTE</span>
                <span className="text-[11px] px-2 py-0.5 rounded bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/40 font-mono flex items-center gap-1 font-bold">
                  <CircleDot className="w-3.5 h-3.5 text-fuchsia-400" />
                  ○ planejado
                </span>
              </div>
              <p className="text-slate-300 leading-relaxed font-sans text-xs">
                Avaliação desacoplada da eloquência retórica: argumentos gerados são persistidos e cruzados contra a base relacional de evidências.
              </p>
            </div>
          </div>

          {/* Status Trace Pill */}
          <div className="p-3 rounded-xl bg-black/60 border border-white/10 font-mono text-xs flex items-center justify-between text-slate-300">
            <span className="flex items-center gap-1.5 text-violet-300 font-semibold">
              <Terminal className="w-4 h-4 text-violet-400" /> MOTOR: FastAPI + SQLite
            </span>
            <span className="text-slate-400">Rastreamento SHA-256</span>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // 3. GAMEHUNTER MOCKUP
  // ==========================================
  return (
    <div className="cyber-card rounded-2xl p-6 border border-white/[0.08] flex flex-col justify-between h-full space-y-4">
      {/* Lightbox Modal */}
      {enlargedPhoto && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setEnlargedPhoto(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] flex flex-col items-center">
            <button
              onClick={() => setEnlargedPhoto(null)}
              className="absolute -top-10 right-0 text-white hover:text-cyan-400 p-2 text-sm font-mono flex items-center gap-1 cursor-pointer"
            >
              <X className="w-5 h-5" /> Fechar
            </button>
            <img
              src={enlargedPhoto}
              alt="Captura ampliada do GameHunter"
              className="rounded-xl border border-emerald-400/50 shadow-[0_0_40px_rgba(16,185,129,0.3)] max-h-[80vh] object-contain"
            />
          </div>
        </div>
      )}

      <div className="space-y-4">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/[0.08] text-xs font-mono">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-emerald-400" />
            <span className="text-white font-bold tracking-wider">gamehunter // interface & telas</span>
          </div>
          <span className="text-emerald-300 font-bold px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30">
            PROTÓTIPO AVANÇADO
          </span>
        </div>

        {/* 1. VISUAL SCREENSHOT SHOWCASE (SEMPRE VISÍVEL NO TOPO) */}
        <ScreenshotGallery
          screenshots={screenshots}
          activeIdx={activePhotoIdx}
          onSelect={setActivePhotoIdx}
          onEnlarge={setEnlargedPhoto}
          accentColor="emerald"
        />

        {/* 2. 3 EXPLICIT STATUS PILLARS */}
        <div className="space-y-2.5 text-xs font-mono">
          <div className="p-3 rounded-xl bg-black/40 border border-emerald-500/30">
            <div className="text-emerald-300 font-bold mb-0.5 flex items-center justify-between">
              <span>01. ROTAS & TELAS (DEMONSTRAÇÃO)</span>
              <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ✓ implementado
              </span>
            </div>
            <p className="text-xs text-slate-300 font-sans">
              Catálogo de jogos, busca e wishlist 100% navegáveis com dados de demonstração.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-black/40 border border-amber-500/30">
            <div className="text-amber-300 font-bold mb-0.5 flex items-center justify-between">
              <span>02. PERSISTÊNCIA & SESSÕES</span>
              <span className="text-[11px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1 font-bold">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                ◐ em andamento
              </span>
            </div>
            <p className="text-xs text-slate-300 font-sans">
              Modelagem relacional via Prisma e SQLite e sessões de usuários com NextAuth.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-black/40 border border-slate-700/60">
            <div className="text-slate-300 font-bold mb-0.5 flex items-center justify-between">
              <span>03. PAGAMENTOS: FORA DO ESCOPO</span>
              <span className="text-[11px] px-2 py-0.5 rounded bg-white/[0.05] text-slate-400 border border-white/10 flex items-center gap-1">
                <CircleDot className="w-3.5 h-3.5 text-slate-400" />
                ○ fora do escopo
              </span>
            </div>
            <p className="text-xs text-slate-300 font-sans">
              Ambiente de demonstração sem processamento financeiro comercial real.
            </p>
          </div>
        </div>

        {/* Online Demo Indicator */}
        <div className="p-3 rounded-xl bg-black/60 border border-emerald-500/20 font-mono text-xs flex items-center justify-between text-slate-300">
          <span className="text-slate-400">DEPLOY ATIVO:</span>
          <a
            href="https://gamehunter.lucas-s-almeida715.workers.dev/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-300 font-bold hover:underline flex items-center gap-1"
          >
            <span>Cloudflare Workers (OpenNext)</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
