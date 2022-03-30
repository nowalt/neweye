import { Pose } from "@tensorflow-models/pose-detection";
import { Track } from "@tensorflow-models/pose-detection/dist/calculators/interfaces/common_interfaces";
import { TrackerConfig } from "@tensorflow-models/pose-detection/dist/calculators/interfaces/config_interfaces";

import { validateTrackerConfig } from "./tracker_utils";

/**
 * A stateful tracker for associating detections between frames. This is an
 * abstract base class that performs generic mechanics. Implementations must
 * inherit from this class.
 */
export abstract class Tracker {
  protected tracks: Track[];
  private readonly maxTracks: number;
  private readonly maxAge: number;
  private readonly minSimilarity: number;
  private nextID: number;
  public areas: any;

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
    this.filterOldTracks(timestamp);
    const simMatrix = this.computeSimilarity(poses);
    this.assignTracks(poses, simMatrix, timestamp);
    this.updateTracks(timestamp);
    this.checkAreas();
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

  checkAreas() {
    if (!this.areas || !this.areas.length) return;

    const area = this.areas[0];
    for (let i = 0; i < this.tracks.length; i++) {
      const track = this.tracks[i];
      if (track.box) {
        if (!track.from) {
          const result = this.iou2(area[0], track.box);
          if (result > 0) {
            track.from = {
              ...track.box,
            };

            console.log("\n\n> 有人進入了開始區", track.box, result, track);
          }

          // console.log("\n\n> check", entryBoxes[0], track.box, result, track);
        } else if (!track.to) {
          const result = this.iou2(area[1], track.box);
          if (result > 0) {
            track.to = {
              ...track.box,
            };

            // count
            console.log("\n\n> 有人進入了結束區", track);
            alert("有人進入了結束區");
          }
        }
      }
    }
  }

  iou2(a: any, b: any): number {
    if (!a || !b) return 0.0;

    const xMin = Math.max(a.xMin, b.xMin);
    const yMin = Math.max(a.yMin, b.yMin);
    const xMax = Math.min(a.xMax, b.xMax);
    const yMax = Math.min(a.yMax, b.yMax);

    // console.log("iou", { xMin, yMin, xMax, yMax });

    if (xMin >= xMax || yMin >= yMax) {
      return 0.0;
    }
    const intersection = (xMax - xMin) * (yMax - yMin);
    // console.log("iou intersection", intersection);
    const areaPose = a.width * a.height;
    const areaTrack = b.width * b.height;

    return intersection / (areaPose + areaTrack - intersection);
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
    let unmatchedTrackIndices: any = Array.from(
      Array(simMatrix[0].length).keys()
    );
    unmatchedTrackIndices = unmatchedTrackIndices.map((index: any) => ({
      index,
    }));
    const detectionIndices = Array.from(Array(poses.length).keys());
    const unmatchedDetectionIndices: number[] = [];

    console.log("\n\nassignTracks", this.tracks.length, [...this.tracks]);

    for (const detectionIndex of detectionIndices) {
      console.log("> detectionIndex", detectionIndex);
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
        console.log("> trackIndex", trackIndex);
        const similarity = simMatrix[detectionIndex][trackIndex];
        console.log("similarity", similarity);
        console.log(
          `poseIndex#${detectionIndex} 與 trackIndex#${trackIndex} 的相似度為 ${similarity}`
        );
        console.log("maxSimilarity", maxSimilarity);
        if (similarity >= this.minSimilarity && similarity > maxSimilarity) {
          if (typeof obj.detectionIndex !== "undefined") {
            if (similarity > obj.maxSimilarity) {
              poses[obj.detectionIndex].id = -1;
              console.log(`  > 配錯了，把之前的變 -1\n`);

              maxTrackIndex = trackIndex;
              maxSimilarity = similarity;
            } else {
              poses[detectionIndex].id = -1;
              console.log(`  > 配錯了，把現在的變 -1\n`, {
                detectionIndex,
                trackIndex,
                obj,
              });
            }
          } else {
            maxTrackIndex = trackIndex;
            maxSimilarity = similarity;
          }
        }
      }
      if (maxTrackIndex >= 0) {
        console.log("maxTrackIndex", maxTrackIndex);
        unmatchedTrackIndices[maxTrackIndex].detectionIndex = detectionIndex;
        unmatchedTrackIndices[maxTrackIndex].maxSimilarity = maxSimilarity;

        // Link the detection with the highest scoring track.
        let linkedTrack = this.tracks[maxTrackIndex];
        linkedTrack = Object.assign(
          linkedTrack,
          this.createTrack(poses[detectionIndex], timestamp, linkedTrack)
        );
        poses[detectionIndex].id = linkedTrack.id;
        // const index = unmatchedTrackIndices.indexOf(maxTrackIndex);
        // unmatchedTrackIndices.splice(index, 1);
      } else {
        if (!poses[detectionIndex].id) {
          console.log(
            "poses[detectionIndex]?.score",
            poses[detectionIndex]?.score
          );
          if ((poses[detectionIndex]?.score as number) < 0.25) {
            // console.log(
            //   "  > ",
            //   "沒有找到與 tracker 相似, 且 pose.score < 0.25, 不可信",
            //   maxTrackIndex,
            //   maxSimilarity
            // );
            poses[detectionIndex].id = -1;
          } else {
            unmatchedDetectionIndices.push(detectionIndex);
          }
        }
      }
    }

    // Spawn new tracks for all unmatched detections.
    for (const detectionIndex of unmatchedDetectionIndices) {
      const newTrack = this.createTrack(poses[detectionIndex], timestamp);
      this.tracks.push(newTrack);
      poses[detectionIndex].id = newTrack.id;
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
  createTrack(pose: Pose, timestamp: number, lastTrack?: any): Track {
    const track: Track = {
      id: lastTrack ? lastTrack.id : this.nextTrackID(),
      lastTimestamp: timestamp,
      keypoints: [...pose.keypoints].map((keypoint) => ({ ...keypoint })),
      from: lastTrack ? lastTrack.from : null,
      to: lastTrack ? lastTrack.to : null,
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
    if (this.nextID >= 1000) {
      this.nextID = 1;
    } else {
      this.nextID += 1;
    }
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
