import Web3 from "web3";
import React, { useEffect, useState } from "react";
// import "./NFTComponent.css";
import soldIcon from "../../assets/soldLabel.svg";
import NFTETHIcon from "../../assets/NFTETHIcon.svg";
import useWindowSize from "../../utils/windowSize";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import Lottie from "lottie-react";
import ConnectToChain from "../../assets/Connect-to-chain.json";
import ConnectToSuccess from "../../assets/Chain-to-success.json";
import ConnectToFailure from "../../assets/Chain-to-failure.json";
import $ from "jquery";;
const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    outline: "none",
    zIndex: "9999",
  },
  paper: {
    background:
      "radial-gradient(172.31% 172.31% at 14.21% 0.22%, #3478DF 0.01%, #AD00FF 100%)",
    borderRadius: "35px",
    padding: theme.spacing(2, 4, 3),
    outline: "none",
    width: "600px",
    "@media (max-width:640px)": {
      // eslint-disable-line no-useless-computed-key
      width: "400px",
    },
    "@media (max-width:420px)": {
      // eslint-disable-line no-useless-computed-key
      width: "300px",
    },
  },

  linebreak: {
    height: "1.5px",
    width: "100%",
    backgroundColor: "#3d7ad7",
    opacity: "0.3",
    margin: "auto",
    marginTop: "1rem",
    marginBottom: "1rem",
  },
}));
function BuyTransactionModal({
  imageData,
  buyMode,
  openAdUrl,
  handleBuy,
  showModal,
  open,
  setOpen,
  transactionModalStatus
}) {
  const size = useWindowSize();
  const [viewNFTID, setviewNFTID] = React.useState("");
  const [viewNFTDet, setviewNFTDet] = React.useState("");
  const classes = useStyles();

  const handleOpen = (index, items) => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  
  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      className={classes.modal}
      open={open}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
        <div className={classes.paper}>
          <div
            className="flex flex-col justify-between items-center"
            style={{
              display: "flex",
            }}
          >
            {console.log(transactionModalStatus)}
            <Lottie
              animationData={
                transactionModalStatus === "success"
                  ? ConnectToSuccess
                  : transactionModalStatus === "failure"
                  ? ConnectToFailure
                  : ConnectToChain
              }
            />
            <div className="text-white text-center">
              {transactionModalStatus === "success"
                ? "Transaction  successful! You can now manage your Ad"
                : transactionModalStatus === "failure"
                ? "Oops! We have encountered an error. Your purchase couldn’t be completed"        
                : "Almost there...! NFT purchase in progress"}
            </div>
          </div>
        </div>
      </Fade>
    </Modal>
  );
}

export default BuyTransactionModal;
