import { Search } from "lucide-react";

interface SearchbarProps {
  search: string;
  updateSearch: (search: string) => void;
}

export default function Searchbar({ search, updateSearch } : SearchbarProps) {
  return (
    <div className="relative w-full lg:max-w-md">

      <Search
        size={18}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-color"
      />

      <input
        value={search}
        onChange={(e) => updateSearch(e.target.value)} 
        placeholder="Search company or role..."
        className="w-full border border-secondary-color bg-background-color py-2.5 pl-10 pr-4 text-sm outline-none transition-colors focus:border-button-color"
      />

    </div>
  );
}