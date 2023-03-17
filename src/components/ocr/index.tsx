import { GraphModel } from "@tensorflow/tfjs";
import {
  createRef,
  useEffect,
  useMemo,
  useRef,
  useState,
  MutableRefObject,
} from "react";
import {
  AnnotationData,
  AnnotationShape,
  drawLayer,
  drawShape,
  setShapeConfig,
  Stage,
} from "react-mindee-js";

import { DET_CONFIG, RECO_CONFIG } from "@/common/constants";
import {
  extractBoundingBoxesFromHeatmap,
  extractWords,
  getHeatMapFromImage,
  loadDetectionModel,
  loadRecognitionModel,
} from "@/helper/document_verification";
import { useStateWithRef } from "@/helper/hooks";
import { flatten } from "underscore";
import { UploadedFile, Word } from "@/common/types";
// import AnnotationViewer from "./AnnotationViewer";
// import HeatMap from "./HeatMap";
// import ImageViewer from "./ImageViewer";
// import Sidebar from "./Sidebar";
// import WordsList from "./WordsList";

interface OCRProps {
  newFile: UploadedFile;
}

const OCR = ({ newFile }: OCRProps) => {
  const [detConfig, setDetConfig] = useState(DET_CONFIG.db_resnet50);
  const [recoConfig, setRecoConfig] = useState(RECO_CONFIG.crnn_vgg16);
  const [loadingImage, setLoadingImage] = useState(false);
  const recognitionModel = useRef<GraphModel | null>(null);
  const detectionModel = useRef<GraphModel | null>(null);
  const imageObject = useRef<HTMLImageElement>(new Image());
  const annotationStage = useRef<Stage | null>();
  const [extractingWords, setExtractingWords] = useState(false);
  const [annotationData, setAnnotationData] = useState<AnnotationData>({
    image: null,
  });
  const fieldRefsObject = useRef<any[]>([]);
  const [words, setWords, wordsRef] = useStateWithRef<Word[]>([]);
  const heatMapContainerObject = useRef<HTMLCanvasElement | null>(null);

  const clearCurrentStates = () => {
    setWords([]);
  };

  useEffect(() => {
    clearCurrentStates();
    loadImage(newFile);
    setAnnotationData({ image: newFile.image });
  }, [newFile]);

  useEffect(() => {
    setWords([]);
    setAnnotationData({ image: null });
    imageObject.current.src = newFile.image;
    if (heatMapContainerObject.current) {
      const context = heatMapContainerObject.current.getContext("2d");
      context?.clearRect(
        0,
        0,
        heatMapContainerObject.current.width,
        heatMapContainerObject.current.height
      );
    }
    loadRecognitionModel({ recognitionModel, recoConfig });
    console.log("LOADED");
  }, [recoConfig]);

  useEffect(() => {
    setWords([]);
    setAnnotationData({ image: null });
    imageObject.current.src = "";
    if (heatMapContainerObject.current) {
      const context = heatMapContainerObject.current.getContext("2d");
      context?.clearRect(
        0,
        0,
        heatMapContainerObject.current.width,
        heatMapContainerObject.current.height
      );
    }
    loadDetectionModel({ detectionModel, detConfig });
  }, [detConfig]);

  const getBoundingBoxes = () => {
    const boundingBoxes = extractBoundingBoxesFromHeatmap([
      detConfig.height,
      detConfig.width,
    ]);
    setAnnotationData({
      image: imageObject.current.src,
      shapes: boundingBoxes,
    });
    setTimeout(getWords, 1000);
  };

  const getWords = async () => {
    const words = (await extractWords({
      recognitionModel: recognitionModel.current,
      stage: annotationStage.current!,
      size: [recoConfig.height, recoConfig.width],
    })) as Word[];
    console.log(words);
    setWords(flatten(words));
    setExtractingWords(false);
  };

  const loadImage = async (uploadedFile: UploadedFile) => {
    setLoadingImage(true);
    setExtractingWords(true);
    imageObject.current.onload = async () => {
      await getHeatMapFromImage({
        heatmapContainer: heatMapContainerObject.current,
        detectionModel: detectionModel.current,
        imageObject: imageObject.current,
        size: [detConfig.height, detConfig.width],
      });
      console.log("MASUK ANJING");

      getBoundingBoxes();
      setLoadingImage(false);
    };
    imageObject.current.src = uploadedFile?.image as string;
  };
  const setAnnotationStage = (stage: Stage) => {
    annotationStage.current = stage;
  };

  //   const onFieldMouseLeave = (word: Word) => {
  //     drawShape(annotationStage.current!, word.id, {
  //       fill: `${word.color}33`,
  //     });
  //   };
  //   const onFieldMouseEnter = (word: Word) => {
  //     setShapeConfig(annotationStage.current!, word.id, {
  //       fill: "transparent",
  //     });

  //     drawLayer(annotationStage.current!);
  //   };
  const onShapeMouseEnter = (shape: AnnotationShape) => {
    const newWords = [...wordsRef.current];
    const fieldIndex = newWords.findIndex((word) => word.id === shape.id);
    if (fieldIndex >= 0) {
      newWords[fieldIndex].isActive = true;
      setWords(newWords);
    }
  };
  const onShapeMouseLeave = (shape: AnnotationShape) => {
    const newWords = [...wordsRef.current];
    const fieldIndex = newWords.findIndex((word) => word.id === shape.id);
    if (fieldIndex >= 0) {
      newWords[fieldIndex].isActive = false;
      setWords(newWords);
    }
  };
  fieldRefsObject.current = useMemo(
    () => words.map((word) => createRef()),
    [words]
  );
  const onShapeClick = (shape: AnnotationShape) => {
    const fieldIndex = wordsRef.current.findIndex(
      (word) => word.id === shape.id
    );

    if (fieldIndex >= 0) {
      fieldRefsObject.current[fieldIndex]?.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };
  //   const uploadContainer = document.getElementById("first-img");

  return (
    <>
      <canvas
        id="canvas1"
        ref={heatMapContainerObject}
        width={450}
        height={500}
        className="absolute w-full h-full z-30 top-0 mt-1 right-0"
      ></canvas>
    </>
  );
};

export default OCR;
