import { createContext, useContext } from "react";

export const NetworkContext = createContext();

export const useNetworkContext = () => {
    const ctx = useContext(NetworkContext);
    if (!ctx) throw new Error("useNetwork must be used inside NetworkProvider");
    return ctx
};
