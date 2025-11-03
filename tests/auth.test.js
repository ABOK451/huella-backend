import request from "supertest";
import app from "../src/app.js";
import { User } from "../src/models/user.model.js";

describe("Auth API", () => {

  beforeAll(async () => {
    // Limpia base de datos antes de pruebas
    await User.destroy({ where: {} });
  });

  test("✅ Debe registrar un usuario", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Alan",
        email: "alan@test.com",
        password: "123456"
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("message", "Usuario registrado correctamente");
  });

  test("⚠️ No debe permitir registrar un usuario existente", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Alan",
        email: "alan@test.com",
        password: "123456"
      });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("message", "El usuario ya existe");
  });

  test("✅ Debe iniciar sesión correctamente", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "alan@test.com",
        password: "123456"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(res.body.user.email).toBe("alan@test.com");
  });

  test("❌ No debe iniciar sesión si la contraseña es incorrecta", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "alan@test.com",
        password: "wrongpass"
      });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("message", "Credenciales inválidas");
  });
});
