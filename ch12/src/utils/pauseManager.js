import game from "../index";
import Config from "../Config";

let scene_paused = null;
let time_paused = Date.now() - 100;
let type_pause;

const PAUSE_TEXT_BY_TYPE = {
  "pause": {
    text: "Pause",
    fontSize: 60
  },
  "levelup": {
    text: [
      "You're on the Next Level!",
      "",
      "Press Enter to Keep Going",
    ],
    fontSize: 40
  }
};

export function pause(scene, type) {
  if (Date.now() - time_paused > 100 && game.scene.isActive(scene)) {
    game.scene.pause(scene);
    scene_paused = scene;
    time_paused = Date.now();
    type_pause = type;

    createVeil(scene);
    createPauseText(scene, type_pause);

    if (type_pause === "pause") {
      game.scene.getScene(scene).m_pauseInSound.play();
    } else if (type_pause === "levelup") {
      game.scene.getScene(scene).m_nextLevelSound.play();
    }
  }
}

document.addEventListener("keydown", (event) => {
  if (
    ((type_pause === "pause" && event.key === "Escape") ||
    (type_pause === "levelup" && event.key === "Enter")) &&
    Date.now() - time_paused > 100 &&
    scene_paused
  ) {
    const previousScene = game.scene.getScene(scene_paused);
    game.scene.resume(scene_paused);
    togglePauseScreen(previousScene, false);
    previousScene.m_pauseOutSound.play();
    if (type_pause === "levelup") {
      previousScene.afterLevelUp();
    }
    scene_paused = null;
    time_paused = Date.now();
  }
});

function createVeil(scene) {
  scene.m_veil = scene.add
  .graphics({ x: 0, y: 0 })
  .fillStyle(0x000000, 0.3)
  .fillRect(0, 0, Config.width, Config.height)
  .setDepth(110)
  .setScrollFactor(0);
}

function createPauseText(scene, type) {
  scene.m_textPause = scene.add
    .text(Config.width / 2,
          Config.height / 2,
          PAUSE_TEXT_BY_TYPE[type].text,
          { fontSize: PAUSE_TEXT_BY_TYPE[type].fontSize })
    .setOrigin(0.5)
    .setDepth(120)
    .setScrollFactor(0);
}

function togglePauseScreen(scene, isVisible) {
  scene.m_veil.setVisible(isVisible);
  scene.m_textPause.setVisible(isVisible);
}