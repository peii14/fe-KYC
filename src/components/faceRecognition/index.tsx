import { useCallback, useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { findMatch, checkMatch } from "@/helper/faceRecog";
interface FaceRecognitionProps {
  passport: any;
}

const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: "user",
};
const FaceRecognition = ({ passport }: FaceRecognitionProps) => {
  const [counter, setCounter] = useState(0);
  const webcamRef = useRef(null);
  const [faceFound, setFaceFound] = useState(false);
  const [matchFound, setMatch] = useState(false);
  const [face1, setFace1] = useState(null);
  const [handle, setHandler] = useState(false);
  const frame = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    return imageSrc;
  }, [webcamRef]);

  useEffect(() => {
    checkMatch({ setFace1, setFaceFound });
    console.log("check running");
  }, [handle]);

  useEffect(() => {
    const webcam = document.getElementById("webcam");
    const interval = setInterval(() => {
      setCounter((prevCounter) => prevCounter + 1);
      findMatch({
        face: face1,
        webCamFace: webcam,
        setMatch,
        setHandler,
        handle,
      });
    }, 33); // approximately 30 fps

    return () => clearInterval(interval);
  }, [face1, handle]);
  return (
    <>
      <div
        className={`w-full h-full border-4 p-1  flex flex-col ${
          matchFound ? "border-green-600" : "border-red-700"
        } `}
      >
        <div className="relative">
          <Webcam
            id="webcam"
            audio={false}
            height={720}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width={1280}
            videoConstraints={videoConstraints}
          />
          <canvas
            id="canvas2"
            className="absolute top-0 w-full h-full"
          ></canvas>
        </div>
        <div className="text-center m-auto">
          {matchFound ? <p>Match Found</p> : <p>No Match</p>}
        </div>
      </div>
    </>
  );
};
export default FaceRecognition;
