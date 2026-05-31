import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  // Extract the token dynamically parsed from the browser cookie container
  const token = req.cookies.token;

  if (!token) {
    return res
      .status(401)
      .json({ error: "Unauthorized: Access token missing" });
  }

  try {
    // 🔐 CRITICAL SECURITY FIX: Verify token integrity using your secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🔥 DATA INJECTION: Pass the token's decrypted user payload onto the request lifecycle
    // This makes req.user.email immediately available to your next controller function!
    req.user = decoded;

    next(); // Pass control gracefully to your controller
  } catch (error) {
    console.error("JWT Verification Error:", error);
    return res
      .status(401)
      .json({ error: "Unauthorized: Invalid or expired token signature" });
  }
};

export default authMiddleware;
