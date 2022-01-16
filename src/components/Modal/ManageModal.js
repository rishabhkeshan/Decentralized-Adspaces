import { useEffect, useState } from "react";
import NFTETHIcon from "../../assets/NFTETHIcon.svg";
import ManageAdIcon from "../../assets/ManageAdIcon.svg";
import fileUpload from "../../assets/fileUpload.svg";
import "./Modal.css";
import DragAndDrop from "../../utils/DragAndDrop";
import { DebounceInput } from "react-debounce-input";
import ManageTransactionModal from "./ManageTransactionModal";
import Dropzone, { useDropzone } from "react-dropzone";
import { useSnackbar } from "notistack";
import Switch from "react-switch";
import ThumbnailDropzone from "./ThumbnailDropzone";
import NFTDropzone from "./NFTDropzone";

function ManageModal({
  state,
  updateNFTImage,
  handleNFTData,
  nftNameChange,
  nftDescChange,
  nftUrlChange,
  changeSelectedNfttoUpdate,
  UpdateNft,
  buttonClicked,
  manageModalOpen,
  setManageModalOpen,
  manageModalStatus,
  setManageModalStatus,
}) {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [checked, setChecked] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [previewImg, setPreviewImg] = useState(null);
  const [nftUploadStatus, setNftUploadStatus] = useState(false);
  const [thumbnailUploadStatus, setThumbnailUploadStatus] = useState(false);
  const handleToggle = () => {
    setChecked(!checked);
  };
  const handleImageUpload = () => {
    setNftUploadStatus(true);
  };
  const handleThumbnailUpload = () => {
    setThumbnailUploadStatus(true);
  };
  const _base64ToArrayBuffer = (base64) => {
    var binary_string = window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
  };
  const handleThumbnailDrop = (file) => {
    let reader = new window.FileReader();
    reader.readAsDataURL(file.data);
    reader.onloadend = () => {
      let arrayBuff = null;
      arrayBuff = _base64ToArrayBuffer(reader.result.split(",")[1]);

      setImageFile(reader.result);
      handleThumbnailUpload();
      console.log(imageFile);
      handleNFTData(file, arrayBuff, "Thumbnail");
    };
  };
  const handleDrop = (file) => {
    let reader = new window.FileReader();
    reader.readAsDataURL(file.data);
    reader.onloadend = () => {
      let arrayBuff = null;
      arrayBuff = _base64ToArrayBuffer(reader.result.split(",")[1]);
      handleNFTData(file, arrayBuff, "NFT");
      handleImageUpload();
      if (file.type === "image") {
        setImageFile(reader.result);
        setPreviewImg(reader.result);
        handleThumbnailUpload();
        console.log(imageFile);
        handleNFTData(file, arrayBuff, "Thumbnail");
      }
      else{
        setThumbnailUploadStatus(false);
        setPreviewImg(false);
      }
    };
  };

  const NFTImageSize = () => {
    if (
      (state.selectedUpdateTokenId - 1) % 3 !== 0 &&
      (state.selectedUpdateTokenId - 1) / 3 >= 0
    ) {
      return `h-8 w-16 lg:h-24 lg:w-48 xl:h-32 xl:w-56`;
    } else return `h-16 w-16 lg:h-40 lg:w-40 xl:h-52 xl:w-52`;
  };
  const NFTOddEve = () => {
    if (
      (state.selectedUpdateTokenId - 1) % 3 !== 0 &&
      (state.selectedUpdateTokenId - 1) / 3 >= 0
    ) {
      return false;
    } else return true;
  };
  return (
    <div>
      {" "}
      <ManageTransactionModal
        open={manageModalOpen}
        setOpen={setManageModalOpen}
        manageModalStatus={manageModalStatus}
        setManageModalStatus={setManageModalStatus}
      />
      <div className="mm-header">
        <div className="buy-header-text">
          <img className="ethicon" src={ManageAdIcon} alt="ETH Icon" />
          <div>MANAGE AD</div>
        </div>
        <div className="managemodal-select-container">
          <div className="px-2">Select NFT:</div>

          <select
            onChange={(val) => {
              changeSelectedNfttoUpdate(val);
            }}
            className="dropdown-nft"
            name="selectList"
            id="selectList"
          >
             {" "}
            <option value="" disabled selected hidden>
              NFT ID
            </option>
            {state.tokensOwned
              ? state.tokensOwned
                  .sort((a, b) => a - b)
                  .map((val, index) => {
                    return (
                      <option value={val}>
                        {" "}
                        {val < 10
                          ? "#00" + val
                          : val < 100
                          ? "#0" + val
                          : "#" + val}{" "}
                      </option>
                    );
                  })
              : null}
          </select>
        </div>
      </div>
      <div className="mm-line-break"></div>
      <div className="managemodal-main-container">
        <div className="mm-left-container">
          <div className="phonemodal-select-container">
            <div className="px-2">Select NFT:</div>
            <select
              onChange={(val) => {
                changeSelectedNfttoUpdate(val);
              }}
              className="dropdown-nft"
              name="selectList"
              id="selectList"
            >
               {" "}
              <option value="" disabled selected>
                NFT ID
              </option>
              {state.tokensOwned
                ? state.tokensOwned
                    .sort((a, b) => a - b)
                    .map((val, index) => {
                      return <option value={val}>{val}</option>;
                    })
                : null}
            </select>
          </div>
          <div className="manageinput-text">Name your NFT</div>
          <input
            className="manageinput-field"
            value={state.nftName}
            maxLength={30}
            onChange={(e) => {
              nftNameChange(e);
            }}
            placeholder="This is a catchy NFT Name"
          />
          <div className="manageinput-text">Describe your NFT</div>
          <DebounceInput
            className="manageinput-field"
            onChange={(e) => nftDescChange(e)}
            debounceTimeout={300}
            textarea
            placeholder="This is a nice description of the uploaded NFT"
          />
          <div className="manageinput-text">Link your website with the NFT</div>
          <DebounceInput
            onChange={(e) => nftUrlChange(e)}
            className="manageinput-field"
            debounceTimeout={300}
            placeholder="This is the URL which people will be redirected to"
          />
          <div className="mobile-upload">
            <div className="manageinput-text flex text-center justify-center items-center">
              Upload your NFT
            </div>
            <div className={`${NFTOddEve() ? "row-layout" : "column-layout"}`}>
              <div className="flex flex-col">
                <NFTDropzone
                  nftUploadStatus={nftUploadStatus}
                  handleImageUpload={handleImageUpload}
                  state={state}
                  NFTImageSize={NFTImageSize}
                  handleDrop={handleDrop}
                  setImageFile={setImageFile}
                />
                <p className="upload-img-text text-center justify-center">
                  NFT media
                </p>
              </div>
              <div className="flex flex-col">
                <ThumbnailDropzone
                  nftUploadStatus={nftUploadStatus}
                  handleThumbnailUpload={handleThumbnailUpload}
                  state={state}
                  NFTImageSize={NFTImageSize}
                  handleDrop={handleDrop}
                  imageFile={imageFile}
                  setImageFile={setImageFile}
                  previewImg={previewImg}
                  handleThumbnailDrop={handleThumbnailDrop}
                  setPreviewImg={setPreviewImg}
                />
                <p className="upload-img-text text-center justify-center">
                  Thumbnail
                </p>
              </div>
            </div>
          </div>
          {state.isReset ? (
            <div
              onClick={() => {
                UpdateNft();
              }}
              className="resetnft-button"
            >
              Reset NFT
            </div>
          ) : (
            <div
              onClick={() => {
                if (nftUploadStatus && thumbnailUploadStatus) UpdateNft();
                else
                  enqueueSnackbar("Please upload both NFT and thumbnail", {
                    variant: "error",
                  });
              }}
              className="updatenft-button"
              disabled={buttonClicked}
            >
              Update NFT
            </div>
          )}
          {console.log(nftUploadStatus)}
        </div>
        <div className="mm-right-container">
          <div className="upload-text text-center justify-center">
            Upload your NFT
          </div>
          <div className={`${NFTOddEve() ? "row-layout" : "column-layout"}`}>
            <div className="flex flex-col">
              <NFTDropzone
                nftUploadStatus={nftUploadStatus}
                handleImageUpload={handleImageUpload}
                state={state}
                NFTImageSize={NFTImageSize}
                handleDrop={handleDrop}
                setImageFile={setImageFile}
              />
              <p className="upload-img-text text-center justify-center">
                Upload your NFT media
              </p>
            </div>
            <div className="flex flex-col">
              <ThumbnailDropzone
                nftUploadStatus={nftUploadStatus}
                handleThumbnailUpload={handleThumbnailUpload}
                state={state}
                NFTImageSize={NFTImageSize}
                handleDrop={handleDrop}
                imageFile={imageFile}
                setImageFile={setImageFile}
                previewImg={previewImg}
                handleThumbnailDrop={handleThumbnailDrop}
                setPreviewImg={setPreviewImg}
              />
              <p className="upload-img-text text-center justify-center">
                Upload your NFT Thumbnail
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManageModal;
