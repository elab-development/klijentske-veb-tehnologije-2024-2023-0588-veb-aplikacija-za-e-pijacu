import type { CartItem } from '../lib/cart';

type Props = {
  items: CartItem[];
  subtotal: number;
  title?: string;
  currency?: string;
};

export default function CartItemsCompactTable({
  items,
  subtotal,
  title = 'Your items',
  currency = '€',
}: Props) {
  const formatPrice = (n: number) => `${currency}${n.toFixed(2)}`;

  return (
    <div className='rounded-2xl shadow-md bg-white p-4'>
      <h2 className='text-lg font-semibold text-green-900'>{title}</h2>
      <div className='mt-3 grid gap-3'>
        <div className='hidden sm:grid grid-cols-12 text-xs text-green-700 px-2'>
          <div className='col-span-6'>Product</div>
          <div className='col-span-2 text-right'>Price</div>
          <div className='col-span-2 text-center'>Qty</div>
          <div className='col-span-2 text-right'>Total</div>
        </div>

        {items.map((it) => {
          const line = it.price * it.quantity;
          return (
            <div
              key={it.productId}
              className='grid grid-cols-12 items-center rounded-xl bg-green-50 p-2 shadow-sm'
            >
              <div className='col-span-12 sm:col-span-6 flex items-center gap-3'>
                <div className='w-14 h-14 rounded-lg overflow-hidden bg-white shadow'>
                  <img
                    src={it.imageUrl}
                    alt={it.name}
                    className='w-full h-full object-cover'
                    loading='lazy'
                  />
                </div>
                <div>
                  <div className='text-green-900 text-sm font-medium'>
                    {it.name}
                  </div>
                  <div className='text-xs text-green-700'>
                    {formatPrice(it.price)} / {it.unit}
                  </div>
                </div>
              </div>

              <div className='col-span-6 sm:col-span-2 sm:text-right text-green-900 text-sm px-2 mt-2 sm:mt-0'>
                {formatPrice(it.price)}
              </div>

              <div className='col-span-3 sm:col-span-2 text-center text-green-900 text-sm mt-2 sm:mt-0'>
                {it.quantity}
              </div>

              <div className='col-span-3 sm:col-span-2 sm:text-right text-green-900 font-semibold text-sm mt-2 sm:mt-0'>
                {formatPrice(line)}
              </div>
            </div>
          );
        })}

        <div className='flex items-center justify-end gap-4 mt-2 px-2'>
          <div className='text-green-700 text-sm'>Subtotal</div>
          <div className='text-green-900 font-semibold'>
            {formatPrice(subtotal)}
          </div>
        </div>
      </div>
    </div>
  );
}
