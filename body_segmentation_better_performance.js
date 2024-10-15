let bodySegmentation;
let video;
let segmentation;
let segmentation2;  // Second segmentation result
let secondSegmentation;  // Second segmentation model


let options = {
  maskType: "parts",  // For the first body segmentation (parts)
};

function preload() {
  // Load both segmentation models
  bodySegmentation = ml5.bodySegmentation("BodyPix", options);
}

function setup() {
  let canvas = createCanvas(1280, 480);  // Main canvas
  canvas.id('canvas');  // Assign an id to the canvas for capturing

  // Create the video
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();

  // Start both body segmentations
  bodySegmentation.detectStart(video, gotResults);
}

function draw() {
  background(255);

  // First segmentation (body parts)
  if (segmentation) {
    let coloredMask = createColoredMask(segmentation);
    //image(coloredMask, 0, 0, 640, 480);  // Display first video on the left side
    let xPosition = (width - 640) / 2;  // Centering the video horizontally
    image(coloredMask, xPosition, 0, 640, 480);  // Display first video centered
  }
}

// Callback function for first body segmentation
function gotResults(result) {
  segmentation = result;
}

// Function to create custom colored mask for first segmentation
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

      // Set custom colors based on body part ID (same as original code)
      let r, g, b;
      switch (partId) {

        // face
        case 0: r = 255; g = 255; b = 255; break; // white for left_face
        case 1: r = 255; g = 255; b = 255; break; // white for right_face

        // torso and arms
        case 2: r = 255; g = 255; b = 255; break; // white for left_upper_arm_front
        case 3: r = 255; g = 255; b = 255; break; // white for left_upper_arm_back
        case 4: r = 255; g = 255; b = 255; break; // white for right_upper_arm_front
        case 5: r = 255; g = 255; b = 255; break; // white for right_upper_arm_back
        case 6: r = 255; g = 255; b = 255; break; // white for left_lower_arm_front
        case 7: r = 255; g = 255; b = 255; break; // white for left_lower_arm_back
        case 8: r = 255; g = 255; b = 255; break; // white for right_lower_arm_front
        case 9: r = 255; g = 255; b = 255; break; // white for right_lower_arm_back

        case 12: r = 255; g = 255; b = 255; break; // white for torso_front
        case 13: r = 255; g = 255; b = 255; break; // white for torso_back


        // hands
        case 10: r = 0; g = 0; b = 255; break; // blue for left_hand
        case 11: r = 0; g = 0; b = 255; break; // blue for right_hand

        // legs
        case 14: r = 128; g = 128; b = 128; break; // Gray for left_upper_leg_front
        case 15: r = 128; g = 128; b = 128; break; // Gray for left_upper_leg_back
        case 16: r = 128; g = 128; b = 128; break; // Gray for right_upper_leg_front
        case 17: r = 128; g = 128; b = 128; break; // Gray for right_upper_leg_back
        case 18: r = 128; g = 128; b = 128; break; // Gray for left_lower_leg_front
        case 19: r = 128; g = 128; b = 128; break; // Gray for left_lower_leg_back
        case 20: r = 128; g = 128; b = 128; break; // Gray for right_lower_leg_front
        case 21: r = 128; g = 128; b = 128; break; // Gray for right_lower_leg_back

        // feet
        case 22: r = 0; g = 0; b = 255; break; // blue for left_foot
        case 23: r = 0; g = 0; b = 255; break; // blue for right_foot

        // all other parts
        //default: r = 128; g = 128; b = 128; break; // Gray for unspecified parts
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

