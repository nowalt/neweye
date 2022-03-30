import * as tf from "@tensorflow/tfjs-core";
import "@tensorflow/tfjs-backend-webgl";
import * as posedetection from "@tensorflow-models/pose-detection";
import { useEffect } from "react";
import { app } from "../../../client/lib/posenet/live";

export default function Demo() {
  useEffect(() => {
    app();
  }, []);

  return (
    <div className="mt-20">
      <div id="stats"></div>
      <div>
        <div>
          <div className="flex">
            <div>
              <canvas id="output"></canvas>
            </div>
          </div>
          <video
            id="video"
            playsInline
            style={{ transform: "scaleX(-1)" }}
          ></video>
        </div>
      </div>
    </div>
  );
}
