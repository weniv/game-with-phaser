import Mob from "../characters/Mob";
import { getRandomPosition } from "./math";

/**
 * scene의 (x, y) 위치에 mobTexture 이미지 및 mobAnim 애니메이션을 실행하며
 * mobHp의 HP, mobDropRate의 아이템 드랍율을 가진 Mob object를 추가합니다.
 * PlayingScene의 m_mobs, m_mobEvent에 각각 mob object, mob timer를 추가합니다.
 * 위치 (x, y)는 getRandomPosition 함수를 통해 정해집니다.
 * @param {Phaser.Scene} scene - mob을 등장시킬 scene
 * @param {Number} repeatGap - mob이 새로 등장하는 시간 간격 (ms단위)
 * @param {String} mobTexture - mob의 image texture
 * @param {String} mobAnim - mob의 animation key
 * @param {Number} mobHp - mob의 최대 HP
 * @param {Number} mobDropRate - mob의 아이템 드랍율
 */
export function addMobEvent(scene, repeatGap, mobTexture, mobAnim, mobHp, mobDropRate) {
  let timer = scene.time.addEvent({
    delay: repeatGap,
    callback: () => {
      let [x, y] = getRandomPosition(scene.m_player.x, scene.m_player.y);
      scene.m_mobs.add(new Mob(scene, x, y, mobTexture, mobAnim, mobHp, mobDropRate));
    },
    loop: true,
  });

  scene.m_mobEvents.push(timer);
}

/**
 * scene의 (x, y) 위치에 mobTexture 이미지, mobAnim 애니메이션, mobHp의 HP를 가진
 * Mob object 하나를 추가합니다.
 * 위치 (x, y)는 getRandomPosition 함수를 통해 정해집니다.
 */
export function addMob(scene, mobTexture, mobAnim, mobHp) {
  let [x, y] = getRandomPosition(scene.m_player.x, scene.m_player.y);
  scene.m_mobs.add(new Mob(scene, x, y, mobTexture, mobAnim, mobHp, 0));
}

// 가장 오래된 mob event를 지우는 함수입니다.
export function removeOldestMobEvent(scene) {
  scene.m_mobEvents[0].remove();
  scene.m_mobEvents.shift();
}
