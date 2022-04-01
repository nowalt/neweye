import "@tensorflow/tfjs-core";
import "@tensorflow/tfjs-backend-webgl";
import "@tensorflow-models/pose-detection";
import { useEffect } from "react";

import { app, dispose } from "../../lib/posenet/live";

export default function Camera() {
  useEffect(() => {
    app();
    return () => {
      // alert("unmount!!!!!!!!!!!!!!");
      dispose();
    };
  }, []);

  return (
    <div className="relative">
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
            className="hidden"
            style={{ transform: "scaleX(-1)" }}
          ></video>
        </div>
      </div>
    </div>
  );
}
