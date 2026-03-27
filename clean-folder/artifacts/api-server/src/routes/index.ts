import { Router, type IRouter } from "express";
import healthRouter from "./health";
import aqiRouter from "./aqi";
import reportsRouter from "./reports";
import tasksRouter from "./tasks";
import authRouter from "./auth";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/aqi", aqiRouter);
router.use("/reports", reportsRouter);
router.use("/tasks", tasksRouter);
router.use("/auth", authRouter);

export default router;
