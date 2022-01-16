import React, { useState, useEffect } from "react";
import mdhplogo from "../../assets/logo.png"
import discord from "../../assets/discord.png"
import telegram from "../../assets/telegram.png"
import twitter from "../../assets/twitter.png"
import { useHistory } from "react-router-dom";
import "./Header.css"
import Web3 from "web3"
import { useMetamask } from "../../metamaskReactHook/index";
import { useSnackbar } from "notistack";
import Dropdown from "./Dropdown";
const Header = ({walletConnected, account, buyMode, setBuyMode, manageModal, metaState}) => {
    const { connect } = useMetamask();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const history = useHistory();

      const connectMetamask = async () => {
        console.log("Hello");
        if (!metaState.isConnected) {
          (async () => {
            try {
              await connect(Web3);
              console.log(metaState);
            } catch (error) {
              console.log(error);
            }
          })();
        }
          if (metaState.chain.id !== null && !walletConnected)
          {
          console.log(metaState);
            enqueueSnackbar("Please connect to the Rinkeby Chain", {
              variant: "error",
            });
          }
      };


    return (
      <header className="header">
        <div className="social-container w-1/3 lg:w-2/5">
        </div>
        <div className="mdlogo-container w-1/3 lg:w-2/5 flex justify-center items-center">
          <a href="./">
            <img
              className="mdlogo"
              alt="Million Dollar Homepage Logo"
              src={mdhplogo}
            />
          </a>
        </div>
        <div className="flex lg:hidden justify-end w-1/3 lg:w-2/5">
          <Dropdown
            metaState={metaState}
            walletConnected={walletConnected}
            manageModal={manageModal}
            setBuyMode={setBuyMode}
            account={account}
            buyMode={buyMode}
            connectMetamask={connectMetamask}
          />
        </div>
        <div className="sidepanel w-1/3 lg:w-2/5 justify-end">
          {walletConnected ? (
            <div
              onClick={() => {
                manageModal();
              }}
              className="sp-text text-bheader"
            >
              Manage Ad
            </div>
          ) : null}
          <div
            onClick={() => {
              walletConnected
                ? setBuyMode(!buyMode)
                : enqueueSnackbar("Please connect your wallet first!", {
                    variant: "warning",
                  });
            }}
            className="buy-button"
          >
            {buyMode ? "Exit" : "Buy NFT"}
          </div>
          <div
            onClick={walletConnected ? null : connectMetamask}
            className="connect-button"
          >
            {walletConnected
              ? metaState.account[0].slice(0, 7)
              : "Connect Wallet"}
          </div>
        </div>
      </header>
    );
}
export default Header;