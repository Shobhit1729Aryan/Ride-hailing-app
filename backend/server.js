const http = require('http');
const app =require('./app');
const { initializeSocket } = require('./socket');
const port =process.env.PORT || 3000;

const server = http.createServer(app);

initializeSocket(server);
server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

// Handle EADDRINUSE gracefully by attempting the next port
server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        const altPort = Number(port) + 1;
        console.warn(`Port ${port} in use, trying ${altPort} instead.`);
        server.listen(altPort, () => console.log(`Server running on port ${altPort}`));
    } else {
        console.error('Server error:', err);
        process.exit(1);
    }
});