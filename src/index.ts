import AgentAPI from "apminsight";
AgentAPI.config();

import "dotenv/config";
import express, { Request, Response } from "express";
import subjectsRouter from "./routes/subjects.js";

import cors from "cors";
import securityMiddleware from "./middleware/security.js";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.js";

const app = express();
const PORT = 8000;

if (!process.env.FRONTEND_URL) {
  throw new Error("FRONTEND_URL is not set in .env file");
}

app.use(
  cors({
    origin: process.env.FRONTEND_URL, // React app URL
    methods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed HTTP methods
    credentials: true, // allow cookies
  }),
);
//Better auth
app.all("/api/auth/*splat", toNodeHandler(auth));

// middleware
app.use(express.json());
app.use(securityMiddleware);

// routes

app.use("/api/subjects", subjectsRouter);

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Hello from Express with TypeScript!" });
});

// // example DB route (requires migrations to have run)
// app.get("/users", async (req: Request, res: Response) => {
//   try {
//     const users = await db.select().from(demoUsers);
//     res.json(users);
//   } catch (err) {
//     console.error("Error fetching users:", err);
//     res.status(500).json({ error: "Could not fetch users" });
//   }
// });

// start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
