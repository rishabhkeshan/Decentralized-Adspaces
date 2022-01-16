export const crop = (url, selectedUpdateTokenId, setUpdateNFTImage, fileUploaded) => {
  if (
    (selectedUpdateTokenId - 1) % 3 === 0 &&
    (selectedUpdateTokenId - 1) / 3 >= 0
  ) {
    return new Promise((resolve) => {
      // this image will hold our source image data
      const inputImage = new Image();

      // we want to wait for our image to load
      inputImage.onload = () => {
        // let's store the width and height of our image
        const inputWidth = inputImage.naturalWidth;
        const inputHeight = inputImage.naturalHeight;

        // get the aspect ratio of the input image
        const inputImageAspectRatio = inputWidth / inputHeight;

        let outputWidth = 0;
        let outputHeight = 0;

        // if it's bigger than our target aspect ratio
        if (inputHeight > inputWidth) {
          outputWidth = inputHeight;
          outputHeight = inputHeight;
        } else {
          outputWidth = inputWidth;
          outputHeight = inputWidth;
        }
        // calculate the position to draw the image at
        const outputX = (outputWidth - inputWidth) * 0.5;
        const outputY = (outputHeight - inputHeight) * 0.5;

        // create a canvas that will present the output image
        const outputImage = document.createElement("canvas");

        // set it to the same size as the image
        outputImage.width = outputWidth;
        outputImage.height = outputHeight;

        // draw our image at position 0, 0 on the canvas
        const ctx = outputImage.getContext("2d");
        ctx.drawImage(inputImage, outputX, outputY);
        resolve(outputImage.toDataURL(fileUploaded.data.type));
      };

      // start loading our image
      inputImage.src = url;
      console.log(url, "url");
      setUpdateNFTImage(url);
    });
  }
  // we return a Promise that gets resolved with our canvas element
  else {
    return new Promise((resolve) => {
      // this image will hold our source image data
      const inputImage = new Image();

      // we want to wait for our image to load
      inputImage.onload = () => {
        // let's store the width and height of our image
        const inputWidth = inputImage.naturalWidth;
        const inputHeight = inputImage.naturalHeight;

        // get the aspect ratio of the input image
        const inputImageAspectRatio = inputWidth / inputHeight;

        let outputWidth = 0;
        let outputHeight = 0;

        // if it's bigger than our target aspect ratio
        if (inputHeight * 2 > inputWidth) {
          outputWidth = inputHeight * 2;
          outputHeight = inputHeight;
        } else {
          outputWidth = inputWidth;
          outputHeight = inputWidth / 2;
        }
        // calculate the position to draw the image at
        const outputX = (outputWidth - inputWidth) * 0.5;
        const outputY = (outputHeight - inputHeight) * 0.5;

        // create a canvas that will present the output image
        const outputImage = document.createElement("canvas");

        // set it to the same size as the image
        outputImage.width = outputWidth;
        outputImage.height = outputHeight;

        // draw our image at position 0, 0 on the canvas
        const ctx = outputImage.getContext("2d");
        ctx.drawImage(inputImage, outputX, outputY);
        resolve(outputImage.toDataURL(fileUploaded.data.type));
      };

      // start loading our image
      inputImage.src = url;
      console.log(url, "url");
      setUpdateNFTImage(url);
    });
  }
};
