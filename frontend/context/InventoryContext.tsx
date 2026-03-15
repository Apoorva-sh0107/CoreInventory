'use client';

import { createContext, useState, useContext, useEffect, ReactNode } from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────
export interface Product {
  id: number;
  name: string;
  unitCost: number;
  onHand: number;
  freeToUse: number;
  location: string;
  category: string;
}

export interface OperationMove {
  id: string;
  type: 'Receipt' | 'Delivery' | 'Adjustment';
  status: 'Done' | 'Ready' | 'Waiting' | 'Late';
  date: string;
  contact: string; // Supplier or Customer or Reason
  productName: string;
  quantity: number;
  fromLocation: string;
  toLocation: string;
}

export interface Warehouse {
  id: string;
  name: string;
  code: string; // e.g., WH
  address: string;
}

export interface Location {
  id: string;
  name: string;
  code: string; // e.g., Stock1
  warehouseCode: string; // e.g., WH
}

export interface ReceiptItem {
  productId: number;
  quantity: number;
}

export interface ReceiptDocument {
  id: string; // WH/IN/0001
  status: 'Draft' | 'Ready' | 'Done';
  vendor: string;
  date: string; // scheduled date
  responsible: string;
  items: ReceiptItem[];
  warehouseCode: string;
}

export interface DeliveryDocument {
  id: string; // WH/OUT/0001
  status: 'Draft' | 'Waiting' | 'Ready' | 'Done';
  customer: string;
  date: string; // scheduled date
  responsible: string;
  items: ReceiptItem[]; // Reusing item structure
  warehouseCode: string;
}

interface InventoryContextType {
  products: Product[];
  operations: OperationMove[];
  warehouses: Warehouse[];
  locations: Location[];
  receipts: ReceiptDocument[];
  deliveries: DeliveryDocument[];
  loading: boolean;
  addReceipt: (productId: number, qty: number, supplier: string, location: string) => void;
  addDelivery: (productId: number, qty: number, customer: string, location: string) => boolean; // returns false if insufficient
  addAdjustment: (productId: number, qty: number, reason: string) => void;
  addWarehouse: (name: string, code: string, address: string) => void;
  addLocation: (name: string, code: string, warehouseCode: string) => void;
  addReceiptDoc: (doc: any) => Promise<void>;
  updateReceiptDocStatus: (id: string, newStatus: 'Draft' | 'Ready' | 'Done') => void;
  addDeliveryDoc: (doc: any) => Promise<void>;
  updateDeliveryDocStatus: (id: string, newStatus: 'Draft' | 'Waiting' | 'Ready' | 'Done') => void;
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

const INITIAL_PRODUCTS: Product[] = [
  { id: 1, name: 'Standing Desk',    unitCost: 3000, onHand: 50, freeToUse: 45, location: 'WH/Rack-A1', category: 'Furniture' },
  { id: 2, name: 'Office Chair',     unitCost: 1500, onHand: 80, freeToUse: 80, location: 'WH/Rack-A2', category: 'Furniture' },
  { id: 3, name: 'Monitor 27"',      unitCost: 8500, onHand: 30, freeToUse: 28, location: 'WH/Rack-B1', category: 'Electronics' },
  { id: 4, name: 'Mechanical Keyboard', unitCost: 2200, onHand: 60, freeToUse: 60, location: 'WH/Rack-B2', category: 'Electronics' },
  { id: 5, name: 'Wireless Mouse',   unitCost: 950,  onHand: 120, freeToUse: 110, location: 'WH/Rack-B3', category: 'Electronics' },
  { id: 6, name: 'Laptop Stand',     unitCost: 600,  onHand: 40,  freeToUse: 40,  location: 'WH/Rack-C1', category: 'Accessories' },
];

const INITIAL_MOVES: OperationMove[] = [
  { id: 'WH/IN/0001', type: 'Receipt', status: 'Done', date: '2026-03-14', contact: 'Tech Vendor Inc', productName: 'Monitor 27"', quantity: 10, fromLocation: 'Vendor', toLocation: 'WH/Rack-B1' },
  { id: 'WH/OUT/0002', type: 'Delivery', status: 'Ready', date: '2026-03-14', contact: 'Local Market', productName: 'Office Chair', quantity: 5, fromLocation: 'WH/Rack-A2', toLocation: 'Customer' },
  { id: 'WH/IN/0003', type: 'Receipt', status: 'Waiting', date: '2026-03-15', contact: 'Global Supplies', productName: 'Standing Desk', quantity: 15, fromLocation: 'Vendor', toLocation: 'WH/Rack-A1' },
  { id: 'WH/OUT/0004', type: 'Delivery', status: 'Done', date: '2026-03-13', contact: 'Store #402', productName: 'Wireless Mouse', quantity: 20, fromLocation: 'WH/Rack-B3', toLocation: 'Customer' },
];

const INITIAL_WAREHOUSES: Warehouse[] = [
  { id: '1', name: 'Main Warehouse', code: 'WH', address: 'Industrial Area Sector 5' }
];

const INITIAL_LOCATIONS: Location[] = [
  { id: '1', name: 'Rack A1', code: 'Rack-A1', warehouseCode: 'WH' },
  { id: '2', name: 'Rack A2', code: 'Rack-A2', warehouseCode: 'WH' },
  { id: '3', name: 'Rack B1', code: 'Rack-B1', warehouseCode: 'WH' },
  { id: '4', name: 'Rack B2', code: 'Rack-B2', warehouseCode: 'WH' },
  { id: '5', name: 'Rack B3', code: 'Rack-B3', warehouseCode: 'WH' },
  { id: '6', name: 'Rack C1', code: 'Rack-C1', warehouseCode: 'WH' },
];

const INITIAL_RECEIPTS: ReceiptDocument[] = [
  { id: 'WH/IN/0001', status: 'Draft', vendor: 'Azure Interior', date: '2026-03-20', responsible: 'Admin', warehouseCode: 'WH', items: [{ productId: 1, quantity: 10 }] },
  { id: 'WH/IN/0002', status: 'Ready', vendor: 'Vendor Inc', date: '2026-03-18', responsible: 'Admin', warehouseCode: 'WH', items: [{ productId: 4, quantity: 15 }, { productId: 5, quantity: 5 }] },
];

const INITIAL_DELIVERIES: DeliveryDocument[] = [
  { id: 'WH/OUT/0001', status: 'Ready', customer: 'Local Market', date: '2026-03-19', responsible: 'Admin', warehouseCode: 'WH', items: [{ productId: 2, quantity: 5 }] },
  { id: 'WH/OUT/0002', status: 'Draft', customer: 'General Store', date: '2026-03-22', responsible: 'Admin', warehouseCode: 'WH', items: [{ productId: 3, quantity: 2 }] },
];

export function InventoryProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [operations, setOperations] = useState<OperationMove[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [receipts, setReceipts] = useState<ReceiptDocument[]>([]);
  const [deliveries, setDeliveries] = useState<DeliveryDocument[]>([]);
  const [loading, setLoading] = useState(true);

  // Load from Backend APIs
  useEffect(() => {
    const loadInventoryData = async () => {
      setLoading(true);
      try {
        const [prodRes, recRes, delRes, whRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/receipts'),
          fetch('/api/deliveries'),
          fetch('/api/warehouses')
        ]);

        if (prodRes.ok) setProducts(await prodRes.json());
        if (recRes.ok) setReceipts(await recRes.json());
        if (delRes.ok) setDeliveries(await delRes.json());
        if (whRes.ok) setWarehouses(await whRes.json());

        // Locations fallback loading or fetch if added
      } catch (err) {
        console.error("Failed to load inventory data flows:", err);
      } finally {
        setLoading(false);
      }
    };

    loadInventoryData();
  }, []);

  const addReceipt = (productId: number, qty: number, supplier: string, location: string) => {
    const updatedProducts = products.map(p => 
      p.id === productId ? { ...p, onHand: p.onHand + qty, freeToUse: p.freeToUse + qty, location: location || p.location } : p
    );
    const product = products.find(p => p.id === productId);
    const newMove: OperationMove = {
      id: `WH/IN/${(operations.length + 1).toString().padStart(4, '0')}`,
      type: 'Receipt', status: 'Done', date: new Date().toISOString().split('T')[0],
      contact: supplier, productName: product?.name || 'Unknown', quantity: qty,
      fromLocation: 'Vendor', toLocation: location || product?.location || 'WH/Stock'
    };
    setProducts(updatedProducts);
    setOperations([newMove, ...operations]);
  };

  const addDelivery = (productId: number, qty: number, customer: string, location: string): boolean => {
    const product = products.find(p => p.id === productId);
    if (!product || product.freeToUse < qty) return false;

    const updatedProducts = products.map(p => 
      p.id === productId ? { ...p, onHand: p.onHand - qty, freeToUse: p.freeToUse - qty, location: location || p.location } : p
    );
    const newMove: OperationMove = {
      id: `WH/OUT/${(operations.length + 1).toString().padStart(4, '0')}`,
      type: 'Delivery', status: 'Done', date: new Date().toISOString().split('T')[0],
      contact: customer, productName: product.name, quantity: qty,
      fromLocation: product.location, toLocation: 'Customer'
    };
    setProducts(updatedProducts);
    setOperations([newMove, ...operations]);
    return true;
  };

  const addAdjustment = (productId: number, qty: number, reason: string) => {
    const updatedProducts = products.map(p => {
      if (p.id === productId) {
        const newOnHand = p.onHand + qty;
        return { ...p, onHand: newOnHand, freeToUse: Math.max(0, p.freeToUse + qty) }; // simple rule
      }
      return p;
    });
    const product = products.find(p => p.id === productId);
    const newMove: OperationMove = {
      id: `WH/ADJ/${(operations.length + 1).toString().padStart(4, '0')}`,
      type: 'Adjustment', status: 'Done', date: new Date().toISOString().split('T')[0],
      contact: reason, productName: product?.name || 'Unknown', quantity: qty,
      fromLocation: product?.location || 'WH/Stock', toLocation: 'Adjustment'
    };
    setProducts(updatedProducts);
    setOperations([newMove, ...operations]);
  };

  const addWarehouse = (name: string, code: string, address: string) => {
    const newWh: Warehouse = { id: Date.now().toString(), name, code, address };
    setWarehouses([...warehouses, newWh]);
  };

  const addLocation = (name: string, code: string, warehouseCode: string) => {
    const newLoc: Location = { id: Date.now().toString(), name, code, warehouseCode };
    setLocations([...locations, newLoc]);
  };

  const addReceiptDoc = async (doc: any) => {
    try {
      const res = await fetch('/api/receipts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(doc)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setReceipts(prev => [data.document, ...prev]);
      }
    } catch (err) {
      console.error('addReceiptDoc error', err);
    }
  };

  const updateReceiptDocStatus = (id: string, newStatus: 'Draft' | 'Ready' | 'Done') => {
    let productsUpdated = [...products];
    let newMoves: OperationMove[] = [];

    const updated = receipts.map(r => {
      if (r.id === id) {
        if (newStatus === 'Done' && r.status !== 'Done') {
          r.items.forEach(item => {
            const product = productsUpdated.find(p => p.id === item.productId);
            if (product) {
              productsUpdated = productsUpdated.map(p => 
                p.id === item.productId ? { ...p, onHand: p.onHand + item.quantity, freeToUse: p.freeToUse + item.quantity } : p
              );

              newMoves.push({
                id: r.id,
                type: 'Receipt', status: 'Done', date: new Date().toISOString().split('T')[0],
                contact: r.vendor, productName: product.name, quantity: item.quantity,
                fromLocation: 'Vendor', toLocation: product.location || 'WH/Stock'
              });
            }
          });
        }
        return { ...r, status: newStatus };
      }
      return r;
    });

    if (newMoves.length > 0) {
      setProducts(productsUpdated);
      setOperations(prev => [...newMoves, ...prev]);
    }
    setReceipts(updated);
  };

  const addDeliveryDoc = async (doc: any) => {
    try {
      const res = await fetch('/api/deliveries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(doc)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setDeliveries(prev => [data.document, ...prev]);
      }
    } catch (err) {
      console.error('addDeliveryDoc error', err);
    }
  };

  const updateDeliveryDocStatus = (id: string, newStatus: 'Draft' | 'Waiting' | 'Ready' | 'Done') => {
    let productsUpdated = [...products];
    let newMoves: OperationMove[] = [];

    const updated = deliveries.map(d => {
      if (d.id === id) {
        if (newStatus === 'Done' && d.status !== 'Done') {
          // Verify stock availability
          let sufficient = true;
          d.items.forEach(item => {
            const product = productsUpdated.find(p => p.id === item.productId);
            if (!product || product.freeToUse < item.quantity) sufficient = false;
          });

          if (!sufficient) return d; // Cannot validate if insufficient

          d.items.forEach(item => {
            const product = productsUpdated.find(p => p.id === item.productId);
            if (product) {
              productsUpdated = productsUpdated.map(p => 
                p.id === item.productId ? { ...p, onHand: p.onHand - item.quantity, freeToUse: p.freeToUse - item.quantity } : p
              );

              newMoves.push({
                id: d.id,
                type: 'Delivery', status: 'Done', date: new Date().toISOString().split('T')[0],
                contact: d.customer, productName: product.name, quantity: item.quantity,
                fromLocation: product.location || 'WH/Stock', toLocation: 'Customer'
              });
            }
          });
        }
        return { ...d, status: newStatus };
      }
      return d;
    });

    if (newMoves.length > 0) {
      setProducts(productsUpdated);
      setOperations(prev => [...newMoves, ...prev]);
    }
    setDeliveries(updated);
  };

  return (
    <InventoryContext.Provider value={{ products, operations, warehouses, locations, receipts, deliveries, loading, addReceipt, addDelivery, addAdjustment, addWarehouse, addLocation, addReceiptDoc, updateReceiptDocStatus, addDeliveryDoc, updateDeliveryDocStatus, setProducts }}>
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const context = useContext(InventoryContext);
  if (!context) throw new Error('useInventory must be used within InventoryProvider');
  return context;
}
