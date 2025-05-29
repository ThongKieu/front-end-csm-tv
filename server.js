import { createServer } from "https";
import { Server } from "socket.io";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const options = {
    key: fs.readFileSync(path.resolve(__dirname, '/etc/letsencrypt/live/csm.thoviet.net/privkey.pem')),
    cert: fs.readFileSync(path.resolve(__dirname, '/etc/letsencrypt/live/csm.thoviet.net/fullchain.pem'))
};

const httpsServer = createServer(options);

const io = new Server(httpsServer, {
    cors: {
        origin: ["https://csm.thoviet.net", "http://localhost:3000"],
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true
    },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    pingTimeout: 60000,
    pingInterval: 25000
});

// ... rest of your socket event handlers ...

// Use port 3000
httpsServer.listen(3000, () => {
    console.log("WebSocket server running on port 3000");
}); 