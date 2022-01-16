import React, { useState, useEffect } from "react";
import mdhplogo from "../../assets/logo.png";
import "./ModalHeader.css";
import Web3 from "web3";
import { useMetamask } from "../../metamaskReactHook/index";
const ModalHeader = ({ onClickModalClose }) => {
  const { connect, metaState } = useMetamask();

  return (
    <header className="modalheader">
      <div>
        <a href="./">
          <img
            className="logo"
            alt="Million Dollar Homepage Logo"
            src={mdhplogo}
          />
        </a>
      </div>
      <div className="mh-sidepanel">
        <div
        //   onClick={() => {
        //     walletConnected
        //       ? setBuyMode(!buyMode)
        //       : alert("Please connect your wallet first!");
        //   }}
        onClick={()=>{
            onClickModalClose()
        }}
          className="buy-button"
        >
          Close
        </div>
      </div>
    </header>
  );
};
export default ModalHeader;
