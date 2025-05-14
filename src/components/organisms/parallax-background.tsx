'use client'

import { useEffect, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

export function ParallaxBackground() {
  const [windowHeight, setWindowHeight] = useState(0)
  const { scrollY } = useScroll()
  
  // Transform values based on scroll position
  const y1 = useTransform(scrollY, [0, windowHeight * 2], [0, windowHeight * 0.3])
  const y2 = useTransform(scrollY, [0, windowHeight * 2], [0, windowHeight * 0.5])
  const y3 = useTransform(scrollY, [0, windowHeight * 2], [0, windowHeight * 0.7])
  const opacity1 = useTransform(scrollY, [0, windowHeight * 1.5], [0.7, 0.3])
  const opacity2 = useTransform(scrollY, [0, windowHeight * 1.5], [0.5, 0.2])
  const scale1 = useTransform(scrollY, [0, windowHeight * 1.5], [1, 1.3])
  const scale2 = useTransform(scrollY, [0, windowHeight * 1.5], [1, 1.4])
  
  useEffect(() => {
    // Set window height for parallax calculations
    setWindowHeight(window.innerHeight)
    
    const handleResize = () => {
      setWindowHeight(window.innerHeight)
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Main gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50 via-indigo-50/50 to-purple-50/30 dark:from-blue-950/20 dark:via-indigo-950/10 dark:to-purple-950/5" />
      
      {/* Animated gradient shapes */}
      <motion.div 
        style={{ y: y1, opacity: opacity1, scale: scale1 }}
        className="absolute -top-20 -left-20 h-[400px] w-[400px] rounded-full bg-gradient-to-br from-blue-400/20 to-blue-600/10 blur-3xl"
      />
      
      <motion.div 
        style={{ y: y2, opacity: opacity2, scale: scale2 }}
        className="absolute top-[30%] -right-20 h-[500px] w-[500px] rounded-full bg-gradient-to-bl from-indigo-400/20 to-purple-600/10 blur-3xl"
      />
      
      <motion.div 
        style={{ y: y3, opacity: opacity1, scale: scale1 }}
        className="absolute -bottom-40 left-[20%] h-[600px] w-[600px] rounded-full bg-gradient-to-tr from-emerald-400/20 to-blue-600/10 blur-3xl"
      />
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[url('/patterns/grid.svg')] bg-center opacity-5 dark:opacity-3" />
      
      {/* Noise texture overlay */}
      <div className="absolute inset-0 bg-[url('/patterns/noise.png')] bg-repeat opacity-[0.02] mix-blend-overlay" />
    </div>
  )
}

export default ParallaxBackground 
