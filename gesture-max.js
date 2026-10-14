// Run inside Max's node.script; max-api is provided by Max, not npm.
const http = require('http');
const fs = require('fs');
const path = require('path');
const { parameters } = require('./gesture-control.cjs');

function start(maxAPI, port = 8765) {
  let lastFrame = 0, active = false;
  const silence = () => { maxAPI.outlet('gesture', 220, 0); active = false; };
  const server = http.createServer((req, res) => {
    if (req.method === 'GET' && ['/', '/gesture.html'].includes(req.url)) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
      res.end(fs.readFileSync(path.join(__dirname, 'gesture.html')));
      return;
    }
    if (req.method !== 'POST' || req.url !== '/frame') { res.writeHead(404); res.end(); return; }
    // Only the page served by this loopback bridge may send control messages.
    const address = server.address();
    if (req.headers.origin !== `http://127.0.0.1:${address.port}`) {
      res.writeHead(403); res.end(); return;
    }
    let body = '', oversized = false;
    req.on('data', data => {
      body += data;
      if (body.length > 2048) { oversized = true; req.destroy(); }
    });
    req.on('end', () => {
      if (oversized) return;
      try {
        const frame = JSON.parse(body);
        const [frequency, gain] = parameters(frame);
        maxAPI.outlet('gesture', frequency, gain);
        lastFrame = Date.now(); active = gain > 0;
        res.writeHead(204); res.end();
      } catch (_) { silence(); res.writeHead(400); res.end('Invalid frame'); }
    });
  });
  const watchdog = setInterval(() => {
    if (active && Date.now() - lastFrame > 500) silence();
  }, 100);
  server.on('close', () => clearInterval(watchdog));
  server.on('error', error => { silence(); maxAPI.post(`Gesture bridge: ${error.message}`); server.close(); });
  server.listen(port, '127.0.0.1', () => {
    silence();
    maxAPI.post(`Gesture bridge ready: http://127.0.0.1:${server.address().port}`);
  });
  return server;
}
module.exports = { start };
if (require.main === module) {
  const maxAPI = require('max-api');
  const server = start(maxAPI);
  maxAPI.addHandler('stop', () => { maxAPI.outlet('gesture', 220, 0); server.close(); });
}
