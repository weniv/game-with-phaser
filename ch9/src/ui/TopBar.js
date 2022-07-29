import Phaser from "phaser";
import Config from "../Config";

export default class TopBar extends Phaser.GameObjects.Graphics {
  constructor(scene) {
    super(scene);

    // TopBar의 배경색, 너비, 높이, depth를 지정해줍니다.
    // setScrollFactor(0)을 설정하면 플레이어가 이동해도 TopBar는 항상 화면 상단에 고정됩니다.
    this.fillStyle(0x28288c)
      .fillRect(0, 0, Config.width, 30)
      .setDepth(90)
      .setScrollFactor(0);

    // 잡은 몹의 수를 멤버 변수로 만들어줍니다. (초기값 0)
    this.m_mobsKilled = 0;
    // 잡은 몹의 수를 MOBS KILLED라는 문구 옆에 적습니다.
    this.m_mobsKilledLabel = scene.add
      .bitmapText(
        5,
        1,
        "pixelFont",
        `MOBS KILLED ${this.m_mobsKilled.toString().padStart(6, "0")}`,
        40
      )
      .setScrollFactor(0)
      .setDepth(100);

    // 레벨을 멤버 변수로 만들어줍니다. (초기값 1)
    this.m_level = 1;
    // 레벨을 LEVEL이라는 문구 옆에 적습니다.
    this.m_levelLabel = scene.add
      .bitmapText(
        650,
        1,
        "pixelFont",
        `LEVEL ${this.m_level.toString().padStart(3, "0")}`,
        40
      )
      .setScrollFactor(0)
      .setDepth(100);

    // 위에서 추가한 그래픽을 화면에 표시합니다.
    scene.add.existing(this);
  }

  // mobs killed의 값을 1 올리고, 화면의 텍스트를 수정하는 메서드입니다.
  // 이 함수는 몹이 한마리 죽을 때마다 실행됩니다. (Mob.js 참고)
  gainMobsKilled() {
    this.m_mobsKilled += 1;
    this.m_mobsKilledLabel.text = `MOBS KILLED ${this.m_mobsKilled
      .toString()
      .padStart(6, "0")}`;
  }

  // level의 값을 1 올리고, 화면의 텍스트를 수정하는 메서드입니다.
  // 이 함수는 경험치가 다 찰 때마다 실행됩니다. (ExpBar.js 참고)
  gainLevel() {
    this.m_level += 1;
    this.m_levelLabel.text = `LEVEL ${this.m_level
      .toString()
      .padStart(3, "0")}`;
    
    // 레벨업 할 때마다 경험치가 0으로 초기화되고,
    // 다음 레벨업을 위해 필요한 경험치가 20씩 증가합니다.
    this.scene.m_expBar.m_maxExp += 20;
    this.scene.m_expBar.reset();
  }
}
