import React, { useContext, useEffect } from 'react'
import { CaptainDataContext } from '../context/CaptainContext'

const CaptainDetails = () => {
  const { captain, setCaptain } = useContext(CaptainDataContext)

  // Ensure captain data is actively updated from localStorage
  useEffect(() => {
    if (!captain) {
      const storedCaptain = localStorage.getItem('captain')
      if (storedCaptain) {
        setCaptain(JSON.parse(storedCaptain))
      }
    }
  }, [captain, setCaptain])

  console.log("Captain from context:", captain)

  return (
    <div>
      <div className="h-1/2 bg-white p-5 rounded-t-3xl shadow-lg -mt-3">

        {/* Top Info Row */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <img
              className="h-10 w-10 rounded-full object-cover"
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLH7fSJhVDffzqyKzxqMm47CtSPD8jsdwErw&s"
              alt="Captain"
            />

            <h4 className="font-semibold text-gray-800 text-lg">
              {captain?.fullname?.firstname || "Captain"}{" "}
              {captain?.fullname?.lastname || "Name"}
            </h4>
          </div>

          <div className="text-right">
            <h4 className="text-lg font-semibold text-gray-800">₹295.20</h4>
            <p className="text-sm text-gray-500 -mt-1">Earned</p>
          </div>
        </div>

        {/* Divider */}
        <hr className="border-gray-200 mb-5" />

        {/* Stats Row */}
        <div className="grid grid-cols-3 text-center gap-3">
          <div>
            <i className="ri-timer-2-line text-lg text-gray-700"></i>
            <h5 className="font-semibold text-gray-800">10.2</h5>
            <p className="text-xs text-gray-500">Hours Online</p>
          </div>

          <div>
            <i className="ri-speed-up-line text-lg text-gray-700"></i>
            <h5 className="font-semibold text-gray-800">10.2</h5>
            <p className="text-xs text-gray-500">Trips Completed</p>
          </div>

          <div>
            <i className="ri-booklet-line text-lg text-gray-700"></i>
            <h5 className="font-semibold text-gray-800">10.2</h5>
            <p className="text-xs text-gray-500">Ratings</p>
          </div>
        </div>

      </div>
    </div>
  )
}

export default CaptainDetails
