import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import retosRoutes from "./routes/retos.routes.js";
import swaggerDocs from "./config/swagger.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/retos", retosRoutes);


// Swagger
swaggerDocs(app);

export default app;