interface message {
  role: string;
  content: string;
}

export async function makeCompletion(messages: message[]) {
  const url = "https://api.openai.com/v1/chat/completions";

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages,
    }),
  };

  const response = await fetch(url, requestOptions);
  const json = await response.json();

  const content = json.choices[0].message.content;

  return content;
}

export async function makeCompletionStream(messages: message[]) {
  const controller = new AbortController();

  setTimeout(() => {
    controller.abort();
  }, 10 * 60 * 1000);

  const url = "https://api.openai.com/v1/chat/completions";
  const fetchOptions: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    method: "POST",
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages,
      stream: true,
    }),
    signal: controller.signal,
  };

  return await fetch(url, fetchOptions);
}
