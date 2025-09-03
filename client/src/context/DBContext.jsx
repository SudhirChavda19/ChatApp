import { createContext, useContext } from "react";

export const DBContext = createContext();

export const useDBContext = () => {
    return useContext(DBContext);
};