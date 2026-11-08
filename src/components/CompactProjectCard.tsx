import React from 'react';
import {
  Github,
  ExternalLink,
  Maximize2,
  Sliders,
} from 'lucide-react';
import { MainProject } from '../data/portfolioData';

interface CompactProjectCardProps {
  project: MainProject;
  variant?: 'flagship' | 'medium' | 'compact';
  onOpenDetails: (project: MainProject) => void;
  onOpenLightbox: (imageUrl: string) => void;
}

export const CompactProjectCard: React.FC<CompactProjectCardProps> = ({
  project,
  variant = 'medium',
  onOpenDetails,
  onOpenLightbox,
}) => {
  // Border and glow colors based on accentColor
  const borderClass =
    project.accentColor === 'violet'
      ? 'border-violet-500/30 hover:border-violet-400/60'
      : project.accentColor === 'emerald'
      ? 'border-emerald-500/30 hover:border-emerald-400/60'
      : 'border-cyan-500/30 hover:border-cyan-400/60';

  const badgeClass =
    project.accentColor === 'violet'
      ? 'bg-violet-500/20 text-violet-300 border-violet-500/40'
      : project.accentColor === 'emerald'
      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
      : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';

  const buttonAccent =
    project.accentColor === 'violet'
      ? 'border-violet-500/30 hover:border-violet-400 text-violet-200 hover:bg-violet-500/10'
      : project.accentColor === 'emerald'
      ? 'border-emerald-500/30 hover:border-emerald-400 text-emerald-200 hover:bg-emerald-500/10'
      : 'border-cyan-500/30 hover:border-cyan-400 text-cyan-200 hover:bg-cyan-500/10';

  // 1. FLAGSHIP HORIZONTAL BENTO (FL-XAI: MAIOR)
  if (variant === 'flagship') {
    return (
      <article
        id={project.id}
        className={`cyber-card rounded-3xl p-6 sm:p-7 border ${borderClass} flex flex-col justify-between transition-all duration-300 min-h-[400px]`}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left Column: Info, Proof Line, Tags & Buttons */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-3">
            <div>
              {/* Header Badges */}
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded border uppercase tracking-wider ${badgeClass}`}>
                  {project.statusBadge}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  {project.number} // DESTAQUE PRINCIPAL
                </span>
              </div>

              {/* Title & Short Phrase (<= 140 chars) */}
              <h3 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {project.title}
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-200 leading-relaxed font-sans line-clamp-2">
                {project.shortPhrase}
              </p>
            </div>

            {/* Proof Line (Appears ONCE in card) */}
            <div className="p-3 rounded-xl bg-black/60 border border-cyan-500/30 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0 shadow-[0_0_8px_#00f0ff]" />
              <p className="text-xs font-mono font-semibold text-cyan-200 truncate">
                {project.proofLine}
              </p>
            </div>

            {/* Tags (Max 4 tags) */}
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {project.cardTags.slice(0, 4).map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-md text-xs font-mono bg-white/[0.04] border border-white/[0.08] text-slate-300"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="pt-3 border-t border-white/[0.06] flex flex-wrap items-center gap-2.5">
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-cyber-primary px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 font-mono font-bold"
              >
                <Github className="w-3.5 h-3.5" />
                <span>Repositório</span>
              </a>

              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 font-mono border transition-all ${buttonAccent}`}
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>{project.demoLabel || 'Resultados'}</span>
                </a>
              )}

              <button
                type="button"
                onClick={() => onOpenDetails(project)}
                className="btn-cyber-ghost px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 font-mono cursor-pointer ml-auto"
              >
                <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                <span>Detalhes</span>
              </button>
            </div>
          </div>

          {/* Right Column: 16:9 Featured Image (clickable for lightbox) */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <div
              role="button"
              tabIndex={0}
              aria-label={`Ampliar captura de ${project.title}`}
              onClick={() => onOpenLightbox(project.featuredImage)}
              onKeyDown={(e) => (e.key === 'Enter' ? onOpenLightbox(project.featuredImage) : null)}
              className="relative rounded-2xl overflow-hidden border border-white/10 bg-black aspect-video group cursor-pointer shadow-[0_0_25px_rgba(0,240,255,0.15)] focus-visible:ring-2 focus-visible:ring-cyan-400"
            >
              <img
                src={project.featuredImage}
                alt={project.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end justify-between p-3">
                <span className="text-xs font-mono text-cyan-200 font-semibold drop-shadow truncate pr-2">
                  5 Sementes (UCI HAR)
                </span>
                <span className="px-2 py-1 rounded-md bg-black/70 text-cyan-300 text-[11px] font-mono border border-white/10 flex items-center gap-1 group-hover:bg-cyan-500/30 group-hover:text-white transition-colors">
                  <Maximize2 className="w-3 h-3" />
                  <span>Ampliar</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </article>
    );
  }

  // 2. MEDIUM & COMPACT BENTO (GAMBIT-LAB & GAMEHUNTER)
  const actionButtonCols = project.demoUrl ? 'grid-cols-3' : 'grid-cols-2';

  return (
    <article
      id={project.id}
      className={`cyber-card rounded-3xl p-5 sm:p-6 border ${borderClass} flex flex-col justify-between transition-all duration-300 min-h-[460px] w-full h-full`}
    >
      <div className="space-y-3">
        {/* Header Badges */}
        <div className="flex items-center justify-between gap-2">
          <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded border uppercase tracking-wider ${badgeClass}`}>
            {project.statusBadge}
          </span>
          <span className="text-xs font-mono text-slate-400">
            {project.number}
          </span>
        </div>

        {/* 16:9 Featured Image */}
        <div
          role="button"
          tabIndex={0}
          aria-label={`Ampliar captura de ${project.title}`}
          onClick={() => onOpenLightbox(project.featuredImage)}
          onKeyDown={(e) => (e.key === 'Enter' ? onOpenLightbox(project.featuredImage) : null)}
          className="relative rounded-xl overflow-hidden border border-white/10 bg-black aspect-video group cursor-pointer shadow-[0_0_20px_rgba(0,0,0,0.6)] focus-visible:ring-2 focus-visible:ring-cyan-400"
        >
          <img
            src={project.featuredImage}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end justify-between p-2.5">
            <span className="text-[11px] font-mono text-white font-semibold drop-shadow truncate pr-2">
              {project.title}
            </span>
            <span className="p-1 rounded bg-black/70 text-slate-300 hover:text-white transition-colors">
              <Maximize2 className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Title & Short Phrase with locked min-height for perfect symmetry */}
        <div>
          <h3 className="font-display text-xl font-bold text-white tracking-tight">
            {project.title}
          </h3>
          <p className="mt-1 text-xs text-slate-200 leading-relaxed font-sans line-clamp-2 min-h-[36px]">
            {project.shortPhrase}
          </p>
        </div>

        {/* Proof Line */}
        <div className="p-2.5 rounded-xl bg-black/50 border border-white/[0.06] flex items-center gap-2 min-h-[38px]">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
          <p className="text-[11px] font-mono text-slate-300 truncate">
            {project.proofLine}
          </p>
        </div>
      </div>

      {/* Bottom Area: Tags & Action Buttons */}
      <div className="space-y-3 pt-3 border-t border-white/[0.06] mt-3">
        {/* Tags (Max 4) */}
        <div className="flex flex-wrap gap-1 min-h-[26px]">
          {project.cardTags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded text-[11px] font-mono bg-white/[0.04] border border-white/[0.08] text-slate-300"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Action Buttons: perfectly spaced, responsive, never clipped */}
        <div className={`grid ${actionButtonCols} gap-2 pt-1`}>
          <a
            href={project.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-cyber-primary py-2 px-2 rounded-xl text-xs flex items-center justify-center gap-1.5 font-mono font-bold"
          >
            <Github className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Repo</span>
          </a>

          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`py-2 px-2 rounded-xl text-xs flex items-center justify-center gap-1.5 font-mono border transition-all ${buttonAccent}`}
            >
              <ExternalLink className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{project.demoLabel || 'Demo'}</span>
            </a>
          )}

          <button
            type="button"
            onClick={() => onOpenDetails(project)}
            className="btn-cyber-ghost py-2 px-2 rounded-xl text-xs flex items-center justify-center gap-1.5 font-mono cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="truncate">Detalhes</span>
          </button>
        </div>
      </div>
    </article>
  );
};

