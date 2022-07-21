import Phaser from "phaser";
import Config from "../Config";

export default class Player extends Phaser.Physics.Arcade.Sprite {
  // player의 속도를 적당히 설정해줍니다.
  static PLAYER_SPEED = 3;

  constructor(scene) {
    super(scene, Config.width / 2, Config.height / 2, "player");
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.scale = 2;
    // 걷기 애니메이션 재생 여부를 위한 멤버 변수입니다.
    this.m_moving = false;
    this.setDepth(20);
    this.setBodySize(28, 32);
  }

  // player가 움직이도록 하는 함수입니다.
  move(vector) {
    // player의 x좌표는 vector[0] * Player.PLAYER_SPEED만큼,
    // y좌표는 vector[1] * Player.PLAYER_SPEED만큼 움직입니다.
    this.x += vector[0] * Player.PLAYER_SPEED;
    this.y += vector[1] * Player.PLAYER_SPEED;

    // 캐릭터 이미지 원본은 왼쪽을 바라보고 있습니다.
    // flipX 프로퍼티는 boolean 값을 받아 x축 방향으로 뒤집혀있을지 아닐지를 설정합니다.
    // player가 왼쪽으로 이동할 때는 flipX = false,
    // player가 오른쪽쪽으로 이동할 때는 flipX = true로 설정해 적절한 방향을 바라보게 해 줍니다.
    if (vector[0] === -1) this.flipX = false;
    else if (vector[0] === 1) this.flipX = true;
  }
}
