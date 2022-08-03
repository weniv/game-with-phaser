import Phaser from "phaser";
import Player from "../characters/Player";

export default class Claw extends Phaser.Physics.Arcade.Sprite {
  static DURATION = 500;

  constructor(scene, startingPosition, isHeadingRight, damage, scale) {
    super(scene, startingPosition[0], startingPosition[1], "claw_white");

    scene.add.existing(this);
    scene.physics.world.enableBody(this);
    scene.m_weaponStatic.add(this);
    scene.m_scratchSound.play({ volume: 0.5 });
    
    this.m_damage = damage;
    this.scale = scale;
    this.setDepth(30);
    this.play("scratch_white");
    if (!isHeadingRight) {
      this.flipX = true;
    }
    
    scene.time.addEvent({
      delay: Claw.DURATION,
      callback: () => {
        this.destroy();
      },
      loop: false,
    });
  }

  move(vector) {
    this.x += vector[0] * Player.PLAYER_SPEED;
    this.y += vector[1] * Player.PLAYER_SPEED;
  }
}
