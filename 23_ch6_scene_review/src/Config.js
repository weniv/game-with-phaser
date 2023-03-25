import LoadingScene from "./scenes/LoadingScene";
import PlayingScene from "./scenes/PlayingScene";

const Config = {
    width: 8000,
    height: 6000,
    backgroundColor: 0x000000,
    scene: [LoadingScene, PlayingScene],
    pixelArt: true,
    physics: {
        default: "arcade",
        arcade: {
            debug: process.env.DEBUG === "true",
        },
    },
};

export default Config;