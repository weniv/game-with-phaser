import Phaser from "phaser";

export default class Beam extends Phaser.Physics.Arcade.Sprite {
  static SPEED = 100;
  static DURATION = 1500;

  // Beam 클래스는 constructor 파라미터로 x, y 대신 startingPosition을 받습니다.
  // startingPosition = [x, y]인 배열입니다.
  constructor(scene, startingPosition, damage, scale) {
    super(scene, startingPosition[0], startingPosition[1], "beam");
    
    scene.add.existing(this);
    scene.physics.world.enableBody(this);
    // 동적 공격 그룹에 beam을 추가합니다.
    scene.m_weaponDynamic.add(this);
    // beam을 쏘는 소리를 재생합니다.
    scene.m_beamSound.play();

    // 데미지, 크기, depth를 설정합니다.
    this.m_damage = damage;
    this.scale = scale;
    this.setDepth(30);
    // velocity, angle을 설정합니다. 이는 저희가 직접 정의할 메소드입니다.
    this.setVelocity();
    this.setAngle();

    // Beam은 DURATION만큼 시간이 지나면 제거됩니다.
    scene.time.addEvent({
      delay: Beam.DURATION,
      callback: () => {
        this.destroy();
      },
      loop: false,
    });
  }

  // beam이 가장 가까운 mob으로 날아가도록 속도를 설정해주는 메소드입니다.
  setVelocity() {
    // 가장 가까운 mob이 없을 경우 beam이 위로 날아가도록 해 줍니다.
    if (!this.scene.m_closest) {
      this.setVelocityY(-250);
      return;
    }
    const _x = this.scene.m_closest.x - this.x;
    const _y = this.scene.m_closest.y - this.y;
    const _r = Math.sqrt(_x * _x + _y * _y) / 2;
    this.body.velocity.x = (_x / _r) * Beam.SPEED;
    this.body.velocity.y = (_y / _r) * Beam.SPEED;
  }

  // beam이 mob에 날아갈 때 beam 이미지의 각도를 설정해주는 메소드입니다.
  // 설정하지 않아도 기능적으로는 무방하지만 beam의 모습이 어색해집니다.
  setAngle() {
    const angleToMob = Phaser.Math.Angle.Between(
      this.x,
      this.y,
      this.scene.m_closest.x,
      this.scene.m_closest.y
    );
    this.rotation = angleToMob + Math.PI / 2 + Math.PI / 4;
    this.body.setAngularVelocity(0);
  }

  // beam의 damage를 설정하는 메소드입니다.
  setDamage(damage) {
    this.m_damage = damage;
  }
}
