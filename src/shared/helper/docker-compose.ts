import * as path from "path";
import * as compose from "docker-compose/dist/v2.js";
import YAML from "yaml";
import { copyFile, writeFile } from "fs/promises";

import logger from "./logger.js";
import { getConfig } from "./verify-configuration.js";

const config = getConfig();

export async function updateComposeFile(
  options: compose.IDockerComposeOptions,
  args: {
    service: string;
    image: string;
  }
) {
  const config = await compose.config(options);
  const editedImage = manipulateImage(config.data, args.service, args.image);
  await updateDockerComposeYaml(
    path.join(options.cwd, options.config as string),
    editedImage,
    args.service
  );
  logger.info(
    `Updated successfully ${options.config}. Set service '${args.service}' to '${args.image}'`
  );
}

export async function pullServiceImage(
  options: compose.IDockerComposeOptions,
  args: { service: string; image: string }
) {
  logger.info(`Start pulling ${args.image}`);
  await compose.pullOne(args.service, options);
  logger.info(`Pulled successfully ${args.image}`);
}

function manipulateImage(
  composeContent: compose.DockerComposeConfigResult,
  serviceName: string,
  image: string
): compose.DockerComposeConfigResult {
  const services = { ...composeContent.config.services } as Record<
    string,
    Record<string, string>
  >;

  services[serviceName].image = image;

  return {
    ...composeContent,
    config: {
      ...composeContent.config,
      services,
    },
  };
}

async function updateDockerComposeYaml(
  filePath: string,
  content: compose.DockerComposeConfigResult,
  editedService?: string
) {
  const composeContent = {
    version: "3.3",
    services: content.config.services,
    networks: (content.config as any).networks || {}, // type error in docker-compose
    volumes: content.config?.volumes || {},
  };

  const result = YAML.stringify(composeContent);
  if (config.enableBackups) await createBakFile(filePath, editedService);
  await writeFile(filePath, result);
}

async function createBakFile(filePath: string, service: string = "") {
  const bakFilePath = `${filePath}${service ? "_" + service : ""}.bak`;
  await copyFile(filePath, bakFilePath);
}
