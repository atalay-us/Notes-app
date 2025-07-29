import express from 'express';
import {
    register,
    login,
    logout,
    checkAuth,
    sendVerificationCode,
    checkVerificationCode,
    sendPasswordResetToken,
    changePassword
} from '../controller/auth-controller.js';
import { verifyToken } from '../middleware/verify-token.js';

const router = express.Router();

router.get("/check-auth", verifyToken, checkAuth);

router.get("/resend-verification-token", verifyToken, sendVerificationCode);

router.post("/send-password-reset-token", sendPasswordResetToken);

router.post("/register", register);

router.post("/login", login);

router.post("/logout", logout);

router.post("/check-verification-token", verifyToken, checkVerificationCode);

router.post("/reset-password", changePassword);

export default router;