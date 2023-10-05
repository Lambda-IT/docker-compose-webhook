import fastify from "fastify";
import fastifyOpenapiDocs from "fastify-openapi-docs";
import closeWithGrace from "close-with-grace";

import {
  composeDown,
  composeRestart,
  composeUp,
  getDockerComposeConfig,
  getDockerComposeServices,
  updateDockerCompose,
} from "./routes/compose.routes.js";
import { verifyApiKey } from "./middleware/apikey.auth.js";
import composeSchema from "./schema/compose.schema.js";
import composeUpdateSchema from "./schema/compose-update.schema.js";
import {
  getConfig,
  verifyConfiguration,
} from "./shared/helper/verify-configuration.js";
import logger from "./shared/helper/logger.js";
import { checkIfFileExists } from "./middleware/checkfiles.js";
import { apiDocsDescription } from "./shared/api-docs.js";
import path from "path";
import { fileURLToPath } from "url";
import { readFile } from "fs/promises";

verifyConfiguration();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = fastify();
await server.register(fastifyOpenapiDocs, apiDocsDescription);
await server.register(import("@fastify/static"), {
  root: path.join(__dirname, "public"),
  wildcard: true,
});

server.get("/docs", async (req, reply) => {
  const b = await readFile(path.join(__dirname, "public", "docs.html"));
  reply.header("Content-Type", "text/html").send(b.toString());
});

server.get("/", async (req, reply) => {
  const { host, port, enableBackups, enableGetconfig, url, apiKey } =
    getConfig();
  return {
    message: "docker-compose-webhook",
    host,
    port,
    enabledBackups: enableBackups,
    enabledConfigEndpoint: enableGetconfig,
    enabledSecurity: apiKey ? true : false,
    url,
    docs: `${url}/docs`,
    openapi: `${url}/openapi/openapi.json`,
  };
});

server.get("/ping", async (req, reply) => {
  return "pong\n";
});

server.get(
  "/compose/services",
  { schema: composeSchema, preHandler: [verifyApiKey, checkIfFileExists] },
  getDockerComposeServices
);

server.get(
  "/compose/config",
  { schema: composeSchema, preHandler: [verifyApiKey, checkIfFileExists] },
  getDockerComposeConfig
);

server.post(
  "/compose/update",
  {
    schema: composeUpdateSchema,
    preHandler: [verifyApiKey, checkIfFileExists],
  },
  updateDockerCompose
);
server.post(
  "/compose/up",
  { schema: composeSchema, preHandler: [verifyApiKey, checkIfFileExists] },
  composeUp
);
server.post(
  "/compose/restart",
  { schema: composeSchema, preHandler: [verifyApiKey, checkIfFileExists] },
  composeRestart
);
server.post(
  "/compose/down",
  { schema: composeSchema, preHandler: [verifyApiKey, checkIfFileExists] },
  composeDown
);

const config = getConfig();
server.listen({ port: config.port, host: config.host }, (err, address) => {
  if (err) {
    logger.error(err);
    process.exit(1);
  }
  logger.info(`Server listening at ${address}`);
});

closeWithGrace({ delay: 500 }, async function ({ signal, err, manual }) {
  logger.info(signal);
  if (err) {
    logger.error(err);
  }
  await server.close();
});
