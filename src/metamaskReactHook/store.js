import React, { createContext, useReducer } from "react";

const initialState = {
  account: [],
  chain: { id: null, name: "" },
  isConnected: false,
  web3: null,
};
const reducer = (state, action) => {
  switch (action.type) {
    case "SET_ACCOUNT":
      return { ...state, account: action.payload };
    case "SET_CHAIN":
      return { ...state, chain: action.payload };
    case "SET_CONNECTED":
      return { ...state, isConnected: action.payload };
    case "SET_WEB3":
      return { ...state, web3: action.payload };
    case "SET_INITALCONNECT":
      return {
        ...state,
        account: action.payload.account,
        chain: action.payload.chainDet,
        isConnected: action.payload.account ? true : false,
        web3: action.payload._web3,
      };
    default:
      console.warn(`Unknown action type: ${action.type}`);
      return state;
  }
};

const MetaStateContext = createContext(initialState);
const MetamaskStateProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <MetaStateContext.Provider value={{ state, dispatch }}>
      {children}
    </MetaStateContext.Provider>
  );
};

export { MetaStateContext, MetamaskStateProvider };
