const rideService = require('../services/ride.service');
const { validationResult } = require('express-validator');
const mapService = require('../services/maps.service');
const { sendMessageToSocketId, emitToRoom, emitToUserRoom } = require('../socket');
const rideModel = require('../models/ride.model');

module.exports.createRide = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { pickup, destination, vehicleType } = req.body;

  try {
    console.log('🚕 CREATE RIDE HIT – notifying captains');

    const ride = await rideService.createRide({
      user: req.user._id,
      pickup,
      destination,
      vehicleType
    });

    res.status(201).json(ride);

    const pickupCoordinates = await mapService.getAddressCoordinate(pickup);
    console.log("Pickup Coordinates:", pickupCoordinates);

    const captainInRadius = await mapService.getCaptainsInTheRadius(
  pickupCoordinates.ltd,
  pickupCoordinates.lng,
  2000
);


 
    const rideWithUser = await rideModel.findOne({ _id: ride._id }).populate('user');

    // Broadcast to captains room (ensures connected captains receive the ride notice)
    try {
      emitToRoom('captains', 'new-ride', rideWithUser);
    } catch (e) {
      console.error('emitToRoom failed:', e);
    }

    // Also attempt per-captain sends for those in radius
    captainInRadius.forEach(captain => {
      if (!captain.socketId) {
        console.log(`Captain ${captain._id} has no socketId`);
        return;
      }

      sendMessageToSocketId(captain.socketId, {
        event: 'new-ride',
        data: rideWithUser
      });
    });

  } catch (err) {
    // If we've already sent a response to the client (headers sent), just log the error
    if (res.headersSent) {
      console.error('Error after response sent in createRide:', err);
      return;
    }

    return res.status(500).json({ message: err.message });
  }
};

module.exports.getFare = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { pickup, destination } = req.query;

  try {
    const fare = await rideService.getFare(pickup, destination);
    return res.status(200).json(fare);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

 module.exports.confirmRide = async (req, res) => {
  console.log('🟡 confirmRide HIT');
  console.log('🟡 req.body:', req.body);
  console.log('🟡 req.captain:', req.captain);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { rideId } = req.body;
console.log('🟡 rideId received:', rideId);
  try {
    const ride = await rideService.confirmRide(
      rideId,
      req.captain._id
    );
console.log('🟢 Ride confirmed in service:', ride);
    // 🔥 REQUIRED: populate user and captain to get socketIds and captain details
    const rideWithUser = await rideModel
      .findById(ride._id)
      .select('+otp')
      .populate('user')
      .populate({ path: 'captain', select: 'fullname vehicle socketId' });
console.log('🟢 rideWithUser populated:', rideWithUser);
    if (rideWithUser?.user?.socketId) {
      console.log(
      '🟡 Emitting ride-confirmed to user socket:',
      rideWithUser?.user?.socketId
    );
    console.log('📤 EMITTING ride-confirmed TO USER');
console.log('📤 USER SOCKET ID:', rideWithUser.user.socketId);
console.log('📤 OTP BEING SENT:', rideWithUser.otp);

      sendMessageToSocketId(rideWithUser.user.socketId, {
        event: 'ride-confirmed',
        data: rideWithUser
      });
    } else {
      console.log('User socketId not found for ride:', ride._id);
    }

    // Also emit to the user's room as a fallback (if they're connected but socketId mismatch)
    try {
      console.log(
      '🟡 Emitting ride-confirmed to user socket:',
      rideWithUser?.user?.socketId
    );
    
      emitToRoom(`user_${rideWithUser.user._id}`, 'ride-confirmed', rideWithUser);
      console.log('✅ ride-started emitted to room:', `user_${ride.user._id}`);

    } catch (e) {
      // best-effort - log and continue
      console.error('emit to user room failed:', e);
    }

    return res.status(200).json(rideWithUser);

  } catch (err) {
    console.error('🔥 ERROR in confirmRide:', err);
    return res.status(500).json({ message: err.message });
  }
};
module.exports.startRide = async (req, res) => {
  try {
    console.log('🟢 startRide HIT');
    console.log('🟢 rideId:', req.query.rideId);
    console.log('🟢 otp:', req.query.otp);

    const { rideId, otp } = req.query;

    const ride = await rideModel
      .findById(rideId)
      .select('+otp')
      .populate('user')
      .populate({ path: 'captain', select: 'socketId fullname vehicle' });
console.log('🟢 Ride fetched:', ride?._id);
    console.log('🟢 Ride OTP in DB:', ride?.otp);
    console.log('🟢 User socketId:', ride?.user?.socketId);
    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }

    if (ride.otp !== otp) {
        console.log('❌ OTP mismatch');
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    ride.status = 'ongoing';
    await ride.save();
    console.log('📤 EMITTING ride-started TO USER ROOM:', `user_${ride.user._id}`);

    // 🔥 notify USER
    emitToRoom(`user_${ride.user._id}`, 'ride-started', ride);


    console.log('✅ ride-started EMITTED SUCCESSFULLY');

    // 🔥 notify CAPTAIN
    if (ride.captain?.socketId) {
      sendMessageToSocketId(ride.captain.socketId, {
        event: 'ride-started',
        data: ride,
      });
    }

    console.log('🚗 ride-started EMITTED TO USER & CAPTAIN');

    return res.status(200).json(ride);
  } catch (err) {
     console.error('🔥 startRide ERROR:', err);
    return res.status(500).json({ message: err.message });
  }
};
module.exports.endRide=async(req,res)=>{
 const errors = validationResult(req);
 if (!errors.isEmpty()) {
   return res.status(400).json({ errors: errors.array() });
 }
const { rideId } = req.body;
 try {
   const ride = await rideService.endRide({rideId,captain: req.captain });

sendMessageToSocketId(ride.user.socketId, {
     event: 'ride-ended',
     data: ride,
   });

   return res.status(200).json(ride);
 } catch (error) {
   console.error('🔥 ERROR in endRide:', error);
   return res.status(500).json({ message: error.message });
 }
}

