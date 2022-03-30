import * as posedetection from "@tensorflow-models/pose-detection";
import * as tf from "@tensorflow/tfjs-core";

import * as params from "./params";

let TUNABLE_FLAG_DEFAULT_VALUE_MAP: any;

async function showBackendConfigs() {
  const backends = params.MODEL_BACKEND_MAP[params.STATE.model];
  params.STATE.backend = backends[0];
  await showFlagSettings();
}

function showModelConfigs() {
  addPoseNetControllers();
}

function addPoseNetControllers() {
  params.STATE.modelConfig = { ...params.POSENET_CONFIG };
}

export async function setupDatGui() {
  params.STATE.model = posedetection.SupportedModels.PoseNet;

  showModelConfigs();

  showBackendConfigs();
}

async function initDefaultValueMap() {
  // Clean up the cache to query tunable flags' default values.
  TUNABLE_FLAG_DEFAULT_VALUE_MAP = {};
  params.STATE.flags = {};
  for (const backend in params.BACKEND_FLAGS_MAP) {
    for (
      let index = 0;
      index < params.BACKEND_FLAGS_MAP[backend].length;
      index++
    ) {
      const flag = params.BACKEND_FLAGS_MAP[backend][index];
      TUNABLE_FLAG_DEFAULT_VALUE_MAP[flag] = await tf.env().getAsync(flag);
    }
  }

  // Initialize STATE.flags with tunable flags' default values.
  for (const flag in TUNABLE_FLAG_DEFAULT_VALUE_MAP) {
    if (params.BACKEND_FLAGS_MAP[params.STATE.backend].indexOf(flag) > -1) {
      params.STATE.flags[flag] = TUNABLE_FLAG_DEFAULT_VALUE_MAP[flag];
    }
  }
}

async function showFlagSettings() {
  await initDefaultValueMap();
}
