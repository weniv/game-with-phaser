import Phaser from "phaser";
import bgImg1 from "../assets/images/background.png";
import playerImg from "../assets/spritesheets/player.png";

export default class LoadingScene extends Phaser.Scene {
    constructor() {
        super("bootGame");
    }

    preload() {
        // IMAGES
        this.load.image("background1", bgImg1);

        // SPRITESHEETS
        this.load.spritesheet("player", playerImg, {
            frameWidth: 32,
            frameHeight: 36,
        });
    }

    create() {
        this.add.text(20, 20, "Loading game...");
        this.scene.start("playGame");
    }
}