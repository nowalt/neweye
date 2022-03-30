import * as tf from "@tensorflow/tfjs-core";
import "@tensorflow/tfjs-backend-webgl";
import * as posedetection from "@tensorflow-models/pose-detection";
import { Keypoint } from "@tensorflow-models/pose-detection";
import { useEffect } from "react";
import {
  app,
  getCamera,
  STATE,
  getDetector,
  getStats,
} from "../../../client/lib/posenet/upload";
import { BoundingBoxTracker } from "../../../client/lib/bounding_box_tracker";

let startInferenceTime: any,
  numInferences = 0;
let inferenceTimeSum = 0,
  lastPanelUpdate = 0;
let rafId;
const SECOND_TO_MICRO_SECONDS = 1e6;

const tracker = new BoundingBoxTracker({
  maxTracks: 3 * 20, // 3 times max detections of the multi-pose model.
  maxAge: 1000,
  minSimilarity: 0.15,
});

const { NEGATIVE_INFINITY, POSITIVE_INFINITY } = Number;
function getBoundingBox(keypoints: Keypoint[]): {
  maxX: number;
  maxY: number;
  minX: number;
  minY: number;
} {
  return keypoints.reduce(
    ({ maxX, maxY, minX, minY }, { x, y }) => {
      return {
        maxX: Math.max(maxX, x),
        maxY: Math.max(maxY, y),
        minX: Math.min(minX, x),
        minY: Math.min(minY, y),
      };
    },
    {
      maxX: NEGATIVE_INFINITY,
      maxY: NEGATIVE_INFINITY,
      minX: POSITIVE_INFINITY,
      minY: POSITIVE_INFINITY,
    }
  );
}

async function updateVideo(event: any) {
  const camera = getCamera();

  // Clear reference to any previous uploaded video.
  URL.revokeObjectURL(camera.video.currentSrc);
  const file = event.target.files[0];
  camera.source.src = URL.createObjectURL(file);

  // Wait for video to be loaded.
  camera.video.load();
  await new Promise((resolve) => {
    camera.video.onloadeddata = () => {
      resolve(true);
    };
  });

  const videoWidth = camera.video.videoWidth;
  const videoHeight = camera.video.videoHeight;
  // Must set below two lines, otherwise video element doesn't show.
  camera.video.width = videoWidth;
  camera.video.height = videoHeight;
  camera.canvas.width = videoWidth;
  camera.canvas.height = videoHeight;

  console.log({
    videoWidth,
    videoHeight,
  });

  tracker.areas = [
    [
      {
        xMin: 0.0 * camera.canvas.width,
        yMin: 0.75 * camera.canvas.height,
        xMax: 1.0 * camera.canvas.width,
        yMax: 1.0 * camera.canvas.height,
        width: 1.0 * camera.canvas.width,
        height: 0.25 * camera.canvas.height,
      },
      {
        xMin: 0.0 * camera.canvas.width,
        yMin: 0.0 * camera.canvas.height,
        xMax: 1.0 * camera.canvas.width,
        yMax: 0.25 * camera.canvas.height,
        width: 1.0 * camera.canvas.width,
        height: 0.25 * camera.canvas.height,
      },
    ],
  ];

  console.log("Video is loaded.");
}

function beginEstimatePosesStats() {
  startInferenceTime = (performance || Date).now();
}

function endEstimatePosesStats() {
  const stats = getStats();
  const endInferenceTime = (performance || Date).now();
  inferenceTimeSum += endInferenceTime - startInferenceTime;
  ++numInferences;

  const panelUpdateMilliseconds = 1000;
  if (endInferenceTime - lastPanelUpdate >= panelUpdateMilliseconds) {
    const averageInferenceTime = inferenceTimeSum / numInferences;
    inferenceTimeSum = 0;
    numInferences = 0;
    stats.customFpsPanel.update(
      1000.0 / averageInferenceTime,
      120 /* maxValue */
    );
    lastPanelUpdate = endInferenceTime;
  }
}

const renderResult = async () => {
  const camera = getCamera();
  const detector = getDetector();

  // FPS only counts the time it takes to finish estimatePoses.
  beginEstimatePosesStats();

  let poses = await detector.estimatePoses(camera.video, {
    maxPoses: STATE.modelConfig.maxPoses,
    flipHorizontal: false,
    scoreThreshold: STATE.modelConfig.scoreThreshold,
    nmsRadius: 20,
  });

  poses.forEach((pose: any) => {
    const boundingBox = getBoundingBox(pose.keypoints);
    pose.box = {
      yMin: boundingBox.minY,
      xMin: boundingBox.minX,
      yMax: boundingBox.maxY,
      xMax: boundingBox.maxX,
      width: boundingBox.maxX - boundingBox.minX,
      height: boundingBox.maxY - boundingBox.minY,
    };
  });

  const timestamp = camera.video.currentTime * SECOND_TO_MICRO_SECONDS;
  tracker.apply(poses, timestamp);

  endEstimatePosesStats();

  console.log("poses1 ids", JSON.stringify(poses.map(({ id }) => id)));
  console.log("poses1", poses);

  const poses2 = poses.filter((pose: any) => pose.id !== -1);

  console.log("poses2 ids", JSON.stringify(poses2.map(({ id }) => id)));
  console.log("poses2", poses2);

  poses = poses2;

  camera.drawCtx();

  camera.drawAreas(tracker.areas);

  camera.drawCurrentTime();

  // The null check makes sure the UI is not in the middle of changing to a
  // different model. If during model change, the result is from an old
  // model, which shouldn't be rendered.
  if (poses.length > 0 && !STATE.isModelChanged) {
    camera.drawResults(poses);
  }
};

const runFrame = async () => {
  const camera = getCamera();
  if (camera.video.paused) {
    // video has finished.
    // camera.mediaRecorder.stop();
    camera.clearCtx();
    // camera.video.style.visibility = 'visible';
    return;
  }
  await renderResult();
  rafId = requestAnimationFrame(runFrame);
};

const nextFrame = async () => {
  const camera = getCamera();
  camera.video.pause();
  camera.video.currentTime = camera.video.currentTime + 1 / 30.0;
  await new Promise((resolve) => {
    camera.video.onseeked = () => {
      resolve(true);
    };
  });
  await renderResult();
};

const run = async () => {
  console.log("Warming up model.");
  const camera = getCamera();
  const detector = getDetector();

  // Warming up pipeline.
  const [runtime, $backend] = STATE.backend.split("-");

  if (runtime === "tfjs") {
    const warmUpTensor: any = tf.fill(
      [camera.video.height, camera.video.width, 3],
      0,
      "float32"
    );
    await detector.estimatePoses(warmUpTensor, {
      maxPoses: STATE.modelConfig.maxPoses,
      flipHorizontal: false,
      scoreThreshold: STATE.modelConfig.scoreThreshold,
      nmsRadius: 20,
    });
    warmUpTensor.dispose();
    console.log("Model is warmed up.");
  }

  // camera.video.style.visibility = 'hidden';
  camera.video.pause();
  camera.video.currentTime = 0.0;
  // camera.video.play();
  // camera.mediaRecorder.start();

  await new Promise((resolve) => {
    camera.video.onseeked = () => {
      resolve(true);
    };
  });

  await renderResult();

  return;

  await runFrame();
};

export default function Demo() {
  useEffect(() => {
    app();
  }, []);

  return (
    <div className="mt-20">
      <div id="stats"></div>
      <div>
        <div className="flex p-2 space-x-2">
          <div>
            <label
              htmlFor="file-upload"
              className="cursor-pointer inline-flex items-center relative px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <span>開啟影片</span>
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                className="sr-only"
                onChange={updateVideo}
                accept=".mov,.mp4"
              />
            </label>
          </div>

          <div>
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={run}
            >
              運行
            </button>

            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={nextFrame}
            >
              下一格
            </button>
          </div>
        </div>

        <div>
          <div className="flex">
            <div>
              <canvas id="output"></canvas>
            </div>
          </div>
          <video id="video">
            <source id="currentVID" src="" type="video/mp4" />
          </video>
        </div>
      </div>
    </div>
  );
}
