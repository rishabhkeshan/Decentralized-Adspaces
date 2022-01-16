import { useEffect, useState } from "react";
import NFTETHIcon from "../../assets/NFTETHIcon.svg";
import BuyNFTIllustration from "../../assets/BuyNFTIllustration.svg";
import Lottie from "lottie-react";

import "./Modal.css";
import BuyTransactionModal from "./BuyTransactionModal";

function BuyModal({
  buyNFTSlot,
  selectedNFTPrice,
  selectedNFTtoBuy,
  state,
  transactionModalOpen,
  setTransactionModalOpen,
  transactionModalStatus,
  setTransactionModalStatus,
}) {
  return (
    <div>
      {" "}
      <BuyTransactionModal
        open={transactionModalOpen}
        setOpen={setTransactionModalOpen}
        transactionModalStatus={transactionModalStatus}
        setTransactionModalStatus={setTransactionModalStatus}
      />
      <div className="buy-header">
        <div className="buy-header-text">
          <img className="ethicon" src={NFTETHIcon} alt="ETH Icon" />
          <div>BUY SLOT</div>
        </div>
        <div className="buy-header-info">
          Total NFTs: {state.imageData.length} | NFTs Sold:{" "}
          {state.soldTokens.length} | NFTs available:{" "}
          {state.imageData.length - state.soldTokens.length}
        </div>
      </div>
      <div className="modalmain-container">
        <div className="line-break"></div>
        <div className="buy-mm-info">
          <div>Total NFTs: {state.imageData.length}</div>
          <div>NFTs Sold: {state.soldTokens.length}</div>
          <div>
            NFTs available: {state.imageData.length - state.soldTokens.length}
          </div>
        </div>
        <div className="buy-container">
          <div className="buy-illustration">
            <img
              style={{ height: "300px" }}
              src={BuyNFTIllustration}
              alt="buy-nft-illustration"
            />
          </div>
          <div className="buy-receipt">
            <div className="receipt-header">
              You are buying slot{" "}
              {selectedNFTtoBuy < 9
                ? "#00" + selectedNFTtoBuy
                : selectedNFTtoBuy < 99
                ? "#0" + selectedNFTtoBuy
                : "#" + selectedNFTtoBuy}
            </div>
            <hr className="dashed-linebreak" />
            <div className="receipt-container">
              <div>Current Price</div>
              <div className="receipt-price">
                <div>{selectedNFTPrice}</div>
                <img
                  className="receipt-ethicon"
                  alt="ETH Icon"
                  src={NFTETHIcon}
                />
              </div>
              <div
                onClick={() => buyNFTSlot(selectedNFTtoBuy)}
                className="receipt-buybutton"
              >
                BUY NOW
              </div>
            </div>
            <hr className="dashed-linebreak" />
            <div className="receipt-footer"></div>
          </div>
        </div>
        <div className="line-break"></div>
      </div>
      <div className="modal-footer"></div>
    </div>
  );
}

export default BuyModal;
