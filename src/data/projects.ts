export interface Project {
  id: string;
  title: string;
  description: string;
  creator: {
    name: string;
    avatar?: string;
    url?: string;
  };
  logo?: string;
  category: string;
  tags: string[];
  url: string;
  mrr?: string;
  launched: string;
  metrics?: {
    users?: string;
    customers?: string;
    revenue?: string;
  };
  featured: boolean;
  spotlight?: boolean;
}

export const projects: Project[] = [
  {
    id: "gestorize",
    title: "Gestorize",
    description: "Plataforma completa de gestão financeira para pequenas empresas e MEIs",
    creator: {
      name: "Marina Costa",
      url: "/perfil/marina-costa"
    },
    logo: "/images/projects/gestorize.svg",
    category: "Finanças",
    tags: ["Gestão Financeira", "SaaS", "MEI", "Contabilidade"],
    url: "/projetos/gestorize",
    mrr: "R$ 25K+",
    launched: "2023-02-15",
    metrics: {
      users: "1.2K+",
      customers: "380+",
      revenue: "R$ 300K+ anual"
    },
    featured: true,
    spotlight: true
  },
  {
    id: "devmetrics",
    title: "DevMetrics",
    description: "Monitoramento de performance para times de desenvolvimento de software",
    creator: {
      name: "Lucas Mendonça",
      url: "/perfil/lucas-mendonca"
    },
    logo: "/images/projects/devmetrics.svg",
    category: "DevTools",
    tags: ["Monitoramento", "DevOps", "Desenvolvimento", "Produtividade"],
    url: "/projetos/devmetrics",
    mrr: "R$ 12K+",
    launched: "2022-11-10",
    metrics: {
      users: "4K+",
      customers: "150+",
      revenue: "R$ 144K+ anual"
    },
    featured: true,
    spotlight: true
  },
  {
    id: "markety",
    title: "Markety",
    description: "Automatização de marketing para e-commerces e marketplaces",
    creator: {
      name: "Carla Fernandes",
      url: "/perfil/carla-fernandes"
    },
    logo: "/images/projects/markety.svg",
    category: "Marketing",
    tags: ["E-commerce", "Automação", "Analytics", "CRM"],
    url: "/projetos/markety",
    mrr: "R$ 18K+",
    launched: "2023-05-22",
    metrics: {
      users: "800+",
      customers: "210+",
      revenue: "R$ 216K+ anual"
    },
    featured: true,
    spotlight: true
  },
  {
    id: "legalease",
    title: "LegalEase",
    description: "Automação de documentos e contratos jurídicos com IA para empresas",
    creator: {
      name: "Ricardo Oliveira",
      url: "/perfil/ricardo-oliveira"
    },
    logo: "/images/projects/legalease.svg",
    category: "Legal",
    tags: ["Jurídico", "IA", "Contratos", "Automação"],
    url: "/projetos/legalease",
    mrr: "R$ 15K+",
    launched: "2023-08-05",
    metrics: {
      users: "500+",
      customers: "120+",
      revenue: "R$ 180K+ anual"
    },
    featured: true
  },
  {
    id: "edutechpro",
    title: "EduTechPro",
    description: "Plataforma de cursos online e comunidade para profissionais de tecnologia",
    creator: {
      name: "Juliana Santos",
      url: "/perfil/juliana-santos"
    },
    logo: "/images/projects/edutechpro.svg",
    category: "Educação",
    tags: ["Cursos", "Comunidade", "Tecnologia", "Carreira"],
    url: "/projetos/edutechpro",
    mrr: "R$ 22K+",
    launched: "2022-07-15",
    metrics: {
      users: "5K+",
      customers: "900+",
      revenue: "R$ 264K+ anual"
    },
    featured: true
  },
  {
    id: "recruita",
    title: "Recruita",
    description: "Plataforma de recrutamento e seleção para startups e empresas de tecnologia",
    creator: {
      name: "Gabriel Almeida",
      url: "/perfil/gabriel-almeida"
    },
    logo: "/images/projects/recruita.svg",
    category: "RH",
    tags: ["Recrutamento", "RH", "Entrevistas", "Gestão de Talentos"],
    url: "/projetos/recruita",
    mrr: "R$ 16K+",
    launched: "2023-03-10",
    metrics: {
      users: "600+",
      customers: "85+",
      revenue: "R$ 192K+ anual"
    },
    featured: true
  }
];
