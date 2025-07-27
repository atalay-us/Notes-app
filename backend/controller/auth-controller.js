import bcrypt from 'bcrypt';
import crypto from 'crypto';

import User from '../models/user-model.js';

import { generateTokenAndSetCookie } from '../utils/generateTokenAndSetCookie.js';

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

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });
        await newUser.save();

        generateTokenAndSetCookie(res, newUser._id);

        const showUser = {
            _id: newUser._id,
            username: newUser.username,
            email: newUser.email,
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