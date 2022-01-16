import React, { Component } from "react";
class DragAndDrop extends Component {
  constructor(props) {
    super(props);
    this.state = {
      drag: false,
    };
  }

  dropRef = React.createRef();
  handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  handleDragIn = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.dragCounter++;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      this.setState({ drag: true });
    }
  };
  handleDragOut = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.dragCounter--;
    if (this.dragCounter === 0) {
      this.setState({ drag: false });
    }
  };
  handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({ drag: false });
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      this.props.handleDrop(e.dataTransfer.files);
      e.dataTransfer.clearData();
      this.dragCounter = 0;
    }
  };

  handleInputFileChange = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({ drag: false });
    if (e.target.files && e.target.files.length > 0) {
      this.props.handleDrop(e.target.files);
      this.dragCounter = 0;
    }
  };

  componentDidMount() {
    let div = this.dropRef.current;
    div.addEventListener("dragenter", this.handleDragIn);
    div.addEventListener("dragleave", this.handleDragOut);
    div.addEventListener("dragover", this.handleDrag);
    div.addEventListener("drop", this.handleDrop);
  }
  componentWillUnmount() {
    let div = this.dropRef.current;
    div.removeEventListener("dragenter", this.handleDragIn);
    div.removeEventListener("dragleave", this.handleDragOut);
    div.removeEventListener("dragover", this.handleDrag);
    div.removeEventListener("drop", this.handleDrop);
  }
  render() {
    return (
      <div
      style={{
        display: "inline-block",
        position: "relative",
      }}
      ref={this.dropRef}
      >
        {!this.state.dragging && (
        <>
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 9999,
            }}
          >
            <div
            className="input-image"
              style={{
                position: "absolute",
                top: "50%",
                right: 0,
                left: 0,
                textAlign: "center",
                color: "grey",
                fontSize: 36,
              }}
            >
              <label
                htmlFor="fileUpload"
                className="input-image-text"
                style={{ color: "white", fontSize: "0.8rem", opacity:"0.4" }}
              >
                {this.props.fileUploaded && this.props.fileUploaded.status
                  ? this.props.fileUploaded.name
                  : "Drop your NFT Image here"}
                <input
                  onChange={this.handleInputFileChange}
                  type="file"
                  id="fileUpload"
                  accept="image/*,video/*"
                  style={{ display: "none" }}
                ></input>
              </label>
            </div>
          </div>
          </>
        )}
        {this.props.children}
      </div>
    );
  }
}
export default DragAndDrop;
