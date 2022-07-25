import Beam from "../effects/Beam";

/**
 * scene에 attackType 타입의 공격(데미지 attackDamage, 크기 attackScale) 이벤트를 추가해줍니다.
 * 공격은 repeatGap ms 간격으로 계속해서 발생합니다.
 * @param {Phaser.Scene} scene - attack을 발생시킬 scene
 * @param {String} attackType - attack의 유형
 * @param {Number} attackDamage - attack이 mob에 입히는 데미지
 * @param {Number} attackScale - attack의 크기
 * @param {Number} repeatGap - attack 반복 간격 (ms단위)
 */
export function addAttackEvent(scene, attackType, attackDamage, attackScale, repeatGap) {
  switch (attackType) {
    case "beam":
      const timerBeam = scene.time.addEvent({
        delay: repeatGap,
        callback: () => {
          shootBeam(scene, attackDamage, attackScale);
        },
        loop: true,
      });
      scene.m_attackEvents.beam = timerBeam;
      break;
  }
}

// Beam을 쏘는 함수입니다.
function shootBeam(scene, damage, scale) {
  new Beam(scene, [scene.m_player.x, scene.m_player.y - 16], damage, scale);
}

// scene에 있는 attackType의 공격을 제거해주는 함수입니다.
export function removeAttack(scene, attackType) {
  scene.time.removeEvent(scene.m_attackEvents[attackType]);
}

// scene에 있는 attackType 공격의 scale을 재설정해주는 함수입니다.
export function setAttackScale(scene, attackType, scale) {
  const repeatGap = scene.m_attackEvents[attackType].delay;
  removeAttack(scene, attackType);
  addAttackEvent(scene, attackType, 10, scale, repeatGap);
}

// Beam의 지속시간을 설정해주는 함수입니다. (ms단위)
export function setBeamDuration(duration) {
  Beam.DURATION = duration;
}