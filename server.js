import express from 'express';
import path from 'path';
import axios from 'axios';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';
import { createProxyMiddleware } from 'http-proxy-middleware'


const app = express();
const PORT = process.env.PORT || 9853;

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

// Static files setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});



app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
