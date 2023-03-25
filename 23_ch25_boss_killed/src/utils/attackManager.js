import Beam from "../effects/Beam";
import Claw from "../effects/Claw";
import Catnip from "../effects/Catnip";

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

        default:
            break;
    }
}

// scene에 있는 attackType의 공격을 제거해주는 함수입니다.
export function removeAttack(scene, attackType) {
    // 공격이 없을 경우 remove attack을 패스합니다.
    if (!scene.m_attackEvents[attackType]) return;

    // catnip의 경우 object를 제거합니다.
    if (attackType === "catnip") {
        scene.m_attackEvents.catnip.destroy();
        return;
    }

    // 다른 공격(beam, claw)의 경우 설정했던 timer를 비활성화합니다.
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
    // catnip의 경우 repeatGap이 없으므로 예외처리해 줍니다.
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
// newRepeatGap, newScale와 같은 값이 변경이 되었을 때 지속시간도 올리도록 코드를 짜도록 하겠습니다.
// export function setBeamDuration(duration) {
//     Beam.DURATION = duration;
// }