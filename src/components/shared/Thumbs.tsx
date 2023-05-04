import Image from "next/image";
import { useRef } from "react";
import { loadImage } from "@/helper/tesseract";

interface ThumbsProps {
  file: any;
  setMrz: React.Dispatch<React.SetStateAction<string>>;
}

const Thumbs = ({ file, setMrz }: ThumbsProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const croppedCanvasRef = useRef<HTMLCanvasElement>(null);

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
            loadImage(e, canvasRef, croppedCanvasRef);
          }}
        />
      ) : (
        <></>
      )}
      <canvas
        id="canvas1"
        width={450}
        height={500}
        ref={canvasRef}
        className="absolute w-full h-full z-10 top-0 mt-1 right-0"
      ></canvas>
      <canvas
        id="canvas-cropped"
        ref={croppedCanvasRef}
        className="absolute z-20 top-full w-full mt-5 right-0"
      ></canvas>
    </div>
  );
};

export default Thumbs;
