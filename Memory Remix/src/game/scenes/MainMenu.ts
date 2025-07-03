import { GameObjects, Scene } from "phaser";
import { EventBus } from "../EventBus";
import { Modal } from "../prefabs/Modal";
import { TitleText } from "../prefabs/TitleText";

type GameModeInfo = {
    label: string;
    description1P: string;
    description2P?: string;
    modes: {
        label: string;
        playerCount: number;
        gameMode: string;
    }[];
};

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
        const modeData: GameModeInfo[] = [
            {
                label: "Quick Play",
                description1P: "Match cards at your own pace",
                description2P: "Two players match cards at their own pace",
                modes: [
                    { label: "1P", playerCount: 1, gameMode: "Quick" },
                    { label: "2P", playerCount: 2, gameMode: "Quick" },
                ],
            },
            {
                label: "Marathon Mode",
                description1P:
                    "Endless solo mode — How many matches can you make?",
                modes: [{ label: "1P", playerCount: 1, gameMode: "Marathon" }],
            },
            {
                label: "Time Attack Mode",
                description1P: "Match as many cards as you can in 30 seconds",
                description2P: "Who can match the most in 30 seconds?",
                modes: [
                    { label: "1P", playerCount: 1, gameMode: "Time" },
                    { label: "2P", playerCount: 2, gameMode: "Time" },
                ],
            },
            {
                label: "Score Mode",
                description1P:
                    "Match to earn points. Match two or more in a row for extra points",
                description2P:
                    "Match to earn points. Match two or more in a row for extra points! Ending a match streak switches the player's turn.",
                modes: [
                    { label: "1P", playerCount: 1, gameMode: "Score" },
                    { label: "2P", playerCount: 2, gameMode: "Score" },
                ],
            },
            {
                label: "Remix Mode",
                description1P: "Cards remix every 4 flips",
                description2P:
                    "Cards shuffle every 4 flips. Ending a match streak switches the player's turn",
                modes: [
                    { label: "1P", playerCount: 1, gameMode: "Shuffle" },
                    { label: "2P", playerCount: 2, gameMode: "Shuffle" },
                ],
            },
        ];

        // Calculate starting Y for vertical centering of mode group
        const totalHeight = modeData.length * spacingY;
        const startY = (height - totalHeight) / 2 + spacingY / 2;

        // Define fixed column X positions (adjustable)
        const colLabelX = this.isMobile ? width / 2 - 200 : width / 2 - 240;
        const col1PX = this.isMobile ? width / 2 + 70 : width / 2 + 150;
        const col2PX = this.isMobile ? width / 2 + 160 : width / 2 + 250;

        // Row creation
        let rowIndex = 0;

        const createMenuRow = (
            label: string,
            description1P: string,
            modes: { label: string; playerCount: number; gameMode: string }[],
            description2P?: string
        ) => {
            const y = startY + rowIndex * spacingY;

            // Mode label
            this.add
                .text(colLabelX, y, label, {
                    fontFamily: "Share Tech Mono",
                    fontSize: this.isMobile ? "25px" : "40px",
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
                        this.modal.showModal(description1P, () => {
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
                        const desc = description2P || description1P;
                        this.modal.showModal(desc, () => {
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
        for (const item of modeData) {
            const { label, description1P, description2P, modes } = item;
            createMenuRow(label, description1P, modes, description2P);
        }

        EventBus.emit("current-scene-ready", this);
    }
}
