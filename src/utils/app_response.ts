import { type Response } from "express";

// Overloaded generic response function
export function AppResponse(
  res: Response,
  status: number,
  message: string,
  data?: any,
  result?: number
): void;
export function AppResponse(
  res: Response,
  status: number,
  data: any,
  result?: number
): void;

// Implementation of the function
export function AppResponse(
  res: Response,
  status: number,
  messageOrData: string | any,
  dataOrResult?: any,
  result?: number
): void {
  if (typeof messageOrData === "string") {
    res.status(status).json({
      status: "SUCCESS",
      message: messageOrData,
      result: result,
      data: dataOrResult,
    });
  } else {
    res.status(status).json({
      status: "SUCCESS",
      result: dataOrResult,
      data: messageOrData,
    });
  }
}
