const { Server } = require('socket.io');
const userModel = require('./models/user.model');
const captainModel = require('./models/captain.model');

let io;

function initializeSocket(server) {
  io = new Server(server, {
    cors: {
      origin: true,
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on('join', async (data) => {
      const { userId, userType } = data;

      if (userType === 'user') {
        await userModel.findByIdAndUpdate(userId, { socketId: socket.id });
        socket.join(`user_${userId}`);
        console.log(`User ${socket.id} joined user_${userId} room`);
      } 
      else if (userType === 'captain') {
        await captainModel.findByIdAndUpdate(userId, { socketId: socket.id });

        // ✅ FIX: captain joins captains room
        socket.join('captains');
        console.log(`Captain ${socket.id} joined captains room`);
      }
    });

    // join ride room
    socket.on('join-ride', ({ rideId }) => {
      socket.join(`ride_${rideId}`);
      console.log(`Socket ${socket.id} joined ride_${rideId}`);
    });

    // ride status updates
    socket.on('ride-status', ({ rideId, status }) => {
      io.to(`ride_${rideId}`).emit('ride-status-update', status);
    });

    socket.on('update-location-captain', async (data) => {
      const { userId, latitude, longitude, rideId } = data;

      if (!latitude || !longitude) return;

      await captainModel.findByIdAndUpdate(userId, {
        location: { ltd: latitude, lng: longitude }
      });

      if (rideId) {
        io.to(`ride_${rideId}`).emit('captain-location-update', {
          latitude,
          longitude
        });
      }
    });

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });
}

function sendMessageToSocketId(socketId, messageObject) {
  console.log(`sending message to ${socketId}:`, messageObject);

  if (!io) {
    console.error('Socket.io is not initialized.');
    return;
  }

  const socket = io.sockets.sockets.get(socketId);
  if (socket) {
    socket.emit(messageObject.event, messageObject.data);
  } else {
    console.error(`Socket with ID ${socketId} not found.`);
  }
}

function emitToRoom(room, event, data) {
  if (!io) {
    console.error('Socket.io is not initialized.');
    return;
  }
  io.to(room).emit(event, data);
}

function emitToUserRoom(userId, event, data) {
  if (!io) {
    console.error('Socket.io is not initialized.');
    return;
  }
  io.to(`user_${userId}`).emit(event, data);
}

module.exports = { initializeSocket, sendMessageToSocketId, emitToRoom, emitToUserRoom };
