import { FastifyReply, FastifyRequest } from "fastify";
import { getConfig } from "../shared/helper/verify-configuration";

export async function verifyApiKey(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const apiKey = request.headers["x-api-key"];
  if (!apiKey || apiKey !== getConfig().apiKey) {
    reply.code(401);
    if (!apiKey)
      reply.send({ status: 401, message: "Unauthorized, no API Key provided" });
    reply.send({ status: 401, message: "Unauthorized, API Key not valid" });
  }
  return;
}
