import bcrypt from 'bcrypt';
import User from '../models/user-model.js';

import { generateTokenAndSetCookie } from '../utils/generateTokenAndSetCookie.js';

//import { sendVerificationEmail, sendWelcomeEmail } from '../mailtrap/sendEmails.js';

const saltrounds = 10;

export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: "Username is already taken" });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Invalid email format" });
        }

        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ error: "Email is already taken" });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: "Password must be at least 6 characters long" });
        }

        const hashedPassword = await bcrypt.hash(password, saltrounds);

        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            verificationToken,
            verificationTokenExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
        });
        await newUser.save();

        //await sendVerificationEmail(newUser.email, verificationToken);

        const showUser = {
            _id: newUser._id,
            username: newUser.username,
            email: newUser.email,
            isVerified: newUser.isVerified,
            verificationToken: newUser.verificationToken,
            verificationTokenExpiresAt: newUser.verificationTokenExpiresAt,
        };

        res.status(201).json({
            message: "User registered successfully",
            user: showUser,
        })
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: "Username and password are required" });
        }

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ error: "Invalid username or password" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: "Invalid username or password" });
        }

        generateTokenAndSetCookie(res, user._id);

        user.lastLogin = new Date();
        await user.save();

        const showUser = {
            _id: user._id,
            username: user.username,
            email: user.email,
        };

        res.status(200).json({
            message: "Login successful",
            user: showUser,
        });
    } catch (error) {
        console.log("Login error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const logout = async (req, res) => {
    try {
        res.clearCookie("token");
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const checkAuth = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" })
        }
        const showUser = {
            ...user._doc,
            password: undefined
        }
        res.status(200).json({ user: showUser })
    } catch (error) {
        console.error("Error in CheckAuth", error);
        res.status(400).json({ error: "Internal server error" });
    }
}

export const sendVerificationCode = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: "User not found." })
        }

        if (user.isVerified) {
            return res.status(400).json({ error: "User is already verified." })
        }

        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

        user.verificationToken = verificationToken;
        user.verificationTokenExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
        await user.save();

        const showUser = {
            _id: user._id,
            username: user.username,
            email: user.email,
            isVerified: user.isVerified,
            verificationToken: user.verificationToken,
            verificationTokenExpiresAt: user.verificationTokenExpiresAt,
        };

        //await sendVerificationEmail(newUser.email, verificationToken);

        res.status(201).json({
            message: "New email verification token has been send successfully.",
            user: showUser,
        })
    } catch (error) {
        console.error("Error sending new verification token:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const checkVerificationCode = async (req, res) => {
    try {
        const { verificationToken, username } = req.body


        if (!verificationToken) {
            return res.status(400).json({ error: "Verification token are required" });
        }

        const user = await User.findOne({
            verificationToken,
            verificationTokenExpiresAt: { $gt: Date.now() },
            username
        });

        if (!user) {
            return res.status(401).json({ error: "Invalid or expired verification token" });
        } 

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;
        await user.save();

        const showUser = {
            _id: user._id,
            username: user.username,
            email: user.email,
            isVerified: user.isVerified,
        };

        //await sendWelcomeEmail(user.email, user.username);

        res.status(200).json({
            message: "Email verified successfully",
            showUser
        });
    } catch (error) {
        console.error("Email verification error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}