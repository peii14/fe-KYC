import Image from "next/image";
import { extractMRZ } from "@/helper/tesseract";
import { useState, useRef, Dispatch, SetStateAction, useEffect } from "react";
interface ThumbsProps {
  file: any;
  setMrz: Dispatch<SetStateAction<string>>;
}

const Thumbs = ({ file, setMrz }: ThumbsProps) => {
  const mrzRef = useRef();
  const [process, setProcess] = useState(false);
  return (
    <div className="w-full relative mt-1">
      {file ? (
        <Image
          id="first-img"
          alt="passport"
          src={file.preview}
          className="object-cover mx-auto w-full"
          width={450}
          height={500}
          onLoad={async (e: any) => {
            URL.revokeObjectURL(file.preview);
            // const canvas: any = document.getElementById("preprocessed");
            // const ctx = canvas.getContext("2d");
            extractMRZ("/img/" + file.path, setMrz)
              .then((mrzInfo) => {
                console.log(mrzInfo);
              })
              .catch((error) => {
                console.error(error);
              });
            setProcess(!process);
          }}
        />
      ) : (
        <></>
      )}
      <canvas
        id="canvas1"
        width={450}
        height={500}
        className="absolute w-full h-full z-30 top-0 mt-1 right-0"
      ></canvas>
      {/* <p>Prep</p>
      <canvas
        id="preprocessed"
        className="object-cover w-full  overflow-visible "
        ref={mrzRef}
      /> */}
    </div>
  );
};

export default Thumbs;
