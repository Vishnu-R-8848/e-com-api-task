// middleware/validateProduct.js
export const validateProductData = (req, res, next) => {
  const { name, price, category } = req.body;

  // 1. Check if required body data exists
  if (!name || !price || !category) {
    return res.status(400).json({ message: "Validation Failed: Missing required fields." });
  }

  // 2. Enforce numerical business rules
  if (Number(price) <= 0) {
    return res.status(400).json({ message: "Validation Failed: Price must be a positive number." });
  }

  // If everything passes, pass control gracefully to the next block
  next();
};