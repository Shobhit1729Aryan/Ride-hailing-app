import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const ConfirmRidePopUp = (props) => {
  const { setConfirmRidePopupPanel, setRidePopupPanel, ride, setRidingPanel } = props
  const [otp, setOtp] = useState('')
  const navigate = useNavigate()

  const submitHandler = async (e) => {
    e && e.preventDefault()
    try {
      const baseUrl = import.meta.env.VITE_BASE_URL || ''
      const token = localStorage.getItem('token')

      const response = await axios.get(`${baseUrl}/rides/start-ride`, {
        params: { rideId: ride?._id, otp },
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response?.status === 200) {
        const startedRide = response.data || ride
        setConfirmRidePopupPanel && setConfirmRidePopupPanel(false)
        setRidePopupPanel && setRidePopupPanel(false)
        setRidingPanel && setRidingPanel(true)
        navigate('/captain-riding', { state: { ride: startedRide } })
      }
    } catch (err) {
      console.error('Error starting ride', err)
    }
  }

  return (
    <div className="bg-white rounded-t-2xl shadow-lg px-4 py-6 relative text-gray-800">

      {/* Drag Close Button */}
      <h5
        className="p-1 text-center w-[93%] absolute top-0 cursor-pointer"
        onClick={() => setConfirmRidePopupPanel && setConfirmRidePopupPanel(false)}
      >
        <i className="text-3xl text-gray-400 hover:text-gray-700 transition-all ri-arrow-down-wide-fill"></i>
      </h5>

      {/* Title */}
      <h3 className="text-lg font-semibold mb-4 mt-4 text-center text-gray-800">
        Confirm this ride to Start
      </h3>

      {/* Driver Info */}
      <div className="flex items-center justify-between bg-yellow-400 px-3 py-2 rounded-lg mb-4">
        <div className="flex items-center gap-2">
          <img
            className="h-10 w-10 rounded-full object-cover"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTV4UlS1Ehv87B7_HRdQWlKz8Jw13A0zxuiuQ&s"
            alt="Driver"
          />
          <h4 className="font-semibold text-sm text-gray-800">Harshi Pateliya</h4>
        </div>
        <span className="text-sm font-semibold text-gray-700">2.2 KM</span>
      </div>

      {/* Ride Details */}
      <div className="w-full text-gray-800 text-sm space-y-4 mb-5">

        {/* Pickup */}
        <div className="flex items-start gap-2">
          <i className="ri-map-pin-line text-lg text-gray-700 mt-0.5"></i>
          <div>
            <h5 className="font-semibold text-sm">562/11-A</h5>
            <p className="text-gray-600 text-xs">Kankariya Talab, Bhopal</p>
          </div>
        </div>

        {/* Drop */}
        <div className="flex items-start gap-2">
          <i className="ri-square-fill text-lg text-gray-700 mt-0.5"></i>
          <div>
            <h5 className="font-semibold text-sm">562/11-A</h5>
            <p className="text-gray-600 text-xs">Kankariya Talab, Bhopal</p>
          </div>
        </div>

        {/* Fare */}
        <div className="flex items-start gap-2">
          <i className="ri-money-rupee-circle-fill text-lg text-green-600 mt-0.5"></i>
          <div>
            <h5 className="font-semibold text-sm">₹193.20</h5>
            <p className="text-gray-600 text-xs">Cash Cash</p>
          </div>
        </div>
      </div>

      {/* OTP Input */}
      <input
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        className="bg-[#eee] px-3 py-2 text-sm rounded-lg w-full mb-4 outline-none"
        type="number"
        placeholder="Enter OTP"
      />

      {/* Buttons */}
      <button
        onClick={submitHandler}
        className="w-full bg-green-600 text-white font-semibold py-2.5 rounded-lg hover:bg-green-700 transition-all shadow-md flex items-center justify-center"
      >
        Confirm
      </button>

      <button
        onClick={() => setConfirmRidePopupPanel && setConfirmRidePopupPanel(false)}
        className="w-full bg-red-500 text-white font-semibold py-2.5 rounded-lg hover:bg-red-600 transition-all shadow-sm mt-2"
      >
        Cancel
      </button>

    </div>
  )
}

export default ConfirmRidePopUp
 