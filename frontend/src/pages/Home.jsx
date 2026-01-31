import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import LocationSearchPanel from "../components/LocationSearchPanel";
import VehiclePanel from "../components/VehiclePanel";
import ConfirmedRide from "../components/ConfirmedRide";
import LookingForDriver from "../components/LookingForDriver";
import WaitingForDriver from "../components/WaitingForDriver";
import { SocketContext } from "../context/SocketContext";
import { useContext } from "react";
import { UserDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import LiveTracking from "../components/LiveTracking";

const Home = () => {
  console.log("📄 Home.jsx RENDERED");

  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [fare, setFare] = useState(null);
  const [fareLoading, setFareLoading] = useState(false);
  const [activeInput, setActiveInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [panelOpen, setPanelOpen] = useState(false);
  const [vehiclePannel, setVehiclePannel] = useState(false);
  const [confirmRidePanel, setconfirmRidePanel] = useState(false);
  const [vehicleFound, setvehicleFound] = useState(false);
  const [waitingForDriver, setwaitingForDriver] = useState(false);
  const [assignedRide, setAssignedRide] = useState(null);
useEffect(() => {
  console.log('🧠 PANEL STATE CHECK');
  console.log('waitingForDriver:', waitingForDriver);
  console.log('vehicleFound:', vehicleFound);
  console.log('confirmRidePanel:', confirmRidePanel);
}, [waitingForDriver, vehicleFound, confirmRidePanel]);

  const panelRef = useRef(null);
  const panelCloseRef = useRef(null);
  const vehiclePannelRef = useRef(null);
  const confirmRidePanelRef = useRef(null);
  const vehicleFoundRef = useRef(null);
  const waitingForDriverRef = useRef(null);
  const [vehicleType, setVehicleType] = useState(null);

  const { socket } = React.useContext(SocketContext);
  const { user } = useContext(UserDataContext);

  const navigate = useNavigate();

  useEffect(() => {
    console.log("📄 Home.jsx join useEffect");
  console.log("📄 socket:", socket);
  console.log("📄 user:", user);
    // ensure socket and user are available before emitting
    if (!socket || !user) return;

    socket.emit("join", { userType: "user", userId: user._id });
  }, [socket, user]);
  
  useEffect(() => {
    if (!socket) return;

    const handleRideConfirmed = (ride) => {
      console.log('❌❌❌ USER RECEIVED ride-confirmed');
    console.log('📦 FULL RIDE DATA:', ride);
    console.log('📌 ride.status:', ride?.status);
    console.log('📌 ride.otp:', ride?.otp);
    console.log('📌 captain:', ride?.captain);

      setAssignedRide(ride);
      setwaitingForDriver(true);

      // persist so UI survives remounts/refreshes
      try {
        localStorage.setItem('assignedRide', JSON.stringify(ride));
      } catch (e) {
        console.warn('Could not persist assignedRide', e);
      }
    };

    socket.on('ride-confirmed', handleRideConfirmed);

    return () => socket.off('ride-confirmed', handleRideConfirmed);
  }, [socket]);


  // restore persisted assigned ride only if it belongs to the current user
  useEffect(() => {
    if (!user) return; // wait for user to be available

    try {
      const stored = localStorage.getItem('assignedRide');
      if (!stored) return;

      const parsed = JSON.parse(stored);

      // ride.user may be populated as an object or just an id string
      const rideUserId = parsed?.user?._id || parsed?.user;
      const isForCurrentUser = rideUserId && String(rideUserId) === String(user._id);

      // Only restore when the ride is still pending/confirmed (not started/completed)
      const status = parsed?.status;
      const shouldRestore = isForCurrentUser && (status === 'pending' || status === 'confirmed');

      if (shouldRestore && !assignedRide) {
        setAssignedRide(parsed);
        setwaitingForDriver(true);
        console.log('📄 Restored assignedRide from localStorage for current user');
      } else {
        // Clear stale or unrelated stored ride so it doesn't auto-open later
        localStorage.removeItem('assignedRide');
      }
    } catch (e) {
      console.warn('Failed to restore assignedRide', e);
    }
  }, [user]);

useEffect(() => {
  if (!socket) return;

  const handleRideStarted = (ride) => {
    console.log('✅✅✅ USER RECEIVED ride-started');
    console.log('📦 FULL RIDE DATA:', ride);
    console.log('📌 ride.status:', ride?.status);
    console.log('📌 ride.otp:', ride?.otp);


    // update ride
    setAssignedRide(ride);

    // close all panels cleanly
    setwaitingForDriver(false);
    setvehicleFound(false);
    setconfirmRidePanel(false);
    setVehiclePannel(false);
    setPanelOpen(false);

    console.log('➡️ Navigating user to /riding');

    // persist current ride for riding page fallback
    try {
      localStorage.setItem('currentRide', JSON.stringify(ride));
    } catch (e) {
      console.warn('Failed to persist currentRide', e);
    }

    // 🚀 move user to riding/payment screen with ride in state
    navigate('/riding', { state: { ride } });

    // clear persisted assigned ride
    try {
      localStorage.removeItem('assignedRide');
    } catch (e) {
      console.warn('Failed to clear assignedRide', e);
    }
  };

  socket.on('ride-started', handleRideStarted);

  return () => socket.off('ride-started', handleRideStarted);
}, [socket, navigate]);

useEffect(() => {
  console.log("📄 Home.jsx assignedRide UPDATED:", assignedRide);
}, [assignedRide]);
useEffect(() => {
  console.log("📄 Home.jsx waitingForDriver STATE:", waitingForDriver);
}, [waitingForDriver]);


  const fetchSuggestions = async (text) => {
    if (!text || text.length < 3) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:4000/maps/get-suggestions?input=${text}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setSearchResults(response.data);
    } catch (error) {
      console.log("Error fetching suggestions", error);
    }
  };

  useGSAP(() => {
    gsap.to(panelRef.current, {
      height: panelOpen ? "70%" : "0%",
      opacity: panelOpen ? 1 : 0,
      padding: panelOpen ? 24 : 0,
    });
    gsap.to(panelCloseRef.current, { opacity: panelOpen ? 1 : 0 });
  }, [panelOpen]);

  useGSAP(() => {
    gsap.to(vehiclePannelRef.current, {
      transform: vehiclePannel ? "translateY(0)" : "translateY(100%)",
    });
  }, [vehiclePannel]);

  useGSAP(() => {
    gsap.to(confirmRidePanelRef.current, {
      transform: confirmRidePanel ? "translateY(0)" : "translateY(100%)",
    });
  }, [confirmRidePanel]);

  useGSAP(() => {
    gsap.to(vehicleFoundRef.current, {
      transform: vehicleFound ? "translateY(0)" : "translateY(100%)",
    });
  }, [vehicleFound]);

  useGSAP(() => {
    gsap.to(waitingForDriverRef.current, {
      transform: waitingForDriver ? "translateY(0)" : "translateY(100%)",
    });
  }, [waitingForDriver]);

  // ===========================
  // ❗ MINIMAL FIX — Fare Logic
  // ===========================
  async function findTrip() {
    try {
      setVehiclePannel(true);
      setPanelOpen(false);
      setFare(null);
      setFareLoading(true);

      const baseUrl = import.meta.env.VITE_BASE_URL || "http://localhost:4000";
      const response = await axios.get(`${baseUrl}/rides/get-fare`, {
        params: { pickup, destination },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        withCredentials: true,
      });

      console.log("GET /rides/get-fare response:", response.status, response.data);

      // 👇 backend already returns { car, motorcycle, auto }
      const payload = response.data;
      setFare(payload);
    } catch (error) {
      console.log("Error fetching fare:", error?.response ?? error);
      setFare(null);
    } finally {
      setFareLoading(false);
    }
  }

  async function createRide( ) {
   const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/create`, {//take input from user
      pickup,
      destination,
      vehicleType,
    } ,{
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      }
    }
  )
console.log(response.data);
  }
const selectVehicleType = (type) => {
  setVehicleType(type);
  setconfirmRidePanel(true);
};
console.log('🧾 ASSIGNED RIDE STATE (Home.jsx):', assignedRide);

console.log("📄 Home.jsx RENDER CHECK → assignedRide:", assignedRide);
console.log("📄 Home.jsx RENDER CHECK → otp:", assignedRide?.otp);
  return (
    <div className="h-screen relative overflow-hidden">
      <img
        className="w-16 absolute left-5 top-5"
        src="https://www.logo.wine/a/logo/Uber/Uber-Logo.wine.svg"
      />

      <div className="h-screen w-screen">
        <LiveTracking/>
      </div>

      <div className="h-screen flex flex-col justify-end absolute top-0 w-full">
        <div className="h-[30%] p-5 bg-white relative">
          <h5
            ref={panelCloseRef}
            onClick={() => setPanelOpen(false)}
            className="absolute opacity-0 top-0 left-3 text-xl"
          >
            <i className="ri-arrow-down-wide-line"></i>
          </h5>

          <h4 className="text-2xl font-semibold">Find a trip</h4>

          <form>
            <div className="line absolute h-16 w-1 top-[38%] left-10 bg-gray-700 rounded-full"></div>

            <input
              onClick={() => {
                setPanelOpen(true);
                setActiveInput("pickup");
              }}
              value={pickup}
              onChange={(e) => {
                setPickup(e.target.value);
                fetchSuggestions(e.target.value);
              }}
              className="bg-[#eee] px-12 py-2 text-lg rounded-lg w-full mt-5"
              type="text"
              placeholder="Add a pickup location"
            />

            <input
              onClick={() => {
                setPanelOpen(true);
                setActiveInput("destination");
              }}
              value={destination}
              onChange={(e) => {
                setDestination(e.target.value);
                fetchSuggestions(e.target.value);
              }}
              className="bg-[#eee] px-12 py-2 text-lg rounded-lg mt-3 w-full"
              type="text"
              placeholder="Enter a destination"
            />
          </form>

          <button
            onClick={findTrip}
            className="bg-black text-white px-4 py-2 rounded-lg mt-3 w-full"
          >
            Find Trip
          </button>
        </div>

        <div ref={panelRef} className="bg-white h-0 overflow-scroll">
          <LocationSearchPanel
            setVehiclePannel={setVehiclePannel}
            setPanelOpen={setPanelOpen}
            searchResults={searchResults}
            activeInput={activeInput}
            setPickup={setPickup}
            setDestination={setDestination}
          />
        </div>

        <div
          ref={vehiclePannelRef}
          className="bg-white fixed w-full z-10 bottom-0 translate-y-full px-3 py-10 pt-14"
        >
          <VehiclePanel
          selectVehicle={selectVehicleType}
            fare={fare}
            fareLoading={fareLoading}
            setconfirmRidePanel={setconfirmRidePanel}
            setVehiclePannel={setVehiclePannel}
          />
        </div>

        <div
          ref={confirmRidePanelRef}
          className="bg-white fixed w-full z-10 bottom-0 translate-y-full px-3 py-10 pt-14"
        >
          <ConfirmedRide
          createRide={createRide}
          pickup={pickup}
          destination={destination}
          fare={fare}
          vehicleType={vehicleType}
          
            setVehiclePannel={setVehiclePannel} 
            setconfirmRidePanel={setconfirmRidePanel}
            setvehicleFound={setvehicleFound}
          />
        </div>

        <div
          ref={vehicleFoundRef}
          className="bg-white fixed w-full z-10 bottom-0 translate-y-full px-3 py-10 pt-14"
        >
          <LookingForDriver 
          pickup={pickup}
  destination={destination}
  fare={fare}
  vehicleType={vehicleType}
  setVehiclePannel={setVehiclePannel}/>
        </div>

        <div
          ref={waitingForDriverRef}
          className="bg-white fixed w-full z-10 bottom-0 translate-y-full px-3 py-10 pt-14"
        >
          <WaitingForDriver
          
            setwaitingForDriver={setwaitingForDriver}
            driver={assignedRide?.captain}
            pickup={assignedRide?.pickup || pickup}
            destination={assignedRide?.destination || destination}
            fare={assignedRide?.fare || fare}
            otp={assignedRide?.otp}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
