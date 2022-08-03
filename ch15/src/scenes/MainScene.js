import Phaser from "phaser";
import Config from "../Config";
import Button from "../ui/Button";

export default class MainScene extends Phaser.Scene {
  constructor() {
    super("mainScene");
  }

  create() {
    this.add.graphics()
      .fillStyle(0xbbdefb)
      .fillRect(0, 0, Config.width, Config.height)
      .setScrollFactor(0);

    this.add
      .bitmapText(Config.width / 2, 150, "pixelFont", "Save the Weniv World!", 60)
      .setOrigin(0.5);

    this.add
      .sprite(Config.width / 2, Config.height / 2, "player")
      .setScale(4)
      .play("player_anim");

    new Button(
      Config.width / 2,
      Config.height / 2 + 150,
      "Start Game",
      this,
      () => this.scene.start("playGame")
    );
  }
}
