import React, { useState } from 'react';
import {
  GraduationCap,
  Briefcase,
  Calendar,
  X,
  ChevronRight,
  Info,
  Instagram,
  Globe,
} from 'lucide-react';
import {
  TIMELINE_ITEMS,
  TimelineItem,
} from '../data/portfolioData';
import { CyberDecryptedText } from './CyberDecryptedText';

export const TimelineSection: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<TimelineItem | null>(null);

  const formacaoItems = TIMELINE_ITEMS.filter((i) => i.track === 'formacao');
  const experienciaItems = TIMELINE_ITEMS.filter((i) => i.track === 'experiencia');

  const handleKeyDownItem = (e: React.KeyboardEvent, item: TimelineItem) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setSelectedItem(selectedItem?.id === item.id ? null : item);
    }
  };

  return (
    <section id="formacao" className="py-16 px-6 sm:px-12 max-w-5xl mx-auto scroll-mt-20">
      <div className="cyber-card rounded-3xl p-6 sm:p-10 border border-white/[0.08] reveal-on-scroll space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <CyberDecryptedText
              text="FORMAÇÃO E EXPERIÊNCIA"
              tag="span"
              className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-semibold block mb-1"
            />
            <CyberDecryptedText
              text="Trajetória Acadêmica e Atuação Universitária"
              tag="h2"
              className="font-display text-2xl sm:text-3xl font-bold text-white"
            />
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl font-sans">
              Formação técnica integrada no IFMA, graduação em Engenharia de Software na UFC e extensão universitária.
            </p>
          </div>
        </div>

        {/* =========================================================================
            DUAL-TRACK DENSE MILESTONE GRID (ZERO ESPAÇO VAZIO)
           ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2 items-stretch">
          {/* COLUNA 1: FORMAÇÃO ACADÊMICA (4 COLS) */}
          <div className="lg:col-span-5 space-y-3 flex flex-col justify-between">
            <div className="flex items-center justify-between pb-1 border-b border-cyan-500/20">
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-300 font-bold uppercase tracking-wider">
                <GraduationCap className="w-4 h-4 text-cyan-400" />
                <span>Formação Acadêmica</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">2 Marcos</span>
            </div>

            <div className="space-y-4 flex-1 flex flex-col justify-between">
              {formacaoItems.map((item) => {
                const isSelected = selectedItem?.id === item.id;

                return (
                  <div
                    key={item.id}
                    role="button"
                    tabIndex={0}
                    aria-label={`${item.role} no ${item.institution}`}
                    onClick={() => setSelectedItem(isSelected ? null : item)}
                    onKeyDown={(e) => handleKeyDownItem(e, item)}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                      isSelected
                        ? 'border-cyan-400 bg-cyan-500/15 shadow-[0_0_25px_rgba(0,240,255,0.25)]'
                        : 'border-cyan-500/25 bg-black/50 hover:border-cyan-400/60 hover:bg-cyan-950/30'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                          {item.id === 'ifma' ? '2020 – 2022' : '2023 – Atual'}
                        </span>
                        {item.isCurrent ? (
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            <span>EM ANDAMENTO</span>
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono text-slate-400">
                            CONCLUÍDO
                          </span>
                        )}
                      </div>

                      <div>
                        <h3 className="font-display text-base font-bold text-white tracking-tight">
                          {item.role}
                        </h3>
                        <p className="text-xs font-mono text-cyan-300/90 mt-0.5">
                          {item.institution}
                        </p>
                      </div>

                      <p className="text-xs text-slate-300 font-sans leading-relaxed pt-1">
                        {item.resultLine}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between mt-3 text-xs font-mono">
                      <span className="text-slate-400 text-[11px]">{item.badge}</span>
                      <span className="text-cyan-300 flex items-center gap-1 font-bold">
                        {isSelected ? 'Ocultar' : 'Detalhes'} <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* COLUNA 2: ATUAÇÃO UNIVERSITÁRIA & EXTENSÃO (7 COLS) */}
          <div className="lg:col-span-7 space-y-3 flex flex-col justify-between">
            <div className="flex items-center justify-between pb-1 border-b border-violet-500/20">
              <div className="flex items-center gap-2 text-xs font-mono text-violet-300 font-bold uppercase tracking-wider">
                <Briefcase className="w-4 h-4 text-violet-400" />
                <span>Atuação Universitária & Extensão</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">4 Iniciativas</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 flex-1">
              {experienciaItems.map((item) => {
                const isSelected = selectedItem?.id === item.id;

                return (
                  <div
                    key={item.id}
                    role="button"
                    tabIndex={0}
                    aria-label={`${item.role} no ${item.institution}`}
                    onClick={() => setSelectedItem(isSelected ? null : item)}
                    onKeyDown={(e) => handleKeyDownItem(e, item)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden focus-visible:ring-2 focus-visible:ring-violet-400 ${
                      isSelected
                        ? 'border-violet-400 bg-violet-500/20 shadow-[0_0_25px_rgba(189,0,255,0.25)]'
                        : 'border-violet-500/25 bg-black/50 hover:border-violet-400/60 hover:bg-violet-950/30'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-1 text-xs font-mono">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-violet-500/20 text-violet-300 border border-violet-500/40">
                          {item.period.split('·')[0].trim()}
                        </span>
                        {item.isCurrent ? (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-violet-400/20 text-violet-300 border border-violet-400/50 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
                            <span>ATUAL</span>
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-semibold">
                            {item.badge.split('·')[0].trim()}
                          </span>
                        )}
                      </div>

                      <div>
                        <h4 className="font-display text-sm font-bold text-white tracking-tight leading-snug">
                          {item.role}
                        </h4>
                        <p className="text-[11px] font-mono text-violet-300 mt-0.5 truncate">
                          {item.institution.split('—')[0]}
                        </p>
                      </div>

                      <p className="text-xs text-slate-300 font-sans leading-relaxed line-clamp-3">
                        {item.resultLine}
                      </p>

                      {/* Official Links & Instagram */}
                      {item.links && item.links.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1.5">
                          {item.links.map((link) => (
                            <a
                              key={link.url}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="px-2 py-0.5 rounded-md bg-white/[0.04] hover:bg-violet-500/25 text-slate-300 hover:text-white border border-white/[0.08] hover:border-violet-400/50 text-[10px] font-mono flex items-center gap-1 transition-all"
                            >
                              {link.type === 'instagram' ? (
                                <Instagram className="w-2.5 h-2.5 text-pink-400 shrink-0" />
                              ) : (
                                <Globe className="w-2.5 h-2.5 text-cyan-400 shrink-0" />
                              )}
                              <span>{link.label}</span>
                            </a>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="pt-2.5 border-t border-white/[0.06] flex items-center justify-between mt-3 text-xs font-mono">
                      <span className="text-slate-400 text-[10px] truncate max-w-[120px]">
                        {item.details.highlight || item.badge}
                      </span>
                      <span className="text-violet-300 flex items-center gap-1 text-[11px] font-bold shrink-0">
                        {isSelected ? 'Ocultar' : 'Ver mais'} <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* =========================================================================
            EXPANDED DETAILS CARD (ON SELECTION)
           ========================================================================= */}
        {selectedItem && (
          <div className="p-5 sm:p-6 rounded-2xl bg-black/80 border border-cyan-400/40 space-y-3 animate-fadeIn relative">
            <button
              onClick={() => setSelectedItem(null)}
              aria-label="Fechar detalhes"
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-white/[0.05] hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono uppercase px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-200 border border-cyan-400/40 font-bold">
                {selectedItem.track === 'formacao' ? 'Formação' : 'Experiência'}
              </span>
              <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> {selectedItem.period}
              </span>
              {selectedItem.isCurrent && (
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Ativo</span>
                </span>
              )}
            </div>

            <div>
              <h3 className="font-display text-lg sm:text-xl font-bold text-white">
                {selectedItem.role}
              </h3>
              <p className="text-xs font-mono text-cyan-300 mt-0.5">{selectedItem.institution}</p>
            </div>

            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
              {selectedItem.details.description}
            </p>

            {/* Official Links in Details Drawer */}
            {selectedItem.links && selectedItem.links.length > 0 && (
              <div className="pt-2 flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono text-slate-400">Links Oficiais:</span>
                {selectedItem.links.map((link) => (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 rounded-lg bg-white/[0.05] hover:bg-cyan-500/20 text-slate-200 hover:text-cyan-200 border border-white/10 hover:border-cyan-400/50 text-xs font-mono flex items-center gap-1.5 transition-all"
                  >
                    {link.type === 'instagram' ? (
                      <Instagram className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                    ) : (
                      <Globe className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    )}
                    <span>{link.label}</span>
                  </a>
                ))}
              </div>
            )}

            <div className="pt-3 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-slate-300">
              <span className="flex items-center gap-1.5 text-cyan-300 font-semibold">
                <Info className="w-3.5 h-3.5" />
                <span>{selectedItem.details.highlight || selectedItem.badge}</span>
              </span>
              <span className="text-slate-400">{selectedItem.details.workload}</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
