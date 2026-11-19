const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {

    try {
        // Step 1: Get token from Authorization header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Access denied. No token provided."
            });
        }

        // Step 2: Extract token
        const token = authHeader.split(" ")[1];

        // Step 3: Verify token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // Step 4: Attach patient details to request
        req.patient = decoded;

        // Step 5: Continue to next middleware or route
        next();

    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
};

module.exports = authMiddleware;