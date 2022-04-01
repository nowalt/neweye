import Stats from "stats.js";

export function setupStats() {
  const stats: any = new Stats();
  stats.customFpsPanel = stats.addPanel(new Stats.Panel("FPS", "#0ff", "#002"));
  stats.showPanel(stats.domElement.children.length - 1);

  const parent = document.getElementById("stats") as HTMLElement;
  parent.appendChild(stats.domElement);

  stats.domElement.style.position = "absolute";
  stats.domElement.style.right = 0;
  stats.domElement.style.left = "auto";

  const statsPanes = parent.querySelectorAll("canvas");

  for (let i = 0; i < statsPanes.length; ++i) {
    statsPanes[i].style.width = "140px";
    statsPanes[i].style.height = "80px";
  }
  return stats;
}
