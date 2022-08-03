import Beam from "../effects/Beam";
import Claw from "../effects/Claw";
import Catnip from "../effects/Catnip";

/**
 * scene에 attackType 타입의 공격(데미지 damage, 크기 scale) 이벤트를 추가해줍니다.
 * 공격은 repeatGap ms 간격으로 계속해서 발생합니다.
 * @param {Phaser.Scene} scene - attack을 발생시킬 scene
 * @param {String} attackType - attack의 유형
 * @param {Number} damage - attack이 mob에 입히는 데미지
 * @param {Number} scale - attack의 크기
 * @param {Number} repeatGap - attack 반복 간격 (ms단위)
 */
export function addAttackEvent(scene, attackType, damage, scale, repeatGap = 0) {
  switch (attackType) {
    case "beam":
    case "claw":
      const timer = scene.time.addEvent({
        delay: repeatGap,
        callback: () => {
          doAttackOneSet(scene, attackType, damage, scale);
        },
        loop: true,
      });
      scene.m_attackEvents[attackType] = { timer, damage, scale, repeatGap };
      break;

    case "catnip":
      const catnip = new Catnip(scene, [scene.m_player.x, scene.m_player.y + 20], damage, scale);
      scene.m_attackEvents[attackType] = catnip;
      break;
  }
}

// attackType 공격의 한 세트를 수행하는 함수입니다.
function doAttackOneSet(scene, attackType, damage, scale) {
  switch (attackType) {
    case "beam":
      new Beam(scene, [scene.m_player.x, scene.m_player.y - 16], damage, scale);
      break;

    case "claw":
      const isHeadingRight = scene.m_player.flipX;
      new Claw(scene,
              [scene.m_player.x - 60 + 120 * isHeadingRight, scene.m_player.y - 40],
              isHeadingRight,
              damage,
              scale);
      scene.time.addEvent({
        delay: 500,
        callback: () => {
          new Claw(scene,
                  [scene.m_player.x - 60 + 120 * !isHeadingRight, scene.m_player.y - 40],
                  !isHeadingRight,
                  damage,
                  scale);
        },
        loop: false,
      });
      break;
  }
}

// scene에 있는 attackType의 공격을 제거해주는 함수입니다.
export function removeAttack(scene, attackType) {
  if (!scene.m_attackEvents[attackType]) return;

  if (attackType === "catnip") {
    scene.m_attackEvents.catnip.destroy();
    return;
  }
  scene.time.removeEvent(scene.m_attackEvents[attackType].timer);
}

// scene에 있는 attackType 공격의 damage를 재설정해주는 함수입니다.
export function setAttackDamage(scene, attackType, newDamage) {
  const scale = scene.m_attackEvents[attackType].scale;
  const repeatGap = scene.m_attackEvents[attackType].repeatGap;
  removeAttack(scene, attackType);
  addAttackEvent(scene, attackType, newDamage, scale, repeatGap);
}

// scene에 있는 attackType 공격의 scale을 재설정해주는 함수입니다.
export function setAttackScale(scene, attackType, newScale) {
  const damage = scene.m_attackEvents[attackType].damage;
  const repeatGap = scene.m_attackEvents[attackType].repeatGap;
  removeAttack(scene, attackType);
  addAttackEvent(scene, attackType, damage, newScale, repeatGap);
}

// scene에 있는 attackType 공격의 repeatGap을 재설정해주는 함수입니다.
export function setAttackRepeatGap(scene, attackType, newRepeatGap) {
  if (attackType === 'catnip') {
    console.error("Cannot set catnip's repeat gap");
    return;
  }

  const damage = scene.m_attackEvents[attackType].damage;
  const scale = scene.m_attackEvents[attackType].scale;
  removeAttack(scene, attackType);
  addAttackEvent(scene, attackType, damage, scale, newRepeatGap);
}

// Beam의 지속시간을 설정해주는 함수입니다. (ms단위)
export function setBeamDuration(duration) {
  Beam.DURATION = duration;
}