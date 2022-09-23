import Phaser from "phaser";
import Explosion from "../effects/Explosion";
import ExpUp from "../items/ExpUp";
import { removeAttack } from "../utils/attackManager";
import { winGame } from "../utils/sceneManager";

export default class Mob extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture, animKey, initHp, dropRate) {
    super(scene, x, y, texture);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.play(animKey);
    this.setDepth(10);
    this.scale = 2;
    this.m_speed = 50;
    // 보스몹의 이동 속도를 다른 몹보다 조금 빠르게 설정해줍니다.
    if (texture === "lion") {
      this.m_speed = 60;
    }

    this.m_hp = initHp;
    this.m_dropRate = dropRate;
    this.m_canBeAttacked = true;
    // 보스몹의 죽음 여부를 판단하기 위한 멤버 변수입니다.
    this.m_isDead = false;

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

    // HP가 0 이하이고, 죽은 적이 없으면 죽습니다. (1번만 죽을 수 있습니다.)
    if (this.m_hp <= 0 && !this.m_isDead) {
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
    // 보스몹이면 투명도를 조절하지 않습니다.
    if (this.texture.key === "lion") return;

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
    // 한번이라도 죽으면 die 메서드에 다시 들어오지 못하도록 m_isDead를 true로 바꿔줍니다.
    this.m_isDead = true;

    new Explosion(this.scene, this.x, this.y);
    this.scene.m_explosionSound.play();

    if (Math.random() < this.m_dropRate) {
      const expUp = new ExpUp(this.scene, this);
      this.scene.m_expUps.add(expUp);
    }

    this.scene.m_topBar.gainMobsKilled();
    this.scene.time.removeEvent(this.m_events);

    // 보스몹이 죽었을 때
    if (this.texture.key === "lion") {
      // 공격을 제거합니다. (attackManager.js 참고)
      removeAttack(this.scene, "catnip");
      removeAttack(this.scene, "beam");
      removeAttack(this.scene, "claw");
      // 플레이어가 보스몹과 접촉해도 HP가 깎이지 않도록 만듭니다.
      this.disableBody(true, false);
      // 보스몹이 움직이던 애니메이션을 멉춥니다.
      this.play("lion_idle");
      // 모든 몹의 움직임을 멈춥니다.
      this.scene.m_mobs.children.each((mob) => {
        mob.m_speed = 0;
      });

      // 보스몹이 서서히 투멍해지도록 합니다.
      this.scene.time.addEvent({
        delay: 30,
        callback: () => {
          this.alpha -= 0.01;
        },
        repeat: 100,
      });
      // 보스몹이 투명해진 후, GameClearScene으로 화면을 전환합니다.
      this.scene.time.addEvent({
        delay: 4000,
        callback: () => {
          winGame(this.scene);
        },
        loop: false,
      });
    }
    // 보스몹이 아닌 몹이 죽었을 때
    else {
      // 몹이 사라집니다.
      this.destroy();
    }
  }
}
