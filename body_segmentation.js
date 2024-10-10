/*
 * 👋 Hello! This is an ml5.js example made and shared with ❤️.
 * Learn more about the ml5.js project: https://ml5js.org/
 * ml5.js license and Code of Conduct: https://github.com/ml5js/ml5-next-gen/blob/main/LICENSE.md
 *
 * This example demonstrates segmenting a person by body parts with ml5.bodySegmentation.
 */

let bodySegmentation;
let video;
let segmentation;

let options = {
  maskType: "parts",
};

function preload() {
  bodySegmentation = ml5.bodySegmentation("BodyPix", options);
}

function setup() {
  createCanvas(640, 480);
  // Create the video
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();

  bodySegmentation.detectStart(video, gotResults);
}

function draw() {
  background(255);
  //image(video, 0, 0);
  /*
  if (segmentation) {
    image(segmentation.mask, 0, 0, width, height);
  }
  */
  if (segmentation) {
    // Apply the custom color mask
    let coloredMask = createColoredMask(segmentation);
    image(coloredMask, 0, 0, width, height);
  }
}

// callback function for body segmentation
function gotResults(result) {
  segmentation = result;
  //console.log(result.imageData)
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
      let partId = imgData.data[index]; // Get the part ID (0-23 for body parts)

      // Set custom colors based on body part ID
      let r, g, b;
     
      switch (partId) {
          //case 0: r = 255; g = 255; b = 255; break;  // white for left_face
          //case 1: r = 255; g = 255; b = 255; break; // white for right_face
          //case 12: r = 0; g = 0; b = 255; break; // Blue for torso_front
          case 10: r = 0; g = 0; b = 255; break; // blue for left_hand
          case 11: r = 0; g = 0; b = 255; break; // blue for right_hand

          case 14: r = 128; g = 128; b = 128; break; // Gray for left_upper_leg_front
          case 15: r = 128; g = 128; b = 128; break; // Gray for left_upper_leg_back
          case 16: r = 128; g = 128; b = 128; break; // Gray for right_upper_leg_front
          case 17: r = 128; g = 128; b = 128; break; // Gray for right_upper_leg_back
          case 18: r = 128; g = 128; b = 128; break; // Gray for left_lower_leg_front
          case 19: r = 128; g = 128; b = 128; break; // Gray for left_lower_leg_back
          case 20: r = 128; g = 128; b = 128; break; // Gray for right_lower_leg_front
          case 21: r = 128; g = 128; b = 128; break; // Gray for right_lower_leg_back

          case 22: r = 0; g = 0; b = 255; break; // blue for left_foot
          case 23: r = 0; g = 0; b = 255; break; // blue for right_foot

          //case 14: r = 255; g = 255; b = 0; break; // Yellow for left_upper_leg_front
          // Add more cases here for other parts
          default: r = 255; g = 255; b = 255; break; // Gray for unspecified parts
      }

      // Apply the color to the mask
      coloredMask.pixels[index] = r;
      coloredMask.pixels[index + 1] = g;
      coloredMask.pixels[index + 2] = b;
      coloredMask.pixels[index + 3] = imgData.data[index + 3]; // Maintain alpha
    }
  }
  coloredMask.updatePixels();
  return coloredMask;
}