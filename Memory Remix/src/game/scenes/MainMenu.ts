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
            .on("pointerup", () =>
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

        const singlePlayerTimeAttackPlay = this.add
            .text(
                this.scale.width / 2,
                this.scale.height / 4 + 160,
                "1 Player Time Attack",
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
                singlePlayerTimeAttackPlay.setStyle({ fill: "#ff0" })
            ) // Hover effect
            .on("pointerout", () =>
                singlePlayerTimeAttackPlay.setStyle({ fill: "#fff" })
            ) // Normal state
            .on("pointerup", () =>
                this.modal.showModal("Single Player Time Attack...", () => {
                    this.scene.start("Game", {
                        gameMode: "Time",
                        playerCount: 1,
                    });
                })
            );

        const twoPlayerQuickPlay = this.add
            .text(
                this.scale.width / 2,
                this.scale.height / 4 + 220,
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
            .on("pointerup", () =>
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

        const twoPlayerTimeAttackPlay = this.add
            .text(
                this.scale.width / 2,
                this.scale.height / 4 + 280,
                "2 Player Time Attack",
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
                twoPlayerTimeAttackPlay.setStyle({ fill: "#ff0" })
            ) // Hover effect
            .on("pointerout", () =>
                twoPlayerTimeAttackPlay.setStyle({ fill: "#fff" })
            ) // Normal state
            .on("pointerup", () =>
                this.modal.showModal("Two Player Time Attack...", () => {
                    this.scene.start("Game", {
                        gameMode: "Time",
                        playerCount: 2,
                    });
                })
            );

        const twoPlayerRemixMode = this.add
            .text(
                this.scale.width / 2,
                this.scale.height / 4 + 350,
                "2 Player Remix Mode",
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
                twoPlayerRemixMode.setStyle({
                    fill: "#ff0",
                })
            ) // Hover effect
            .on("pointerout", () =>
                twoPlayerRemixMode.setStyle({ fill: "#fff" })
            ) // Normal state
            .on("pointerup", () =>
                this.modal.showModal("Two Player Time Attack...", () => {
                    this.scene.start("Game", {
                        gameMode: "Shuffle",
                        playerCount: 2,
                    });
                })
            );

        EventBus.emit("current-scene-ready", this);
    }
}
