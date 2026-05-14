import { useState, useEffect } from "react"
import { User, Sun, Moon } from "lucide-react"

export default function Navbar() {
  const [dark, setDark] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [dark])

  return (
    <nav className="w-full border-b bg-primary-color border-secondary-color px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between cursor-pointer">
        <div>
          <span className="text-accent-color text-2xl font-bold">JOB</span>
          <span className="text-text-color text-2xl">Track</span>
        </div>

        <div className="flex items-center gap-4">

          <button
            onClick={() => setDark(!dark)}
            className="px-3 py-1 rounded-md text-sm bg-background-color text-text-color cursor-pointer hover:text-text-color/80"
          >
            {dark ? <Sun/> : <Moon/>}
          </button>

          <div className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center gap-2 px-3 py-1 rounded-md bg-background-color text-text-color hover:text-text-color/80 cursor-pointer"
            >
              <span className="text-md font-semibold">Bimali</span>
              <span><User/></span>
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-40 bg-background-color text-text-color rounded-md shadow-md border-text-color">

                <button className="w-full text-left px-4 py-2 text-sm hover:bg-primary-color cursor-pointer font-semibold">
                  Export Data
                </button>

                <button className="w-full text-left px-4 py-2 text-sm hover:bg-primary-color cursor-pointer font-semibold">
                  Import Data
                </button>

              </div>
            )}
          </div>

        </div>
        
      </div>
      
    </nav>
  )
}