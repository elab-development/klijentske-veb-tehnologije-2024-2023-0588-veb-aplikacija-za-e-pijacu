import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, Store } from 'lucide-react';

import type { Product } from '../data/products';

export type ProductCardProps = {
  product: Product;
  className?: string;
};

export default function ProductCard({ product, className }: ProductCardProps) {
  return (
    <article
      className={`rounded-2xl shadow-md hover:shadow-lg transition bg-white overflow-hidden ${
        className ?? ''
      }`}
    >
      <Link to={`/products/${product.id}`} className='block'>
        <div className='h-48 bg-green-50'>
          <img
            src={product.imageUrl}
            alt={product.name}
            loading='lazy'
            className='w-full h-full object-cover'
          />
        </div>
      </Link>

      <div className='p-4'>
        <div className='flex items-start gap-2'>
          <h3 className='text-lg font-semibold text-green-900 flex-1'>
            {product.name}
          </h3>
          {product.isOrganic && (
            <span className='inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 shadow-sm'>
              <Leaf className='w-3.5 h-3.5' />
              Organic
            </span>
          )}
        </div>

        <p className='mt-1 text-sm text-green-800'>
          {product.shortDescription}
        </p>

        <div className='mt-3 flex flex-wrap items-center gap-2 text-xs text-green-800'>
          <span className='px-2 py-1 rounded-full bg-green-50 shadow-sm'>
            {product.type}
          </span>
          <span className='px-2 py-1 rounded-full bg-green-50 shadow-sm'>
            {product.unit}
          </span>
          {product.origin && (
            <span className='px-2 py-1 rounded-full bg-green-50 shadow-sm'>
              {product.origin}
            </span>
          )}
        </div>

        <div className='mt-4 flex items-center justify-between'>
          <div>
            <div className='text-lg font-semibold text-green-900'>
              €{product.price.toFixed(2)}
            </div>
            <div className='text-xs text-green-700'>per {product.unit}</div>
          </div>
          <Link
            to={`/products/${product.id}`}
            className='inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-green-600 text-white shadow-md hover:shadow-lg transition'
            aria-label={`View ${product.name}`}
          >
            View <ArrowRight className='w-4 h-4' />
          </Link>
        </div>

        <div className='mt-3 flex items-center gap-2 text-xs text-green-700'>
          <Store className='w-4 h-4' />
          <span>{product.seller.name}</span>
          <span>•</span>
          <span>{product.seller.location}</span>
        </div>
      </div>
    </article>
  );
}
