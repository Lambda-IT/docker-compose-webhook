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

verifyConfiguration();

const server = fastify();
await server.register(fastifyOpenapiDocs, apiDocsDescription);

server.get("/ping", async (request, reply) => {
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
