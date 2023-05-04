import Image from "next/image";
import { useRef } from "react";
import { extractMRZ, loadImage } from "@/helper/tesseract";
import { toast } from "react-toastify";
interface ThumbsProps {
  file: any;
  setMrz: React.Dispatch<React.SetStateAction<string>>;
}

const Thumbs = ({ file, setMrz }: ThumbsProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const croppedCanvasRef = useRef<HTMLCanvasElement>(null);
  function clearCanvas(canvas) {
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
  }
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
            clearCanvas(canvasRef.current);
            await loadImage(e, canvasRef, croppedCanvasRef);
            if (croppedCanvasRef.current) {
              await toast.promise(
                extractMRZ(croppedCanvasRef.current, setMrz),
                {
                  pending: "Extracting MRZ",
                  success: "MRZ extracted",
                  error: "Error extracting MRZ",
                }
              );
            }
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
