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

    // 플레이어가 공격받을 수 있는지 여부를 나타내는 멤버 변수입니다.
    // 공격받은 후 쿨타임을 주기 위해 사용합니다.
    this.canBeAttacked = true;

    this.setDepth(20);
    this.setBodySize(28, 32);
  }

  // 몹과 접촉했을 경우 실행되는 함수입니다.
  hitByMob(damage) {
    // 쿨타임이었던 경우 공격받지 않습니다.
    if (!this.canBeAttacked) return;

    // 플레이어가 다친 소리를 재생합니다.
    this.scene.m_hurtSound.play();
    // 쿨타임을 갖습니다.
    this.getCooldown();
  }

  // 공격받은 후 1초 쿨타임을 갖게 하는 함수입니다.
  // 공격받을 수 있는지 여부와 투명도를 1초동안 조절합니다.
  getCooldown() {
    this.canBeAttacked = false;
    this.alpha = 0.5;
    this.scene.time.addEvent({
      delay: 1000,
      callback: () => {
        this.alpha = 1;
        this.canBeAttacked = true;
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
