"use client";

import { createContext, useContext, useState } from "react";

type LoaderContextType = {
  loading: boolean;
  setLoading: (loading: boolean) => void;
};

// create the context
const LoaderContext = createContext<LoaderContextType | undefined>(undefined);

//create a custom hook to use loader context

export const useLoader = () => {
  const context = useContext(LoaderContext);
  if (!context) {
    throw new Error("useLoader must be used within a LoaderProvider");
  }
  return context;
};

// create a Loader provider component
export const LoaderProvider = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(false);

  return (
    <LoaderContext.Provider value={{ loading, setLoading }}>
      {children}
    </LoaderContext.Provider>
  );
};
