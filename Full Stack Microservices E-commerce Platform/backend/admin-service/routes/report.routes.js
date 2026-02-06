import express from "express";
import { verifyAdmin } from "../middleware/verifyAdmin.js";
import { salesReport, inventoryReport } from "../controllers/report.controller.js";

const router = express.Router();
router.get("/sales", verifyAdmin, salesReport);
router.get("/inventory", verifyAdmin, inventoryReport);

export default router;
