import { Sun, Moon } from "lucide-react"
import { useTheme } from "../../contexts/ThemeContext";

export default function ToggleTheme() {

  const { toggleTheme, dark } = useTheme();

  return (
    <button
      onClick={() => toggleTheme()}
      className="px-3 py-1 rounded-md text-sm bg-background-color text-text-color cursor-pointer hover:text-text-color/80"
    >
      {dark ? <Sun/> : <Moon/>}
    </button>
  );
}