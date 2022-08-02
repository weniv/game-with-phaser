import Phaser from "phaser";
import Player from "../characters/Player"

export default class Catnip extends Phaser.Physics.Arcade.Sprite {
  // scene의 startingPosition 위치에 데미지 damage와 크기 scale의 Catnip을 생성합니다.
  constructor(scene, startingPosition, damage, scale) {
    super(scene, startingPosition[0], startingPosition[1], "catnip");

    // 화면 및 물리엔진에 추가합니다.
    scene.add.existing(this);
    scene.physics.world.enableBody(this);
    // Catnip은 static 공격입니다. (플레이어 주변에만 발생하고 몹으로 이동하지 않음)
    scene.m_weaponStatic.add(this);

    // 데미지를 멤버 변수로 설정해줍니다.
    this.m_damage = damage;
    // 크기, 투명도, depth를 설정해줍니다.
    this.scale = scale;
    this.alpha = 0.5;
    this.setDepth(5);
    // catnip은 동그랗게 생겼으므로 물리적 영역을 원으로 설정해줍니다.
    this.setCircle(30);
    // 애니메이션을 재생합니다.
    this.play("catnip_anim");
  }

  // 플레이어가 움직이면 Catnip도 따라 움직여야 하므로 move 메서드를 만들어주었습니다.
  move(vector) {
    this.x += vector[0] * Player.PLAYER_SPEED;
    this.y += vector[1] * Player.PLAYER_SPEED;
  }
}
