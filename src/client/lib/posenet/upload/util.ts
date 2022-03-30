import * as tf from "@tensorflow/tfjs-core";
import { TUNABLE_FLAG_VALUE_RANGE_MAP } from "./params";

export function isMobile() {
  const isAndroid = /Android/i.test(navigator.userAgent);
  const isiOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  return isAndroid || isiOS;
}

async function resetBackend(backendName: string) {
  const ENGINE = tf.engine();
  if (!(backendName in ENGINE.registryFactory)) {
    throw new Error(`${backendName} backend is not registed.`);
  }

  if (backendName in ENGINE.registry) {
    const backendFactory = tf.findBackendFactory(backendName);
    tf.removeBackend(backendName);
    tf.registerBackend(backendName, backendFactory);
  }

  await tf.setBackend(backendName);
}

export async function setBackendAndEnvFlags(flagConfig: any, backend: string) {
  if (flagConfig == null) {
    return;
  } else if (typeof flagConfig !== "object") {
    throw new Error(
      `An object is expected, while a(n) ${typeof flagConfig} is found.`
    );
  }

  // Check the validation of flags and values.
  for (const flag in flagConfig) {
    // TODO: check whether flag can be set as flagConfig[flag].
    if (!(flag in TUNABLE_FLAG_VALUE_RANGE_MAP)) {
      throw new Error(`${flag} is not a tunable or valid environment flag.`);
    }
    if (TUNABLE_FLAG_VALUE_RANGE_MAP[flag].indexOf(flagConfig[flag]) === -1) {
      throw new Error(
        `${flag} value is expected to be in the range [${TUNABLE_FLAG_VALUE_RANGE_MAP[flag]}], while ${flagConfig[flag]}` +
          " is found."
      );
    }
  }

  tf.env().setFlags(flagConfig);

  const [runtime, $backend] = backend.split("-");

  if (runtime === "tfjs") {
    await resetBackend($backend);
  }
}
