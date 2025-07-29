import { Routes, Route } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import Navbar from "./components/Navbar.jsx";

import HomePage from "./pages/Homepage.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import VerifyPage from "./pages/Verifypage.jsx";
import ChangePasswordPage from "./pages/ChangePasswordPage.jsx";


function App() {

  const { data: user } = useQuery({
    queryKey: ["auth"],
    queryFn: async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/auth/check-auth", { withCredentials: true });
        return res.data.user;
      } catch (error) {
        return null
      }
    },
    retry: false
  })

  return (
    <>
      <Navbar user={user} />
      <Routes>
        <Route path="/" element={user ? <HomePage user={user} /> : <Login />} />
        <Route path="/login" element={user ? <HomePage user={user} /> : <Login />} />
        <Route path="/register" element={user ? <HomePage user={user} /> : <Register />} />
        <Route path="/verify-email" element={user ? (user.isVerified ? <HomePage user={user} /> : <VerifyPage user={user} />) : <Login />} />
        <Route path="/reset-password" element={<ChangePasswordPage user={user}/>} />
      </Routes>
    </>
  )
}

export default App
