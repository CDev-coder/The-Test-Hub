import { GameObjects, Scene } from "phaser";
import { EventBus } from "../EventBus";
import { Modal } from "../prefabs/Modal";
import { TitleText } from "../prefabs/TitleText";

export class MainMenu extends Scene {
    background: GameObjects.Image;
    modal: Modal;
    title: TitleText;
    isMobile: boolean = false;

    constructor() {
        super("MainMenu");
    }

    init() {
        console.log("MainMenu INIT");
        this.isMobile = this.scale.width < 768;
    }

    create() {
        const bg = this.add.image(0, 0, "background").setOrigin(0, 0);
        bg.setDisplaySize(this.scale.width, this.scale.height);

        this.modal = new Modal(this, this.scale.width, this.scale.height);
        this.title = new TitleText(
            this,
            this.isMobile,
            this.scale.width / 2 - (this.isMobile ? 10 : 0),
            this.scale.height / 4,
            "Memory Remix",
            {
                fontFamily: "Orbitron",
                fontSize: this.isMobile ? "32px" : "64px",
                color: "#343434",
                stroke: "#8A00C4",
                strokeThickness: this.isMobile ? 4 : 8,
            }
        );

        const singlePlayerQuickPlay = this.add
            .text(
                this.scale.width / 2,
                this.scale.height / 4 + 100,
                "1 Player Quick Play",
                {
                    fontFamily: "Share Tech Mono",
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
                    "Single Player Quick Play Mode: Match Cards at your own pace",
                    () => {
                        this.scene.start("Game", {
                            gameMode: "Quick",
                            playerCount: 1,
                            isMobile: this.isMobile,
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
                    fontFamily: "Share Tech Mono",
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
                this.modal.showModal(
                    "Single Player Time Attack Mode: Match Cards under 30 seconds",
                    () => {
                        this.scene.start("Game", {
                            gameMode: "Time",
                            playerCount: 1,
                            isMobile: this.isMobile,
                        });
                    }
                )
            );

        const twoPlayerQuickPlay = this.add
            .text(
                this.scale.width / 2,
                this.scale.height / 4 + 220,
                "2 Player Quick Play",
                {
                    fontFamily: "Share Tech Mono",
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
                    "Two Player Quick Mode: Players will take turns matching cards at their own pace",
                    () => {
                        this.scene.start("Game", {
                            gameMode: "Quick",
                            playerCount: 2,
                            isMobile: this.isMobile,
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
                    fontFamily: "Share Tech Mono",
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
                this.modal.showModal(
                    "Two Player Time Attack Mode: Each player will 30 seconds to match as many cards as they can",
                    () => {
                        this.scene.start("Game", {
                            gameMode: "Time",
                            playerCount: 2,
                            isMobile: this.isMobile,
                        });
                    }
                )
            );

        const onePlayerRemixMode = this.add
            .text(
                this.scale.width / 2,
                this.scale.height / 4 + 340,
                "1 Player Remix Mode",
                {
                    fontFamily: "Share Tech Mono",
                    fontSize: "32px",
                    color: "#ffffff",
                    backgroundColor: "#333333",
                    padding: { x: 20, y: 10 },
                }
            )
            .setOrigin(0.5)
            .setInteractive()
            .on("pointerover", () =>
                onePlayerRemixMode.setStyle({
                    fill: "#ff0",
                })
            ) // Hover effect
            .on("pointerout", () =>
                onePlayerRemixMode.setStyle({ fill: "#fff" })
            ) // Normal state
            .on("pointerup", () =>
                this.modal.showModal(
                    "Single Player Time Attack Mode: Player will 30 seconds to match as many cards as they can",
                    () => {
                        this.scene.start("Game", {
                            gameMode: "Shuffle",
                            playerCount: 1,
                            isMobile: this.isMobile,
                        });
                    }
                )
            );

        const twoPlayerRemixMode = this.add
            .text(
                this.scale.width / 2,
                this.scale.height / 4 + 400,
                "2 Player Remix Mode",
                {
                    fontFamily: "Share Tech Mono",
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
                this.modal.showModal(
                    "Two Player Remix Mode: Cards will shuffle after 4 cards have been flipped",
                    () => {
                        this.scene.start("Game", {
                            gameMode: "Shuffle",
                            playerCount: 2,
                            isMobile: this.isMobile,
                        });
                    }
                )
            );

        EventBus.emit("current-scene-ready", this);
    }
}
