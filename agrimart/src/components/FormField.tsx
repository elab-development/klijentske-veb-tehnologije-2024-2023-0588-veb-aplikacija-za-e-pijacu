type FieldProps = {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  type?: 'text' | 'email' | 'number';
  autoComplete?: string;
  as?: 'input' | 'textarea';
  rows?: number;
  id?: string;
};

export default function FormField({
  label,
  value,
  onChange,
  error,
  type = 'text',
  autoComplete,
  as = 'input',
  rows,
  id,
}: FieldProps) {
  const InputTag: any = as === 'textarea' ? 'textarea' : 'input';
  return (
    <label className='block'>
      <span className='text-sm text-green-800'>{label}</span>
      <InputTag
        {...(as === 'textarea' ? { rows } : { type })}
        id={id}
        value={value}
        onChange={(e: any) => onChange(e.target.value)}
        autoComplete={autoComplete}
        className={`mt-1 w-full rounded-xl bg-green-50 text-green-900 shadow-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 ${
          error ? 'ring-2 ring-red-400' : ''
        }`}
      />
      {error && (
        <span className='mt-1 block text-xs text-red-600'>{error}</span>
      )}
    </label>
  );
}
