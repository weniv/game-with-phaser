import Phaser from "phaser";
import Config from "../Config";

export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene) {
        super(scene, Config.width / 2, Config.height / 2, "player");
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.scale = 2;
        this.setDepth(20);
    }
}