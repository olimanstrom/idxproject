let bodySegmentation;
let video;
let segmentation;
let currentMode = 'FullBody';  // Track the current mode

const optionsInvisible = {
  maskType: 'parts',
};

const optionsFullBody = {
  maskType: 'parts',
};

// Function to start the body segmentation model
function startSegmentation(mode) {
  segmentation = null;
  const options = mode === 'FullBody' ? optionsInvisible : optionsFullBody;

  // Stop any ongoing detection before starting a new one
  if (bodySegmentation) {
    bodySegmentation.detectStop();  // Stop the previous detection
  }
  // initialize the body segmentation model
  bodySegmentation = ml5.bodySegmentation('BodyPix', options, () => {
    console.log(`Started ${mode} segmentation`);
    bodySegmentation.detectStart(video, onSegmentationResults);
  });
}

// Callback for segmentation results
function onSegmentationResults(result) {
  segmentation = result;
}

// Setup the video and start initial segmentation
function initializeVideo() {
  let canvas = createCanvas(1280, 480);
  canvas.id('canvas');
  
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();
  
  // Start segmentation with the default mode
  startSegmentation(currentMode);
}

function drawSegmentation() {
  background(0);
  if (segmentation) {
    let coloredMask = createColoredMask(segmentation, currentMode);
    let xPosition = (width - 640) / 2;
    image(coloredMask, xPosition, 0, 640, 480);
  }
}
