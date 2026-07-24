import ProfileDropdown from "./ProfileDropdown";
import ToggleTheme from "./ToggleTheme";

export default function Navbar() {
  return (
    <nav className="w-full border-b bg-primary-color border-secondary-color px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between cursor-pointer">
        <div>
          <span className="text-accent-color text-2xl font-bold">JOB</span>
          <span className="text-text-color text-2xl">Track</span>
        </div>

        <div className="flex items-center gap-4">
          <ToggleTheme/>
          <ProfileDropdown/>
        </div>
        
      </div>
      
    </nav>
  )
}