/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useRef } from "react";
import { Transition } from "@headlessui/react";

import Hamburger from "../../assets/Hamburger.svg";
import Cross from "../../assets/Cross.svg";
import Web3 from "web3";
import { useMetamask } from "../../metamaskReactHook/index";
import { useHistory } from "react-router-dom";

import { useSnackbar } from "notistack";

function Dropdown({
    walletConnected,
    account,
    buyMode,
    setBuyMode,
    manageModal,
    metaState
}) {
    const [isOpen, setIsOpen] = useState(false);
    const menu = useRef(null);
    const { connect } = useMetamask();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const history = useHistory();

    const connectMetamask = async () => {
        console.log(metaState)
        if (!metaState.isConnected) {
                try {
                    await connect(Web3);
                    console.log(metaState);
                } catch (error) {
                    console.log(error);
                }
        }
        if (metaState.chain.id !== null && !walletConnected)
            enqueueSnackbar(`Please connect to the Rinkeby Chain ${metaState.chain.id}`, {
                variant: "error",
            });
    };
            const handleClick = () => {
              history.push("/leaderboard");
            };
    return (
      <div>
        <div className="flex lg:hidden">
          <button
            onClick={() => {
              setTimeout(() => {
                setIsOpen(!isOpen);
              }, 100);
            }}
            type="button"
            className="p-2"
            aria-controls="mobile-menu"
            aria-expanded="false"
          >
            {!isOpen ? <img src={Hamburger} alt="cross" /> : null}
          </button>
        </div>

        <Transition show={isOpen}>
          <div
            ref={menu}
            className="lg:hidden absolute right-2 top-4 rounded-xl z-50"
            id="mobile-menu"
          >
            <button
              className="absolute right-2 top-2"
              type="button"
              onClick={() => {
                menu.current.classList.add("mobile-menu-hidden");
                setIsOpen(!isOpen);
              }}
              // onClick={() => setIsOpen(!isOpen)}
            >
              <img src={Cross} alt="cross" />
            </button>
            <div className="space-y-1 w-full mr-12 flex flex-col">
              <div className="mb-3 mt-8 flex">
                <div
                  onClick={() => connectMetamask()}
                  className="dd-connect-button"
                >
                  {walletConnected ? account.slice(0, 7) : "Connect Wallet"}
                </div>
              </div>

              <div className="flex" style={{ marginBottom: "12px" }}>
                <div
                  onClick={() => {
                    walletConnected
                      ? setBuyMode(!buyMode)
                      : enqueueSnackbar("Please connect your wallet first!", {
                          variant: "warning",
                        });
                  }}
                  className="dd-buy-button"
                >
                  {buyMode ? "Exit" : "Buy NFT"}
                </div>
              </div>
              {walletConnected ? (
                <div className="flex" style={{ marginBottom: "12px" }}>
                  <div
                    onClick={() => {
                      manageModal();
                    }}
                    className="text-bheader sp-text"
                  >
                    Manage Ad
                  </div>
                </div>
              ) : null}
              <div className="flex" style={{ marginBottom: "12px" }}>
              </div>

              <div className="flex" style={{ marginBottom: "12px" }}>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    );
}

export default Dropdown;
