import { useNavigate } from "react-router-dom"
import { useQueryClient, useMutation } from "@tanstack/react-query"
import { useState } from "react";
import axios from "axios";

import "../css/changepassword.css";

const ChangePasswordPage = ({ user }) => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({ email: user ? user.email : "", password: "", token: "" });
    const [showForm, setShowForm] = useState(user ? true : false)

    const sendPasswordResetTokenMutation = useMutation({
        mutationFn: async (email) => {
            await axios.post("http://localhost:3000/api/auth/send-password-reset-token", { email }, { withCredentials: true });
        },
        onSuccess: () => {
            alert("Password reset token sent to your email.");
            setShowForm(true);
        },
        onError: (err) => {
            alert(err.response?.data?.error || "Server error.");
        }
    });

    const changePasswordMutation = useMutation({
        mutationFn: async (form) => {
            await axios.post("http://localhost:3000/api/auth/reset-password", form);
        },
        onSuccess: () => {
            alert("Your password changed successfuly.");
            queryClient.invalidateQueries(["auth"]);
            user ? navigate("/") : navigate("/login")
        },
        onError: (err) => {
            alert(err.response?.data?.error || "Server error.");
        }
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        showForm && changePasswordMutation.mutate(formData)
    }

    return (
        <div className="page-overlay">
            <div className="change-password-container">
                <form onSubmit={handleSubmit} className="change-password-form">
                    <h2>Change Password</h2>
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} disabled={showForm} />
                    </div>
                    {showForm ?
                        (<>
                            <div className="form-group">
                                <label>Password reset token</label>
                                <input type="text" name="token" value={formData.token} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>New password</label>
                                <input type="password" name="password" value={formData.password} onChange={handleChange} />
                            </div>
                            <button type="submit" disabled={!showForm}>Change password</button>
                        </>) :
                        <button disabled={showForm} onClick={() => { sendPasswordResetTokenMutation.mutate(formData.email) }}>Send password reset token</button>}

                </form>
            </div>
        </div>
    )
}

export default ChangePasswordPage