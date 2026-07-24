import { useNavigate } from "react-router";
import { useAuth } from "../../contexts/AuthContext";
import { useState, useRef, useEffect } from "react";
import { User } from "lucide-react";

export default function ProfileDropdown() {

  const [openProfile, setOpenProfile] = useState<boolean>(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setOpenProfile(false);
      }
    }

    if (openProfile) {
      document.addEventListener("mousedown", handleClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [openProfile, setOpenProfile]);
  
  return (
    <div className="relative">
      <div ref={modalRef}>
        <button
          onClick={() => setOpenProfile(!openProfile)}
          className="flex items-center gap-2 px-3 py-1 rounded-md bg-background-color text-text-color hover:text-text-color/80 cursor-pointer"
        >
          <span className="text-md font-semibold">{user?.username}</span>
          <span><User/></span>
        </button>

        {openProfile && 
          <div className="absolute right-0 mt-2 w-40 bg-primary-color text-text-color rounded-md shadow-md border-text-color">
            <button className="w-full px-4 py-2 text-sm hover:bg-secondary-color cursor-pointer font-semibold text-center">
              Export Data
            </button>

            <button className="w-full px-4 py-2 text-sm hover:bg-secondary-color cursor-pointer font-semibold text-center">
              Import Data
            </button>

            <button 
              className="w-full px-4 py-2 text-sm hover:bg-secondary-color text-error-color cursor-pointer font-semibold text-center"
              onClick={handleLogout}
            >
              Log Out
            </button>
          </div>
        }
      </div>
    </div>
  )
}