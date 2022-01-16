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

function ThumbnailDropzone({
  state,
  handleDrop,
  imageFile,
  previewImg,
  setPreviewImg,
  setImageFile,
  handleThumbnailDrop,
  updateNFTImage,
}) {
  const maxSize = 5242880;
  const maxThumbnailSize = 5242880;
  const [fileData, setFileData] = useState([]);
  const [errors, setErrors] = useState(null);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [checked, setChecked] = useState(false);
  const handleToggle = () => {
    setChecked(!checked);
  };
    const processFile = (file) => {
      console.log("ff", file);
      let fileUploaded = {
        status: false,
        name: "",
        data: "",
        type: "",
        size: "",
      };
      fileUploaded.status = true;
      fileUploaded.name = file.name;
      fileUploaded.data = file;
      fileUploaded.type = "image";

      const fileSize = file.size / 1024 / 1024;

      if (fileSize > 5) {
        enqueueSnackbar(
          `Uploaded thumbnail image should be less than 5MB`,
          { variant: "error" }
        );
      } else {
        handleThumbnailDrop(fileUploaded);
      }
    };
  const onDrop = async (acceptedFiles, fileRejections) => {
    console.log("accepted files", acceptedFiles);
    setFileData(acceptedFiles[0]);

    acceptedFiles.forEach((file) => {
      setErrors(null);
    //   if (file) handleDrop(file);
      var reader = new FileReader();
      var url = reader.readAsDataURL(file);
      reader.onloadend = async () => {
        setPreviewImg(reader.result);
      };
            if (file) {
              processFile(file);
            }
    });
    fileRejections.forEach((file) => {
      file.errors.forEach((err) => {
        if (err.code === "file-too-large") {
          setErrors(`Error: ${err.message}`);
          enqueueSnackbar(`Uploaded file should be less than 30MB`, {
            variant: "error",
          });
        }

        if (err.code === "file-invalid-type") {
          setErrors(`Error: ${err.message}`);
        }
      });
    });
  };

  const NFTImageSize = () => {
    if (
      (state.selectedUpdateTokenId - 1) % 3 !== 0 &&
      (state.selectedUpdateTokenId - 1) / 3 >= 0
    ) {
      return `h-8 w-16 lg:h-24 lg:w-48 xl:h-32 xl:w-56`;
    } else return `h-16 w-16 lg:h-40 lg:w-40 xl:h-52 xl:w-52`;
  };
  return (
    <Dropzone
      onDrop={onDrop}
      accept="image/*"
      minSize={0}
      maxSize={maxSize}
      multiple={false}
      disabled={false}
    >
      {({ getRootProps, getInputProps, rejectedFiles, acceptedFiles }) => {
        return (
          <div
            className={`file-container `}
            {...getRootProps({
              style: {
                background: `${
                  acceptedFiles[0] || previewImg ? "#000000" : "#141D5B"
                }`,
              },
              className: `dropzone mm-upload-image file-container  ${NFTImageSize()} ${
                false ? "pointer-events-none opacity-50" : ""
              }`,
            })}
          >
            <input {...getInputProps()} />

            {acceptedFiles[0] || previewImg ? (
              <>
                <img
                  style={{
                    width: "100%",
                    height: "100%",
                    overflow: "hidden",
                    objectFit: "contain",
                    borderRadius: "25px",
                  }}
                  id="thumbnail-preview"
                  src={previewImg}
                  alt="ad"
                />
                {/* <p
                  style={{
                    zIndex: 2,
                    position: "absolute",
                    bottom: "50%",
                  }}
                  className="text-center"
                >
                  {acceptedFiles[0]?.name}
                </p> */}
              </>
            ) : (
              <>
                {" "}
                <img
                  className="file-upload"
                  src={fileUpload}
                  alt="file upload"
                />
                <p className="drag-text">Drag & Drop to Upload or Click</p>
                <p className="upload-inner-text">{`Supported media types .jpg, .png, .gif & more. (<5MB)`}</p>
                {errors && (
                  <div className="text-red-500 mt-2">File is too large.</div>
                )}
              </>
            )}
          </div>
        );
      }}
    </Dropzone>
  );
}

export default ThumbnailDropzone;
