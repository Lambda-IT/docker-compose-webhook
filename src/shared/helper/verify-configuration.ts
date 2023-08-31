import { config } from "dotenv";
import logger from "./logger.js";
import { existsSync } from "fs";
import { Config } from "../types.js";

export function verifyConfiguration() {
  config();
  const dockerSock = "/var/run/docker.sock";
  const _config = getConfig();

  try {
    existsSync(dockerSock);
  } catch (err) {
    throw new Error(`Docker socket not found at ${dockerSock}`);
  }

  if (!_config.apiKey) {
    throw new Error(
      "No API Key configuration provided, please set 'API_KEY' environment variable"
    );
  } else {
    logger.info("API Key configuration provided");
  }

  _config.url
    ? logger.info("URL configuration provided")
    : logger.warn("URL configuration not provided");
}

export function getConfig(): Config {
  return {
    apiKey: process.env.API_KEY,
    enableGetconfig: JSON.parse(process.env.ENABLE_GET_CONFIG) ?? false,
    enableBackups: JSON.parse(process.env.ENABLE_BACKUPS) ?? true,
    host: process.env.HOST ?? "0.0.0.0",
    port: +process.env.PORT ?? 8080,
    url: process.env.URL,
  };
}
