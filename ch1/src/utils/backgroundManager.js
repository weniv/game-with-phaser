import Config from "../Config";

/**
 * scene의 배경화면을 설정하는 함수
 * @param {Phaser.Scene} scene
 * @param {string} backgroundTexture
 */
export function setBackground(scene, backgroundTexture) {
  // tileSprite : 게임 화면이 background image보다 클 시 타일처럼 다닥다닥 붙여서 보여주는 이미지
  // (CSS의 background-repeat: repeat; 같은 느낌)
  // setOrigin : 원점(0, 0)의 위치를 설정해주는 함수
  scene.m_background = scene.add.tileSprite(
    0,
    0,
    Config.width,
    Config.height,
    backgroundTexture
  ).setOrigin(0, 0);
}
