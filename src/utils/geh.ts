import {
  type ErrorRequestHandler,
  type Request,
  type Response,
  type NextFunction,
} from "express";
import AppError from "./app_error";
import configs from "../configs";

/**
 * Error Response for Production
 * @param err
 * @param res
 */
const errResponseProduction = (err: AppError, res: Response): void => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

/**
 * Error Response for Development
 * @param err
 * @param res
 */
const errResponseDevelopment = (err: AppError, res: Response): void => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    errorStack: err.stack,
  });
};

/**
 * Unknown Devleopment enviroment
 * @param res
 */
const UnknownEnvResponse = (res: Response): void => {
  res.status(500).json({
    status: "ERROR",
    message: "Opps, unknown environment selected",
  });
};

/**
 * Midleware Handle all errors
 * @param err
 * @param req
 * @param res
 * @param next
 */
const errorHandler: ErrorRequestHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "ERROR";

  if (err.name === "CastError") {
    err = new AppError("Input is incorrect", 400);
  }

  if (configs.env === "production") {
    errResponseProduction(err, res);
  } else if (configs.env === "development") {
    errResponseDevelopment(err, res);
  } else {
    UnknownEnvResponse(res);
  }
};

export default errorHandler;
