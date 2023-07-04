import { VercelRequest } from "@vercel/node";

import { getSuggestionMessage } from "../src/prompt";
import { makeCompletionStream } from "../src/openai";

export const config = {
  runtime: "edge",
};

export default async function handler(request: VercelRequest) {
  const { searchParams } = new URL(request.url!);
  const word = searchParams.get("word");

  const messages = getSuggestionMessage(word as string);
  const res = await makeCompletionStream(messages);

  return new Response(res.body as any);
}
