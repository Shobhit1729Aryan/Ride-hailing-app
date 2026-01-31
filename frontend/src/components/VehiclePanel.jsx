import React from "react";
 

const VehiclePanel = ({ setVehiclePannel, setconfirmRidePanel, fare, fareLoading,  selectVehicle }) => {
  // helper: try many shapes and coerce to number
  const getFareValue = (key) => {
    if (!fare) return undefined;

    // common shapes: { car, auto, motorcycle } or { fare: { ... } } or { data: { ... } }
    const probe = (obj, k) => {
      if (!obj) return undefined;
      if (obj[k] !== undefined) return obj[k];
      const lower = k.toLowerCase();
      if (obj[lower] !== undefined) return obj[lower];
      return undefined;
    };

    let v =
      probe(fare, key) ??
      probe(fare.fare, key) ??
      probe(fare.data, key) ??
      probe(fare.result, key);

    // if it's a string like "₹120" or "120.5 km", extract number
    if (typeof v === "string") {
      const parsed = parseFloat(v.replace(/[^0-9.]/g, ""));
      if (!Number.isNaN(parsed)) v = parsed;
    }

    // final numeric coercion
    if (v === null || v === undefined) return undefined;
    const num = Number(v);
    return Number.isFinite(num) ? num : undefined;
  };

  const formatPrice = (num) => {
    if (num === null || num === undefined) return null;
    return `₹${new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(Math.round(num))}`;
  };

  const renderPrice = (key) => {
    if (fareLoading) return "Fetching...";
    const val = getFareValue(key);
    if (val === undefined) return "₹...";
    return formatPrice(val);
  };

  // debug - remove after verification
  // eslint-disable-next-line no-console
  console.debug("VehiclePanel - fare prop:", fare);

  return (
    <div>
      <h5
        className="p-1 text-center w-[93%] absolute top-0"
        onClick={() => setVehiclePannel(false)}
      >
        <i className="text-3xl text-gray-200 ri-arrow-down-wide-fill"></i>
      </h5>

      <h3 className="text-2xl font-semibold mb-5">Choose a ride</h3>

      {/* CAR */}
      <div
        onClick={() => {setconfirmRidePanel(true)
                        selectVehicle('car')}
        }
        className="flex mb-2 border-2 active:border-black rounded-xl w-full p-3 items-center justify-between"
      >
        <img className="h-12" src="https://cn-geo1.uber.com/image-proc/crop/resizecrop/udam/format=auto/width=851/height=638/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC91ZGFtLWFzc2V0cy82ZWU1MGMxYi0yMTc0LTRjOTctODNhMS1iZmQ0NTQ0Njg5ZDAucG5n" />
        <div className="ml-6 w-1/2">
          <h4 className="font-medium text-base">UberGo <span><i className="ri-user-3-fill"></i>4</span></h4>
          <h5 className="font-medium text-sm">2 mins away</h5>
          <p className="font-normal text-xs text-gray-600">Affordable compact rides</p>
        </div>
        <h2 className="text-xl font-semibold">{renderPrice("car")}</h2>
      </div>

      {/* MOTORCYCLE */}
      <div
        onClick={() => {setconfirmRidePanel(true)
                       createRide('motorcycle')}
        }
        className="flex mb-2 border-2 active:border-black rounded-xl w-full p-3 items-center justify-between"
      >
        <img className="h-12" src="https://cn-geo1.uber.com/image-proc/crop/resizecrop/udam/format=auto/width=552/height=368/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC91ZGFtLWFzc2V0cy8yYzdmYTE5NC1jOTU0LTQ5YjItOWM2ZC1hM2I4NjAxMzcwZjUucG5n" />
        <div className="ml-4 w-1/2">
          <h4 className="font-medium text-base">Moto <span><i className="ri-user-3-fill"></i>1</span></h4>
          <h5 className="font-medium text-sm">3 mins away</h5>
          <p className="font-normal text-xs text-gray-600">Affordable motorcycle rides</p>
        </div>
        <h2 className="text-xl font-semibold">{renderPrice("motorcycle")}</h2>
      </div>

      {/* AUTO */}
      <div
        onClick={() => {setconfirmRidePanel(true)
                       createRide('auto')}
        }
        className="flex border-2 active:border-black rounded-xl w-full p-3 items-center justify-between"
      >
        <img className="h-12" src="https://cn-geo1.uber.com/image-proc/crop/resizecrop/udam/format=auto/width=552/height=368/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC91ZGFtLWFzc2V0cy8xZGRiOGM1Ni0wMjA0LTRjZTQtODFjZS01NmExMWEwN2ZlOTgucG5n" />
        <div className="ml-[-2] w-1/2">
          <h4 className="font-medium text-base">UberAuto <span><i className="ri-user-3-fill"></i>3</span></h4>
          <h5 className="font-medium text-sm">4 mins away</h5>
          <p className="font-normal text-xs text-gray-600">Affordable Auto rides</p>
        </div>
        <h2 className="text-xl font-semibold">{renderPrice("auto")}</h2>
      </div>
    </div>
  );
};

export default VehiclePanel;
