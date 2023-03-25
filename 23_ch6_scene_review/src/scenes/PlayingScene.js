import Phaser from "phaser";
import Player from "../characters/Player";
import { setBackground } from "../utils/backgroundManager";

export default class PlayingScene extends Phaser.Scene {
    constructor() {
        super("playGame");
    }

    create() {
        this.m_player = new Player(this);
        setBackground(this, "background1");
    }
}