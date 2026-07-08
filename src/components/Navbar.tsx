import { useState, useEffect, useRef } from "react"
import { User, Sun, Moon } from "lucide-react"
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";

export default function Navbar() {
  const { toggleTheme, dark } = useTheme()
  const { user } = useAuth();

  const [open, setOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [open, setOpen]);

  return (
    <nav className="w-full border-b bg-primary-color border-secondary-color px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between cursor-pointer">
        <div>
          <span className="text-accent-color text-2xl font-bold">JOB</span>
          <span className="text-text-color text-2xl">Track</span>
        </div>

        <div className="flex items-center gap-4">

          <button
            onClick={() => toggleTheme()}
            className="px-3 py-1 rounded-md text-sm bg-background-color text-text-color cursor-pointer hover:text-text-color/80"
          >
            {dark ? <Sun/> : <Moon/>}
          </button>

          <div className="relative">
            <div ref={modalRef}>
              <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 px-3 py-1 rounded-md bg-background-color text-text-color hover:text-text-color/80 cursor-pointer"
              >
                <span className="text-md font-semibold">{user?.username}</span>
                <span><User/></span>
              </button>

              {open && (
                <div className="absolute right-0 mt-2 w-40 bg-primary-color text-text-color rounded-md shadow-md border-text-color">
                  <button className="w-full text-left px-4 py-2 text-sm hover:bg-secondary-color cursor-pointer font-semibold">
                    Export Data
                  </button>

                  <button className="w-full text-left px-4 py-2 text-sm hover:bg-secondary-color cursor-pointer font-semibold">
                    Import Data
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>
        
      </div>
      
    </nav>
  )
}