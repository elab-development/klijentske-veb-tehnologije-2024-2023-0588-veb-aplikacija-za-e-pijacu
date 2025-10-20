import type { Product, Unit, ProductType } from '../data/products';

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  unit: Unit;
  quantity: number;
  imageUrl: string;
  sellerId: string;
  sellerName: string;
  isOrganic: boolean;
  type: ProductType;
}

export interface CartSnapshot {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
}

const clampQty = (q: number) => Math.max(0, Math.floor(q || 0));
const asKey = (productId: string) => productId.trim();
const round2 = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;

export class Cart {
  private readonly _items: Map<string, CartItem>;

  constructor(items?: CartItem[] | Map<string, CartItem>) {
    if (items instanceof Map) {
      this._items = new Map(items);
    } else if (Array.isArray(items)) {
      this._items = new Map(
        items.map((it) => [asKey(it.productId), { ...it }])
      );
    } else {
      this._items = new Map();
    }
  }

  static from(
    source: CartItem[] | CartSnapshot | Map<string, CartItem> | undefined
  ): Cart {
    if (!source) return new Cart();
    if (source instanceof Map) return new Cart(source);
    if (Array.isArray(source)) return new Cart(source);
    return new Cart(source.items);
  }

  items(): CartItem[] {
    return Array.from(this._items.values()).map((it) => ({ ...it }));
  }

  has(productId: string): boolean {
    return this._items.has(asKey(productId));
  }

  get(productId: string): CartItem | undefined {
    const it = this._items.get(asKey(productId));
    return it ? { ...it } : undefined;
  }

  get totalItems(): number {
    let sum = 0;
    for (const it of this._items.values()) sum += it.quantity;
    return sum;
  }

  get subtotal(): number {
    let sum = 0;
    for (const it of this._items.values()) sum += it.price * it.quantity;
    return round2(sum);
  }

  add(product: Product, quantity = 1): Cart {
    const q = clampQty(quantity);
    if (q <= 0) return this;

    const key = asKey(product.id);
    const next = new Map(this._items);

    const existing = next.get(key);
    if (existing) {
      next.set(key, { ...existing, quantity: existing.quantity + q });
    } else {
      const item: CartItem = {
        productId: product.id,
        name: product.name,
        price: product.price,
        unit: product.unit,
        quantity: q,
        imageUrl: product.imageUrl,
        sellerId: product.seller.id,
        sellerName: product.seller.name,
        isOrganic: product.isOrganic,
        type: product.type,
      };
      next.set(key, item);
    }
    return new Cart(next);
  }

  set(productId: string, quantity: number): Cart {
    const q = clampQty(quantity);
    const key = asKey(productId);
    if (!this._items.has(key)) return this;

    const next = new Map(this._items);
    if (q <= 0) next.delete(key);
    else next.set(key, { ...next.get(key)!, quantity: q });
    return new Cart(next);
  }

  inc(productId: string, delta = 1): Cart {
    const key = asKey(productId);
    const it = this._items.get(key);
    if (!it) return this;

    const newQty = clampQty(it.quantity + delta);
    const next = new Map(this._items);
    if (newQty <= 0) next.delete(key);
    else next.set(key, { ...it, quantity: newQty });
    return new Cart(next);
  }

  dec(productId: string, delta = 1): Cart {
    return this.inc(productId, -Math.abs(delta));
  }

  remove(productId: string): Cart {
    const key = asKey(productId);
    if (!this._items.has(key)) return this;
    const next = new Map(this._items);
    next.delete(key);
    return new Cart(next);
  }

  clear(): Cart {
    if (this._items.size === 0) return this;
    return new Cart();
  }

  toJSON(): CartSnapshot {
    const items = this.items();
    return {
      items,
      totalItems: this.totalItems,
      subtotal: this.subtotal,
    };
  }

  itemsBySeller(sellerId: string): CartItem[] {
    return this.items().filter((it) => it.sellerId === sellerId);
  }

  itemsByType(type: ProductType): CartItem[] {
    return this.items().filter((it) => it.type === type);
  }
}

export default Cart;
