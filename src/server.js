import app from "./app.js";
import sequelize, { connectDB } from "./config/db.js"; // 👈 CAMBIO AQUÍimport {User} from "./models/user.model.js";
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 4000;

async function startServer() {
  await connectDB();
  await sequelize.sync(); // crea tabla si no existe
  app.listen(PORT, () => console.log(`🚀 Servidor corriendo en puerto ${PORT}`));
}

startServer();
