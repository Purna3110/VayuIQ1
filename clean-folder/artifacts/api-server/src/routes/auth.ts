import { Router, type IRouter } from "express";

const router: IRouter = Router();

const AUTHORITY_CREDENTIALS: Record<string, { id: number; name: string; role: string }> = {
  "Ravi": { id: 101, name: "Ravi Kumar", role: "authority" },
  "Priya": { id: 102, name: "Priya Sharma", role: "authority" },
  "Arjun": { id: 103, name: "Arjun Reddy", role: "authority" },
  "Sneha": { id: 104, name: "Sneha Patel", role: "authority" },
  "Kiran": { id: 105, name: "Kiran Rao", role: "authority" },
};

const AUTHORITY_PASSWORD = "1234";

router.post("/login", (req, res) => {
  const { username, password, role } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "username and password required" });
  }

  if (role === "authority") {
    const authority = AUTHORITY_CREDENTIALS[username];
    if (authority && password === AUTHORITY_PASSWORD) {
      return res.json({
        success: true,
        user: { id: authority.id, name: authority.name, email: `${username.toLowerCase()}@hyderabad.gov.in`, role: "authority" },
        role: "authority",
      });
    }
    return res.status(401).json({ error: "Invalid credentials" });
  }

  if (role === "citizen" || !role) {
    if (username && password && password.length >= 4) {
      return res.json({
        success: true,
        user: { id: Math.floor(Math.random() * 10000), name: username, email: username.includes("@") ? username : `${username}@example.com`, role: "citizen" },
        role: "citizen",
      });
    }
    return res.status(401).json({ error: "Password must be at least 4 characters" });
  }

  return res.status(401).json({ error: "Invalid credentials" });
});

export default router;
