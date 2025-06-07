//import { Scene } from "phaser";
import { IShuffleGameScene } from "../interfaces/shuffleInterface";

export class ShuffleCount {
    private scene: IShuffleGameScene;
    private attemptCount: number = 0;
    private reshuffleThreshold: number = 4;
    public countText?: Phaser.GameObjects.Text;
    public onReshuffle: () => void;
    private isMobile: boolean;

    constructor(
        scene: IShuffleGameScene,
        isMobile: boolean,
        onReshuffle: () => void
    ) {
        this.scene = scene;
        this.isMobile = isMobile;
        this.onReshuffle = onReshuffle;
    }

    createCountdown() {
        this.scene.add
            .text(this.scene.scale.width / 2, 30, "Remix Mode ", {
                fontFamily: "Orbitron",
                fontSize: this.isMobile ? "24px" : "38px",
                color: "#ffff00",
                stroke: "#000000",
                strokeThickness: 8,
                align: "center",
            })
            .setOrigin(0.5);
        this.countText = this.scene.add
            .text(
                this.scene.scale.width / 2,
                70,
                `Cards Until Remix: ${this.reshuffleThreshold}`,
                {
                    fontFamily: "Orbitron",
                    fontSize: this.isMobile ? "22px" : "30px",
                    color: "#ffffff",
                    stroke: "#000000",
                    strokeThickness: 8,
                    align: "center",
                }
            )
            .setOrigin(0.5)
            .setDepth(100);
    }

    trackAttempt() {
        if (!this.countText) return;
        this.attemptCount++;
        const displayCount = this.reshuffleThreshold - this.attemptCount;
        this.countText.setText(`Cards Until Remix: ${displayCount}`);
        if (this.attemptCount % this.reshuffleThreshold === 0) {
            const hasClosedCards = this.scene.cards.some(
                (card) => !card.isOpened
            );
            if (hasClosedCards) {
                this.scene.time.delayedCall(1200, () => {
                    //this.onReshuffle();
                });
            }
            this.scene.time.delayedCall(1000, () => {
                this.attemptCount = 0; // Reset counter after reshuffle
                this.countText?.setText(
                    `Cards Until Remix: ${this.reshuffleThreshold}`
                );
            });
        }
    }

    reset() {
        this.attemptCount = 0;
    }
}
