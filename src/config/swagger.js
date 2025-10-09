const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Mi API",
            version: "1.0.0",
            description: "Documentación de mi API con Swagger",
        },
        servers: [{
            url: "http://localhost:4000",
        }, ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
    },
    apis: ["./src/routes/*.js"],
};
const specs = swaggerJsdoc(options);

function swaggerDocs(app) {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
    console.log("Swagger disponible en http://localhost:4000/api-docs");
}

module.exports = swaggerDocs;