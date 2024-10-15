let bodySegmentation;
let video;
let segmentation;
let segmentation2;  // Second segmentation result
let secondSegmentation;  // Second segmentation model

// Video recording
let mediaRecorder;
let recordedChunks = [];

// Secondary canvas for recording
let recordingCanvas;

// Variables for popup
let popupWindow;
let popupCanvas;

// Options for segmentation
let options = {
  maskType: "parts",  // For the first body segmentation (parts)
};

let secondOptions = {
  maskType: "parts",  // For the second segmentation
};

function preload() {
  // Load both segmentation models
  bodySegmentation = ml5.bodySegmentation("BodyPix", options);
  secondSegmentation = ml5.bodySegmentation("BodyPix", secondOptions);
}

function setup() {
  createCanvas(1280, 480);  // Main canvas
  recordingCanvas = createGraphics(640, 480); // For the right side (640px wide)
  
  // Create the video
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();

  // Start both body segmentations
  bodySegmentation.detectStart(video, gotResults);
  secondSegmentation.detectStart(video, gotResultsSecond);  // Second segmentation

  // Set up buttons for starting and stopping recording
  document.getElementById("startRecording").addEventListener("click", startRecording);
  document.getElementById("stopRecording").addEventListener("click", stopRecording);
  document.getElementById("showPopup").addEventListener("click", openPopup); // Button for popup
}

function draw() {
  background(255);
  // No drawing of the left segmentation mask on the main canvas anymore.
}

// Callback function for first body segmentation
function gotResults(result) {
  segmentation = result;
}

// Callback function for second body segmentation
function gotResultsSecond(result) {
  segmentation2 = result;
}

// Function to create custom colored mask for first segmentation
function createColoredMask(segmentation) {
  let imgData = segmentation.imageData;
  let coloredMask = createImage(imgData.width, imgData.height);
  coloredMask.loadPixels();

  for (let y = 0; y < imgData.height; y++) {
    for (let x = 0; x < imgData.width; x++) {
      let index = (x + y * imgData.width) * 4;
      let partId = imgData.data[index];

      // Set custom colors based on body part ID
      let r, g, b;
      switch (partId) {
        case 10: r = 0; g = 0; b = 255; break;  // Example for different body parts
        case 11: r = 0; g = 0; b = 255; break;
        case 14: r = 128; g = 128; b = 128; break;
        case 15: r = 128; g = 128; b = 128; break;
        case 16: r = 128; g = 128; b = 128; break;
        case 17: r = 128; g = 128; b = 128; break;
        case 18: r = 128; g = 128; b = 128; break;
        case 19: r = 128; g = 128; b = 128; break;
        case 20: r = 128; g = 128; b = 128; break;
        case 21: r = 128; g = 128; b = 128; break;
        case 22: r = 0; g = 0; b = 255; break;
        case 23: r = 0; g = 0; b = 255; break;
        default: r = 255; g = 255; b = 255; break;
      }
      coloredMask.pixels[index] = r;
      coloredMask.pixels[index + 1] = g;
      coloredMask.pixels[index + 2] = b;
      coloredMask.pixels[index + 3] = imgData.data[index + 3]; // Maintain alpha
    }
  }
  coloredMask.updatePixels();
  return coloredMask;
}

// Function to open a popup window
function openPopup() {
  // Create a new window
  popupWindow = window.open("", "Popup", "width=640,height=480");
  
  // Set an interval to draw in the popup
  setInterval(() => {
    if (segmentation) {
      // Create a colored mask from the segmentation
      let coloredMask = createColoredMask(segmentation);
      
      // Clear the popup and draw the colored mask
      popupWindow.document.body.innerHTML = ""; // Clear existing content
      let canvasElement = popupWindow.document.createElement('canvas');
      canvasElement.width = 640;
      canvasElement.height = 480;
      let ctx = canvasElement.getContext('2d');
      ctx.drawImage(coloredMask.canvas, 0, 0, 640, 480); // Draw the mask on the canvas
      popupWindow.document.body.appendChild(canvasElement); // Add the canvas to the popup window
    }
  }, 100); // Update every 100 ms
}

// Start recording function
function startRecording() {
    let stream = recordingCanvas.canvas.captureStream(30); // Capture the secondary canvas at 30 FPS
  
    mediaRecorder = new MediaRecorder(stream, {
      mimeType: 'video/webm;codecs=vp9' // Codec format
    });
  
    mediaRecorder.ondataavailable = function(event) {
      if (event.data.size > 0) {
        recordedChunks.push(event.data);
      }
    };
  
    mediaRecorder.onstop = saveVideo;
    mediaRecorder.start();
    console.log("Recording started...");
}
  
// Stop recording function
function stopRecording() {
    mediaRecorder.stop();
    console.log("Recording stopped...");
}
  
// Save the video to a file
function saveVideo() {
    const blob = new Blob(recordedChunks, {
      type: 'video/webm'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'recording.webm';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    recordedChunks = [];
    console.log("Video saved...");
}
