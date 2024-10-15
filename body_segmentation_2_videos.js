let bodySegmentation;
let video;
let segmentation;
let segmentation2;  // Second segmentation result
let secondSegmentation;  // Second segmentation model

// video recording
let mediaRecorder;
let recordedChunks = [];

let recordingCanvas;

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
  let canvas = createCanvas(1280, 480);  // Adjust canvas to fit both videos side by side
  canvas.id('canvas');  // Assign an id to the canvas for capturing

  // Create a secondary canvas for recording
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
}

function draw() {
  background(255);

  // First segmentation (body parts)
  if (segmentation) {
    let coloredMask = createColoredMask(segmentation);
    image(coloredMask, 0, 0, 640, 480);  // Display first video on the left side
  }

  // Second segmentation (full person mask)
  if (segmentation2) {
    tint(255, 127); // Apply transparency to the video (127 is the alpha value, range 0-255)
    image(video, 640, 0, 640, 480);
    image(segmentation2.mask, 640, 0, 640, 480);  // Display second video on the right side

    // Draw on the secondary canvas for recording
    recordingCanvas.clear(); // Clear the previous frame
    recordingCanvas.tint(255, 127); // Apply transparency
    recordingCanvas.image(video, 0, 0); // Draw video
    recordingCanvas.image(segmentation2.mask, 0, 0); // Draw mask
  }
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

      // Set custom colors based on body part ID (same as original code)
      let r, g, b;
      switch (partId) {
        case 10: r = 0; g = 0; b = 255; break;
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
      coloredMask.pixels[index + 3] = imgData.data[index + 3];
    }
  }
  coloredMask.updatePixels();
  return coloredMask;
}

// Start recording function
function startRecording() {
    //let canvasElement = document.getElementById('canvas');
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
