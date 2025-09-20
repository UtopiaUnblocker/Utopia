import express from 'express';
import { createServer } from 'node:http';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const app = express();
const server = createServer(app);

// Serve files in public/
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use(express.static(join(__dirname, 'public')));

// Fallback to index.html
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'public', 'index.html'));
});

server.listen(process.env.PORT || 3000, () => {
  console.log('Server running...');
});
