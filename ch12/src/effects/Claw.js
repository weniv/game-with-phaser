import Phaser from "phaser";
import Player from "../characters/Player";

export default class Claw extends Phaser.Physics.Arcade.Sprite {
  // Claw 공격은 앞 1회, 뒤 1회가 한 세트입니다.
  // DURATION은 각 Claw 공격의 지속 시간(ms)입니다.
  static DURATION = 500;

  constructor(scene, startingPosition, isHeadingRight, damage, scale) {
    super(scene, startingPosition[0], startingPosition[1], "claw_white");

    // 화면 및 물리엔진에 추가합니다.
    scene.add.existing(this);
    scene.physics.world.enableBody(this);
    // Claw는 static 공격입니다. (플레이어 주변에만 발생하고 몹으로 이동하지 않음)
    scene.m_weaponStatic.add(this);
    // 공격 소리를 추가합니다.
    scene.m_scratchSound.play({ volume: 0.5 });
    
    // 데미지를 설정합니다.
    this.m_damage = damage;
    // 크기, depth를 설정합니다.
    this.scale = scale;
    this.setDepth(30);
    // 애니메이션을 재생합니다.
    this.play("scratch_white");
    // 플레이어가 왼쪽을 보고 있을 경우 claw 이미지를 좌우 반전시킵니다.
    if (!isHeadingRight) {
      this.flipX = true;
    }
    
    // Claw는 DURATION만큼 지속됩니다.
    scene.time.addEvent({
      delay: Claw.DURATION,
      callback: () => {
        this.destroy();
      },
      loop: false,
    });
  }

  // 플레이어가 움직이면 Claw도 따라 움직여야 하므로 move 메서드를 만들어주었습니다.
  move(vector) {
    this.x += vector[0] * Player.PLAYER_SPEED;
    this.y += vector[1] * Player.PLAYER_SPEED;
  }
}
