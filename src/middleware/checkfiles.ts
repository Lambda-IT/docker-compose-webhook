import { FastifyReply } from 'fastify';
import { access, constants } from 'fs/promises';
import path from 'path';
import logger from '../shared/helper/logger.js';
import { ComposeRequest, ComposeRequestUpdate } from '../shared/types.js';

export async function checkIfFileExists(
  request: ComposeRequest | ComposeRequestUpdate,
  reply: FastifyReply
) {
  const options = request.query;
  try {
    await access(path.join(options.path, options.file), constants.F_OK);
  } catch (err) {
    logger.error(
      { err, options },
      `Error on access [ ${path.join(options.path, options.file)} ] `
    );
    reply.code(500);
    reply.send({ status: 500, code: err.code, message: err.message });
  } finally {
    return;
  }
}
