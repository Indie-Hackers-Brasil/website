'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";

interface Testimonial {
  name: string;
  role: string;
  content: string;
  avatar: string;
  avatarUrl?: string;
  rating?: number;
}

export function TestimonialsSection() {
  const testimonials: Testimonial[] = [
    {
      name: "Pedro Souza",
      role: "Fundador da Planify",
      content:
        "A comunidade Indie Hackers Brasil foi fundamental para o crescimento da minha startup. O feedback e o suporte da comunidade me ajudaram a atingir meu primeiro MRR de R$10K.",
      avatar: "PS",
      rating: 5
    },
    {
      name: "Ana Lima",
      role: "CEO da TaskFlow",
      content:
        "Graças às conexões que fiz na comunidade, consegui encontrar meu co-fundador e lançamos nosso SaaS em tempo recorde. A mentoria de outros membros foi inestimável.",
      avatar: "AL",
      rating: 5
    },
    {
      name: "Rafael Mendes",
      role: "Criador do EmailBoost",
      content:
        "Participar dos eventos e das discussões me abriu os olhos para estratégias de aquisição de clientes que nunca tinha considerado. Dobrei minha base de usuários em 3 meses.",
      avatar: "RM",
      rating: 5
    },
  ];

  // Animation variants for staggered card animations
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
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
    <section className="relative overflow-hidden py-20 md:py-32">
      <div className="absolute inset-0 bg-[url('/patterns/grid.svg')] bg-center opacity-3"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-20 left-0 w-60 h-60 bg-green-300/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-40 right-0 w-60 h-60 bg-emerald-300/10 rounded-full blur-3xl"></div>
      
      <div className="relative px-4 md:px-6">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mb-16 flex flex-col items-center justify-center space-y-4 text-center"
          >
            <motion.span 
              className="inline-flex items-center rounded-full border border-green-200 bg-green-50/80 px-4 py-1.5 text-sm font-medium text-green-800 shadow-md backdrop-blur-sm dark:border-green-800/50 dark:bg-green-900/40 dark:text-green-400"
              whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
            >
              Depoimentos
            </motion.span>
            
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent drop-shadow-sm">
                Histórias de Sucesso
              </span>
            </h2>
            
            <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed">
              Veja como outros empreendedores independentes estão crescendo com nossa comunidade
            </p>
          </motion.div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 gap-8 md:grid-cols-3"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                variants={itemVariants}
                whileHover={{ 
                  y: -10, 
                  scale: 1.02, 
                  transition: { duration: 0.2 } 
                }}
                className="group relative"
              >
                {/* Card glow effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-green-400/5 to-emerald-400/5 rounded-2xl translate-y-4 opacity-0 group-hover:opacity-100 blur-xl transition-all duration-300"></div>
                
                {/* Quote marks decorative element */}
                <div className="absolute -top-5 -left-5 text-green-300/20 dark:text-green-700/20 transform rotate-12">
                  <Quote className="h-16 w-16" strokeWidth={1} />
                </div>
                
                <Card className="relative h-full overflow-hidden border-2 border-green-100/50 bg-white/80 backdrop-blur-md shadow-lg hover:shadow-xl transition-all dark:border-green-900/30 dark:bg-slate-900/60 rounded-2xl z-10">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-16 w-16 border-2 border-green-100 shadow-md dark:border-green-900/50 group-hover:border-green-300 transition-colors duration-300">
                        {testimonial.avatarUrl ? (
                          <AvatarImage src={testimonial.avatarUrl} alt={testimonial.name} />
                        ) : (
                          <AvatarFallback className="bg-gradient-to-br from-green-100 to-emerald-200 text-green-800 text-lg font-semibold dark:from-green-900/50 dark:to-emerald-800/50 dark:text-green-400 group-hover:from-green-200 group-hover:to-emerald-300 transition-colors duration-300">
                            {testimonial.avatar}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-lg">{testimonial.name}</h3>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                        
                        {testimonial.rating && (
                          <div className="mt-1 flex text-amber-500">
                            {[...Array(testimonial.rating)].map((_, i) => (
                              <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.5 + (i * 0.1), duration: 0.3 }}
                              >
                                <Star key={i} className="h-4 w-4 fill-current" />
                              </motion.div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="relative pt-4">
                    <div className="h-0.5 w-16 bg-gradient-to-r from-green-500/30 to-emerald-500/30 mb-4 rounded-full"></div>
                    <Quote className="absolute -left-1 -top-2 h-8 w-8 text-green-200 rotate-180 dark:text-green-800/30" />
                    <p className="pl-6 text-muted-foreground italic">{testimonial.content}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default TestimonialsSection; 
