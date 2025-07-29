import { useQueryClient, useMutation } from "@tanstack/react-query"
import axios from "axios"
import { useEffect, useState } from "react"
import { useNavigate, Link } from "react-router-dom"

import "../css/login-register.css"

const Login = () => {
  const navigate = useNavigate();
  const [showPasswordReset, setPasswordReset] = useState(false);
  const [userInfo, setUserInfo] = useState({ username: "", password: "" });

  useEffect(() => {
    setPasswordReset(false);
  }, []);

  const queryClient = useQueryClient();

  const handleChange = (e) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  }

  const loginMutation = useMutation({
    mutationFn: async (data) => {
      const res = await axios.post("http://localhost:3000/api/auth/login", data, { withCredentials: true });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["auth"]);
      navigate("/");
    },
    onError: (err) => {
      alert(err.response?.data?.error || "Server error.");
      setPasswordReset(true);
    }
  })

  const handleLogin = (e) => {
    e.preventDefault();
    loginMutation.mutate(userInfo)
  }

  return (
    <div className="lr-container">
      <form className="lr-form" onSubmit={handleLogin}>
        <h2>Login</h2>
        <div className="form-group">
          <label>Username</label>
          <input type="text" name="username" value={userInfo.username} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" name="password" value={userInfo.password} onChange={handleChange} />
        </div>
        <button type="submit" disabled={loginMutation.isLoading}>
          {loginMutation.isLoading ? 'Logging in...' : 'Login'}
        </button>
        <p>Don't have an account. <Link to={"/register"}> Register.</Link></p>
        {showPasswordReset && (<p>Forgot your password? <Link to={"/reset-password"}> Reset it here.</Link> </p>)}
      </form>
    </div>
  )
}

export default Login