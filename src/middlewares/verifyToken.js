import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
  console.log("🛡️ Middleware verifyToken ejecutado");

  const authHeader = req.headers["authorization"];
  console.log("📥 Header Authorization recibido:", authHeader);

  // Verificar si hay token
  if (!authHeader) {
    console.log("❌ No se encontró token en los headers");
    return res.status(401).json({ message: "Token requerido" });
  }

  const token = authHeader.split(" ")[1];
  console.log("✅ Token extraído:", token);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Token válido. Usuario decodificado:", decoded);

    req.user = decoded;
    next();
  } catch (error) {
    console.error("❌ Error al verificar token:", error.message);
    return res.status(403).json({ message: "Token inválido o expirado" });
  }
};

export default verifyToken;
