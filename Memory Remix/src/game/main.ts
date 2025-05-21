import { AUTO, Game, Scale } from "phaser";
import { Boot } from "./scenes/Boot";
import { MainMenu } from "./scenes/MainMenu";
import { Game as MainGame } from "./scenes/Game";
import { Preloader } from "./scenes/Preloader";

const getGameSize = () => {
    // Default/base dimensions (your design size)
    const baseWidth = 1024;
    const baseHeight = 768;

    // Get current window dimensions
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    // Calculate scale ratios
    const scaleX = windowWidth / baseWidth;
    const scaleY = windowHeight / baseHeight;

    // Use the smaller scale to ensure everything fits
    const scale = Math.min(scaleX, scaleY);

    return {
        width: baseWidth,
        height: baseHeight,
        scale: scale,
    };
};

const createConfig = (parent: string): Phaser.Types.Core.GameConfig => {
    const gameSize = getGameSize();

    return {
        type: AUTO,
        parent: parent,
        backgroundColor: "#000000",
        render: {
            antialiasGL: false,
            pixelArt: true,
        },
        scale: {
            mode: Scale.ScaleModes.NONE, // We'll handle scaling manually
            width: gameSize.width,
            height: gameSize.height,
            autoCenter: Scale.CENTER_BOTH,
        },
        canvasStyle: `display: block; width: 100%; height: 100%;`,
        autoFocus: true,
        audio: {
            disableWebAudio: false,
        },
        scene: [Boot, Preloader, MainMenu, MainGame],
    };
};

const StartGame = (parent: string) => {
    const config = createConfig(parent);
    const game = new Game(config);

    // Handle window resize
    const resize = () => {
        const gameSize = getGameSize();
        game.scale.resize(gameSize.width, gameSize.height);

        // Update camera and game objects if needed
        game.scene.scenes.forEach((scene) => {
            if (scene.cameras && scene.cameras.main) {
                scene.cameras.main.setViewport(
                    0,
                    0,
                    gameSize.width,
                    gameSize.height
                );
            }
        });
    };

    window.addEventListener("resize", resize);
    game.events.once("destroy", () => {
        window.removeEventListener("resize", resize);
    });

    return game;
};

export default StartGame;
