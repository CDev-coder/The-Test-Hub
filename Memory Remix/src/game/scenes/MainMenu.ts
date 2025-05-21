import { GameObjects, Scene } from "phaser";

import { EventBus } from "../EventBus";

export class MainMenu extends Scene {
    background: GameObjects.Image;
    title: GameObjects.Text;

    constructor() {
        super("MainMenu");
    }

    create() {
        const bg = this.add.image(0, 0, "background").setOrigin(0, 0);
        bg.setDisplaySize(this.scale.width, this.scale.height);

        this.title = this.add
            .text(this.scale.width / 2, this.scale.height / 4, "Memory Remix", {
                fontFamily: "Arial Black",
                fontSize: 38,
                color: "#ffffff",
                stroke: "#000000",
                strokeThickness: 8,
                align: "center",
            })
            .setOrigin(0.5)
            .setDepth(100);

        const playButton = this.add
            .text(
                this.scale.width / 2,
                this.scale.height / 4 + 100,
                "Quick Play",
                {
                    fontSize: "32px",
                    color: "#ffffff",
                    backgroundColor: "#333333",
                    padding: { x: 20, y: 10 },
                }
            )
            .setOrigin(0.5)
            .setInteractive()
            .on("pointerover", () => playButton.setStyle({ fill: "#ff0" })) // Hover effect
            .on("pointerout", () => playButton.setStyle({ fill: "#fff" })) // Normal state
            .on("pointerdown", () =>
                this.scene.start("Game", {
                    gameMode: "Quick",
                    playerCount: 1,
                })
            );

        EventBus.emit("current-scene-ready", this);
    }
}
