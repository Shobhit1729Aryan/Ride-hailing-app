import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { CaptainDataContext } from '../context/CaptainContext'

const CaptainSignup = () => {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [vehicleColor, setVehicleColor] = useState('')
  const [vehicleType, setVehicleType] = useState('')
  const [vehiclePlate, setVehiclePlate] = useState('')
  const [vehicleCapacity, setVehicleCapacity] = useState('')

  const { captain, setCaptain } = useContext(CaptainDataContext)

  const submitHandler = async (e) => {
    e.preventDefault()

    const captainData = {
      fullname: {
        firstname: firstName,
        lastname: lastName,
      },
      email,
      password,
      vehicle: {
        color: vehicleColor,
        plate: vehiclePlate,
        capacity: vehicleCapacity,
        vehicleType: vehicleType,
      },
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/captains/register`, captainData)

      if (response.status === 201) {
        const data = response.data
        setCaptain(data.captain)
        localStorage.setItem('token', data.token)
        navigate('/captain-login')
      }
    } catch (error) {
      console.log('Captain signup failed:', error)
      alert('Something went wrong. Try again.')
    }

    setEmail('')
    setPassword('')
    setFirstName('')
    setLastName('')
    setVehicleColor('')
    setVehicleType('')
    setVehiclePlate('')
    setVehicleCapacity('')
  }

  return (
    <div className='p-7 flex flex-col justify-between h-screen'>
      <div>
        <img
          className='w-16'
          src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTubIbwtYu-INmobyw_6hosgjqoQtkw7YwiXA&s'
          alt='logo'
        />

        <form onSubmit={submitHandler}>
          <h3 className='text-xl font-medium mb-2'>What's your name</h3>
          <div className='flex gap-4 mb-5'>
            <input
              className='bg-[#eeeeee] rounded px-4 py-2 border w-1/2 text-lg placeholder:text-base'
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              type='text'
              placeholder='First name'
            />
            <input
              className='bg-[#eeeeee] rounded px-4 py-2 w-1/2 border text-lg placeholder:text-base'
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              type='text'
              placeholder='Last name'
            />
          </div>

          <h3 className='text-xl font-medium mb-2'>What's your email</h3>
          <input
            className='bg-[#eeeeee] mb-5 rounded px-4 py-2 border w-full text-lg placeholder:text-base'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            type='email'
            placeholder='email@example.com'
          />

          <h3 className='text-xl font-medium mb-2'>Enter Password</h3>
          <input
            className='bg-[#eeeeee] mb-5 rounded px-4 py-2 border w-full text-lg placeholder:text-base'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            type='password'
            placeholder='Password'
          />

          {/* Vehicle Details */}
          <h3 className='text-xl font-medium mb-2'>Vehicle Details</h3>

          <div className='flex gap-4 mb-5'>
            <input
              className='bg-[#eeeeee] rounded px-4 py-2 border w-1/2 text-lg placeholder:text-base'
              value={vehicleColor}
              onChange={(e) => setVehicleColor(e.target.value)}
              required
              type='text'
              placeholder='Vehicle Color'
            />

            <select
              className='bg-[#eeeeee] rounded px-4 py-2 border w-1/2 text-lg placeholder:text-base'
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
              required
            >
              <option value='' disabled>
                Select Vehicle Type
              </option>
              <option value='car'>Car</option>
              <option value='auto'>Auto</option>
              <option value='moto'>Moto</option>
            </select>
          </div>

          <div className='flex gap-4 mb-5'>
            <input
              className='bg-[#eeeeee] rounded px-4 py-2 border w-1/2 text-lg placeholder:text-base'
              value={vehiclePlate}
              onChange={(e) => setVehiclePlate(e.target.value)}
              required
              type='text'
              placeholder='Vehicle Plate No.'
            />

            <input
              className='bg-[#eeeeee] rounded px-4 py-2 border w-1/2 text-lg placeholder:text-base'
              value={vehicleCapacity}
              onChange={(e) => setVehicleCapacity(e.target.value)}
              required
              type='number'
              placeholder='Capacity'
            />
          </div>

          <button className='bg-[#111] text-white font-semibold mb-2 rounded px-4 py-2 w-full text-lg'>
            Create Captain Account
          </button>

          <p>
            Already have an account?{' '}
            <Link className='text-blue-600' to='/captain-login'>
              Login here
            </Link>
          </p>
        </form>
      </div>

      <div>
        <p className='text-[10px] leading-tight'>
          This site is protected by reCAPTCHA and the{' '}
          <span className='underline'>Google Privacy Policy</span> and{' '}
          <span className='underline'>Terms of Service apply.</span>
        </p>
      </div>
    </div>
  )
}

export default CaptainSignup
