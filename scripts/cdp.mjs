export async function connect() {
  const pages = await (await fetch("http://127.0.0.1:9223/json")).json();
  const ws = new WebSocket(
    pages.find((p) => p.type === "page").webSocketDebuggerUrl,
  );
  const pending = new Map();
  const listeners = [];
  let id = 0;
  ws.onmessage = (e) => {
    const message = JSON.parse(e.data);
    if (message.id) {
      const promise = pending.get(message.id);
      pending.delete(message.id);
      if (message.error)
        promise?.reject(new Error(JSON.stringify(message.error)));
      else promise?.resolve(message.result);
    } else listeners.forEach((fn) => fn(message));
  };
  await new Promise((resolve) => (ws.onopen = resolve));
  const send = (method, params = {}) =>
    new Promise((resolve, reject) => {
      const next = ++id;
      pending.set(next, { resolve, reject });
      ws.send(JSON.stringify({ id: next, method, params }));
    });
  const evaluate = async (expression) => {
    const response = await send("Runtime.evaluate", {
      expression,
      returnByValue: true,
      awaitPromise: true,
    });
    if (response.exceptionDetails)
      throw new Error(
        response.exceptionDetails.exception?.description ||
          response.exceptionDetails.text,
      );
    return response.result.value;
  };
  await send("Page.enable");
  await send("Runtime.enable");
  await send("Network.enable");
  await send("Network.setBlockedURLs", {
    urls: [
      "*google-analytics.com*",
      "*googletagmanager.com*",
      "*facebook.com/tr*",
      "*connect.facebook.net*",
      "*clarity.ms*",
      "*api.sansahospital.com*",
      "*formsubmit.co*",
    ],
  });
  return {
    send,
    evaluate,
    on: (fn) => listeners.push(fn),
    close: () => ws.close(),
  };
}
export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
export async function navigate(client, url) {
  await client.send("Page.navigate", { url });
  for (let i = 0; i < 100; i++) {
    await delay(100);
    if (await client.evaluate('!!document.querySelector("main h1")')) return;
  }
  throw new Error("Page did not render: " + url);
}
