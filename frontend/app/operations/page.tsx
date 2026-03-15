'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useInventory, Product } from '@/context/InventoryContext';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

// Icons
const ArrowDownIcon = () => ( <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg> );
const ArrowUpIcon = () => ( <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg> );
const AdjustIcon = () => ( <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg> );
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
  const activeIdx = 1;

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

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1.5px solid #E4DFE8', background: '#FDFCFE', fontSize: '14px', fontWeight: '500', color: '#1A1A2E', outline: 'none', transition: 'all 0.15s ease'
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label style={{ fontSize: '11.5px', fontWeight: '800', color: '#8E8E9A', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</label>
      {children}
    </div>
  );
}

export default function OperationsPage() {
  const { user, logout, isAuthenticated, loading } = useAuth();
  const { products, warehouses, locations, addReceipt, addDelivery, addAdjustment, loading: invLoading } = useInventory();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'receipt' | 'delivery' | 'adjustment'>('receipt');

  // Form States
  const [productId, setProductId] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('');
  const [contact, setContact] = useState<string>(''); // Supplier or Customer
  const [location, setLocation] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [toast, setToast] = useState<string>('');

  useEffect(() => {
    setMounted(true);
    if (!loading && !isAuthenticated) router.push('/login');
  }, [loading, isAuthenticated, router]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleLogout = () => { logout(); router.push('/login'); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId || !quantity || Number(quantity) <= 0) {
      setError('Please select a product and enter a valid quantity.');
      return;
    }

    const pId = Number(productId);
    const qty = Number(quantity);

    if (activeTab === 'receipt') {
      if (!contact) { setError('Supplier name is required.'); return; }
      addReceipt(pId, qty, contact, location);
      showToast(`Receipt confirmed for ${qty} items.`);
    } else if (activeTab === 'delivery') {
      if (!contact) { setError('Customer name is required.'); return; }
      const success = addDelivery(pId, qty, contact, location);
      if (!success) {
        setError('Insufficient stock "Free To Use" for this product.');
        return;
      }
      showToast(`Delivery confirmed for ${qty} items.`);
    } else if (activeTab === 'adjustment') {
      if (!contact) { setError('Reason for adjustment is required.'); return; }
      addAdjustment(pId, qty, contact); // qty can be negative? Wait, adjustments can also be manually typed inputs with negative signs
      showToast(`Stock levels adjusted.`);
    }

    // Reset Form
    setProductId(''); setQuantity(''); setContact(''); setLocation(''); setError('');
  };

  const selectedProduct = products.find(p => p.id === Number(productId));

  if (!mounted || loading || invLoading || !isAuthenticated) return null;

  return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(circle at top left, #F9F7FA 0%, #F3EFF5 45%, #F0EBF2 100%)', fontFamily: "'Inter', sans-serif" }}>
      <Navbar user={user} onLogout={handleLogout} />

      <div style={{ width: '100%', display: 'flex', justifyContent: 'center', padding: '48px 32px' }}>
        <main style={{ width: '100%', maxWidth: '1000px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* Header */}
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#1A1A2E', letterSpacing: '-0.03em', margin: 0 }}>Operations</h1>
            <p style={{ fontSize: '14px', color: '#8E8E9A', marginTop: '4px', fontWeight: '500' }}>Simulate warehousing movements and transactions</p>
          </div>

          {/* Submenu Tabs */}
          <div style={{ display: 'flex', gap: '8px', background: 'white', padding: '6px', borderRadius: '14px', alignSelf: 'flex-start', border: '1px solid #E8E4ED', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
            {[
              { id: 'receipt', icon: <ArrowDownIcon />, label: 'Receipt', color: '#059669', bg: '#E1FCEF' },
              { id: 'delivery', icon: <ArrowUpIcon />, label: 'Delivery', color: '#2563EB', bg: '#EFF6FF' },
              { id: 'adjustment', icon: <AdjustIcon />, label: 'Adjustment', color: '#714B67', bg: 'rgba(113,75,103,0.08)' }
            ].map(tab => {
              const isActive = activeTab === tab.id;
              return (
                <button key={tab.id} onClick={() => { setActiveTab(tab.id as any); setError(''); setQuantity(''); setProductId(''); setContact(''); setLocation(''); }} style={{
                  display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', borderRadius: '10px',
                  border: 'none', background: isActive ? tab.bg : 'transparent', color: isActive ? tab.color : '#64647A', cursor: 'pointer', fontSize: '14px', fontWeight: '700', transition: 'all 0.15s'
                }}>
                  <span style={{ opacity: isActive ? 1 : 0.7 }}>{tab.icon}</span>
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Form Card Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '7fr 5fr', gap: '32px', alignItems: 'flex-start' }}>
            
            <motion.div key={activeTab} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}
              style={{ background: 'white', borderRadius: '20px', padding: '32px', border: '1px solid #E8E4ED', boxShadow: '0 4px 24px -10px rgba(0,0,0,0.06)' }}>
              
              <h2 style={{ margin: '0 0 24px', fontSize: '18px', fontWeight: '800', color: '#1A1A2E' }}>
                {activeTab === 'receipt' ? 'Record Incoming Stock' : activeTab === 'delivery' ? 'Dispatch Outgoing order' : 'Manual stock count adjustment'}
              </h2>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <Field label="Target Product">
                  <select value={productId} onChange={e => setProductId(e.target.value)} style={inputStyle}>
                    <option value="" disabled>Select a product...</option>
                    {products.map(p => (
                      <option key={p.id} value={p.id}>{p.name} (On Hand: {p.onHand})</option>
                    ))}
                  </select>
                </Field>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <Field label="Quantity">
                    <input type="number" value={quantity} onChange={e => setQuantity(e.target.value)} placeholder="0" style={inputStyle} />
                  </Field>
                  <Field label={activeTab === 'receipt' ? 'Supplier' : activeTab === 'delivery' ? 'Customer' : 'Reason / Note'}>
                    <input value={contact} onChange={e => setContact(e.target.value)} placeholder={activeTab === 'receipt' ? "e.g. Supplier name" : activeTab === 'delivery' ? "e.g. Retail store #42" : "e.g. Cycle Count Correction"} style={inputStyle} />
                  </Field>
                </div>

                {activeTab !== 'adjustment' && (
                  <Field label="Target Location (Optional)">
                    <select value={location} onChange={e => setLocation(e.target.value)} style={inputStyle}>
                      <option value="">Select Location...</option>
                      {locations.map(l => (
                        <option key={l.id} value={`${l.warehouseCode}/${l.code}`}>{l.warehouseCode}/{l.code} ({l.name})</option>
                      ))}
                    </select>
                  </Field>
                )}

                {error && <p style={{ margin: 0, fontSize: '13px', color: '#DC2626', fontWeight: '600' }}>{error}</p>}

                <button type="submit" style={{
                  padding: '14px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #714B67 0%, #4A2545 100%)',
                  color: 'white', cursor: 'pointer', fontSize: '14px', fontWeight: '700', boxShadow: '0 6px 20px rgba(113,75,103,0.3)', marginTop: '8px'
                }}>
                  Confirm {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                </button>
              </form>
            </motion.div>

            {/* Side Preview card */}
            <AnimatePresence mode="wait">
              {selectedProduct ? (
                <motion.div key={activeTab + productId} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} style={{ background: '#FAF8FC', borderRadius: '16px', padding: '24px', border: '1px solid #F0EDF2' }}>
                  <h3 style={{ margin: '0 0 16px', fontSize: '13px', fontWeight: '800', color: '#8E8E9A', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Stock Preview</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div>
                      <span style={{ fontSize: '11px', color: '#8E8E9A', fontWeight: '600' }}>Product</span>
                      <p style={{ margin: '2px 0 0', fontSize: '15px', fontWeight: '800', color: '#1A1A2E' }}>{selectedProduct.name}</p>
                    </div>
                    <div>
                      <span style={{ fontSize: '11px', color: '#8E8E9A', fontWeight: '600' }}>Location Current</span>
                      <p style={{ margin: '2px 0 0', fontSize: '13px', fontWeight: '700', color: '#4A2545' }}>{selectedProduct.location}</p>
                    </div>
                    <div style={{ height: '1px', background: '#F0EBF2' }} />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
                      <div>
                        <span style={{ fontSize: '11px', color: '#8E8E9A', fontWeight: '600' }}>Current On Hand</span>
                        <p style={{ margin: '2px 0 0', fontSize: '18px', fontWeight: '800', color: '#1A1A2E' }}>{selectedProduct.onHand}</p>
                      </div>
                      <div>
                        <span style={{ fontSize: '11px', color: '#8E8E9A', fontWeight: '600' }}>Free To Use</span>
                        <p style={{ margin: '2px 0 0', fontSize: '18px', fontWeight: '800', color: '#059669' }}>{selectedProduct.freeToUse}</p>
                      </div>
                    </div>
                    {quantity && Number(quantity) > 0 && (
                      <div style={{ marginTop: '8px', padding: '12px', background: 'white', borderRadius: '10px', border: '1.5px dashed #E4DFE8' }}>
                        <span style={{ fontSize: '11px', color: '#8E8E9A', fontWeight: '700' }}>AFTER OPERATION PREVIEW:</span>
                        <p style={{ margin: '4px 0 0', fontSize: '14px', fontWeight: '800', color: '#714B67' }}>
                          On Hand: {selectedProduct.onHand} {activeTab === 'receipt' ? '+' : '-'} {quantity} = <strong style={{color: '#1A1A2E'}}>{activeTab === 'receipt' ? selectedProduct.onHand + Number(quantity) : selectedProduct.onHand - Number(quantity)}</strong>
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              ) : (
                <div style={{ padding: '24px', textAlign: 'center', background: '#FAF8FC', border: '1px dashed #E8E4ED', borderRadius: '16px', color: '#8E8E9A', fontSize: '13px', fontWeight: '500' }}>
                  Select a product to view stock balances preview before applying changes.
                </div>
              )}
            </AnimatePresence>

          </div>

        </main>
      </div>

      {/* Toast Alert */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }} style={{ position: 'fixed', bottom: '32px', left: '50%', transform: 'translateX(-50%)', background: '#1A1A2E', color: 'white', padding: '12px 24px', borderRadius: '12px', fontSize: '14px', fontWeight: '600', boxShadow: '0 8px 32px rgba(0,0,0,0.2)', zIndex: 1000 }}>
            🎉 {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
