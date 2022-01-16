import { useEffect, useState } from "react";
import ModalHeader from "../ModalHeader.js/ModalHeader";
import NFTETHIcon from "../../assets/NFTETHIcon.svg";
import BuyNFTIllustration from "../../assets/BuyNFTIllustration.svg";
import "./Modal.css";
import BuyModal from "./BuyModal";
import ManageModal from "./ManageModal";

function Modal({
  onClickModalClose,
  buyNFTSlot,
  selectedNFTPrice,
  selectedNFTtoBuy,
  state,
  handleNFTData,
  updateNFTImage,
  nftNameChange,
  nftDescChange,
  nftUrlChange,
  changeSelectedNfttoUpdate,
  UpdateNft,
  buttonClicked,
  metaState,
  transactionModalOpen,
  setTransactionModalOpen,
  transactionModalStatus,
  setTransactionModalStatus,
  manageModalOpen,
  setManageModalOpen,
  manageModalStatus,
  setManageModalStatus,
}) {
  return (
    <div className="modal-container">
      <ModalHeader
        metaState={metaState}
        onClickModalClose={onClickModalClose}
      />
      {state.mode === "buy" ? (
        <BuyModal
          buyNFTSlot={buyNFTSlot}
          selectedNFTPrice={selectedNFTPrice}
          selectedNFTtoBuy={selectedNFTtoBuy}
          state={state}
          transactionModalOpen={transactionModalOpen}
          setTransactionModalOpen={setTransactionModalOpen}
          transactionModalStatus={transactionModalStatus}
          setTransactionModalStatus={setTransactionModalStatus}
        />
      ) : null}
      {state.mode === "manage" ? (
        <ManageModal
          updateNFTImage={updateNFTImage}
          state={state}
          handleNFTData={handleNFTData}
          nftDescChange={nftDescChange}
          UpdateNft={UpdateNft}
          nftUrlChange={nftUrlChange}
          nftNameChange={nftNameChange}
          changeSelectedNfttoUpdate={changeSelectedNfttoUpdate}
          manageModalOpen={manageModalOpen}
          setManageModalOpen={setManageModalOpen}
          manageModalStatus={manageModalStatus}
          setManageModalStatus={setManageModalStatus}
          buttonClicked
        />
      ) : null}
    </div>
  );
}

export default Modal;
