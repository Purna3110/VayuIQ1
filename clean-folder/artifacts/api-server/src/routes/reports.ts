import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { reportsTable } from "@workspace/db/schema";
import { desc } from "drizzle-orm";

const router: IRouter = Router();

router.get("/", async (req, res) => {
  try {
    const reports = await db.select().from(reportsTable).orderBy(desc(reportsTable.createdAt));
    res.json(reports.map(r => ({
      ...r,
      createdAt: r.createdAt.toISOString(),
    })));
  } catch (err) {
    req.log.error(err, "Failed to fetch reports");
    res.status(500).json({ error: "Failed to fetch reports" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { location, description, severity, lat, lng } = req.body;
    if (!location || !description || !severity) {
      return res.status(400).json({ error: "location, description, severity are required" });
    }
    const [report] = await db.insert(reportsTable).values({
      location,
      description,
      severity,
      status: "pending",
      lat: lat || null,
      lng: lng || null,
    }).returning();
    res.status(201).json({
      ...report,
      createdAt: report.createdAt.toISOString(),
    });
  } catch (err) {
    req.log.error(err, "Failed to create report");
    res.status(500).json({ error: "Failed to create report" });
  }
});

export default router;
