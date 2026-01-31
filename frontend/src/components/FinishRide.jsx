import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const FinishRide = ({ setfinishRidePanel, ride, fare }) => {

  const navigate = useNavigate(); // ✅ FIX 1: create navigate

  async function endRide() {
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/rides/end-ride`,
      {
        rideId: ride._id
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    )

    if (response?.status === 200) {
      setfinishRidePanel(false);
      navigate("/captain-home"); // ✅ FIX 2: correct navigation
    }
  }

  return (
    <div className="bg-white rounded-t-2xl shadow-lg px-4 py-5 relative text-gray-800">

      {/* Drag / Close Button */}
      <h5
        className="p-1 text-center w-[93%] absolute top-0 cursor-pointer"
        onClick={() => setfinishRidePanel(false)}
      >
        <i className="text-3xl text-gray-400 hover:text-gray-700 transition-all ri-arrow-down-wide-fill"></i>
      </h5>

      {/* Title */}
      <h3 className="text-xl font-semibold text-center mt-5 mb-5">Finish This Ride</h3>

      {/* Driver Info Row */}
      <div className="flex items-center justify-between bg-yellow-400 p-3 rounded-lg mb-4">
        <div className="flex items-center gap-3">
          <img
            className="h-12 w-12 rounded-full object-cover"
            src="https://i.pinimg.com/236x/af/26/28/af26280b0ca385be47d107b799ed1b12b.jpg"
            alt="Driver"
          />
          <h2 className="text-lg font-medium">
            {ride?.user?.fullname?.firstname} {ride?.user?.fullname?.lastname}
          </h2>
        </div>
        <h5 className="text-md font-semibold">{ride?.distance || '2.2 KM'}</h5>
      </div>

      {/* Ride Details */}
      <div className="flex gap-2 justify-between p-3 border-b-2">
        <div className="w-full">
          <div className="flex items-center gap-2">
            <i className="ri-map-pin-user-fill"></i>
            <h3 className="text-lg font-medium">Pickup</h3>
          </div>
          <p className="text-sm mt-1 text-gray-600">{ride?.pickup}</p>
        </div>
      </div>

      <div className="flex gap-2 justify-between p-3 border-b-2">
        <div className="w-full">
          <div className="flex items-center gap-2">
            <i className="ri-map-pin-user-fill"></i>
            <h3 className="text-lg font-medium">Destination</h3>
          </div>
          <p className="text-sm mt-1 text-gray-600">{ride?.destination}</p>
        </div>
      </div>

      <div className="flex gap-2 justify-between p-3 border-b-2">
        <div className="w-full">
          <div className="flex items-center gap-2">
            <i className="ri-money-rupee-circle-fill text-green-600 text-lg"></i>
            <h3 className="text-lg font-medium">
              {fare ?? (ride?.fare ? `₹${ride.fare}` : '—')}
            </h3>
          </div>
          <p className="text-sm mt-1 text-gray-600">Cash</p>
        </div>
      </div>

      {/* Complete Ride Button */}
      <button
        onClick={endRide}
        className="w-full mt-5 bg-green-600 text-white font-semibold p-2 rounded-lg hover:bg-green-700 transition-all"
      >
        Finish Ride & Collect Cash
      </button>
    </div>
  );
};

export default FinishRide;
