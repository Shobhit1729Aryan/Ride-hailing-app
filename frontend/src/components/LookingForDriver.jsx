import React from "react";

const LookingForDriver = ({
  setVehiclePannel,
  pickup,
  destination,
  fare,
  vehicleType,
}) => {
  const rideFare =
    fare && vehicleType ? fare[vehicleType] : null;

  return (
    <div className="bg-white rounded-t-2xl shadow-lg px-5 py-8 relative">
      
      <h5
        className="p-1 text-center w-[93%] absolute top-0 cursor-pointer"
        onClick={() => setVehiclePannel(false)}
      >
        <i className="text-3xl text-gray-400 hover:text-gray-700 transition-all ri-arrow-down-wide-fill"></i>
      </h5>

      <h3 className="text-2xl font-semibold mb-6 text-center text-gray-800">
        Looking for a driver
      </h3>

      <div className="flex flex-col items-center justify-center gap-6 mt-4">
        
        {/* Vehicle Image */}
        <img
          className="h-24 object-contain"
          src="https://cn-geo1.uber.com/image-proc/crop/resizecrop/udam/format=auto/width=851/height=638/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC91ZGFtLWFzc2V0cy82ZWU1MGMxYi0yMTc0LTRjOTctODNhMS1iZmQ0NTQ0Njg5ZDAucG5n"
          alt="Vehicle"
        />

        {/* Ride Details */}
        <div className="w-full text-gray-800 border-t border-gray-200 pt-4 space-y-4 text-sm">
          
          {/* Pickup */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2 font-semibold text-lg">
              <i className="ri-map-pin-line text-gray-700"></i>
              <span>Pickup</span>
            </div>
            <p className="text-gray-600 ml-6">
              {pickup || "--"}
            </p>
          </div>

          {/* Destination */}
          <div className="flex flex-col border-t border-gray-100 pt-3">
            <div className="flex items-center gap-2 font-semibold text-lg">
              <i className="ri-square-fill text-gray-700"></i>
              <span>Destination</span>
            </div>
            <p className="text-gray-600 ml-6">
              {destination || "--"}
            </p>
          </div>

          {/* Fare */}
          <div className="flex flex-col border-t border-gray-100 pt-3">
            <div className="flex items-center gap-2 font-semibold text-lg">
              <i className="ri-money-rupee-circle-fill text-green-600"></i>
              <span>
                ₹{rideFare ? Math.round(rideFare) : "--"}
              </span>
            </div>
            <p className="text-gray-600 ml-6 capitalize">
              {vehicleType || "Cash"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LookingForDriver;
