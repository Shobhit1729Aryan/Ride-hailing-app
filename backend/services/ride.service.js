const rideModel = require('../models/ride.model');
const mapService = require('../services/maps.service');
const crypto = require('crypto');

async function getFare(pickup, destination) {
  if (!pickup || !destination) {
    throw new Error('All fields are required');
  }

  // maps service should return something like { distance: "12 km", time: "32 mins" }
  const distanceTime = await mapService.getDistanceTime(pickup, destination);

  // normalize possible keys
  const distanceText =
    distanceTime?.distance ||
    distanceTime?.distanceText ||
    distanceTime?.distance_text ||
    '';
  const timeText =
    distanceTime?.time ||
    distanceTime?.duration ||
    distanceTime?.timeText ||
    distanceTime?.duration_text ||
    '';

  // extract numbers robustly
  const distance = parseFloat(String(distanceText).replace(/,/g, '').replace(/[^\d.]/g, '')) || 0;
  const time = parseFloat(String(timeText).replace(/,/g, '').replace(/[^\d.]/g, '')) || 0;

  const baseFare = { auto: 30, car: 50, motorcycle: 20 };
  const perKmRate = { auto: 10, car: 15, motorcycle: 8 };
  const perMinuteRate = { auto: 2, car: 3, motorcycle: 1.5 };

  const fare = {
    auto: +(baseFare.auto + distance * perKmRate.auto + time * perMinuteRate.auto).toFixed(2),
    car: +(baseFare.car + distance * perKmRate.car + time * perMinuteRate.car).toFixed(2),
    motorcycle: +(baseFare.motorcycle + distance * perKmRate.motorcycle + time * perMinuteRate.motorcycle).toFixed(2),
  };

  return fare;
}
module.exports.getFare = getFare;

function getOtp(num) {
  const min = Math.pow(10, num - 1);
  const max = Math.pow(10, num) - 1;
  return crypto.randomInt(min, max + 1).toString();
}

module.exports.createRide = async ({ user, pickup, destination, vehicleType }) => {
  if (!user || !pickup || !destination || !vehicleType) {
    throw new Error('All fields are required');
  }

  const fareObj = await getFare(pickup, destination);
  const selectedFare = fareObj[vehicleType];

  const ride = await rideModel.create({
    user,
    pickup,
    destination,
    otp: getOtp(6),
    fare: selectedFare,
  });

  return ride;
};
module.exports.confirmRide = async (rideId, captainId) => {
  if (!rideId) {
    throw new Error('Ride ID is required');
  }

  // ✅ update & RETURN updated document
  const ride = await rideModel
    .findOneAndUpdate(
      { _id: rideId },
      {
        status: 'accepted',
        captain: captainId
      },
      { new: true } // 🔥 REQUIRED
    )
    .select('+otp')
    .populate('user')
    .populate('captain');

  if (!ride) {
    throw new Error('Ride not found');
  }

  // 🔍 PROOF LOG
  console.log('🧾 OTP FROM DB AFTER ACCEPT:', ride.otp);

  return ride; // ✅ OTP INCLUDED
};
module.exports.endRide=async({rideId,captain})=>{
  if (!rideId) {
  throw new Error('Ride id is required');
}

const ride = await rideModel.findOne({
  _id: rideId,
  captain: captain._id
})
.populate('user')
.populate('captain')
.select('+otp');

if (!ride) {
  throw new Error('Ride not found');
}

if (ride.status !== 'ongoing') {
  throw new Error('Ride not ongoing');
}

await rideModel.findOneAndUpdate(
  {
    _id: rideId
  },
  {
    status: 'completed'
  }
);
return ride;
};