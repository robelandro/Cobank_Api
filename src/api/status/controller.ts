import { Response, Request, NextFunction } from "express";
import { AppResponse } from "../../utils/app_response";

export const testStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    AppResponse(res, 200, "I am alive");
  } catch (error) {
    next(error)
  }
};
