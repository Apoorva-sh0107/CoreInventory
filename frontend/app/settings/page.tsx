'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useInventory, Warehouse, Location } from '@/context/InventoryContext';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

// Icons
const PlusIcon = () => ( <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg> );
const TrashIcon = () => ( <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6M1 7h22M10 11H9M14 11h-1M9 4V3a1 1 0 011-1h4a1 1 0 011 1v1" /></svg> );
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
  const activeIdx = 4;

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
    </>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 14px', borderRadius: '10px',
  border: '1.5px solid #E0DDE3', background: '#F9F7FA',
  fontSize: '14px', fontWeight: '500', color: '#1A1A2E',
  outline: 'none', transition: 'all 0.15s ease'
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label style={{ fontSize: '11.5px', fontWeight: '800', color: '#8E8E9A', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</label>
      {children}
    </div>
  );
}

export default function SettingsPage() {
  const { user, logout, isAuthenticated, loading } = useAuth();
  const { warehouses, locations, addWarehouse, addLocation, loading: invLoading } = useInventory();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'warehouse' | 'location'>('warehouse');

  // Form states
  const [whForm, setWhForm] = useState({ name: '', code: '', address: '' });
  const [locForm, setLocForm] = useState({ name: '', code: '', warehouseCode: '' });
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');

  useEffect(() => {
    setMounted(true);
    if (!loading && !isAuthenticated) router.push('/login');
  }, [loading, isAuthenticated, router]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleLogout = () => { logout(); router.push('/login'); };

  const handleAddWarehouse = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const { name, code, address } = whForm;
    if (!name.trim() || !code.trim()) { setError('Name and Short Code are required.'); return; }
    if (warehouses.some(w => w.code.toLowerCase() === code.toLowerCase())) { setError('Warehouse Short Code must be unique.'); return; }

    addWarehouse(name.trim(), code.trim().toUpperCase(), address.trim());
    showToast(`Warehouse "${code.toUpperCase()}" added.`);
    setWhForm({ name: '', code: '', address: '' });
  };

  const handleAddLocation = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const { name, code, warehouseCode } = locForm;
    if (!name.trim() || !code.trim() || !warehouseCode) { setError('All fields are required.'); return; }
    
    // Check duplication inside exact same warehouse
    const duplicate = locations.some(l => 
      l.warehouseCode === warehouseCode && l.code.toLowerCase() === code.toLowerCase()
    );
    if (duplicate) { setError('Location Code duplicate inside same warehouse.'); return; }

    addLocation(name.trim(), code.trim(), warehouseCode);
    showToast(`Location "${warehouseCode}/${code}" added.`);
    setLocForm({ name: '', code: '', warehouseCode });
  };

  if (!mounted || loading || invLoading || !isAuthenticated) return null;

  return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(circle at top left, #F9F7FA 0%, #F3EFF5 45%, #F0EBF2 100%)', fontFamily: "'Inter', sans-serif" }}>
      <Navbar user={user} onLogout={handleLogout} />

      <div style={{ width: '100%', display: 'flex', justifyContent: 'center', padding: '48px 32px' }}>
        <main style={{ width: '100%', maxWidth: '1000px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* Header */}
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#1A1A2E', letterSpacing: '-0.03em', margin: 0 }}>Settings</h1>
            <p style={{ fontSize: '14px', color: '#8E8E9A', marginTop: '4px', fontWeight: '500' }}>Configure physical infrastructure</p>
          </div>

          {/* Configuration Tabs */}
          <div style={{ display: 'flex', gap: '8px', background: 'white', padding: '6px', borderRadius: '14px', alignSelf: 'flex-start', border: '1px solid #E8E4ED', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
            {[
              { id: 'warehouse', label: 'Warehouse' },
              { id: 'location', label: 'Locations' }
            ].map(tab => {
              const isActive = activeTab === tab.id;
              return (
                <button key={tab.id} onClick={() => { setActiveTab(tab.id as any); setError(''); }} style={{
                  padding: '10px 20px', borderRadius: '10px', border: 'none',
                  background: isActive ? 'rgba(113,75,103,0.08)' : 'transparent', color: isActive ? '#714B67' : '#64647A', cursor: 'pointer', fontSize: '14px', fontWeight: '700', transition: 'all 0.15s'
                }}>{tab.label}</button>
              );
            })}
          </div>

          {/* Form & List Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', alignItems: 'flex-start' }}>

            {/* Left: Form Card */}
            <motion.div key={activeTab} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} style={{ background: 'white', borderRadius: '20px', padding: '32px', border: '1px solid #E8E4ED', boxShadow: '0 4px 24px rgba(0,0,0,0.04)' }}>
              <h2 style={{ margin: '0 0 24px', fontSize: '17px', fontWeight: '800', color: '#1A1A2E' }}>
                {activeTab === 'warehouse' ? 'Add Warehouse' : 'Add Location'}
              </h2>

              {activeTab === 'warehouse' ? (
                <form onSubmit={handleAddWarehouse} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <Field label="Warehouse Name">
                    <input value={whForm.name} onChange={e => setWhForm({ ...whForm, name: e.target.value })} placeholder="e.g. Main Warehouse" style={inputStyle} />
                  </Field>
                  <Field label="Short Code">
                    <input value={whForm.code} onChange={e => setWhForm({ ...whForm, code: e.target.value })} placeholder="e.g. WH" style={inputStyle} maxLength={5} />
                  </Field>
                  <Field label="Address">
                    <input value={whForm.address} onChange={e => setWhForm({ ...whForm, address: e.target.value })} placeholder="e.g. Sector 5, Zone B" style={inputStyle} />
                  </Field>
                  {error && <p style={{ color: '#DC2626', fontSize: '12.5px', fontWeight: '600', margin: 0 }}>{error}</p>}
                  <button type="submit" style={{ padding: '12px', background: 'linear-gradient(135deg, #714B67, #9D6B8F)', color: 'white', border: 'none', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '8px' }}>
                    <PlusIcon /> Add Warehouse
                  </button>
                </form>
              ) : (
                <form onSubmit={handleAddLocation} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <Field label="Location Name">
                    <input value={locForm.name} onChange={e => setLocForm({ ...locForm, name: e.target.value })} placeholder="e.g. Rack A" style={inputStyle} />
                  </Field>
                  <Field label="Short Code">
                    <input value={locForm.code} onChange={e => setLocForm({ ...locForm, code: e.target.value })} placeholder="e.g. Rack-A1" style={inputStyle} />
                  </Field>
                  <Field label="Warehouse">
                    <select value={locForm.warehouseCode} onChange={e => setLocForm({ ...locForm, warehouseCode: e.target.value })} style={inputStyle}>
                      <option value="" disabled>Select parent warehouse...</option>
                      {warehouses.map(w => (
                        <option key={w.code} value={w.code}>{w.name} ({w.code})</option>
                      ))}
                    </select>
                  </Field>
                  {error && <p style={{ color: '#DC2626', fontSize: '12.5px', fontWeight: '600', margin: 0 }}>{error}</p>}
                  <button type="submit" style={{ padding: '12px', background: 'linear-gradient(135deg, #714B67, #9D6B8F)', color: 'white', border: 'none', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '8px' }}>
                    <PlusIcon /> Add Location
                  </button>
                </form>
              )}
            </motion.div>

            {/* Right: Table Card */}
            <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} style={{ background: 'white', borderRadius: '20px', border: '1px solid #E8E4ED', boxShadow: '0 4px 24px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
              <div style={{ padding: '20px 24px', borderBottom: '1px solid #F0EDF2' }}>
                <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '800', color: '#1A1A2E' }}>
                  {activeTab === 'warehouse' ? 'Warehouse List' : 'Location List'}
                </h3>
              </div>

              {activeTab === 'warehouse' ? (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ background: '#FAF8FC' }}>
                      <tr>{['Code', 'Name', 'Address'].map(h => <th key={h} style={{ padding: '12px 16px', fontSize: '11px', fontWeight: '800', color: '#8E8E9A', textTransform: 'uppercase', borderBottom: '1px solid #F0EDF2', textAlign: 'left' }}>{h}</th>)}</tr>
                    </thead>
                    <tbody>
                      {warehouses.map(w => (
                        <tr key={w.id} style={{ borderBottom: '1px solid #F8F5FB' }}>
                          <td style={{ padding: '12px 16px', fontSize: '13.5px', fontWeight: '800', color: '#714B67' }}>{w.code}</td>
                          <td style={{ padding: '12px 16px', fontSize: '13.5px', fontWeight: '700', color: '#1A1A2E' }}>{w.name}</td>
                          <td style={{ padding: '12px 16px', fontSize: '13px', color: '#8E8E9A' }}>{w.address}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ background: '#FAF8FC' }}>
                      <tr>{['Full Path', 'Name'].map(h => <th key={h} style={{ padding: '12px 16px', fontSize: '11px', fontWeight: '800', color: '#8E8E9A', textTransform: 'uppercase', borderBottom: '1px solid #F0EDF2', textAlign: 'left' }}>{h}</th>)}</tr>
                    </thead>
                    <tbody>
                      {locations.map(l => (
                        <tr key={l.id} style={{ borderBottom: '1px solid #F8F5FB' }}>
                          <td style={{ padding: '12px 16px', fontSize: '13.5px', fontWeight: '800', color: '#2563EB' }}>{l.warehouseCode} / {l.code}</td>
                          <td style={{ padding: '12px 16px', fontSize: '13.5px', fontWeight: '700', color: '#1A1A2E' }}>{l.name}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>

          </div>

        </main>
      </div>
      
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }} style={{ position: 'fixed', bottom: '32px', left: '50%', transform: 'translateX(-50%)', background: '#1A1A2E', color: 'white', padding: '12px 24px', borderRadius: '12px', fontSize: '14px', fontWeight: '600', zIndex: 1000 }}>
            🎉 {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
