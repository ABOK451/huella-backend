import {
  obtenerRetos,
  obtenerRetosPorCategoria,
  obtenerRetoDiario,
  completarReto,
  obtenerHistorialRetos,
  obtenerEstadisticas
} from "../controllers/retosController.js";

import authMiddleware from "../middlewares/verifyToken.js";
import express from "express";
import multer from "multer";
const upload = multer({ dest: "uploads/" });
const router = express.Router();

// Rutas protegidas
router.get("/", authMiddleware, obtenerRetos);
router.get("/categoria/:categoria", authMiddleware, obtenerRetosPorCategoria);
router.get("/diario", authMiddleware, obtenerRetoDiario);
router.get("/historial", authMiddleware, obtenerHistorialRetos);
router.get("/estadisticas", authMiddleware, obtenerEstadisticas);
router.put("/:retoUsuarioId/completar", authMiddleware, upload.single('evidencia'), completarReto);

export default router;
