/*import { useMemo, useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { products } from '../data/products';
import ProductCard from '../components/ProductCard';
import {
  ArrowLeft,
  Leaf,
  Store,
  Tag,
  Hash,
  Package,
  ShoppingCart as CartIcon,
  ExternalLink,
  Utensils,
} from 'lucide-react';
import { useCart } from '../state/CartContext';

import { fetchRecipes, deriveIngredient, type Recipe } from '../lib/recipes';

export default function Product() {
  const { id } = useParams<{ id: string }>();
  const { add } = useCart();
  const [qty, setQty] = useState<number>(1);

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [recipesLoading, setRecipesLoading] = useState(false);
  const [recipesError, setRecipesError] = useState<string | null>(null);
  const [ingredient, setIngredient] = useState<string>('');

  const product = useMemo(() => products.find((p) => p.id === id), [id]);

  if (!product) {
    return (
      <section className='rounded-2xl p-6 shadow-md bg-white'>
        <div className='flex items-center gap-2 mb-4'>
          <ArrowLeft className='w-4 h-4 text-green-800' />
          <Link to='/products' className='text-green-800 hover:underline'>
            Back to products
          </Link>
        </div>
        <h1 className='text-2xl font-semibold text-green-900'>
          Product not found
        </h1>
        <p className='mt-2 text-green-800'>
          The product you’re looking for doesn’t exist or was removed.
        </p>
      </section>
    );
  }

  const formatPrice = (n: number) => `€${n.toFixed(2)}`;

  const related = products
    .filter(
      (p) =>
        p.id !== product.id &&
        p.seller.id === product.seller.id &&
        p.type === product.type
    )
    .slice(0, 3);

  const clampQty = (n: number) => {
    if (!Number.isFinite(n)) return 1;
    return Math.min(99, Math.max(1, Math.floor(n)));
  };

  const handleAdd = () => {
    add(product, clampQty(qty));
  };

  useEffect(() => {
    const ingr = deriveIngredient(product.name);
    setIngredient(ingr);

    let aborted = false;
    (async () => {
      setRecipesLoading(true);
      setRecipesError(null);
      try {
        const list = await fetchRecipes({
          type: product.type,
          ingredient: ingr,
          limit: 3,
        });
        if (!aborted) setRecipes(list);
      } catch (e: any) {
        if (!aborted) setRecipesError(e?.message || 'Failed to load recipes');
      } finally {
        if (!aborted) setRecipesLoading(false);
      }
    })();

    return () => {
      aborted = true;
    };
  }, [product]);

  return (
    <section className='grid gap-6'>
      <div className='flex items-center gap-2'>
        <ArrowLeft className='w-4 h-4 text-green-800' />
        <Link to='/products' className='text-green-800 hover:underline'>
          Back to products
        </Link>
      </div>

      <article className='rounded-2xl shadow-md bg-white overflow-hidden'>
        <div className='grid grid-cols-1 lg:grid-cols-2'>
          <div className='bg-green-50'>
            <img
              src={product.imageUrl}
              alt={product.name}
              className='w-full h-full object-cover max-h-[480px]'
              loading='eager'
            />
          </div>

          <div className='p-6 sm:p-8'>
            <div className='flex items-start gap-2'>
              <h1 className='text-2xl font-semibold text-green-900 flex-1'>
                {product.name}
              </h1>
              {product.isOrganic && (
                <span className='inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 shadow-sm'>
                  <Leaf className='w-3.5 h-3.5' />
                  Organic
                </span>
              )}
            </div>

            <p className='mt-3 text-green-800'>{product.shortDescription}</p>

            <div className='mt-4 flex flex-wrap items-center gap-2 text-xs text-green-800'>
              <span className='px-2 py-1 rounded-full bg-green-50 shadow-sm inline-flex items-center gap-1'>
                <Tag className='w-3.5 h-3.5' />
                {product.type}
              </span>
              <span className='px-2 py-1 rounded-full bg-green-50 shadow-sm inline-flex items-center gap-1'>
                <Package className='w-3.5 h-3.5' />
                {product.unit}
              </span>
              {product.origin && (
                <span className='px-2 py-1 rounded-full bg-green-50 shadow-sm'>
                  {product.origin}
                </span>
              )}
            </div>

            <div className='mt-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4'>
              <div>
                <div className='text-2xl font-semibold text-green-900'>
                  {formatPrice(product.price)}
                </div>
                <div className='text-xs text-green-700'>per {product.unit}</div>
              </div>

              <div className='flex items-center gap-3'>
                <label className='text-sm text-green-800' htmlFor='qty'>
                  Qty
                </label>
                <input
                  id='qty'
                  type='number'
                  inputMode='numeric'
                  min={1}
                  max={99}
                  value={qty}
                  onChange={(e) => setQty(clampQty(Number(e.target.value)))}
                  className='w-20 rounded-xl bg-green-50 text-green-900 shadow-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400'
                />
                <button
                  type='button'
                  onClick={handleAdd}
                  className='inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-green-600 text-white shadow-md hover:shadow-lg transition focus:outline-none focus:ring-2 focus:ring-green-400'
                  aria-label={`Add ${qty} to cart`}
                >
                  <CartIcon className='w-4 h-4' />
                  Add to cart
                </button>
              </div>
            </div>

            <dl className='mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm'>
              <div className='rounded-xl bg-green-50 shadow-sm p-3'>
                <dt className='text-green-700'>Product ID</dt>
                <dd className='text-green-900 font-medium'>{product.id}</dd>
              </div>

              <div className='rounded-xl bg-green-50 shadow-sm p-3'>
                <dt className='text-green-700'>SKU</dt>
                <dd className='text-green-900 font-medium'>
                  {product.sku ?? '—'}
                </dd>
              </div>

              <div className='rounded-xl bg-green-50 shadow-sm p-3'>
                <dt className='text-green-700'>Type</dt>
                <dd className='text-green-900 font-medium'>{product.type}</dd>
              </div>

              <div className='rounded-xl bg-green-50 shadow-sm p-3'>
                <dt className='text-green-700'>Unit</dt>
                <dd className='text-green-900 font-medium'>{product.unit}</dd>
              </div>

              <div className='rounded-xl bg-green-50 shadow-sm p-3'>
                <dt className='text-green-700'>Origin</dt>
                <dd className='text-green-900 font-medium'>
                  {product.origin ?? '—'}
                </dd>
              </div>

              <div className='rounded-xl bg-green-50 shadow-sm p-3'>
                <dt className='text-green-700 inline-flex items-center gap-1'>
                  <Store className='w-3.5 h-3.5' />
                  Seller
                </dt>
                <dd className='text-green-900 font-medium'>
                  {product.seller.name} · {product.seller.location}{' '}
                  {product.seller.rating ? (
                    <span className='text-green-700 font-normal'>
                      (rating {product.seller.rating.toFixed(1)})
                    </span>
                  ) : null}
                </dd>
              </div>

              <div className='rounded-xl bg-green-50 shadow-sm p-3'>
                <dt className='text-green-700 inline-flex items-center gap-1'>
                  <Leaf className='w-3.5 h-3.5' />
                  Organic
                </dt>
                <dd className='text-green-900 font-medium'>
                  {product.isOrganic ? 'Yes' : 'No'}
                </dd>
              </div>

              <div className='rounded-xl bg-green-50 shadow-sm p-3'>
                <dt className='text-green-700 inline-flex items-center gap-1'>
                  <Hash className='w-3.5 h-3.5' />
                  Price (EUR)
                </dt>
                <dd className='text-green-900 font-medium'>
                  {formatPrice(product.price)} / {product.unit}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className='grid gap-4'>
          <h2 className='text-xl font-semibold text-green-900'>
            More from {product.seller.name} in {product.type}
          </h2>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      <section className='grid gap-4'>
        <h2 className='text-xl font-semibold text-green-900 inline-flex items-center gap-2'>
          <Utensils className='w-5 h-5' />
          Recipes using {ingredient || product.name}
        </h2>

        {recipesLoading ? (
          <div className='rounded-2xl bg-white p-4 shadow-md text-green-800'>
            Loading recipes…
          </div>
        ) : recipesError ? (
          <div className='rounded-2xl bg-white p-4 shadow-md text-red-700'>
            {recipesError}
          </div>
        ) : recipes.length === 0 ? (
          <div className='rounded-2xl bg-white p-4 shadow-md text-green-800'>
            No recipes found for “{ingredient}”. Try another ingredient.
          </div>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
            {recipes.map((r) => (
              <article
                key={`${r.source}-${r.id}`}
                className='rounded-2xl bg-white shadow-md overflow-hidden'
              >
                <div className='aspect-video bg-green-50'>
                  <img
                    src={r.image}
                    alt={r.title}
                    className='w-full h-full object-cover'
                    loading='lazy'
                  />
                </div>
                <div className='p-4'>
                  <h3 className='text-green-900 font-medium line-clamp-2'>
                    {r.title}
                  </h3>
                  <div className='mt-3'>
                    <a
                      href={r.sourceUrl}
                      target='_blank'
                      rel='noreferrer'
                      className='inline-flex items-center gap-2 text-sm px-3 py-1.5 rounded-xl bg-green-600 text-white shadow-md hover:shadow-lg transition'
                    >
                      View recipe
                      <ExternalLink className='w-4 h-4' />
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </section>
  );
}*/




import { useMemo, useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { products } from '../data/products';
import ProductCard from '../components/ProductCard';
import {
  ArrowLeft,
  Leaf,
  Store,
  Tag,
  Hash,
  Package,
  ShoppingCart as CartIcon,
  ExternalLink,
  Utensils,
} from 'lucide-react';
import { useCart } from '../state/CartContext';

import { fetchRecipes, deriveIngredient, type Recipe } from '../lib/recipes';

export default function Product() {
  const { id } = useParams<{ id: string }>();
  const { add } = useCart();
  const [qty, setQty] = useState<number>(1);

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [recipesLoading, setRecipesLoading] = useState(false);
  const [recipesError, setRecipesError] = useState<string | null>(null);
  const [ingredient, setIngredient] = useState<string>('');

  const product = useMemo(() => products.find((p) => p.id === id), [id]);

  if (!product) {
    return (
      <section className='rounded-2xl p-6 shadow-md bg-white'>
        <div className='flex items-center gap-2 mb-4'>
          <ArrowLeft className='w-4 h-4 text-green-800' />
          <Link to='/products' className='text-green-800 hover:underline'>
            Back to products
          </Link>
        </div>
        <h1 className='text-2xl font-semibold text-green-900'>
          Product not found
        </h1>
        <p className='mt-2 text-green-800'>
          The product you’re looking for doesn’t exist or was removed.
        </p>
      </section>
    );
  }

  const formatPrice = (n: number) => `€${n.toFixed(2)}`;

  const related = products
    .filter(
      (p) =>
        p.id !== product.id &&
        p.seller.id === product.seller.id &&
        p.type === product.type
    )
    .slice(0, 3);

  const clampQty = (n: number) => {
    if (!Number.isFinite(n)) return 1;
    return Math.min(99, Math.max(1, Math.floor(n)));
  };

  const handleAdd = () => {
    add(product, clampQty(qty));
  };

  useEffect(() => {
    const ingr = deriveIngredient(product.name);
    setIngredient(ingr);

    let aborted = false;
    (async () => {
      setRecipesLoading(true);
      setRecipesError(null);
      try {
        const list = await fetchRecipes({
          type: product.type,
          ingredient: ingr,
          limit: 3,
        });
        if (!aborted) setRecipes(list);
      } catch (e: any) {
        if (!aborted) setRecipesError(e?.message || 'Failed to load recipes');
      } finally {
        if (!aborted) setRecipesLoading(false);
      }
    })();

    return () => {
      aborted = true;
    };
  }, [product]);

  return (
    <section className='grid gap-6'>
      <div className='flex items-center gap-2'>
        <ArrowLeft className='w-4 h-4 text-green-800' />
        <Link to='/products' className='text-green-800 hover:underline'>
          Back to products
        </Link>
      </div>

      <article className='rounded-2xl shadow-md bg-white overflow-hidden'>
        <div className='grid grid-cols-1 lg:grid-cols-2'>
          <div className='bg-green-50'>
            <img
              src={product.imageUrl}
              alt={product.name}
              className='w-full h-full object-cover max-h-[480px]'
              loading='eager'
            />
          </div>

          <div className='p-6 sm:p-8'>
            <div className='flex items-start gap-2'>
              <h1 className='text-2xl font-semibold text-green-900 flex-1'>
                {product.name}
              </h1>
              {product.isOrganic && (
                <span className='inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 shadow-sm'>
                  <Leaf className='w-3.5 h-3.5' />
                  Organic
                </span>
              )}
            </div>

            <p className='mt-3 text-green-800'>{product.shortDescription}</p>

            <div className='mt-4 flex flex-wrap items-center gap-2 text-xs text-green-800'>
              <span className='px-2 py-1 rounded-full bg-green-50 shadow-sm inline-flex items-center gap-1'>
                <Tag className='w-3.5 h-3.5' />
                {product.type}
              </span>
              <span className='px-2 py-1 rounded-full bg-green-50 shadow-sm inline-flex items-center gap-1'>
                <Package className='w-3.5 h-3.5' />
                {product.unit}
              </span>
              {product.origin && (
                <span className='px-2 py-1 rounded-full bg-green-50 shadow-sm'>
                  {product.origin}
                </span>
              )}
            </div>

            <div className='mt-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4'>
              <div>
                <div className='text-2xl font-semibold text-green-900'>
                  {formatPrice(product.price)}
                </div>
                <div className='text-xs text-green-700'>per {product.unit}</div>
              </div>

              <div className='flex items-center gap-3'>
                <label className='text-sm text-green-800' htmlFor='qty'>
                  Qty
                </label>
                <input
                  id='qty'
                  type='number'
                  inputMode='numeric'
                  min={1}
                  max={99}
                  value={qty}
                  onChange={(e) => setQty(clampQty(Number(e.target.value)))}
                  className='w-20 rounded-xl bg-green-50 text-green-900 shadow-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400'
                />
                <button
                  type='button'
                  onClick={handleAdd}
                  className='inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-green-600 text-white shadow-md hover:shadow-lg transition focus:outline-none focus:ring-2 focus:ring-green-400'
                  aria-label={`Add ${qty} to cart`}
                >
                  <CartIcon className='w-4 h-4' />
                  Add to cart
                </button>
              </div>
            </div>

            <dl className='mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm'>
              <div className='rounded-xl bg-green-50 shadow-sm p-3'>
                <dt className='text-green-700'>Product ID</dt>
                <dd className='text-green-900 font-medium'>{product.id}</dd>
              </div>

              <div className='rounded-xl bg-green-50 shadow-sm p-3'>
                <dt className='text-green-700'>SKU</dt>
                <dd className='text-green-900 font-medium'>
                  {product.sku ?? '—'}
                </dd>
              </div>

              <div className='rounded-xl bg-green-50 shadow-sm p-3'>
                <dt className='text-green-700'>Type</dt>
                <dd className='text-green-900 font-medium'>{product.type}</dd>
              </div>

              <div className='rounded-xl bg-green-50 shadow-sm p-3'>
                <dt className='text-green-700'>Unit</dt>
                <dd className='text-green-900 font-medium'>{product.unit}</dd>
              </div>

              <div className='rounded-xl bg-green-50 shadow-sm p-3'>
                <dt className='text-green-700'>Origin</dt>
                <dd className='text-green-900 font-medium'>
                  {product.origin ?? '—'}
                </dd>
              </div>

              <div className='rounded-xl bg-green-50 shadow-sm p-3'>
                <dt className='text-green-700 inline-flex items-center gap-1'>
                  <Store className='w-3.5 h-3.5' />
                  Seller
                </dt>
                <dd className='text-green-900 font-medium'>
                  {product.seller.name} · {product.seller.location}{' '}
                  {product.seller.rating ? (
                    <span className='text-green-700 font-normal'>
                      (rating {product.seller.rating.toFixed(1)})
                    </span>
                  ) : null}
                </dd>
              </div>

              <div className='rounded-xl bg-green-50 shadow-sm p-3'>
                <dt className='text-green-700 inline-flex items-center gap-1'>
                  <Leaf className='w-3.5 h-3.5' />
                  Organic
                </dt>
                <dd className='text-green-900 font-medium'>
                  {product.isOrganic ? 'Yes' : 'No'}
                </dd>
              </div>

              <div className='rounded-xl bg-green-50 shadow-sm p-3'>
                <dt className='text-green-700 inline-flex items-center gap-1'>
                  <Hash className='w-3.5 h-3.5' />
                  Price (EUR)
                </dt>
                <dd className='text-green-900 font-medium'>
                  {formatPrice(product.price)} / {product.unit}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className='grid gap-4'>
          <h2 className='text-xl font-semibold text-green-900'>
            More from {product.seller.name} in {product.type}
          </h2>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      <section className='grid gap-4'>
        <h2 className='text-xl font-semibold text-green-900 inline-flex items-center gap-2'>
          <Utensils className='w-5 h-5' />
          Recipes using {ingredient || product.name}
        </h2>

        {recipesLoading ? (
          <div className='rounded-2xl bg-white p-4 shadow-md text-green-800'>
            Loading recipes…
          </div>
        ) : recipesError ? (
          <div className='rounded-2xl bg-white p-4 shadow-md text-red-700'>
            {recipesError}
          </div>
        ) : recipes.length === 0 ? (
          <div className='rounded-2xl bg-white p-4 shadow-md text-green-800'>
            No recipes found for “{ingredient}”. Try another ingredient.
          </div>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
            {recipes.map((r) => (
              <article
                key={`${r.source}-${r.id}`}
                className='rounded-2xl bg-white shadow-md overflow-hidden'
              >
                <div className='aspect-video bg-green-50'>
                  <img
                    src={r.image}
                    alt={r.title}
                    className='w-full h-full object-cover'
                    loading='lazy'
                  />
                </div>
                <div className='p-4'>
                  <h3 className='text-green-900 font-medium line-clamp-2'>
                    {r.title}
                  </h3>
                  <div className='mt-3'>
                    <a
                      href={r.sourceUrl}
                      target='_blank'
                      rel='noreferrer'
                      className='inline-flex items-center gap-2 text-sm px-3 py-1.5 rounded-xl bg-green-600 text-white shadow-md hover:shadow-lg transition'
                    >
                      View recipe
                      <ExternalLink className='w-4 h-4' />
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </section>
  );
}