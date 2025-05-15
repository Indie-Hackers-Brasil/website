'use client'

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ProjectCard } from "@/components/molecules/project-card";
import { projects } from "@/data/projects";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

export function FeaturedProjects() {
  // Get only featured projects (up to 6)
  const featuredProjects = projects.filter(project => project.featured).slice(0, 6);

  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
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
    <section className="relative overflow-hidden py-20 md:py-32 bg-slate-50/80 backdrop-blur-sm dark:bg-slate-950/80">
      <div className="absolute inset-0 bg-[url('/patterns/grid.svg')] bg-center opacity-3"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-40 left-0 w-40 h-40 bg-indigo-300/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-60 h-60 bg-purple-300/10 rounded-full blur-3xl"></div>
      
      <div className="relative px-4 md:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 flex flex-col items-center justify-center space-y-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50/80 px-4 py-1.5 text-sm font-medium text-indigo-800 shadow-md backdrop-blur-sm dark:border-indigo-800/50 dark:bg-indigo-900/40 dark:text-indigo-400"
            >
              <Sparkles className="mr-1.5 h-4 w-4 animate-pulse" />
              Projetos em Destaque
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent drop-shadow-sm"
            >
              SaaS Brasileiros de Sucesso
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-xl/relaxed"
            >
              Conheça alguns dos projetos incríveis criados por membros da nossa comunidade
            </motion.p>
          </div>
          
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
          >
            {featuredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                variants={itemVariants}
                whileHover={{ 
                  y: -10, 
                  transition: { duration: 0.2 },
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 rounded-2xl translate-y-4 blur-xl opacity-0 group-hover:opacity-70 transition-all duration-300"></div>
                <ProjectCard
                  title={project.title}
                  description={project.description}
                  creator={project.creator.name}
                  category={project.category}
                  url={project.url}
                  mrr={project.mrr}
                />
              </motion.div>
            ))}
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="mt-20 flex justify-center"
          >
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <Button 
                variant="outline" 
                size="lg" 
                asChild 
                className="group h-14 px-8 border-2 border-indigo-200/50 bg-white/80 backdrop-blur-sm shadow-md hover:shadow-xl hover:border-indigo-300 transition-all dark:bg-slate-900/60 dark:border-indigo-800/50 dark:hover:border-indigo-700 relative overflow-hidden"
              >
                <Link href="/projetos" className="group flex items-center gap-2 font-medium relative z-10">
                  <span className="absolute inset-0 bg-gradient-to-r from-indigo-400/5 to-purple-400/5 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Ver Todos os Projetos
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-2" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default FeaturedProjects; 
