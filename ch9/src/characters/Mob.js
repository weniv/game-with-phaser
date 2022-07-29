import Phaser from "phaser";
import Explosion from "../effects/Explosion";
import ExpUp from "../items/ExpUp";

export default class Mob extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture, animKey, initHp, dropRate) {
    super(scene, x, y, texture);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.play(animKey);
    this.setDepth(10);
    this.scale = 2;
    this.m_speed = 50;
    this.m_hp = initHp;
    this.m_dropRate = dropRate;
    this.m_canBeAttacked = true;

    if (texture === "mob1") {
      this.setBodySize(24, 14, false);
      this.setOffset(0, 14);
    } else if (texture === "mob2") {
      this.setBodySize(24, 32);
    } else if (texture === "mob3") {
      this.setBodySize(24, 32);
    } else if (texture === "mob4") {
      this.setBodySize(24, 32);
    } else if (texture === "lion") {
      this.setBodySize(40, 64);
    }

    this.m_events = [];
    this.m_events.push(
      this.scene.time.addEvent({
        delay: 100,
        callback: () => {
          scene.physics.moveToObject(this, scene.m_player, this.m_speed);
        },
        loop: true,
      })
    );

    scene.events.on("update", (time, delta) => {
      this.update(time, delta);
    });
  }

  update() {
    if (!this.body) return;

    if (this.x < this.scene.m_player.x) this.flipX = true;
    else this.flipX = false;

    if (this.m_hp <= 0) {
      this.die();
    }
  }

  hitByDynamic(weaponDynamic, damage) {
    this.scene.m_hitMobSound.play();
    this.m_hp -= damage;
    this.displayHit();
    weaponDynamic.destroy();
  }

  hitByStatic(damage) {
    if (!this.m_canBeAttacked) return;

    this.scene.m_hitMobSound.play();
    this.m_hp -= damage;
    this.displayHit();
    this.getCoolDown();
  }

  displayHit() {
    this.alpha = 0.5;
    this.scene.time.addEvent({
      delay: 1000,
      callback: () => {
        this.alpha = 1;
      },
      loop: false,
    });
  }

  getCoolDown() {
    this.m_canBeAttacked = false;
    this.scene.time.addEvent({
      delay: 1000,
      callback: () => {
        this.m_canBeAttacked = true;
      },
      loop: false,
    });
  }

  die() {
    new Explosion(this.scene, this.x, this.y);
    this.scene.m_explosionSound.play();

    if (Math.random() < this.m_dropRate) {
      const expUp = new ExpUp(this.scene, this);
      this.scene.m_expUps.add(expUp);
    }

    // 몹이 죽으면 TopBar의 mobs killed에 1을 더해줍니다.
    this.scene.m_topBar.gainMobsKilled();
    this.scene.time.removeEvent(this.m_events);
    this.destroy();
  }
}
