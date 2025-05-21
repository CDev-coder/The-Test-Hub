import { AUTO, Game } from "phaser";

import { Boot } from "./scenes/Boot";
import { Game as MainGame } from "./scenes/Game";
import { Preloader } from "./scenes/Preloader";

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    width: 1024,
    height: 768,
    parent: "game-container",
    backgroundColor: "#000000",
    scale: {
        width: 1024,
        height: 768,
    },
    render: {
        antialiasGL: false,
        pixelArt: true,
    },
    canvasStyle: "display: block; margin: 0 auto;",
    autoFocus: true,
    audio: {
        disableWebAudio: false,
    },
    scene: [Boot, Preloader, MainGame],
};

const StartGame = (parent: string) => {
    const game = new Game({ ...config, parent });

    return game;
};

export default StartGame;
