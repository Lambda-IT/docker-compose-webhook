import { FastifyRequest } from "fastify";

export type ComposeRequest = FastifyRequest<{
  Querystring: {
    file: string;
    path: string;
  };
}>;

export type ComposeRequestImage = FastifyRequest<{
  Querystring: {
    service: string;
    image: string;
  };
}>;

export type ComposeRequestUpdate = ComposeRequestImage & ComposeRequest;

export enum ComposeOperations {
  GET_SERVICES = "getServices",
  GET_CONFIG = "getConfig",
  UPDATE = "update",
  UP = "up",
  RESTART = "restart",
  DOWN = "down",
}

export interface Config {
  apiKey: string;
  enableGetconfig: boolean;
  enableBackups: boolean;
  host: string;
  port: number;
  url: string;
}
