import Phaser from "phaser";
import Config from "../Config";
import Button from "../ui/Button";

export default class MainScene extends Phaser.Scene {
  constructor() {
    super("mainScene");
  }

  create() {
    // 배경색을 채워줍니다.
    this.add.graphics()
      .fillStyle(0xbbdefb)
      .fillRect(0, 0, Config.width, Config.height)
      .setScrollFactor(0);

    // 게임 제목을 상단에 추가합니다.
    this.add
      .bitmapText(Config.width / 2, 150, "pixelFont", "Save the Weniv World!", 60)
      .setOrigin(0.5);

    // 움직이는 라이캣을 가운데 추가합니다.
    this.add
      .sprite(Config.width / 2, Config.height / 2, "player")
      .setScale(4)
      .play("player_anim");

    // 게임 시작 버튼을 하단에 추가합니다.
    // 버튼을 누르면 PlayingScene으로 이동하도록 callback을 전달해줍니다.
    new Button(
      Config.width / 2,
      Config.height / 2 + 150,
      "Start Game",
      this,
      () => this.scene.start("playGame")
    );
  }
}
