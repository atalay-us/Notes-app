import { useQueryClient, useMutation } from "@tanstack/react-query"
import axios from "axios"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

import "../css/navbar.css"

const Navbar = ({ user }) => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme)
    localStorage.setItem("theme", theme);
  }, [theme])

  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await axios.post("http://localhost:3000/api/auth/logout", {}, { withCredentials: true });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["auth"]);
      navigate("/")
    }
  })

  const toggleTheme = () => {
    if (theme === "dark") {
      setTheme("light")
    } else {
      setTheme("dark")
    }
  }

  return (
    <nav className='navbar-container'>
      <h1>Notes</h1>
      <div className="settings">
        <button className="settings-btn" onClick={() => setIsMenuOpen(prev => !prev)}>Settings</button>
        {isMenuOpen &&
          <div className="menu">
            <button className="settings-btn" onClick={toggleTheme}>Toggle Theme</button>
            {user && <button className="settings-btn" onClick={() => logoutMutation.mutate()}>Logout</button>}
          </div>}
      </div>
    </nav >
  )
}

export default Navbar