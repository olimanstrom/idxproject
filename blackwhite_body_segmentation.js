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
  maskType: "person",
};
// to make the model perform worse!
let segmentationConfig = {
  flipHorizontal: false, // Flip the video horizontally
  internalResolution: 'low', // Internal resolution of the model, verylow | low | medium | high | veryhigh
  segmentationThreshold: 0.99, // Threshold for segmentation, a higher value will create a tighter crop around a person but may result in some pixels being that are part of a person being excluded from the returned segmentation mask.
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

  bodySegmentation.detectStart(video, gotResults, segmentationConfig);
}

function draw() {
  background(255);
  tint(255, 127); // Apply transparency to the video (127 is the alpha value, range 0-255)

  image(video, 0, 0);
  if (segmentation) {
    image(segmentation.mask, 0, 0, width, height);
  }
}

// callback function for body segmentation
function gotResults(result) {
  segmentation = result;
}