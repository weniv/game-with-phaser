import Phaser from "phaser";
import Config from "../Config";
import { clamp } from "../utils/math";

export default class ExpBar extends Phaser.GameObjects.Graphics {
  // ExpBar의 높이와 테두리 두께를 지정합니다.
  static HEIGHT = 30;
  static BORDER = 4;

  constructor(scene, maxExp) {
    super(scene);

    // ExpBar을 그릴 왼쪽 위 시작점을 지정합니다.
    this.m_x = 0;
    this.m_y = 30;
    // 최대 경험치 멤버 변수입니다.
    this.m_maxExp = maxExp;
    // 현재 경험치 멤버 변수입니다. (초기값 0)
    this.m_currentExp = 0;
    // ExpBar를 그려주고, depth와 scroll factor를 설정해줍니다.
    this.draw();
    this.setDepth(100);
    this.setScrollFactor(0);

    // ExpBar를 화면에 추가합니다.
    scene.add.existing(this);
  }

  // 경험치를 amount만큼 증가시키고 ExpBar를 다시 그리는 메서드입니다.
  increase(amount) {
    // 경험치는 0에서 m_maxExp 사이의 값을 갖도록 합니다.
    this.m_currentExp = clamp(this.m_currentExp + amount, 0, this.m_maxExp);
    this.draw();
  }

  // 경험치를 0으로 초기화시키고 ExpBar를 다시 그리는 메서드입니다.
  reset() {
    this.m_currentExp = 0;
    this.draw();
  }

  // ExpBar 도형을 그리는 메서드입니다.
  draw() {
    this.clear();

    // 검은색 배경을 그려서 테두리로 나타나도록 해줍니다.
    this.fillStyle(0x000000);
    this.fillRect(this.m_x, this.m_y, Config.width, ExpBar.HEIGHT);

    // 경험치 바의 흰색 배경을 그려줍니다.
    this.fillStyle(0xffffff);
    this.fillRect(
      this.m_x + ExpBar.BORDER,
      this.m_y + ExpBar.BORDER,
      Config.width - 2 * ExpBar.BORDER,
      ExpBar.HEIGHT - 2 * ExpBar.BORDER
    );

    // 경험치 바의 경험치를 푸르게 그려줍니다.
    // 푸른 부분이 전체의 (m_currentExp / m_maxExp * 100)%를 차지하도록 그려줍니다.
    this.fillStyle(0x3665d5);
    let d = Math.floor(
      ((Config.width - 2 * ExpBar.BORDER) / this.m_maxExp) * this.m_currentExp
    );
    this.fillRect(
      this.m_x + ExpBar.BORDER,
      this.m_y + ExpBar.BORDER,
      d,
      ExpBar.HEIGHT - 2 * ExpBar.BORDER
    );
  }
}
