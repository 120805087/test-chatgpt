import { VercelRequest } from "@vercel/node";
import { getOptionMessages } from "../src/prompt";
import { makeCompletion } from "../src/openai";

export const config = {
  runtime: "edge",
};

export default async function handler(request: VercelRequest) {
  const { searchParams } = new URL(request.url!);
  const word = searchParams.get("word");

  const messages = getOptionMessages(word as string);
  const completion = await makeCompletion(messages);

  return new Response(completion);
}
