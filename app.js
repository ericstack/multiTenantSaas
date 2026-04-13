import express from "express";
import cors from "cors";
import AuthRoutes from "./src/routes/auth.js";
import UserRoutes from "./src/routes/auth.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", AuthRoutes);
app.use("/api/user", UserRoutes);

export default app;
