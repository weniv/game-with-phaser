import Phaser from "phaser";

export default class Explosion extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "explosion");

    // 크기와 depth를 적절히 설정해줍니다.
    this.scale = 2;
    this.setDepth(50);
    // 폭발 애니메이션을 실행해줍니다.
    // 이 애니메이션은 한번만 실행되고 사라집니다. (LoadingScene.js 참고)
    this.play("explode");
    scene.add.existing(this);
  }
}
