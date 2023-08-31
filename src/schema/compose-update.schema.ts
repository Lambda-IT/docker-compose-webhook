import composeSchema from "./compose.schema.js";

export default {
  ...composeSchema,
  querystring: {
    ...composeSchema.querystring,
    image: { type: "string" },
    service: { type: "string" },
  },
};
