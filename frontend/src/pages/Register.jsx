import { useQueryClient, useMutation } from "@tanstack/react-query"
import axios from "axios"
import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"

const Register = () => {
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState({ username: "", password: "", email: "" });

  const queryClient = useQueryClient();

  const handleChange = (e) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  }

  const registerMutation = useMutation({
    mutationFn: async (data) => {
      const res = await axios.post("http://localhost:3000/api/auth/register", data, { withCredentials: true });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["auth"]);
      navigate("/");
    },
    onError: (err) => {
      alert(err.response?.data?.error || "Server error.");
    }
  })

  const handleRegister = (e) => {
    e.preventDefault();
    registerMutation.mutate(userInfo)
  }

  return (
    <div className="lr-container">
      <form className="lr-form" onSubmit={handleRegister}>
        <h2>Register</h2>
        <div className="form-group">
          <label>E-mail</label>
          <input type="email" name="email" value={userInfo.email} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Username</label>
          <input type="text" name="username" value={userInfo.username} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" name="password" value={userInfo.password} onChange={handleChange} />
        </div>
        <button type="submit" disabled={registerMutation.isLoading}>
          Register
        </button>
        <p>Already have an account. <Link to={"/login"}> Login.</Link></p>
      </form>
    </div>
  )
}

export default Register;