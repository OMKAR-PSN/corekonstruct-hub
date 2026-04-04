/* CORE KONSTRUCT - server.js
   Simple Node.js HTTP server
   Run: node server.js
   Then open: http://localhost:3000 */

const http = require('http');
const fs   = require('fs');
const path = require('path');

const PORT     = process.env.PORT || 3000;
const ROOT_DIR = __dirname;

const MIME = {
    '.html': 'text/html; charset=utf-8',
    '.css':  'text/css',
    '.js':   'application/javascript',
    '.json': 'application/json',
    '.png':  'image/png',
    '.jpg':  'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif':  'image/gif',
    '.svg':  'image/svg+xml',
    '.ico':  'image/x-icon',
    '.webp': 'image/webp',
};

const server = http.createServer((req, res) => {
    let filePath = path.join(ROOT_DIR, req.url === '/' ? 'index.html' : req.url);
    filePath = filePath.split('?')[0];
    if (!path.extname(filePath)) {
          filePath = path.join(ROOT_DIR, 'index.html');
    }
    const ext      = path.extname(filePath).toLowerCase();
    const mimeType = MIME[ext] || 'application/octet-stream';
    fs.readFile(filePath, (err, data) => {
          if (err) {
                  if (err.code === 'ENOENT') {
                            fs.readFile(path.join(ROOT_DIR, 'index.html'), (e2, d2) => {
                                        if (e2) { res.writeHead(500); res.end('Server Error'); return; }
                                        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                                        res.end(d2);
                            });
                  } else {
                            res.writeHead(500);
                            res.end('Internal Server Error');
                  }
                  return;
          }
          res.writeHead(200, { 'Content-Type': mimeType });
          res.end(data);
    });
});

server.listen(PORT, () => {
    console.log(`\n  OK: Core Konstruct Server running`);
    console.log(`  Open: http://localhost:${PORT}\n`);
});
