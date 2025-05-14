export interface Stat {
  value: string;
  label: string;
  description?: string;
}

export const communityStats: Stat[] = [
  {
    value: "500+",
    label: "Criadores",
    description: "Empreendedores independentes criando SaaS no Brasil"
  },
  {
    value: "150+",
    label: "Projetos",
    description: "SaaS brasileiros lançados pela comunidade"
  },
  {
    value: "R$ 1M+",
    label: "MRR Total",
    description: "Receita mensal recorrente gerada pelos membros"
  },
  {
    value: "15K+",
    label: "Usuários",
    description: "Pessoas usando produtos da comunidade"
  }
];

export const annualEvents: Stat[] = [
  {
    value: "24",
    label: "Meetups",
    description: "Encontros presenciais organizados pela comunidade"
  },
  {
    value: "12",
    label: "Workshops",
    description: "Workshops técnicos e de negócios"
  },
  {
    value: "4",
    label: "Hackathons",
    description: "Competições para construir MVPs em 48 horas"
  },
  {
    value: "1",
    label: "Conferência",
    description: "Evento anual com palestrantes nacionais e internacionais"
  }
]; 
