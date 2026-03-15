'use client';

import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useInventory } from '@/context/InventoryContext';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Types ───────────────────────────────────────────────────────────────────
interface Product {
  id: number;
  name: string;
  unitCost: number;
  onHand: number;
  freeToUse: number;
  location: string;
  category: string;
}

type SortKey = 'name' | 'unitCost' | 'onHand' | 'freeToUse';
type ModalMode = 'add' | 'edit' | 'stock' | null;

// ─── Initial demo data ────────────────────────────────────────────────────────
const INITIAL_PRODUCTS: Product[] = [
  { id: 1, name: 'Standing Desk',    unitCost: 3000, onHand: 50, freeToUse: 45, location: 'WH/Rack-A1', category: 'Furniture' },
  { id: 2, name: 'Office Chair',     unitCost: 1500, onHand: 80, freeToUse: 80, location: 'WH/Rack-A2', category: 'Furniture' },
  { id: 3, name: 'Monitor 27"',      unitCost: 8500, onHand: 30, freeToUse: 28, location: 'WH/Rack-B1', category: 'Electronics' },
  { id: 4, name: 'Mechanical Keyboard', unitCost: 2200, onHand: 60, freeToUse: 60, location: 'WH/Rack-B2', category: 'Electronics' },
  { id: 5, name: 'Wireless Mouse',   unitCost: 950,  onHand: 120, freeToUse: 110, location: 'WH/Rack-B3', category: 'Electronics' },
  { id: 6, name: 'Laptop Stand',     unitCost: 600,  onHand: 40,  freeToUse: 40,  location: 'WH/Rack-C1', category: 'Accessories' },
];

// ─── Icons ────────────────────────────────────────────────────────────────────
const PlusIcon = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
);
const SearchIcon = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
  </svg>
);
const SortIcon = ({ active }: { active: boolean }) => (
  <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 3 : 2} style={{ color: active ? '#714B67' : '#B0B0C0' }}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" />
  </svg>
);
const CloseIcon = () => (
  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);
const EditIcon = () => (
  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-5M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);
const BoxIcon = () => (
  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
);
const MenuIcon = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);
const XNavIcon = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar({ user, onLogout }: { user: { loginId?: string; email?: string } | null; onLogout: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const navLinks = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Operations', href: '/operations' },
    { label: 'Stock', href: '/stock' },
    { label: 'Move History', href: '/move-history' },
    { label: 'Settings', href: '/settings' },
  ];
  const activeIdx = 2; // Stock is active

  return (
    <>
      <header style={{
        position: 'sticky', top: 0, zIndex: 30, width: '100%', height: '68px',
        background: 'rgba(249,247,250,0.88)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(113,75,103,0.10)',
        boxShadow: '0 1px 0 rgba(113,75,103,0.06), 0 4px 24px -8px rgba(113,75,103,0.10)',
        padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{ width: '100%', maxWidth: '1400px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo + Nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '48px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0, cursor: 'pointer' }} onClick={() => router.push('/dashboard')}>
              <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: 'linear-gradient(135deg,#714B67,#9D6B8F)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(113,75,103,0.28)' }}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <span style={{ fontWeight: '800', fontSize: '17px', letterSpacing: '-0.03em', color: '#1A1A2E' }} className="hidden sm:block">Bold Stock</span>
            </div>
            <nav className="hidden lg:flex" style={{ alignItems: 'stretch', height: '68px', gap: '4px' }}>
              {navLinks.map((link, idx) => (
                <a key={link.label} href={link.href} style={{
                  display: 'flex', alignItems: 'center', position: 'relative', padding: '0 16px', borderRadius: '8px',
                  fontSize: '14px', fontWeight: idx === activeIdx ? '700' : '500',
                  color: idx === activeIdx ? '#714B67' : '#64647A',
                  textDecoration: 'none',
                  background: idx === activeIdx ? 'rgba(113,75,103,0.07)' : 'transparent',
                  margin: 'auto 0', height: '36px', transition: 'background 0.15s, color 0.15s',
                }}>
                  {link.label}
                  {idx === activeIdx && (
                    <motion.div layoutId="activeTab" style={{
                      position: 'absolute', bottom: '-17px', left: '8px', right: '8px', height: '2.5px',
                      background: 'linear-gradient(90deg,#714B67,#9D6B8F)', borderRadius: '2px 2px 0 0',
                    }} />
                  )}
                </a>
              ))}
            </nav>
          </div>

          {/* Right side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button className="lg:hidden p-2 rounded-lg" style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#555566' }} onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <XNavIcon /> : <MenuIcon />}
            </button>
            <div className="hidden sm:block" style={{ width: '1px', height: '28px', background: 'rgba(113,75,103,0.12)' }} />
            {/* Profile */}
            <div className="relative group hidden sm:flex" style={{ alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '5px 10px 5px 5px', borderRadius: '12px', transition: 'background 0.15s' }}
              onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = 'rgba(113,75,103,0.06)'}
              onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = 'transparent'}>
              <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: 'linear-gradient(135deg,#F0EBF2,#E4D9EC)', color: '#714B67', fontWeight: '800', fontSize: '13px', border: '1.5px solid rgba(113,75,103,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {user?.loginId?.[0]?.toUpperCase() || 'A'}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                <span style={{ fontSize: '13px', fontWeight: '700', color: '#1A1A2E', lineHeight: '1.2' }}>{user?.loginId || 'Admin'}</span>
                <span style={{ fontSize: '10.5px', fontWeight: '500', color: '#9B9BAA' }}>Workspace</span>
              </div>
              <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} style={{ color: '#B0B0C0' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
              {/* Dropdown */}
              <div className="absolute right-0 top-full opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50" style={{ marginTop: '10px', width: '220px' }}>
                <div style={{ background: '#fff', borderRadius: '14px', padding: '6px', border: '1px solid rgba(224,221,227,0.9)', boxShadow: '0 8px 32px -8px rgba(0,0,0,0.14)' }}>
                  <div style={{ padding: '12px 14px', borderBottom: '1px solid #F5F3F7' }}>
                    <p style={{ margin: 0, fontSize: '13px', fontWeight: '700', color: '#1A1A2E' }}>{user?.loginId || 'Admin'}</p>
                    <p style={{ margin: '2px 0 0', fontSize: '11.5px', color: '#9B9BAA' }}>{user?.email || 'admin@example.com'}</p>
                  </div>
                  <div style={{ padding: '6px 0' }}>
                    <button onClick={onLogout} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg border-none bg-transparent cursor-pointer" style={{ fontSize: '13px', fontWeight: '600', color: '#C0392B', textAlign: 'left' }}
                      onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = '#FEF2F2'}
                      onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = 'transparent'}>
                      <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                      Sign out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            style={{ position: 'fixed', top: '68px', left: 0, width: '100%', background: '#fff', borderBottom: '1px solid rgba(113,75,103,0.10)', zIndex: 29, overflow: 'hidden' }}>
            <ul style={{ listStyle: 'none', margin: 0, padding: '8px 0' }}>
              {navLinks.map((link, idx) => (
                <li key={link.label}>
                  <a href={link.href} style={{ display: 'block', padding: '13px 28px', fontSize: '14px', fontWeight: idx === activeIdx ? '700' : '500', textDecoration: 'none', color: idx === activeIdx ? '#714B67' : '#555566', background: idx === activeIdx ? 'rgba(113,75,103,0.06)' : 'transparent', borderLeft: idx === activeIdx ? '3px solid #714B67' : '3px solid transparent' }}>{link.label}</a>
                </li>
              ))}
              <li style={{ borderTop: '1px solid #F5F3F7', marginTop: '6px' }}>
                <button onClick={onLogout} style={{ width: '100%', textAlign: 'left', padding: '13px 28px', fontSize: '14px', fontWeight: '600', color: '#C0392B', border: 'none', background: 'transparent', cursor: 'pointer' }}>Sign out</button>
              </li>
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Field component ──────────────────────────────────────────────────────────
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label style={{ fontSize: '12px', fontWeight: '700', color: '#8E8E9A', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</label>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 14px', borderRadius: '10px',
  border: '1.5px solid #E0DDE3', background: '#F9F7FA',
  fontSize: '14px', fontWeight: '500', color: '#1A1A2E',
  outline: 'none', fontFamily: 'inherit', transition: 'border-color 0.15s, box-shadow 0.15s',
};

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function StockPage() {
  const { user, logout, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);

  // ── State ──
  const { products, setProducts, loading: invLoading } = useInventory();
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortAsc, setSortAsc] = useState(true);
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selected, setSelected] = useState<Product | null>(null);
  const [page, setPage] = useState(1);
  const PER_PAGE = 8;

  // Add/Edit form state
  const [form, setForm] = useState({ name: '', unitCost: '', onHand: '', location: '', category: '' });
  const [stockDelta, setStockDelta] = useState({ add: '', remove: '' });
  const [formError, setFormError] = useState('');
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ── Filtered + Sorted ──
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return products
      .filter(p => p.name.toLowerCase().includes(q) || p.location.toLowerCase().includes(q) || p.category.toLowerCase().includes(q))
      .sort((a, b) => {
        const av = a[sortKey], bv = b[sortKey];
        if (typeof av === 'string') return sortAsc ? av.localeCompare(bv as string) : (bv as string).localeCompare(av);
        return sortAsc ? (av as number) - (bv as number) : (bv as number) - (av as number);
      });
  }, [products, search, sortKey, sortAsc]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc(a => !a);
    else { setSortKey(key); setSortAsc(true); }
  };

  // ── Open modals ──
  const openAdd = () => {
    setForm({ name: '', unitCost: '', onHand: '', location: '', category: '' });
    setFormError('');
    setModalMode('add');
  };
  const openEdit = (p: Product) => {
    setSelected(p);
    setForm({ name: p.name, unitCost: String(p.unitCost), onHand: String(p.onHand), location: p.location, category: p.category });
    setFormError('');
    setModalMode('edit');
  };
  const openStock = (p: Product) => {
    setSelected(p);
    setStockDelta({ add: '', remove: '' });
    setFormError('');
    setModalMode('stock');
  };
  const closeModal = () => { setModalMode(null); setSelected(null); };

  // ── Submit Add ──
  const submitAdd = () => {
    if (!form.name.trim()) { setFormError('Product name is required.'); return; }
    if (!form.unitCost || isNaN(Number(form.unitCost))) { setFormError('Enter a valid unit cost.'); return; }
    const qty = Number(form.onHand) || 0;
    const newP: Product = {
      id: Date.now(), name: form.name.trim(), unitCost: Number(form.unitCost),
      onHand: qty, freeToUse: qty, location: form.location || 'WH/General', category: form.category || 'General',
    };
    setProducts(ps => [newP, ...ps]);
    showToast(`"${newP.name}" added to inventory.`);
    closeModal(); setPage(1);
  };

  // ── Submit Edit ──
  const submitEdit = () => {
    if (!selected) return;
    if (!form.name.trim()) { setFormError('Product name is required.'); return; }
    if (!form.unitCost || isNaN(Number(form.unitCost))) { setFormError('Enter a valid unit cost.'); return; }
    setProducts(ps => ps.map(p => p.id === selected.id ? {
      ...p, name: form.name.trim(), unitCost: Number(form.unitCost),
      onHand: Number(form.onHand) || p.onHand,
      freeToUse: Math.min(Number(form.onHand) || p.onHand, p.freeToUse),
      location: form.location || p.location,
      category: form.category || p.category,
    } : p));
    showToast(`"${form.name}" updated.`);
    closeModal();
  };

  // ── Submit Stock Adjust ──
  const submitStock = () => {
    if (!selected) return;
    const addQty = Number(stockDelta.add) || 0;
    const removeQty = Number(stockDelta.remove) || 0;
    if (addQty < 0 || removeQty < 0) { setFormError('Quantities must be positive.'); return; }
    const newOnHand = selected.onHand + addQty - removeQty;
    if (newOnHand < 0) { setFormError('Cannot remove more than available stock.'); return; }
    setProducts(ps => ps.map(p => p.id === selected.id ? {
      ...p,
      onHand: newOnHand,
      freeToUse: Math.max(0, p.freeToUse + addQty - removeQty),
    } : p));
    showToast(`Stock updated for "${selected.name}".`);
    closeModal();
  };

  // ── Delete ──
  const deleteProduct = (id: number) => {
    const p = products.find(x => x.id === id);
    setProducts(ps => ps.filter(x => x.id !== id));
    showToast(`"${p?.name}" removed.`, 'error');
    closeModal();
  };

  const handleLogout = () => { logout(); router.push('/login'); };

  if (!mounted || loading || invLoading || !isAuthenticated) return null;

  const totalValue = products.reduce((s, p) => s + p.unitCost * p.onHand, 0);
  const totalItems = products.reduce((s, p) => s + p.onHand, 0);
  const lowStock = products.filter(p => p.onHand < 20).length;

  // ── Column header ──
  const ColHeader = ({ label, sortable, k }: { label: string; sortable?: boolean; k?: SortKey }) => (
    <th style={{ padding: '14px 16px', fontSize: '11.5px', fontWeight: '800', color: '#8E8E9A', textTransform: 'uppercase', letterSpacing: '0.08em', borderBottom: '1px solid #F0EDF2', whiteSpace: 'nowrap', cursor: sortable ? 'pointer' : 'default', userSelect: 'none' }}
      onClick={() => sortable && k && handleSort(k)}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        {label}
        {sortable && k && <SortIcon active={sortKey === k} />}
      </div>
    </th>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(circle at top left,#F9F7FA 0%,#F3EFF5 45%,#F0EBF2 100%)', fontFamily: "'Inter', sans-serif" }}>
      {/* bg glow */}
      <div className="pointer-events-none fixed top-0 right-0 w-[500px] h-[500px] rounded-full bg-purple-100/40 blur-3xl" />

      <Navbar user={user} onLogout={handleLogout} />

      {/* ─── Main ─── */}
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center', padding: '48px 32px 80px' }}>
        <main style={{ width: '100%', maxWidth: '1200px', display: 'flex', flexDirection: 'column', gap: '32px' }}>

          {/* ── Page header ── */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
            style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#1A1A2E', letterSpacing: '-0.03em', margin: 0 }}>Stock</h1>
              <p style={{ fontSize: '14px', color: '#8E8E9A', marginTop: '4px', fontWeight: '500' }}>Manage warehouse inventory</p>
            </div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button onClick={openAdd} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', borderRadius: '10px', background: 'linear-gradient(135deg,#714B67,#9D6B8F)', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: '700', boxShadow: '0 4px 16px -4px rgba(113,75,103,0.4)', transition: 'opacity 0.15s' }}
                onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.opacity = '0.88'}
                onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.opacity = '1'}>
                <PlusIcon /> Add Product
              </button>
            </div>
          </motion.div>

          {/* ── Summary KPI cards ── */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.05 }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '20px' }}>
            {[
              { label: 'Total Products', value: products.length.toString(), color: '#714B67', bg: 'rgba(113,75,103,0.07)' },
              { label: 'Total Items', value: totalItems.toLocaleString(), color: '#2563EB', bg: '#EFF6FF' },
              { label: 'Inventory Value', value: `₹${totalValue.toLocaleString()}`, color: '#059669', bg: '#ECFDF5' },
              { label: 'Low Stock Alerts', value: lowStock.toString(), color: lowStock > 0 ? '#DC2626' : '#059669', bg: lowStock > 0 ? '#FEF2F2' : '#ECFDF5' },
            ].map(kpi => (
              <motion.div key={kpi.label} whileHover={{ y: -3, boxShadow: '0 12px 32px -8px rgba(0,0,0,0.12)' }}
                style={{ background: '#fff', borderRadius: '16px', padding: '20px 24px', border: '1px solid #E8E4ED', boxShadow: '0 2px 12px -4px rgba(0,0,0,0.06)' }}>
                <p style={{ fontSize: '11.5px', fontWeight: '700', color: '#8E8E9A', textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 8px' }}>{kpi.label}</p>
                <p style={{ fontSize: '26px', fontWeight: '800', color: kpi.color, margin: 0, letterSpacing: '-0.03em' }}>{kpi.value}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* ── Table card ── */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}
            style={{ background: '#fff', borderRadius: '20px', border: '1px solid #E8E4ED', boxShadow: '0 4px 24px -8px rgba(0,0,0,0.08)', overflow: 'hidden' }}>

            {/* Table toolbar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid #F0EDF2', gap: '16px', flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: '15px', fontWeight: '800', color: '#1A1A2E', margin: 0 }}>
                Inventory · <span style={{ color: '#8E8E9A', fontWeight: '600' }}>{filtered.length} products</span>
              </h2>
              {/* Search */}
              <div style={{ position: 'relative', minWidth: '240px' }}>
                <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#B0B0C0' }}><SearchIcon /></span>
                <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
                  placeholder="Search products…"
                  style={{ ...inputStyle, paddingLeft: '38px', height: '38px', fontSize: '13.5px' }} />
              </div>
            </div>

            {/* Table */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '720px' }}>
                <thead style={{ background: '#FAF8FC' }}>
                  <tr>
                    <ColHeader label="Product" sortable k="name" />
                    <ColHeader label="Category" />
                    <ColHeader label="Location" />
                    <ColHeader label="Per Unit Cost" sortable k="unitCost" />
                    <ColHeader label="On Hand" sortable k="onHand" />
                    <ColHeader label="Free To Use" sortable k="freeToUse" />
                    <th style={{ padding: '14px 16px', fontSize: '11.5px', fontWeight: '800', color: '#8E8E9A', textTransform: 'uppercase', letterSpacing: '0.08em', borderBottom: '1px solid #F0EDF2', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ padding: '80px 24px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                          <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(113,75,103,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9D6B8F' }}>
                            <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                          </div>
                          <div>
                            <p style={{ fontSize: '15px', fontWeight: '700', color: '#1A1A2E', margin: '0 0 6px' }}>No products found</p>
                            <p style={{ fontSize: '13px', color: '#8E8E9A', margin: 0 }}>
                              {search ? 'Try a different search term.' : 'Add your first product to begin managing inventory.'}
                            </p>
                          </div>
                          {!search && (
                            <button onClick={openAdd} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '10px', background: 'linear-gradient(135deg,#714B67,#9D6B8F)', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: '700' }}>
                              <PlusIcon /> Add Product
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginated.map((p, idx) => {
                      const isLow = p.onHand < 20;
                      return (
                        <motion.tr key={p.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.04 }}
                          style={{ borderBottom: '1px solid #F8F5FB', cursor: 'pointer' }}
                          onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.background = '#FAF8FC'}
                          onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.background = 'transparent'}>
                          <td style={{ padding: '14px 16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: 'rgba(113,75,103,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#714B67', flexShrink: 0 }}>
                                <BoxIcon />
                              </div>
                              <span style={{ fontSize: '14px', fontWeight: '700', color: '#1A1A2E' }}>{p.name}</span>
                            </div>
                          </td>
                          <td style={{ padding: '14px 16px' }}>
                            <span style={{ fontSize: '12.5px', fontWeight: '600', color: '#714B67', background: 'rgba(113,75,103,0.08)', padding: '3px 10px', borderRadius: '6px' }}>{p.category}</span>
                          </td>
                          <td style={{ padding: '14px 16px', fontSize: '13px', color: '#8E8E9A', fontWeight: '500' }}>{p.location}</td>
                          <td style={{ padding: '14px 16px', fontSize: '14px', fontWeight: '700', color: '#1A1A2E' }}>₹{p.unitCost.toLocaleString()}</td>
                          <td style={{ padding: '14px 16px' }}>
                            <span style={{ fontSize: '14px', fontWeight: '800', color: isLow ? '#DC2626' : '#1A1A2E' }}>{p.onHand}</span>
                            {isLow && <span style={{ marginLeft: '6px', fontSize: '11px', fontWeight: '700', color: '#DC2626', background: '#FEF2F2', padding: '2px 6px', borderRadius: '4px', border: '1px solid #FEE2E2' }}>Low</span>}
                          </td>
                          <td style={{ padding: '14px 16px', fontSize: '14px', fontWeight: '700', color: '#059669' }}>{p.freeToUse}</td>
                          <td style={{ padding: '14px 16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'flex-end' }}>
                              <button onClick={() => openStock(p)} title="Adjust Stock"
                                style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 12px', borderRadius: '8px', border: '1px solid rgba(37,99,235,0.15)', background: '#EFF6FF', color: '#2563EB', cursor: 'pointer', fontSize: '12.5px', fontWeight: '600', transition: 'all 0.15s' }}
                                onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = '#DBEAFE'}
                                onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = '#EFF6FF'}>
                                <BoxIcon /> Stock
                              </button>
                              <button onClick={() => openEdit(p)} title="Edit Product"
                                style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 12px', borderRadius: '8px', border: '1px solid rgba(113,75,103,0.15)', background: 'rgba(113,75,103,0.07)', color: '#714B67', cursor: 'pointer', fontSize: '12.5px', fontWeight: '600', transition: 'all 0.15s' }}
                                onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = 'rgba(113,75,103,0.14)'}
                                onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = 'rgba(113,75,103,0.07)'}>
                                <EditIcon /> Edit
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderTop: '1px solid #F0EDF2' }}>
                <span style={{ fontSize: '13px', color: '#8E8E9A', fontWeight: '500' }}>
                  Showing {((page - 1) * PER_PAGE) + 1}–{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length}
                </span>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                    <button key={n} onClick={() => setPage(n)} style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid', borderColor: n === page ? '#714B67' : '#E0DDE3', background: n === page ? 'rgba(113,75,103,0.1)' : '#fff', color: n === page ? '#714B67' : '#8E8E9A', cursor: 'pointer', fontSize: '13px', fontWeight: n === page ? '700' : '500' }}>{n}</button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </main>
      </div>

      {/* ─── Modals ─── */}
      <AnimatePresence>
        {modalMode && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(26,26,46,0.45)', backdropFilter: 'blur(6px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
            onClick={e => { if (e.target === e.currentTarget) closeModal(); }}>
            <motion.div initial={{ opacity: 0, scale: 0.94, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.94, y: 16 }} transition={{ type: 'spring', stiffness: 360, damping: 30 }}
              style={{ background: '#fff', borderRadius: '20px', padding: '32px', width: '100%', maxWidth: '480px', boxShadow: '0 24px 80px -12px rgba(0,0,0,0.25)', border: '1px solid rgba(224,221,227,0.8)' }}>

              {/* Modal header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <div>
                  <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#1A1A2E', letterSpacing: '-0.02em' }}>
                    {modalMode === 'add' ? 'Add Product' : modalMode === 'edit' ? 'Edit Product' : 'Adjust Stock'}
                  </h2>
                  {selected && modalMode !== 'add' && <p style={{ margin: '3px 0 0', fontSize: '13px', color: '#8E8E9A' }}>{selected.name}</p>}
                </div>
                <button onClick={closeModal} style={{ width: '34px', height: '34px', borderRadius: '9px', border: '1px solid #E0DDE3', background: '#F9F7FA', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8E8E9A' }}>
                  <CloseIcon />
                </button>
              </div>

              {/* Add / Edit form */}
              {(modalMode === 'add' || modalMode === 'edit') && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <Field label="Product Name">
                    <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Standing Desk" style={inputStyle} />
                  </Field>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <Field label="Unit Cost (₹)">
                      <input type="number" value={form.unitCost} onChange={e => setForm(f => ({ ...f, unitCost: e.target.value }))} placeholder="3000" style={inputStyle} />
                    </Field>
                    <Field label="Initial Quantity">
                      <input type="number" value={form.onHand} onChange={e => setForm(f => ({ ...f, onHand: e.target.value }))} placeholder="50" style={inputStyle} />
                    </Field>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <Field label="Category">
                      <input value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} placeholder="Electronics" style={inputStyle} />
                    </Field>
                    <Field label="Location">
                      <input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="WH/Rack-A1" style={inputStyle} />
                    </Field>
                  </div>
                </div>
              )}

              {/* Stock adjust form */}
              {modalMode === 'stock' && selected && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {/* Current state */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    {[{ label: 'Current On Hand', value: selected.onHand }, { label: 'Free To Use', value: selected.freeToUse }].map(s => (
                      <div key={s.label} style={{ background: '#FAF8FC', borderRadius: '12px', padding: '14px 16px', border: '1px solid #F0EDF2' }}>
                        <p style={{ margin: '0 0 4px', fontSize: '11.5px', fontWeight: '700', color: '#8E8E9A', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</p>
                        <p style={{ margin: 0, fontSize: '22px', fontWeight: '800', color: '#1A1A2E' }}>{s.value}</p>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <Field label="➕ Add Quantity">
                      <input type="number" value={stockDelta.add} onChange={e => setStockDelta(d => ({ ...d, add: e.target.value }))} placeholder="0" min="0" style={{ ...inputStyle, borderColor: stockDelta.add ? '#059669' : '#E0DDE3' }} />
                    </Field>
                    <Field label="➖ Remove Quantity">
                      <input type="number" value={stockDelta.remove} onChange={e => setStockDelta(d => ({ ...d, remove: e.target.value }))} placeholder="0" min="0" style={{ ...inputStyle, borderColor: stockDelta.remove ? '#DC2626' : '#E0DDE3' }} />
                    </Field>
                  </div>
                  {/* Preview */}
                  {(stockDelta.add || stockDelta.remove) && (
                    <div style={{ background: 'rgba(113,75,103,0.06)', borderRadius: '10px', padding: '12px 16px', border: '1px solid rgba(113,75,103,0.12)' }}>
                      <p style={{ margin: 0, fontSize: '13px', fontWeight: '600', color: '#714B67' }}>
                        New On Hand: <strong>{selected.onHand + (Number(stockDelta.add) || 0) - (Number(stockDelta.remove) || 0)}</strong>
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Error */}
              {formError && (
                <p style={{ margin: '12px 0 0', fontSize: '13px', fontWeight: '600', color: '#DC2626' }}>{formError}</p>
              )}

              {/* Actions */}
              <div style={{ display: 'flex', gap: '10px', marginTop: '24px', justifyContent: 'space-between' }}>
                {modalMode === 'edit' && (
                  <button onClick={() => deleteProduct(selected!.id)} style={{ padding: '10px 16px', borderRadius: '10px', border: '1px solid #FEE2E2', background: '#FEF2F2', color: '#DC2626', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>Delete</button>
                )}
                <div style={{ display: 'flex', gap: '10px', marginLeft: 'auto' }}>
                  <button onClick={closeModal} style={{ padding: '10px 20px', borderRadius: '10px', border: '1px solid #E0DDE3', background: '#fff', color: '#555566', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}>Cancel</button>
                  <button onClick={modalMode === 'add' ? submitAdd : modalMode === 'edit' ? submitEdit : submitStock}
                    style={{ padding: '10px 24px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg,#714B67,#9D6B8F)', color: '#fff', cursor: 'pointer', fontSize: '14px', fontWeight: '700', boxShadow: '0 4px 12px -4px rgba(113,75,103,0.4)' }}>
                    {modalMode === 'add' ? 'Add Product' : modalMode === 'edit' ? 'Save Changes' : 'Update Stock'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Toast ─── */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }}
            style={{ position: 'fixed', bottom: '28px', right: '28px', zIndex: 200, background: toast.type === 'success' ? '#1A1A2E' : '#DC2626', color: '#fff', padding: '14px 20px', borderRadius: '12px', fontSize: '13.5px', fontWeight: '600', boxShadow: '0 8px 32px -8px rgba(0,0,0,0.3)', maxWidth: '320px' }}>
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
