import * as posedetection from "@tensorflow-models/pose-detection";

import * as params from "./params";
import { isMobile } from "./util";

// These anchor points allow the pose pointcloud to resize according to its
// position in the input.
const ANCHOR_POINTS = [
  [0, 0, 0],
  [0, 1, 0],
  [-1, 0, 0],
  [-1, -1, 0],
];

// #ffffff - White
// #800000 - Maroon
// #469990 - Malachite
// #e6194b - Crimson
// #42d4f4 - Picton Blue
// #fabed4 - Cupid
// #aaffc3 - Mint Green
// #9a6324 - Kumera
// #000075 - Navy Blue
// #f58231 - Jaffa
// #4363d8 - Royal Blue
// #ffd8b1 - Caramel
// #dcbeff - Mauve
// #808000 - Olive
// #ffe119 - Candlelight
// #911eb4 - Seance
// #bfef45 - Inchworm
// #f032e6 - Razzle Dazzle Rose
// #3cb44b - Chateau Green
// #a9a9a9 - Silver Chalice
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
export class Camera {
  video: HTMLVideoElement;
  canvas: HTMLCanvasElement;
  ctx: any;

  constructor() {
    this.video = document.getElementById("video") as HTMLVideoElement;
    this.canvas = document.getElementById("output") as HTMLCanvasElement;
    this.ctx = this.canvas.getContext("2d");
  }

  /**
   * Initiate a Camera instance and wait for the camera stream to be ready.
   * @param cameraParam From app `STATE.camera`.
   */
  static async setupCamera(cameraParam: any) {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error(
        "Browser API navigator.mediaDevices.getUserMedia not available"
      );
    }

    const { targetFPS, sizeOption } = cameraParam;
    const $size = params.VIDEO_SIZE[sizeOption];
    const videoConfig = {
      audio: false,
      video: {
        facingMode: "user",
        // Only setting the video to a specified size for large screen, on
        // mobile devices accept the default size.
        width: isMobile() ? params.VIDEO_SIZE["360 X 270"].width : $size.width,
        height: isMobile()
          ? params.VIDEO_SIZE["360 X 270"].height
          : $size.height,
        frameRate: {
          ideal: targetFPS,
        },
      },
    };

    const stream = await navigator.mediaDevices.getUserMedia(videoConfig);

    const camera = new Camera();
    camera.video.srcObject = stream;

    await new Promise((resolve) => {
      camera.video.onloadedmetadata = () => {
        resolve(true);
      };
    });

    camera.video.play();

    const videoWidth = camera.video.videoWidth;
    const videoHeight = camera.video.videoHeight;
    // Must set below two lines, otherwise video element doesn't show.
    camera.video.width = videoWidth;
    camera.video.height = videoHeight;

    camera.canvas.width = videoWidth;
    camera.canvas.height = videoHeight;

    // Because the image from camera is mirrored, need to flip horizontally.
    // camera.ctx.translate(camera.video.videoWidth, 0);
    // camera.ctx.scale(-1, 1);

    return camera;
  }

  drawCtx() {
    this.ctx.save();

    this.ctx.translate(this.video.videoWidth, 0);
    this.ctx.scale(-1, 1);

    this.ctx.drawImage(
      this.video,
      0,
      0,
      this.video.videoWidth,
      this.video.videoHeight
    );

    this.ctx.restore();
  }

  clearCtx() {
    this.ctx.clearRect(0, 0, this.video.videoWidth, this.video.videoHeight);
  }

  /**
   * Draw the keypoints and skeleton on the video.
   * @param poses A list of poses to render.
   */
  drawResults(poses: any) {
    for (const pose of poses) {
      this.drawResult(pose);
    }
  }

  /**
   * Draw the keypoints and skeleton on the video.
   * @param pose A pose with keypoints to render.
   */
  drawResult(pose: any) {
    // this.drawCurrentTime();
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
}