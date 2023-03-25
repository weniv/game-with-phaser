import Phaser from 'phaser';
// import logoImg from './assets/logo.png';
import bgImg1 from "./assets/background.png";
import playerImg from "./assets/player.png";


class MyGame extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        // this.load.image('logo', logoImg);
        
        this.load.image("background1", bgImg1);
        // this.load.image("player", playerImg);

        // SPRITESHEETS
        this.load.spritesheet("player", playerImg, {
            frameWidth: 32,
            frameHeight: 36,
        });
    }

    create ()
    {
        // const logo = this.add.image(400, 150, 'logo');
        // this.tweens.add({
        //     targets: logo,
        //     y: 450,
        //     duration: 2000,
        //     ease: "Power2",
        //     yoyo: true,
        //     loop: -1
        // });        

        // BACKGROUND
        // this.background1 = this.add.tileSprite(
        //     0,
        //     0,
        //     800,
        //     600,
        //     "background1"
        //   ).setOrigin(0, 0);

        this.background1 = this.add.image(0, 0, "background1");
        // 이걸 안할 경우 load 되는 이미지의 중심점으로 잡아 1/4 크기가 됨
        this.background1.setOrigin(0, 0);

        // PLAYERS
        // this.player = this.add.image(config.width/2, config.height/2, "player");
        this.player = this.add.sprite(config.width/2, config.height/2, "player"); // 위에서 spritesheet로 load를 하면 여기를 sprite로 바꿔줌
        // this.player.setOrigin(0, 0); // 숫자를 계속 올려보세요.
        // this.player.scale = 2; // 숫자를 계속 올려보세요.
        // this.player.flipY = true;
        // this.player.angle += 10; // 숫자를 계속 올려보세요.
        // PLAYERS
        this.anims.create({
            key: "player_anim", // 애니메이션 이름
            frames: this.anims.generateFrameNumbers("player"), // 플레이어를 사용하고
            frameRate: 12, // 1초당 20 프레임
            repeat: -1, // -1이 infinity
        });

        this.anims.create({
            key: "player_idle",
            frames: this.anims.generateFrameNumbers("player", {
              start: 0,
              end: 0,
            }),
            frameRate: 1,
            repeat: 0,
        });


        // 안내문구
        this.add.text(10, 10, "'위니브 월드 : 새로운 시대'에 오신 것을 환영합니다.", {
            font: '25px 배달의민족 주아 OTF',
            fill: '#f5e99f' // 16진수나 컬러이름이 들어갑니다.
        })

        this.player.play("player_anim");

        this.keyboardInput = this.input.keyboard.createCursorKeys();
        this.player.m_moving = false;
        console.log('create')
    }

    update(){
        this.move(this.player)
    }

    move(player) {
        const PLAYER_SPEED = 0.2;

        // player.x += vector[0] * Player.PLAYER_SPEED;
        // player.y += vector[1] * Player.PLAYER_SPEED;
        // player.y += PLAYER_SPEED;
    
        if (this.keyboardInput.left.isDown || this.keyboardInput.right.isDown || this.keyboardInput.up.isDown || this.keyboardInput.down.isDown) {
            console.log('press')
            if (!player.m_moving) {
                player.play("player_anim");
            }
            player.m_moving = true;
        } else {
            if (player.m_moving) {
                player.play("player_idle");
            }
            player.m_moving = false;
        }

        // 캐릭터 이미지 원본은 왼쪽을 바라보고 있습니다.
        // flipX 프로퍼티는 boolean 값을 받아 x축 방향으로 뒤집혀있을지 아닐지를 설정합니다.
        // player가 왼쪽으로 이동할 때는 flipX = false,
        // player가 오른쪽쪽으로 이동할 때는 flipX = true로 설정해 적절한 방향을 바라보게 해 줍니다.
        if (this.keyboardInput.left.isDown) {
            player.x -= PLAYER_SPEED;
            player.flipX = false;
        } else if (this.keyboardInput.right.isDown) {
            player.x += PLAYER_SPEED;
            player.flipX = true;
        }
        if (this.keyboardInput.up.isDown) {
            player.y -= PLAYER_SPEED;
        } else if (this.keyboardInput.down.isDown) {
            player.y += PLAYER_SPEED;
        }
    }


}

const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    backgroundColor: 0x000000,
    physics: {
        default: "arcade",
        arcade: {
            debug: process.env.DEBUG === "true",
        },
    },
    scene: MyGame
};

const game = new Phaser.Game(config);
