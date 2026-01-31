import React, { useState, useEffect, useRef } from 'react'
import { LoadScript, GoogleMap, Marker } from '@react-google-maps/api'

const containerStyle = {
  width: '100%',
  height: '100%',
}

const defaultCenter = {
  lat: 20.5937, // India center fallback
  lng: 78.9629,
}

const LiveTracking = () => {
  const [currentPosition, setCurrentPosition] = useState(null)
  const mapRef = useRef(null)

  useEffect(() => {
    if (!navigator.geolocation) {
      console.error('Geolocation not supported')
      return
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        const newPos = { lat: latitude, lng: longitude }

        setCurrentPosition(newPos)

        // 🔥 force map recenter when position updates
        if (mapRef.current) {
          mapRef.current.panTo(newPos)
        }
      },
      (error) => {
        console.error('Geolocation error:', error)
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 10000,
      }
    )

    return () => navigator.geolocation.clearWatch(watchId)
  }, [])

  return (
    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={currentPosition || defaultCenter}
        zoom={15}
        onLoad={(map) => {
          mapRef.current = map
          if (currentPosition) {
            map.panTo(currentPosition)
          }
        }}
      >
        {currentPosition && <Marker position={currentPosition} />}
      </GoogleMap>
    </LoadScript>
  )
}

export default LiveTracking
