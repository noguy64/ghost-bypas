const express = require('express');
const path = require('path');
import { spawn } from 'child_process';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();
const PORT = process.env.PORT || 18000;

// Bare Server
const bareServerProcess = spawn(
  'npx',
  ['--yes', '@tomphttp/bare-server-node', '--port', '8080', '--host', 'localhost'],
  {
      stdio: 'inherit',
      shell: true
  }
);

app.use('/bare/', createProxyMiddleware({
  target: 'http://localhost:8080',
  changeOrigin: true,
  pathRewrite: { '^/bare/': '/' }
}));


// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Define a route to serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
