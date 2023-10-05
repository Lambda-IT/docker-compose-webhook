import { getConfig } from "./helper/verify-configuration.js";

const config = getConfig();

export const apiDocsDescription = {
  skipUI: true,
  prefix: "/openapi",
  openapi: {
    openapi: "3.0.3",
    info: {
      title: "Docker Compose Webhook",
      description:
        "Webservice to update and restart Docker Compose files and services.",
      contact: {
        name: "Lambda IT",
        url: "https://github.com/Lambda-IT/docker-compose-webhook",
      },
      license: {
        name: "MIT",
        url: `https://choosealicense.com/licenses/mit/`,
      },
      version: "1.0.0",
    },
    servers: [
      {
        url: config.host || `http://localhost:${config.port}`,
        description: `Configured URL: ${
          config.host || "http://localhost:" + config.port
        }`,
      },
    ],
    // tags: [{ name: "service", description: "Service" }],
    components: {
      securitySchemes: {
        "API Key Auth": {
          type: "apiKey",
          in: "header",
          name: "X-API-KEY",
        },
      },
    },
    security: [{ "API Key Auth": [] }],
  },
};
