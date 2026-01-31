import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { CaptainDataContext } from '../context/CaptainContext'

const Captainlogin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const { captain, setCaptain } = useContext(CaptainDataContext)
  const navigate = useNavigate()

  const submitHandler = async (e) => {
    e.preventDefault()

    const captainData = {
      email,
      password,
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/captains/login`,
        captainData
      )

      if (response.status === 200) {
        const data = response.data

        console.log('Login response data:', data) // Debugging

        setCaptain(data.captain)

        localStorage.setItem('captain', JSON.stringify(data.captain))
        localStorage.setItem('token', data.token)
        navigate('/captain-home')
      }
    } catch (error) {
      console.log('Login failed:', error)
      alert('Invalid credentials or server error.')
    }

    setEmail('')
    setPassword('')
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
          <h3 className='text-xl font-medium mb-2'>What's your email</h3>
          <input
            className='bg-[#eeeeee] mb-7 rounded px-4 py-2 border w-full text-lg placeholder:text-base'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            type='email'
            placeholder='email@example.com'
          />

          <h3 className='text-xl mb-2'>Enter Password</h3>
          <input
            className='bg-[#eeeeee] mb-7 rounded px-4 py-2 border w-full text-lg placeholder:text-base'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            type='password'
            placeholder='Password'
          />

          <button className='bg-[#111] text-white font-semibold mb-2 rounded px-4 py-2 w-full text-lg'>
            Login
          </button>

          <p>
            Join a fleet?{' '}
            <Link className='text-blue-600' to='/captain-signup'>
              Register as Captain
            </Link>
          </p>
        </form>
      </div>

      <div>
        <Link
          to='/login'
          className='bg-[#10b461] flex items-center justify-center text-white font-semibold mb-5 rounded px-4 py-2 w-full text-lg'
        >
          Sign in as User
        </Link>
      </div>
    </div>
  )
}

export default Captainlogin
