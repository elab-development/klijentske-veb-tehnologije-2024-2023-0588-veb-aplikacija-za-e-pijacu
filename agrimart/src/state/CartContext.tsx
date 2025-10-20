import {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
  type ReactNode,
} from 'react';
import Cart, { type CartSnapshot } from '../lib/cart';
import type { Product } from '../data/products';
import { LocalStorageCartStore } from '../lib/cartStorage';

type CartAPI = {
  cart: Cart;
  snapshot: CartSnapshot;
  add: (product: Product, quantity?: number) => void;
  setQty: (productId: string, quantity: number) => void;
  inc: (productId: string, delta?: number) => void;
  dec: (productId: string, delta?: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartAPI | null>(null);
const store = new LocalStorageCartStore('agrimart:cart');

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart>(() => Cart.from(store.load()));

  useEffect(() => {
    store.save(cart.toJSON());
  }, [cart]);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== store.key) return;
      setCart(Cart.from(store.load()));
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const api: CartAPI = useMemo(() => {
    const add = (product: Product, quantity = 1) =>
      setCart((c) => c.add(product, quantity));
    const setQty = (productId: string, quantity: number) =>
      setCart((c) => c.set(productId, quantity));
    const inc = (productId: string, delta = 1) =>
      setCart((c) => c.inc(productId, delta));
    const dec = (productId: string, delta = 1) =>
      setCart((c) => c.dec(productId, delta));
    const remove = (productId: string) => setCart((c) => c.remove(productId));
    const clear = () => setCart((c) => c.clear());

    return {
      cart,
      snapshot: cart.toJSON(),
      add,
      setQty,
      inc,
      dec,
      remove,
      clear,
    };
  }, [cart]);

  return <CartContext.Provider value={api}>{children}</CartContext.Provider>;
}

export function useCart(): CartAPI {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within <CartProvider>');
  return ctx;
}
