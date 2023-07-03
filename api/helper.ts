import { pipeline } from "node:stream";
import { promisify } from "node:util";
import { VercelRequest, VercelResponse } from "@vercel/node";

import { makeCompletionStream, makeCompletion } from "../src/openai";
import { askCustomerServiceMessages } from "../src/messages";

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  const { question, stream } = request.query;

  const messages = await askCustomerServiceMessages(question as string);

  if (!!stream) {
    const res = await makeCompletionStream(messages);

    const streamPipeline = promisify(pipeline);

    return await streamPipeline(res.body as any, response);
  }

  const content = await makeCompletion(messages);

  return response.send(content);
}
