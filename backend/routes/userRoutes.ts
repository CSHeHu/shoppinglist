import express from "express";
import type { Request, Response } from "express";
const router = express.Router();
import {
  showLogoutPage,
  logoutUser,
  getUser,
  loginUser,
  showLoginPage,
  listUsers,
  registerUser,
  getUserById,
  getUserByEmail,
  refreshAccessToken,
} from "../controllers/userController.js";
import { requireAuth, requireAdmin } from "../middleware/requireAuth.js";
import {
  validateUser,
  userFields,
  loginFields,
  idParam,
  emailParam,
} from "../middleware/validateUser.js";

// Render login/logout pages
// TODO: These routes exist for compatibility with previous server-side
// rendered login/logout flows. Once the SPA handles UI entirely, remove
// these endpoints or convert them to static routes served by the frontend.
router.get("/login", showLoginPage);
router.get("/logout", requireAuth, showLogoutPage);

// List all users (admin only)
router.get("/users", requireAdmin, listUsers);

// Register a new user (admin only)
router.post("/users", requireAdmin, validateUser(userFields), registerUser);

// Get current user info
router.get("/users/me", requireAuth, getUser);

// Get user by id (admin only)
router.get("/users/id/:id", requireAdmin, validateUser(idParam), getUserById);
// Get user by email (admin only)
router.get(
  "/users/email/:email",
  requireAdmin,
  validateUser(emailParam),
  getUserByEmail,
);

// Update user by id (admin only)
router.put(
  "/users/:id",
  requireAdmin,
  validateUser([...idParam, ...userFields]),
  (req: Request, res: Response) => {
    // TODO: Implement updateUser controller
    res.status(501).json({ message: "Not implemented: update user" });
  },
);

// Delete user by id (admin only)
router.delete(
  "/users/:id",
  requireAdmin,
  validateUser(idParam),
  (req: Request, res: Response) => {
    // TODO: Implement deleteUser controller
    res.status(501).json({ message: "Not implemented: delete user" });
  },
);

// Login
router.post("/users/login", validateUser(loginFields), loginUser);

// Logout
router.post("/users/logout", logoutUser);

// Refresh access token using HttpOnly refresh cookie
router.post("/auth/refresh", refreshAccessToken);

export default router;
