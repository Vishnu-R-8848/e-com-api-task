import express from "express";
import mongoose from "mongoose";
import { registerUser, loginUser } from "../controllers/auth.controller.js";

import UserModel from "../models/users.model.js";

// Router groups all authentication endpoints together.
const router = express.Router();

/**
 * @route POST /api/auth/register
 * @desc Register a new user and store the JWT in a cookie
 * @access Public
 */
// Sends registration requests to the registerUser controller.
router.post("/register", registerUser);

/**
 * @route POST /api/auth/login
 * @desc Login a user and store the JWT in a cookie
 * @access Public
 */
// Sends login requests to the loginUser controller.
router.post("/login", loginUser);

export default router;
