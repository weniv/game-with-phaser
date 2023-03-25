import Phaser from "phaser";
import Config from "../Config";

export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene) {
        // 화면의 가운데에 player를 추가해줍니다.
        // scene.add.existing : scene에 오브젝트를 추가
        // scene.physics.add.existing : scene의 물리엔진에 오브젝트를 추가
        super(scene, Config.width / 2, Config.height / 2, "player");
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // scale 프로퍼티를 조절해 크기를 조절할 수 있습니다. (디폴트: 1)
        this.scale = 2;

        // depth를 조절해 어떤 오브젝트가 앞에 오고 뒤에 올지 설정할 수 있습니다.
        // CSS의 z-index와 비슷한 개념입니다. (디폴트: 0)
        this.setDepth(20);

        // 해당 오브젝트가 물리적으로 얼만큼의 면적을 차지할 지 설정하는 함수입니다.
        // 디폴트로 이미지 사이즈로 설정되는데, 그러면 추후 몹을 추가했을 때 너무 잘 부딪히는 느낌이 드므로 원본 이미지보다 약간 작게 설정해주었습니다.
        this.setBodySize(28, 32);

        this.m_moving = false;
    }

    move(vector) {
        // console.log(vector);
        let PLAYER_SPEED = 3;

        this.x += vector[0] * PLAYER_SPEED;
        this.y += vector[1] * PLAYER_SPEED;

        // 캐릭터 이미지 원본은 왼쪽을 바라보고 있습니다.
        // flipX 프로퍼티는 boolean 값을 받아 x축 방향으로 뒤집혀있을지 아닐지를 설정합니다.
        // player가 왼쪽으로 이동할 때는 flipX = false,
        // player가 오른쪽쪽으로 이동할 때는 flipX = true로 설정해 적절한 방향을 바라보게 해 줍니다.
        if (vector[0] === -1) this.flipX = false;
        else if (vector[0] === 1) this.flipX = true;
    }
}