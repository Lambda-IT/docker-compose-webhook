import { config } from "dotenv";
import logger from "./logger.js";
import { existsSync } from "fs";
import { Config } from "../types.js";

export function verifyConfiguration() {
  config();

  const logContext = { context: "configuration" };
  const dockerSock = "/var/run/docker.sock";
  const _config = getConfig();

  logger.info(logContext, `enableGetconfig: ${_config.enableGetconfig}`, [
    "configuration",
  ]);
  logger.info(logContext, `enableBackups: ${_config.enableBackups}`, [
    "configuration",
  ]);
  logger.info(logContext, `host: ${_config.host}`);
  logger.info(logContext, `port: ${_config.port}`);
  logger.info(logContext, `url: ${_config.url}`);

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
    logger.info(logContext, "API Key configuration provided");
  }

  _config.url
    ? logger.info(logContext, "URL configuration provided")
    : logger.warn(logContext, "URL configuration not provided");
}

export function getConfig(): Config {
  return {
    apiKey: process.env.API_KEY,
    enableGetconfig: getBooleanConfig(process.env.ENABLE_GET_CONFIG, false),
    enableBackups: getBooleanConfig(process.env.ENABLE_BACKUPS, true),
    host: process.env.HOST ?? "0.0.0.0",
    port: process.env.PORT ? +process.env.PORT : 8080,
    url: process.env.URL,
  };
}

function getBooleanConfig(env: any, defaultVal: boolean): boolean {
  if (env === undefined) return defaultVal;
  return JSON.parse(process.env.ENABLE_GET_CONFIG) ?? defaultVal;
}
