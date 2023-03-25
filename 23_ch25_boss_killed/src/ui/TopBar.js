import Phaser from "phaser";
import Config from "../Config";

export default class TopBar extends Phaser.GameObjects.Graphics {
    constructor(scene) {
        super(scene);

        this.fillStyle(0x28288c)
            .fillRect(0, 0, Config.width, 30)
            .setDepth(90)
            .setScrollFactor(0)

        this.m_mobsKilled = 0;
        this.m_mobsKilledLabel = scene.add
            .bitmapText(
                5,
                1,
                "pixelFont",
                `MOBS KILLED ${this.m_mobsKilled.toString().padStart(6, "0")}`,
                40
            )
            .setScrollFactor(0)
            .setDepth(100);

        this.m_level = 1;
        this.m_levelLabel = scene.add
            .bitmapText(
                650,
                1,
                "pixelFont",
                `LEVEL ${this.m_level.toString().padStart(3, "0")}`,
                40
            )
            .setScrollFactor(0)
            .setDepth(100);

        scene.add.existing(this);
    }

    gainMobsKilled() {
        this.m_mobsKilled += 1;
        this.m_mobsKilledLabel.text = `MOBS KILLED ${this.m_mobsKilled
            .toString()
            .padStart(6, "0")}`;
    }

    gainLevel() {
        this.m_level += 1;
        this.m_levelLabel.text = `LEVEL ${this.m_level
            .toString()
            .padStart(3, "0")}`;

        this.scene.m_expBar.m_maxExp += 20;
        this.scene.m_expBar.reset();
    }
}