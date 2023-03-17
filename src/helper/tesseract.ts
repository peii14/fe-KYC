import { createWorker } from 'tesseract.js';
import Jimp from 'jimp-compact';

export const reader = async (canvas) => {
    const ctx = canvas.getContext('2d')
    let src = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const worker:any = await createWorker({
        logger: m => console.log(m)
    });
  await worker.load();
  await worker.loadLanguage('eng');
  await worker.initialize('eng');
  await worker.setParameters({
  tessedit_char_whitelist: '<ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
});
  const { data: { text } } = await worker.recognize(src);
  console.log(text);
  await worker.terminate();
  return text
};


// const mrzRegex =  /^P<([A-Z<]{3})([A-Z0-9<]{39})([M|F|X|<])([A-Z0-9<]{7})([0-9]{6})([0-9]{1})([0-9|<])/;
async function preprocessImage(imagePath: string,ctx): Promise<Jimp> {
    // Load the image
    const image = await Jimp.read(imagePath);
  
    // Crop the image to the MRZ region
    const mrzHeight = image.bitmap.height * 0.35;
    const mrzY = image.bitmap.height * 0.7;
    const mrzWidth = image.bitmap.width * 0.9;
    const mrzX = image.bitmap.width * 0.05;
    image.crop(mrzX, mrzY, mrzWidth, mrzHeight);
    const imageData = new ImageData(
        Uint8ClampedArray.from(image.bitmap.data),
        image.bitmap.width,
        image.bitmap.height
  );
    ctx.putImageData(imageData, 0, 0);
    return image;
  }


export async function extractMRZ(imagePath: string,ctx:any): Promise<Record<string, string>> {
    const image:any = await preprocessImage(imagePath , ctx);
    // const { data: { text } } = await Tesseract.recognize(imagePath, 'eng');
    
    const worker:any = await createWorker({
        logger: m => console.log(m)
    });
    await worker.load();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    await worker.setParameters({
    tessedit_char_whitelist: '<ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
    });
    const bmp = await image.getBufferAsync(Jimp.MIME_BMP)
    const bmpImage = new Blob([bmp])
      
      console.log(bmpImage)
    const { data: { text } } = await worker.recognize(bmpImage);
    // const mrzMatch = mrzRegex.exec(text.replace(/[\s\n]/g, ''));
    await worker.terminate();
    return text.replace(/[\s\n]/g, '')

    
  }
  

