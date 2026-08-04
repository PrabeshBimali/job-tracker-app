interface SelectInputProps<T extends string> {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  label: string;
  options: T[];
}

export default function SelectInput<T extends string>({ name, value, onChange, label, options }: SelectInputProps<T>) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border border-secondary-color bg-background-color px-3 py-2.5 outline-none transition-colors focus:border-button-color"
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </div>
  );
}