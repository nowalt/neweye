import * as posedetection from "@tensorflow-models/pose-detection";

import * as params from "./params";

const COLOR_PALETTE = [
  "#ffffff",
  "#800000",
  "#469990",
  "#e6194b",
  "#42d4f4",
  "#fabed4",
  "#aaffc3",
  "#9a6324",
  "#000075",
  "#f58231",
  "#4363d8",
  "#ffd8b1",
  "#dcbeff",
  "#808000",
  "#ffe119",
  "#911eb4",
  "#bfef45",
  "#f032e6",
  "#3cb44b",
  "#a9a9a9",
];

export class Context {
  video: HTMLVideoElement;
  canvas: HTMLCanvasElement;
  source: HTMLSourceElement;
  ctx: any;
  mediaRecorder: MediaRecorder;

  constructor() {
    this.video = document.getElementById("video") as HTMLVideoElement;
    this.canvas = document.getElementById("output") as HTMLCanvasElement;
    this.source = document.getElementById("currentVID") as HTMLSourceElement;
    this.ctx = this.canvas.getContext("2d");
    const stream = this.canvas.captureStream();
    const options = { mimeType: "video/webm; codecs=vp9" };
    this.mediaRecorder = new MediaRecorder(stream, options);
    this.mediaRecorder.ondataavailable = this.handleDataAvailable;
  }

  drawCtx() {
    this.ctx.drawImage(
      this.video,
      0,
      0,
      this.video.videoWidth,
      this.video.videoHeight
    );
  }

  // tracker.areas = [
  //   [
  //     {
  //       xMin: 0.0 * camera.canvas.width,
  //       yMin: 0.625 * camera.canvas.height,
  //       xMax: 1.0 * camera.canvas.width,
  //       yMax: 1.0 * camera.canvas.height,
  //       width: 1.0 * camera.canvas.width,
  //       height: 0.375 * camera.canvas.height,
  //     },
  //     {
  //       xMin: 0.0 * camera.canvas.width,
  //       yMin: 0.0 * camera.canvas.height,
  //       xMax: 1.0 * camera.canvas.width,
  //       yMax: 0.375 * camera.canvas.height,
  //       width: 1.0 * camera.canvas.width,
  //       height: 0.375 * camera.canvas.height,
  //     },
  //   ],
  // ];

  drawAreas(areas = []) {
    areas.forEach((area: any) => {
      console.log("area", area);
      // 畫開始區，離開區
      if (area[0]) {
        this.ctx.beginPath();
        this.ctx.strokeStyle = "green";
        this.ctx.fillStyle = "rgba(0, 255, 0, 0.3)";
        this.ctx.rect(area[0].xMin, area[0].yMin, area[0].xMax, area[0].yMax);
        this.ctx.stroke();
        this.ctx.fill();
      }

      if (area[1]) {
        this.ctx.beginPath();
        this.ctx.strokeStyle = "red";
        this.ctx.fillStyle = "rgba(255, 0, 0, 0.3)";
        this.ctx.rect(area[1].xMin, area[1].yMin, area[1].xMax, area[1].yMax);
        this.ctx.stroke();
        this.ctx.fill();
      }
    });
  }

  clearCtx() {
    this.ctx.clearRect(0, 0, this.video.videoWidth, this.video.videoHeight);
  }

  /**
   * Draw the keypoints and skeleton on the video.
   * @param poses A list of poses to render.
   */
  drawResults(poses: any) {
    // this.drawCurrentTime();
    for (const pose of poses) {
      this.drawResult(pose);
    }
  }

  /**
   * Draw the keypoints and skeleton on the video.
   * @param pose A pose with keypoints to render.
   */
  drawResult(pose: any) {
    if (pose.keypoints != null) {
      this.drawKeypoints(pose);
      this.drawSkeleton(pose);
      this.drawBoundingBox(pose);
    }
  }

  drawCurrentTime() {
    const color = "White";

    this.ctx.fillStyle = color;
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = params.DEFAULT_LINE_WIDTH;

    const font = "16px sans-serif";
    this.ctx.font = font;
    this.ctx.textBaseline = "top";
    console.log("drawCurrentTime", this.video.currentTime);
    this.ctx.fillText(this.video.currentTime, 0, 0);
  }

  /**
   * Draw the keypoints on the video.
   * @param keypoints A list of keypoints.
   */
  drawKeypoints(pose: any) {
    const keypointInd = posedetection.util.getKeypointIndexBySide(
      params.STATE.model
    );
    this.ctx.fillStyle = "White";
    this.ctx.strokeStyle = "White";
    this.ctx.lineWidth = params.DEFAULT_LINE_WIDTH;

    for (const i of keypointInd.middle) {
      this.drawKeypoint(pose.keypoints[i]);
    }

    this.ctx.fillStyle = "Green";
    for (const i of keypointInd.left) {
      this.drawKeypoint(pose.keypoints[i]);
    }

    this.ctx.fillStyle = "Orange";
    for (const i of keypointInd.right) {
      this.drawKeypoint(pose.keypoints[i]);
    }
  }

  drawKeypoint(keypoint: any) {
    // If score is null, just show the keypoint.
    const score = keypoint.score != null ? keypoint.score : 1;
    const scoreThreshold = params.STATE.modelConfig.scoreThreshold || 0;

    // if (score >= scoreThreshold) {
    const circle = new Path2D();
    circle.arc(keypoint.x, keypoint.y, params.DEFAULT_RADIUS, 0, 2 * Math.PI);
    this.ctx.fill(circle);
    this.ctx.stroke(circle);
    // }
  }

  /**
   * Draw the skeleton of a body on the video.
   * @param keypoints A list of keypoints.
   */
  drawSkeleton(pose: any) {
    // Each poseId is mapped to a color in the color palette.
    let color =
      pose.id != null && typeof pose.id !== "undefined"
        ? COLOR_PALETTE[pose.id % 20]
        : "White";

    if (pose.score < 0.25) color = "White";

    this.ctx.fillStyle = color;
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = params.DEFAULT_LINE_WIDTH;

    posedetection.util
      .getAdjacentPairs(params.STATE.model)
      .forEach(([i, j]) => {
        const kp1 = pose.keypoints[i];
        const kp2 = pose.keypoints[j];

        // If score is null, just show the keypoint.
        const score1 = kp1.score != null ? kp1.score : 1;
        const score2 = kp2.score != null ? kp2.score : 1;
        const scoreThreshold = params.STATE.modelConfig.scoreThreshold || 0;

        // if (score1 >= scoreThreshold && score2 >= scoreThreshold) {
        this.ctx.beginPath();
        this.ctx.moveTo(kp1.x, kp1.y);
        this.ctx.lineTo(kp2.x, kp2.y);
        this.ctx.stroke();
        // }
      });
  }

  drawBoundingBox(pose: any) {
    let color =
      pose.id != null && typeof pose.id !== "undefined"
        ? COLOR_PALETTE[pose.id % 20]
        : "Red";
    if (pose.score < 0.25) color = "Blue";

    this.ctx.fillStyle = color;
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = params.DEFAULT_LINE_WIDTH;
    this.ctx.beginPath();
    this.ctx.rect(
      pose.box.xMin,
      pose.box.yMin,
      pose.box.width,
      pose.box.height
    );
    this.ctx.stroke();

    // console.log(`drawBoundingBox#${pose.id}`, { color, box: pose.box });

    if (pose.id != null && typeof pose.id !== "undefined") {
      const font = "16px sans-serif";
      this.ctx.font = font;
      this.ctx.textBaseline = "top";
      // console.log("fillText", pose.id, pose.box.xMin, pose.box.yMin);
      this.ctx.fillText(pose.id, pose.box.xMin, pose.box.yMin);
    }
  }

  start() {
    this.mediaRecorder.start();
  }

  stop() {
    this.mediaRecorder.stop();
  }

  handleDataAvailable(event: any) {
    if (event.data.size > 0) {
      const recordedChunks = [event.data];

      // Download.
      const blob = new Blob(recordedChunks, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      const a: any = document.createElement("a");
      document.body.appendChild(a);
      a.style = "display: none";
      a.href = url;
      a.download = "pose.webm";
      a.click();
      window.URL.revokeObjectURL(url);
    }
  }
}
