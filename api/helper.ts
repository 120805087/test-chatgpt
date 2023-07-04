import { VercelRequest } from "@vercel/node";

import { makeCompletionStream, makeCompletion } from "../src/openai";
import { askCustomerServiceMessages } from "../src/messages";

// 使用边缘函数，无法使用的 nodejs 的一些的API
// 支持的API https://vercel.com/docs/concepts/functions/edge-functions/edge-runtime#supported-apis
export const config = {
  runtime: "edge",
};

export default async function handler(request: VercelRequest) {
  const { searchParams } = new URL(request.url!);
  const question = searchParams.get("question");
  const stream = searchParams.get("stream");

  const messages = await askCustomerServiceMessages(question as string);

  if (!!stream) {
    const res = await makeCompletionStream(messages);

    return new Response(res.body as any, {
      headers: {
        "Content-Type": "text/event-stream",
      },
    });
  }

  const completion = await makeCompletion(messages);

  return new Response(completion);
}
