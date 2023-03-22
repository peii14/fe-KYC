import { createWorker } from 'tesseract.js';
import Jimp from 'jimp-compact';

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

export const reader = async (canvas) => {
    const ctx = canvas.getContext('2d')
    let src = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const worker:any = await createWorker({
        logger: m => console.log(m)
    });
  await worker.load();
//   await worker.loadLanguage('eng');
//   await worker.initialize('eng');
  await worker.setParameters({
  tessedit_char_whitelist: '<ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
});
  const { data: { text } } = await worker.recognize(src);
  console.log(text);
  await worker.terminate();
  return text
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

    // const imageData = new ImageData(
    //     Uint8ClampedArray.from(image.bitmap.data),
    //     image.bitmap.width,
    //     image.bitmap.height
    // );
    // ctx.putImageData(imageData, 0, 0);
    return image;
  }

  function conditional_split(inputString:string){
    let resultArray: string[] = [];
    let gender : string ='M' 
        if (inputString.indexOf("M") !== -1) {
        resultArray = inputString.split("M");
        gender = 'M'
        } else {
        gender = 'F'
        resultArray = inputString.split("F");
        }
    return [resultArray, gender]
  }

  function parseMrz(mrz: string) {
    const data = mrz.replace(/<+/g, '-');
    const splited = data.split('-')
    
    const [conditionalSplit, gender] = conditional_split(splited[5])

    const documentType = splited[0]
    const nameMatch = splited[2] +' ' + splited[3]+' ' + splited[1].substring(3,splited[1].length)
    const documentNumberMatch = splited[4]
    const nationalityMatch = splited[1].substring(0,3)
    const dateOfBirthMatch = conditionalSplit[0].substring(conditionalSplit[0].length - 7,conditionalSplit[0].length - 1)
    const genderMatch = gender
    const expirationDateMatch = conditionalSplit[1].substring(0,6)
    console.log(conditional_split(splited[5]))
    return {
      documentType,
      nameMatch,
      documentNumberMatch,
      nationalityMatch,
      dateOfBirthMatch,
      genderMatch,
      expirationDateMatch
    };
  }

export async function extractMRZ(imagePath: string): Promise<Record<string, string>> {
    const image:any = await preprocessImage(imagePath);
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
    const { data: { text } } = await worker.recognize(bmpImage);
    await worker.terminate();
    // console.log(text.replace(/[\s]/g,''))
    const passportData = parseMrz(text.replace(/[\s]/g,''))
    if (passportData) {
        console.log(passportData);
      } else {
        console.log("Invalid MRZ");
      }
      

    return text.replace(/[\s\n]/g, '')
  }
  

