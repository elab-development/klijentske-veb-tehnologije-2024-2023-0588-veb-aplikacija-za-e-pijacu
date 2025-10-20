import type { CartSnapshot } from './cart';

const isBrowser = typeof window !== 'undefined';

export interface CartStorage {
  load(): CartSnapshot | undefined;
  save(data: CartSnapshot): void;
  clear(): void;
  readonly key: string;
}

const DEFAULT_KEY = 'agrimart:cart';

function isValidSnapshot(obj: any): obj is CartSnapshot {
  return (
    obj &&
    typeof obj === 'object' &&
    Array.isArray(obj.items) &&
    typeof obj.totalItems === 'number' &&
    typeof obj.subtotal === 'number'
  );
}

function parse(json: string | null): CartSnapshot | undefined {
  if (!json) return undefined;
  try {
    const obj = JSON.parse(json);
    if (isValidSnapshot(obj)) return obj;
    if (obj && typeof obj === 'object' && isValidSnapshot((obj as any).data)) {
      return (obj as any).data as CartSnapshot;
    }
  } catch {}
  return undefined;
}

export class LocalStorageCartStore implements CartStorage {
  public readonly key: string;

  constructor(key = DEFAULT_KEY) {
    this.key = key;
  }

  load(): CartSnapshot | undefined {
    if (!isBrowser) return undefined;
    return parse(window.localStorage.getItem(this.key));
  }

  save(data: CartSnapshot): void {
    if (!isBrowser) return;
    try {
      window.localStorage.setItem(this.key, JSON.stringify(data));
    } catch {}
  }

  clear(): void {
    if (!isBrowser) return;
    try {
      window.localStorage.removeItem(this.key);
    } catch {}
  }
}
