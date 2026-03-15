'use client';

import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useInventory, ReceiptDocument, Product } from '@/context/InventoryContext';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

// Icons
const MenuIcon = () => (<svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>);
const XNavIcon = () => (<svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>);

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
      <AnimatePresence>{menuOpen && (
        <motion.nav initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ position: 'fixed', top: '68px', left: 0, width: '100%', background: '#fff', borderBottom: '1px solid rgba(113,75,103,0.10)', zIndex: 29, overflow: 'hidden' }}>
          <ul style={{ listStyle: 'none', margin: 0, padding: '8px 0' }}>{navLinks.map((link, idx) => ( <li key={link.label}><a href={link.href} style={{ display: 'block', padding: '13px 28px', fontSize: '14px', fontWeight: idx === activeIdx ? '700' : '500', textDecoration: 'none', color: idx === activeIdx ? '#714B67' : '#555566', background: idx === activeIdx ? 'rgba(113,75,103,0.06)' : 'transparent', borderLeft: idx === activeIdx ? '3px solid #714B67' : '3px solid transparent' }}>{link.label}</a></li> ))}<li style={{ borderTop: '1px solid #F5F3F7', marginTop: '6px' }}><button onClick={onLogout} style={{ width: '100%', textAlign: 'left', padding: '13px 28px', fontSize: '14px', fontWeight: '600', color: '#C0392B', border: 'none', background: 'transparent', cursor: 'pointer' }}>Sign out</button></li></ul>
        </motion.nav>
      )}</AnimatePresence>
    </>
  );
}

const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #E0DDE3', background: '#F9F7FA', fontSize: '14px', outline: 'none' };

export default function ReceiptsPage() {
  const { user, logout, isAuthenticated, loading } = useAuth();
  const { products, receipts, addReceiptDoc, updateReceiptDocStatus, warehouses, loading: invLoading } = useInventory();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  const [view, setView] = useState<'list' | 'kanban'>('list');
  const [search, setSearch] = useState('');
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  // Form states for New Receipt Document
  const [vendor, setVendor] = useState('');
  const [date, setDate] = useState('');
  const [warehouseCode, setWarehouseCode] = useState('');
  const [items, setItems] = useState<{ productId: string; quantity: string }[]>([{ productId: '', quantity: '' }]);

  useEffect(() => { setMounted(true); if (!loading && !isAuthenticated) router.push('/login'); }, [loading, isAuthenticated, router]);

  const filteredReceipts = useMemo(() => {
    return receipts.filter(r => r.id.toLowerCase().includes(search.toLowerCase()) || r.vendor.toLowerCase().includes(search.toLowerCase()));
  }, [receipts, search]);

  const handleCreateReceipt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendor || !date || !warehouseCode || items.length === 0) return;

    const validatedItems = items.filter(i => i.productId && Number(i.quantity) > 0).map(i => ({ productId: Number(i.productId), quantity: Number(i.quantity) }));
    if (validatedItems.length === 0) return;

    const count = receipts.filter(r => r.warehouseCode === warehouseCode).length + 1;
    const refId = `${warehouseCode}/IN/${count.toString().padStart(4, '0')}`;

    addReceiptDoc({
      id: refId,
      status: 'Draft',
      vendor,
      date,
      responsible: user?.loginId || 'Admin',
      warehouseCode,
      items: validatedItems
    });

    setIsNewModalOpen(false);
    setVendor(''); setDate(''); setWarehouseCode(''); setItems([{ productId: '', quantity: '' }]);
  };

  const handleAddItem = () => setItems([...items, { productId: '', quantity: '' }]);

  if (!mounted || loading || invLoading || !isAuthenticated) return null;

  return (
    <div style={{ minHeight: '100vh', background: '#F9F7FA', fontFamily: "'Inter', sans-serif" }}>
      <Navbar user={user} onLogout={() => { logout(); router.push('/login'); }} />

      <div style={{ width: '100%', display: 'flex', justifyContent: 'center', padding: '48px 32px' }}>
        <main style={{ width: '100%', maxWidth: '1200px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* Top Bar Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#1A1A2E' }}>Receipts</h1>
              <p style={{ fontSize: '14px', color: '#8E8E9A', marginTop: '4px' }}>Manage and validates incoming triggers operations flows buffers counters</p>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search receipts…" style={{ ...inputStyle, width: '220px' }} />
              <button onClick={() => setIsNewModalOpen(true)} style={{ padding: '12px 18px', background: 'linear-gradient(135deg,#714B67,#9D6B8F)', color: 'white', border: 'none', borderRadius: '10px', fontWeight: '700', cursor: 'pointer' }}>Create Receipt</button>
            </div>
          </div>

          {/* Table index View */}
          <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #E8E4ED', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ background: '#FAF8FC' }}>
                <tr>{['Reference', 'Vendor', 'Warehouse', 'Scheduled Date', 'Status', 'Actions'].map(h => <th key={h} style={{ padding: '14px 16px', fontSize: '11px', fontWeight: '800', color: '#8E8E9A', textTransform: 'uppercase', textAlign: 'left', borderBottom: '1px solid #F0EDF2' }}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {filteredReceipts.map(r => (
                  <tr key={r.id} style={{ borderBottom: '1px solid #F8F5FB' }}>
                    <td style={{ padding: '14px 16px', fontSize: '13.5px', fontWeight: '800', color: '#714B67' }}>{r.id}</td>
                    <td style={{ padding: '14px 16px', fontSize: '14px', fontWeight: '600' }}>{r.vendor}</td>
                    <td style={{ padding: '14px 16px', fontSize: '13.5px', color: '#64647A' }}>{r.warehouseCode}</td>
                    <td style={{ padding: '14px 16px', fontSize: '13.5px', color: '#64647A' }}>{r.date}</td>
                    <td>
                      <span style={{ fontSize: '11px', fontWeight: '800', padding: '4px 8px', borderRadius: '6px', background: r.status === 'Done' ? '#E1FCEF' : r.status === 'Ready' ? '#EFF6FF' : '#F3E8FF', color: r.status === 'Done' ? '#059669' : r.status === 'Ready' ? '#2563EB' : '#714B67' }}>{r.status}</span>
                    </td>
                    <td style={{ padding: '14px 16px', display: 'flex', gap: '8px' }}>
                      {r.status === 'Draft' && <button onClick={() => updateReceiptDocStatus(r.id, 'Ready')} style={{ padding: '6px 12px', background: '#EFF6FF', color: '#2563EB', border: 'none', borderRadius: '6px', fontWeight: '700', cursor: 'pointer', fontSize: '12px' }}>Validate</button>}
                      {r.status === 'Ready' && <button onClick={() => updateReceiptDocStatus(r.id, 'Done')} style={{ padding: '6px 12px', background: '#E1FCEF', color: '#059669', border: 'none', borderRadius: '6px', fontWeight: '700', cursor: 'pointer', fontSize: '12px' }}>Receive</button>}
                      {r.status === 'Done' && <button style={{ padding: '6px 12px', background: '#F3F4F6', color: '#6B7280', border: 'none', borderRadius: '6px', fontWeight: '700', fontSize: '12px', cursor: 'default' }}>Printed</button>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add New Modal */}
          <AnimatePresence>
            {isNewModalOpen && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.4)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} style={{ background: 'white', padding: '32px', borderRadius: '20px', width: '500px', display: 'flex', flexDirection: 'column', gap: '16px', boxShadow: '0 20px 50px rgba(0,0,0,0.15)' }}>
                  <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '800' }}>Create New Receipt</h2>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div><label style={{ fontSize: '12px', fontWeight: '700', color: '#8E8E9A' }}>Vendor</label><input value={vendor} onChange={e => setVendor(e.target.value)} style={inputStyle} /></div>
                    <div><label style={{ fontSize: '12px', fontWeight: '700', color: '#8E8E9A' }}>Date</label><input type="date" value={date} onChange={e => setDate(e.target.value)} style={inputStyle} /></div>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: '700', color: '#8E8E9A' }}>Warehouse</label>
                      <select value={warehouseCode} onChange={e => setWarehouseCode(e.target.value)} style={inputStyle}>
                        <option value="">Select Warehouse...</option>
                        {warehouses.map(w => <option key={w.code} value={w.code}>{w.name} ({w.code})</option>)}
                      </select>
                    </div>

                    <div style={{ marginTop: '8px' }}>
                      <label style={{ fontSize: '12px', fontWeight: '700', color: '#8E8E9A', display: 'block', marginBottom: '6px' }}>Products</label>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '150px', overflowY: 'auto' }}>
                        {items.map((item, idx) => (
                          <div key={idx} style={{ display: 'flex', gap: '8px' }}>
                            <select value={item.productId} onChange={e => { const u = [...items]; u[idx].productId = e.target.value; setItems(u); }} style={{ ...inputStyle, flex: 2 }}>
                              <option value="">Select Item...</option>
                              {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </select>
                            <input type="number" placeholder="Qty" value={item.quantity} onChange={e => { const u = [...items]; u[idx].quantity = e.target.value; setItems(u); }} style={{ ...inputStyle, flex: 1 }} />
                          </div>
                        ))}
                      </div>
                      <button onClick={handleAddItem} style={{ marginTop: '8px', padding: '6px 10px', background: '#FAF8FC', border: '1px dashed #E0DDE3', borderRadius: '8px', fontSize: '12px', fontWeight: '700', color: '#714B67', cursor: 'pointer' }}>+ Add Item</button>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                    <button onClick={() => setIsNewModalOpen(false)} style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid #E0DDE3', background: 'transparent', fontWeight: '700', cursor: 'pointer' }}>Cancel</button>
                    <button onClick={handleCreateReceipt} style={{ flex: 1, padding: '12px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg,#714B67,#9D6B8F)', color: 'white', fontWeight: '700', cursor: 'pointer' }}>Save Draft</button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

        </main>
      </div>
    </div>
  );
}
