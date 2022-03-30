import { useEffect, useRef, useState } from "react";
import Stats from "stats.js";
import * as tf from "@tensorflow/tfjs-core";
import "@tensorflow/tfjs-backend-webgl";
import * as tfjsWasm from "@tensorflow/tfjs-backend-wasm";
import * as posedetection from "@tensorflow-models/pose-detection";
// import { BoundingBoxTracker } from "@tensorflow-models/pose-detection/dist/calculators/bounding_box_tracker";
import { KeypointsOneEuroFilter } from "@tensorflow-models/pose-detection/dist/shared/filters/keypoints_one_euro_filter";
import { Keypoint, Pose } from "@tensorflow-models/pose-detection";
import { Track } from "@tensorflow-models/pose-detection/dist/calculators/interfaces/common_interfaces";
import { TrackerConfig } from "@tensorflow-models/pose-detection/dist/calculators/interfaces/config_interfaces";
// import {Tracker} from '@tensorflow-models/pose-detection/dist/calculators/tracker';
import _ from "lodash";
import { getImageSize } from "@tensorflow-models/pose-detection/dist/shared/calculators/image_utils";
// import * as mpPose from '@mediapipe/pose';

// 1. 先配對 similarity 高的, 今次 poses 和 已有的 tracker

tfjsWasm.setWasmPaths(
  `https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-wasm@${tfjsWasm.version_wasm}/dist/`
);

const STATE: any = {
  backend: "",
  flags: {},
  modelConfig: {},
  model: null,
};
const DEFAULT_LINE_WIDTH = 2;
const DEFAULT_RADIUS = 2;
const SECOND_TO_MICRO_SECONDS = 1e6;
const KEYPOINT_FILTER_CONFIG = {
  frequency: 30,
  minCutOff: 2.5,
  beta: 300.0,
  derivateCutOff: 2.5,
  thresholdCutOff: 0.5,
  thresholdBeta: 5.0,
  disableValueScaling: true,
};
const COLOR_PALETTE = [
  "#ffffff", // 0
  "#800000", // 1
  "#469990", // 2
  "#e6194b", // 3
  "#42d4f4", // 4
  "#fabed4", // 5
  "#aaffc3", // 6
  "#9a6324", // 7
  "#000075", // 8
  "#f58231", // 9
  "#4363d8", // 10
  "#ffd8b1", // 11
  "#dcbeff", // 12
  "#808000", // 13
  "#ffe119", // 14
  "#911eb4", // 15
  "#bfef45", // 16
  "#f032e6", // 17
  "#3cb44b", // 18
  "#a9a9a9", // 19
];

function validateTrackerConfig(config: TrackerConfig): void {
  if (config.maxTracks < 1) {
    throw new Error(
      `Must specify 'maxTracks' to be at least 1, but ` +
        `encountered ${config.maxTracks}`
    );
  }
  if (config.maxAge <= 0) {
    throw new Error(
      `Must specify 'maxAge' to be positive, but ` +
        `encountered ${config.maxAge}`
    );
  }

  if (config.keypointTrackerParams !== undefined) {
    if (
      config.keypointTrackerParams.keypointConfidenceThreshold < 0 ||
      config.keypointTrackerParams.keypointConfidenceThreshold > 1
    ) {
      throw new Error(
        `Must specify 'keypointConfidenceThreshold' to be in the range ` +
          `[0, 1], but encountered ` +
          `${config.keypointTrackerParams.keypointConfidenceThreshold}`
      );
    }
    if (config.keypointTrackerParams.minNumberOfKeypoints < 1) {
      throw new Error(
        `Must specify 'minNumberOfKeypoints' to be at least 1, but ` +
          `encountered ${config.keypointTrackerParams.minNumberOfKeypoints}`
      );
    }
    for (const falloff of config.keypointTrackerParams.keypointFalloff) {
      if (falloff <= 0.0) {
        throw new Error(
          `Must specify each keypoint falloff parameterto be positive ` +
            `but encountered ${falloff}`
        );
      }
    }
  }
}

abstract class Tracker {
  protected tracks: Track[];
  private readonly maxTracks: number;
  private readonly maxAge: number;
  private readonly minSimilarity: number;
  private nextID: number;

  constructor(config: TrackerConfig) {
    validateTrackerConfig(config);
    this.tracks = [];
    this.maxTracks = config.maxTracks;
    this.maxAge = config.maxAge * 1000; // Convert msec to usec.
    this.minSimilarity = config.minSimilarity;
    this.nextID = 1;
  }

  /**
   * Tracks person instances across frames based on detections.
   * @param poses An array of detected `Pose`s.
   * @param timestamp The timestamp associated with the incoming poses, in
   * microseconds.
   * @returns An updated array of `Pose`s with tracking id properties.
   */
  apply(poses: Pose[], timestamp: number): Pose[] {
    console.log("tracker apply!!!", "this.tracks", this.tracks);
    this.filterOldTracks(timestamp);
    console.log("tracker apply!!!", "after filter", this.tracks);
    const simMatrix = this.computeSimilarity(poses);
    console.log("tracker apply!!!", "simMatrix", simMatrix);
    this.assignTracks(poses, simMatrix, timestamp);
    this.updateTracks(timestamp);
    return poses;
  }

  /**
   * Computes pairwise similarity scores between detections and tracks, based
   * on detected features.
   * @param poses An array of detected `Pose`s.
   * @returns A 2D array of shape [num_det, num_tracks] with pairwise
   * similarity scores between detections and tracks.
   */
  abstract computeSimilarity(poses: Pose[]): number[][];

  /**
   * Returns a copy of the stored tracks.
   */
  getTracks(): Track[] {
    return this.tracks.slice();
  }

  /**
   * Returns a Set of active track IDs.
   */
  getTrackIDs(): Set<number> {
    return new Set(this.tracks.map((track) => track.id));
  }

  /**
   * Filters tracks based on their age.
   * @param timestamp The current timestamp in microseconds.
   */
  filterOldTracks(timestamp: number): void {
    this.tracks = this.tracks.filter((track) => {
      return timestamp - track.lastTimestamp <= this.maxAge;
    });
  }

  /**
   * Performs a greedy optimization to link detections with tracks. The `poses`
   * array is updated in place by providing an `id` property. If incoming
   * detections are not linked with existing tracks, new tracks will be created.
   * @param poses An array of detected `Pose`s. It's assumed that poses are
   * sorted from most confident to least confident.
   * @param simMatrix A 2D array of shape [num_det, num_tracks] with pairwise
   * similarity scores between detections and tracks.
   * @param timestamp The current timestamp in microseconds.
   */
  assignTracks(poses: Pose[], simMatrix: number[][], timestamp: number): void {
    console.log("assignTracks", "called");
    let unmatchedTrackIndices: any = Array.from(
      Array(simMatrix[0].length).keys()
    );
    unmatchedTrackIndices = unmatchedTrackIndices.map((index: any) => ({
      index,
    }));
    const matched: any = [];
    const detectionIndices = Array.from(Array(poses.length).keys());
    const unmatchedDetectionIndices: number[] = [];
    console.log("assignTracks", "unmatchedTrackIndices", unmatchedTrackIndices);
    camera.outputDebug.innerHTML += `trackers: ${JSON.stringify(
      unmatchedTrackIndices
    )}\n`;
    console.log("assignTracks", "detectionIndices", detectionIndices);
    camera.outputDebug.innerHTML += `今次 poses: ${JSON.stringify(
      detectionIndices
    )}\n`;
    console.log(
      "assignTracks",
      "unmatchedDetectionIndices",
      unmatchedDetectionIndices
    );

    console.log("assignTracks", "loop detectionIndices", detectionIndices);
    for (const detectionIndex of detectionIndices) {
      camera.outputDebug.innerHTML += `> 分析 poseIndex#${detectionIndex}\n`;
      console.log(">", detectionIndex);
      console.log(
        "> ",
        "unmatchedTrackIndices",
        JSON.stringify(unmatchedTrackIndices)
      );
      console.log(
        "> ",
        "unmatchedDetectionIndices",
        JSON.stringify(unmatchedDetectionIndices)
      );
      // 本身 unmatchedTrackIndices 沒東西的話
      // 目前第一個 detectionIndex 就是新的
      // if (unmatchedTrackIndices.length === 0) {
      //   unmatchedDetectionIndices.push(detectionIndex);
      //   continue;
      // }

      // Assign the detection to the track which produces the highest pairwise
      // similarity score, assuming the score exceeds the minimum similarity
      // threshold.
      let maxTrackIndex = -1;
      let maxSimilarity = -1;
      for (const obj of unmatchedTrackIndices) {
        const trackIndex = obj.index;
        const similarity = simMatrix[detectionIndex][trackIndex];
        // 有相關性
        if (similarity >= this.minSimilarity && similarity > maxSimilarity) {
          // if (!matched[trackIndex]) {
          // matched[trackIndex] = true;
          // maxTrackIndex = trackIndex;
          // maxSimilarity = similarity;
          // } else {
          //   if (similarity >= 0.8) {
          //     dupTrackIndex = trackIndex;
          //     dupSimilarity = similarity;
          //   }
          // }
          camera.outputDebug.innerHTML += `  > obj: ${JSON.stringify(obj)}\n`;
          if (typeof obj.detectionIndex !== "undefined") {
            if (similarity > obj.maxSimilarity) {
              poses[obj.detectionIndex].id = -1;
              camera.outputDebug.innerHTML += `  > 配錯了，把之前的變 -1\n`;

              maxTrackIndex = trackIndex;
              maxSimilarity = similarity;
              obj.detectionIndex = detectionIndex;
              obj.maxSimilarity = maxSimilarity;
            } else {
              poses[detectionIndex].id = -1;
              camera.outputDebug.innerHTML += `  > 配錯了，把現在的變 -1\n`;
            }
          } else {
            maxTrackIndex = trackIndex;
            maxSimilarity = similarity;
            obj.detectionIndex = detectionIndex;
            obj.maxSimilarity = maxSimilarity;
          }
        }
        console.log("  > ", "trackIndex", trackIndex, {
          similarity,
          maxTrackIndex,
          maxSimilarity,
        });
      }
      if (maxTrackIndex >= 0) {
        console.log("  > ", "找到相似", maxTrackIndex);
        camera.outputDebug.innerHTML += `  > 找到相似 ${JSON.stringify({
          maxTrackIndex,
          maxSimilarity,
        })}\n`;
        // Link the detection with the highest scoring track.
        let linkedTrack = this.tracks[maxTrackIndex];
        linkedTrack = Object.assign(
          linkedTrack,
          this.createTrack(poses[detectionIndex], timestamp, linkedTrack.id)
        );
        poses[detectionIndex].id = linkedTrack.id;
        camera.outputDebug.innerHTML += `  > poseIndex#${detectionIndex} = trackerId#${linkedTrack.id}\n`;
        // const index = unmatchedTrackIndices.indexOf(maxTrackIndex);
        // unmatchedTrackIndices.splice(index, 1);
        // console.log(
        //   "  > ",
        //   "因找到相似，所以 unmatchedTrackIndices 移走 index",
        //   index,
        //   [...unmatchedTrackIndices]
        // );
        matched.push(maxTrackIndex);
      } else {
        if (!poses[detectionIndex].id) {
          if ((poses[detectionIndex]?.score as number) < 0.25) {
            console.log(
              "  > ",
              "沒有找到與 tracker 相似, 且 pose.score < 0.25, 不可信",
              maxTrackIndex,
              maxSimilarity
            );
            poses[detectionIndex].id = -1;
            camera.outputDebug.innerHTML += `  > 沒有找到與 tracker 相似, 且 pose.score(${poses[detectionIndex]?.score}) < 0.25, 不可信\n`;
          } else {
            unmatchedDetectionIndices.push(detectionIndex);
            console.log(
              "  > ",
              "沒有相似, 加到 unmatchedDetectionIndices",
              JSON.stringify(unmatchedDetectionIndices)
            );
            camera.outputDebug.innerHTML += `  > 沒有相似, 將新增 tracker\n`;
          }
        }
      }
    }

    // Spawn new tracks for all unmatched detections.
    for (const detectionIndex of unmatchedDetectionIndices) {
      const newTrack = this.createTrack(poses[detectionIndex], timestamp);
      this.tracks.push(newTrack);
      poses[detectionIndex].id = newTrack.id;
      console.log(
        "> ",
        `新增 ${detectionIndex} 到 this.tracks`,
        "this.tracks.length",
        this.tracks.length
      );
    }
  }

  /**
   * Updates the stored tracks in the tracker. Specifically, the following
   * operations are applied in order:
   * 1. Tracks are sorted based on freshness (i.e. the most recently linked
   *    tracks are placed at the beginning of the array and the most stale are
   *    at the end).
   * 2. The tracks array is sliced to only contain `maxTracks` tracks (i.e. the
   *    most fresh tracks).
   * @param timestamp The current timestamp in microseconds.
   */
  updateTracks(timestamp: number): void {
    console.log("updateTracks", "排序和 filter this.tracks", [...this.tracks]);
    // Sort tracks from most recent to most stale, and then only keep the top
    // `maxTracks` tracks.
    this.tracks.sort((ta, tb) => tb.lastTimestamp - ta.lastTimestamp);
    this.tracks = this.tracks.slice(0, this.maxTracks);
  }

  /**
   * Creates a track from information in a pose.
   * @param pose A `Pose`.
   * @param timestamp The current timestamp in microseconds.
   * @param trackID The id to assign to the new track. If not provided,
   * will assign the next available id.
   * @returns A `Track`.
   */
  createTrack(pose: Pose, timestamp: number, trackID?: number): Track {
    const track: Track = {
      id: trackID || this.nextTrackID(),
      lastTimestamp: timestamp,
      keypoints: [...pose.keypoints].map((keypoint) => ({ ...keypoint })),
    };
    if (pose.box !== undefined) {
      track.box = { ...pose.box };
    }
    return track;
  }

  /**
   * Returns the next free track ID.
   */
  nextTrackID() {
    const nextID = this.nextID;
    this.nextID += 1;
    return nextID;
  }

  /**
   * Removes specific tracks, based on their ids.
   */
  remove(...ids: number[]): void {
    this.tracks = this.tracks.filter((track) => !ids.includes(track.id));
  }

  /**
   * Resets tracks.
   */
  reset(): void {
    this.tracks = [];
  }
}

class KeypointTracker extends Tracker {
  private readonly keypointThreshold: number;
  private readonly keypointFalloff: number[];
  private readonly minNumKeyoints: number;

  constructor(config: TrackerConfig) {
    super(config);
    this.keypointThreshold = config.keypointTrackerParams
      ?.keypointConfidenceThreshold as number;
    this.keypointFalloff = config.keypointTrackerParams
      ?.keypointFalloff as number[];
    this.minNumKeyoints = config.keypointTrackerParams
      ?.minNumberOfKeypoints as number;
  }

  /**
   * Computes similarity based on Object Keypoint Similarity (OKS). It's
   * assumed that the keypoints within each `Pose` are in normalized image
   * coordinates. See `Tracker` for more details.
   */
  computeSimilarity(poses: Pose[]): number[][] {
    if (poses.length === 0 || this.tracks.length === 0) {
      return [[]];
    }

    const simMatrix = [];
    for (const pose of poses) {
      const row = [];
      for (const track of this.tracks) {
        row.push(this.oks(pose, track));
      }
      simMatrix.push(row);
    }
    return simMatrix;
  }

  /**
   * Computes the Object Keypoint Similarity (OKS) between a pose and track.
   * This is similar in spirit to the calculation used by COCO keypoint eval:
   * https://cocodataset.org/#keypoints-eval
   * In this case, OKS is calculated as:
   * (1/sum_i d(c_i, c_ti)) * \sum_i exp(-d_i^2/(2*a_ti*x_i^2))*d(c_i, c_ti)
   * where
   *   d(x, y) is an indicator function which only produces 1 if x and y
   *     exceed a given threshold (i.e. keypointThreshold), otherwise 0.
   *   c_i is the confidence of keypoint i from the new pose
   *   c_ti is the confidence of keypoint i from the track
   *   d_i is the Euclidean distance between the pose and track keypoint
   *   a_ti is the area of the track object (the box covering the keypoints)
   *   x_i is a constant that controls falloff in a Gaussian distribution,
   *    computed as 2*keypointFalloff[i].
   * @param pose A `Pose`.
   * @param track A `Track`.
   * @returns The OKS score between the pose and the track. This number is
   * between 0 and 1, and larger values indicate more keypoint similarity.
   */
  private oks(pose: Pose, track: Track): number {
    const boxArea = this.area(track.keypoints as Keypoint[]) + 1e-6;
    let oksTotal = 0;
    let numValidKeypoints = 0;
    for (let i = 0; i < pose.keypoints.length; ++i) {
      const poseKpt = pose.keypoints[i] as Keypoint;
      const trackKpt = (track.keypoints as Keypoint[])[i];
      if (
        (poseKpt.score as number) < this.keypointThreshold ||
        (trackKpt.score as number) < this.keypointThreshold
      ) {
        continue;
      }
      numValidKeypoints += 1;
      const dSquared =
        Math.pow(poseKpt.x - trackKpt.x, 2) +
        Math.pow(poseKpt.y - trackKpt.y, 2);
      const x = 2 * this.keypointFalloff[i];
      oksTotal += Math.exp((-1 * dSquared) / (2 * boxArea * x ** 2));
    }
    if (numValidKeypoints < this.minNumKeyoints) {
      return 0.0;
    }
    return oksTotal / numValidKeypoints;
  }

  /**
   * Computes the area of a bounding box that tightly covers keypoints.
   * @param Keypoint[] An array of `Keypoint`s.
   * @returns The area of the object.
   */
  private area(keypoints: Keypoint[]): number {
    const validKeypoint = keypoints.filter(
      (kpt) => (kpt.score as number) > this.keypointThreshold
    );
    const minX = Math.min(1.0, ...validKeypoint.map((kpt) => kpt.x));
    const maxX = Math.max(0.0, ...validKeypoint.map((kpt) => kpt.x));
    const minY = Math.min(1.0, ...validKeypoint.map((kpt) => kpt.y));
    const maxY = Math.max(0.0, ...validKeypoint.map((kpt) => kpt.y));
    return (maxX - minX) * (maxY - minY);
  }
}

export class BoundingBoxTracker extends Tracker {
  constructor(config: TrackerConfig) {
    super(config);
  }

  /**
   * Computes similarity based on intersection-over-union (IoU). See `Tracker`
   * for more details.
   */
  computeSimilarity(poses: Pose[]): number[][] {
    console.log("computeSimilarity called", poses.length, this.tracks.length);
    if (poses.length === 0 || this.tracks.length === 0) {
      return [[]];
    }
    const simMatrix = poses.map((pose) => {
      return this.tracks.map((track) => {
        return this.iou(pose, track);
      });
    });
    console.log("computeSimilarity simMatrix", simMatrix);
    return simMatrix;
  }

  /**
   * Computes the intersection-over-union (IoU) between a pose and a track.
   * @param pose A `Pose`.
   * @param track A `Track`.
   * @returns The IoU  between the pose and the track. This number is
   * between 0 and 1, and larger values indicate more box similarity.
   */
  private iou(pose: Pose, track: Track): number {
    // console.log("iou", pose.box, track.box);
    if (!pose.box || !track.box) return 0.0;

    const xMin = Math.max(pose.box.xMin, track.box.xMin);
    const yMin = Math.max(pose.box.yMin, track.box.yMin);
    const xMax = Math.min(pose.box.xMax, track.box.xMax);
    const yMax = Math.min(pose.box.yMax, track.box.yMax);

    // console.log("iou", { xMin, yMin, xMax, yMax });

    if (xMin >= xMax || yMin >= yMax) {
      return 0.0;
    }
    const intersection = (xMax - xMin) * (yMax - yMin);
    const areaPose = pose.box.width * pose.box.height;
    const areaTrack = track.box.width * track.box.height;

    // 兩個矩形面程加起來減去 intersection = union(pose, track)
    // intersection / union ＝ 交互面積佔總面程的百分比
    return intersection / (areaPose + areaTrack - intersection);
  }
}

class Context {
  video: HTMLVideoElement;
  canvas: HTMLCanvasElement;
  source: HTMLSourceElement;
  ctx: any;
  prevCanvas: any;
  prevCtx: any;
  outputDebug: HTMLElement;
  prevOutputDebug: HTMLElement;
  canvas0: any;
  ctx0: any;
  prevCanvas0: any;
  prevCtx0: any;
  outputDebug0: HTMLElement;
  prevOutputDebug0: HTMLElement;
  mediaRecorder: MediaRecorder;

  constructor() {
    this.video = document.getElementById("video") as HTMLVideoElement;
    this.canvas0 = document.getElementById("output0") as HTMLCanvasElement;
    this.canvas = document.getElementById("output") as HTMLCanvasElement;
    this.prevCanvas0 = document.getElementById(
      "prevOutput0"
    ) as HTMLCanvasElement;
    this.prevCanvas = document.getElementById(
      "prevOutput"
    ) as HTMLCanvasElement;
    this.source = document.getElementById("currentVID") as HTMLSourceElement;
    this.ctx = this.canvas.getContext("2d");
    if (this.prevCanvas) {
      this.prevCtx = this.prevCanvas.getContext("2d");
    }
    if (this.canvas0) {
      this.ctx0 = this.canvas0.getContext("2d");
    }
    if (this.prevCanvas0) {
      this.prevCtx0 = this.prevCanvas0.getContext("2d");
    }
    this.outputDebug = document.getElementById("outputDebug") as HTMLElement;
    this.prevOutputDebug = document.getElementById(
      "prevOutputDebug"
    ) as HTMLElement;
    this.outputDebug0 = document.getElementById("outputDebug0") as HTMLElement;
    this.prevOutputDebug0 = document.getElementById(
      "prevOutputDebug0"
    ) as HTMLElement;

    const stream = this.canvas.captureStream();
    const options = { mimeType: "video/webm; codecs=vp9" };
    this.mediaRecorder = new MediaRecorder(stream, options);
    this.mediaRecorder.ondataavailable = this.handleDataAvailable;
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

  drawCtx(ctx: any = this.ctx) {
    ctx.drawImage(
      this.video,
      0,
      0,
      this.video.videoWidth,
      this.video.videoHeight
    );
  }

  clearCtx() {
    this.ctx.clearRect(0, 0, this.video.videoWidth, this.video.videoHeight);
  }

  drawResults(poses: any, ctx: any = this.ctx) {
    console.log(
      "---------------------- drawResults -----------------------",
      new Date()
    );
    for (const pose of poses) {
      this.drawResult(pose, ctx);
    }
  }

  drawResult(pose: any, ctx: any) {
    this.drawCurrentTime(ctx);
    if (pose.keypoints != null) {
      this.drawKeypoints(ctx, pose.keypoints, pose.id, pose.score);
      this.drawSkeleton(ctx, pose.keypoints, pose.id, pose.score);
      this.drawBoundingBox(ctx, pose.box, pose.id, pose.score);
    }
  }

  drawCurrentTime(ctx: any) {
    const color = "White";

    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.lineWidth = DEFAULT_LINE_WIDTH;

    const font = "16px sans-serif";
    ctx.font = font;
    ctx.textBaseline = "top";
    ctx.fillText(this.video.currentTime, 0, 0);
  }

  drawKeypoints(ctx: any, keypoints: any, poseId: any, poseScore: any) {
    const keypointInd = posedetection.util.getKeypointIndexBySide(STATE.model);
    ctx.fillStyle = "White";
    ctx.strokeStyle = "White";
    ctx.lineWidth = DEFAULT_LINE_WIDTH;

    for (const i of keypointInd.middle) {
      this.drawKeypoint(ctx, keypoints[i]);
    }

    ctx.fillStyle = "Green";
    for (const i of keypointInd.left) {
      this.drawKeypoint(ctx, keypoints[i]);
    }

    ctx.fillStyle = "Orange";
    for (const i of keypointInd.right) {
      this.drawKeypoint(ctx, keypoints[i]);
    }
  }

  drawKeypoint(ctx: any, keypoint: any) {
    // If score is null, just show the keypoint.
    const score = keypoint.score != null ? keypoint.score : 1;
    const scoreThreshold = STATE.modelConfig.scoreThreshold || 0;

    // if (score >= scoreThreshold) {
    const circle = new Path2D();
    circle.arc(keypoint.x, keypoint.y, DEFAULT_RADIUS, 0, 2 * Math.PI);
    ctx.fill(circle);
    ctx.stroke(circle);
    // }
  }

  drawSkeleton(ctx: any, keypoints: any, poseId: any, poseScore: any) {
    let color =
      poseId != null && typeof poseId !== "undefined"
        ? COLOR_PALETTE[poseId % 20]
        : "White";

    if (poseScore < 0.25) color = "White";

    console.log(`drawSkeleton#${poseId}`, color);
    if (ctx === this.ctx) {
      this.outputDebug.innerHTML += `drawSkeleton#${poseId}: ${color}\n`;
    }
    if (ctx === this.ctx0) {
      this.outputDebug0.innerHTML += `drawSkeleton#${poseId}: ${color}\n`;
    }
    if (ctx === this.prevCtx) {
      this.prevOutputDebug.innerHTML += `drawSkeleton#${poseId}: ${color}\n`;
    }
    if (ctx === this.prevCtx0) {
      this.prevOutputDebug0.innerHTML += `drawSkeleton#${poseId}: ${color}\n`;
    }

    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.lineWidth = DEFAULT_LINE_WIDTH;

    posedetection.util.getAdjacentPairs(STATE.model).forEach(([i, j]) => {
      const kp1 = keypoints[i];
      const kp2 = keypoints[j];

      // If score is null, just show the keypoint.
      const score1 = kp1.score != null ? kp1.score : 1;
      const score2 = kp2.score != null ? kp2.score : 1;
      const scoreThreshold = STATE.modelConfig.scoreThreshold || 0;

      // if (score1 >= scoreThreshold && score2 >= scoreThreshold) {
      ctx.beginPath();
      ctx.moveTo(kp1.x, kp1.y);
      ctx.lineTo(kp2.x, kp2.y);
      ctx.stroke();
      // }
    });
  }

  drawBoundingBox(ctx: any, box: any, poseId: any, poseScore: any) {
    let color =
      poseId != null && typeof poseId !== "undefined"
        ? COLOR_PALETTE[poseId % 20]
        : "Red";
    if (poseScore < 0.25) color = "Blue";

    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.lineWidth = DEFAULT_LINE_WIDTH;
    ctx.beginPath();
    ctx.rect(box.xMin, box.yMin, box.width, box.height);
    ctx.stroke();

    console.log(`drawBoundingBox#${poseId}`, { color, box });
    if (ctx === this.ctx) {
      this.outputDebug.innerHTML += JSON.stringify(box) + "\n";
    }
    if (ctx === this.ctx0) {
      this.outputDebug0.innerHTML += JSON.stringify(box) + "\n";
    }
    if (ctx === this.prevCtx) {
      this.prevOutputDebug.innerHTML += JSON.stringify(box) + "\n";
    }
    if (ctx === this.prevCtx0) {
      this.prevOutputDebug0.innerHTML += JSON.stringify(box) + "\n";
    }

    if (poseId != null && typeof poseId !== "undefined") {
      const font = "16px sans-serif";
      ctx.font = font;
      ctx.textBaseline = "top";
      ctx.fillText(poseId, box.xMin, box.yMin);
    }
  }
}

let camera: Context;
let stats: Stats;
let detector: posedetection.PoseDetector;
let customFpsPanel: Stats.Panel;
let rafId: any;
let startInferenceTime: any;
let numInferences = 0;
let inferenceTimeSum = 0;
let lastPanelUpdate = 0;
let tracker: BoundingBoxTracker;
let keypointFilterMap: Map<number, KeypointsOneEuroFilter>;

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

function setupStats() {
  const stats = new Stats();
  customFpsPanel = stats.addPanel(new Stats.Panel("FPS", "#0ff", "#002"));
  stats.showPanel(stats.dom.children.length - 1);

  const parent = document.getElementById("stats") as HTMLElement;
  parent.appendChild(stats.dom);

  const statsPanes = parent.querySelectorAll("canvas");

  for (let i = 0; i < statsPanes.length; ++i) {
    statsPanes[i].style.width = "140px";
    statsPanes[i].style.height = "80px";
  }
  return stats;
}

async function createDetector() {
  switch (STATE.model) {
    case posedetection.SupportedModels.PoseNet:
      return posedetection.createDetector(STATE.model, {
        quantBytes: 4,
        architecture: "MobileNetV1",
        outputStride: 16,
        inputResolution: { width: 500, height: 500 },
        multiplier: 0.75,
      });
  }
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
    customFpsPanel.update(1000.0 / averageInferenceTime, 120 /* maxValue */);
    lastPanelUpdate = endInferenceTime;
  }
}

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

async function renderResult() {
  if (camera.prevCtx) {
    camera.prevCtx.drawImage(camera.canvas, 0, 0);
  }
  if (camera.prevCtx0) {
    camera.prevCtx0.drawImage(camera.canvas0, 0, 0);
  }
  if (camera.prevOutputDebug) {
    camera.prevOutputDebug.innerHTML = camera.outputDebug.innerHTML;
  }
  if (camera.prevOutputDebug0) {
    camera.prevOutputDebug0.innerHTML = camera.outputDebug0.innerHTML;
  }

  // FPS only counts the time it takes to finish estimatePoses.
  beginEstimatePosesStats();

  let poses = await detector.estimatePoses(camera.video, {
    maxPoses: STATE.modelConfig.maxPoses,
    flipHorizontal: false,
    scoreThreshold: STATE.modelConfig.scoreThreshold,
    nmsRadius: 20,
  });

  console.log("poses1", poses);
  if (camera.outputDebug0) {
    camera.outputDebug0.innerHTML = "";
    camera.outputDebug0.innerHTML += "poses1: " + poses.length + "\n";
  }
  camera.outputDebug.innerHTML = "";

  const timestamp = camera.video.currentTime * SECOND_TO_MICRO_SECONDS;

  console.log(
    "================= renderResult ===================",
    camera.video.currentTime,
    timestamp
  );

  poses.forEach((pose) => {
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

  camera.drawCtx(camera.ctx0);
  if (poses.length > 0 && !STATE.isModelChanged) {
    camera.drawResults(poses, camera.ctx0);
  }

  // let resizedWidth: number;
  // let resizedHeight: number;
  // let paddedWidth: number;
  // let paddedHeight: number;
  // const dimensionDivisor = 32;  // Dimensions need to be divisible by 32.
  // const imageSize = getImageSize(camera.video);
  // const multiPoseMaxDimension = 256

  // if (imageSize.width > imageSize.height) {
  //   resizedWidth = multiPoseMaxDimension;
  //   resizedHeight = Math.round(
  //       multiPoseMaxDimension * imageSize.height / imageSize.width);

  //   paddedWidth = resizedWidth;
  //   paddedHeight =
  //       Math.ceil(resizedHeight / dimensionDivisor) * dimensionDivisor;
  // } else {
  //   resizedWidth = Math.round(
  //       multiPoseMaxDimension * imageSize.width / imageSize.height);
  //   resizedHeight = multiPoseMaxDimension;
  //   paddedWidth =
  //       Math.ceil(resizedWidth / dimensionDivisor) * dimensionDivisor;
  //   paddedHeight = resizedHeight;
  // }

  // // Convert keypoints from padded coordinates to normalized coordinates.
  // for (let i = 0; i < poses.length; ++i) {
  //   for (let j = 0; j < poses[i].keypoints.length; ++j) {
  //     poses[i].keypoints[j].y *= paddedHeight / resizedHeight;
  //     poses[i].keypoints[j].x *= paddedWidth / resizedWidth;
  //   }
  // }

  tracker.apply(poses, timestamp);

  // poses = poses.filter((pose: any) => pose.score >= 0.25);
  // console.log("poses2", poses);

  // console.log("keypointFilterMap", keypointFilterMap);

  // // keypoints smooth filter
  // for (let i = 0; i < poses.length; ++i) {
  //   console.log("> poses[i].id", poses[i].id);
  //   if (!keypointFilterMap.has(poses[i].id as any)) {
  //     console.log("> keypointFilterMap 找不到，增加");
  //     keypointFilterMap.set(
  //       poses[i].id as any,
  //       new KeypointsOneEuroFilter(KEYPOINT_FILTER_CONFIG)
  //     );
  //     console.log("> keypointFilterMap", keypointFilterMap);
  //   }
  //   poses[i].keypoints = keypointFilterMap
  //     .get(poses[i].id as any)
  //     ?.apply(poses[i].keypoints, timestamp, 1 /* objectScale */) as Keypoint[];
  // }

  // // 刪除已經不用 track 的
  // const trackIDs = tracker.getTrackIDs();
  // keypointFilterMap.forEach((_: any, trackID: any) => {
  //   if (!trackIDs.has(trackID)) {
  //     keypointFilterMap.delete(trackID);
  //   }
  // });

  endEstimatePosesStats();

  // -1 是一定可以隱藏的
  // -1 代表: 新 pose 在已有的 tracker 中找不到，配對不到，且在今天已配對的 tracker 中覺得是「重覆的」
  // -1 代表: 新 pose 在已有的 tracker 中找不到，配對不到，且 pose.score 太少
  const poses3 = poses.filter((pose: any) => pose.id !== -1);
  console.log("poses3", poses3);
  if (camera.outputDebug) {
    camera.outputDebug.innerHTML += "poses3: " + poses3.length + "\n";
  }
  if (poses.length !== poses3.length) {
    // alert("不一樣");
  }
  poses = poses3;

  camera.drawCtx();

  // The null check makes sure the UI is not in the middle of changing to a
  // different model. If during model change, the result is from an old
  // model, which shouldn't be rendered.
  if (poses.length > 0 && !STATE.isModelChanged) {
    camera.drawResults(poses);
  }
}

const runFrame = async () => {
  if (camera.video.paused) {
    // video has finished.
    camera.mediaRecorder.stop();
    camera.clearCtx();
    camera.video.style.visibility = "visible";
    return;
  }
  await renderResult();
  window.cancelAnimationFrame(rafId);
  rafId = requestAnimationFrame(runFrame);
};

function VideoInput(props: any) {
  const [status, setStatus] = useState<string>();

  useEffect(() => {
    const setup = async () => {
      STATE.model = posedetection.SupportedModels.PoseNet;
      STATE.modelConfig = {
        maxPoses: 20,
        scoreThreshold: 0.5,
      };
      STATE.backend = "tfjs-webgl";
      STATE.flags = {
        WEBGL_CPU_FORWARD: true,
        WEBGL_FLUSH_THRESHOLD: -1,
        WEBGL_FORCE_F16_TEXTURES: false,
        WEBGL_PACK: true,
        WEBGL_RENDER_FLOAT32_CAPABLE: true,
        WEBGL_VERSION: 2,
      };

      stats = setupStats();
      detector = (await createDetector()) as posedetection.PoseDetector;
      console.log("detector created!!!", detector);
      camera = new Context();
      keypointFilterMap = new Map();

      console.log("init tracker!!!");
      tracker = new BoundingBoxTracker({
        maxTracks: 3 * 20, // 3 times max detections of the multi-pose model.
        maxAge: 1000,
        minSimilarity: 0.15,
      });
      // tracker = new KeypointTracker({
      //   maxTracks: 3 * 15, // 3 times max detections of the multi-pose model.
      //   maxAge: 1000,
      //   minSimilarity: 0.2,
      //   keypointTrackerParams: {
      //     keypointConfidenceThreshold: 0.3,
      //     // From COCO:
      //     // https://cocodataset.org/#keypoints-eval
      //     keypointFalloff: [
      //       0.026, 0.025, 0.025, 0.035, 0.035, 0.079, 0.079, 0.072, 0.072,
      //       0.062, 0.062, 0.107, 0.107, 0.087, 0.087, 0.089, 0.089,
      //     ],
      //     minNumberOfKeypoints: 4,
      //   },
      // });

      tf.env().setFlags(STATE.flags);

      const [runtime, $backend] = STATE.backend.split("-");

      if (runtime === "tfjs") {
        await resetBackend($backend);
      }
    };

    setup();
  }, []);

  const updateVideo = async (event: any) => {
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
    if (camera.prevCanvas) {
      camera.prevCanvas.width = videoWidth;
      camera.prevCanvas.height = videoHeight;
    }
    if (camera.prevCanvas0) {
      camera.prevCanvas0.width = videoWidth;
      camera.prevCanvas0.height = videoHeight;
    }
    if (camera.canvas0) {
      camera.canvas0.width = videoWidth;
      camera.canvas0.height = videoHeight;
    }

    setStatus("Video is loaded.");

    event.target.value = null as any;
  };

  const run = async () => {
    setStatus("Warming up model.");

    // Warming up pipeline.
    const [runtime, $backend] = STATE.backend.split("-");

    if (runtime === "tfjs") {
      const warmUpTensor = tf.fill(
        [camera.video.height, camera.video.width, 3],
        0,
        "float32"
      );
      await detector.estimatePoses(
        warmUpTensor as posedetection.PoseDetectorInput,
        {
          maxPoses: STATE.modelConfig.maxPoses,
          flipHorizontal: false,
          scoreThreshold: STATE.modelConfig.scoreThreshold,
          nmsRadius: 20,
        }
      );
      warmUpTensor.dispose();
      setStatus("Model is warmed up.");
    }

    // camera.video.style.visibility = "hidden";
    camera.video.pause();
    camera.video.currentTime = 0; // 7.9
    camera.video.play();
    camera.mediaRecorder.start();

    await new Promise((resolve) => {
      camera.video.onseeked = () => {
        resolve(true);
      };
    });

    await renderResult();

    // return;

    await runFrame();
  };

  const zeroFrame = async () => {
    camera.video.pause();
    camera.video.currentTime = 2.733302;
    await new Promise((resolve) => {
      camera.video.onseeked = () => {
        resolve(true);
      };
    });
    await renderResult();
  };

  const nextFrame = async () => {
    camera.video.pause();
    camera.video.currentTime = camera.video.currentTime + 1 / 30.0;
    await new Promise((resolve) => {
      camera.video.onseeked = () => {
        resolve(true);
      };
    });
    await renderResult();
  };

  const prevFrame = async () => {
    camera.video.pause();
    camera.video.currentTime = camera.video.currentTime - 1 / 30.0;
    await new Promise((resolve) => {
      camera.video.onseeked = () => {
        resolve(true);
      };
    });
    await renderResult();
  };

  return (
    <div className="mt-10">
      <div id="stats"></div>
      <div>
        <div className="flex justify-center p-2 space-x-2">
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
              onClick={zeroFrame}
            >
              zero
            </button>

            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={prevFrame}
            >
              上一格
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
              <canvas id="output0"></canvas>
            </div>
            <pre
              id="outputDebug0"
              className="w-[600px] whitespace-pre-wrap break-words"
            ></pre>
            <div>
              <canvas id="output"></canvas>
            </div>
            <pre
              id="outputDebug"
              className="w-[600px] whitespace-pre-wrap break-words"
            ></pre>
          </div>
          <div className="flex">
            <div>
              <canvas id="prevOutput0"></canvas>
            </div>
            <pre
              id="prevOutputDebug0"
              className="w-[400px] whitespace-pre-wrap break-words"
            ></pre>
            <div>
              <canvas id="prevOutput"></canvas>
            </div>
            <pre
              id="prevOutputDebug"
              className="w-[400px] whitespace-pre-wrap break-words"
            ></pre>
          </div>
          <video id="video">
            <source id="currentVID" src="" type="video/mp4" />
          </video>
        </div>
        <div>
          <span id="status">{status}</span>
        </div>
      </div>
    </div>
  );
}

export default function Demo() {
  console.log("rendered!!!!!");
  return <VideoInput />;
}
