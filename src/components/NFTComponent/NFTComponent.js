import Web3 from "web3";
import React, { useEffect, useState } from "react";
import "./NFTComponent.css";
import soldIcon from "../../assets/soldLabel.svg";
import NFTETHIcon from "../../assets/NFTETHIcon.svg";
import videoIcon from "../../assets/video-thumbnail-icon.svg";
import useWindowSize from "../../utils/windowSize";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import 'react-tippy/dist/tippy.css';
import { Tooltip } from "react-tippy";


import $ from "jquery";
const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    outline: "none",
  },
  paper: {
    background:
      "radial-gradient(104.69% 104.69% at -4.69% 6.25%, #080D45 0%, #263C77 100%)",
    borderRadius: "40px",
    padding: theme.spacing(3),
    outline: "none",
    "@media (max-width:420px)": {
      padding: theme.spacing(2),
    },
    // width: "60vw",
    // "@media (max-width:640px)": {
    //   // eslint-disable-line no-useless-computed-key
    //   width: "400px",
    // },
    // "@media (max-width:420px)": {
    //   width: "300px",
    // },
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
  imagePrev: {
    borderRadius: "20px",
    "@media (max-width:640px)": {
      borderRadius: "10px",
    },
  },
}));
function NFTComponent({ imageData, buyMode, openAdUrl, handleBuy, showModal }) {
  const size = useWindowSize();
  const [NFTDim, setNFTDim] = useState(5.0);
  const [NFTRow, setNFTRow] = useState(17);
  const [NFTCol, setNFTCol] = useState(7);
  const [open, setOpen] = React.useState(false);
  const [viewNFTID, setviewNFTID] = React.useState("");
  const [viewNFTDet, setviewNFTDet] = React.useState("");
  const [tootltipInteractive,setTooltipInteractive]=useState(true);
  const classes = useStyles();

  const handleOpen = (index, items) => {
    setOpen(true);
    setTooltipInteractive(false);
    document.getElementById("responsive-layout").click();
    setviewNFTDet(items);
    setviewNFTID(index);
  };

  const handleClose = () => {
    setOpen(false);
    setTooltipInteractive(true);
  };
  const NFTImageSize = () => {
    if (viewNFTID % 3 !== 0 && viewNFTID / 3 >= 0) {
      return `h-14 w-28 md:h-32 md:w-64 lg:h-40 lg:w-80 xl:h-48 xl:w-96`;
    } else return `h-28 w-28 md:h-64 md:w-64 lg:h-80 lg:w-80 xl:h-96 xl:w-96`;
  };
  useEffect(() => {
    let windowRatio = size.width / (size.height - 80);
    // console.log(windowRatio);
    if (!showModal) {
      if (windowRatio > 1.9365) {
        let NFTSize = 6;
        while (
          parseInt(size.width) <
            ((19 * NFTSize) / 100) * parseInt(size.width) ||
          parseInt(size.height - 80) <
            ((9 * NFTSize) / 100) * parseInt(size.width)
        ) {
          NFTSize -= 0.1;
        }
        setNFTDim(NFTSize);
        setNFTRow(7);
        setNFTCol(17);
        $("#responsive-layout").css({
          "grid-template-columns": `repeat(17,${NFTSize}vw)`,
          "grid-template-rows": `repeat(7,${NFTSize}vw)`,
          "grid-gap": `${NFTSize / 10}vw`,
        });
        $(".square:nth-child(103)").css({ "grid-column": "2" });
      } else if (windowRatio > 1.068) {
        let NFTSize = 5;
        while (
          parseInt(size.width) >
            ((15 * NFTSize) / 100) * parseInt(size.width) &&
          parseInt(size.height - 80) >
            ((11 * NFTSize) / 100) * parseInt(size.width)
        ) {
          NFTSize += 0.2;
        }
        setNFTDim(NFTSize);
        setNFTRow(9);
        setNFTCol(13);
        $("#responsive-layout").css({
          "grid-template-columns": `repeat(13,${NFTSize}vw)`,
          "grid-template-rows": `repeat(9,${NFTSize}vw)`,
          "grid-gap": `${NFTSize / 10}vw`,
        });
        $(".square:nth-child(103)").css({ "grid-column": "12" });
      } else {
        let NFTSize = 5;
        while (
          parseInt(size.width) >
            ((11 * NFTSize) / 100) * parseInt(size.width) &&
          parseInt(size.height-80) > ((15 * NFTSize) / 100) * parseInt(size.width)
        ) {
          NFTSize += 0.2;
        }
        setNFTDim(NFTSize);
        setNFTRow(13);
        setNFTCol(9);
        $("#responsive-layout").css({
          "grid-template-columns": `repeat(9,${NFTSize}vw)`,
          "grid-template-rows": `repeat(13,${NFTSize}vw)`,
          "grid-gap": `${NFTSize / 10}vw`,
        });
        $(".square:nth-child(103)").css({ "grid-column": "4" });
      }
    } else {
      $("#responsive-layout").css({
        "grid-template-columns": `repeat(${NFTCol},${NFTDim}vw)`,
        "grid-template-rows": `repeat(${NFTRow},${NFTDim}vw)`,
        "grid-gap": `${NFTDim / 10}vw`,
      });
    }
  }, [size, showModal]);
  const slotPrice = (index) => {
    return (
      Math.trunc(
        ((Math.trunc((index + 2) / 3) * 0.008 + 0.8) / 4) *
          (((index % 3) % 2) + 1) *
          1000
      ) / 1000
    );
  };
  const getNFT = (items, index) => {
    if (items !== null || items?.isSold === true) {
      return (
        <>
          {buyMode && (
            <div className="buy-overlay hoverSold">
              <img className="soldImage" src={soldIcon} alt="sold icon" />
            </div>
          )}
          <Tooltip
            hideOnClick
            arrow
            style={{ height: "100%", width: "100%" }}
            interactive
            position="bottom"
            theme="tomato"
            html={
              <React.Fragment>
                <div>
                  <div style={{ display: "flex", padding: "12px" }}>
                    <div>
                      {" "}
                      {index < 9
                        ? "#00" + (index + 1)
                        : index < 99
                        ? "#0" + (index + 1)
                        : "#" + (index + 1)}{" "}
                    </div>
                    <div style={{ paddingLeft: "2px" }}>{items.imageName}</div>
                  </div>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <div
                      onClick={() => handleOpen(index, items)}
                      style={{
                        borderRadius: "100px",
                        padding: "6px",
                        border: "2.5px solid #00FFFB",
                        fontSize: "8px",
                        cursor: "pointer",
                        width: "100px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginRight: "4px",
                        fontWeight: "500",
                        color: "#00FFFB",
                      }}
                    >
                      View NFT Details
                    </div>
                    <div
                      onClick={() => {
                        openAdUrl(items.imageRedirect);
                      }}
                      style={{
                        borderRadius: "60px",
                        width: "100px",
                        padding: "6px",
                        cursor: "pointer",
                        marginLeft: "4px",
                        fontWeight: "500",
                        background:
                          "linear-gradient(180deg, #00FFFB 7.92%, #0094FF 224.69%)",
                        fontSize: "8px",
                        color: "#010C1C",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      Open Ad
                    </div>
                  </div>
                </div>
              </React.Fragment>
            }
          >
            <span
              className="img-block"
              style={{ position: "relative" }}
              // style={{ backgroundImage:`url(${items.imageURL})` }}
              onClick={() => {
                openAdUrl(items.imageRedirect);
              }}
            >
              {items.imageURL.trim() !== "" ? (
                items.filetype === "image" ? (
                  <img
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      cursor: "pointer",
                    }}
                    src={items.thumbnailURL}
                    alt="ad"
                  />
                ) : (
                  <>
                    <img
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        cursor: "pointer",
                        zIndex: "1",
                      }}
                      src={items.thumbnailURL}
                      alt="ad"
                    />
                    <img
                      style={{
                        position: "absolute",
                        display: "flex",
                        justifyContent: "flex-start",
                        alignItems: "flex-start",
                        bottom:"4px",
                        right:"4px",
                        zIndex:3,
                      }}
                      className="h-2.5 w-2.5 lg:h-7 lg:w-7"
                      src={videoIcon}
                      alt="video"
                    />
                  </>
                )
              ) : null}
            </span>
          </Tooltip>
        </>
      );
    } else {
      return (
        <div key={index} className="grid-box wrapper">
          {buyMode && (
            <div
              className="img-block hoverBuy buyEnabled"
              onClick={() => {
                handleBuy(index + 1);
              }}
            >
              <div className="hidden lg:flex">
                {" "}
                {index < 9
                  ? "#00" + (index + 1)
                  : index < 99
                  ? "#0" + (index + 1)
                  : "#" + (index + 1)}
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {slotPrice(index + 1)}
                <img className="ethNftIcon" src={NFTETHIcon} alt="ETH Icon" />
              </div>
            </div>
          )}
          <span className="img-block">
            {/* <img src={adImage} alt="ad" /> */}
          </span>
        </div>
      );
    }
  };
  const getLayout = (imageData) => {
    let content = [];
    for (let i = 1; i < imageData.length; i += 3) {
      content.push(
        <>
          {" "}
          <div
            style={
              imageData[i - 1]?.imageURL.includes("ipfs")
                ? { backgroundColor: "black" }
                : { backgroundColor: "rgba(0, 240, 255, 0.1667)" }
            }
            className="square sq grid-box wrapper"
            key={i - 1}
          >
            {/* <span>{i}</span> */}
            {getNFT(imageData[i - 1], i - 1)}
          </div>
          <div key={i * 1000} className="square rect">
            <div
              key={i}
              style={
                imageData[i]?.imageURL.includes("ipfs")
                  ? { backgroundColor: "black" }
                  : { backgroundColor: "rgba(0, 240, 255, 0.1667)" }
              }
              className="rectangle rect-top grid-box wrapper"
            >
              {/* <span>{i + 1}</span> */}
              {getNFT(imageData[i], i)}
            </div>
            <div
              key={i + 1}
              style={
                imageData[i + 1]?.imageURL.includes("ipfs")
                  ? { backgroundColor: "black" }
                  : { backgroundColor: "rgba(0, 240, 255, 0.1667)" }
              }
              className="rectangle rect-bottom grid-box wrapper"
            >
              {/* <span>{i + 2}</span> */}
              {getNFT(imageData[i + 1], i + 1)}
            </div>
          </div>
          {i === 172 ? (
            <div
              key={i + 2}
              style={
                imageData[i + 2]?.imageURL.includes("ipfs")
                  ? { backgroundColor: "black" }
                  : { backgroundColor: "rgba(0, 240, 255, 0.1667)" }
              }
              className="square sq grid-box wrapper"
            >
              {/* <span>{i}</span> */}
              {getNFT(imageData[i + 2], i + 2)}
            </div>
          ) : null}
        </>
      );
    }
    return content;
  };
  return (
    <section className="main-container">
      {size.height ? (
        <div id="responsive-layout" className="responsive-layout">
          {getLayout(imageData)}
        </div>
      ) : null}

      {/* {showModal?<Modal/>:null} */}
      <Modal
        id="hello"
        style={{ zIndex: 1000 }}
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div
                style={{ color: "#FFF", fontSize: "1.5rem", fontWeight: "600" }}
              >
                NFT Details
              </div>
              <div
                onClick={handleClose}
                style={{
                  color: "#00FFFB",
                  border: "1.5px solid #40F3FF",
                  boxSizing: "border-box",
                  padding: "8px 20px",
                  borderRadius: "100px",
                  cursor: "pointer",
                }}
              >
                Close
              </div>
            </div>
            <div className={classes.linebreak} />
            <div
              style={{ display: "flex", justifyContent: "space-between" }}
              className={classes.mainContainer}
            >
              <div className="w-36 sm:w-64">
                <div className="flex flex-col sm:flex-row justify-between">
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <div style={{ color: "#00FFFB" }}>Slot Number:</div>
                    <div style={{ color: "#FFF" }}>
                      {" "}
                      {viewNFTID < 9
                        ? "#00" + (viewNFTID + 1)
                        : viewNFTID < 99
                        ? "#0" + (viewNFTID + 1)
                        : "#" + (viewNFTID + 1)}{" "}
                    </div>
                  </div>
                  <div
                    className="pt-2 sm:pt-0"
                    style={{ display: "flex", flexDirection: "column" }}
                  >
                    <div style={{ color: "#00FFFB" }}>NFT Name:</div>
                    <div style={{ color: "#FFF" }}>{viewNFTDet.imageName}</div>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    marginTop: "1rem",
                  }}
                >
                  <div style={{ color: "#00FFFB" }}>Website:</div>
                  <div style={{ color: "#FFF" }}>
                    {viewNFTDet.imageRedirect}
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    marginTop: "1rem",
                  }}
                >
                  <div style={{ color: "#00FFFB" }}>NFT Description:</div>
                  <div style={{ color: "#FFF" }}>
                    {viewNFTDet?.imageDesc?.slice(0, 80)}
                  </div>
                </div>
              </div>
              <div style={{ paddingLeft: "5vw" }}>
                <div style={{ color: "#00FFFB" }}>Ad Preview:</div>
                <div
                  className={`${classes.imagePrev} ${NFTImageSize()}`}
                  style={
                    viewNFTDet.imageURL !== ""
                      ? {
                          backgroundColor: "#000",
                          border: "1px solid #3D7AD7",
                        }
                      : {
                          backgroundColor: "#141D5B",
                          border: "1px solid #3D7AD7",
                        }
                  }
                >
                  <span
                    className="img-block"
                    
                  >
                    {viewNFTDet?.imageURL?.trim() !== "" ? (
                      viewNFTDet.filetype === "image" ? (
                        <img
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain",
                          }}
                          src={viewNFTDet.imageURL}
                          alt="ad"
                        />
                      ) : (
                        <>
                        <video
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain",
                            borderRadius:"20px"
                          }}
                          controls
                          loop
                          src={viewNFTDet.imageURL}
                          alt="ad"
                        />
                        </>
                      )
                    ) : null}
                  </span>
                </div>
              </div>
            </div>
            <div className={classes.linebreak} />
            <div
              style={{
                display: "flex",
                marginBottom: "1rem",
              }}
            >
              <div style={{ color: "#00FFFB", marginRight: "4px" }}>
                Owned by:{" "}
              </div>
              <div style={{ color: "#FFF" }}>
                {viewNFTDet?.tokenOwner?.slice(0, 7)}
              </div>
            </div>
          </div>
        </Fade>
      </Modal>
    </section>
  );
}

export default NFTComponent;
