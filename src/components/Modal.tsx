import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

type ModalProps = {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export default function Modal({
  title,
  isOpen,
  onClose,
  children,
}: ModalProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    ref.current?.focus();
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4'
      role='dialog'
      aria-modal='true'
      aria-label={title}
      onClick={onClose}
    >
      <div
        className='w-full max-w-lg rounded-2xl bg-white p-5 shadow-xl'
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
        ref={ref}
      >
        <div className='flex items-start justify-between mb-3'>
          <h3 className='text-lg font-semibold text-green-900'>{title}</h3>
          <button
            type='button'
            onClick={onClose}
            className='rounded-xl p-1 bg-green-100 text-green-900 shadow-sm hover:shadow-md transition focus:outline-none focus:ring-2 focus:ring-green-400'
            aria-label='Close'
          >
            <X className='w-5 h-5' />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
