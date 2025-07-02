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
        const { width, height } = this.scale;

        // Background
        const bg = this.add.image(0, 0, "background").setOrigin(0, 0);
        bg.setDisplaySize(width, height);

        this.modal = new Modal(this, width, height);

        // Title
        this.title = new TitleText(
            this,
            this.isMobile,
            width / 2 - (this.isMobile ? 10 : 0),
            height / 6,
            "Memory Remix",
            {
                fontFamily: "Orbitron",
                fontSize: this.isMobile ? "36px" : "64px",
                color: "#343434",
                stroke: "#8A00C4",
                strokeThickness: this.isMobile ? 4 : 8,
            }
        );

        // Define game mode data
        const spacingY = 80;
        const modeData = [
            {
                label: "Quick Play",
                description: "Match cards at your own pace",
                modes: [
                    { label: "1P", playerCount: 1, gameMode: "Quick" },
                    { label: "2P", playerCount: 2, gameMode: "Quick" },
                ],
            },
            {
                label: "Time Attack",
                description: "Match as many cards as you can under 30 seconds",
                modes: [
                    { label: "1P", playerCount: 1, gameMode: "Time" },
                    { label: "2P", playerCount: 2, gameMode: "Time" },
                ],
            },
            {
                label: "Remix Mode",
                description: "Cards shuffle every 4 flips",
                modes: [
                    { label: "1P", playerCount: 1, gameMode: "Shuffle" },
                    { label: "2P", playerCount: 2, gameMode: "Shuffle" },
                ],
            },
            {
                label: "Marathon Mode",
                description: "Endless solo mode — match until you fail",
                modes: [{ label: "1P", playerCount: 1, gameMode: "Marathon" }],
            },
        ];

        // Calculate starting Y for vertical centering of mode group
        const totalHeight = modeData.length * spacingY;
        const startY = (height - totalHeight) / 2 + spacingY / 2;

        // Define fixed column X positions (adjustable)
        const colLabelX = width / 2 - 200;
        const col1PX = width / 2 + 150;
        const col2PX = width / 2 + 250;

        // Row creation
        let rowIndex = 0;

        const createMenuRow = (
            label: string,
            description: string,
            modes: { label: string; playerCount: number; gameMode: string }[]
        ) => {
            const y = startY + rowIndex * spacingY;

            // Mode label
            this.add
                .text(colLabelX, y, label, {
                    fontFamily: "Share Tech Mono",
                    fontSize: this.isMobile ? "30px" : "40px",
                    stroke: "black",
                    strokeThickness: this.isMobile ? 6 : 8,
                    color: "#ffffff",
                })
                .setOrigin(0, 0.5); // Align left and vertically center

            // 1P button (if available)
            const mode1P = modes.find((m) => m.playerCount === 1);
            if (mode1P) {
                const btn1P = this.add
                    .text(col1PX, y, "1P", {
                        fontFamily: "Share Tech Mono",
                        fontSize: this.isMobile ? "30px" : "36px",
                        color: "#ffffff",
                        backgroundColor: "#333333",
                        padding: { x: 12, y: 6 },
                    })
                    .setInteractive()
                    .on("pointerover", () => btn1P.setStyle({ fill: "#ff0" }))
                    .on("pointerout", () => btn1P.setStyle({ fill: "#fff" }))
                    .on("pointerup", () => {
                        this.modal.showModal(description, () => {
                            this.scene.start("Game", {
                                gameMode: mode1P.gameMode,
                                playerCount: 1,
                                isMobile: this.isMobile,
                            });
                        });
                    })
                    .setOrigin(0.5, 0.5); // Centered on its X/Y
            }

            // 2P button (if available)
            const mode2P = modes.find((m) => m.playerCount === 2);
            if (mode2P) {
                const btn2P = this.add
                    .text(col2PX, y, "2P", {
                        fontFamily: "Share Tech Mono",
                        fontSize: this.isMobile ? "30px" : "36px",
                        color: "#ffffff",
                        backgroundColor: "#333333",
                        padding: { x: 12, y: 6 },
                    })
                    .setInteractive()
                    .on("pointerover", () => btn2P.setStyle({ fill: "#ff0" }))
                    .on("pointerout", () => btn2P.setStyle({ fill: "#fff" }))
                    .on("pointerup", () => {
                        this.modal.showModal(description, () => {
                            this.scene.start("Game", {
                                gameMode: mode2P.gameMode,
                                playerCount: 2,
                                isMobile: this.isMobile,
                            });
                        });
                    })
                    .setOrigin(0.5, 0.5); // Centered on its X/Y
            }

            rowIndex++;
        };

        // Build all menu rows
        for (const { label, description, modes } of modeData) {
            createMenuRow(label, description, modes);
        }

        EventBus.emit("current-scene-ready", this);
    }
}
