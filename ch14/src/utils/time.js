import Config from "../Config";

// scene에 플레이 시간을 추가하고 1초가 지날 때마다 시간을 업데이트해 주는 함수입니다.
export function createTime(scene) {
  scene.m_secondElapsed = 0;
  scene.m_timeText = scene.add
    .text(Config.width / 2, 100, "00:00", { fontSize: 30 })
    .setOrigin(0.5)
    .setDepth(100)
    .setScrollFactor(0);
  scene.time.addEvent({
    callback: () => {
      scene.m_secondElapsed += 1;
      scene.m_timeText.setText(getTimeString(scene.m_secondElapsed));
    },
    delay: 1000,
    loop: true,
  });
}

// 시간을 초 단위로 받아 mm:ss 형식으로 변환해주는 함수입니다.
export function getTimeString(seconds) {
  const timeMinute = Math.floor(seconds / 60 % 60)
    .toString()
    .padStart(2, "0");
  const timeSecond = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${timeMinute}:${timeSecond}`;
}