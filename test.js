const { fetchEventSource } = require("@fortaine/fetch-event-source");
const url =
  "https://chatgpt-english.vercel.app/api/helper?question=你好&stream=true";

async function run() {
  let responseText = "";
  let finished = false;
  const controller = new AbortController();

  const finish = () => {
    finished = true;
  };

  controller.signal.onabort = finish;

  const requestTimeoutId = setTimeout(() => controller.abort(), 60 * 1000);

  await fetchEventSource(url, {
    async onopen(res) {
      clearTimeout(requestTimeoutId);
      const contentType = res.headers.get("content-type");

      if (contentType?.startsWith("text/plain")) {
        responseText = await res.clone().text();
        return finish();
      }
    },
    onmessage(msg) {
      if (msg.data === "[DONE]" || finished) {
        return finish();
      }

      const text = msg.data;
      try {
        const json = JSON.parse(text);
        const delta = json.choices[0].delta.content;
        if (delta) {
          responseText += delta;
        }

        console.log(responseText);
      } catch (e) {
        console.error("[Request] parse error", text, msg);
      }
    },
  });

  return responseText;
}

run();
