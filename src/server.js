import app from "./app.js";
import sequelize, { connectDB } from "./config/db.js";
import { User } from "./models/user.model.js";
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 4000;

async function startServer() {
  try {
    await connectDB();
    await sequelize.sync(); // crea tablas si no existen
    // Escucha en 0.0.0.0 para que Traefik/Dokploy pueda enrutar correctamente
    app.listen(PORT, "0.0.0.0", () =>
      console.log(`🚀 Servidor corriendo en puerto ${PORT}`)
    );
    
  } catch (error) {
    console.error("❌ Error iniciando el servidor:", error);
    process.exit(1); // termina el proceso si hay error crítico
  }
}

startServer();
