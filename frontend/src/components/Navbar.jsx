import { useQueryClient, useMutation } from "@tanstack/react-query"
import axios from "axios"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

import { MdDarkMode, MdLightMode } from "react-icons/md";

import "../css/navbar.css"

const Navbar = ({ user }) => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
 // const [showPasswordResetBtn, setShowPasswordResetBtn] = useState(user ? true : false);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme)
    localStorage.setItem("theme", theme);
  }, [theme])

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
    },
    onError: (err) => {
      alert(err.response?.data?.error || "Server error.");
    }
  })

  const sendPasswordResettokenMutation = useMutation({
    mutationFn: async (email) => {
      await axios.post("http://localhost:3000/api/auth/send-password-reset-token", { email }, { withCredentials: true });
    },
    onSuccess: () => {
      alert("Password reset token sent to your email.")
      navigate("/reset-password");
    },
    onError: (err) => {
      alert(err.response?.data?.error || "Server error.");
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
            <button className="settings-btn theme-btn" onClick={toggleTheme}>{theme === "dark" ? <MdDarkMode /> : <MdLightMode />}</button>
            {user && <button className="settings-btn" onClick={() => {
              sendPasswordResettokenMutation.mutate(user.email)
              //setShowPasswordResetBtn(false);
            }}>Reset password.</button>}
            {user && <button className="settings-btn" onClick={() => logoutMutation.mutate()}>Logout</button>}
          </div>}
      </div>
    </nav >
  )
}

export default Navbar