let bodySegmentation;
let video;
let segmentation;

const options = {
  maskType: 'parts',
};

// Function to start the body segmentation model
function startSegmentation() {

  document.getElementById('playButton').disabled = true;
  document.getElementById('stopButton').disabled = false;
  
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide(); // Hide the video element itself, as we're using the canvas

  // Initialize the body segmentation model
  bodySegmentation = ml5.bodySegmentation('BodyPix', options, () => {
    console.log('Started segmentation');
    bodySegmentation.detectStart(video, onSegmentationResults);
  });
 
}

// Function to stop the body segmentation model
function stopSegmentation() {
  document.getElementById('stopButton').disabled = true;
  document.getElementById('playButton').disabled = false;

  if (bodySegmentation) {
    bodySegmentation.detectStop();
    console.log(`Stopped segmentation`);
  }

  // Stop video capture
  if (video) {
    video.stop();
    video.remove(); // Remove the video element
  }
}

// Callback for segmentation results
function onSegmentationResults(result) {
  segmentation = result;
}


function drawSegmentation() {
  background(252, 249, 229);
  if (segmentation) {
    let coloredMask = createColoredMask(segmentation);
    let xPosition = (width - 640) / 2;
    image(coloredMask, xPosition, 0, 640, 480);
  }
}

// Function to create custom colored mask. 
/*
Part Id	Part Name	Part Id	Part Name
0	left_face	12	torso_front
1	right_face	13	torso_back
2	left_upper_arm_front	14	left_upper_leg_front
3	left_upper_arm_back	15	left_upper_leg_back
4	right_upper_arm_front	16	right_upper_leg_front
5	right_upper_arm_back	17	right_upper_leg_back
6	left_lower_arm_front	18	left_lower_leg_front
7	left_lower_arm_back	19	left_lower_leg_back
8	right_lower_arm_front	20	right_lower_leg_front
9	right_lower_arm_back	21	right_lower_leg_back
10	left_hand	22	left_foot
11	right_hand	23	right_foot
*/
function createColoredMask(segmentation) {
    let imgData = segmentation.imageData;
    let coloredMask = createImage(imgData.width, imgData.height);
    coloredMask.loadPixels();

    for (let y = 0; y < imgData.height; y++) {
        for (let x = 0; x < imgData.width; x++) {
        let index = (x + y * imgData.width) * 4;
        let partId = imgData.data[index];

        let [r, g, b] = [252, 249, 229];  // Default background color

        // Full body mode: render all body parts without skipping
        [r, g, b] = getFullBodyModeColor(partId);
    

        // Apply color to the pixel
        coloredMask.pixels[index] = r;
        coloredMask.pixels[index + 1] = g;
        coloredMask.pixels[index + 2] = b;
        coloredMask.pixels[index + 3] = imgData.data[index + 3];  // Preserve alpha channel
        }
    }
    coloredMask.updatePixels();
    return coloredMask;
}

// Colors for fullBody mode (renders all body parts)
function getFullBodyModeColor(partId) {
    switch (partId) {
        // torso front and back
        case 12: case 13: return [0, 96, 78]; // dark green
        // back whole body
        case 3: case 5: case 7: case 9: case 15: 
        case 17: case 19: case 21: return [42, 128, 78]; // middle green
        // front whole body
        case 2: case 4: case 6: case 8: case 14: 
        case 16: case 18: case 20: return [99, 197, 179]; // light green
        // right side of the body
        case 1: case 11: case 23: return [218, 203, 100]; // yellow
        // left side of the body
        case 0: case 10: case 22: return [255, 109, 62]; // orange
        default: return [252, 249, 229]; // "white" background
    }
}

// Add event listeners for the buttons
document.getElementById('playButton').addEventListener('click', startSegmentation);
document.getElementById('stopButton').addEventListener('click', stopSegmentation);

function setup() {
  let canvas = createCanvas(640, 480);
  canvas.parent('canvas-container'); 
}

function draw() {
    drawSegmentation();
}

// Start p5.js
window.setup = setup;
window.draw = draw;
