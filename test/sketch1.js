const img = "/Users/oliviamanstrom/Desktop/idxproject/img/fotboll.jpeg";

const segmenter = await bodySegmentation.createSegmenter(bodySegmentation.SupportedModels.BodyPix);
const segmentation = await segmenter.segmentPeople(img, {multiSegmentation: false, segmentBodyParts: true});

// The colored part image is an rgb image with a corresponding color from the
// rainbow colors for each part at each pixel, and black pixels where there is
// no part.
const coloredPartImage = await bodySegmentation.toColoredMask(segmentation, bodySegmentation.bodyPixMaskValueToRainbowColor, {r: 255, g: 255, b: 255, a: 255}));
const opacity = 0.7;
const flipHorizontal = false;
const maskBlurAmount = 0;
const canvas = document.getElementById('canvas');
// Draw the colored part image on top of the original image onto a canvas.
// The colored part image will be drawn semi-transparent, with an opacity of
// 0.7, allowing for the original image to be visible under.
bodySegmentation.drawMask(
    canvas, img, coloredPartImage, opacity, maskBlurAmount,
    flipHorizontal);