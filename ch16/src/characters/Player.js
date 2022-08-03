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
    // 몹과 닿지 않은 것처럼 보이는데 닿은 것으로 작용해서
    // 플레이어의 body size를 좀더 줄여주었습니다.
    this.setBodySize(24, 28);
  }

  hitByMob(damage) {
    if (!this.m_canBeAttacked) return;

    this.scene.m_hurtSound.play();
    this.getCooldown();
    this.m_hpBar.decrease(damage);

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
