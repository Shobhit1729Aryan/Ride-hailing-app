import { createContext, useState } from "react";

export const CaptainDataContext = createContext();

const CaptainContext = ({ children }) => {
  const [captain, setCaptain] = useState(() => {
    const savedCaptain = localStorage.getItem("captain");
    return savedCaptain ? JSON.parse(savedCaptain) : null;
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateCaptain = (captainData) => {
    setCaptain(captainData);
    localStorage.setItem("captain", JSON.stringify(captainData));
  };

  return (
    <CaptainDataContext.Provider
      value={{
        captain,
        setCaptain: updateCaptain,
        isLoading,
        setIsLoading,
        error,
        setError,
      }}
    >
      {children}
    </CaptainDataContext.Provider>
  );
};

export default CaptainContext;
