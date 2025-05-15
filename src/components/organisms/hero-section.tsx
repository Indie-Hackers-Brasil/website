'use client';

import { Button } from '@/components/ui/button';
import { ProjectMarquee } from '@/components/molecules/project-marquee';
import { StatCard } from '@/components/molecules/stat-card';
import { siteConfig } from '@/config/brand';
import { communityStats } from '@/data/stats';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Rocket, Users, Zap } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-20 pb-10 md:pt-32 md:pb-16">
      {/* Logo grid pattern in background */}
      <div className="absolute inset-0 bg-[url('/patterns/grid.svg')] bg-center opacity-3"></div>

      <div className="relative px-4 md:px-6">
        <div className="mx-auto max-w-5xl pb-16 text-center md:pb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mb-6 flex items-center justify-center gap-1.5"
          >
            <motion.span
              className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50/80 px-3.5 py-1.5 text-sm font-medium text-blue-800 shadow-md backdrop-blur-sm dark:border-blue-800/50 dark:bg-blue-900/40 dark:text-blue-400"
              whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
            >
              <Rocket className="mr-1.5 h-4 w-4 animate-pulse" />
              Comunidade Gratuita
            </motion.span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10"
          >
            <h1 className="mb-8 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text pb-2 text-5xl font-bold tracking-tighter text-transparent sm:text-6xl md:text-7xl lg:text-8xl drop-shadow-sm">
              Indie Hackers Brasil
            </h1>

            {/* Decorative elements */}
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-full max-w-3xl h-40 bg-gradient-to-r from-blue-600/20 via-indigo-600/20 to-violet-600/20 blur-3xl opacity-30 rounded-full"></div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 mx-auto mb-12 max-w-[800px] text-xl text-muted-foreground md:text-2xl lg:text-3xl"
          >
            A comunidade definitiva para desenvolvedores, vendedores e designers criarem SaaS
            lucrativos no Brasil
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center justify-center gap-5 sm:flex-row"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Button
                size="lg"
                className="h-14 px-8 text-lg font-medium group bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-xl transition-all relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <Link href="/comunidade" className="flex items-center gap-2 relative z-10">
                  <Users className="h-5 w-5" />
                  Junte-se à Comunidade
                </Link>
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Button
                variant="outline"
                size="lg"
                className="h-14 px-8 text-lg font-medium backdrop-blur-sm border-2 border-indigo-200/50 bg-white/50 shadow-md hover:shadow-xl transition-all group dark:bg-slate-900/40 dark:border-indigo-800/30 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/5 to-indigo-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <Link href="/projetos" className="flex items-center gap-2 relative z-10">
                  <Zap className="h-5 w-5" />
                  Explorar Projetos
                  <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-2" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Stats section with glass morphism */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mb-12 grid max-w-5xl grid-cols-2 gap-4 sm:grid-cols-4 md:gap-6"
        >
          {communityStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
              className="relative"
            >
              <div
                className={`absolute inset-0 rounded-2xl ${
                  index % 2 === 0 ? 'bg-blue-300/5' : 'bg-indigo-300/5'
                } translate-y-2 blur-lg opacity-0 group-hover:opacity-100 transition-all duration-300`}
              ></div>

              <StatCard
                stat={stat}
                highlightValue={true}
                className={`border-2 hover:scale-105 hover:-translate-y-5 duration-300 backdrop-blur-md shadow-lg h-full hover:shadow-xl transition-all ${
                  index % 2 === 0
                    ? 'border-blue-200/50 bg-blue-50/40 dark:border-blue-800/30 dark:bg-blue-900/20'
                    : 'border-indigo-200/50 bg-indigo-50/40 dark:border-indigo-800/30 dark:bg-indigo-900/20'
                }`}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Marquee with projects */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="relative mt-6"
      >
        <div className="absolute left-0 right-0 top-0 h-20 bg-gradient-to-b from-white via-white to-transparent dark:from-slate-950 dark:via-slate-950 dark:to-transparent z-10" />
        <ProjectMarquee />
        <div className="absolute left-0 right-0 bottom-0 h-20 bg-gradient-to-t from-white via-white to-transparent dark:from-slate-950 dark:via-slate-950 dark:to-transparent z-10" />
      </motion.div>
    </section>
  );
}

export default HeroSection;
