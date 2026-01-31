import React, { useState, useRef, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import CaptainDetails from '../components/CaptainDetails'
import RidePopUp from '../components/RidePopUp'
import ConfirmRidePopUp from '../components/ConfirmRidePopUp'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { CaptainDataContext } from '../context/CaptainContext'
import { SocketContext } from '../context/SocketContext'
import axios from 'axios'

const CaptainHome = () => {
  const [RidePopUpPanel, setRidePopUpPanel] = useState(false)
  const [ConfirmRidePopUpPanel, setConfirmRidePopUpPanel] = useState(false)
  const [ride, setRide] = useState(null)

  const RidePopUpPanelRef = useRef(null)
  const ConfirmRidePopUpPanelRef = useRef(null)

  const { socket } = useContext(SocketContext)
  const { captain, setCaptain } = useContext(CaptainDataContext)

  /* 🔹 Restore captain from localStorage */
  useEffect(() => {
    if (!captain) {
      const storedCaptain = localStorage.getItem('captain')
      if (storedCaptain) {
        setCaptain(JSON.parse(storedCaptain))
      }
    }
  }, [captain, setCaptain])


  
  /* 🔹 Socket join + live location */
  useEffect(() => {
    if (!captain || !socket) return

    socket.emit('join', {
      userType: 'captain',
      userId: captain._id,
    })

    const updateLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          console.log(
            'Updating location:',
            position.coords.latitude,
            position.coords.longitude
          )

          socket.emit('update-location-captain', {
            userId: captain._id,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          })
        })
      }
    }

    updateLocation()
    const interval = setInterval(updateLocation, 1000)

    return () => clearInterval(interval)
  }, [captain, socket])

  /* 🔹 Listen for new ride */
  useEffect(() => {
  if (!socket) return

  const handleNewRide = (data) => {
    console.log('NEW RIDE FULL DATA:', data)
    console.log('USER:', data.user)

    setRide(data)
    setRidePopUpPanel(true)
  }

  socket.on('new-ride', handleNewRide)

  return () => socket.off('new-ride', handleNewRide)
}, [socket])
useEffect(() => {
  if (!socket) return;

  const handleUserConfirmedRide = (data) => {
    console.log('🚕 User confirmed ride:', data);

    setRide(data); // update ride data
    setConfirmRidePopUpPanel(true); // 🔥 OPEN PANEL
  };

  socket.on('user-confirmed-ride', handleUserConfirmedRide);

  return () => {
    socket.off('user-confirmed-ride', handleUserConfirmedRide);
  };
}, [socket]);


  /* 🔹 Confirm ride */
  async function confirmRide() {
    try {
      const baseUrl = import.meta.env.VITE_BASE_URL || 'http://localhost:3000'
      const token = captain?.token || localStorage.getItem('token')
      const response = await axios.post(
        `${baseUrl}/rides/confirm`,
        { rideId: ride?._id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const confirmedRide = response.data
      localStorage.setItem('currentRide', JSON.stringify(confirmedRide))
      setRide(confirmedRide)
      setConfirmRidePopUpPanel(true)
      setRidePopUpPanel(false)
    } catch (err) {
      console.error('Error confirming ride', err)
    }
  }

  /* 🔹 GSAP animations */
  useGSAP(() => {
    gsap.to(RidePopUpPanelRef.current, {
      transform: RidePopUpPanel ? 'translateY(0)' : 'translateY(100%)',
      duration: 0.5,
      ease: 'power2.out',
    })
  }, [RidePopUpPanel])

  useGSAP(() => {
    gsap.to(ConfirmRidePopUpPanelRef.current, {
      transform: ConfirmRidePopUpPanel ? 'translateY(0)' : 'translateY(100%)',
      duration: 0.5,
      ease: 'power2.out',
    })
  }, [ConfirmRidePopUpPanel])

  return (
    <div className="h-screen relative bg-gray-50 overflow-hidden">
      <img
        className="w-16 absolute left-5 top-5"
        src="https://www.logo.wine/a/logo/Uber/Uber-Logo.wine.svg"
        alt="Uber Logo"
      />

      <Link
        to="/home"
        className="fixed h-10 w-10 bg-white right-4 top-4 flex items-center justify-center rounded-full shadow-md"
      >
        <i className="text-xl ri-home-5-line"></i>
      </Link>

      <div className="h-1/2 relative">
        <img
          className="h-full w-full object-cover"
          src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif"
          alt="Map"
        />
      </div>

      <div className="h-1/2 p-6">
        <CaptainDetails />
      </div>

      {/* Ride PopUp */}
      <div
        ref={RidePopUpPanelRef}
        className="bg-white fixed w-full translate-y-full z-10 bottom-0 px-3 py-8 pt-12 rounded-t-2xl shadow-lg"
      >
        <RidePopUp
          ride={ride}
          setRidePopupPanel={setRidePopUpPanel}
          setConfirmRidePopupPanel={setConfirmRidePopUpPanel}
          confirmRide={confirmRide}
        />
      </div>

      {/* Confirm Ride PopUp */}
      <div
        ref={ConfirmRidePopUpPanelRef}
        className="bg-white fixed w-full translate-y-full z-10 bottom-0 px-3 py-8 pt-12 rounded-t-2xl shadow-lg"
      >
        <ConfirmRidePopUp
          ride={ride}
          setConfirmRidePopupPanel={setConfirmRidePopUpPanel}
          setRidePopupPanel={setRidePopUpPanel}
        />
      </div>
    </div>
  )
}

export default CaptainHome
