import React from 'react'

const RidePopUp = ({
  ride,
  setRidePopupPanel,
  setConfirmRidePopupPanel,
  confirmRide
}) => {
  return (
    <div className="bg-white rounded-t-2xl shadow-lg px-4 py-5 relative text-gray-800">

      {/* Drag / Close Button */}
      <h5
        className="p-1 text-center w-[93%] absolute top-0 cursor-pointer"
        onClick={() => setRidePopupPanel(false)}
      >
        <i className="text-3xl text-gray-400 hover:text-gray-700 transition-all ri-arrow-down-wide-fill"></i>
      </h5>

      {/* Title */}
      <h3 className="text-lg font-semibold mb-4 mt-4 text-center text-gray-800">
        New Ride Available!
      </h3>

      {/* Driver Row */}
      <div className="flex items-center justify-between bg-yellow-400 px-3 py-2 rounded-lg mb-4">
        <div className="flex items-center gap-2">
          <img
            className="h-10 w-10 rounded-full object-cover"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTV4UlS1Ehv87B7_HRdQWlKz8Jw13A0zxuiuQ&s"
            alt="Driver"
          />
          <h4 className="font-semibold text-sm text-gray-800">
            {ride?.user?.fullname?.firstname} {ride?.user?.fullname?.lastname}
          </h4>
        </div>
        <span className="text-sm font-semibold text-gray-700">2.2 KM</span>
      </div>

      {/* Ride Details */}
      <div className="w-full text-gray-800 text-sm space-y-3 mb-5">
        <div className="flex items-start gap-2">
          <i className="ri-map-pin-line text-gray-700 text-lg mt-0.5"></i>
          <div>
            <h5 className="font-semibold text-sm">Pickup</h5>
            <p className="text-gray-600 text-xs">{ride?.pickup}</p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <i className="ri-square-fill text-gray-700 text-lg mt-0.5"></i>
          <div>
            <h5 className="font-semibold text-sm">Destination</h5>
            <p className="text-gray-600 text-xs">{ride?.destination}</p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <i className="ri-money-rupee-circle-fill text-green-600 text-lg mt-0.5"></i>
          <div>
            <h5 className="font-semibold text-sm">₹193.20</h5>
            <p className="text-gray-600 text-xs">Cash</p>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="space-y-2">
        <button
          className="w-full bg-green-600 text-white font-semibold py-2.5 rounded-lg hover:bg-green-700 transition-all shadow-md"
          onClick={() => {
            setRidePopupPanel(false)
            setConfirmRidePopupPanel(true)
            confirmRide()
          }}
        >
          Accept
        </button>

        <button
          onClick={() => {
            setRidePopupPanel(false)
          }}
          className="w-full bg-gray-200 text-gray-700 font-semibold py-2.5 rounded-lg hover:bg-gray-300 transition-all shadow-sm"
        >
          Ignore
        </button>
      </div>
    </div>
  )
}

export default RidePopUp
