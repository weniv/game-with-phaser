import Phaser from "phaser";
import Config from "../Config";

export default class Player extends Phaser.Physics.Arcade.Sprite {
  static PLAYER_SPEED = 3;

  constructor(scene) {
    super(scene, Config.width / 2, Config.height / 2, "player");
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.scale = 2;
    this.m_moving = false;
    this.setDepth(20);
    this.setBodySize(28, 32);
  }

  move(vector) {
    this.x += vector[0] * Player.PLAYER_SPEED;
    this.y += vector[1] * Player.PLAYER_SPEED;

    if (vector[0] === -1) this.flipX = false;
    else if (vector[0] === 1) this.flipX = true;
  }
}
