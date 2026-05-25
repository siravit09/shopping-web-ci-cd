const http = require("http");
const fs = require("fs");
const path = require("path");

const publicDir = __dirname;
const port = Number(process.env.PORT || 3000);
const host = process.env.HOST || "127.0.0.1";

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml"
};

function resolveRequestPath(urlPath) {
  const safePath = path.normalize(decodeURIComponent(urlPath)).replace(/^(\.\.[/\\])+/, "");
  const requestedPath = safePath === "/" ? "/index.html" : safePath;
  return path.join(publicDir, requestedPath);
}

const server = http.createServer((req, res) => {
  if (!req.url || !["GET", "HEAD"].includes(req.method)) {
    res.writeHead(405, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Method not allowed");
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  const filePath = resolveRequestPath(url.pathname);

  if (!filePath.startsWith(publicDir)) {
    res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (error, content) => {
    if (error) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Not found");
      return;
    }

    const extension = path.extname(filePath).toLowerCase();
    res.writeHead(200, {
      "Content-Type": contentTypes[extension] || "application/octet-stream",
      "Cache-Control": "no-store"
    });
    res.end(req.method === "HEAD" ? undefined : content);
  });
});

server.listen(port, host, () => {
  console.log(`Simple shop app is running at http://${host}:${port}`);
});
