import Phaser from "phaser";
import fontPng from "../assets/font/font.png";
import fontXml from "../assets/font/font.xml";

import bgImg1 from "../assets/images/background.png";
import bgImg2 from "../assets/images/background-2.png";
import bgImg3 from "../assets/images/background-3.png";
import beamImg from "../assets/images/beam.png";

import explosionImg from "../assets/spritesheets/explosion.png";
import playerImg from "../assets/spritesheets/player.png";
import expUpImg from "../assets/spritesheets/expUp.png";
import mobImg1 from "../assets/spritesheets/mob1.png";
import mobImg2 from "../assets/spritesheets/mob2.png";
import mobImg3 from "../assets/spritesheets/mob3.png";
import mobImg4 from "../assets/spritesheets/mob4.png";
import lionImg from "../assets/spritesheets/lion.png";
import catnipImg from "../assets/spritesheets/catnip.png";
import clawWhiteImg from "../assets/spritesheets/claw-white.png";
import clawYellowImg from "../assets/spritesheets/claw-yellow.png";

import beamOgg from "../assets/sounds/beam.ogg";
import scratchOgg from "../assets/sounds/scratch.ogg";
import hitMobOgg from "../assets/sounds/hitMob.ogg";
import growlOgg from "../assets/sounds/growl.ogg";
import explosionOgg from "../assets/sounds/explosion.ogg";
import hurtOgg from "../assets/sounds/hurt.ogg";
import expUpOgg from "../assets/sounds/expUp.ogg";
import nextLevelOgg from "../assets/sounds/nextLevel.ogg"
import gameOverOgg from "../assets/sounds/gameover.ogg";
import gameClearOgg from "../assets/sounds/gameClear.ogg";
import pauseInOgg from "../assets/sounds/pauseIn.ogg";
import pauseOutOgg from "../assets/sounds/pauseOut.ogg";

// 사용할 모든 asset(image, sprite image, audio, font 등)을 load해 놓습니다.
export default class LoadingScene extends Phaser.Scene {
  constructor() {
    // super에 파라미터로 넘겨주는 string이 해당 scene의 identifier가 됩니다.
    super("bootGame");
  }

  preload() {
    // IMAGES
    this.load.image("background1", bgImg1);
    this.load.image("background2", bgImg2);
    this.load.image("background3", bgImg3);
    this.load.image("beam", beamImg);

    // SPRITESHEETS
    this.load.spritesheet("player", playerImg, {
      frameWidth: 32,
      frameHeight: 36,
    });
    this.load.spritesheet("mob1", mobImg1, {
      frameWidth: 28,
      frameHeight: 28,
    });
    this.load.spritesheet("mob2", mobImg2, {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet("mob3", mobImg3, {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet("mob4", mobImg4, {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet("lion", lionImg, {
      frameWidth: 48,
      frameHeight: 64,
    });
    this.load.spritesheet("explosion", explosionImg, {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet("claw_white", clawWhiteImg, {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet("claw_yellow", clawYellowImg, {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet("catnip", catnipImg, {
      frameWidth: 64,
      frameHeight: 64,
    });
    this.load.spritesheet("exp-up", expUpImg, {
      frameWidth: 16,
      frameHeight: 16,
    });

    // AUDIOS
    this.load.audio("audio_beam", beamOgg);
    this.load.audio("audio_scratch", scratchOgg);
    this.load.audio("audio_hitMob", hitMobOgg);
    this.load.audio("audio_growl", growlOgg);
    this.load.audio("audio_explosion", explosionOgg);
    this.load.audio("audio_expUp", expUpOgg);
    this.load.audio("audio_hurt", hurtOgg);
    this.load.audio("audio_nextLevel", nextLevelOgg);
    this.load.audio("audio_gameOver", gameOverOgg);
    this.load.audio("audio_gameClear", gameClearOgg);
    this.load.audio("audio_pauseIn", pauseInOgg);
    this.load.audio("audio_pauseOut", pauseOutOgg);

    // FONT
    this.load.bitmapFont("pixelFont", fontPng, fontXml);
  }

  create() {
    this.add.text(20, 20, "Loading game...");
    this.scene.start("playGame");

    // MOBS
    this.anims.create({
      key: "mob1_anim",
      frames: this.anims.generateFrameNumbers("mob1"),
      frameRate: 12,
      repeat: -1,
    });
    this.anims.create({
      key: "mob2_anim",
      frames: this.anims.generateFrameNumbers("mob2"),
      frameRate: 12,
      repeat: -1,
    });
    this.anims.create({
      key: "mob3_anim",
      frames: this.anims.generateFrameNumbers("mob3"),
      frameRate: 12,
      repeat: -1,
    });
    this.anims.create({
      key: "mob4_anim",
      frames: this.anims.generateFrameNumbers("mob4"),
      frameRate: 12,
      repeat: -1,
    });
    this.anims.create({
      key: "lion_anim",
      frames: this.anims.generateFrameNumbers("lion"),
      frameRate: 12,
      repeat: -1,
    });
    this.anims.create({
      key: "lion_idle",
      frames: this.anims.generateFrameNumbers("lion", {
        start: 0,
        end: 0,
      }),
      frameRate: 1,
      repeat: 0,
    });

    // PLAYERS
    this.anims.create({
      key: "player_anim",
      frames: this.anims.generateFrameNumbers("player"),
      frameRate: 12,
      repeat: -1,
    });
    this.anims.create({
      key: "player_idle",
      frames: this.anims.generateFrameNumbers("player", {
        start: 0,
        end: 0,
      }),
      frameRate: 1,
      repeat: 0,
    });

    // EFFECT
    this.anims.create({
      key: "explode",
      frames: this.anims.generateFrameNumbers("explosion"),
      frameRate: 20,
      repeat: 0,
      hideOnComplete: true,
    });

    // ATTACKS
    this.anims.create({
      key: "scratch_white",
      frames: this.anims.generateFrameNumbers("claw_white"),
      frameRate: 20,
      repeat: 0,
      hideOnComplete: true,
    });
    this.anims.create({
      key: "scratch_yellow",
      frames: this.anims.generateFrameNumbers("claw_yellow"),
      frameRate: 20,
      repeat: 0,
      hideOnComplete: true,
    });
    this.anims.create({
      key: "catnip_anim",
      frames: this.anims.generateFrameNumbers("catnip"),
      frameRate: 20,
      repeat: -1,
    });

    // EXP UP ITEMS
    this.anims.create({
      key: "red",
      frames: this.anims.generateFrameNumbers("exp-up", {
        start: 0,
        end: 0,
      }),
      frameRate: 20,
      repeat: 0,
    });
    this.anims.create({
      key: "blue",
      frames: this.anims.generateFrameNumbers("exp-up", {
        start: 1,
        end: 1,
      }),
      frameRate: 20,
      repeat: 0,
    });
    this.anims.create({
      key: "yellow",
      frames: this.anims.generateFrameNumbers("exp-up", {
        start: 2,
        end: 2,
      }),
      frameRate: 20,
      repeat: 0,
    });
    this.anims.create({
      key: "green",
      frames: this.anims.generateFrameNumbers("exp-up", {
        start: 3,
        end: 3,
      }),
      frameRate: 20,
      repeat: 0,
    });
  }
}
