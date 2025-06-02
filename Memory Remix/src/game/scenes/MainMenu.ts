import { GameObjects, Scene } from "phaser";

import { EventBus } from "../EventBus";

export class MainMenu extends Scene {
    background: GameObjects.Image;
    title: GameObjects.Text;
    rulesModalContainer: Phaser.GameObjects.Container;
    rulesModal_box: Phaser.GameObjects.Rectangle;
    rulesModal_nextButton: Phaser.GameObjects.Text;
    rulesModal_backButton: Phaser.GameObjects.Text;
    rulesModal_description: Phaser.GameObjects.Text;

    constructor() {
        super("MainMenu");
    }

    createRulesModal() {
        const modalWidth = this.scale.width;
        const modalHeight = this.scale.height;

        // Background overlay
        const overlay = this.add.rectangle(
            modalWidth / 2,
            modalWidth / 2,
            modalWidth,
            modalWidth,
            0x000000,
            0.5
        );
        overlay.setInteractive(); // block clicks through the overlay

        // Popup box
        const popupWidth = 300;
        const popupHeight = 200;
        this.rulesModal_box = this.add.rectangle(
            modalWidth / 2,
            modalHeight / 2,
            popupWidth,
            popupHeight,
            0xffffff
        );
        this.rulesModal_box.setStrokeStyle(2, 0x000000);

        this.rulesModal_description = this.add
            .text(modalWidth / 2, modalHeight / 2, "", {
                fontSize: "20px",
                color: "#000",
                wordWrap: { width: popupWidth - 40 },
                align: "center",
            })
            .setOrigin(0.5);

        this.rulesModal_nextButton = this.add
            .text(modalWidth / 2, modalHeight / 2 + 50, "Play", {
                fontSize: "24px",
                backgroundColor: "#4CAF50", //4CAF50
                color: "#fff",
                padding: { x: 20, y: 10 },
            })
            .setOrigin(0.5)
            .setInteractive();

        this.rulesModal_nextButton.on("pointerup", () => {
            this.scene.start("Game", {
                gameMode: "Quick",
                playerCount: 1,
            });
        });

        this.rulesModal_backButton = this.add
            .text(modalWidth / 2, modalHeight / 2 + 50, "Go back", {
                fontSize: "24px",
                backgroundColor: "#F44336", //F44336
                color: "#fff",
                padding: { x: 20, y: 10 },
            })
            .setOrigin(0.5)
            .setInteractive();

        this.rulesModal_backButton.on("pointerup", () => {
            this.rulesModalContainer.setVisible(false);
        });

        this.rulesModalContainer = this.add.container(0, 0, [
            overlay,
            this.rulesModal_box,
            this.rulesModal_description,
            this.rulesModal_backButton,
            this.rulesModal_nextButton,
        ]);

        this.rulesModalContainer.setVisible(false); // hide by default
    }

    showRulesModal(text: string, requestMode: string, playerCount: number) {
        this.rulesModal_description.setText(text);

        // Use the bounds to calculate new height
        const textBounds = this.rulesModal_description.getBounds();
        const padding = 40;
        const newPopupHeight = textBounds.height + 170; // Add space for buttons

        // Resize popup
        this.rulesModal_box.setSize(this.rulesModal_box.width, newPopupHeight);

        // Center popup vertically again
        const centerY = this.scale.height / 2;
        this.rulesModal_box.setY(centerY);

        // Reposition rule text
        this.rulesModal_description.setY(
            centerY - newPopupHeight / 2 + padding
        );

        // Reposition buttons relative to text
        this.rulesModal_nextButton.setY(
            this.rulesModal_description.y + textBounds.height + 30
        );
        this.rulesModal_backButton.setY(this.rulesModal_nextButton.y + 50);

        // Update Play button behavior
        this.rulesModal_nextButton.removeAllListeners();
        this.rulesModal_nextButton.setInteractive().on("pointerup", () => {
            this.scene.start("Game", {
                gameMode: requestMode,
                playerCount: playerCount,
            });
        });

        this.rulesModalContainer.setVisible(true);
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
                this.showRulesModal("Single Player Classic Mode", "Quick", 1)
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
                this.showRulesModal("Two Player Classic Mode", "Quick", 2)
            );

        this.createRulesModal();
        EventBus.emit("current-scene-ready", this);
    }
}
