import { VercelRequest, VercelResponse } from "@vercel/node";
import { getOptionMessages } from "../src/prompt";
import { makeCompletion } from "../src/openai";

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  const { word } = request.query;

  const messages = getOptionMessages(word as string);
  const content = await makeCompletion(messages);

  return response.send(content);
}
