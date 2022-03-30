import * as tf from "@tensorflow/tfjs-core";
import "@tensorflow/tfjs-backend-webgl";
import * as posedetection from "@tensorflow-models/pose-detection";

import { STATE } from "./params";
import { setupStats } from "./stats_panel";
import { setupDatGui } from "./option_panel";
import { setBackendAndEnvFlags } from "./util";
import { Context } from "./camera";

let detector: posedetection.PoseDetector, camera: Context, stats: any;

async function createDetector() {
  return posedetection.createDetector(STATE.model, {
    quantBytes: 4,
    architecture: "MobileNetV1",
    outputStride: 16,
    inputResolution: { width: 320, height: 320 },
    multiplier: 0.75,
  });
}

export const app = async () => {
  await setupDatGui();
  stats = setupStats();
  detector = await createDetector();
  camera = new Context();

  await setBackendAndEnvFlags(STATE.flags, STATE.backend);
};

export const getCamera = () => camera;
export const getDetector = () => detector;
export const getStats = () => stats;

export { STATE };
