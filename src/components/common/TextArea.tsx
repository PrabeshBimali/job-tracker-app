interface TextAreaProps {
  name: string;
  value?: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  label: string;
  rows?: number
  placeholder?: string;
  error?: string;
}

export default function TextArea({ name, value, onChange, label, rows = 5, placeholder, error }: TextAreaProps) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5">{label}</label>
      <textarea
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        rows={rows}
        className="w-full border border-secondary-color bg-background-color px-3 py-2.5 outline-none transition-colors focus:border-button-color resize-y"
      />
      <div className="mt-1 h-4">
        {error && (<p className="text-xs text-error-color">{error}</p>)}
      </div>
    </div>
  );
}