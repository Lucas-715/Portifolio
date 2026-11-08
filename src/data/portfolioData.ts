export const TARGET_COMPANY = 'iFood';

export interface ProjectPillar {
  title: string;
  badge: string;
  status: 'implementado' | 'em_andamento' | 'planejado';
  statusLabel: string;
  description: string;
}

export interface ComparisonRow {
  approach: string;
  partition: string;
  macroF1: string;
  accuracy: string;
  networkOverhead: string;
  xaiCosine: string;
}

export interface ProjectScreenshot {
  url: string;
  title: string;
  description: string;
}

export interface MainProject {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  statusBadge: string;
  shortPhrase: string;
  proofLine: string;
  cardTags: string[];
  featuredImage: string;
  summary: string;
  problem: string;
  approachTitle: string;
  approach: string[];
  myContribution?: string[];
  pillars?: ProjectPillar[];
  comparisonTable?: ComparisonRow[];
  comparisonTableSevere?: ComparisonRow[];
  tableNote?: string;
  xaiMetric?: {
    label: string;
    value: string;
    detail: string;
  };
  screenshots: ProjectScreenshot[];
  technologies: string[];
  accentColor: 'cyan' | 'violet' | 'emerald';
  telemetryLabel: string;
  telemetryMetric: string;
  repoUrl: string;
  demoUrl?: string;
  demoLabel?: string;
  isCompact?: boolean;
}

export const MAIN_PROJECTS: MainProject[] = [
  // 1. FEDERATED-XAI-LAB (PRIMEIRO DESTAQUE)
  {
    id: 'federated-xai-lab',
    number: '01',
    title: 'Federated-XAI-Lab',
    subtitle: 'Framework Experimental & Explicabilidade de Modelos',
    statusBadge: 'FRAMEWORK EXPERIMENTAL',
    shortPhrase:
      'Framework experimental que avalia convergência e explicabilidade (Integrated Gradients) com 6 clientes simulados no UCI HAR.',
    proofLine: 'Macro-F1 0,9270 ± 0,0089 · 5 sementes · 9 voluntários não vistos',
    cardTags: ['PyTorch', 'FedAvg / FedProx', 'Integrated Gradients', 'pytest'],
    featuredImage: '/projects/federated-xai/f1_macro.png',
    summary:
      'Framework experimental que analisa a convergência estatística e a estabilidade explicativa de modelos federados (FedAvg e FedProx) no conjunto de dados UCI HAR com 6 clientes simulados.',
    problem:
      'Simulação de aprendizado federado, sem garantias formais de privacidade, avaliando como distribuições não-IID afetam a convergência e a concordância de explicabilidade via Integrated Gradients.',
    approachTitle: 'Metodologia & Protocolo Experimental',
    approach: [
      'Comparação entre treinamento centralizado, FedAvg e FedProx com particionamento natural (indivíduos reais) e heterogeneidade sintética via Dirichlet (α = 0,15).',
      'Avaliação estrita em 9 voluntários independentes de teste não vistos, com múltiplas sementes e desvio padrão (sementes 42 a 46) e 15 rodadas de comunicação.',
    ],
    myContribution: [
      'Arquitetura e implementação completa do pipeline federado em PyTorch (simulação de clientes, agregação e rotinas locais de otimização).',
      'Implementação dos algoritmos FedAvg e FedProx com suporte a particionamento natural (por voluntário) e sintético não-IID (Dirichlet α=0,15).',
      'Desenvolvimento do pipeline de explicabilidade (XAI) com Integrated Gradients, computando a similaridade de cosseno entre gradientes atribuídos locais e globais.',
      'Estruturação do protocolo experimental rigoroso com 5 sementes determinísticas (42 a 46) e validação estatística com teste pareado t de Student com correção de Bonferroni.',
      'Criação de suite de testes unitários com pytest e painel interativo de telemetria em Streamlit.',
    ],
    comparisonTable: [
      {
        approach: 'Centralizado',
        partition: 'Treino conjunto (16 voluntários)',
        macroF1: '0,8955 ± 0,0728',
        accuracy: '90,34 ± 5,74%',
        networkOverhead: '0 MB (Local)',
        xaiCosine: '—',
      },
      {
        approach: 'FedAvg',
        partition: 'Partição Natural (6 clientes)',
        macroF1: '0,9270 ± 0,0089',
        accuracy: '92,81 ± 0,92%',
        networkOverhead: '~14,2 MB / rodada',
        xaiCosine: '0,892 ± 0,031',
      },
      {
        approach: 'FedProx (μ = 0,3)',
        partition: 'Partição Natural (6 clientes)',
        macroF1: '0,9233 ± 0,0109',
        accuracy: '92,45 ± 1,10%',
        networkOverhead: '~14,2 MB / rodada',
        xaiCosine: '0,887 ± 0,028',
      },
    ],
    comparisonTableSevere: [
      {
        approach: 'Centralizado',
        partition: 'Treino conjunto (16 voluntários)',
        macroF1: '0,8955 ± 0,0728',
        accuracy: '90,34 ± 5,74%',
        networkOverhead: '0 MB (Local)',
        xaiCosine: '—',
      },
      {
        approach: 'FedAvg',
        partition: 'Não-IID Severo (Dirichlet α=0,15)',
        macroF1: '0,8637 ± 0,0739',
        accuracy: '87,52 ± 5,50%',
        networkOverhead: '~14,2 MB / rodada',
        xaiCosine: '0,614 ± 0,052',
      },
      {
        approach: 'FedProx (μ = 0,3)',
        partition: 'Não-IID Severo (Dirichlet α=0,15)',
        macroF1: '0,8613 ± 0,0705',
        accuracy: '87,24 ± 5,24%',
        networkOverhead: '~14,2 MB / rodada',
        xaiCosine: '0,608 ± 0,049',
      },
    ],
    tableNote:
      'FedAvg × FedProx sem evidência de diferença (5 sementes; teste pareado t de Student com p = 0,0184 e correção de Bonferroni com limiar de 0,0125). Detalhamento completo no README.',
    xaiMetric: {
      label: 'Estabilidade Explicativa (Integrated Gradients)',
      value: 'Similaridade de Cosseno: 0,892 ± 0,031 (Natural) vs. 0,614 ± 0,052 (Não-IID Severo)',
      detail:
        'Medida pela similaridade de cosseno entre vetores locais e o modelo global. Em heterogeneidade severa, clientes divergem ao focar em canais pontuais de sensores.',
    },
    screenshots: [
      {
        url: '/projects/federated-xai/f1_macro.png',
        title: 'Desempenho Macro-F1 nas 5 Sementes (UCI HAR)',
        description: 'Gráfico com a dispersão e desvio padrão de Macro-F1: Centralizado (0,8955) vs FedAvg (0,9270) vs FedProx (0,9233).',
      },
      {
        url: '/projects/federated-xai/dashboard.png',
        title: 'Dashboard de Métricas & Convergência (Streamlit)',
        description: 'Interface interativa exibindo curvas de perda e acurácia entre clientes federados no UCI HAR.',
      },
      {
        url: '/projects/federated-xai/explicabilidade.png',
        title: 'Concordância de Explicabilidade (Integrated Gradients)',
        description: 'Similaridade de cosseno entre vetores de atribuição locais e globais nas 6 classes de atividades.',
      },
    ],
    technologies: ['Python', 'PyTorch', 'Integrated Gradients', 'Streamlit', 'pytest'],
    accentColor: 'cyan',
    telemetryLabel: 'TESTE NÃO VISTO',
    telemetryMetric: 'Macro-F1: 0,9270 ± 0,0089',
    repoUrl: 'https://github.com/Lucas-715/Federated-XAI-Lab',
    demoUrl: 'https://github.com/Lucas-715/Federated-XAI-Lab#readme',
    demoLabel: 'Resultados',
  },

  // 2. GAMBIT-LAB (SEGUNDO DESTAQUE)
  {
    id: 'gambit-lab',
    number: '02',
    title: 'Gambit-Lab',
    subtitle: 'Sistemas Multiagentes & Orquestração Cognitiva',
    statusBadge: 'PROTÓTIPO',
    shortPhrase:
      'Game-driven multi-agent framework para debate e auditoria baseados em evidências utilizando LLMs, Xadrez, Go e raciocínio rastreável.',
    proofLine: 'Ações validadas por motor determinístico (python-chess, GoEngine) antes do registro',
    cardTags: ['FastAPI', 'python-chess', 'Gemini API', 'SQLite'],
    featuredImage: '/projects/gambit-lab/workspace.png',
    summary:
      'Game-driven multi-agent framework for evidence-based debate and auditing using LLMs, Chess, Go, and traceable reasoning. Protótipo experimental que investiga debates estruturados e auditoria entre agentes de IA com validação de regras canônicas de estado.',
    problem:
      'Estruturar a interação entre agentes para que lances, argumentos e conclusões sejam formalmente verificáveis, mitigando alucinações de regras do LLM.',
    approachTitle: 'Arquitetura Proposta em 3 Eixos',
    approach: [
      'Separação estrita entre a camada de regras canônicas de estado, o protocolo de debate e a verificação factual de afirmações.',
      'Ações validadas por motor determinístico (python-chess e GoEngine) antes de serem registradas no Event Store em memória.',
    ],
    myContribution: [
      'Projeto e arquitetura do backend em FastAPI desacoplando regras canônicas determinísticas da camada de geração por LLMs (Gemini API).',
      'Implementação do motor de validação de regras com python-chess e GoEngine: lances inválidos são validados e rejeitados antes do registro.',
      'Modelagem da estrutura de transições de estado e persistência de lances e argumentos em SQLite.',
      'Definição da dinâmica de debate multiagente delimitada por rodadas (Proponente vs Crítico vs Árbitro).',
      'Testes unitários automatizados com pytest validando que o LLM não tem permissão de alterar o estado do tabuleiro sem aprovação do motor.',
    ],
    pillars: [
      {
        title: '01. Validade Formal (Regras Canônicas)',
        badge: 'Xadrez & Go',
        status: 'implementado',
        statusLabel: '✓ implementado',
        description:
          'Ações são restritas por transições canônicas de estado. Lances inválidos são rejeitados pelo motor antes do registro, impedindo violações das regras do tabuleiro.',
      },
      {
        title: '02. Dinâmica de Debate Estruturado',
        badge: 'Multiagente',
        status: 'em_andamento',
        statusLabel: '◐ em andamento',
        description:
          'Agente Proponente submete hipóteses; Agente Crítico testa contradições e fragilidades lógicas em rodadas delimitadas.',
      },
      {
        title: '03. Auditoria Factual Independente',
        badge: 'Gemini + SQLite',
        status: 'planejado',
        statusLabel: '○ planejado',
        description:
          'Avaliação desacoplada da eloquência retórica: argumentos gerados são confrontados contra evidências persistidas no SQLite.',
      },
    ],
    screenshots: [
      {
        url: '/projects/gambit-lab/workspace.png',
        title: 'Workspace Nocturne: Tabuleiro & Julgamento Epistêmico',
        description: 'Painel com tabuleiro 2D/3D sincronizado, dossiês de peças, rastreamento SHA-256 e veredito factual.',
      },
      {
        url: '/projects/gambit-lab/move_tab.png',
        title: 'Validação de Regras Canônicas & Timeline de Lances',
        description: 'Inspeção de lances válidos via motor de Xadrez/Go impedindo alucinações de regras pelo LLM.',
      },
      {
        url: '/projects/gambit-lab/home.png',
        title: 'Tela Inicial Nocturne & Gestão de Chaves API',
        description: 'Interface cósmica com seleção de modalidade (Debate de Evidências vs Auditoria de Controles).',
      },
    ],
    technologies: ['Python', 'FastAPI', 'Gemini API', 'SQLite', 'pytest'],
    accentColor: 'violet',
    telemetryLabel: 'ESTÁGIO ATUAL',
    telemetryMetric: 'PROTÓTIPO',
    repoUrl: 'https://github.com/Lucas-715/Gambit-Lab',
    demoUrl: 'https://github.com/Lucas-715/Gambit-Lab#5-arquitetura-do-sistema',
    demoLabel: 'Arquitetura',
  },

  // 3. GAMEHUNTER (TERCEIRO DESTAQUE - FORMATO COMPACTO)
  {
    id: 'gamehunter',
    number: '03',
    title: 'GameHunter',
    subtitle: 'Protótipo Avançado & Integração de Catálogo',
    statusBadge: 'PROTÓTIPO AVANÇADO',
    shortPhrase:
      'Plataforma para catalogação e comparação de preços de jogos para PC (protótipo avançado com Next.js, Prisma e dados de demonstração).',
    proofLine: 'Telas navegáveis com dados de demonstração · Autenticação e persistência em andamento',
    cardTags: ['Next.js', 'TypeScript', 'Prisma ORM', 'NextAuth'],
    featuredImage: '/projects/gamehunter/dashboard.png',
    summary:
      'O GameHunter é uma plataforma criada para ajudar jogadores de PC a encontrarem o melhor momento de compra e organizarem seu catálogo de jogos com Next.js, Prisma ORM e NextAuth. Atualmente possui telas de catálogo e wishlist 100% navegáveis com dados de demonstração, enquanto a camada de autenticação e persistência está em desenvolvimento.',
    problem:
      'Consolidar catálogo de jogos e interface de usuário com dados de demonstração e autenticação resiliente.',
    approachTitle: 'Integração & Arquitetura Web',
    approach: [
      'Deploy via OpenNext no Cloudflare Workers com dados de demonstração; catálogo e persistência local via Prisma e SQLite.',
      'Rotas de catálogo, busca e wishlist 100% navegáveis com dados mockados de demonstração.',
    ],
    myContribution: [
      'Desenvolvimento do frontend completo em Next.js (App Router), TypeScript e Tailwind CSS.',
      'Implementação de rotas navegáveis de catálogo, filtros de busca, comparador de preços e wishlist utilizando dados mockados de demonstração.',
      'Modelagem relacional do catálogo e perfis com Prisma ORM e banco de dados SQLite.',
      'Configuração de deploy estático/edge no Cloudflare Workers via OpenNext.',
      'Arquitetura da camada de autenticação com NextAuth (sessões e favoritos persistentes em andamento).',
    ],
    pillars: [
      {
        title: 'Rotas & Interface',
        badge: 'Next.js App Router',
        status: 'implementado',
        statusLabel: '✓ implementado',
        description: 'Telas de catálogo, busca e wishlist 100% navegáveis com dados de demonstração.',
      },
      {
        title: 'Autenticação & Wishlist',
        badge: 'NextAuth + Prisma',
        status: 'em_andamento',
        statusLabel: '◐ em andamento',
        description: 'Persistência de favoritos e sessões de usuários com NextAuth.',
      },
      {
        title: 'Pagamentos: fora do escopo',
        badge: 'Transações Comerciais',
        status: 'planejado',
        statusLabel: '○ fora do escopo',
        description: 'Ambiente de demonstração sem processamento financeiro comercial.',
      },
    ],
    screenshots: [
      {
        url: '/projects/gamehunter/dashboard.png',
        title: 'Dashboard de Catálogo & Busca de Ofertas',
        description: 'Aplicação web no Cloudflare Workers com filtros rápidos e interface responsiva para jogos.',
      },
      {
        url: '/projects/gamehunter/comparador.png',
        title: 'Comparador de Preços entre Lojas Oficiais',
        description: 'Detalhamento do jogo com ofertas de lojas, histórico de cotações e simulação de ativação.',
      },
      {
        url: '/projects/gamehunter/alertas.png',
        title: 'Lista de Desejos & Sistema de Alertas',
        description: 'Gerenciamento de wishlist e acompanhamento de variações de preço para títulos favoritados.',
      },
    ],
    technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Prisma ORM', 'SQLite', 'NextAuth.js'],
    accentColor: 'emerald',
    telemetryLabel: 'ESTÁGIO ATUAL',
    telemetryMetric: 'PROTÓTIPO AVANÇADO',
    repoUrl: 'https://github.com/Lucas-715/GAMEHunter',
    demoUrl: 'https://gamehunter.lucas-s-almeida715.workers.dev/',
    demoLabel: 'Demo',
    isCompact: true,
  },
];

export const OTHER_PROJECTS = [
  {
    title: 'ben10-pygame-game',
    category: 'Jogo Roguelite · Python / Pygame',
    description:
      'Jogo Roguelite de sobrevivência desenvolvido em Python com Pygame. Implementa Máquinas de Estados Finitas (FSM), matemática vetorial para colisões e sistema modular de habilidades.',
    repoUrl: 'https://github.com/Lucas-715/ben10-pygame-game',
  },
  {
    title: 'dominating-set-logic',
    category: 'Lógica Computacional & Prova de Teoremas',
    description:
      'Modelagem e resolução do problema do Conjunto Dominante em grafos utilizando Lógica de Primeira Ordem (LPO) e o provador de teoremas Vampire. Projeto desenvolvido na UFC.',
    repoUrl: 'https://github.com/Lucas-715/dominating-set-logic',
  },
  {
    title: 'Tasks-Vue',
    category: 'Frontend Reativo · Vue.js 3 / Vite',
    description:
      'Gerenciador de tarefas reativo desenvolvido com Vue.js 3 e Vite. Foco em componentização, gerenciamento de estado e interface responsiva com deploy automatizado na Vercel.',
    repoUrl: 'https://github.com/Lucas-715/Tasks-Vue',
  },
];

export interface TimelineLink {
  label: string;
  url: string;
  type: 'website' | 'instagram';
}

export interface TimelineItem {
  id: string;
  track: 'formacao' | 'experiencia';
  role: string;
  institution: string;
  period: string;
  startYear: number;
  endYear: number;
  startMonth?: number; // 1-12
  endMonth?: number; // 1-12
  isCurrent?: boolean;
  resultLine: string;
  badge: string;
  links?: TimelineLink[];
  details: {
    workload?: string;
    description: string;
    highlight?: string;
  };
}

export const TIMELINE_HIGHLIGHTS = [
  '417 h de extensão voluntária (NERDS + Aprova)',
  '60 alunos em sala (Aprova UFC)',
  'PET Russas: Artigos, Cursos e Extensão',
];

export const TIMELINE_ITEMS: TimelineItem[] = [
  // FAIXA 1: FORMAÇÃO
  {
    id: 'ifma',
    track: 'formacao',
    role: 'Técnico em Informática',
    institution: 'Instituto Federal do Maranhão (IFMA · Campus Porto Franco)',
    period: 'Fev/2020 – Dez/2022 (Concluído)',
    startYear: 2020,
    endYear: 2022,
    resultLine: 'Fundamentos de redes, bancos de dados relacionais e programação orientada a objetos.',
    badge: 'Técnico Integrado · Concluído',
    details: {
      workload: 'Ensino Médio Técnico Integrado (3 anos)',
      description:
        'Formação técnica com base em algoritmos, arquitetura de computadores, redes e desenvolvimento de software.',
      highlight: 'Concluído em Dez/2022',
    },
  },
  {
    id: 'ufc',
    track: 'formacao',
    role: 'Bacharelado em Engenharia de Software',
    institution: 'Universidade Federal do Ceará (UFC · Campus Russas)',
    period: '2023 – Atual (Conclusão prevista: Dez/2027)',
    startYear: 2023,
    endYear: 2027,
    isCurrent: true,
    resultLine: 'Arquitetura modular, testes automatizados (pytest), qualidade de código e inteligência artificial.',
    badge: 'Graduação Presencial · Conclusão: Dez/2027',
    details: {
      workload: 'Bacharelado em Engenharia de Software',
      description:
        'Atuação acadêmica e prática em estruturas de dados, algoritmos, sistemas distribuídos, aprendizado de máquina e engenharia de software.',
      highlight: 'Conclusão prevista: Dez/2027',
    },
  },

  // FAIXA 2: EXPERIÊNCIA
  {
    id: 'nerds',
    track: 'experiencia',
    role: 'Desenvolvedor Front-end Voluntário',
    institution: 'NERDS — Núcleo de Engenharia de Software (UFC)',
    period: 'Abr/2025 – Jul/2025 · 141 h',
    startYear: 2025,
    endYear: 2025,
    startMonth: 4,
    endMonth: 7,
    resultLine: 'Desenvolvimento de interfaces em Vue.js para tecnologia interna do núcleo, com Kanban e Scrum.',
    badge: '141 h · Extensão Voluntária',
    links: [
      {
        label: 'Site Oficial',
        url: 'https://nerds.ufc.br/?utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAZXh0bgNhZW0CMTEAcGRvZgJzcnRjBmFwcF9pZA85MzY2MTk3NDMzOTI0NTkAAae3qUGBRoejGE_5k98a45B5QMuXDXW87Es_zsqyBDhB1EMBuQ-vfI80YTiCEw_aem_sYUM1OzBIIzwn9Q_nBnDcA',
        type: 'website',
      },
      {
        label: '@nerds.ufc',
        url: 'https://www.instagram.com/nerds.ufc/',
        type: 'instagram',
      },
    ],
    details: {
      workload: '141 horas comprovadas de extensão universitária',
      description:
        'Desenvolvimento de componentes modulares em Vue.js para aplicação interna, com planejamento ágil semanal (Kanban e Scrum) e revisão de código.',
      highlight: 'Interfaces reativas com Vue.js 3',
    },
  },
  {
    id: 'aprova',
    track: 'experiencia',
    role: 'Monitor de Física Voluntário',
    institution: 'Aprova UFC — Cursinho Popular Pré-ENEM',
    period: 'Mai/2025 – Dez/2025 · 276 h',
    startYear: 2025,
    endYear: 2025,
    startMonth: 5,
    endMonth: 12,
    resultLine: 'Aulas e resolução de exercícios para turma de 60 alunos em cursinho preparatório para o ENEM.',
    badge: '276 h · Monitoria Voluntária',
    links: [
      {
        label: '@aprovaufc',
        url: 'https://www.instagram.com/aprovaufc/',
        type: 'instagram',
      },
    ],
    details: {
      workload: '276 horas comprovadas de monitoria voluntária',
      description:
        'Preparação didática e ministração de aulas teóricas e práticas de Física para turmas de 60 estudantes de escolas públicas da região do Vale do Jaguaribe.',
      highlight: '60 alunos em sala de aula',
    },
  },
  {
    id: 'pae',
    track: 'experiencia',
    role: 'Líder do Time de Cursos (Bolsista)',
    institution: 'PAE — Projeto de Apoio ao Ensino (Pró-Reitoria de Extensão UFC)',
    period: 'Abr/2026 – Atual',
    startYear: 2026,
    endYear: 2027,
    isCurrent: true,
    resultLine: 'Coordena atividades de apoio ao ensino e planeja conteúdos de formação complementar.',
    badge: 'Bolsista de Extensão · Ativo',
    links: [
      {
        label: '@paeufc',
        url: 'https://www.instagram.com/paeufc/',
        type: 'instagram',
      },
    ],
    details: {
      workload: 'Bolsa de Extensão Universitária (Pró-Reitoria de Extensão UFC)',
      description:
        'Liderança da equipe de instrutores, definição de ementas, alinhamento pedagógico e organização de cursos de formação complementar para estudantes de graduação.',
      highlight: 'Liderança de time de cursos',
    },
  },
  {
    id: 'pet',
    track: 'experiencia',
    role: 'Membro Voluntário (Ensino, Pesquisa e Extensão)',
    institution: 'PET Russas — Programa de Educação Tutorial (UFC)',
    period: 'Atual',
    startYear: 2026,
    endYear: 2027,
    isCurrent: true,
    resultLine: 'Pesquisa e produção de artigos científicos, elaboração e oferta de cursos técnicos e atividades contínuas de extensão universitária.',
    badge: 'Ensino, Pesquisa e Extensão · Ativo',
    links: [
      {
        label: '@petufcrussas',
        url: 'https://www.instagram.com/petufcrussas/',
        type: 'instagram',
      },
    ],
    details: {
      workload: 'Membro voluntário do PET Russas',
      description:
        'Atuação no tripé universitário: produção e publicação de artigos científicos, elaboração e ministração de cursos de capacitação técnica, projetos de pesquisa interdisciplinar e ações de extensão contínuas com a comunidade.',
      highlight: 'Artigos, Cursos & Extensão',
    },
  },
];

export const CONTACT_INFO = {
  name: 'Lucas de Souza Almeida',
  role: 'Software Engineer & AI Researcher',
  education: 'Engenharia de Software (UFC) · Técnico em Informática (IFMA)',
  location: 'Ceará, Brasil',
  github: 'https://github.com/Lucas-715',
  linkedin: 'https://www.linkedin.com/in/lucas-almeida-5433a0330',
  email: 'lucas.s.almeida715@gmail.com',
};
