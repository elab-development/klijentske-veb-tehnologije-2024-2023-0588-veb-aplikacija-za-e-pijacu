import React from 'react';

import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className='min-h-screen flex flex-col bg-green-50 text-green-900'>
      <Navbar />
      <main className='flex-1'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6'>
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}
