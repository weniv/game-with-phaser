import Phaser from "phaser";
import Config from "../Config";
import Player from "../characters/Player";
import Mob from "../characters/Mob";
import { setBackground } from "../utils/backgroundManager";
import { addMobEvent } from "../utils/mobManager";

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

    // player
    this.m_player = new Player(this);
    this.cameras.main.startFollow(this.m_player);

    // background
    setBackground(this, "background1");

    // keys
    this.m_cursorKeys = this.input.keyboard.createCursorKeys();

    // m_mobs는 physics group으로, 속한 모든 오브젝트에 동일한 물리법칙을 적옹할 수 있습니다.
    // m_mobEvents는 mob event의 timer를 담을 배열로, mob event를 추가 및 제거할 때 사용할 것입니다.
    // addMobEvent는 m_mobEvents에 mob event의 timer를 추가해줍니다.
    this.m_mobs = this.physics.add.group();
    this.m_mobEvents = [];
    addMobEvent(this, 1000, "mob1", "mob1_anim", 10, 0.9);
  }

  update() {
    this.movePlayerManager();

    this.m_background.setX(this.m_player.x - Config.width / 2);
    this.m_background.setY(this.m_player.y - Config.height / 2);
    this.m_background.tilePositionX = this.m_player.x - Config.width / 2;
    this.m_background.tilePositionY = this.m_player.y - Config.height / 2;
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
