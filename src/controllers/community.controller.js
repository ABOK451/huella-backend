import { CommunityPost } from "../models/community.model.js";
import { User } from "../models/user.model.js";

/**
 * Obtener todas las publicaciones de la comunidad
 */
export const getPosts = async (req, res) => {
  try {
    const posts = await CommunityPost.findAll({
      include: [{ model: User, attributes: ["email"] }],
      order: [["createdAt", "DESC"]],
    });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las publicaciones", error });
  }
};

/**
 * Crear una nueva publicación
 */
export const createPost = async (req, res) => {
  try {
    const userId = req.user.id; // viene del token
    const { message } = req.body;

    if (!message) return res.status(400).json({ message: "El mensaje es obligatorio" });

    const newPost = await CommunityPost.create({ userId, message });
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: "Error al crear la publicación", error });
  }
};

/**
 * Dar like a una publicación
 */
export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await CommunityPost.findByPk(id);

    if (!post) return res.status(404).json({ message: "Publicación no encontrada" });

    post.likes += 1;
    await post.save();

    res.json({ message: "Like agregado", likes: post.likes });
  } catch (error) {
    res.status(500).json({ message: "Error al dar like", error });
  }
};
