import express, { Request, Response } from 'express';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const port = process.env.PORT || 3000;

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*", // Cambia con il tuo dominio in produzione
    }
});

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

app.get('/', (req: Request, res: Response) => {
    res.send('Hello, TypeScript with Node.js and Socket.IO!');
});

io.on('connection', (socket) => {
    console.log('Un dispositivo si è connesso:', socket.id);

    socket.on('sendLocation', (data) => {
        console.log(`Posizione ricevuta da ${data.id} (${data.name}):`, data.location);

        socket.broadcast.emit('receiveLocation', {
            id: data.id,
            name: data.name,
            location: data.location
        });
    });

    // Gestione della disconnessione
    socket.on('disconnect', () => {
        console.log('Un dispositivo si è disconnesso:', socket.id);
    });
});

server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
