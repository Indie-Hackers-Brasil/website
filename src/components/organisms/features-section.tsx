'use client'

import { motion } from "framer-motion";
import { 
  Users, 
  Lightbulb, 
  GraduationCap, 
  Handshake, 
  Calendar, 
  Layout,
  LucideIcon 
} from "lucide-react";

interface Feature {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  gradient: string;
  iconBg: string;
  borderColor: string;
}

export function FeaturesSection() {
  const features: Feature[] = [
    {
      title: "Comunidade Ativa",
      description: "Conecte-se com outros criadores independentes, compartilhe ideias e receba feedback valioso",
      icon: Users,
      color: "text-blue-500 dark:text-blue-400",
      gradient: "from-blue-500/10 to-blue-500/5",
      iconBg: "bg-blue-100 dark:bg-blue-900/50",
      borderColor: "border-blue-200/50 dark:border-blue-800/30"
    },
    {
      title: "Recursos e Ferramentas",
      description: "Acesse guias, ferramentas e recursos exclusivos para acelerar o crescimento do seu SaaS",
      icon: Lightbulb,
      color: "text-amber-500 dark:text-amber-400",
      gradient: "from-amber-500/10 to-amber-500/5",
      iconBg: "bg-amber-100 dark:bg-amber-900/50",
      borderColor: "border-amber-200/50 dark:border-amber-800/30"
    },
    {
      title: "Mentoria",
      description: "Aprenda com empreendedores experientes que já construíram SaaS lucrativos do zero",
      icon: GraduationCap,
      color: "text-purple-500 dark:text-purple-400",
      gradient: "from-purple-500/10 to-purple-500/5",
      iconBg: "bg-purple-100 dark:bg-purple-900/50",
      borderColor: "border-purple-200/50 dark:border-purple-800/30"
    },
    {
      title: "Parcerias Estratégicas",
      description: "Encontre parceiros para colaborações, desde co-fundadores até fornecedores de serviços",
      icon: Handshake,
      color: "text-green-500 dark:text-green-400",
      gradient: "from-green-500/10 to-green-500/5",
      iconBg: "bg-green-100 dark:bg-green-900/50",
      borderColor: "border-green-200/50 dark:border-green-800/30"
    },
    {
      title: "Eventos Exclusivos",
      description: "Participe de eventos online e presenciais para expandir seu conhecimento e networking",
      icon: Calendar,
      color: "text-red-500 dark:text-red-400",
      gradient: "from-red-500/10 to-red-500/5",
      iconBg: "bg-red-100 dark:bg-red-900/50",
      borderColor: "border-red-200/50 dark:border-red-800/30"
    },
    {
      title: "Showcase de Projetos",
      description: "Exiba seu SaaS para a comunidade e atraia usuários, investidores e talentos",
      icon: Layout,
      color: "text-indigo-500 dark:text-indigo-400",
      gradient: "from-indigo-500/10 to-indigo-500/5",
      iconBg: "bg-indigo-100 dark:bg-indigo-900/50",
      borderColor: "border-indigo-200/50 dark:border-indigo-800/30"
    },
  ];

  // Animation variants for containers
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.7, 
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  return (
    <section className="relative py-20 md:py-32">
      <div className="absolute inset-0 bg-[url('/patterns/grid.svg')] bg-center opacity-3"></div>
      
      <div className="px-4 md:px-6">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mb-16 flex flex-col items-center justify-center space-y-4 text-center"
          >
            <span className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50/80 px-4 py-1.5 text-sm font-medium text-indigo-800 shadow-md backdrop-blur-sm dark:border-indigo-800/50 dark:bg-indigo-900/40 dark:text-indigo-400">
              Benefícios Exclusivos
            </span>
            
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent drop-shadow-sm">
                O que oferecemos
              </span>
            </h2>
            
            <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed">
              Tudo o que você precisa para transformar sua ideia em um SaaS de sucesso
            </p>
          </motion.div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 gap-8 sm:gap-8 md:grid-cols-2 lg:grid-cols-3"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group relative"
                whileHover={{ y: -10, transition: { duration: 0.2 } }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-2xl translate-y-4 blur-xl opacity-0 group-hover:opacity-70 transition-all duration-300`}></div>
                
                <div className={`h-full overflow-hidden rounded-2xl backdrop-blur-sm border-2 ${feature.borderColor} bg-white/50 shadow-lg transition-all hover:shadow-xl dark:bg-slate-900/50`}>
                  <div className={`relative h-full p-8`}>
                    <div className="relative space-y-5">
                      <div className={`flex h-16 w-16 items-center justify-center rounded-xl ${feature.iconBg} shadow-lg ${feature.color} transition-transform group-hover:scale-110 group-hover:rotate-3`}>
                        <feature.icon className="h-8 w-8" strokeWidth={1.5} />
                      </div>
                      
                      <div>
                        <h3 className="text-xl font-bold">{feature.title}</h3>
                        <div className="h-0.5 w-20 bg-gradient-to-r from-blue-500/30 to-indigo-500/30 mt-2 mb-3 rounded-full"></div>
                        <p className="text-muted-foreground">{feature.description}</p>
                      </div>
                      
                      <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-slate-100/50 to-white/0 dark:from-slate-800/30 dark:to-slate-900/0 rounded-tl-3xl -mb-8 -mr-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection; 
