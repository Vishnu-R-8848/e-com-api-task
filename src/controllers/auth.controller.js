export const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  // Basic validation

  if (!username) {
    return res
      .status(400)
      .json({ message: "Validation Failed: Username is required." });
  }

  if (username.trim().length < 3 && username.trim().length > 30) {
    return res.status(400).json({
      message:
        "Validation Failed: Username must be at least 3 characters long.",
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return res
      .status(400)
      .json({ message: "Validation Failed: A valid email is required." });
  }

  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  if (!password || !passwordRegex.test(password)) {
    return res.status(400).json({
      message:
        "Validation Failed: Password must be at least 8 characters long and contain both letters and numbers.",
    });
  }

  // ---- if validation passes, we would normally proceed to create the user in the database ----
  const token = jwt.sign({ username, email, password }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  res.cookie("token", token);

  res.status(201).json({ message: "User registered successfully!" });
};
