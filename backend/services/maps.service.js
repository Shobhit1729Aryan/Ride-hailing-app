const axios = require('axios');
const captainModel = require('../models/captain.model');

module.exports.getAddressCoordinate = async (address) => {
  console.log("✅ API KEY FROM ENV:", process.env.GOOGLE_MAPS_API_KEY); 
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

  console.log("📍 Fetching coordinates for:", address);
  console.log("🔗 Request URL:", url);

  try {
    const response = await axios.get(url);

    // Log full API response
    console.log("🌍 Google API Response:", JSON.stringify(response.data, null, 2));

    if (response.data.status === 'OK') {
      const location = response.data.results[0].geometry.location;

      console.log("✅ Coordinates found:", location);

      return {
        ltd: location.lat,
        lng: location.lng
      };

    } else {
      console.error("❌ Google API Error:", response.data.status, response.data.error_message);
      throw new Error(response.data.error_message || 'Unable to fetch coordinates');
    }

  } catch (error) {
    console.error("🔥 ERROR in maps.service.js:", error.message);
    throw error;
  }
};
module.exports.getDistanceTime = async (origin, destination) => {
  if (!origin || !destination) {
    throw new Error("All fields are required");
  }

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(
    origin
  )}&destinations=${encodeURIComponent(destination)}&key=${apiKey}`;

  try {
    const response = await axios.get(url);

    console.log("📦 Google Distance Response:", JSON.stringify(response.data, null, 2));

    if (response.data.status !== "OK") {
      throw new Error("Google API failed: " + response.data.status);
    }

    const elements = response.data.rows?.[0]?.elements;
    if (!elements) throw new Error("Invalid Google response");

    // pick first valid element instead of always index 0
    let valid = null;
    for (const el of elements) {
      if (el?.status === "OK") {
        valid = el;
        break;
      }
    }

    if (!valid) {
      throw new Error("No valid route found between locations");
    }

    return {
      distance: valid.distance?.text,  // "28.9 km"
      time: valid.duration?.text       // "1 hour 4 mins"
    };

  } catch (error) {
    console.error("🔥 ERROR in maps.service.js:", error.message);
    throw error;
  }
};


module.exports.getAutoCompleteSuggestions=async(input)=>{
  if(!input){
    throw new Error('All fields are required');
  }
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${apiKey}`;
  try {
    const response = await axios.get(url);
    if (response.data.status === 'OK') {
      return response.data.predictions;
    } else {
      console.error("❌ Google API Error:", response.data.status, response.data.error_message);
      throw new Error(response.data.error_message || 'Unable to fetch suggestions');
    }
  } catch (error) {
    console.error("🔥 ERROR in maps.service.js:", error.message);
    throw error;
  }
};
module.exports.getCaptainsInTheRadius = async (ltd, lng, radiusInKm) => {
  const captains = await captainModel.find({
    location: {
      $geoWithin: {
        $centerSphere: [[lng, ltd], radiusInKm / 6378.1],
      },
    },
  });

  return captains;
};