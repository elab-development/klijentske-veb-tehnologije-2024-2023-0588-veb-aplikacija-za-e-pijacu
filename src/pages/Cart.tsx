import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../state/CartContext';

export default function CartPage() {
  const { snapshot, inc, dec, setQty, remove, clear } = useCart();
  const items = snapshot.items;
  const empty = snapshot.totalItems === 0;

  const clampQty = (n: number) => {
    if (!Number.isFinite(n)) return 1;
    return Math.min(99, Math.max(1, Math.floor(n)));
  };
  const formatPrice = (n: number) => `€${n.toFixed(2)}`;

  if (empty) {
    return (
      <section className='grid gap-6'>
        <div className='rounded-2xl p-8 shadow-md bg-white text-center'>
          <div className='mx-auto w-12 h-12 rounded-full bg-green-100 flex items-center justify-center shadow-sm'>
            <ShoppingBag className='w-6 h-6 text-green-700' />
          </div>
          <h1 className='mt-4 text-2xl font-semibold text-green-900'>
            Your cart is empty
          </h1>
          <p className='mt-2 text-green-800'>
            Browse our catalog and add something tasty.
          </p>
          <Link
            to='/products'
            className='inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-xl bg-green-600 text-white shadow-md hover:shadow-lg transition'
          >
            Go to Products
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className='grid gap-6 lg:grid-cols-3'>
      <div className='lg:col-span-2 grid gap-4'>
        <header className='flex items-center justify-between'>
          <div>
            <h1 className='text-2xl font-semibold text-green-900'>Your Cart</h1>
            <p className='text-green-800 mt-1'>
              {snapshot.totalItems} item{snapshot.totalItems !== 1 ? 's' : ''} ·
              Subtotal {formatPrice(snapshot.subtotal)}
            </p>
          </div>

          <button
            type='button'
            onClick={clear}
            className='px-3 py-2 rounded-xl bg-green-100 text-green-900 shadow-sm hover:shadow-md transition'
          >
            Clear cart
          </button>
        </header>

        {items.map((it) => {
          const lineTotal = it.price * it.quantity;
          return (
            <article
              key={it.productId}
              className='rounded-2xl shadow-md bg-white p-4'
            >
              <div className='grid grid-cols-[96px,1fr] sm:grid-cols-[120px,1fr,auto] gap-4 items-center'>
                <div className='w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-green-50 shadow-sm'>
                  <img
                    src={it.imageUrl}
                    alt={it.name}
                    className='w-full h-full object-cover'
                    loading='lazy'
                  />
                </div>

                <div className='grid gap-2'>
                  <h2 className='text-green-900 font-medium'>{it.name}</h2>
                  <div className='text-sm text-green-800'>
                    Unit price:{' '}
                    <span className='font-medium'>{formatPrice(it.price)}</span>{' '}
                    / {it.unit}
                  </div>

                  <div className='mt-1 flex items-center gap-3'>
                    <div className='inline-flex items-center gap-2'>
                      <button
                        type='button'
                        onClick={() => dec(it.productId, 1)}
                        className='inline-flex items-center justify-center w-8 h-8 rounded-xl bg-green-100 text-green-900 shadow-sm hover:shadow-md transition focus:outline-none focus:ring-2 focus:ring-green-400'
                        aria-label={`Decrease quantity of ${it.name}`}
                      >
                        <Minus className='w-4 h-4' />
                      </button>

                      <input
                        type='number'
                        inputMode='numeric'
                        min={1}
                        max={99}
                        value={it.quantity}
                        onChange={(e) =>
                          setQty(it.productId, clampQty(Number(e.target.value)))
                        }
                        className='w-16 text-center rounded-xl bg-green-50 text-green-900 shadow-md px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-green-400'
                        aria-label={`Quantity of ${it.name}`}
                      />

                      <button
                        type='button'
                        onClick={() => inc(it.productId, 1)}
                        className='inline-flex items-center justify-center w-8 h-8 rounded-xl bg-green-100 text-green-900 shadow-sm hover:shadow-md transition focus:outline-none focus:ring-2 focus:ring-green-400'
                        aria-label={`Increase quantity of ${it.name}`}
                      >
                        <Plus className='w-4 h-4' />
                      </button>
                    </div>

                    <button
                      type='button'
                      onClick={() => remove(it.productId)}
                      className='ml-2 inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-white text-green-900 shadow-md hover:shadow-lg transition focus:outline-none focus:ring-2 focus:ring-green-400'
                    >
                      <Trash2 className='w-4 h-4' />
                      Remove
                    </button>
                  </div>
                </div>

                <div className='hidden sm:block text-right'>
                  <div className='text-sm text-green-700'>Line total</div>
                  <div className='text-lg font-semibold text-green-900'>
                    {formatPrice(lineTotal)}
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <aside className='grid gap-4 h-max'>
        <div className='rounded-2xl shadow-md bg-white p-4'>
          <h2 className='text-lg font-semibold text-green-900'>
            Order summary
          </h2>

          <dl className='mt-3 grid gap-2 text-sm'>
            <div className='flex items-center justify-between'>
              <dt className='text-green-800'>Subtotal</dt>
              <dd className='text-green-900 font-medium'>
                {formatPrice(snapshot.subtotal)}
              </dd>
            </div>
          </dl>

          <div className='mt-4 rounded-xl bg-green-50 shadow-sm p-3'>
            <div className='flex items-center justify-between text-green-900'>
              <span className='font-semibold'>Total</span>
              <span className='text-xl font-semibold'>
                {formatPrice(snapshot.subtotal)}
              </span>
            </div>
          </div>

          <Link
            to='/checkout'
            className='mt-4 inline-flex w-full items-center justify-center gap-2 px-4 py-2 rounded-xl bg-green-600 text-white shadow-md hover:shadow-lg transition focus:outline-none focus:ring-2 focus:ring-green-400'
          >
            Proceed to Checkout
          </Link>
        </div>

        <Link
          to='/products'
          className='inline-flex items-center justify-center px-4 py-2 rounded-xl bg-green-100 text-green-900 shadow-sm hover:shadow-md transition'
        >
          Continue shopping
        </Link>
      </aside>
    </section>
  );
}
