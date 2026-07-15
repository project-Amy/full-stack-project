import { Request, Response, NextFunction } from "express";
import { supabase } from "../lib/supabase";
import { sendError } from "../utils/responses";

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
      sendError(res, "Missing or invalid authorization header", 401);
      return;
    }
    const token = authHeader.substring(7);
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data.user) {
      sendError(res, "Invalid or expired token", 401);
      return;
    }
    req.user = {
      id: data.user.id,
    };
    next();
  } catch (err) {
    console.error(`${req.method} ${req.originalUrl} auth error:`, err);
    sendError(res, "Authentication failed", 500);
  }
};
