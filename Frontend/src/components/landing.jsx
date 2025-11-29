import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Wallet, ArrowRight, ChevronRight, Shield, Zap, Users, Award, CheckCircle, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

// Custom components for better organization
const AnimatedCard = ({ children, delay = 0 }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      className="h-full"
    >
      {children}
    </motion.div>
  );
};

// Gradient Blur Transition Component - Fixed z-index
const GradientBlurTransition = ({ position = "top" }) => {
  return (
    <div className={`absolute ${position === "top" ? "top-0" : "bottom-0"} left-0 right-0 h-32 pointer-events-none z-10`}>
      <div className={`absolute inset-0 bg-gradient-to-b ${
        position === "top" 
          ? "from-gray-950/80 via-gray-950/40 to-transparent" 
          : "from-transparent via-gray-950/40 to-gray-950/80"
      } backdrop-blur-sm`} />
    </div>
  );
};

// Electric Border Effect Component
const ElectricBorder = () => {
  return (
    <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500 opacity-70 animate-pulse"></div>
      <div className="absolute inset-[1px] bg-gray-900 rounded-xl"></div>
      {/* Electric sparks */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-3 bg-blue-400 rounded-full"
          style={{
            left: `${(i * 100) / 7}%`,
            top: i % 2 === 0 ? '-2px' : 'auto',
            bottom: i % 2 !== 0 ? '-2px' : 'auto',
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}
    </div>
  );
};

// Crystal Shine Effect Component
const CrystalShine = () => {
  return (
    <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
      <motion.div
        className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-white/30 to-transparent rounded-full blur-xl"
        animate={{
          x: [-100, 300],
          y: [-50, 150],
          opacity: [0, 0.3, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatType: "loop",
        }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-purple-400/20 to-transparent rounded-full blur-lg"
        animate={{
          x: [100, -200],
          y: [50, -100],
          opacity: [0, 0.4, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          repeatType: "loop",
          delay: 1,
        }}
      />
    </div>
  );
};

// Floating Particles for Navbar
const NavbarParticles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-xl">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-purple-400/40 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  );
};

// Vanta Waves Component for CTA Section with Footer
const VantaWavesSection = () => {
  const [vantaEffect, setVantaEffect] = useState(null);
  const vantaRef = useRef(null);
  const [vantaLoaded, setVantaLoaded] = useState(false);

  useEffect(() => {
    let effect = null;

    const initVanta = async () => {
      try {
        // Import THREE and make it globally available
        const THREE = await import('three');
        if (!window.THREE) window.THREE = THREE;
        
        // Dynamically import Vanta WAVES
        const { default: WAVES } = await import('vanta/dist/vanta.waves.min');
        
        effect = WAVES({
          el: vantaRef.current,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.00,
          minWidth: 200.00,
          scale: 1.00,
          scaleMobile: 1.00,
          shininess: 90.00,
          waveHeight: 18.00,
          waveSpeed: 1.10,
          zoom: 0.90,
          color: 0x0a0a0a,
          backgroundColor: 0x05020b
        });
        
        setVantaEffect(effect);
        setVantaLoaded(true);
      } catch (error) {
        console.error('Failed to load Vanta WAVES:', error);
        setVantaLoaded(true);
      }
    };

    if (typeof window !== 'undefined') {
      initVanta();
    }

    return () => {
      if (effect) {
        effect.destroy();
      }
    };
  }, []);

  return (
    <section className="relative overflow-hidden">
      {/* Vanta.js WAVES Background Container */}
      <div ref={vantaRef} className="absolute inset-0 z-0">
        {/* Fallback background */}
        {!vantaLoaded && (
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-black">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-600/10 via-gray-900/80 to-black" />
          </div>
        )}
      </div>
      
      {/* Top Gradient Blur Transition */}
      <GradientBlurTransition position="top" />
      
      {/* CTA Content - Increased z-index */}
      <div className="relative z-30 py-20">
        <div className="max-w-4xl mx-auto text-center px-6">
          <motion.h2 
            className="text-4xl md:text-5xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            Ready to Transform Academic Rewards?
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto backdrop-blur-sm bg-black/20 rounded-lg p-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            viewport={{ once: true }}
          >
            Join leading institutions using CampusWallet to create engaging, secure reward ecosystems for your students.
          </motion.p>
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link 
                to="/signup" 
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 font-semibold flex items-center justify-center gap-2 shadow-2xl shadow-purple-500/25 backdrop-blur-sm"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <button className="text-white font-semibold px-8 py-4 rounded-xl border-2 border-purple-500/50 hover:border-purple-400 hover:bg-purple-400/10 transition-all duration-300 backdrop-blur-sm bg-black/20">
                Schedule a Demo
              </button>
            </motion.div>
          </motion.div>

          {/* Footer inside Waves Section */}
          <motion.div 
            className="border-t border-gray-800/50 pt-12 mt-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="flex flex-col md:flex-row justify-between items-center">
              <motion.div 
                className="flex items-center gap-3 text-white font-bold text-lg mb-6 md:mb-0"
                whileHover={{ scale: 1.05 }}
              >
                <Wallet className="w-6 h-6 text-purple-400" />
                <span>CampusWallet</span>
              </motion.div>
              <div className="flex gap-8 text-gray-400 mb-6 md:mb-0">
                {['Privacy', 'Terms', 'Security'].map((item) => (
                  <motion.div key={item} whileHover={{ scale: 1.05 }}>
                    <Link 
                      to={`/${item.toLowerCase()}`}
                      className="hover:text-purple-400 transition-colors font-medium backdrop-blur-sm px-3 py-1 rounded-lg hover:bg-black/20"
                    >
                      {item}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
            <motion.div 
              className="text-center text-gray-500 text-sm mt-8 pt-6 border-t border-gray-800/30"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              viewport={{ once: true }}
            >
              © 2025 CampusWallet. All rights reserved. Built on Aptos Blockchain.
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Gradient Blur Transition */}
      <GradientBlurTransition position="bottom" />
    </section>
  );
};

// Vanta Cells Component for Features Section
const VantaCellsSection = () => {
  const [vantaEffect, setVantaEffect] = useState(null);
  const vantaRef = useRef(null);
  const [vantaLoaded, setVantaLoaded] = useState(false);

  useEffect(() => {
    let effect = null;

    const initVanta = async () => {
      try {
        // Import THREE and make it globally available
        const THREE = await import('three');
        if (!window.THREE) window.THREE = THREE;
        
        // Dynamically import Vanta CELLS
        const { default: CELLS } = await import('vanta/dist/vanta.cells.min');
        
        effect = CELLS({
          el: vantaRef.current,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.00,
          minWidth: 200.00,
          scale: 1.00,
          color1: 0x0,
          color2: 0xb0b36,
          size: 2.40,
          speed: 3.00
        });
        
        setVantaEffect(effect);
        setVantaLoaded(true);
      } catch (error) {
        console.error('Failed to load Vanta CELLS:', error);
        setVantaLoaded(true);
      }
    };

    if (typeof window !== 'undefined') {
      initVanta();
    }

    return () => {
      if (effect) {
        effect.destroy();
      }
    };
  }, []);

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Vanta.js CELLS Background Container */}
      <div ref={vantaRef} className="absolute inset-0 z-0">
        {/* Fallback background */}
        {!vantaLoaded && (
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-gray-950">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-800/10 via-gray-950/80 to-gray-950" />
          </div>
        )}
      </div>
      
      {/* Top Gradient Blur Transition */}
      <GradientBlurTransition position="top" />
      
      {/* Content Overlay - Increased z-index */}
      <div className="relative z-30 max-w-7xl mx-auto px-6">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Trusted by Leading Institutions
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto backdrop-blur-sm bg-black/20 rounded-lg p-4">
            Enterprise-grade infrastructure for the future of academic rewards
          </p>
        </motion.div>

        <FeatureGrid />

        {/* Advanced Feature Showcase */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mt-20"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div>
            <h3 className="text-3xl font-bold text-white mb-6">
              Secure Digital Asset Management
            </h3>
            <p className="text-gray-300 mb-6 leading-relaxed backdrop-blur-sm bg-black/20 rounded-lg p-4">
              Multi-signature wallets, cold storage integration, and comprehensive audit trails 
              ensure the highest level of security for student rewards and institutional assets.
            </p>
            <ul className="space-y-4">
              {[
                "Multi-signature security protocols",
                "Real-time transaction monitoring",
                "Compliance and reporting tools",
                "Automated audit trails",
                "Cold storage integration"
              ].map((item, index) => (
                <motion.li 
                  key={item}
                  className="flex items-center gap-3 backdrop-blur-sm bg-black/20 rounded-lg p-3"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <span className="text-gray-300">{item}</span>
                </motion.li>
              ))}
            </ul>
          </div>
          <motion.div 
            className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-3xl p-8 h-96 flex items-center justify-center relative overflow-hidden border border-gray-700 backdrop-blur-sm"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-blue-500/10" />
            <div className="text-center text-white relative z-10">
              <div className="w-20 h-20 bg-emerald-400/10 rounded-2xl mx-auto mb-6 flex items-center justify-center backdrop-blur-sm border border-emerald-400/20">
                <Wallet className="w-10 h-10 text-emerald-400" />
              </div>
              <p className="text-xl font-semibold text-white">Interactive Wallet Demo</p>
              <p className="text-gray-300 mt-2">Experience our secure platform</p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom Gradient Blur Transition */}
      <GradientBlurTransition position="bottom" />
    </section>
  );
};

const FeatureGrid = () => {
  const features = [
    {
      icon: Shield,
      title: "Military-Grade Security",
      description: "256-bit encryption with multi-signature wallets and cold storage integration",
      color: "emerald"
    },
    {
      icon: Zap,
      title: "Instant Settlement",
      description: "Real-time reward distribution with sub-second transaction finality",
      color: "blue"
    },
    {
      icon: Users,
      title: "Scalable Infrastructure",
      description: "Enterprise-ready platform supporting millions of concurrent users",
      color: "purple"
    },
    {
      icon: Award,
      title: "Smart Rewards",
      description: "AI-powered reward distribution based on academic achievements",
      color: "amber"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {features.map((feature, index) => (
        <AnimatedCard key={feature.title} delay={index * 0.1}>
          <motion.div 
            className="bg-gray-900/80 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-gray-700 hover:border-purple-500/50 transition-all duration-300 h-full group hover:scale-105"
            whileHover={{ y: -5 }}
          >
            <div className={`w-14 h-14 rounded-2xl bg-${feature.color}-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-${feature.color}-500/20`}>
              <feature.icon className={`w-7 h-7 text-${feature.color}-400`} />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
            <p className="text-gray-300 leading-relaxed">{feature.description}</p>
          </motion.div>
        </AnimatedCard>
      ))}
    </div>
  );
};

const ParticleBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-emerald-400/30 rounded-full"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          animate={{
            y: [null, -100, 100],
            x: [null, 50, -50],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            delay: Math.random() * 5,
          }}
        />
      ))}
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={i + 15}
          className="absolute w-0.5 h-0.5 bg-blue-400/20 rounded-full"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          animate={{
            y: [null, -150, 150],
            x: [null, -30, 30],
            opacity: [0, 0.5, 0],
          }}
          transition={{
            duration: Math.random() * 15 + 15,
            repeat: Infinity,
            delay: Math.random() * 8,
          }}
        />
      ))}
    </div>
  );
};

const StarField = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(50)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-0.5 h-0.5 bg-white rounded-full"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            opacity: Math.random() * 0.7 + 0.3,
          }}
          animate={{
            opacity: [0.3, 1, 0.3],
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Infinity,
            delay: Math.random() * 5,
          }}
        />
      ))}
    </div>
  );
};

const VantaHeroSection = () => {
  const [vantaEffect, setVantaEffect] = useState(null);
  const vantaRef = useRef(null);
  const [vantaLoaded, setVantaLoaded] = useState(false);

  useEffect(() => {
    let effect = null;

    const initVanta = async () => {
      try {
        // Import THREE and make it globally available
        const THREE = await import('three');
        if (!window.THREE) window.THREE = THREE;
        
        // Dynamically import Vanta to avoid SSR issues
        const { default: NET } = await import('vanta/dist/vanta.net.min');
        
        effect = NET({
          el: vantaRef.current,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.00,
          minWidth: 200.00,
          scale: 1.00,
          scaleMobile: 1.00,
          color:0x141da2,
          backgroundColor: 0x05020b,
          points: 18,
          maxDistance: 20,
          spacing: 15,
          showDots: true
        });
        
        setVantaEffect(effect);
        setVantaLoaded(true);
      } catch (error) {
        console.error('Failed to load Vanta.js:', error);
        setVantaLoaded(true);
      }
    };

    if (typeof window !== 'undefined') {
      initVanta();
    }

    return () => {
      if (effect) {
        effect.destroy();
      }
    };
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Vanta.js Background Container */}
      <div ref={vantaRef} className="absolute inset-0 z-0">
        {/* Fallback background in case Vanta fails to load */}
        {!vantaLoaded && (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900 to-black">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-600/20 via-gray-900/80 to-black" />
          </div>
        )}
      </div>
      
      {/* Bottom Gradient Blur Transition */}
      <GradientBlurTransition position="bottom" />
      
      {/* Content - Increased z-index */}
      <div className="relative z-30 max-w-7xl mx-auto px-6 w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 text-purple-400 text-sm font-semibold mb-8 border border-purple-500/20 backdrop-blur-sm"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
            </span>
            Live on Aptos Testnet
          </motion.div>

          <motion.h1 
            className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Institutional-Grade <br />
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Academic Rewards
            </span>
          </motion.h1>

          <motion.p 
            className="text-xl text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed backdrop-blur-sm bg-black/20 rounded-lg p-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Secure, scalable blockchain infrastructure for educational institutions to reward student achievements. 
            Built on Aptos blockchain for enterprise-grade security and performance.
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link 
                to="/signup" 
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 font-semibold flex items-center gap-2 shadow-2xl shadow-purple-500/25 backdrop-blur-sm"
              >
                Start Earning Now
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <button className="text-white font-semibold px-8 py-4 rounded-xl border-2 border-purple-500/50 hover:border-purple-400 hover:bg-purple-400/10 transition-all duration-300 flex items-center gap-2 backdrop-blur-sm bg-black/20">
                Contact Sales
                <ChevronRight className="w-5 h-5" />
              </button>
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mt-20"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
        >
          {[
            { value: "99.9%", label: "Uptime SLA", description: "Enterprise-grade reliability" },
            { value: "Instant", label: "Settlement", description: "Real-time reward distribution" },
            { value: "256-bit", label: "Encryption", description: "Military-grade security" }
          ].map((stat, index) => (
            <AnimatedCard key={stat.label} delay={1 + index * 0.2}>
              <div className="text-center p-8 bg-gray-900/80 backdrop-blur-md rounded-2xl shadow-xl border border-gray-800 hover:border-purple-500/50 transition-all duration-300 group hover:scale-105">
                <div className="text-3xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                  {stat.value}
                </div>
                <div className="text-gray-300 font-medium">{stat.label}</div>
                <p className="text-gray-500 text-sm mt-2">{stat.description}</p>
              </div>
            </AnimatedCard>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

const Landing = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans overflow-hidden">
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-950 to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-800/10 via-gray-950/80 to-gray-950" />
        <ParticleBackground />
        <StarField />
      </div>

      {/* Enhanced Navbar with Glass Effect, Crystal Shine, and Electric Effects */}
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'py-2' : 'py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative">
            {/* Electric Border */}
            <ElectricBorder />
            
            {/* Crystal Shine Effect */}
            <CrystalShine />
            
            {/* Floating Particles */}
            <NavbarParticles />
            
            {/* Glass Morphism Background */}
            <div className="relative bg-gray-900/20 backdrop-blur-2xl rounded-xl border border-white/10 shadow-2xl">
              <nav className="relative z-10 flex justify-between items-center px-6 py-4">
                <motion.div 
                  className="flex items-center gap-3 text-white font-bold text-xl"
                  whileHover={{ scale: 1.05 }}
                >
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className="relative"
                  >
                    <Wallet className="w-8 h-8 text-purple-400" />
                    {/* Sparkle effect on logo */}
                    <motion.div
                      className="absolute -top-1 -right-1"
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.7, 1, 0.7],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                      }}
                    >
                      <Sparkles className="w-3 h-3 text-blue-400" />
                    </motion.div>
                  </motion.div>
                  <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                    CampusWallet
                  </span>
                </motion.div>
                
                <div className="flex items-center gap-6">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link 
                      to="/login" 
                      className="text-gray-300 hover:text-white font-medium transition-all duration-300 px-4 py-2 rounded-lg hover:bg-white/5 backdrop-blur-sm border border-transparent hover:border-white/10 relative overflow-hidden group"
                    >
                      <span className="relative z-10">Login</span>
                      {/* Hover electric effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-blue-500/10 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:scale-110"></div>
                    </Link>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link 
                      to="/signup" 
                      className="relative bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 font-medium flex items-center gap-2 shadow-2xl shadow-purple-500/25 backdrop-blur-sm overflow-hidden group"
                    >
                      {/* Electric pulse effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                      
                      <span className="relative z-10">Get Started</span>
                      <ArrowRight className="w-4 h-4 relative z-10" />
                      
                      {/* Sparkles around button */}
                      <motion.div
                        className="absolute -top-1 -left-1"
                        animate={{
                          scale: [1, 1.5, 1],
                          opacity: [0, 1, 0],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: 0.5,
                        }}
                      >
                        <Sparkles className="w-2 h-2 text-blue-300" />
                      </motion.div>
                      <motion.div
                        className="absolute -bottom-1 -right-1"
                        animate={{
                          scale: [1, 1.5, 1],
                          opacity: [0, 1, 0],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: 1,
                        }}
                      >
                        <Sparkles className="w-2 h-2 text-purple-300" />
                      </motion.div>
                    </Link>
                  </motion.div>
                </div>
              </nav>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Add padding to account for fixed navbar */}
      <div className="pt-24">
        <VantaHeroSection />
      </div>

      {/* Features Section with Vanta CELLS */}
      <VantaCellsSection />

      {/* CTA Section with Vanta WAVES (includes footer) */}
      <VantaWavesSection />
    </div>
  );
};

export default Landing;