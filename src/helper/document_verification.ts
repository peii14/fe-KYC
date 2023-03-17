import cv, { Mat } from "@techstark/opencv-js";

// PREPROCESSING

export const preprocessing = async(imgSrc,mrzRef) =>{
  const image = cv.imread(imgSrc);
  // const resized = new Mat()
  // cv.resize(image, resized, new cv.Size(600,200));
  const grey = new Mat()
  cv.cvtColor(image,grey,cv.COLOR_BGR2GRAY);
  const rectKernel = cv.getStructuringElement(cv.MORPH_RECT, new cv.Size(25,30));
  
  const smooth = new Mat()
  cv.GaussianBlur(grey, smooth ,new cv.Size(3, 3), 0);
  
  const blackhat = new Mat()
  cv.morphologyEx(smooth,blackhat, cv.MORPH_BLACKHAT, rectKernel);

  const closingKernel = cv.getStructuringElement(cv.MORPH_RECT, new cv.Size(5, 5));
  // const kernel = cv.getStructuringElement(([-1,-1,-1], [-1,9,-1], [-1,-1,-1]),new cv.Size(3,3))
  
  const closing = new Mat()
  cv.morphologyEx(smooth, closing ,cv.MORPH_CLOSE, closingKernel);
  
  const thresh = new Mat()
  cv.threshold(grey,thresh,0, 255, cv.THRESH_BINARY_INV | cv.THRESH_OTSU)[1];
  
  // const im = new Mat()
  // cv.filter2D(thresh,im,-1,kernel);
  
  // const paddedImg = new Mat()
  // cv.copyMakeBorder(im, paddedImg,50, 50, 50, 50, cv.BORDER_CONSTANT);

  cv.imshow(mrzRef.current, thresh);
  
  grey.delete()
  smooth.delete()
  blackhat.delete()
  closing.delete()
  thresh.delete()
  // im.delete()
  // paddedImg.delete()

}