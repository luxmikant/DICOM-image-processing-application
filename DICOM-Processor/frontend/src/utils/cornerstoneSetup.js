import cornerstone from 'cornerstone-core';
import dicomParser from 'dicom-parser';

export function initCornerstone() {
  console.log("Initializing Cornerstone image loaders (new approach)");

  // Directly assign our loader functions to cornerstone.imageLoaders
  cornerstone.imageLoaders = {
    'dicomfile': dicomLoader,
    'processedfile': processedLoader,
  };

  // Override cornerstone.loadImage to use our imageLoaders
  const originalLoadImage = cornerstone.loadImage;
  cornerstone.loadImage = function(imageId) {
    const scheme = imageId.split(':')[0];
    const loader = cornerstone.imageLoaders[scheme];
    if (loader) {
      return loader(imageId);
    } else {
      return Promise.reject(new Error("No loader for " + scheme));
    }
  };

  console.log("Cornerstone image loader registration complete. Registered loaders:", Object.keys(cornerstone.imageLoaders));
}

// Loader for "dicomfile:" scheme remains as a placeholder for the original unprocessed image
function dicomLoader(imageId) {
  console.log("dicomLoader called with:", imageId);
  return new Promise((resolve) => {
    const width = 256;
    const height = 256;
    const pixelData = new Uint8Array(width * height);
    // Create a gradient pattern for demonstration purposes
    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        pixelData[i * width + j] = (i + j) % 256;
      }
    }
    const image = {
      imageId,
      minPixelValue: 0,
      maxPixelValue: 255,
      slope: 1.0,
      intercept: 0,
      windowCenter: 128,
      windowWidth: 256,
      getPixelData: () => pixelData,
      rows: height,
      columns: width,
      height,
      width,
      color: false,
      sizeInBytes: pixelData.length
    };
    resolve(image);
  });
}

// Loader for "processedfile:" scheme – fetches the processed DICOM from the backend and converts it
function processedLoader(imageId) {
  console.log("processedLoader called with:", imageId);
  // Extract the file ID from the imageId string
  const fileId = imageId.split(':')[1];
  // Construct the URL to fetch the processed DICOM file
  const url = `http://localhost:5000/api/processed/${fileId}`;
  console.log("Fetching processed DICOM from:", url);

  return fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error("Failed to fetch processed DICOM");
      }
      return response.arrayBuffer();
    })
    .then(arrayBuffer => {
      // Parse the DICOM file
      const byteArray = new Uint8Array(arrayBuffer);
      const dataSet = dicomParser.parseDicom(byteArray);
      
      // Determine image rows and columns; fallback to 256 if tags are missing
      const rows = parseInt(dataSet.string('x00280010')) || 256;
      const cols = parseInt(dataSet.string('x00280011')) || 256;
      
      // Access pixel data element (tag 7FE0,0010) if available
      let pixelData;
      const pixelDataElement = dataSet.elements.x7fe00010;
      if (pixelDataElement) {
        // Use the dataOffset to create a typed array view into the buffer
        pixelData = new Uint16Array(
          arrayBuffer,
          pixelDataElement.dataOffset,
          pixelDataElement.length / 2
        );
      } else {
        // Fallback to a synthetic image if pixel data is missing
        pixelData = new Uint16Array(rows * cols);
      }
      
      const image = {
        imageId,
        minPixelValue: 0,
        maxPixelValue: 255,
        slope: 1.0,
        intercept: 0,
        windowCenter: 128,
        windowWidth: 256,
        getPixelData: () => pixelData,
        rows: rows,
        columns: cols,
        height: rows,
        width: cols,
        color: false,
        sizeInBytes: pixelData.byteLength
      };
      
      return image;
    });
}