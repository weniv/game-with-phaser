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

        if (texture === "mob1") {
            this.setBodySize(24, 14, false);
            this.setOffset(0, 14);
        } if (texture === "mob2") {
            this.setBodySize(24, 32);
        } if (texture === "mob3") {
            this.setBodySize(24, 32);
        } if (texture === "mob4") {
            this.setBodySize(24, 32);
        } if (texture === "lion") {
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

        // Phaser.Scene에는 update 함수가 있지만
        // Mob은 Phaser.Physics.Arcade.Sprite를 상속한 클래스로 update 함수가 없기 때문에
        // Scene의 update가 실행될 때마다 mob도 update 함수가 실행되게 구현해준 부분입니다.
        // https://newdocs.phaser.io/docs/3.60.0-beta.20/Phaser.Scenes.Events.UPDATE
        scene.events.on("update", (time, delta) => {
            this.update(time, delta);
        });

        // 공격 받을 수 있는지 여부를 뜻하는 멤버 변수입니다.
        // static 공격의 경우 처음 접촉했을 때 쿨타임을 주지 않으면 매 프레임당 계속해서 공격한 것으로 처리되므로 해당 변수로 쿨타임을 만들게 되었습니다.
        this.m_canBeAttacked = true;
    }

    update() {
        if (!this.body) return;

        if (this.x < this.scene.m_player.x) this.flipX = true;
        else this.flipX = false;

        if (this.m_hp <= 0) {
            this.die();
        }
    }

    // mob이 dynamic attack에 맞을 경우 실행되는 함수입니다.
    hitByDynamic(weaponDynamic, damage) {
        // 공격에 맞은 소리를 재생합니다.
        this.scene.m_hitMobSound.play();
        // 몹의 hp에서 damage만큼 감소시킵니다.
        this.m_hp -= damage;
        // 공격받은 몹의 투명도를 1초간 조절함으로써 공격받은 것을 표시합니다.
        this.displayHit();

        // dynamic 공격을 제거합니다.
        weaponDynamic.destroy();
    }

    // mob이 static attack에 맞을 경우 실행되는 함수입니다.
    hitByStatic(damage) {
        // 쿨타임인 경우 바로 리턴합니다.
        if (!this.m_canBeAttacked) return;

        // 공격에 맞은 소리를 재생합니다.
        this.scene.m_hitMobSound.play();
        // 몹의 hp에서 damage만큼 감소시킵니다.
        this.m_hp -= damage;
        // 공격받은 몹의 투명도를 1초간 조절함으로써 공격받은 것을 표시합니다.
        this.displayHit();
        // 쿨타임을 갖습니다.
        this.getCoolDown();
    }

    // 공격받은 mob을 투명도를 1초간 조절함으로써 공격받은 것을 표시합니다.
    displayHit() {
        // 몹의 투명도를 0.5로 변경하고,
        // 1초 후 1로 변경합니다.
        this.alpha = 0.5;
        this.scene.time.addEvent({
            delay: 1000,
            callback: () => {
                this.alpha = 1;
            },
            loop: false,
        });
    }

    // 1초 쿨타임을 갖는 함수입니다.
    getCoolDown() {
        // 공격받을 수 있는지 여부를 false로 변경하고,
        // 1초 후 true로 변경합니다.
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

        this.scene.m_topBar.gainMobsKilled();
        this.scene.time.removeEvent(this.m_events);
        this.destroy();
    }
}