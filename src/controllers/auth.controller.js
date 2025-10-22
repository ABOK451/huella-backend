import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User } from "../models/user.model.js";

dotenv.config();

// ✅ REGISTER
export const register = async (req, res) => {
  console.log("📥 [REGISTER] Datos recibidos:", req.body);
  try {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      console.log("❌ [REGISTER] Faltan datos");
      return res.status(400).json({ message: "Faltan datos" });
    }

    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      console.log("⚠️ [REGISTER] Usuario ya existe:", email);
      return res.status(400).json({ message: "El usuario ya existe" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hashedPassword });

    console.log("✅ [REGISTER] Usuario creado:", email);
    res.status(201).json({ 
      message: "Usuario registrado correctamente",
      user: {
        id: userExists?.id ?? null, // opcional: puedes devolver id del usuario creado
        name,
        email
      }
    });
  } catch (error) {
    console.error("❌ [REGISTER] Error en el registro:", error);
    res.status(500).json({ message: "Error en el registro", error });
  }
};


// ✅ LOGIN
export const login = async (req, res) => {
  console.log("📥 [LOGIN] Intento de login con:", req.body.email);
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      console.log("❌ [LOGIN] Usuario no encontrado:", email);
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("❌ [LOGIN] Contraseña incorrecta para:", email);
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    console.log("✅ [LOGIN] Login exitoso:", email, "Token:", token);

    res.json({ 
      token,
      user: {
        id: user.id,
        name: user.name, // <-- Aquí incluimos el nombre
        email: user.email,
      }
    });
  } catch (error) {
    console.error("❌ [LOGIN] Error:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// ✅ LOGOUT
export const logout = (req, res) => {
  console.log("🚪 [LOGOUT] Sesión cerrada");
  res.json({ message: "Sesión cerrada correctamente" });
};
