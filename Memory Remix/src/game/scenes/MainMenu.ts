import { GameObjects, Scene } from "phaser";
import { EventBus } from "../EventBus";
import { Modal } from "../prefabs/Modal";

export class MainMenu extends Scene {
    background: GameObjects.Image;
    title: GameObjects.Text;
    modal: Modal;

    constructor() {
        super("MainMenu");
    }

    create() {
        const bg = this.add.image(0, 0, "background").setOrigin(0, 0);
        bg.setDisplaySize(this.scale.width, this.scale.height);

        this.modal = new Modal(this, this.scale.width, this.scale.height);
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

        const singlePlayerQuickPlay = this.add
            .text(
                this.scale.width / 2,
                this.scale.height / 4 + 100,
                "1 Player Quick Play",
                {
                    fontSize: "32px",
                    color: "#ffffff",
                    backgroundColor: "#333333",
                    padding: { x: 20, y: 10 },
                }
            )
            .setOrigin(0.5)
            .setInteractive()
            .on("pointerover", () =>
                singlePlayerQuickPlay.setStyle({ fill: "#ff0" })
            ) // Hover effect
            .on("pointerout", () =>
                singlePlayerQuickPlay.setStyle({ fill: "#fff" })
            ) // Normal state
            .on("pointerdown", () =>
                this.modal.showModal(
                    "Single Player Classic Mode Rules...",
                    () => {
                        this.scene.start("Game", {
                            gameMode: "Quick",
                            playerCount: 1,
                        });
                    }
                )
            );

        const twoPlayerQuickPlay = this.add
            .text(
                this.scale.width / 2,
                this.scale.height / 4 + 160,
                "2 Player Quick Play",
                {
                    fontSize: "32px",
                    color: "#ffffff",
                    backgroundColor: "#333333",
                    padding: { x: 20, y: 10 },
                }
            )
            .setOrigin(0.5)
            .setInteractive()
            .on("pointerover", () =>
                twoPlayerQuickPlay.setStyle({ fill: "#ff0" })
            ) // Hover effect
            .on("pointerout", () =>
                twoPlayerQuickPlay.setStyle({ fill: "#fff" })
            ) // Normal state
            .on("pointerdown", () =>
                this.modal.showModal(
                    "Two Players Classic Mode Rules...",
                    () => {
                        this.scene.start("Game", {
                            gameMode: "Quick",
                            playerCount: 2,
                        });
                    }
                )
            );
        EventBus.emit("current-scene-ready", this);
    }
}
