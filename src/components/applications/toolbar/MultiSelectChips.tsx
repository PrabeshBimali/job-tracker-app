interface MultiSelectChipsProps<T extends string> {
  title?: string;
  options: readonly T[];
  selected: T[];
  onChange: (selected: T[]) => void;
}

export default function MultiSelectChips<T extends string>({ title, options, selected, onChange }: MultiSelectChipsProps<T>) {

  function toggle(option: T) {
    if (selected.includes(option)) {
      onChange(selected.filter(v => v !== option));
    } else {
      onChange([...selected, option]);
    }
  }

  return (
    <div className="space-y-3">

      {title && (
        <h3 className="text-sm font-semibold text-text-color">
          {title}
        </h3>
      )}

      <div className="flex flex-wrap gap-2">
        {options.map(option => {

          const active = selected.includes(option);

          return (
            <button
              key={option}
              type="button"
              onClick={() => toggle(option)}
              className={`
                cursor-pointer
                border
                px-3
                py-1.5
                text-sm
                transition-colors
                ${
                  active
                    ? "border-accent-color bg-accent-color text-white"
                    : "border-secondary-color bg-background-color text-text-color hover:border-button-color"
                }
              `}
            >
              {option}
            </button>
          );
        })}
      </div>

    </div>
  );
}