import React from 'react';

interface TechItem {
  name: string;
  slug: string; // Simple Icons slug
  brand: string; // hex without #
  group: string;
}

// Official brand logos served by Simple Icons CDN (https://simpleicons.org)
const TECH_ITEMS: TechItem[] = [
  { name: 'Python', slug: 'python', brand: '3776AB', group: 'IA' },
  { name: 'PyTorch', slug: 'pytorch', brand: 'EE4C2C', group: 'IA' },
  { name: 'Gemini', slug: 'googlegemini', brand: '8E75B2', group: 'IA' },
  { name: 'FastAPI', slug: 'fastapi', brand: '009688', group: 'Backend' },
  { name: 'Streamlit', slug: 'streamlit', brand: 'FF4B4B', group: 'IA' },
  { name: 'TypeScript', slug: 'typescript', brand: '3178C6', group: 'Web' },
  { name: 'JavaScript', slug: 'javascript', brand: 'F7DF1E', group: 'Web' },
  { name: 'Next.js', slug: 'nextdotjs', brand: 'FFFFFF', group: 'Web' },
  { name: 'Vue.js', slug: 'vuedotjs', brand: '4FC08D', group: 'Web' },
  { name: 'Tailwind', slug: 'tailwindcss', brand: '06B6D4', group: 'Web' },
  { name: 'Prisma', slug: 'prisma', brand: 'FFFFFF', group: 'Dados' },
  { name: 'SQLite', slug: 'sqlite', brand: '44A8E0', group: 'Dados' },
  { name: 'Docker', slug: 'docker', brand: '2496ED', group: 'Ferramentas' },
  { name: 'Git', slug: 'git', brand: 'F05032', group: 'Ferramentas' },
  { name: 'pytest', slug: 'pytest', brand: '0A9EDC', group: 'Ferramentas' },
  { name: 'Java', slug: 'openjdk', brand: 'FFFFFF', group: 'Linguagens' },
  { name: 'React', slug: 'react', brand: '61DAFB', group: 'Aprendendo' },
  { name: 'Node.js', slug: 'nodedotjs', brand: '5FA04E', group: 'Aprendendo' },
  { name: 'PostgreSQL', slug: 'postgresql', brand: '4169E1', group: 'Aprendendo' },
];

const MUTED = '7DD3FC'; // project cyan tint (muted state)

export const TechSkillsLogos: React.FC = () => {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-3">
      {TECH_ITEMS.map((item, i) => (
        <div
          key={item.name}
          style={{ '--brand': `#${item.brand}`, transitionDelay: `${i * 25}ms` } as React.CSSProperties}
          className="group relative aspect-square rounded-2xl bg-[#080516]/80 border border-white/[0.07] hover:border-[var(--brand)] hover:shadow-[0_0_28px_-4px_var(--brand)] hover:-translate-y-1 transition-all duration-300 flex flex-col items-center justify-center gap-2 cursor-default"
        >
          <div className="relative w-9 h-9">
            {/* Muted project-colored version */}
            <img
              src={`https://cdn.simpleicons.org/${item.slug}/${MUTED}`}
              alt=""
              aria-hidden
              loading="lazy"
              className="absolute inset-0 w-full h-full opacity-50 group-hover:opacity-0 transition-opacity duration-300"
            />
            {/* Original brand color version */}
            <img
              src={`https://cdn.simpleicons.org/${item.slug}/${item.brand}`}
              alt={item.name}
              loading="lazy"
              className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all duration-300"
            />
          </div>
          <span className="text-[11px] font-mono text-slate-400 group-hover:text-white transition-colors">
            {item.name}
          </span>
          {item.group === 'Aprendendo' && (
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-fuchsia-400" title="Em aprofundamento" />
          )}
        </div>
      ))}
    </div>
  );
};
