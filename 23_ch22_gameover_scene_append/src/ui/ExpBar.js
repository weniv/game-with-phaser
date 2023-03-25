import Phaser from "phaser";
import Config from "../Config";
import { clamp } from "../utils/math";

export default class ExpBar extends Phaser.GameObjects.Graphics {
    constructor(scene, maxExp) {
        super(scene);

        this.HEIGHT = 30;
        this.BORDER = 4;

        this.m_x = 0;
        this.m_y = 30;

        this.m_maxExp = maxExp;
        this.m_currentExp = 0;

        this.draw();
        this.setDepth(100);
        this.setScrollFactor(0);

        scene.add.existing(this);
    }

    increase(amount) {
        this.m_currentExp = clamp(this.m_currentExp + amount, 0, this.m_maxExp);
        this.draw();
    }

    reset() {
        this.m_currentExp = 0;
        this.draw();
    }

    draw() {
        this.clear();

        this.fillStyle(0x000000);
        this.fillRect(this.m_x, this.m_y, Config.width, this.HEIGHT);

        this.fillStyle(0xffffff);
        this.fillRect(
            this.m_x + this.BORDER,
            this.m_y + this.BORDER,
            Config.width - 2 * this.BORDER,
            this.HEIGHT - 2 * this.BORDER
        );

        this.fillStyle(0x3665d5);
        let d = Math.floor(
            ((Config.width - 2 * this.BORDER) / this.m_maxExp) * this.m_currentExp
        );
        this.fillRect(
            this.m_x + this.BORDER,
            this.m_y + this.BORDER,
            d,
            this.HEIGHT - 2 * this.BORDER
        );
    }
}