import Beam from "../effects/Beam";

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

        default:
            break;
    }
}

function shootBeam(scene, damage, scale) {
    // scene, startingPosition, damage, scale
    new Beam(scene, [scene.m_player.x, scene.m_player.y - 16], damage, scale);
}

/*
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
*/

