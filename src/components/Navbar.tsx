import { Link, NavLink } from 'react-router-dom';
import { ShoppingCart, Leaf } from 'lucide-react';
import { useCart } from '../state/CartContext';

export default function Navbar() {
  const { snapshot } = useCart();
  const count = snapshot.totalItems;

  return (
    <header className='bg-white shadow-md'>
      <nav className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center'>
        <div className='flex-1'>
          <Link to='/' className='inline-flex items-center gap-2'>
            <div className='rounded-xl p-2 shadow-sm bg-green-100'>
              <Leaf className='w-5 h-5' />
            </div>
            <span className='font-semibold text-lg tracking-tight'>
              Agrimart
            </span>
          </Link>
        </div>

        <div className='hidden md:flex items-center gap-6'>
          <NavLink
            to='/'
            className={({ isActive }) =>
              `px-3 py-2 rounded-xl shadow-sm hover:shadow-md transition 
               ${
                 isActive
                   ? 'bg-green-600 text-white'
                   : 'bg-green-100 text-green-900'
               }`
            }
          >
            Home
          </NavLink>
          <NavLink
            to='/products'
            className={({ isActive }) =>
              `px-3 py-2 rounded-xl shadow-sm hover:shadow-md transition 
               ${
                 isActive
                   ? 'bg-green-600 text-white'
                   : 'bg-green-100 text-green-900'
               }`
            }
          >
            Products
          </NavLink>
        </div>

        <div className='flex-1 flex justify-end'>
          <Link
            to='/cart'
            className='relative inline-flex items-center justify-center rounded-full p-2 bg-green-600 text-white shadow-md hover:shadow-lg transition'
            aria-label='Cart'
          >
            <ShoppingCart className='w-5 h-5' />
            <span
              className='absolute -top-1 -right-1 text-xs px-1.5 py-0.5 rounded-full bg-white text-green-700 shadow min-w-[1.25rem] text-center'
              aria-live='polite'
            >
              {count}
            </span>
          </Link>
        </div>
      </nav>

      <div className='md:hidden px-4 pb-3'>
        <div className='flex items-center gap-3'>
          <NavLink
            to='/'
            className={({ isActive }) =>
              `flex-1 text-center px-3 py-2 rounded-xl shadow-sm hover:shadow-md transition 
               ${
                 isActive
                   ? 'bg-green-600 text-white'
                   : 'bg-green-100 text-green-900'
               }`
            }
          >
            Home
          </NavLink>
        </div>
        <div className='mt-3 flex items-center gap-3'>
          <NavLink
            to='/products'
            className={({ isActive }) =>
              `flex-1 text-center px-3 py-2 rounded-xl shadow-sm hover:shadow-md transition 
               ${
                 isActive
                   ? 'bg-green-600 text-white'
                   : 'bg-green-100 text-green-900'
               }`
            }
          >
            Products
          </NavLink>
        </div>
      </div>
    </header>
  );
}
