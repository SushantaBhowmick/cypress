"use client"
import { useLoader } from "@/lib/providers/loader-provider";
import {Vortex} from "react-loader-spinner"


export const GlobalLoader = () => {

    const {loading} = useLoader();;

    if(!loading) return null;
    
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-sm">
      <Vortex
        visible={loading}
        height="80"
        width="80"
        ariaLabel="vortex-loading"
        wrapperStyle={{}}
        wrapperClass="vortex-wrapper"
        colors={["red", "green", "blue", "yellow", "orange", "purple"]}
      />
    </div>
  );
};
