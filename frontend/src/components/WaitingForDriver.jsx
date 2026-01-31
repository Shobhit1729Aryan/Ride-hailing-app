import React from 'react'

const WaitingForDriver = ({ setwaitingForDriver, driver, pickup, destination, fare, otp }) => {
  console.log('🧍 USER WaitingForDriver RENDERED');
console.log('🧍 OTP RECEIVED IN USER COMPONENT:', otp);

  return (
    <div className="bg-white rounded-t-2xl shadow-lg px-5 py-8 relative">
      
      <h5
        className="p-1 text-center w-[93%] absolute top-0 cursor-pointer"
        onClick={() => setwaitingForDriver(false)}
      >
        <i className="text-3xl text-gray-400 hover:text-gray-700 transition-all ri-arrow-down-wide-fill"></i>
      </h5>

      <div className='flex items-center justify-between '> <img
          className="h-12 object-contain"
          src="https://cn-geo1.uber.com/image-proc/crop/resizecrop/udam/format=auto/width=851/height=638/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC91ZGFtLWFzc2V0cy82ZWU1MGMxYi0yMTc0LTRjOTctODNhMS1iZmQ0NTQ0Njg5ZDAucG5n"
        />
        <div className='text-right capitalize'>
            <h2 className='text-lg font-medium'>
              {driver?.fullname?.firstname || driver?.fullname?.name || 'Driver'} {driver?.fullname?.lastname || ''}
            </h2>
            <h4 className='text-xl font-semibold -mt-1 -mb-1'>
              {driver?.vehicle?.plate || '—'}
            </h4>
            <p className='text-sm text-gray-600'>
              {driver?.vehicle?.vehicleType || driver?.vehicle?.color || 'Vehicle'}
            </p>
            <p className='text-sm text-gray-700 mt-1'>
              <span className='font-semibold'>OTP:</span> <span className='font-mono'>{otp || '—'}</span>
            </p>
        </div>
        </div>

      <div className="flex flex-col items-center justify-center gap-6 mt-4">
        {/* Car Image */}
       

        {/* Ride Details */}
        <div className="w-full text-gray-800 border-t border-gray-200 pt-4 space-y-4 text-sm">
          {/* Pickup */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2 font-semibold text-lg">
              <i className="ri-map-pin-line text-gray-700"></i>
              <span>{pickup || 'Pickup'}</span>
            </div>
            <p className="text-gray-600 ml-6">{pickup || ''}</p>
          </div>

          {/* Destination */}
          <div className="flex flex-col border-t border-gray-100 pt-3">
            <div className="flex items-center gap-2 font-semibold text-lg">
              <i className="ri-square-fill text-gray-700"></i>
              <span>Third Wave Coffee</span>
            </div>
            <p className="text-gray-600 ml-6">{destination || ''}</p>
          </div>

          {/* Fare */}
          <div className="flex flex-col border-t border-gray-100 pt-3">
            <div className="flex items-center gap-2 font-semibold text-lg">
              <i className="ri-money-rupee-circle-fill text-green-600"></i>
              <span>{fare ? `₹${fare}` : '—'}</span>
            </div>
            <p className="text-gray-600 ml-6">Cash </p>
          </div>
        </div>

       
      </div>
    </div>
  )
}
export default WaitingForDriver