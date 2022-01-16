import Header from "../components/Header/Header";
import Web3 from "web3";
import React, { useState, useEffect } from "react";
import { useMetamask } from "../metamaskReactHook/index";
import BigNumber from "bignumber.js";
import NFTComponent from "../components/NFTComponent/NFTComponent";
import {
  CONTRACT_ABI_POOL,
  CONTRACT_ADDRESS_POOL,
  GATEWAY_URL,
} from "../contracts/config";
import { useSnackbar } from "notistack";
import { crop } from "../utils/Crop";
import { ethers } from "ethers";

import ipfs from "../ipfs/ipfs";
import { CID } from "ipfs-http-client";
import {
  ApolloClient,
  InMemoryCache,
  gql,
  cache,
  // selectHttpOptionsAndBody,
} from "@apollo/client";
import Modal from "../components/Modal/Modal";
// const fs = require("fs");
const { Readable, Duplex } = require("stream");
const pinataSDK = require("@pinata/sdk");
const pinata = pinataSDK(
  "b5fcfe4ea1ac2d0a267b",
  "ec1c1956f68a745fef341d57a394ea5cb5dbba6c77a0f986d354868978f79961"
);
const fs = require("fs");
const APIURL = "https://api.studio.thegraph.com/query/1204/mutest5/v0.0.2";
const client = new ApolloClient({
  uri: APIURL,
  cache: new InMemoryCache(),
});

const defaultWeb3 = new Web3(
  "https://rinkeby.infura.io/v3/6351bb49adde41ec86bd60b451b9f1c5"
);
const web3Provider = new ethers.providers.InfuraProvider(
  "rinkeby",
  "6351bb49adde41ec86bd60b451b9f1c5"
);
const HomeScreen = () => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [transactionModalOpen, setTransactionModalOpen] = useState(false);
  const [transactionModalStatus, setTransactionModalStatus] = useState("");
  const [manageModalOpen, setManageModalOpen] = useState(false);
  const [manageModalStatus, setManageModalStatus] = useState("");
  const desiredChainId = "4";
  const nftCount = 175;
  const { metaState } = useMetamask();
  const currentChainId = metaState.chain.id?.toString();
  const [state, setState] = useState({
    imageData: new Array(nftCount).fill(null),
    soldTokens: [],
    tokensOwned: [],
    selectedNFTtoBuy: null,
    selectedNFTPrice: null,
    mode: "buy",
    showModal: false,
    ipfsHash: "",
    selectedUpdateTokenId: null,
    nftName: "",
    nftDesc: "",
    nftUrl: "",
    fileUploaded: { status: false, name: "", type: "" },
    thumbnailUploaded: { status: false, name: "", type: "" },
    buffer: null,
    thumbnailBuffer: null,
    isReset: true,
  });
  const [buyMode, setBuyMode] = useState(false);
  const [updateNFTImage, setUpdateNFTImage] = useState(null);
  const [buttonClicked, setButtonClicked] = useState(false);

  const walletConnected = currentChainId === desiredChainId;
  const web3 = walletConnected ? new Web3(Web3.givenProvider) : defaultWeb3;
  const contract = new web3.eth.Contract(
    CONTRACT_ABI_POOL,
    CONTRACT_ADDRESS_POOL
  );

  const account = walletConnected ? metaState.account[0] : "";
  const changeSelectedNfttoUpdate = (val) => {
    console.log(val.target.value);
    setState((oldState) => ({
      ...oldState,
      selectedUpdateTokenId: parseInt(val.target.value),
    }));
  };
  const nftUrlChange = (e) => {
    console.log(e.target.value);
    setState((oldState) => ({
      ...oldState,
      isReset: false,
      nftUrl: e.target.value,
    }));
  };
  const nftNameChange = (e) => {
    console.log(e.target.value);
    console.log(e.target.value.trim().length);
    if (e.target.value.trim().length > 30) {
      enqueueSnackbar("Length of name should be less than 30", {
        variant: "error",
      });
    }
    setState((oldState) => ({
      ...oldState,
      isReset: false,
      nftName: e.target.value,
    }));
  };
  const nftDescChange = (e) => {
    setState((oldState) => ({
      ...oldState,
      isReset: false,
      nftDesc: e.target.value,
    }));
  };
  const replaceWhitespace = (str = "") => {
    let res = "";
    const { length } = str;
    for (let i = 0; i < length; i++) {
      const char = str[i];
      if (!(char === " ")) {
        res += char;
      } else {
        res += "%20";
      }
    }
    return res;
  };
  const UpdateNft = async (mode) => {
    setButtonClicked(true);
    let url = "";
    let result = null;
    let thumbnailResult = null;
    if (state.selectedUpdateTokenId !== null && !state.isReset) {
      setManageModalOpen(true);
      if (state.nftUrl.trim() !== "") {
        if (state.nftUrl.indexOf("http://") !== 0) {
          if (state.nftUrl.indexOf("https://") !== 0)
            url = "http://" + state.nftUrl;
          else url = state.nftUrl;
        } else {
          url = state.nftUrl;
        }
      }

      let pinResponse = null;
      let thumbnailPinResponse = null;
      console.log(state.buffer, state.thumbnailBuffer);
      if (state.buffer && state.thumbnailBuffer) {
        try {
          result = await ipfs.add(state.buffer, { pin: true });
          thumbnailResult = await ipfs.add(state.thumbnailBuffer, {
            pin: true,
          });
        } catch (err) {
          setManageModalStatus("failure");
          console.log(err);
        }
        if (result && thumbnailResult) {
          pinResponse = await pinata.pinByHash(result.path);
          thumbnailPinResponse = await pinata.pinByHash(thumbnailResult.path);
          console.log("pinResponse", pinResponse);
          setState((oldState) => ({
            ...oldState,
            ipfsHash: pinResponse.ipfsHash,
            thumbnailIpfsHash: thumbnailPinResponse.ipfsHash,
          }));
        }
      }

      let imgUrl = "";
      let ipfsImgUrl = "";
      let thubmnailImgUrl = "";
      if (
        pinResponse?.ipfsHash.trim().length > 0 &&
        thumbnailPinResponse?.ipfsHash.trim().length > 0
      ) {
        imgUrl = `${GATEWAY_URL}${pinResponse.ipfsHash}`;
        thubmnailImgUrl = `${GATEWAY_URL}${thumbnailPinResponse.ipfsHash}`;
        ipfsImgUrl = `ipfs://${pinResponse.ipfsHash}`;
      }
      let pinataNFT = null;
      console.log("hi", state.nftName);
      const doc = JSON.stringify({
        name: state.nftName,
        description: state.nftDesc,
        image: ipfsImgUrl,
        external_url: url,
        type: state.fileUploaded.type,
      });
      try {
        pinataNFT = await pinata.pinJSONToIPFS(JSON.parse(doc));
        console.log("pr", pinataNFT);
      } catch (err) {
        setManageModalStatus("failure");
        console.log(err);
      }
      var cidLink =
        "ipfs://" +
        pinataNFT.IpfsHash +
        "?filename=" +
        replaceWhitespace(state.nftName) +
        "?type=" +
        state.fileUploaded.type +
        ".json";
      console.log(cidLink);
      let updateResult = null;
      let option = await getGasPrice();
      console.log("imgurl", imgUrl);
      console.log("thumbnail imgurl", thubmnailImgUrl);
      try {
        updateResult = await contract.methods
          .setTokenURI(
            state.selectedUpdateTokenId,
            cidLink,
            state.nftName,
            state.nftDesc,
            imgUrl,
            thubmnailImgUrl,
            url
          )
          .send({ from: account, option });
      } catch (err) {
        setManageModalStatus("failure");
        enqueueSnackbar(err.message, { variant: "error" });
      }
      if (updateResult) {
        setState((oldState) => ({
          ...oldState,
          ipfsHash: "",
          selectedUpdateTokenId: null,
          nftUrl: "",
          nftDesc: "",
          nftName: "",
          fileUploaded: { status: false, name: "", type: "" },
          buffer: null,
        }));
        setManageModalStatus("success");
        setTimeout(() => {
          showModalFunc();
          enqueueSnackbar("Transaction Successful", { variant: "success" });
          loadBlockchainData();
          setManageModalStatus("");
          setUpdateNFTImage(null);
          setManageModalOpen(false);
        }, 2500);
      }
    } else if (state.selectedUpdateTokenId !== null && state.isReset) {
      setManageModalOpen(true);
      console.log("i executed");
      let updateResult = null;
      let option = await getGasPrice();
      try {
        updateResult = await contract.methods
          .setTokenURI(
            state.selectedUpdateTokenId,
            " ",
            " ",
            " ",
            " ",
            " ",
            " "
          )
          .send({ from: account, option });
      } catch (err) {
        setManageModalStatus("failure");
        enqueueSnackbar(err.message, { variant: "error" });
      }
      if (updateResult) {
        setState((oldState) => ({
          ...oldState,
          ipfsHash: "",
          thumbnailIpfsHash: "",
          selectedUpdateTokenId: null,
          nftUrl: "",
          nftDesc: "",
          nftName: "",
          fileUploaded: { status: false, name: "", type: "" },
          buffer: null,
          thumbnailBuffer: null,
        }));
        setManageModalStatus("success");
        setTimeout(() => {
          showModalFunc();
          enqueueSnackbar("Transaction Successful", { variant: "success" });
          loadBlockchainData();
          setManageModalStatus("");
          setUpdateNFTImage(null);
          setManageModalOpen(false);
        }, 2500);
      }
    } else {
      enqueueSnackbar("Please select a NFT ID", { variant: "error" });
    }
    setButtonClicked(false);
    setTimeout(() => {
      setManageModalOpen(false);
      setManageModalStatus("");
    }, 2800);
  };
  const loadBlockchainData = async () => {
    console.log("I was called");
    // let NFTData = null;
    const tokensQuery = `
    query {
      tokenEntities {
        id
        tokenNumber
        tokenURI
        tokenName
        tokenDes
        tokenImage
        tokenThumb
        tokenOwner
        tokenRed
      }
    }
    `;

    try {
      const tokensData = await client.query({
        query: gql(tokensQuery),
        fetchPolicy: "network-only",
      });
      const NFTData = tokensData.data.tokenEntities;

      console.log("Subgraph data: ", tokensData.data.tokenEntities);
      if (NFTData) {
        let tokenSold = NFTData.reduce((acc, val) => {
          acc.push(Number(val.tokenNumber));
          return acc;
        }, []);
        console.log("token sold", tokenSold);
        // setSoldTokens(tokenSold);
        let data = NFTData.reduce((acc, val) => {
          let image = {};
          image["imageName"] = val.tokenName;
          image["imageDesc"] = val.tokenDes;
          image["imageRedirect"] = val.tokenRed;
          image["imageURL"] = val.tokenImage;
          image["thumbnailURL"] = val.tokenThumb;
          image["tokenID"] = val.tokenNumber;
          image["tokenOwner"] = val.tokenOwner;
          image["filetype"] = val.tokenURI.includes("video")
            ? "video"
            : "image";
          image["isEditable"] = false;
          image["isSold"] = false;
          acc.push(image);
          return acc;
        }, []);
        let newArr = [...state.imageData];

        data.forEach((val, index) => {
          newArr[Number(val.tokenID) - 1] = val;
        });
        setState((oldState) => ({
          ...oldState,
          soldTokens: tokenSold,
          imageData: newArr,
        }));

        console.log("imagedata after state update", state.imageData);

        if (walletConnected) {
          console.log("inside owners");
          const accountString = account.toString();
          const tokensHeldQuery = `
          query {
            tokenEntities
            
            ( where: {tokenOwner_contains: "${accountString}"} )
            
            {
              tokenNumber
            }
          }
          `;
          // let tokensheld = null;
          const tokensHeldData = await client.query({
            query: gql(tokensHeldQuery),
            fetchPolicy: "network-only",
          });

          let tokensHeld = tokensHeldData?.data?.tokenEntities;

          if (tokensHeld && tokensHeld.length > 0) {
            let tokenHeld = tokensHeld.reduce((acc, val) => {
              acc.push(Number(val.tokenNumber));
              return acc;
            }, []);

            console.log("token data line 138: ", tokenHeld);
            let imageDataNew = newArr;
            console.log(imageDataNew, "idn");
            tokenHeld.forEach((val) => {
              console.log(val - 1, "val");
              imageDataNew[parseInt(val - 1)].isEditable = true;
            });
            setState((oldState) => ({
              ...oldState,
              tokensOwned: tokenHeld.sort((a, b) => a - b),
              imageData: imageDataNew,
            }));
          } else {
            setState((oldState) => ({
              ...oldState,
              tokensOwned: [],
            }));
            console.log("Hello");
          }
        } // end of if wallet connected
      } // end of if NFTData
    } catch (e) {
      //end of try
      console.log("Error fetching Ad Data");
    } // end of catch
  };
  useEffect(() => {
    loadBlockchainData();
  }, [walletConnected, account]);
  const _base64ToArrayBuffer = (base64) => {
    var binary_string = window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
  };
  const generateVideoThumbnail = (files) => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      const video = document.createElement("video");

      // this is important
      video.autoplay = true;
      video.muted = true;
      video.src = URL.createObjectURL(files);

      video.onloadeddata = () => {
        let ctx = canvas.getContext("2d");

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        video.pause();
        return resolve(canvas.toDataURL("image/png"));
      };
    });
  };
  const handleNFTData = (file, buffer, category) => {
    if (category === "NFT") {
      setState((oldState) => ({
        ...oldState,
        fileUploaded: file,
        isReset: false,
        buffer: buffer,
      }));
    } else {
      setState((oldState) => ({
        ...oldState,
        isReset: false,
        thumbnailBuffer: buffer,
      }));
    }
  };
  const slotPrice = (index) => {
    return (
      Math.trunc(
        ((Math.trunc((index + 2) / 3) * 0.008 + 0.8) / 4) *
          (((index % 3) % 2) + 1) *
          1000
      ) / 1000
    );
  };
  const openAdUrl = (url) => {
    console.log(url);
    if (url.trim() !== "") {
      var win = window.open(url, "_blank");
      win.focus();
    } else {
      enqueueSnackbar("No Url Given", { variant: "info" });
    }
  };
  const handleBuy = async (index) => {
    console.log(state.soldTokens, "st");
    console.log("index", index);
    if (state.soldTokens.includes(index) === false) {
      const price = slotPrice(index);
      setState((oldState) => ({
        ...oldState,
        // soldTokens : ,
        selectedNFTtoBuy: index,
        selectedNFTPrice: price,
        mode: "buy",
        showModal: !state.showModal,
      }));
    } else {
      enqueueSnackbar("Slot currently not available for sale", {
        variant: "error",
      });
    }
  };
  const onClickModalClose = () => {
    setState((oldState) => ({
      ...oldState,
      showModal: !state.showModal,
      isReset: true,
    }));
  };
  const showModalFunc = () => {
    setState((oldState) => ({
      ...oldState,
      showModal: !state.showModal,
    }));

    if (state.showModal === true) {
      setState((oldState) => ({
        ...oldState,
        ipfsHash: "",
        thumnailIpfsHash: "",
        selectedUpdateTokenId: null,
        nftUrl: "",
        fileUploaded: { status: false, name: "" },
        buffer: null,
        thumbnailBuffer: null,

        isReset: true,
      }));
    }
  };
  const showManageModalFunc = () => {
    setState((oldState) => ({
      ...oldState,
      showModal: !state.showModal,
      mode: "manage",
    }));

    if (state.showModal === true) {
      setState((oldState) => ({
        ...oldState,
        ipfsHash: "",
        thumbnailIpfsHash: "",
        selectedUpdateTokenId: null,
        nftUrl: "",
        fileUploaded: { status: false, name: "" },
        buffer: null,
        thumbnailBuffer: null,
      }));
    }
  };
  async function getGasPrice() {
    return await web3Provider.getFeeData().then(async function (res) {
      let maxFeePerGas = res.maxFeePerGas;
      let maxPriorityFeePerGas = res.maxPriorityFeePerGas;
      console.log("maxFeePerGas: ", maxFeePerGas.toString());
      console.log("maxPriorityFeePerGas:", maxPriorityFeePerGas.toString());

      return {
        maxFeePerGas: maxFeePerGas,
        maxPriorityFeePerGas: maxPriorityFeePerGas,
      };
    });
  }

  const buyNFTSlot = async (index) => {
    setButtonClicked(true);
    setTransactionModalOpen(true);
    let buyAmount = new BigNumber(slotPrice(index)).multipliedBy(
      Math.pow(10, 18)
    );
    console.log("Amount", slotPrice(index));
    console.log(index, state.soldTokens);
    let option = await getGasPrice();
    let buyResult = null;
    if (state.soldTokens.includes(index) === false) {
      try {
        buyResult = await contract.methods
          .mint(index.toString())
          .send({ from: account, value: buyAmount.toString(), option });
      } catch (err) {
        if (err.code === "4001") console.log(err.message);
        else {
          console.log(err.message);
          setTransactionModalStatus("failure");
          setTimeout(() => {
            showModalFunc();
            setTransactionModalOpen(false);
            enqueueSnackbar("Transaction failed", { variant: "error" });
            loadBlockchainData();
            setTransactionModalStatus("");
          }, 2500);
        }
      }
      if (buyResult) {
        setTransactionModalStatus("success");
        setTimeout(() => {
          showModalFunc();
          setTransactionModalOpen(false);
          enqueueSnackbar("Transaction Successful", { variant: "success" });
          loadBlockchainData();
          setTransactionModalStatus("");
        }, 2500);
      }
    } else {
      enqueueSnackbar("Sorry the selected slot is sold", {
        variant: "error",
      });
      setTransactionModalOpen(false);
      showModalFunc();
      loadBlockchainData();
    }
    // setTransactionModalOpen(false);
    setButtonClicked(false);
  };
  return (
    <>
      {state.showModal ? (
        <Modal
          buyNFTSlot={buyNFTSlot}
          state={state}
          metaState={metaState}
          manageModalOpen={manageModalOpen}
          setManageModalOpen={setManageModalOpen}
          manageModalStatus={manageModalStatus}
          setManageModalStatus={setManageModalStatus}
          transactionModalOpen={transactionModalOpen}
          setTransactionModalOpen={setTransactionModalOpen}
          transactionModalStatus={transactionModalStatus}
          setTransactionModalStatus={setTransactionModalStatus}
          handleNFTData={handleNFTData}
          selectedNFTPrice={state.selectedNFTPrice}
          selectedNFTtoBuy={state.selectedNFTtoBuy}
          onClickModalClose={onClickModalClose}
          updateNFTImage={updateNFTImage}
          nftNameChange={nftNameChange}
          nftDescChange={nftDescChange}
          nftUrlChange={nftUrlChange}
          UpdateNft={UpdateNft}
          changeSelectedNfttoUpdate={changeSelectedNfttoUpdate}
          buttonClicked={buttonClicked}
        />
      ) : null}
      <>
        <Header
          walletConnected={walletConnected}
          account={account}
          buyMode={buyMode}
          setBuyMode={setBuyMode}
          slotPrice={slotPrice}
          manageModal={showManageModalFunc}
          metaState={metaState}
        />
        <NFTComponent
          imageData={state.imageData}
          buyMode={buyMode}
          openAdUrl={openAdUrl}
          handleBuy={handleBuy}
          showModal={state.showModal}
          buyNFTSlot={buyNFTSlot}
        />
      </>
    </>
  );
};

export default HomeScreen;
