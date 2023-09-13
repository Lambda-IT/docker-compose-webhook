import { IDockerComposeResult } from 'docker-compose/dist/v2.js';
import { FastifyReply } from 'fastify';
import logger from './logger.js';
import { ComposeOperations } from '../types.js';

export function composeErrorHandler(
  reply: FastifyReply,
  result: IDockerComposeResult,
  operation: ComposeOperations
) {
  if (result.exitCode > 0) {
    logger.error({ result, operation }, 'Error in composeErrorHandler');
    reply.code(500);
    return;
  } else {
    logger.info(`operation '${operation}' successful`);
  }
  return;
}

export function apiErrorHandler(reply: FastifyReply, err: any, customMsg = '') {
  logger.error(err, ` ${customMsg}`);
  reply.code(500);
  reply.send({
    status: 500,
    code: err.code,
    message: `${err.message}${customMsg}`,
  });
}
