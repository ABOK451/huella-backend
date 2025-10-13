import { Router } from "express";
import { getPosts, createPost, likePost } from "../controllers/community.controller.js";
import verifyToken from "../middlewares/verifyToken.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Comunidad
 *   description: Endpoints para interactuar con la comunidad
 */

/**
 * @swagger
 * /api/community:
 *   get:
 *     summary: Obtener todas las publicaciones de la comunidad
 *     tags: [Comunidad]
 *     responses:
 *       200:
 *         description: Lista de publicaciones obtenida
 */
router.get("/", getPosts);

/**
 * @swagger
 * /api/community:
 *   post:
 *     summary: Crear una nueva publicación
 *     tags: [Comunidad]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *     responses:
 *       201:
 *         description: Publicación creada exitosamente
 */
router.post("/", verifyToken, createPost);

/**
 * @swagger
 * /api/community/{id}/like:
 *   patch:
 *     summary: Dar like a una publicación
 *     tags: [Comunidad]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del post
 *     responses:
 *       200:
 *         description: Like agregado exitosamente
 */
router.patch("/:id/like", likePost);

export default router;
