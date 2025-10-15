import { Request, Response, NextFunction } from "express";
import { supabase } from "../lib/supabase";

export interface AuthRequest extends Request {
  user?: {
    id: string;
  };
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        error: "Unauthorized",
        message: "Missing or invalid authorization header",
      });
      return;
    }
    const token = authHeader.substring(7);
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data.user) {
      res.status(401).json({
        error: "Unauthorized",
        message: "Invalid or expired token",
      });
      return;
    }
    req.user = {
      id: data.user.id,
    };
    next();
  } catch (err) {
    res.status(500).json({
      error: "Internal Server Error",
      message: "Authentication failed",
    });
  }
};
