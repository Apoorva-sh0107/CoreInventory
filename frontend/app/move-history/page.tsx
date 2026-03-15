'use client';

import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useInventory, OperationMove } from '@/context/InventoryContext';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

// Icons
const PlusIcon = () => ( <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg> );
const SearchIcon = () => ( <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" /></svg> );
const ListIcon = () => ( <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg> );
const BoardIcon = () => ( <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h4a1 1 0 011 1v5a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10-2a1 1 0 011-1h4a1 1 0 011 1v6a1 1 0 01-1 1h-4a1 1 0 01-1-1v-6z" /></svg> );
const MenuIcon = () => (<svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>);
const XNavIcon = () => (<svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>);

// Navbar component
function Navbar({ user, onLogout }: { user: any; onLogout: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const navLinks = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Operations', href: '/operations' },
    { label: 'Stock', href: '/stock' },
    { label: 'Move History', href: '/move-history' },
    { label: 'Settings', href: '/settings' },
  ];
  const activeIdx = 3;

  return (
    <>
      <header style={{
        position: 'sticky', top: 0, zIndex: 30, width: '100%', height: '68px',
        background: 'rgba(249, 247, 250, 0.88)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(113, 75, 103, 0.10)', boxShadow: '0 1px 0 rgba(113,75,103,0.06), 0 4px 24px -8px rgba(113,75,103,0.10)',
        padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{ width: '100%', maxWidth: '1400px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '48px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0, cursor: 'pointer' }} onClick={() => router.push('/dashboard')}>
              <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: 'linear-gradient(135deg, #714B67 0%, #9D6B8F 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(113, 75, 103, 0.28)' }}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></svg>
              </div>
              <span style={{ fontWeight: '800', fontSize: '17px', letterSpacing: '-0.03em', color: '#1A1A2E' }} className="hidden sm:block">Bold Stock</span>
            </div>
            <nav className="hidden lg:flex" style={{ alignItems: 'stretch', height: '68px', gap: '4px' }}>
              {navLinks.map((link, idx) => (
                <a key={link.label} href={link.href} style={{
                  display: 'flex', alignItems: 'center', position: 'relative', padding: '0 16px', borderRadius: '8px',
                  fontSize: '14px', fontWeight: idx === activeIdx ? '700' : '500',
                  color: idx === activeIdx ? '#714B67' : '#64647A', textDecoration: 'none',
                  background: idx === activeIdx ? 'rgba(113,75,103,0.07)' : 'transparent',
                  margin: 'auto 0', height: '36px', transition: 'background 0.15s, color 0.15s',
                }}>
                  {link.label}
                  {idx === activeIdx && (
                    <motion.div layoutId="activeTab" style={{ position: 'absolute', bottom: '-17px', left: '8px', right: '8px', height: '2.5px', background: 'linear-gradient(90deg, #714B67, #9D6B8F)', borderRadius: '2px 2px 0 0' }} />
                  )}
                </a>
              ))}
            </nav>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button className="lg:hidden p-2 rounded-lg" style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#555566' }} onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <XNavIcon /> : <MenuIcon />}
            </button>
            <div className="hidden sm:block" style={{ width: '1px', height: '28px', background: 'rgba(113,75,103,0.12)' }} />
            <div className="relative group hidden sm:flex" style={{ alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '5px 10px 5px 5px', borderRadius: '12px', transition: 'background 0.15s' }} onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = 'rgba(113,75,103,0.06)'} onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = 'transparent'}>
              <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: 'linear-gradient(135deg, #F0EBF2 0%, #E4D9EC 100%)', color: '#714B67', fontWeight: '800', fontSize: '13px', border: '1.5px solid rgba(113,75,103,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{user?.loginId?.[0]?.toUpperCase() || 'A'}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}><span style={{ fontSize: '13px', fontWeight: '700', color: '#1A1A2E', lineHeight: '1.2' }}>{user?.loginId || 'Admin'}</span><span style={{ fontSize: '10.5px', fontWeight: '500', color: '#9B9BAA' }}>Workspace</span></div>
              <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} style={{ color: '#B0B0C0' }}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
              <div className="absolute right-0 top-full opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50" style={{ marginTop: '10px', width: '220px' }}>
                <div style={{ background: '#fff', borderRadius: '14px', padding: '6px', border: '1px solid rgba(224,221,227,0.9)', boxShadow: '0 8px 32px -8px rgba(0,0,0,0.14)' }}>
                  <div style={{ padding: '12px 14px', borderBottom: '1px solid #F5F3F7' }}><p style={{ margin: 0, fontSize: '13px', fontWeight: '700', color: '#1A1A2E' }}>{user?.loginId || 'Admin'}</p><p style={{ margin: '2px 0 0', fontSize: '11.5px', color: '#9B9BAA' }}>{user?.email || 'admin@example.com'}</p></div>
                  <div style={{ padding: '6px 0' }}><button onClick={onLogout} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg border-none bg-transparent cursor-pointer" style={{ fontSize: '13px', fontWeight: '600', color: '#C0392B', textAlign: 'left' }} onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = '#FEF2F2'} onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = 'transparent'}><svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>Sign out</button></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      {/* Mobile menu */}
      <AnimatePresence>{menuOpen && (
        <motion.nav initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ position: 'fixed', top: '68px', left: 0, width: '100%', background: '#fff', borderBottom: '1px solid rgba(113,75,103,0.10)', zIndex: 29, overflow: 'hidden' }}>
          <ul style={{ listStyle: 'none', margin: 0, padding: '8px 0' }}>{navLinks.map((link, idx) => ( <li key={link.label}><a href={link.href} style={{ display: 'block', padding: '13px 28px', fontSize: '14px', fontWeight: idx === activeIdx ? '700' : '500', textDecoration: 'none', color: idx === activeIdx ? '#714B67' : '#555566', background: idx === activeIdx ? 'rgba(113,75,103,0.06)' : 'transparent', borderLeft: idx === activeIdx ? '3px solid #714B67' : '3px solid transparent' }}>{link.label}</a></li> ))}<li style={{ borderTop: '1px solid #F5F3F7', marginTop: '6px' }}><button onClick={onLogout} style={{ width: '100%', textAlign: 'left', padding: '13px 28px', fontSize: '14px', fontWeight: '600', color: '#C0392B', border: 'none', background: 'transparent', cursor: 'pointer' }}>Sign out</button></li></ul>
        </motion.nav>
      )}</AnimatePresence>
    </>
  );
}

export default function MoveHistoryPage() {
  const { user, logout, isAuthenticated, loading } = useAuth();
  const { operations, loading: invLoading } = useInventory();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  const [view, setView] = useState<'list' | 'kanban'>('list');
  const [search, setSearch] = useState('');
  const [newMenuOpen, setNewMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!loading && !isAuthenticated) router.push('/login');
  }, [loading, isAuthenticated, router]);

  const handleLogout = () => { logout(); router.push('/login'); };

  // Filtered operations
  const filteredOperations = useMemo(() => {
    const q = search.toLowerCase();
    return operations.filter(o => 
      o.id.toLowerCase().includes(q) ||
      o.productName.toLowerCase().includes(q) ||
      o.contact.toLowerCase().includes(q) ||
      o.fromLocation.toLowerCase().includes(q) ||
      o.toLocation.toLowerCase().includes(q)
    );
  }, [operations, search]);

  if (!mounted || loading || invLoading || !isAuthenticated) return null;

  return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(circle at top left, #F9F7FA 0%, #F3EFF5 45%, #F0EBF2 100%)', fontFamily: "'Inter', sans-serif" }}>
      <Navbar user={user} onLogout={handleLogout} />

      <div style={{ width: '100%', display: 'flex', justifyContent: 'center', padding: '48px 32px 80px' }}>
        <main style={{ width: '100%', maxWidth: '1200px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* Top Bar Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#1A1A2E', letterSpacing: '-0.03em', margin: 0 }}>Move History</h1>
              <p style={{ fontSize: '14px', color: '#8E8E9A', marginTop: '4px', fontWeight: '500' }}>Complete audit trail of inventory movements</p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', position: 'relative' }}>
              {/* Search */}
              <div style={{ position: 'relative', minWidth: '220px' }}>
                <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#B0B0C0' }}><SearchIcon /></span>
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search movements…" style={{ padding: '10px 14px 10px 36px', borderRadius: '10px', border: '1.5px solid #E4DFE8', background: 'white', fontSize: '13.5px', outline: 'none', width: '100%' }} />
              </div>

              {/* View Switcher */}
              <div style={{ display: 'flex', background: 'white', padding: '4px', borderRadius: '10px', border: '1px solid #E8E4ED' }}>
                <button onClick={() => setView('list')} style={{ padding: '8px 12px', borderRadius: '8px', border: 'none', background: view === 'list' ? 'rgba(113,75,103,0.08)' : 'transparent', color: view === 'list' ? '#714B67' : '#64647A', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '700' }}>
                  <ListIcon /> <span className="hidden sm:inline">List</span>
                </button>
                <button onClick={() => setView('kanban')} style={{ padding: '8px 12px', borderRadius: '8px', border: 'none', background: view === 'kanban' ? 'rgba(113,75,103,0.08)' : 'transparent', color: view === 'kanban' ? '#714B67' : '#64647A', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '700' }}>
                  <BoardIcon /> <span className="hidden sm:inline">Kanban</span>
                </button>
              </div>

              {/* New Button with Options */}
              <div style={{ position: 'relative' }}>
                <button onClick={() => setNewMenuOpen(!newMenuOpen)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '11px 18px', borderRadius: '10px', background: 'linear-gradient(135deg,#714B67,#9D6B8F)', color: 'white', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: '700', boxShadow: '0 4px 16px rgba(113,75,103,0.3)' }}>
                  <PlusIcon /> New
                </button>

                <AnimatePresence>
                  {newMenuOpen && (
                    <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} style={{ position: 'absolute', right: 0, top: 'calc(100% + 8px)', width: '200px', background: 'white', borderRadius: '12px', padding: '6px', boxShadow: '0 12px 32px rgba(0,0,0,0.12)', border: '1px solid #E8E4ED', zIndex: 50 }}>
                      {[
                        { label: 'New Receipt', href: '/operations' },
                        { label: 'New Delivery', href: '/operations' },
                        { label: 'New Adjustment', href: '/operations' },
                      ].map((opt, i) => (
                        <button key={opt.label} onClick={() => { router.push(opt.href); setNewMenuOpen(false); }} style={{ width: '100%', padding: '10px 12px', textAlign: 'left', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '13.5px', fontWeight: '600', color: '#1A1A2E', borderRadius: '8px', transition: 'background 0.1s' }} onMouseEnter={e => (e.currentTarget.style.background = '#F9F7FA')} onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                          {opt.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </div>
          </div>

          {/* Main Views */}
          <AnimatePresence mode="wait">
            {view === 'list' ? (
              
              <motion.div key="list" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} style={{ background: 'white', borderRadius: '20px', border: '1px solid #E8E4ED', boxShadow: '0 4px 24px -10px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
                    <thead style={{ background: '#FAF8FC' }}>
                      <tr>
                        {['Reference', 'Date', 'Product', 'Contact', 'From', 'To', 'Quantity', 'Status'].map(h => (
                          <th key={h} style={{ padding: '14px 16px', fontSize: '11.5px', fontWeight: '800', color: '#8E8E9A', textTransform: 'uppercase', letterSpacing: '0.08em', borderBottom: '1px solid #F0EDF2', textAlign: 'left' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOperations.map((o, idx) => {
                        const isIN = o.type === 'Receipt';
                        const isOUT = o.type === 'Delivery';
                        return (
                          <motion.tr key={o.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.03 }} style={{ borderBottom: '1px solid #F8F5FB' }} onMouseEnter={e => (e.currentTarget.style.background = '#FAF8FC')} onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                            <td style={{ padding: '14px 16px', fontSize: '13.5px', fontWeight: '800', color: isIN ? '#059669' : isOUT ? '#DC2626' : '#714B67' }}>{o.id}</td>
                            <td style={{ padding: '14px 16px', fontSize: '13.5px', color: '#64647A', fontWeight: '500' }}>{o.date}</td>
                            <td style={{ padding: '14px 16px', fontSize: '14px', fontWeight: '700', color: '#1A1A2E' }}>{o.productName}</td>
                            <td style={{ padding: '14px 16px', fontSize: '13.5px', color: '#1A1A2E', fontWeight: '600' }}>{o.contact}</td>
                            <td style={{ padding: '14px 16px', fontSize: '13px', color: '#8E8E9A', fontWeight: '600' }}>{o.fromLocation}</td>
                            <td style={{ padding: '14px 16px', fontSize: '13px', color: '#8E8E9A', fontWeight: '600' }}>{o.toLocation}</td>
                            <td style={{ padding: '14px 16px', fontSize: '14px', fontWeight: '800', color: isIN ? '#059669' : isOUT ? '#DC2626' : '#1A1A2E' }}>
                              {isIN ? '+' : isOUT ? '-' : ''}{o.quantity}
                            </td>
                            <td style={{ padding: '14px 16px' }}>
                              <span style={{ fontSize: '11px', fontWeight: '800', padding: '4px 8px', borderRadius: '6px', background: o.status === 'Done' ? '#E1FCEF' : o.status === 'Ready' ? '#EFF6FF' : o.status === 'Waiting' ? '#FEF3C7' : '#FEE2E2', color: o.status === 'Done' ? '#059669' : o.status === 'Ready' ? '#2563EB' : o.status === 'Waiting' ? '#D97706' : '#DC2626' }}>
                                {o.status}
                              </span>
                            </td>
                          </motion.tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </motion.div>

            ) : (

              <motion.div key="kanban" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                {['Ready', 'Waiting', 'Done', 'Late'].map(status => {
                  const moves = filteredOperations.filter(o => o.status === status);
                  return (
                    <div key={status} style={{ background: '#FAF8FC', borderRadius: '16px', padding: '16px', border: '1px solid #E8E4ED', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontSize: '13px', fontWeight: '800', color: '#1A1A2E' }}>{status}</span>
                        <span style={{ fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '10px', background: '#EAE6EC', color: '#555566' }}>{moves.length}</span>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto', maxHeight: '500px' }}>
                        {moves.map((m, i) => (
                          <motion.div key={m.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} style={{ background: 'white', padding: '14px', borderRadius: '12px', border: '1px solid #EAE6EC', boxShadow: '0 2px 6px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <span style={{ fontSize: '12px', fontWeight: '800', color: m.type === 'Receipt' ? '#059669' : m.type === 'Delivery' ? '#DC2626' : '#714B67' }}>{m.id}</span>
                              <span style={{ fontSize: '11px', color: '#8E8E9A', fontWeight: '600' }}>{m.date}</span>
                            </div>
                            <span style={{ fontSize: '14px', fontWeight: '800', color: '#1A1A2E', marginTop: '4px' }}>{m.productName}</span>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                              <span style={{ fontSize: '12px', color: '#64647A', fontWeight: '600' }}>Qty: <strong>{m.quantity}</strong></span>
                              <span style={{ fontSize: '11px', color: '#8E8E9A', fontStyle: 'italic' }}>{m.contact}</span>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </motion.div>

            )}
          </AnimatePresence>

        </main>
      </div>
    </div>
  );
}
