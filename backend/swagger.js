import swaggerJsdoc from "swagger-jsdoc";

// Swagger definition
const swaggerDefinition = {
  openapi: "3.0.0", // You can also use "swagger": "2.0"
  info: {
    title: "Your API Title",
    version: "1.0.0",
    description: "API documentation for your application",
  },
  servers: [
    {
      url: "http://localhost:3000", // Change this to your server URL
      description: "Development server",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
};

// Swagger options
const options = {
  swaggerDefinition,
  apis: ["./routes/*.js"], // Path to your API routes
};

// Initialize swagger-jsdoc
const swaggerSpecs = swaggerJsdoc(options);

export default swaggerSpecs;
