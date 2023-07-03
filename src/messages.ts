import { SupabaseVectorStore } from "langchain/vectorstores/supabase";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { createClient } from "@supabase/supabase-js";

// prompt
export const getMessages = (question: string, context: string) => [
  {
    role: "system",
    content:
      "你是一个AI助手，你需要根据用户的提问以及提供的背景信息来回答用户的问题，请用中文做出回应并尽可能提供有用的信息",
  },
  {
    role: "assistant",
    content: "背景信息: " + context,
  },
  {
    role: "user",
    content: question,
  },
];

// First, follow set-up instructions at
// https://js.langchain.com/docs/modules/indexes/vector_stores/integrations/supabase

const privateKey = process.env.SUPABASE_PRIVATE_KEY;
if (!privateKey) throw new Error(`Expected env var SUPABASE_PRIVATE_KEY`);

const url = process.env.SUPABASE_URL;
if (!url) throw new Error(`Expected env var SUPABASE_URL`);

export const askCustomerServiceMessages = async (question: string) => {
  const client = createClient(url, privateKey, {
    auth: { persistSession: false },
  });

  const vectorStore = await SupabaseVectorStore.fromTexts(
    [],
    [],
    new OpenAIEmbeddings(),
    {
      client,
      tableName: "documents",
      queryName: "match_documents",
    }
  );

  const context = await vectorStore.similaritySearch(question, 1);
  const contextString = context[0].pageContent;
  const messages = getMessages(question, contextString);

  return messages;
};
