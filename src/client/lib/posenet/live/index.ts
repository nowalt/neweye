import "@tensorflow/tfjs-backend-webgl";
import * as posedetection from "@tensorflow-models/pose-detection";
import { Keypoint } from "@tensorflow-models/pose-detection";

import { Camera } from "./camera";
import { setupDatGui } from "./option_panel";
import { STATE } from "./params";
import { setupStats } from "./stats_panel";
import { setBackendAndEnvFlags } from "./util";
import { BoundingBoxTracker } from "../../bounding_box_tracker";

let detector: any, camera: any, stats: any;
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

async function createDetector() {
  return posedetection.createDetector(STATE.model, {
    quantBytes: 4,
    architecture: "MobileNetV1",
    outputStride: 16,
    inputResolution: { width: 320, height: 320 },
    multiplier: 0.75,
  });
}

function beginEstimatePosesStats() {
  startInferenceTime = (performance || Date).now();
}

function endEstimatePosesStats() {
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

async function renderResult() {
  if (camera.video.readyState < 2) {
    await new Promise((resolve) => {
      camera.video.onloadeddata = () => {
        resolve(true);
      };
    });
  }

  let poses = [];

  // Detector can be null if initialization failed (for example when loading
  // from a URL that does not exist).
  if (detector != null) {
    // FPS only counts the time it takes to finish estimatePoses.
    beginEstimatePosesStats();

    // Detectors can throw errors, for example when using custom URLs that
    // contain a model that doesn't provide the expected output.
    try {
      poses = await detector.estimatePoses(camera.video, {
        maxPoses: STATE.modelConfig.maxPoses,
        flipHorizontal: true,
        scoreThreshold: STATE.modelConfig.scoreThreshold,
        nmsRadius: 20,
      });
    } catch (error) {
      detector.dispose();
      detector = null;
      alert(error);
    }

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

    // console.log("poses1 ids", JSON.stringify(poses.map(({ id }) => id)));
    // console.log("poses1", poses);

    const poses2 = poses.filter((pose: any) => pose.id !== -1);

    // console.log("poses2 ids", JSON.stringify(poses2.map(({ id }) => id)));
    // console.log("poses2", poses2);

    poses = poses2;

    endEstimatePosesStats();
  }

  camera.drawCtx();

  // The null check makes sure the UI is not in the middle of changing to a
  // different model. If during model change, the result is from an old model,
  // which shouldn't be rendered.
  if (poses && poses.length > 0) {
    camera.drawResults(poses);
  }
}

async function renderPrediction() {
  await renderResult();

  rafId = requestAnimationFrame(renderPrediction);
}

export async function app() {
  await setupDatGui();

  stats = setupStats();

  camera = await Camera.setupCamera(STATE.camera);

  await setBackendAndEnvFlags(STATE.flags, STATE.backend);

  detector = await createDetector();

  renderPrediction();

  // camera.ctx.moveTo(0, 0);
  // camera.ctx.lineTo(200, 100);
  // camera.ctx.stroke();

  setTimeout(() => {
    console.log("STATE", STATE);
  }, 2000);
}
