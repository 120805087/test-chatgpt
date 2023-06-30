import { pipeline } from "node:stream";
import { promisify } from "node:util";
import { VercelRequest, VercelResponse } from "@vercel/node";

import { getSuggestionMessage } from "../src/prompt";
import { makeCompletionStream } from "../src/openai";

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  const { word } = request.query;

  const messages = getSuggestionMessage(word as string);
  const res = await makeCompletionStream(messages);

  const streamPipeline = promisify(pipeline);

  return await streamPipeline(res.body as any, response);
}
