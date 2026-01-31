import React, { useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CaptainDataContext } from '../context/CaptainContext'
import axios from 'axios'

const CaptainProtectWrapper = ({ children }) => {
  const token = localStorage.getItem('token')
  const navigate = useNavigate()
  const { captain, setCaptain } = useContext(CaptainDataContext)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!token) {
      navigate('/captain-login')
      return
    }

    // ✅ STOP LOOP: if captain already exists, skip API
    if (captain) {
      setIsLoading(false)
      return
    }

    axios
      .get(`${import.meta.env.VITE_BASE_URL}/captains/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          const data = response.data
          setCaptain(data)
          setIsLoading(false)
        }
      })
      .catch((error) => {
        console.log('Captain profile fetch failed:', error)
        localStorage.removeItem('token')
        navigate('/captain-login')
      })
  }, []) // ✅ EMPTY dependency array (VERY IMPORTANT)

  if (isLoading) {
    return <div>Loading...</div>
  }

  return <>{children}</>
}

export default CaptainProtectWrapper
