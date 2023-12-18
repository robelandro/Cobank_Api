import express, {
  type Response,
  type Request,
  type NextFunction,
} from "express";
import helmet from "helmet";
import cors from "cors";
import errorHandler from "../utils/geh";
import AppError from "../utils/app_error";
import status  from "../api/status/router";

// importing routers

const app: express.Application = express();
const apiName = "/api/v1"; // api Name with Version

// thrid party middleware
app.use(helmet()); // use helmet to secure the app

// setup cors
app.use(
  cors({
    origin: "*",
  })
);

// builtin middleware
app.use(express.json()); // to parse the body of the request
app.use(express.urlencoded({ extended: true }));

// routes
app.use(`${apiName}/status`, status);

// unknown route handler
app.use("*", (req: Request, res: Response, next: NextFunction) => {
  next(new AppError("Unknown URL", 404));
});

// Global Error Handler
app.use(errorHandler);

export default app;
