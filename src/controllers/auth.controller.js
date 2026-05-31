import mongoose from "mongoose";
import UserModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// Registers a new user after validating input, hashing the password, and creating a login cookie.
export const registerUser = async (req, res) => {
  // Read the user details sent from the client.
  const { username, email, password } = req.body;

  // Validate required fields before trying to create a user.
  if (!username) {
    return res.status(400).json({ error: "Username is required" });
  }

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  // Check that the email has a basic valid email format.
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  if (!password) {
    return res.status(400).json({ error: "Password is required" });
  }

  // Require a stronger password before saving the user.
  const passwordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()-+])[A-Za-z\d!@#$%^&*()-+]{6,}$/;

  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      error:
        "Password must be at least 6 characters long and contain both letters, numbers and special characters.",
    });
  }

  if (username.trim().length < 3) {
    return res
      .status(400)
      .json({ error: "Username must be at least 3 characters long" });
  }

  // Create the user after validation passes.
  // bcrypt.hash converts the plain password into a hashed password before storing it.
  const newUser = await UserModel.create({
    username,
    email,
    password: await bcrypt.hash(password, 10),
  });

  // Create a JWT token that stores safe user identity data for future authenticated requests.
  const token = jwt.sign(
    { userId: newUser._id, username: newUser.username, email: newUser.email },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h", // Token expires in 1 hour
    },
  );

  // Store the JWT token in a cookie so the browser can send it with later requests.
  res.cookie("token", token);

  return res.status(201).json({
    message: "User registered successfully",
    user: newUser,
  });
};

// Logs in an existing user by checking credentials and creating a fresh JWT cookie.
export const loginUser = async (req, res) => {
  // Read login credentials from the request body.
  let { email, password } = req.body;

  // Validate the login input before searching the database.
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  if (!password) {
    return res.status(400).json({ error: "Password is required" });
  }

  // Check that the email looks valid before querying MongoDB.
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  const passwordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()-+])[A-Za-z\d!@#$%^&*()-+]{6,}$/;

  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      error:
        "Password must be at least 6 characters long and contain both letters, numbers and special characters.",
    });
  }

  // Find the user account with the submitted email address.
  const user = await UserModel.findOne({ email });

  // Stop the login flow if no user exists for this email.
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  // ---- if user found, generate a token ----
  // const isMatch = await bcrypt.compare(password, user.password);

  // if (!isMatch) {
  //   return res.status(401).json({ error: "Invalid credentials" });
  // }

  // ---- using the method defined in the user model to compare passwords ----

  // Compare the submitted plain password with the hashed password stored in MongoDB.
  if(!(await user.matchPassword(password))) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  // Create a JWT token after the password is confirmed.
  const token = jwt.sign(
    { userId: user._id, username: user.username, email: user.email },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    },
  );

  // Store the JWT in a cookie so protected routes can identify the logged-in user.
  res.cookie("token", token);

  return res.status(200).json({
    message: "User logged in successfully",
    user,
  });
};
