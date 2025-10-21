import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, Truck } from 'lucide-react';
import { useCart } from '../state/CartContext';
import Modal from '../components/Modal';
import FormField from '../components/FormField';
import CartItemsCompactTable from '../components/CartItemsCompactTable';

export default function Checkout() {
  const navigate = useNavigate();
  const { snapshot, clear } = useCart();
  const items = snapshot.items;
  const empty = snapshot.totalItems === 0;

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [address, setAddress] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isModalOpen, setModalOpen] = useState(false);
  const [orderId, setOrderId] = useState<string>('');

  const formatPrice = (n: number) => `€${n.toFixed(2)}`;

  const validate = () => {
    const e: Record<string, string> = {};
    if (!fullName.trim()) e.fullName = 'Full name is required.';
    if (!email.trim()) e.email = 'Email is required.';
    else if (!/^\S+@\S+\.\S+$/.test(email)) e.email = 'Enter a valid email.';
    if (!city.trim()) e.city = 'City is required.';
    if (!country.trim()) e.country = 'Country is required.';
    if (!address.trim()) e.address = 'Address is required.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const computeOrderId = () =>
    `AGR-${Date.now().toString(36).toUpperCase()}-${Math.floor(
      Math.random() * 999
    )
      .toString()
      .padStart(3, '0')}`;

  const onSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setOrderId(computeOrderId());
    setModalOpen(true);
    clear();
  };

  const closeModal = () => {
    setModalOpen(false);
    navigate('/');
  };

  if (empty && !isModalOpen) {
    return (
      <section className='rounded-2xl p-8 shadow-md bg-white text-center'>
        <h1 className='text-2xl font-semibold text-green-900'>Checkout</h1>
        <p className='mt-2 text-green-800'>Your cart is currently empty.</p>
        <Link
          to='/products'
          className='inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-xl bg-green-600 text-white shadow-md hover:shadow-lg transition'
        >
          Browse products
        </Link>
      </section>
    );
  }

  return (
    <>
      <section className='grid gap-6 lg:grid-cols-3'>
        <div className='lg:col-span-2'>
          <CartItemsCompactTable items={items} subtotal={snapshot.subtotal} />
        </div>

        <aside className='rounded-2xl shadow-md bg-white p-4 h-max'>
          <h2 className='text-lg font-semibold text-green-900'>
            Shipping details
          </h2>
          <form className='mt-3 grid gap-3' onSubmit={onSubmit} noValidate>
            <FormField
              label='Full name'
              value={fullName}
              onChange={setFullName}
              error={errors.fullName}
              autoComplete='name'
            />
            <FormField
              label='Email'
              type='email'
              value={email}
              onChange={setEmail}
              error={errors.email}
              autoComplete='email'
            />
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
              <FormField
                label='City'
                value={city}
                onChange={setCity}
                error={errors.city}
                autoComplete='address-level2'
              />
              <FormField
                label='Country'
                value={country}
                onChange={setCountry}
                error={errors.country}
                autoComplete='country-name'
              />
            </div>
            <FormField
              label='Address'
              value={address}
              onChange={setAddress}
              error={errors.address}
              autoComplete='street-address'
              as='textarea'
              rows={3}
            />

            <button
              type='submit'
              className='mt-2 inline-flex w-full items-center justify-center gap-2 px-4 py-2 rounded-xl bg-green-600 text-white shadow-md hover:shadow-lg transition focus:outline-none focus:ring-2 focus:ring-green-400'
            >
              Place order
            </button>

            <p className='text-xs text-green-700 text-center mt-1'>
              By placing the order, you agree to our terms and refund policy.
            </p>
          </form>

          <div className='mt-4 rounded-xl bg-green-50 shadow-sm p-3'>
            <div className='flex items-center justify-between text-green-900'>
              <span className='font-semibold'>Total</span>
              <span className='text-xl font-semibold'>
                {formatPrice(snapshot.subtotal)}
              </span>
            </div>
          </div>
        </aside>
      </section>

      <Modal
        title='Order placed successfully'
        isOpen={isModalOpen}
        onClose={closeModal}
      >
        <div className='flex items-start gap-3'>
          <div className='mt-1'>
            <CheckCircle2 className='w-6 h-6 text-green-700' />
          </div>
          <div>
            <p className='text-green-900 font-medium'>
              Thank you! Your order{' '}
              <span className='font-semibold'>{orderId}</span> was received.
            </p>
            <p className='text-green-800 mt-2 flex items-center gap-2'>
              <Truck className='w-4 h-4' />
              Expected delivery in{' '}
              <span className='font-semibold'>3–5 business days</span>.
            </p>
            <p className='text-green-800 mt-2'>
              A confirmation email will be sent to{' '}
              <span className='font-medium'>{email}</span>.
            </p>

            <button
              type='button'
              onClick={closeModal}
              className='mt-4 inline-flex items-center justify-center px-4 py-2 rounded-xl bg-green-600 text-white shadow-md hover:shadow-lg transition focus:outline-none focus:ring-2 focus:ring-green-400'
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
