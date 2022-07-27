import Phaser from "phaser";
import Config from "../Config";
import HpBar from "../ui/HpBar";
import { loseGame } from "../utils/sceneManager";

export default class Player extends Phaser.Physics.Arcade.Sprite {
  static PLAYER_SPEED = 3;

  constructor(scene) {
    super(scene, Config.width / 2, Config.height / 2, "player");
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.scale = 2;
    this.m_moving = false;
    this.m_canBeAttacked = true;
    this.m_hpBar = new HpBar(scene, this, 100);
    
    this.setDepth(20);
    this.setBodySize(28, 32);
  }

  hitByMob(damage) {
    if (!this.m_canBeAttacked) return;

    this.scene.m_hurtSound.play();
    this.getCooldown();
    this.m_hpBar.decrease(damage);

    // HP가 0 이하가 되면 loseGame 함수를 실행해줍니다.
    if (this.m_hpBar.m_currentHp <= 0) {
      loseGame(this.scene);
    }
  }

  getCooldown() {
    this.m_canBeAttacked = false;
    this.alpha = 0.5;
    this.scene.time.addEvent({
      delay: 1000,
      callback: () => {
        this.alpha = 1;
        this.m_canBeAttacked = true;
      },
      callbackScope: this,
      loop: false,
    });
  }

  move(vector) {
    this.x += vector[0] * Player.PLAYER_SPEED;
    this.y += vector[1] * Player.PLAYER_SPEED;

    if (vector[0] === -1) this.flipX = false;
    else if (vector[0] === 1) this.flipX = true;
  }
}
