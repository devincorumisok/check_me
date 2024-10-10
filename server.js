// server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server); // Initialize Socket.IO

const PORT = process.env.PORT || 3000;

// Password for access to the reset page
const RESET_PASSWORD = '711812'; // Change this to a secure password

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Serve the reset page
app.get('/reset', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'reset.html'));
});

// Listen for client connections
io.on('connection', (socket) => {
    console.log('A user connected');

    // Listen for checkbox updates from clients
    socket.on('checkboxUpdate', (data) => {
        // Broadcast the update to all clients
        socket.broadcast.emit('updateCheckbox', data);
    });

    // Listen for reset requests from the reset page
    socket.on('resetCheckboxes', () => {
        // Reset all checkboxes by emitting to all clients
        for (let i = 0; i < 5000; i++) {
            socket.broadcast.emit('updateCheckbox', { id: `checkbox-${i}`, checked: false });
        }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

// Start the server
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
