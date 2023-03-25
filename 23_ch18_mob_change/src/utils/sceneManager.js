export function loseGame(playingScene) {
    playingScene.m_gameOverSound.play();
    playingScene.scene.start("gameOverScene")
}