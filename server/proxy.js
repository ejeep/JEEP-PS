const http = require('http');
const httpProxy = require('http-proxy');

// Replace with your HTTPS URL from ngrok or LocalTunnel
const target = 'https://c1bb-110-54-154-44.ngrok-free.app';

// Create a new proxy server
const proxy = httpProxy.createProxyServer({ target, changeOrigin: true });

// Create an HTTP server to listen for incoming requests on port 8080
const server = http.createServer((req, res) => {
  proxy.web(req, res, { target });
});

// Start the HTTP server on port 8080
server.listen(8080, () => {
  console.log('HTTP Proxy running on http://localhost:8080');
});
