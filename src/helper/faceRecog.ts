"use client"
import * as faceapi from "@vladmandic/face-api";
import { Dispatch, SetStateAction } from "react";

interface findMatchProps{
    face:any
    webCamFace:any
    setMatch: Dispatch<SetStateAction<boolean>>
    setHandler: Dispatch<SetStateAction<boolean>>
    handle: boolean
}

interface checkMatchProps{
    setFace1:Dispatch<SetStateAction<any>>
    setFaceFound: Dispatch<SetStateAction<boolean>>

}

export const loadModels = async () => {
    //Load face-api models
    try {
      await faceapi.nets.faceExpressionNet.loadFromUri("/models");
      await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
      await faceapi.nets.ssdMobilenetv1.loadFromUri("/models");
      await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
    //   await faceapi.nets.mtcnn.loadFromUri("/models");
      await faceapi.nets.faceLandmark68TinyNet.loadFromUri("/models");
      await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
    } catch (e) {
      console.log(e);
    }
  };

  export const findMatch = async ({face, webCamFace, setMatch,setHandler,handle}:findMatchProps) => {
    const canvas2:any = document.getElementById("canvas2")
    try{
    let matchScore = 0.5;
    // let secondImg = webCamFace;
    let faces = await faceapi
      .detectAllFaces(webCamFace)
      .withFaceLandmarks()
      .withFaceDescriptors();
    let labledFace = new faceapi.LabeledFaceDescriptors("Face", [
      face.descriptor,
    ]);
    let faceMatcher = new faceapi.FaceMatcher(labledFace, matchScore);
    let results = await faces.map((f) => {
      return faceMatcher.findBestMatch(f.descriptor);
    });
    if (results.findIndex((i: any) => i._label === "Face") !== -1) {
      let matched = [faces[results.findIndex((i:any) => i._label === "Face")]];
    //   matched = faceapi.resizeResults(matched, { height: 300, width: 300 });
    //     faceapi.draw.drawDetections(document.getElementById("canvas2"), matched, {
    //       withScore: false,
    //     });

    console.log(faces)

    faceapi.draw.drawFaceLandmarks(canvas2,matched)
    
      //   this.closeWebcam();
      setMatch(true);
    } else {
      setMatch(false) 
    }
    } catch (e) {
        setHandler(!handle);
    }
};

export const checkMatch = async ({setFace1,setFaceFound}:checkMatchProps) => {
    let firstImg: any = document.getElementById("first-img");
    let faces = await faceapi
      .detectAllFaces(firstImg)
      .withFaceLandmarks()
      .withFaceDescriptors();

    const canvas1: any = document.getElementById("canvas1");

    faces = faceapi.resizeResults(faces, { height: 150, width: 300 });
    // faceapi.draw.drawDetections(canvas1, faces);
    faceapi.draw.drawFaceLandmarks(canvas1, faces);
    switch (faces.length) {
      case 0:
        setFaceFound(true);
        //   this.closeWebcam();
        break;
      case 1:
        setFace1(faces[0]);

        break;
      default:
        //   this.setState({ moreThanOneFace: true }, () => {});
        //   this.closeWebcam();
        break;
    }
  };