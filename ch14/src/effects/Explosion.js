import Phaser from "phaser";

export default class Explosion extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "explosion");

    this.scale = 2;
    this.setDepth(50);
    this.play("explode");
    scene.add.existing(this);
  }
}
