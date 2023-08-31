import * as compose from "docker-compose/dist/v2.js";
import { buildDockerComposeOptions } from "../shared/helper/build-docker-compose-opts.js";
import {
  ComposeOperations,
  ComposeRequest,
  ComposeRequestUpdate,
} from "../shared/types.js";
import {
  updateComposeFile,
  pullServiceImage,
} from "../shared/helper/docker-compose.js";
import {
  apiErrorHandler,
  composeErrorHandler,
} from "../shared/helper/error-handler.js";
import { getConfig } from "../shared/helper/verify-configuration.js";

export const getDockerComposeServices = async (
  request: ComposeRequest,
  reply
) => {
  const options = buildDockerComposeOptions(request);
  const result = await compose.configServices(options);

  composeErrorHandler(reply, result, ComposeOperations.GET_SERVICES);
  return result.data.services || result.err;
};

export const getDockerComposeConfig = async (
  request: ComposeRequest,
  reply
) => {
  const options = buildDockerComposeOptions(request);
  if (getConfig().enableGetconfig) {
    const result = await compose.config(options);

    composeErrorHandler(reply, result, ComposeOperations.GET_CONFIG);
    return result.data.config || result.err;
  } else {
    reply.code(403);
    return {
      status: 403,
      code: "GETCONFIG_DISABLED",
      message: "ENABLED_GET_CONFIG is disabled",
    };
  }
};

export const updateDockerCompose = async (
  request: ComposeRequestUpdate,
  reply
) => {
  const options = buildDockerComposeOptions(request);
  const { service, image } = request.query;

  try {
    await updateComposeFile(options, { service, image });
    await pullServiceImage(options, { service, image });
  } catch (err) {
    apiErrorHandler(
      reply,
      err,
      ". Check if you have set a valid service name or credentials."
    );
  } finally {
    const result = await compose.config(options);
    composeErrorHandler(reply, result, ComposeOperations.UPDATE);
    return result.data.config || result.err;
  }
};

export const composeUp = async (request: ComposeRequest, reply) => {
  const options = buildDockerComposeOptions(request);
  let result;

  try {
    await compose.pullAll(options);
    result = await compose.upAll(options);
  } catch (err) {
    apiErrorHandler(reply, err);
  } finally {
    composeErrorHandler(reply, result, ComposeOperations.UP);
    const restartedItems = (result.out || result.err)
      .split("\n")
      .map((i) => i.replace("  ", " ").trim())
      .filter((i) => i);
    return { status: "ok", statusText: restartedItems };
  }
};

export const composeRestart = async (request: ComposeRequest, reply) => {
  const options = buildDockerComposeOptions(request);
  const result = await compose.restartAll(options);

  composeErrorHandler(reply, result, ComposeOperations.RESTART);
  return result.out || result.err;
};

export const composeDown = async (request: ComposeRequest, reply) => {
  const options = buildDockerComposeOptions(request);
  const result = await compose.down(options);

  composeErrorHandler(reply, result, ComposeOperations.DOWN);
  return result.out || result.err;
};
