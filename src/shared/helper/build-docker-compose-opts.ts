import { IDockerComposeOptions } from "docker-compose";
import { ComposeRequest, ComposeRequestUpdate } from "../types.js";

export function buildDockerComposeOptions(
  req: ComposeRequest | ComposeRequestUpdate
): IDockerComposeOptions {
  const { path, file } = req.query;

  const options = {
    cwd: path,
    config: file,
  };

  return options;
}
