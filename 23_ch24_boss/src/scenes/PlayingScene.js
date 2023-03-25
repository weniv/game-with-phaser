import Phaser from "phaser";
import Config from "../Config"
import Player from "../characters/Player";
import Mob from "../characters/Mob"
import TopBar from "../ui/TopBar";
import ExpBar from "../ui/ExpBar";
import { setBackground } from "../utils/backgroundManager";
import { addMob, addMobEvent, removeOldestMobEvent } from "../utils/mobManager"
import { setAttackScale, setAttackDamage, addAttackEvent } from "../utils/attackManager"
import { pause } from "../utils/pauseManager";
import { createTime } from "../utils/time";

export default class PlayingScene extends Phaser.Scene {
    constructor() {
        super("playGame");
    }

    create() {
        // 사용할 sound들을 추가해놓는 부분입니다.
        // load는 전역적으로 어떤 scene에서든 asset을 사용할 수 있도록 load 해주는 것이고,
        // add는 해당 scene에서 사용할 수 있도록 scene의 멤버 변수로 추가할 때 사용하는 것입니다.
        this.sound.pauseOnBlur = false;
        this.m_beamSound = this.sound.add("audio_beam");
        this.m_scratchSound = this.sound.add("audio_scratch");
        this.m_hitMobSound = this.sound.add("audio_hitMob");
        this.m_growlSound = this.sound.add("audio_growl");
        this.m_explosionSound = this.sound.add("audio_explosion");
        this.m_expUpSound = this.sound.add("audio_expUp");
        this.m_hurtSound = this.sound.add("audio_hurt");
        this.m_nextLevelSound = this.sound.add("audio_nextLevel");
        this.m_gameOverSound = this.sound.add("audio_gameOver");
        this.m_gameClearSound = this.sound.add("audio_gameClear");
        this.m_pauseInSound = this.sound.add("audio_pauseIn");
        this.m_pauseOutSound = this.sound.add("audio_pauseOut");


        // player를 m_player라는 멤버 변수로 추가합니다.
        this.m_player = new Player(this);

        this.cameras.main.startFollow(this.m_player);

        // PlayingScene의 background를 설정합니다.
        setBackground(this, "background1");

        this.m_cursorKeys = this.input.keyboard.createCursorKeys();

        // Mob
        this.m_mobs = this.physics.add.group();
        this.m_mobs.add(new Mob(this, 0, 0, "mob1", "mob1_anim", 10));
        this.m_mobEvents = [];

        //scene, repeatGap, mobTexture, mobAnim, mobHp, mobDropRate
        addMobEvent(this, 1000, "mob1", "mob1_anim", 10, 0.9);

        // Attack
        this.m_weaponDynamic = this.add.group();
        this.m_weaponStatic = this.add.group();
        this.m_attackEvents = {};
        // scene, attackType, attackDamage, attackScale, repeatGap
        addAttackEvent(this, "claw", 10, 2.3, 1500);

        // 보스몹이 잘 추가되는지 확인하기 위해 create 메서드 내에서 addMob을 실행시켜봅니다.
        addMob(this, "lion", "lion_anim", 100, 0);

        // collisions
        // Player와 mob이 부딪혔을 경우 player에 데미지 10을 줍니다.
        // (Player.js에서 hitByMob 함수 확인)
        this.physics.add.overlap(
            this.m_player,
            this.m_mobs,
            () => this.m_player.hitByMob(10),
            null,
            this
        );

        // mob이 dynamic 공격에 부딪혓을 경우 mob에 해당 공격의 데미지만큼 데미지를 줍니다.
        // (Mob.js에서 hitByDynamic 함수 확인)
        this.physics.add.overlap(
            this.m_weaponDynamic,
            this.m_mobs,
            (weapon, mob) => {
                mob.hitByDynamic(weapon, weapon.m_damage);
            },
            null,
            this
        );

        // mob이 static 공격에 부딪혓을 경우 mob에 해당 공격의 데미지만큼 데미지를 줍니다.
        // (Mob.js에서 hitByStatic 함수 확인)
        this.physics.add.overlap(
            this.m_weaponStatic,
            this.m_mobs,
            (weapon, mob) => {
                mob.hitByStatic(weapon.m_damage);
            },
            null,
            this
        );

        // item
        this.m_expUps = this.physics.add.group();
        this.physics.add.overlap(
            this.m_player,
            this.m_expUps,
            this.pickExpUp,
            null,
            this
        );

        // topbar, expbar
        this.m_topBar = new TopBar(this);
        this.m_expBar = new ExpBar(this, 50);

        // event handler
        // ESC 키를 누르면 "pause" 유형으로 일시정지 시킵니다.
        this.input.keyboard.on(
            "keydown-ESC",
            () => { pause(this, "pause"); },
            this
        );

        // time
        createTime(this);
    }

    update() {
        this.movePlayerManager();

        this.m_background.setX(this.m_player.x - Config.width / 2);
        this.m_background.setY(this.m_player.y - Config.height / 2);

        this.m_background.tilePositionX = this.m_player.x - Config.width / 2;
        this.m_background.tilePositionY = this.m_player.y - Config.width / 2;

        const closest = this.physics.closest(
            this.m_player,
            this.m_mobs.getChildren()
        );
        this.m_closest = closest;
    }

    pickExpUp(player, expUp) {
        expUp.disableBody(true, true);
        expUp.destroy();

        this.m_expUpSound.play();
        // console.log(`경험치 ${expUp.m_exp} 상승!`);
        this.m_expBar.increase(expUp.m_exp);
        if (this.m_expBar.m_currentExp >= this.m_expBar.m_maxExp) {
            // maxExp를 초과하면 레벨업을 해주던 기존의 코드를 지우고
            // afterLevelUp 메소드를 만들어 거기에 옮겨줍니다.
            // 추후 레벨에 따른 몹, 무기 추가를 afterLevelUp에서 실행해 줄 것입니다.
            pause(this, "levelup");
        }
    }

    afterLevelUp() {
        this.m_topBar.gainLevel();

        switch (this.m_topBar.m_level) {
            case 2:
                removeOldestMobEvent(this);
                addMobEvent(this, 1000, "mob2", "mob2_anim", 20, 0.8);
                // claw 공격 크기 확대
                setAttackScale(this, "claw", 4);
                break;
            case 3:
                removeOldestMobEvent(this);
                addMobEvent(this, 1000, "mob3", "mob3_anim", 30, 0.7);
                // catnip 공격 추가
                addAttackEvent(this, "catnip", 10, 2);
                break;
            case 4:
                removeOldestMobEvent(this);
                addMobEvent(this, 1000, "mob4", "mob4_anim", 40, 0.7);
                // catnip 공격 크기 확대
                setAttackScale(this, "catnip", 3);
                break;
            case 5:
                // claw 공격 삭제
                removeAttack(this, "claw");
                // beam 공격 추가
                addAttackEvent(this, "beam", 10, 1, 1000);
                break;
            case 6:
                // beam 공격 크기 및 데미지 확대
                setAttackScale(this, "beam", 2);
                setAttackDamage(this, "beam", 40);
                break;
        }
    }


    movePlayerManager() {
        if (this.m_cursorKeys.left.isDown || this.m_cursorKeys.right.isDown || this.m_cursorKeys.up.isDown || this.m_cursorKeys.down.isDown) {
            if (!this.m_player.m_moving) {
                this.m_player.play("player_anim");
            }
            this.m_player.m_moving = true;
        } else {
            if (this.m_player.m_moving) {
                this.m_player.play("player_idle");
            }
            this.m_player.m_moving = false;
        }

        // vector를 사용해 움직임을 관리할 것입니다.
        // vector = [x좌표 방향, y좌표 방향]입니다.
        // 왼쪽 키가 눌려있을 때는 vector[0] += -1, 오른쪽 키가 눌려있을 때는 vector[0] += 1을 해줍니다.
        // 위/아래 또한 같은 방법으로 벡터를 수정해줍니다.
        let vector = [0, 0];
        if (this.m_cursorKeys.left.isDown) {
            // player.x -= PLAYER_SPEED // 공개영상에서 진행했던 것
            vector[0] += -1;
        } else if (this.m_cursorKeys.right.isDown) {
            vector[0] += 1;
        }

        if (this.m_cursorKeys.up.isDown) {
            vector[1] += -1;
        } else if (this.m_cursorKeys.down.isDown) {
            vector[1] += 1;
        }

        this.m_player.move(vector);

        // static 공격들은 player가 이동하면 그대로 따라오도록 해줍니다.
        this.m_weaponStatic.children.each(weapon => {
            weapon.move(vector);
        }, this);
    }

}