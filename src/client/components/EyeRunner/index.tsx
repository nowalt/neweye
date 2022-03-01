import React, { useCallback, useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-cpu";
// import * as bodyPix from "@tensorflow-models/body-pix";

const weights = "/yolov5n_web_model/model.json";

const names = [
  "person",
  "bicycle",
  "car",
  "motorcycle",
  "airplane",
  "bus",
  "train",
  "truck",
  "boat",
  "traffic light",
  "fire hydrant",
  "stop sign",
  "parking meter",
  "bench",
  "bird",
  "cat",
  "dog",
  "horse",
  "sheep",
  "cow",
  "elephant",
  "bear",
  "zebra",
  "giraffe",
  "backpack",
  "umbrella",
  "handbag",
  "tie",
  "suitcase",
  "frisbee",
  "skis",
  "snowboard",
  "sports ball",
  "kite",
  "baseball bat",
  "baseball glove",
  "skateboard",
  "surfboard",
  "tennis racket",
  "bottle",
  "wine glass",
  "cup",
  "fork",
  "knife",
  "spoon",
  "bowl",
  "banana",
  "apple",
  "sandwich",
  "orange",
  "broccoli",
  "carrot",
  "hot dog",
  "pizza",
  "donut",
  "cake",
  "chair",
  "couch",
  "potted plant",
  "bed",
  "dining table",
  "toilet",
  "tv",
  "laptop",
  "mouse",
  "remote",
  "keyboard",
  "cell phone",
  "microwave",
  "oven",
  "toaster",
  "sink",
  "refrigerator",
  "book",
  "clock",
  "vase",
  "scissors",
  "teddy bear",
  "hair drier",
  "toothbrush",
];

const App = ({ w = 640, h = 480 }: any = {}) => {
  const modelRef = useRef<any>();
  const [timerId, setTimerId] = useState<any>();
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  console.log("App render!!!!!!");

  useEffect(() => {
    tf.loadGraphModel(weights).then((model) => {
      modelRef.current = model;
      console.log("model loaded!");
    });
  }, []);

  const detect = useCallback(async () => {
    // console.log("detect called!", Date.now());

    // console.log("!modelRef.current", !modelRef.current);
    // console.log("!webcamRef.current", !webcamRef.current);
    // console.log("!canvasRef.current", !canvasRef.current);
    // console.log("!webcamRef.current.video", !webcamRef.current?.video);
    // console.log(
    //   "(webcamRef.current as any).video.readyState",
    //   (webcamRef.current as any)?.video?.readyState
    // );

    if (
      !modelRef.current ||
      !webcamRef.current ||
      !canvasRef.current ||
      !webcamRef.current.video ||
      (webcamRef.current as any).video.readyState !== 4
    ) {
      setTimeout(() => {
        detect();
      }, 1000);
      return;
    }

    // Get Video Properties
    const video = webcamRef.current.video;
    // const videoWidth = (webcamRef.current as any).video.videoWidth;
    // const videoHeight = (webcamRef.current as any).video.videoHeight;

    // Set video width
    // (webcamRef.current as any).video.width = videoWidth;
    // (webcamRef.current as any).video.height = videoHeight;

    // console.log("canvasRef.current.width", canvasRef.current.width);
    // console.log("canvasRef.current.height", canvasRef.current.height);
    // Set canvas height and width
    // canvasRef.current.width = videoWidth;
    // canvasRef.current.height = videoHeight;

    // 4. TODO - Make Detections
    const img = tf.browser.fromPixels(video);
    const resized = tf.image.resizeBilinear(img, [640, 640]);
    const dived = resized.div(255.0);
    const expanded = dived.expandDims(0);

    const obj = await modelRef.current.executeAsync(expanded);

    // console.log(obj);

    const c = canvasRef.current;
    const ctx = canvasRef.current.getContext("2d") as CanvasRenderingContext2D;

    // Font options.
    const font = "16px sans-serif";
    ctx.font = font;
    ctx.textBaseline = "top";

    const [boxes, scores, classes, valid_detections] = obj;
    const boxes_data = boxes.dataSync();
    const scores_data = scores.dataSync();
    const classes_data = classes.dataSync();
    const valid_detections_data = valid_detections.dataSync()[0];

    // console.log("classes_data", classes_data);
    // console.log("valid_detections_data", valid_detections_data);

    tf.dispose(img);
    tf.dispose(resized);
    tf.dispose(dived);
    tf.dispose(expanded);
    tf.dispose(obj);

    // requestAnimationFrame(() => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    let i;
    for (i = 0; i < valid_detections_data; ++i) {
      let [x1, y1, x2, y2] = boxes_data.slice(i * 4, (i + 1) * 4);
      x1 *= c.width;
      x2 *= c.width;
      y1 *= c.height;
      y2 *= c.height;
      const width = x2 - x1;
      const height = y2 - y1;
      const klass = names[classes_data[i]];
      const score = scores_data[i].toFixed(2);

      // Draw the bounding box.
      ctx.strokeStyle = "#00FFFF";
      ctx.lineWidth = 4;
      ctx.strokeRect(x1, y1, width, height);

      // Draw the label background.
      ctx.fillStyle = "#00FFFF";
      const textWidth = ctx.measureText(klass + ":" + score).width;
      const textHeight = parseInt(font, 10); // base 10
      ctx.fillRect(x1, y1, textWidth + 4, textHeight + 4);
    }
    for (i = 0; i < valid_detections_data; ++i) {
      let [x1, y1, ,] = boxes_data.slice(i * 4, (i + 1) * 4);
      x1 *= c.width;
      y1 *= c.height;
      const klass = names[classes_data[i]];
      const score = scores_data[i].toFixed(2);

      // Draw the text last to ensure it's on top.
      ctx.fillStyle = "#000000";
      ctx.fillText(klass + ":" + score, x1, y1);
    }

    setTimeout(() => {
      detect();
    }, 1);
    // });

    return;
  }, []);

  useEffect(() => {
    setTimeout(() => {
      detect();
    }, 1000);
  }, []);

  return (
    <>
      <div className="relative">
        <Webcam
          audio={false}
          ref={webcamRef}
          style={{
            position: "absolute",
            margin: "auto",
            textAlign: "center",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 9,
            width: w,
            height: h,
          }}
          width={w}
          height={h}
        />
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            margin: "auto",
            textAlign: "center",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 9,
            width: w,
            height: h,
          }}
          width={w}
          height={h}
        />
      </div>
    </>
  );
};

export default App;
