import React, { useRef, useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import FinishRide from '../components/FinishRide'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import LiveTracking from '../components/LiveTracking'

const CaptainRiding = () => {
  const finishRidePanelRef = useRef(null)
  const location = useLocation()

  const [finishRidePanel, setfinishRidePanel] = useState(false)
  const [rideData, setRideData] = useState(() => {
    return location?.state?.ride || JSON.parse(localStorage.getItem('currentRide') || 'null') || null
  })
  const [captain, setCaptain] = useState(() => JSON.parse(localStorage.getItem('captain') || 'null'))

  useEffect(() => {
    if (location?.state?.ride) setRideData(location.state.ride)
  }, [location])

  useGSAP(
    function () {
      if (finishRidePanel) {
        gsap.to(finishRidePanelRef.current, { transform: "translateY(0)" });
      } else {
        gsap.to(finishRidePanelRef.current, { transform: "translateY(100%)" });
      }
    },
    [finishRidePanel]
  );
  return (
    <div className="h-screen relative bg-gray-50 overflow-hidden">

      {/* Uber Logo */}
      <img
        className="w-16 absolute left-5 top-5"
        src="https://www.logo.wine/a/logo/Uber/Uber-Logo.wine.svg"
        alt="Uber Logo"
      />

      {/* Home Button */}
      <Link
        to="/captain-home"
        className="fixed h-10 w-10 bg-white right-4 top-4 flex items-center justify-center rounded-full shadow-md hover:shadow-lg transition-all"
      >
        <i className="text-xl font-medium ri-logout-box-r-line"></i>
      </Link>

      {/* Map Section */}
      <div className="h-[80%]">
         <LiveTracking/>
      </div>

      {/* Bottom Ride Info Panel */}
      <div className="h-[20%] bg-yellow-400 p-5 flex items-center justify-between relative" 
     
      >
        
        {/* Back Icon */}
        <h5
          className="text-3xl text-gray-800 ri-arrow-up-wide-line absolute top-0 left-[50%] -translate-x-1/2 cursor-pointer"
        ></h5>

        {/* Passenger / Pickup */}
        <div className="flex flex-col">
          <span className="text-lg font-semibold">{rideData?.user?.fullname?.firstname ? `${rideData.user.fullname.firstname} ${rideData.user.fullname.lastname || ''}` : (captain?.fullname || 'Passenger')}</span>
          <span className="text-sm text-gray-700">{rideData?.pickup || 'Pickup location'}</span>
        </div>

        {/* Distance / Fare */}
        <div className="text-right">
          <h4 className="text-xl font-semibold">{rideData?.distance || '4 KM away'}</h4>
          <p className="text-sm text-gray-600">{rideData?.fare ? `₹${rideData.fare}` : ''}</p>
        </div>

        {/* Button */}
        <button  onClick={()=>{
        setfinishRidePanel(true)
      }} className="bg-green-600 text-white font-semibold py-2 px-10 rounded-lg shadow-md hover:bg-green-700 transition-all">
          Complete Ride
        </button>
      </div>

       <div
        ref={finishRidePanelRef}
        className="bg-white fixed w-full translate-y-full z-10 bottom-0 px-3 py-8 pt-12 rounded-t-2xl shadow-lg"
      >
        <FinishRide setfinishRidePanel={setfinishRidePanel} ride={rideData} fare={rideData?.fare} />
      </div>
    </div>
  )
}

export default CaptainRiding
