import * as posedetection from "@tensorflow-models/pose-detection";

export const DEFAULT_LINE_WIDTH = 2;
export const DEFAULT_RADIUS = 2;

export const STATE: any = {
  backend: "",
  flags: {},
  modelConfig: {},
  model: null,
};

export const POSENET_CONFIG = {
  maxPoses: 20,
  scoreThreshold: 0.5,
};

export const BACKEND_FLAGS_MAP: any = {
  // ["tfjs-wasm"]: ["WASM_HAS_SIMD_SUPPORT", "WASM_HAS_MULTITHREAD_SUPPORT"],
  ["tfjs-webgl"]: [
    "WEBGL_VERSION",
    "WEBGL_CPU_FORWARD",
    "WEBGL_PACK",
    "WEBGL_FORCE_F16_TEXTURES",
    "WEBGL_RENDER_FLOAT32_CAPABLE",
    "WEBGL_FLUSH_THRESHOLD",
  ],
  // ["mediapipe-gpu"]: [],
};

export const MODEL_BACKEND_MAP: any = {
  [posedetection.SupportedModels.PoseNet]: ["tfjs-webgl"],
  [posedetection.SupportedModels.MoveNet]: ["tfjs-webgl", "tfjs-wasm"],
  [posedetection.SupportedModels.BlazePose]: ["mediapipe-gpu", "tfjs-webgl"],
};

export const TUNABLE_FLAG_VALUE_RANGE_MAP: any = {
  WEBGL_VERSION: [1, 2],
  WASM_HAS_SIMD_SUPPORT: [true, false],
  WASM_HAS_MULTITHREAD_SUPPORT: [true, false],
  WEBGL_CPU_FORWARD: [true, false],
  WEBGL_PACK: [true, false],
  WEBGL_FORCE_F16_TEXTURES: [true, false],
  WEBGL_RENDER_FLOAT32_CAPABLE: [true, false],
  WEBGL_FLUSH_THRESHOLD: [-1, 0, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2],
  CHECK_COMPUTATION_FOR_ERRORS: [true, false],
};
