import { Check } from "lucide-react";

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: string;
}

export default function Checkbox({ checked, onChange, label, description }: CheckboxProps) {
  return (
    <label className="flex cursor-pointer items-start gap-3">
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`mt-0.5 flex h-5 w-5 items-center justify-center border transition-colors
          ${checked ? "border-accent-color bg-accent-color text-white" : "border-secondary-color bg-background-color text-transparent hover:border-button-color"}
        `}
      >
        <Check size={14} />
      </button>

      <div className="space-y-0.5">
        <p className="text-sm font-medium text-text-color">
          {label}
        </p>

        {description && (
          <p className="text-xs text-text-color/60">
            {description}
          </p>
        )}
      </div>
    </label>
  );
}