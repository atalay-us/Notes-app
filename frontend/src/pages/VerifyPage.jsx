import { useState, useRef, useEffect } from "react"
import axios from "axios";
import { useQueryClient, useMutation } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom";

import "../css/verifypage.css"

const VerifyPage = ({ user }) => {
    const [otpValues, setOtpValues] = useState(Array(6).fill(""))
    const inputs = useRef([])
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    useEffect(() => {
        if (inputs.current[0]) {
            inputs.current[0].focus();
        }
    }, []);

    const verifyEmailMutation = useMutation({
        mutationFn: async (token) => {
            await axios.post("http://localhost:3000/api/auth/check-verification-token",
                { verificationToken: token, username: user.username },
                { withCredentials: true });

        },
        onSuccess: () => {
            queryClient.invalidateQueries(["auth"]);
            alert("Email verified successfully!");
            navigate("/");
        },
        onError: (err) => {
            alert(err.response?.data?.error || "Verification failed. Please try again.");
        },
    })

    const resendMutation = useMutation({
        mutationFn: async () => {
            const res = await axios.get("http://localhost:3000/api/auth/resend-verification-token", {
                withCredentials: true,
            });
            return res.data;
        },
        onSuccess: () => {
            alert("New verification code sent!");
        },
        onError: (err) => {
            alert(err.response?.data?.error || "Failed to resend verification code.");
        },
    })

    const handleChange = (e, index) => {
        const value = e.target.value;

        const newOtp = [...otpValues];
        // Allow single digit or empty input
        if (value.match(/^\d$/) || value === "") {
            newOtp[index] = value;
            setOtpValues(newOtp);

            // Move focus to next input only for digit input
            if (value.match(/^\d$/) && index < otpValues.length - 1) {
                inputs.current[index + 1].focus();
            }
        }

        const combValues = [...newOtp.slice(0, index), value, ...newOtp.slice(index + 1)].join("");
        if (combValues.length === 6 && /^\d{6}$/.test(combValues)) {
            verifyEmailMutation.mutate(combValues);
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" || e.key === "Delete") {
            const newOtp = [...otpValues];
            if (otpValues[index] !== "" || e.key === "Delete") {
                // Clear current input
                newOtp[index] = "";
                setOtpValues(newOtp);
            }
            // Move focus to previous input if empty or after clearing
            if (index > 0 && (otpValues[index] === "" || e.key === "Delete")) {
                inputs.current[index - 1].focus();
            }
        }
    };
    return (
        <div className="verify-page">
            <div className="verify-form-container">
                <p>Your verification code has been send to {user.email}</p>
                <div className="verify-inputs">
                    {otpValues.map((_, index) => (
                        <input
                            className="otp-input"
                            key={index}
                            ref={(el) => (inputs.current[index] = el)}
                            type="text"
                            maxLength="1"
                            value={otpValues[index]}
                            onChange={(e) => handleChange(e, index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            placeholder="0"
                        />
                    ))}
                </div>
                <button onClick={() => resendMutation.mutate()}
                    disabled={resendMutation.isLoading}>
                    Resend verification code.
                </button>
            </div>
        </div>
    )
}

export default VerifyPage;
