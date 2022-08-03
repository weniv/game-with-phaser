import Config from "../Config";

/**
 * scene의 배경화면을 설정하는 함수
 * @param {Phaser.Scene} scene
 * @param {string} backgroundTexture
 */
export function setBackground(scene, backgroundTexture) {
  scene.m_background = scene.add.tileSprite(
    0,
    0,
    Config.width,
    Config.height,
    backgroundTexture
  ).setOrigin(0, 0);
}