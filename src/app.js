import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import swaggerDocs from "./config/swagger.js";
import communityRoutes from "./routes/community.routes.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/community", communityRoutes);

// Swagger
swaggerDocs(app);

export default app;