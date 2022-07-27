// 게임에서 졌을 때 진 효과음을 재생하고,
// GameOverScene으로 전환시키는 함수입니다.
export function loseGame(playingScene) {
  playingScene.m_gameOverSound.play();
  playingScene.scene.start("gameOverScene");
}