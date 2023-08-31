import { getConfig } from "./helper/verify-configuration";

const config = getConfig();

export const apiDocsDescription = {
  openapi: {
    openapi: "3.0.3",
    info: {
      title: "Docker Compose Webhook",
      description:
        "Webservice to update and restart Docker Compose files and services.",
      contact: {
        name: "Lambda IT",
        url: "https://lambda-it.ch",
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
        description: "Configured URL",
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
