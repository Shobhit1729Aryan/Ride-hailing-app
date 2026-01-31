import React from "react";

const LocationSearchPanel = ({
  setVehiclePannel,
  setPanelOpen,
  searchResults,
  activeInput,
  setPickup,
  setDestination,
}) => {
  return (
    <div>
      {searchResults.map((place, index) => (
        <div
          key={index}
          onClick={() => {
            if (activeInput === "pickup") {
              setPickup(place.description);
            } else {
              setDestination(place.description);
            }
           // setVehiclePannel(true);
            //setPanelOpen(false);
          }}
          className="flex gap-4 border-2 p-3 border-gray-50 active:border-black rounded-xl items-center my-4"
        >
          <h2 className="bg-[#eee] h-8 flex items-center justify-center w-12 rounded-full">
            <i className="ri-map-pin-line"></i>
          </h2>
          <h4>{place.description}</h4>
        </div>
      ))}
    </div>
  );
};

export default LocationSearchPanel;
