import { useMemo, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, Leaf, Store, X } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import Pagination from '../components/Pagination';
import { products, sellers } from '../data/products';
import type { ProductType } from '../data/products';

const PER_PAGE = 12;

const ALL_TYPES: readonly ProductType[] = ['Fruit', 'Vegetable', 'Dairy'];

function isProductType(v: string | null): v is ProductType {
  return !!v && (ALL_TYPES as readonly string[]).includes(v);
}

type OrgFilter = 'any' | 'true' | 'false';
type TypeFilter = ProductType | 'all';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();

  const typeParam = searchParams.get('type');
  const sellerParam = searchParams.get('seller');
  const orgParam = (searchParams.get('org') as OrgFilter) || 'any';

  const validType: TypeFilter = isProductType(typeParam) ? typeParam : 'all';

  const sellerMap = useMemo(
    () => new Map(sellers.map((s) => [s.id, s] as const)),
    []
  );
  const validSeller =
    sellerParam && sellerMap.has(sellerParam) ? sellerParam : 'all';

  const validOrg: OrgFilter =
    orgParam === 'true' || orgParam === 'false' ? orgParam : 'any';

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const byType = validType === 'all' ? true : p.type === validType;
      const bySeller =
        validSeller === 'all' ? true : p.seller.id === validSeller;
      const byOrg =
        validOrg === 'any'
          ? true
          : validOrg === 'true'
          ? p.isOrganic
          : !p.isOrganic;
      return byType && bySeller && byOrg;
    });
  }, [validType, validSeller, validOrg]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));

  const rawPage = Number(searchParams.get('page') || 1);
  const safePage =
    Number.isFinite(rawPage) && rawPage >= 1 && rawPage <= totalPages
      ? Math.floor(rawPage)
      : 1;

  useEffect(() => {
    if (rawPage !== safePage) {
      const sp = new URLSearchParams(searchParams);
      sp.set('page', String(safePage));
      setSearchParams(sp, { replace: true });
    }
  }, [rawPage, safePage, searchParams, setSearchParams]);

  const start = (safePage - 1) * PER_PAGE;
  const end = Math.min(start + PER_PAGE, total);
  const pageItems = useMemo(
    () => filtered.slice(start, end),
    [filtered, start, end]
  );

  const goTo = useCallback(
    (p: number) => {
      const clamped = Math.min(Math.max(1, p), totalPages);
      const sp = new URLSearchParams(searchParams);
      sp.set('page', String(clamped));
      setSearchParams(sp);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [searchParams, setSearchParams, totalPages]
  );

  const setParam = (key: string, value: string | null) => {
    const sp = new URLSearchParams(searchParams);
    if (value === null || value === 'all' || value === 'any') sp.delete(key);
    else sp.set(key, value);
    sp.set('page', '1');
    setSearchParams(sp);
  };

  const clearFilters = () => {
    const sp = new URLSearchParams(searchParams);
    sp.delete('type');
    sp.delete('seller');
    sp.delete('org');
    sp.set('page', '1');
    setSearchParams(sp);
  };

  const hasActiveFilters =
    validType !== 'all' || validSeller !== 'all' || validOrg !== 'any';

  return (
    <section>
      <header className='mb-6'>
        <h1 className='text-2xl font-semibold text-green-900'>All Products</h1>
        <p className='text-green-800 mt-1'>
          Browse fresh items from local sellers.
        </p>
      </header>

      <div className='mb-6 rounded-2xl bg-white shadow-md p-4'>
        <div className='flex items-center gap-2 mb-3 text-green-900'>
          <Filter className='w-4 h-4' />
          <span className='font-semibold'>Filters</span>
          {hasActiveFilters && (
            <button
              type='button'
              onClick={clearFilters}
              className='ml-auto inline-flex items-center gap-1 text-sm px-3 py-1.5 rounded-xl bg-green-100 text-green-800 shadow-sm hover:shadow-md transition'
              aria-label='Clear filters'
              title='Clear filters'
            >
              <X className='w-4 h-4' />
              Clear
            </button>
          )}
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-3 gap-3'>
          <label className='block'>
            <span className='text-sm text-green-800'>Type</span>
            <select
              className='mt-1 w-full rounded-xl bg-green-50 text-green-900 shadow-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400'
              value={validType}
              onChange={(e) =>
                setParam(
                  'type',
                  e.target.value === 'all' ? null : e.target.value
                )
              }
            >
              <option value='all'>All types</option>
              {ALL_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>

          <label className='block'>
            <span className='text-sm text-green-800 flex items-center gap-1'>
              <Store className='w-3.5 h-3.5' /> Seller
            </span>
            <select
              className='mt-1 w-full rounded-xl bg-green-50 text-green-900 shadow-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400'
              value={validSeller}
              onChange={(e) =>
                setParam(
                  'seller',
                  e.target.value === 'all' ? null : e.target.value
                )
              }
            >
              <option value='all'>All sellers</option>
              {sellers.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </label>

          <label className='block'>
            <span className='text-sm text-green-800 flex items-center gap-1'>
              <Leaf className='w-3.5 h-3.5' /> Organic
            </span>
            <select
              className='mt-1 w-full rounded-xl bg-green-50 text-green-900 shadow-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400'
              value={validOrg}
              onChange={(e) => {
                const v = e.target.value as OrgFilter;
                setParam('org', v === 'any' ? null : v);
              }}
            >
              <option value='any'>Any</option>
              <option value='true'>Organic only</option>
              <option value='false'>Non-organic</option>
            </select>
          </label>
        </div>
      </div>

      <div className='mb-4 text-sm text-green-700'>
        Showing <span className='font-medium'>{total ? start + 1 : 0}</span>–
        <span className='font-medium'>{end}</span> of{' '}
        <span className='font-medium'>{total}</span> products
      </div>

      {total === 0 ? (
        <div className='rounded-2xl p-6 shadow-md bg-white'>
          <p className='text-green-800'>
            No products found. Try adjusting filters.
          </p>
        </div>
      ) : (
        <>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
            {pageItems.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          <Pagination
            page={safePage}
            totalPages={totalPages}
            onPageChange={goTo}
          />
        </>
      )}
    </section>
  );
}
