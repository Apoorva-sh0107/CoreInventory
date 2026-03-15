'use client';

import { motion } from 'framer-motion';
import InteractiveBubbles from './InteractiveBubbles';

interface FloatingOrbProps {
  size: number;
  x: string;
  y: string;
  delay?: number;
  duration?: number;
  color?: string;
}

// Floating orb component
function FloatingOrb({ size, x, y, delay, duration, color }: FloatingOrbProps) {
  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        width: size,
        height: size,
        left: x,
        top: y,
        background: color || 'rgba(255,255,255,0.06)',
        filter: 'blur(1px)',
      }}
      animate={{
        y: [0, -30, 0],
        opacity: [0.3, 0.7, 0.3],
        scale: [1, 1.15, 1],
      }}
      transition={{
        duration: duration || 6,
        delay: delay || 0,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
  index: number;
}

// Feature card component with staggered entrance
function FeatureCard({ icon, title, desc, index }: FeatureCardProps) {
  return (
    <motion.div
      className="flex items-center gap-4 rounded-2xl px-5 py-4"
      style={{
        background: 'rgba(255,255,255,0.07)',
        border: '1px solid rgba(255,255,255,0.1)',
        backdropFilter: 'blur(12px)',
      }}
      initial={{ opacity: 0, x: -40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, delay: 0.3 + index * 0.15, ease: 'easeOut' }}
      whileHover={{
        background: 'rgba(255,255,255,0.12)',
        x: 8,
        transition: { duration: 0.2 },
      }}
    >
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center text-lg"
        style={{ background: 'rgba(255,255,255,0.1)' }}
      >
        {icon}
      </div>
      <div>
        <p className="text-white font-semibold text-sm">{title}</p>
        <p className="text-white/40 text-xs mt-0.5">{desc}</p>
      </div>
    </motion.div>
  );
}

interface AuthLayoutProps {
  children: React.ReactNode;
  showBubbles?: boolean;
}

export default function AuthLayout({ children, showBubbles = true }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex">
      {/* ─── LEFT PANEL ─── */}
      <div
        className="hidden lg:flex lg:w-[48%] relative overflow-hidden flex-col items-center justify-center"
        style={{
          background: 'linear-gradient(160deg, #714B67 0%, #4A2545 45%, #2D1B30 100%)',
        }}
      >
        {/* Subtle dot grid */}
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />

        {/* Interactive bubbles — react to cursor */}
        {showBubbles && <InteractiveBubbles />}
        {/* Spinning ring */}
        <motion.div
          className="absolute"
          style={{
            width: 300,
            height: 300,
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '50%',
            top: '50%',
            left: '50%',
            marginTop: -150,
            marginLeft: -150,
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute"
          style={{
            width: 220,
            height: 220,
            border: '1px solid rgba(255,255,255,0.04)',
            borderRadius: '50%',
            top: '50%',
            left: '50%',
            marginTop: -110,
            marginLeft: -110,
          }}
          animate={{ rotate: -360 }}
          transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
        />

        {/* Content */}
        <div className="relative z-10 w-full max-w-[340px] px-6">
          {/* ── LOGO PLACEHOLDER ──
              Replace the SVG below with your own logo:
              <img src="/your-logo.png" alt="Logo" className="w-16 h-16" />
          */}
          <motion.div
            className="mb-10 flex justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.15)' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
              </svg>
            </div>
          </motion.div>

          {/* Headline */}
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-white text-2xl font-bold tracking-tight">Bold Stock</h2>
            <p className="text-white/40 text-sm mt-2 font-medium">Smarter inventory, faster decisions</p>
          </motion.div>

          {/* Feature cards highlighting product value */}
          <div className="space-y-3.5">
            <FeatureCard 
              icon={<svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>} 
              title="Smart Inventory" 
              desc="Track stock levels across locations instantly." 
              index={0} 
            />
            <FeatureCard 
              icon={<svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>} 
              title="Real-Time Alerts" 
              desc="Get notified instantly when stock runs low." 
              index={1} 
            />
            <FeatureCard 
              icon={<svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8 14h10M8 10h10M4 18h16a2 2 0 002-2V8a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>} 
              title="Delivery Control" 
              desc="Monitor incoming and outgoing shipments." 
              index={2} 
            />
            <FeatureCard 
              icon={<svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 3v18h18M9 9l3 3 3-3 4 4" /></svg>} 
              title="Live Insights" 
              desc="View operational data in real time." 
              index={3} 
            />
          </div>

          {/* Bottom tagline */}
          <motion.div
            className="mt-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <p className="text-white/25 text-[11px] font-medium leading-relaxed tracking-wide">
              Track · Manage · Scale<br />Enterprise-grade inventory at your fingertips
            </p>
          </motion.div>
        </div>
      </div>

      {/* ─── RIGHT PANEL ─── */}
      <div
        className="w-full lg:w-[52%] relative flex items-center justify-center px-8 lg:px-12 py-10 lg:py-16 overflow-hidden"
        style={{
          background: 'radial-gradient(circle at top left, #F5E9FF 0%, #F9F5FF 45%, #F3F0FF 100%)',
        }}
      >
        {/* Soft glow accent - top right */}
        <div className="pointer-events-none absolute -top-24 -right-10 w-80 h-80 rounded-full bg-white/60 blur-[100px]" />
        
        {/* Soft glow accent - bottom left */}
        <div className="pointer-events-none absolute -bottom-20 -left-10 w-64 h-64 rounded-full bg-[#E0D7FF]/30 blur-[80px]" />

        <motion.div
          className="w-full max-w-[560px] relative z-10"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}
