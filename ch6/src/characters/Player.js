import Phaser from "phaser";
import Config from "../Config";
import HpBar from "../ui/HpBar";

export default class Player extends Phaser.Physics.Arcade.Sprite {
  static PLAYER_SPEED = 3;

  constructor(scene) {
    super(scene, Config.width / 2, Config.height / 2, "player");
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.scale = 2;
    this.m_moving = false;
    this.canBeAttacked = true;

    // HP bar를 player의 멤버 변수로 추가해줍니다.
    this.m_hpBar = new HpBar(scene, this, 100);
    
    this.setDepth(20);
    this.setBodySize(28, 32);
  }

  hitByMob(damage) {
    if (!this.canBeAttacked) return;

    this.scene.m_hurtSound.play();
    this.getCooldown();
    // mob과 접촉했을 때 damage만큼 HP를 감소시켜줍니다.
    this.m_hpBar.decrease(damage);

    // HP가 0이 되면 게임오버! (다음 챕터에서 수정할 것입니다.)
    if (this.m_hpBar.m_currentHp <= 0) {
      console.log('GAME OVER');
    }
  }

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
