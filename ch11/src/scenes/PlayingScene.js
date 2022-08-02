import Phaser from "phaser";
import Config from "../Config";
import Player from "../characters/Player";
import Mob from "../characters/Mob";
import TopBar from "../ui/TopBar";
import ExpBar from "../ui/ExpBar";
import { setBackground } from "../utils/backgroundManager";
import { addMobEvent, removeOldestMobEvent } from "../utils/mobManager";
import { addAttackEvent } from "../utils/attackManager";
import { pause } from "../utils/pauseManager";

export default class PlayingScene extends Phaser.Scene {
  constructor() {
    super("playGame");
  }

  create() {
    // sound
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

    // topBar, expBar
    this.m_topBar = new TopBar(this);
    this.m_expBar = new ExpBar(this, 50);

    // player
    this.m_player = new Player(this);
    this.cameras.main.startFollow(this.m_player);

    // background
    setBackground(this, "background1");

    // keys
    this.m_cursorKeys = this.input.keyboard.createCursorKeys();

    // mobs
    this.m_mobs = this.physics.add.group();
    this.m_mobs.add(new Mob(this, 0, 0, "mob1", "mob1_anim", 10));
    this.m_mobEvents = [];
    addMobEvent(this, 1000, "mob1", "mob1_anim", 10, 0.9);

    // attacks
    this.m_weaponDynamic = this.add.group();
    this.m_weaponStatic = this.add.group();
    this.m_attackEvents = {};
    addAttackEvent(this, "beam", 10, 1, 1000);

    // exp ups
    this.m_expUps = this.physics.add.group();

    // collisions
    this.physics.add.overlap(
      this.m_player,
      this.m_mobs,
      () => this.m_player.hitByMob(10),
      null,
      this
    );
    this.physics.add.overlap(
      this.m_weaponDynamic,
      this.m_mobs,
      (weapon, mob) => {
        mob.hitByDynamic(weapon, weapon.m_damage);
      },
      null,
      this
    );
    this.physics.add.overlap(
      this.m_weaponStatic,
      this.m_mobs,
      (weapon, mob) => {
        mob.hitByStatic(weapon.m_damage);
      },
      null,
      this
    );
    this.physics.add.overlap(
      this.m_player,
      this.m_expUps,
      this.pickExpUp,
      null,
      this
    );

    // event handler
    this.input.keyboard.on(
      "keydown-ESC",
      () => { pause(this, "pause"); },
      this
    );
  }

  update() {
    this.movePlayerManager();

    this.m_background.setX(this.m_player.x - Config.width / 2);
    this.m_background.setY(this.m_player.y - Config.height / 2);
    this.m_background.tilePositionX = this.m_player.x - Config.width / 2;
    this.m_background.tilePositionY = this.m_player.y - Config.height / 2;

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
    this.m_expBar.increase(expUp.m_exp);
    if (this.m_expBar.m_currentExp >= this.m_expBar.m_maxExp) {
      pause(this, "levelup");
    }
  }

  afterLevelUp() {
    this.m_topBar.gainLevel();

    // 레벨이 2, 3, 4, ..가 되면 등장하는 몹을 변경해줍니다.
    // 이전 몹 이벤트를 지우지 않으면 난이도가 너무 어려워지기 때문에 이전 몹 이벤트를 지워줍니다.
    // 레벨이 높아질 수록 강하고 아이텝 드랍율이 낮은 몹을 등장시킵니다.
    // repeatGap은 동일하게 설정했지만 레벨이 올라갈수록 더 짧아지도록 조절하셔도 됩니다.
    switch (this.m_topBar.m_level) {
      case 2:
        removeOldestMobEvent(this);
        addMobEvent(this, 1000, "mob2", "mob2_anim", 20, 0.8);
        break;
      case 3:
        removeOldestMobEvent(this);
        addMobEvent(this, 1000, "mob3", "mob3_anim", 30, 0.7);
        break;
      case 4:
        removeOldestMobEvent(this);
        addMobEvent(this, 1000, "mob4", "mob4_anim", 40, 0.7);
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

    let vector = [0, 0];
    if (this.m_cursorKeys.left.isDown) {
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
  }
}
