import type { Request, Response, NextFunction } from "express";
import type { StatusError } from "../types/StatusError.js";
import {
  verifyUserCredentials,
  findUserById,
  findAllUsers,
  createUser,
  findUserByEmail,
} from "../models/userModel.js";
import jwt from "jsonwebtoken";
import {
  saveRefreshToken,
  findRefreshToken,
  deleteRefreshToken,
} from "../models/tokenModel.js";

const accessSecretEnv = process.env.JWT_ACCESS_SECRET;
const refreshSecretEnv = process.env.JWT_REFRESH_SECRET;
if (!accessSecretEnv || !refreshSecretEnv) {
  throw new Error("JWT_ACCESS_SECRET and JWT_REFRESH_SECRET must be set");
}
const ACCESS_SECRET: string = accessSecretEnv;
const REFRESH_SECRET: string = refreshSecretEnv;
const ACCESS_EXPIRES = process.env.JWT_ACCESS_EXPIRES ?? "15m";
const REFRESH_EXPIRES = process.env.JWT_REFRESH_EXPIRES ?? "7d";

export const listUsers = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const users = await findAllUsers();
    res.json(users);
  } catch (err) {
    const error = err as StatusError;
    error.status = error.status ?? 500;
    next(error);
  }
};

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role || !["user", "root"].includes(role)) {
      return res.status(400).json({ message: "Missing or invalid fields" });
    }
    const existing = await findUserByEmail(email);
    if (existing) {
      return res.status(409).json({ message: "User already exists" });
    }
    const result = await createUser(email, password, role);
    if (result.insertedId) {
      return res
        .status(201)
        .json({ message: "User created", userId: result.insertedId });
    } else {
      return res.status(500).json({ message: "User creation failed" });
    }
  } catch (err) {
    const error = err as StatusError;
    error.status = error.status ?? 500;
    next(error);
  }
};

export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res
        .status(400)
        .json({ error: { code: 400, message: "User ID required" } });
    }
    const user = await findUserById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    const error = err as StatusError;
    error.status = error.status ?? 500;
    next(error);
  }
};

export const getUserByEmail = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email } = req.params;
    if (!email) {
      return res
        .status(400)
        .json({ error: { code: 400, message: "Email required" } });
    }
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    const error = err as StatusError;
    error.status = error.status ?? 500;
    next(error);
  }
};

// TODO: Implement logic to update user by id (admin or self)
export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  res.status(501).json({ message: "Not implemented: update user" });
};

// TODO: Implement logic to delete user by id (admin or self)
export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  res.status(501).json({ message: "Not implemented: delete user" });
};

export const showLoginPage = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    return res.json({
      message: "Login endpoint (POST to /api/v1/users/login)",
    });
  } catch (err) {
    const error = err as StatusError;
    error.status = error.status ?? 500;
    next(error);
  }
};

export const showLogoutPage = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    return res.json({
      message: "Logout endpoint (POST to /api/v1/users/logout)",
    });
  } catch (err) {
    const error = err as StatusError;
    error.status = error.status ?? 500;
    next(error);
  }
};

export const logoutUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // revoke refresh token if provided in cookie
    const token = req.cookies?.refreshToken as string | undefined;
    if (token) {
      await deleteRefreshToken(token);
    }
    // TODO: This clears the refresh-token cookie; previously logout would
    // also destroy an express-session. Ensure no leftover session cleanup is
    // required elsewhere and remove session-related code.
    res.clearCookie("refreshToken");
    return res.json({ message: "You have been logged out" });
  } catch (err) {
    const error = err as StatusError;
    error.status = error.status ?? 500;
    next(error);
  }
};

export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // TODO: `req.user` must be populated by JWT middleware. Previously
    // sessions populated user data on `req.session`/`req.user`. Ensure all
    // callers use the JWT middleware adapter and remove any session-based
    // assumptions.
    const userId = (req as any).user?.userId as string | undefined;
    if (!userId) {
      return res
        .status(401)
        .json({ error: { code: 401, message: "User not authenticated" } });
    }
    const user = await findUserById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ error: { code: 404, message: "User not found" } });
    }
    const { _id, email, role, createdAt, updatedAt } = user;
    return res.json({ _id, email, role, createdAt, updatedAt });
  } catch (err) {
    const error = err as StatusError;
    error.status = error.status ?? 500;
    next(error);
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ error: { code: 400, message: "email and password required" } });
  }
  try {
    const user = await verifyUserCredentials(email, password);
    if (!user)
      return res
        .status(401)
        .json({ error: { code: 401, message: "invalid credentials" } });
    if (!user._id || !user.role) {
      return res
        .status(500)
        .json({ error: { code: 500, message: "User data incomplete" } });
    }
    const payload = { userId: String(user._id), role: user.role };
    const accessToken = jwt.sign(
      payload,
      ACCESS_SECRET as jwt.Secret,
      { expiresIn: ACCESS_EXPIRES } as jwt.SignOptions,
    );
    const refreshToken = jwt.sign(
      payload,
      REFRESH_SECRET as jwt.Secret,
      { expiresIn: REFRESH_EXPIRES } as jwt.SignOptions,
    );
    // save refresh token to DB
    const expiresAt = new Date(Date.now() + msToMs(REFRESH_EXPIRES));
    await saveRefreshToken(refreshToken, String(user._id), expiresAt);
    // set HttpOnly cookie for refresh token
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: msToMs(REFRESH_EXPIRES),
    });
    return res.json({
      message: "Logged in",
      accessToken,
      expiresIn: ACCESS_EXPIRES,
      userId: String(user._id),
      role: user.role,
    });
  } catch (err) {
    const error = err as StatusError;
    error.status = error.status ?? 500;
    next(error);
  }
};

function msToMs(exp: string): number {
  // accepts formats like '15m', '7d'
  const match = /^([0-9]+)([smhd])$/.exec(exp);
  if (!match) return 24 * 60 * 60 * 1000;
  const val = Number(match[1]);
  const unit = match[2];
  switch (unit) {
    case "s":
      return val * 1000;
    case "m":
      return val * 60 * 1000;
    case "h":
      return val * 60 * 60 * 1000;
    case "d":
      return val * 24 * 60 * 60 * 1000;
    default:
      return val * 1000;
  }
}

export const refreshAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies?.refreshToken as string | undefined;
    if (!token) return res.status(401).json({ message: "No refresh token" });
    const stored = await findRefreshToken(token);
    if (!stored)
      return res.status(401).json({ message: "Refresh token not recognized" });
    // verify token
    let payload: any;
    try {
      payload = jwt.verify(token, REFRESH_SECRET as jwt.Secret) as any;
    } catch (e) {
      await deleteRefreshToken(token);
      res.clearCookie("refreshToken");
      return res.status(401).json({ message: "Invalid refresh token" });
    }
    const newPayload = { userId: payload.userId, role: payload.role };
    const accessToken = jwt.sign(
      newPayload,
      ACCESS_SECRET as jwt.Secret,
      { expiresIn: ACCESS_EXPIRES } as jwt.SignOptions,
    );
    return res.json({ accessToken, expiresIn: ACCESS_EXPIRES });
  } catch (err) {
    const error = err as StatusError;
    error.status = error.status ?? 500;
    next(error);
  }
};
