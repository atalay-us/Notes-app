import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    try {
        const { token } = req.cookies;

        if (!token) {
            return res.status(401).json({ error: "Unauthorized access" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ error: "Unauthorized: Invalid token" })
        }

        req.userId = decoded.userId;
        next();
    } catch (error) {
        console.error("Error in verify token",error);
        return res.status(500).json({ error:"Internal server error"})
    }
}