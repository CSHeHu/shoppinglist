import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const accessSecret = process.env.JWT_ACCESS_SECRET;
if (!accessSecret) throw new Error("JWT_ACCESS_SECRET must be set");

export interface JwtPayloadCustom {
  userId: string;
  role: string;
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer "))
    return res.status(401).json({ message: "Unauthorized" });
  const token = auth.slice(7);
  try {
    const decoded = jwt.verify(token, accessSecret as jwt.Secret) as unknown;
    if (
      typeof decoded === "object" &&
      decoded !== null &&
      "userId" in decoded &&
      "role" in decoded
    ) {
      const d = decoded as { userId?: unknown; role?: unknown };
      (req as any).user = {
        userId: String(d.userId),
        role: String(d.role),
      } as JwtPayloadCustom;
      return next();
    }
    return res.status(401).json({ message: "Invalid token payload" });
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const user = (req as any).user as JwtPayloadCustom | undefined;
  if (user && user.role === "root") return next();
  return res.status(403).json({ message: "Forbidden: Admins only" });
}
