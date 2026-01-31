import React, { useEffect, useState,useContext } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { SocketContext } from '../context/SocketContext'
import { useNavigate } from 'react-router-dom'
const Riding = () => {
  
  const location = useLocation()
  const [rideData, setRideData] = useState(() => {
    try {
      const stored = localStorage.getItem('currentRide') || localStorage.getItem('assignedRide')
      return location?.state?.ride || (stored ? JSON.parse(stored) : null)
    } catch (e) {
      console.warn('Failed to parse stored ride', e)
      return location?.state?.ride || null
    }
  })

  useEffect(() => {
    if (location?.state?.ride) setRideData(location.state.ride)
  }, [location])

  const driverName = rideData?.captain?.fullname?.firstname ? `${rideData.captain.fullname.firstname} ${rideData.captain.fullname.lastname || ''}` : 'Driver'
  const plate = rideData?.captain?.vehicle?.plate || rideData?.captain?.plate || 'KA12U789'
  const rawVehicleType = rideData?.captain?.vehicle?.vehicleType || rideData?.captain?.vehicleType || ''
  const carModel = rawVehicleType ? rawVehicleType.charAt(0).toUpperCase() + rawVehicleType.slice(1) : 'Suzuki Swift'
  const destination = rideData?.destination || 'Destination'
  const fare = rideData?.fare ? `₹${rideData.fare}` : ''
const { socket } = useContext(SocketContext)
const navigate = useNavigate()

useEffect(() => {
  if (!socket) return;

  const handleRideEnded = () => {
    navigate('/home');
  };

  socket.on('ride-ended', handleRideEnded);

  return () => {
    socket.off('ride-ended', handleRideEnded);
  };
}, [socket, navigate]);


  return (
    <div className='h-screen'> 
      <Link to='/home' className='fixed h-10 w-10 bg-white right-2 top-2  flex items-center justify-enter rounded-full'> <i className="text-lg px-2.5 font-medium ri-home-5-line"></i></Link>
      <div className='h-1/2'>
        <img
          className="h-full w-full object-cover"
          src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif"
        />
      </div>

      <div className='h-1/2 p-4'> 
        <div className='flex items-center justify-between '> 
          <img className="h-12 object-contain" src={rideData?.captain?.avatar || "https://cn-geo1.uber.com/image-proc/crop/resizecrop/udam/format=auto/width=851/height=638/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC91ZGFtLWFzc2V0cy82ZWU1MGMxYi0yMTc0LTRjOTctODNhMS1iZmQ0NTQ0Njg5ZDAucG5n"} />
          <div className='text-right '>
            <h2 className='text-lg font-medium'>{driverName}</h2>
            <h4 className='text-xl font-semibold -mt-1 -mb-1'>{plate}</h4>
            <p className='text-sm text-gray-600'>{carModel}</p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center gap-6 mt-4">
          <div className="w-full text-gray-800 border-t border-gray-200 pt-4 space-y-4 text-sm">
            <div className="flex flex-col border-t border-gray-100 pt-3">
              <div className="flex items-center gap-2 font-semibold text-lg">
                <i className="ri-square-fill text-gray-700"></i>
                <span>{destination}</span>
              </div>
              <p className="text-gray-600 ml-6">{rideData?.destination}</p>
            </div>

            <div className="flex flex-col border-t border-gray-100 pt-3">
              <div className="flex items-center gap-2 font-semibold text-lg">
                <i className="ri-money-rupee-circle-fill text-green-600"></i>
                <span>{fare}</span>
              </div>
              <p className="text-gray-600 ml-6">Cash </p>
            </div>
          </div>
        </div>

        <button className='w-full bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-700 transition-all shadow-md'>Make a Payement</button>
      </div>
    </div>
  )
}
export default Riding