import Web3 from "web3";
import React, { useEffect, useState } from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import Lottie from "lottie-react";
import ManageSlot from "../../assets/Manage-Slot.json";
import SlotSuccess from "../../assets/Slot-success.json";
import SlotFailure from "../../assets/Slot-failed.json";
import $ from "jquery";
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
function ManageTransactionModal({
  open,
  setOpen,
  manageModalStatus,
}) {
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
            <Lottie
              animationData={
                manageModalStatus === "success"
                  ? SlotSuccess
                  : manageModalStatus === "failure"
                  ? SlotFailure
                  : ManageSlot
              }
            />
            <div className="text-white">
              {manageModalStatus === "success"
                ? "To the Moon! Your slot has been updated successfully!"
                : manageModalStatus === "failure"
                ? "Oops! Your slot couldn’t be updated. Please try again!"
                : "Your slot is being updated with your NFT. Almost there ...."}
            </div>
          </div>
        </div>
      </Fade>
    </Modal>
  );
}

export default ManageTransactionModal;
