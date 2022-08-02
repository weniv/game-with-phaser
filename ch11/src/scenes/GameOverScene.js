import Phaser from "phaser";
import Config from "../Config";

export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super("gameOverScene");
  }

  create() {
    const bg = this.add.graphics();
    bg.fillStyle(0x5c6bc0);
    bg.fillRect(0, 0, Config.width, Config.height);
    bg.setScrollFactor(0);

    this.add
      .bitmapText(
        Config.width / 2,
        Config.height / 2,
        "pixelFont",
        "Game Over",
        80
      )
      .setOrigin(0.5);
  }
}