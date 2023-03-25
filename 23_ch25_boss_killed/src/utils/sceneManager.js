export function loseGame(playingScene) {
    playingScene.m_gameOverSound.play();
    // scene.scene.start 함수의 두번째 파라미터로 GameOverScene에 전달할 데이터를 객체 형태로 넣어줍니다.
    playingScene.scene.start("gameOverScene", {
        mobsKilled: playingScene.m_topBar.m_mobsKilled,
        level: playingScene.m_topBar.m_level,
        secondElapsed: playingScene.m_secondElapsed,
    });
}

// 게임에서 이겼을 때 이긴 효과음을 재생하고,
// GameClearScene으로 전환시키는 함수입니다.
export function winGame(playingScene) {
    playingScene.m_gameClearSound.play();
    playingScene.scene.start("gameClearScene", {
        mobsKilled: playingScene.m_topBar.m_mobsKilled,
        level: playingScene.m_topBar.m_level,
        secondElapsed: playingScene.m_secondElapsed,
    });
}