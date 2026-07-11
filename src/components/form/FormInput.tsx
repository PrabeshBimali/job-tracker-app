interface FormInputProps {
  name: string;
  value?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
  type?: string;
  placeholder?: string;
  error?: string;
}

export default function FormInput({ name, value, onChange, label, type = "text", placeholder, error }: FormInputProps) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5">{label}</label>
      <input
        name={name}
        value={value}
        type={type}
        onChange={onChange}
        placeholder={placeholder}
        className={error ? 
          `w-full border border-error-color bg-background-color px-3 py-2.5 outline-none transition-colors` 
          : `w-full border border-secondary-color bg-background-color px-3 py-2.5 outline-none transition-colors focus:border-button-color`}
      />
      <div className="mt-1 h-4">
        {error && (<p className="text-xs text-error-color">{error}</p>)}
      </div>
    </div>
  );
}