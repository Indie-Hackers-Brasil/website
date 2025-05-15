'use client'

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Rocket } from "lucide-react";

export function CTASection() {
  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      <div className="absolute inset-0 bg-[url('/patterns/grid.svg')] bg-center opacity-3"></div>
      
      {/* Animated gradient blobs */}
      <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-blue-400/10 blur-3xl animate-pulse" />
      <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-indigo-400/10 blur-3xl animate-pulse animation-delay-2000" />
      
      <div className="relative px-4 md:px-6">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-[900px] rounded-3xl border-2 border-blue-100/50 p-8 shadow-xl backdrop-blur-md md:p-14 bg-gradient-to-br from-white/80 via-white/70 to-blue-50/70 dark:from-slate-900/60 dark:via-slate-900/50 dark:to-blue-900/40 dark:border-blue-800/30 dark:shadow-2xl"
        >
          <div className="absolute inset-0 rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5"></div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center justify-center space-y-6 text-center relative z-10"
          >
            <motion.span 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50/80 px-4 py-1.5 text-sm font-medium text-blue-800 shadow-md backdrop-blur-sm dark:border-blue-800/50 dark:bg-blue-900/40 dark:text-blue-400"
            >
              <Rocket className="mr-1.5 h-4 w-4" />
              100% Gratuito
            </motion.span>
            
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent drop-shadow-sm">
              Pronto para iniciar sua jornada?
            </h2>
            
            <p className="max-w-[650px] text-muted-foreground md:text-xl/relaxed lg:text-2xl/relaxed">
              Junte-se a centenas de criadores independentes que estão construindo o futuro do SaaS no Brasil
            </p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="mt-10 flex flex-col gap-4 sm:flex-row"
            >
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <Button size="lg" className="h-14 px-10 text-base font-medium group bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-xl transition-all overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <Link href="/comunidade" className="flex items-center gap-2 relative z-10">
                    Entrar na Comunidade
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-2" />
                  </Link>
                </Button>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <Button variant="outline" size="lg" className="h-14 px-10 text-base font-medium backdrop-blur-sm border-2 border-blue-200/50 bg-white/50 shadow-md hover:shadow-xl transition-all group dark:bg-slate-900/40 dark:border-blue-800/30 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400/5 to-indigo-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <Link href="/sobre" className="relative z-10">Saiba Mais</Link>
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export default CTASection; 
