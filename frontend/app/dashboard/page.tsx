'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useInventory } from '@/context/InventoryContext';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, animate } from 'framer-motion';

// --- Animation Helper: Number Counter ---
const Counter = ({ value, prefix = "", isCurrency = false }: { value: number, prefix?: string, isCurrency?: boolean }) => {
  const nodeRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = nodeRef.current;
    if (node) {
      const controls = animate(0, value, {
        duration: 1.2,
        ease: "easeOut",
        onUpdate(v) {
          const formatted = Math.floor(v).toLocaleString('en-US');
          node.textContent = `${prefix}${formatted}`;
        }
      });
      return () => controls.stop();
    }
  }, [value, prefix, isCurrency]);

  return <span ref={nodeRef}>{prefix}0</span>;
};

// --- Icons ---
const MenuIcon = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const XIcon = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const BoxIcon = () => (
  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
);

const TruckIcon = () => (
  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 14h10M8 10h10M4 18h16a2 2 0 002-2V8a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

export default function DashboardPage() {
  const { user, logout, isAuthenticated, loading } = useAuth();
  const { products, operations, receipts, deliveries, loading: invLoading } = useInventory();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Handle client-side redirect
  useEffect(() => {
    setMounted(true);
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);

  // Dynamic Data Stats
  const inventoryStats = {
    totalProducts: products.length,
    lowStockItems: products.filter(p => p.onHand > 0 && p.onHand < 20).length,
    outOfStock: products.filter(p => p.onHand === 0).length,
    receiptsToReceive: receipts ? receipts.filter(r => r.status !== 'Done').length : 0,
    deliveriesToDeliver: deliveries ? deliveries.filter(d => d.status !== 'Done').length : 0
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const operationalStats = {
    deliveriesToday: deliveries ? deliveries.filter(d => d.status === 'Done' && d.date === todayStr).length : 0,
    receiptsToday: receipts ? receipts.filter(r => r.status === 'Done' && r.date === todayStr).length : 0,
    pendingMoves: inventoryStats.receiptsToReceive + inventoryStats.deliveriesToDeliver
  };

  const financialStats = {
    inventoryValue: products.reduce((acc, p) => acc + (p.unitCost * p.onHand), 0),
    revenueToday: 3240 // Can keep static or calculate if Sale context added
  };

  const recentOperations = operations.slice(0, 5); // Take top 5

  // Don't render until mounted and authenticated
  if (!mounted || loading || invLoading || !isAuthenticated) {
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const navLinks = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Operations', href: '/operations' },
    { label: 'Stock', href: '/stock' },
    { label: 'Move History', href: '/move-history' },
    { label: 'Settings', href: '/settings' },
  ];

  return (
    <div
      className="min-h-screen relative bg-slate-50 font-sans text-slate-900"
      style={{
        background: 'radial-gradient(circle at top left, #F9F7FA 0%, #F3EFF5 45%, #F0EBF2 100%)',
      }}
    >
      {/* Subtle brand glow */}
      <div className="pointer-events-none absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-purple-100/40 blur-3xl" />

      {/* ─── TOP NAVBAR ─── SaaS STYLED ─── */}
      <header
        style={{
          position: 'sticky', top: 0, zIndex: 30, width: '100%', height: '68px',
          background: 'rgba(249, 247, 250, 0.88)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(113, 75, 103, 0.10)',
          boxShadow: '0 1px 0 rgba(113,75,103,0.06), 0 4px 24px -8px rgba(113,75,103,0.10)',
          padding: '0 32px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        <div style={{ width: '100%', maxWidth: '1400px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

          {/* ── Left: Logo + Nav ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '48px' }}>

            {/* Logo / Brand */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
              <div style={{
                width: '34px', height: '34px', borderRadius: '10px',
                background: 'linear-gradient(135deg, #714B67 0%, #9D6B8F 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(113, 75, 103, 0.28)',
              }}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <span style={{ fontWeight: '800', fontSize: '17px', letterSpacing: '-0.03em', color: '#1A1A2E' }} className="hidden sm:block">
                Bold Stock
              </span>
            </div>

            {/* Desktop Nav Links */}
            <nav className="hidden lg:flex" style={{ alignItems: 'stretch', height: '68px', gap: '4px' }}>
              {navLinks.map((link, idx) => (
                <a
                  key={link.label}
                  href={link.href}
                  style={{
                    display: 'flex', alignItems: 'center', position: 'relative',
                    padding: '0 16px', borderRadius: '8px',
                    fontSize: '14px', fontWeight: idx === 0 ? '700' : '500',
                    color: idx === 0 ? '#714B67' : '#64647A',
                    textDecoration: 'none',
                    background: idx === 0 ? 'rgba(113,75,103,0.07)' : 'transparent',
                    transition: 'background 0.15s, color 0.15s',
                    margin: 'auto 0',
                    height: '36px',
                    letterSpacing: idx === 0 ? '-0.01em' : 'normal',
                  }}
                  onMouseEnter={e => {
                    if (idx !== 0) {
                      (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(113,75,103,0.05)';
                      (e.currentTarget as HTMLAnchorElement).style.color = '#1A1A2E';
                    }
                  }}
                  onMouseLeave={e => {
                    if (idx !== 0) {
                      (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
                      (e.currentTarget as HTMLAnchorElement).style.color = '#64647A';
                    }
                  }}
                >
                  {link.label}
                  {/* Active underline accent */}
                  {idx === 0 && (
                    <motion.div
                      layoutId="activeTab"
                      style={{
                        position: 'absolute', bottom: '-17px', left: '8px', right: '8px', height: '2.5px',
                        background: 'linear-gradient(90deg, #714B67, #9D6B8F)',
                        borderRadius: '2px 2px 0 0',
                      }}
                    />
                  )}
                </a>
              ))}
            </nav>
          </div>

          {/* ── Right: Actions + Profile ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>

            {/* Notification bell */}
            <button
              className="hidden sm:flex items-center justify-center"
              style={{
                width: '36px', height: '36px', borderRadius: '10px',
                border: '1px solid rgba(113,75,103,0.12)', background: 'rgba(255,255,255,0.7)',
                color: '#8E8E9A', cursor: 'pointer', transition: 'all 0.15s',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.background = '#fff';
                (e.currentTarget as HTMLButtonElement).style.color = '#714B67';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.7)';
                (e.currentTarget as HTMLButtonElement).style.color = '#8E8E9A';
              }}
            >
              <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>

            {/* Mobile Hamburger */}
            <button
              className="lg:hidden p-2 rounded-lg"
              style={{ color: '#555566', border: 'none', background: 'transparent', cursor: 'pointer' }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <XIcon /> : <MenuIcon />}
            </button>

            {/* Divider */}
            <div className="hidden sm:block" style={{ width: '1px', height: '28px', background: 'rgba(113,75,103,0.12)' }} />

            {/* Profile Dropdown */}
            <div
              className="relative group hidden sm:flex"
              style={{ alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '5px 10px 5px 5px', borderRadius: '12px', transition: 'background 0.15s' }}
              onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = 'rgba(113,75,103,0.06)'}
              onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = 'transparent'}
            >
              {/* Avatar */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: '34px', height: '34px', borderRadius: '10px',
                background: 'linear-gradient(135deg, #F0EBF2 0%, #E4D9EC 100%)',
                color: '#714B67', fontWeight: '800', fontSize: '13px',
                border: '1.5px solid rgba(113,75,103,0.15)',
                boxShadow: '0 2px 8px rgba(113,75,103,0.08)',
                letterSpacing: '-0.01em',
              }}>
                {user?.loginId?.[0]?.toUpperCase() || 'A'}
              </div>

              {/* Username + Role */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', gap: '1px' }}>
                <span style={{ fontSize: '13px', fontWeight: '700', color: '#1A1A2E', lineHeight: '1.2' }}>{user?.loginId || 'Admin'}</span>
                <span style={{ fontSize: '10.5px', fontWeight: '500', color: '#9B9BAA', lineHeight: '1' }}>Workspace</span>
              </div>

              {/* Chevron */}
              <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} style={{ color: '#B0B0C0', flexShrink: 0 }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>

              {/* Dropdown */}
              <div
                className="absolute right-0 top-full opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50"
                style={{ marginTop: '10px', width: '260px', transformOrigin: 'top right' }}
              >
                <div style={{
                  backgroundColor: '#ffffff', borderRadius: '14px', padding: '6px',
                  border: '1px solid rgba(224, 221, 227, 0.9)',
                  boxShadow: '0 8px 32px -8px rgba(0,0,0,0.14), 0 1px 4px rgba(0,0,0,0.04)',
                }}>
                  {/* User info */}
                  <div style={{ padding: '14px 16px 12px', borderBottom: '1px solid #F5F3F7', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0,
                      background: 'linear-gradient(135deg, #F0EBF2 0%, #E4D9EC 100%)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#714B67', fontWeight: '800', fontSize: '14px',
                      border: '1.5px solid rgba(113,75,103,0.15)',
                    }}>
                      {user?.loginId?.[0]?.toUpperCase() || 'A'}
                    </div>
                    <div>
                      <p style={{ margin: 0, fontSize: '13px', fontWeight: '700', color: '#1A1A2E' }}>{user?.loginId || 'Admin User'}</p>
                      <p style={{ margin: '2px 0 0', fontSize: '11.5px', color: '#9B9BAA' }}>{user?.email || 'admin@example.com'}</p>
                    </div>
                  </div>

                  {/* Menu items */}
                  <div style={{ padding: '6px 0' }}>
                    {[
                      {
                        icon: <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A4 4 0 018 17h8a4 4 0 012.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>,
                        label: 'Profile',
                      },
                      {
                        icon: <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>,
                        label: 'Settings',
                      },
                    ].map(item => (
                      <button
                        key={item.label}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors border-none bg-transparent cursor-pointer"
                        style={{ fontSize: '13px', fontWeight: '500', color: '#3D3D52', textAlign: 'left' }}
                        onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = '#F9F7FA'}
                        onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = 'transparent'}
                      >
                        <span style={{ color: '#8E8E9A' }}>{item.icon}</span>
                        {item.label}
                      </button>
                    ))}

                    {/* Divider */}
                    <div style={{ height: '1px', background: '#F5F3F7', margin: '4px 0' }} />

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors border-none bg-transparent cursor-pointer"
                      style={{ fontSize: '13px', fontWeight: '600', color: '#C0392B', textAlign: 'left' }}
                      onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = '#FEF2F2'}
                      onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = 'transparent'}
                    >
                      <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Sign out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ position: 'absolute', top: '68px', left: 0, width: '100%', backgroundColor: '#ffffff', borderBottom: '1px solid rgba(113,75,103,0.10)', zIndex: 20, overflow: 'hidden' }}
            className="lg:hidden"
          >
            <ul style={{ listStyle: 'none', margin: 0, padding: '8px 0', display: 'flex', flexDirection: 'column' }}>
              {navLinks.map((link, idx) => (
                <li key={link.label}>
                  <a href={link.href} style={{
                    display: 'block', padding: '13px 28px', fontSize: '14px', fontWeight: idx === 0 ? '700' : '500', textDecoration: 'none',
                    color: idx === 0 ? '#714B67' : '#555566',
                    background: idx === 0 ? 'rgba(113,75,103,0.06)' : 'transparent',
                    borderLeft: idx === 0 ? '3px solid #714B67' : '3px solid transparent',
                  }}>
                    {link.label}
                  </a>
                </li>
              ))}
              <li style={{ borderTop: '1px solid #F5F3F7', marginTop: '6px', paddingTop: '6px' }}>
                <button onClick={handleLogout} style={{ width: '100%', textAlign: 'left', padding: '13px 28px', fontSize: '14px', fontWeight: '600', color: '#C0392B', border: 'none', background: 'transparent', cursor: 'pointer' }}>
                  Sign out
                </button>
              </li>
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* ─── MAIN DASHBOARD CONTENT ─── */}
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center', padding: '100px 32px 100px 32px' }}>
        <main className="relative isolate" style={{ width: '100%', maxWidth: '1152px', display: 'flex', flexDirection: 'column', gap: '40px' }}>
          {/* Subtle animated background orbs - Gentle SaaS Ambient Motion */}
          <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
            <motion.div 
               className="soft-orb soft-orb--purple w-[520px] h-[520px] absolute -top-10 -left-10 mix-blend-multiply opacity-70"
               animate={{ x: [0, 30, -30, 0], y: [0, -30, 30, 0] }}
               transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            />
            <motion.div 
               className="soft-orb soft-orb--pink w-[620px] h-[620px] absolute top-10 -right-56 mix-blend-multiply opacity-60"
               animate={{ x: [0, -40, 40, 0], y: [0, 40, -40, 0] }}
               transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            />
            <motion.div 
               className="soft-orb soft-orb--indigo w-[520px] h-[520px] absolute top-1/2 left-1/4 mix-blend-multiply opacity-50"
               animate={{ x: [0, 20, -10, 0], y: [0, -20, 20, 0] }}
               transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />
          </div>

          {/* Wrapper for the rows to sit above the absolute background */}
          <div className="relative z-10" style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
          {/* ROW 1: PRIMARY OVERVIEW CARDS - TOP SECTION */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '32px' }}>
            {/* RECEIPT CARD - Improved Hierarchy & Hover Elevation */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              whileHover={{ y: -4, boxShadow: '0 20px 40px -12px rgba(0, 0, 0, 0.15)' }}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '24px',
                padding: '40px 36px',
                border: '1px solid #E0DDE3',
                boxShadow: '0 12px 32px -12px rgba(0, 0, 0, 0.08)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                cursor: 'pointer'
              }}
              onClick={() => router.push('/operations/receipts')}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '40px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <span style={{ fontSize: '96px', fontWeight: '800', lineHeight: '0.8', color: '#1A1A2E', letterSpacing: '-0.04em' }}><Counter value={inventoryStats.receiptsToReceive} /></span>
                  <span style={{ fontSize: '14px', fontWeight: '800', color: '#8E8E9A', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '16px' }}>To Receive</span>
                </div>
                <div style={{ 
                  width: '72px', height: '72px', borderRadius: '20px', backgroundColor: '#ECFDF5', color: '#059669', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', 
                  boxShadow: '0 8px 16px -4px rgba(5, 150, 105, 0.15)',
                  border: '1px solid #A7F3D0'
                }}>
                  <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '28px', borderTop: '2px solid #F5F3F7' }}>
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#8E8E9A' }}>Total of {receipts ? receipts.length : 0} operations</span>
                <div style={{ display: 'flex', gap: '10px' }}>
                  {receipts && receipts.filter(r => r.status !== 'Done' && new Date(r.date) < new Date()).length > 0 && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '9999px', backgroundColor: '#FEF2F2', color: '#B91C1C', fontSize: '13px', fontWeight: '800', border: '1px solid #FEE2E2', letterSpacing: '0.03em' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#EF4444' }} />
                      {receipts.filter(r => r.status !== 'Done' && new Date(r.date) < new Date()).length} Late
                    </span>
                  )}
                </div>
              </div>
            </motion.div>

            {/* DELIVERY CARD - Improved Hierarchy & Hover Elevation */}
             <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              whileHover={{ y: -4, boxShadow: '0 20px 40px -12px rgba(0, 0, 0, 0.15)' }}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '24px',
                padding: '40px 36px',
                border: '1px solid #E0DDE3',
                boxShadow: '0 12px 32px -12px rgba(0, 0, 0, 0.08)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                cursor: 'pointer'
              }}
              onClick={() => router.push('/operations/delivery')}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '40px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <span style={{ fontSize: '96px', fontWeight: '800', lineHeight: '0.8', color: '#1A1A2E', letterSpacing: '-0.04em' }}><Counter value={inventoryStats.deliveriesToDeliver} /></span>
                  <span style={{ fontSize: '14px', fontWeight: '800', color: '#8E8E9A', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '16px' }}>To Deliver</span>
                </div>
                <div style={{ 
                  width: '72px', height: '72px', borderRadius: '20px', backgroundColor: '#EFF6FF', color: '#2563EB', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', 
                  boxShadow: '0 8px 16px -4px rgba(37, 99, 235, 0.15)',
                  border: '1px solid #BFDBFE'
                }}>
                  <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 14h10M8 10h10M4 18h16a2 2 0 002-2V8a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              
               <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', paddingTop: '28px', borderTop: '2px solid #F5F3F7' }}>
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#8E8E9A' }}>Total of {deliveries ? deliveries.length : 0} operations</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  {deliveries && deliveries.filter(d => d.status !== 'Done' && new Date(d.date) < new Date()).length > 0 && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '9999px', backgroundColor: '#FEF2F2', color: '#B91C1C', fontSize: '13px', fontWeight: '800', border: '1px solid #FEE2E2', letterSpacing: '0.03em' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#EF4444' }} />
                      {deliveries.filter(d => d.status !== 'Done' && new Date(d.date) < new Date()).length} Late
                    </span>
                  )}
                  {deliveries && deliveries.filter(d => d.status === 'Waiting').length > 0 && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '9999px', backgroundColor: '#FFF7ED', color: '#C2410C', fontSize: '13px', fontWeight: '800', border: '1px solid #FFEDD5', letterSpacing: '0.03em' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#F97316' }} />
                      {deliveries.filter(d => d.status === 'Waiting').length} Waiting
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          {/* ROW 2: DATA WIDGETS - STATS SECTION WITH BETTER SPACING */}
          <motion.div 
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}
          >
            {/* Inventory Stats Card */}
            <motion.div whileHover={{ y: -4, boxShadow: '0 20px 40px -12px rgba(0, 0, 0, 0.15)' }} transition={{ duration: 0.2 }} style={{ backgroundColor: '#ffffff', borderRadius: '24px', padding: '24px 28px', border: '1px solid #E0DDE3', boxShadow: '0 8px 24px -12px rgba(0, 0, 0, 0.08)', display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ fontSize: '12px', fontWeight: '800', color: '#8E8E9A', textTransform: 'uppercase', letterSpacing: '0.1em', paddingBottom: '16px', borderBottom: '1px solid #F5F3F7', margin: '0 0 24px 0' }}>Inventory Overview</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#555566' }}>Total Products</span>
                  <span style={{ fontSize: '20px', fontWeight: '800', color: '#1A1A2E' }}><Counter value={inventoryStats.totalProducts} /></span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#555566' }}>Low Stock</span>
                  <span style={{ fontSize: '20px', fontWeight: '800', color: '#EA580C' }}><Counter value={inventoryStats.lowStockItems} /></span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#555566' }}>Out of Stock</span>
                  <span style={{ fontSize: '20px', fontWeight: '800', color: '#DC2626' }}><Counter value={inventoryStats.outOfStock} /></span>
                </div>
              </div>
            </motion.div>

            {/* Operational Stats Card */}
            <motion.div whileHover={{ y: -4, boxShadow: '0 20px 40px -12px rgba(0, 0, 0, 0.15)' }} transition={{ duration: 0.2 }} style={{ backgroundColor: '#ffffff', borderRadius: '24px', padding: '24px 28px', border: '1px solid #E0DDE3', boxShadow: '0 8px 24px -12px rgba(0, 0, 0, 0.08)', display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ fontSize: '12px', fontWeight: '800', color: '#8E8E9A', textTransform: 'uppercase', letterSpacing: '0.1em', paddingBottom: '16px', borderBottom: '1px solid #F5F3F7', margin: '0 0 24px 0' }}>Today's Operations</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#555566' }}>Deliveries Done</span>
                  <span style={{ fontSize: '20px', fontWeight: '800', color: '#1A1A2E' }}><Counter value={operationalStats.deliveriesToday} /></span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#555566' }}>Receipts Done</span>
                  <span style={{ fontSize: '20px', fontWeight: '800', color: '#1A1A2E' }}><Counter value={operationalStats.receiptsToday} /></span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#555566' }}>Pending Moves</span>
                  <span style={{ fontSize: '20px', fontWeight: '800', color: 'var(--primary)' }}><Counter value={operationalStats.pendingMoves} /></span>
                </div>
              </div>
            </motion.div>

            {/* Financial Stats Card */}
            <motion.div whileHover={{ y: -4, boxShadow: '0 20px 40px -12px rgba(0, 0, 0, 0.15)' }} transition={{ duration: 0.2 }} style={{ backgroundColor: '#ffffff', borderRadius: '24px', padding: '24px 28px', border: '1px solid #E0DDE3', boxShadow: '0 8px 24px -12px rgba(0, 0, 0, 0.08)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '12px', fontWeight: '800', color: '#8E8E9A', textTransform: 'uppercase', letterSpacing: '0.1em', paddingBottom: '16px', borderBottom: '1px solid #F5F3F7', margin: '0 0 24px 0' }}>Financial</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '14px', fontWeight: '600', color: '#555566' }}>Inventory Value</span>
                    <span style={{ fontSize: '20px', fontWeight: '800', color: '#1A1A2E' }}><Counter value={financialStats.inventoryValue} prefix="$" isCurrency /></span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '14px', fontWeight: '600', color: '#555566' }}>Revenue Today</span>
                    <span style={{ fontSize: '20px', fontWeight: '800', color: '#059669' }}><Counter value={financialStats.revenueToday} prefix="$" isCurrency /></span>
                  </div>
                </div>
              </div>
              {/* Proper Action Button */}
              <button 
                style={{
                  width: '100%', marginTop: '32px', padding: '14px', borderRadius: '12px',
                  background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)',
                  color: 'white', border: 'none', cursor: 'pointer',
                  fontSize: '14px', fontWeight: '700', letterSpacing: '0.02em',
                  boxShadow: '0 8px 16px -4px rgba(113, 75, 103, 0.25)', transition: 'transform 0.1s'
                }}
                onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
                onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                Generate Report
              </button>
            </motion.div>
          </motion.div>

        {/* ROW 3: RECENT OPERATIONS TABLE - FULL WIDTH */}
        <motion.div 
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          whileHover={{ y: -4, boxShadow: '0 20px 40px -12px rgba(0, 0, 0, 0.15)' }}
          style={{ 
            width: '100%', backgroundColor: '#ffffff', borderRadius: '24px', 
            border: '1px solid #E0DDE3', boxShadow: '0 12px 32px -12px rgba(0, 0, 0, 0.08)',
            display: 'flex', flexDirection: 'column'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 28px', borderBottom: '1px solid #F5F3F7' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '800', color: '#1A1A2E', margin: 0 }}>Recent Operations</h2>
            <button style={{ fontSize: '14px', fontWeight: '700', color: 'var(--primary)', border: 'none', background: 'transparent', cursor: 'pointer', outline: 'none' }}>
              View All 
            </button>
          </div>
          
          <div style={{ overflowX: 'auto', padding: '0 12px 16px 12px' }}>
            <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', minWidth: '800px' }}>
              <thead>
                <tr>
                  <th style={{ padding: '16px 16px', fontSize: '12px', fontWeight: '800', color: '#8E8E9A', textTransform: 'uppercase', letterSpacing: '0.1em', borderBottom: '1px solid #F5F3F7' }}>Reference</th>
                  <th style={{ padding: '16px 16px', fontSize: '12px', fontWeight: '800', color: '#8E8E9A', textTransform: 'uppercase', letterSpacing: '0.1em', borderBottom: '1px solid #F5F3F7' }}>Type</th>
                  <th style={{ padding: '16px 16px', fontSize: '12px', fontWeight: '800', color: '#8E8E9A', textTransform: 'uppercase', letterSpacing: '0.1em', borderBottom: '1px solid #F5F3F7' }}>Contact</th>
                  <th style={{ padding: '16px 16px', fontSize: '12px', fontWeight: '800', color: '#8E8E9A', textTransform: 'uppercase', letterSpacing: '0.1em', borderBottom: '1px solid #F5F3F7' }}>Date</th>
                  <th style={{ padding: '16px 16px', fontSize: '12px', fontWeight: '800', color: '#8E8E9A', textTransform: 'uppercase', letterSpacing: '0.1em', borderBottom: '1px solid #F5F3F7' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOperations.map((op, idx) => (
                  <motion.tr 
                    key={idx} 
                    className="group" 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 + (idx * 0.05) }}
                    style={{ transition: 'background-color 0.2s', borderBottom: '1px solid #F5F3F7' }} 
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F9F7FA'} 
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <td style={{ padding: '16px 16px', fontSize: '14px', fontWeight: '700', color: '#1A1A2E', cursor: 'pointer' }}>
                      {op.id}
                    </td>
                    <td style={{ padding: '16px 16px', fontSize: '14px', fontWeight: '600', color: '#555566' }}>{op.type}</td>
                    <td style={{ padding: '16px 16px', fontSize: '14px', fontWeight: '500', color: '#8E8E9A' }}>{op.contact}</td>
                    <td style={{ padding: '16px 16px', fontSize: '13px', fontWeight: '600', color: '#8E8E9A' }}>{op.date}</td>
                    <td style={{ padding: '16px 16px' }}>
                      <span style={{ 
                        display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 12px', borderRadius: '9999px', fontSize: '13px', fontWeight: '800', letterSpacing: '0.02em',
                        ...(op.status === 'Done' ? { backgroundColor: '#ECFDF5', color: '#059669', border: '1px solid #A7F3D0' } :
                            op.status === 'Ready' ? { backgroundColor: '#EFF6FF', color: '#2563EB', border: '1px solid #BFDBFE' } :
                            op.status === 'Waiting' ? { backgroundColor: '#FFF7ED', color: '#C2410C', border: '1px solid #FFEDD5' } :
                            op.status === 'Late' ? { backgroundColor: '#FEF2F2', color: '#B91C1C', border: '1px solid #FEE2E2' } :
                            { backgroundColor: '#F8FAFC', color: '#475569', border: '1px solid #E2E8F0' })
                      }}>
                        <span style={{ 
                          width: '8px', height: '8px', borderRadius: '50%',
                          ...(op.status === 'Done' ? { backgroundColor: '#10B981' } :
                              op.status === 'Ready' ? { backgroundColor: '#3B82F6' } :
                              op.status === 'Waiting' ? { backgroundColor: '#F97316' } :
                              op.status === 'Late' ? { backgroundColor: '#EF4444' } :
                              { backgroundColor: '#94A3B8' })
                         }} />
                        {op.status}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        </div>
        </main>
      </div>
    </div>
  );
}
