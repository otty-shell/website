import { createServer } from "node:http";

export async function withReleaseApi(controlledResponse, callback) {
  const requests = [];
  const server = createServer((request, response) => {
    requests.push(request);
    response.writeHead(controlledResponse.status ?? 200, {
      "content-type": "application/json",
      ...controlledResponse.headers,
    });
    response.end(controlledResponse.body);
  });

  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();

  try {
    return await callback({
      apiUrl: `http://127.0.0.1:${address.port}/repos/otty-shell/otty/releases/latest`,
      requests,
    });
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
}
