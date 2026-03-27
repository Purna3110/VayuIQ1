import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { tasksTable } from "@workspace/db/schema";
import { eq, desc } from "drizzle-orm";

const router: IRouter = Router();

const SEED_TASKS = [
  { title: "Inspect Charminar pollution source", description: "High AQI detected near Charminar area. Identify and document pollution sources.", status: "pending", location: "Charminar, Hyderabad", notes: null },
  { title: "Deploy air monitors in LB Nagar", description: "Install additional air quality monitoring stations in LB Nagar due to high readings.", status: "pending", location: "LB Nagar, Hyderabad", notes: null },
  { title: "Coordinate with traffic dept - Secunderabad", description: "Reduce traffic congestion on major arteries to cut vehicle emission levels.", status: "pending", location: "Secunderabad", notes: null },
  { title: "Green belt expansion - Uppal", description: "Plant 500 trees along the industrial corridor in Uppal.", status: "completed", location: "Uppal, Hyderabad", notes: "Completed. 520 saplings planted." },
  { title: "Industrial audit - Patancheru", description: "Conduct compliance audit of chemical industries in Patancheru MIDC.", status: "pending", location: "Patancheru, Hyderabad", notes: null },
];

let seeded = false;

router.get("/", async (req, res) => {
  try {
    if (!seeded) {
      const existing = await db.select().from(tasksTable);
      if (existing.length === 0) {
        await db.insert(tasksTable).values(SEED_TASKS as any);
      }
      seeded = true;
    }
    const tasks = await db.select().from(tasksTable).orderBy(desc(tasksTable.createdAt));
    res.json(tasks.map(t => ({
      ...t,
      createdAt: t.createdAt.toISOString(),
    })));
  } catch (err) {
    req.log.error(err, "Failed to fetch tasks");
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { title, description, location } = req.body;
    if (!title) return res.status(400).json({ error: "title is required" });
    const [task] = await db.insert(tasksTable).values({
      title,
      description: description || null,
      location: location || null,
      status: "pending",
    }).returning();
    res.status(201).json({
      ...task,
      createdAt: task.createdAt.toISOString(),
    });
  } catch (err) {
    req.log.error(err, "Failed to create task");
    res.status(500).json({ error: "Failed to create task" });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { status, notes } = req.body;
    const updates: Record<string, any> = {};
    if (status !== undefined) updates.status = status;
    if (notes !== undefined) updates.notes = notes;
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: "No fields to update" });
    }
    const [task] = await db.update(tasksTable).set(updates).where(eq(tasksTable.id, id)).returning();
    if (!task) return res.status(404).json({ error: "Task not found" });
    res.json({
      ...task,
      createdAt: task.createdAt.toISOString(),
    });
  } catch (err) {
    req.log.error(err, "Failed to update task");
    res.status(500).json({ error: "Failed to update task" });
  }
});

export default router;
