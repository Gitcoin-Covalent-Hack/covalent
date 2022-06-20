import React, { createContext, useReducer } from "react";

const initialState = { address: "" };

const state = [initialState];

export const StoreContext = createContext([...state]);

// global reducer state that can override the properties with payload
const Reducer = (state, action) => {
  return { ...state, ...action.payload };
};

const StoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(Reducer, initialState);

  /**----------------------
   * NOTE: from dispatch send data as payload to override the state
   * eg: dispatch({ payload: { address: "cool" } }
   * to access the state use   const [state, dispatch] = useStore(); in component
   * ---------------------*/

  return <StoreContext.Provider value={[state, dispatch]}>{children}</StoreContext.Provider>;
};

export default StoreProvider;
