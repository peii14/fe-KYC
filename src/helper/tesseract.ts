import { createWorker } from "tesseract.js";
import Jimp from "jimp-compact";
import * as cv from "@techstark/opencv-js";
import { useRef } from "react";

interface PassportData {
  documentType: string;
  documentSubType: string | null;
  issuingCountry: string;
  name: string;
  passportNumber: string;
  nationality: string;
  dateOfBirth: string;
  gender: string;
  expiryDate: string;
  personalNumber: string;
}
type MRZCroppingProps = {
  onCropped?: (canvas: HTMLCanvasElement) => void;
};
type OnCroppedCallback = (canvas: HTMLCanvasElement) => void;

export const loadImage = async (
  event: React.SyntheticEvent<HTMLImageElement, Event>,
  canvasRef: React.RefObject<HTMLCanvasElement>,
  croppedCanvasRef: React.RefObject<HTMLCanvasElement>
) => {
  const img = new Image();
  img.src = event.currentTarget.src;
  img.onload = () => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0, img.width, img.height);
    cropMrz(canvas, croppedCanvasRef.current!);
  };
};

const rotateImage = (src: cv.Mat, rotatedImage: cv.Mat, angle: number) => {
  const center = new cv.Point(src.cols / 2, src.rows / 2);
  const rotationMatrix = cv.getRotationMatrix2D(center, angle, 1.0);
  const newSize = new cv.Size(src.cols, src.rows);
  cv.warpAffine(src, rotatedImage, rotationMatrix, newSize, cv.INTER_LINEAR);

  rotationMatrix.delete();
  return rotatedImage;
};

const cropMrz = (
  canvas: HTMLCanvasElement,
  outputCanvas: HTMLCanvasElement
) => {
  const src = cv.imread(canvas);
  const gray = new cv.Mat();
  const blackhat = new cv.Mat();
  const thresh = new cv.Mat();
  const closed = new cv.Mat();
  const erosion = new cv.Mat();
  const dilatation = new cv.Mat();
  const rotatedImage = new cv.Mat();

  cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
  cv.morphologyEx(
    gray,
    blackhat,
    cv.MORPH_BLACKHAT,
    cv.getStructuringElement(cv.MORPH_RECT, new cv.Size(21, 15))
  );

  const maxValue = 255;
  const blockSize = 51;
  const meanOffset = 30;
  cv.adaptiveThreshold(
    blackhat,
    thresh,
    maxValue,
    cv.ADAPTIVE_THRESH_MEAN_C,
    cv.THRESH_BINARY_INV,
    blockSize,
    meanOffset
  );

  const erosionKernel = cv.getStructuringElement(
    cv.MORPH_RECT,
    new cv.Size(1, 5)
  );
  cv.erode(thresh, erosion, erosionKernel);

  const dilationKernel = cv.getStructuringElement(
    cv.MORPH_DILATE,
    new cv.Size(71, 21)
  );
  cv.dilate(erosion, dilatation, dilationKernel);

  const contours = new cv.MatVector();
  const hierarchy = new cv.Mat();
  cv.findContours(
    dilatation,
    contours,
    hierarchy,
    cv.RETR_EXTERNAL,
    cv.CHAIN_APPROX_SIMPLE
  );

  let largestContourIndex = -1;
  // let secondLargestContourIndex = -1;
  let largestArea = 0;
  // let secondLargestArea = 0;
  let largestAspectRatio = 0;

  for (let i = 0; i < Number(contours.size()); i++) {
    const contour = contours.get(i);
    const area = cv.contourArea(contour);
    const rect = cv.boundingRect(contour);
    const aspectRatio = rect.width / rect.height;
    if (area > largestArea && aspectRatio > 8 && aspectRatio < 20) {
      // secondLargestArea = largestArea;
      // secondLargestContourIndex = largestContourIndex;
      largestArea = area;
      largestContourIndex = i;
      largestAspectRatio = aspectRatio;
    }
  }

  // cv.imshow(outputCanvas, dilatation);

  if (largestContourIndex >= 0) {
    const rect1 = cv.boundingRect(contours.get(largestContourIndex));
    const rect2 = cv.boundingRect(contours.get(largestContourIndex + 1));
    const aspec1 = rect1.width / rect1.height;
    const aspec2 = rect2.width / rect2.height;
    console.log("largest area", largestArea);
    console.log("aspec1", aspec1);
    console.log("aspec2", aspec2);
    // Combine second and third largest rectangles
    const combinedRect = {
      x: Math.min(rect1.x, rect2.x),
      y: Math.min(rect1.y, rect2.y),
      width:
        Math.max(rect1.x + rect1.width, rect2.x + rect2.width) -
        Math.min(rect1.x, rect2.x),
      height:
        Math.max(rect1.y + rect1.height, rect2.y + rect2.height) -
        Math.min(rect1.y, rect2.y),
    };

    let croppedImage = src.roi(combinedRect);
    outputCanvas.width = rect1.width;
    outputCanvas.height = rect1.height;
    croppedImage = rotateImage(croppedImage, rotatedImage, 0.7);
    cv.imshow(outputCanvas, croppedImage);

    croppedImage.delete();
  } else {
    console.log("MRZ areas not found.");
  }

  // Clean up
  src.delete();
  // rotatedImage.delete();
  dilatation.delete();
  erosion.delete();
  gray.delete();
  blackhat.delete();
  thresh.delete();
  closed.delete();
  contours.delete();
  hierarchy.delete();
};

export const reader = async (canvas) => {
  const ctx = canvas.getContext("2d");
  let src = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const worker: any = await createWorker({
    logger: (m) => console.log(m),
  });
  await worker.load();
  //   await worker.loadLanguage('eng');
  //   await worker.initialize('eng');
  await worker.setParameters({
    tessedit_char_whitelist: "<ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
  });
  const {
    data: { text },
  } = await worker.recognize(src);
  console.log(text);
  await worker.terminate();
  return text;
};

async function preprocessImage(imagePath: string): Promise<Jimp> {
  const image = await Jimp.read(imagePath);

  // Crop the image to the MRZ region
  const mrzHeight = image.bitmap.height * 0.25;
  const mrzY = image.bitmap.height * 0.7;
  const mrzWidth = image.bitmap.width * 0.9;
  const mrzX = image.bitmap.width * 0.05;

  image.crop(mrzX, mrzY, mrzWidth, mrzHeight);
  // image.rotate(20)

  return image;
}

function conditional_split(inputString: string) {
  let resultArray: string[] = [];
  let gender: string = "M";
  if (inputString.indexOf("M") !== -1) {
    resultArray = inputString.split("M");
    gender = "M";
  } else {
    gender = "F";
    resultArray = inputString.split("F");
  }
  return [resultArray, gender];
}

function parseMrz(mrz: string) {
  const data = mrz.replace(/<+/g, "-");
  const splited = data.split("-");

  const [conditionalSplit, gender] = conditional_split(splited[5]);

  const documentType = splited[0];
  const nameMatch =
    splited[2] +
    " " +
    splited[3] +
    " " +
    splited[1].substring(3, splited[1].length);
  const documentNumberMatch = splited[4];
  const nationalityMatch = splited[1].substring(0, 3);
  const dateOfBirthMatch = conditionalSplit[0].substring(
    conditionalSplit[0].length - 7,
    conditionalSplit[0].length - 1
  );
  const genderMatch = gender;
  const expirationDateMatch = conditionalSplit[1].substring(0, 6);
  console.log(conditional_split(splited[5]));
  return {
    documentType,
    nameMatch,
    documentNumberMatch,
    nationalityMatch,
    dateOfBirthMatch,
    genderMatch,
    expirationDateMatch,
  };
}

export async function extractMRZ(
  croppedImageCanvas: HTMLCanvasElement,
  setMrz: any
): Promise<string> {
  // Convert canvas to Blob
  const croppedImageBlob = await new Promise<Blob>((resolve) => {
    croppedImageCanvas.toBlob((blob) => {
      resolve(blob);
    });
  });

  const worker = await createWorker({
    logger: (m) => console.log(m),
  });
  await worker.load();
  await worker.loadLanguage("eng");
  await worker.initialize("eng");
  await worker.setParameters({
    tessedit_char_whitelist: "<ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
  });

  // Use the Blob as input for the Tesseract worker
  const {
    data: { text },
  } = await worker.recognize(croppedImageBlob);
  await worker.terminate();

  console.log(text);
  try {
    const passportData = parseMrz(text.replace(/[\s]/g, ""));
    setMrz(passportData);
    if (passportData) {
      console.log(passportData);
    } else {
      console.log("Invalid MRZ");
    }
  } catch (e) {
    console.log(e);
  }

  return text.replace(/[\s\n]/g, "");
}
