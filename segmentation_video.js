let video;
let segmentation;  // Second segmentation result
let bodySegmentation;  // Second segmentation model

// Video recording
let mediaRecorder;
let recordedChunks = [];
let recordingCanvas;

// Options for body segmentation
let secondOptions = {
  maskType: "parts",  // For the second segmentation
};

function preload() {
  // Load the second segmentation model
  bodySegmentation = ml5.bodySegmentation("BodyPix", secondOptions);
}

function setup() {
  // Create a secondary canvas for recording
  recordingCanvas = createGraphics(640, 480); // Only for the right side (640px wide)

  // Create the video capture
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();
}

function draw() {
  background(255);

  // Second segmentation (full person mask)
  if (segmentation) {
    let coloredMask = createColoredMask(segmentation, "FullBody");
    tint(255, 127); // Apply transparency to the video (127 is the alpha value, range 0-255)

    // Draw on the secondary canvas for recording
    recordingCanvas.clear(); // Clear the previous frame
    recordingCanvas.tint(255, 127); // Apply transparency
    recordingCanvas.image(video, 0, 0); // Draw video on secondary canvas
    recordingCanvas.image(coloredMask, 0, 0); // Draw mask on secondary canvas
  }
}

// Callback function for second body segmentation
function gotResultsSecond(result) {
  segmentation = result;
}

// Start recording function
function startRecording() {
  console.log("Starting segmentation and recording...");

  // Start body segmentation
  bodySegmentation.detectStart(video, gotResultsSecond);

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

   // Hide segmentation visualization during recording
   document.querySelector('canvas').style.display = 'none';
}
  
// Stop recording function
function stopRecording() {
  if (mediaRecorder && mediaRecorder.state !== "inactive") {
    mediaRecorder.stop();
    bodySegmentation.detectStop();  // Stop segmentation to save resources
    console.log("Recording stopped...");
  } else {
    console.log("No active recording to stop.");
  }
}

// Save the video to a file
function saveVideo() {
 
  console.log("Video saved...");

  const blob = new Blob(recordedChunks, {
    type: 'video/webm'
  });
  const url = URL.createObjectURL(blob);
  
  // Create a video element to display the recording
  const videoElement = document.createElement('video');
  videoElement.controls = true;
  videoElement.src = url;
  videoElement.autoplay = true; // Start playback automatically
  videoElement.loop = true; // Replay the video continuously
  document.body.appendChild(videoElement);  // Add the video to the website

  recordedChunks = [];
  console.log("Video saved and displayed.");
}
