export default function Footer() {
  return (
    <footer className='bg-white shadow-inner'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between'>
        <p className='text-sm'>
          © {new Date().getFullYear()} Agrimart. All rights reserved.
        </p>
        <p className='text-sm'>Fresh from local farms</p>
      </div>
    </footer>
  );
}
