import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Leaf,
  Truck,
  ShieldCheck,
  Store,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { products } from '../data/products';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const featured = useMemo(() => {
    return [...products]
      .sort((a, b) => {
        if (a.isOrganic !== b.isOrganic) return a.isOrganic ? -1 : 1;
        return a.price - b.price;
      })
      .slice(0, 8);
  }, []);

  const categories = [
    { key: 'Fruit', label: 'Fruit', emoji: '🍎' },
    { key: 'Vegetable', label: 'Vegetables', emoji: '🥕' },
    { key: 'Dairy', label: 'Dairy', emoji: '🧀' },
  ] as const;

  return (
    <section className='grid gap-10'>
      <div className='rounded-2xl shadow-md bg-gradient-to-br from-green-100 to-white p-6 sm:p-10'>
        <div className='max-w-3xl'>
          <div className='inline-flex items-center gap-2 rounded-full bg-white/70 shadow px-3 py-1 text-sm text-green-800'>
            <Sparkles className='w-4 h-4' />
            Fresh from local sellers
          </div>
          <h1 className='mt-4 text-3xl sm:text-4xl font-semibold tracking-tight text-green-900'>
            Your weekly market, delivered.
          </h1>
          <p className='mt-3 text-green-800'>
            Shop seasonal produce, dairy, and more from trusted regional farms
            and artisans.
          </p>

          <div className='mt-6 flex flex-wrap items-center gap-3'>
            <Link
              to='/products'
              className='inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-green-600 text-white shadow-md hover:shadow-lg transition'
            >
              Shop now
              <ArrowRight className='w-4 h-4' />
            </Link>

            <div className='inline-flex items-center gap-2 rounded-xl bg-white shadow px-3 py-2 text-green-900'>
              <Leaf className='w-4 h-4' />
              Organic options available
            </div>
          </div>
        </div>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
        <div className='rounded-2xl bg-white shadow-md p-4 flex items-start gap-3'>
          <Store className='w-5 h-5 text-green-700 mt-0.5' />
          <div>
            <div className='font-semibold text-green-900'>Local sellers</div>
            <p className='text-sm text-green-800'>
              Support farms and small producers nearby.
            </p>
          </div>
        </div>
        <div className='rounded-2xl bg-white shadow-md p-4 flex items-start gap-3'>
          <Truck className='w-5 h-5 text-green-700 mt-0.5' />
          <div>
            <div className='font-semibold text-green-900'>Fast delivery</div>
            <p className='text-sm text-green-800'>
              Freshness preserved to your door.
            </p>
          </div>
        </div>
        <div className='rounded-2xl bg-white shadow-md p-4 flex items-start gap-3'>
          <ShieldCheck className='w-5 h-5 text-green-700 mt-0.5' />
          <div>
            <div className='font-semibold text-green-900'>Quality first</div>
            <p className='text-sm text-green-800'>
              Carefully sourced, clearly labeled.
            </p>
          </div>
        </div>
      </div>

      <div className='grid gap-3'>
        <div className='flex items-center justify-between'>
          <h2 className='text-xl font-semibold text-green-900'>
            Browse by category
          </h2>
          <Link
            to='/products'
            className='text-sm text-green-800 hover:underline inline-flex items-center gap-1'
          >
            View all
            <ArrowRight className='w-4 h-4' />
          </Link>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
          {categories.map((c) => (
            <Link
              key={c.key}
              to={`/products?type=${encodeURIComponent(c.key)}`}
              className='rounded-2xl bg-white shadow-md p-5 hover:shadow-lg transition'
            >
              <div className='text-3xl' aria-hidden>
                {c.emoji}
              </div>
              <div className='mt-2 text-lg font-medium text-green-900'>
                {c.label}
              </div>
              <div className='text-sm text-green-800'>
                Shop {c.label.toLowerCase()}
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className='grid gap-3'>
        <div className='flex items-center justify-between'>
          <h2 className='text-xl font-semibold text-green-900'>
            Featured picks
          </h2>
          <Link
            to='/products'
            className='text-sm text-green-800 hover:underline inline-flex items-center gap-1'
          >
            Explore catalog
            <ArrowRight className='w-4 h-4' />
          </Link>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>

      <div className='rounded-2xl shadow-md bg-green-600 text-white p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4'>
        <div className='flex items-center gap-2'>
          <Leaf className='w-5 h-5' />
          <span className='font-semibold'>Join Agrimart</span>
        </div>
        <p className='sm:ml-2 text-white/90'>
          Fresh produce, fair prices, and reliable delivery from local sellers.
        </p>
        <div className='sm:ml-auto'>
          <Link
            to='/products'
            className='inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-green-700 shadow hover:shadow-lg transition'
          >
            Start shopping
            <ArrowRight className='w-4 h-4' />
          </Link>
        </div>
      </div>
    </section>
  );
}
