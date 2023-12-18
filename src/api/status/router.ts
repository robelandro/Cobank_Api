import { Router } from "express";
import {
  testStatus
} from "./controller";


const router = Router();

// test route
router
  .route("/")
  .get(
    testStatus
  );
export default router;
