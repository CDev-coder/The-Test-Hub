//import { Scene } from "phaser";
import { IShuffleGameScene } from "../interfaces/shuffleInterface";

export class ShuffleCount {
    private scene: IShuffleGameScene;
    private attemptCount: number = 0;
    private reshuffleThreshold: number = 4;
    public countText?: Phaser.GameObjects.Text;
    public onReshuffle: () => void;

    constructor(scene: IShuffleGameScene, onReshuffle: () => void) {
        this.scene = scene;
        this.onReshuffle = onReshuffle;
    }

    createCountdown() {
        this.countText = this.scene.add
            .text(
                this.scene.scale.width / 2,
                70,
                `Card Count: ${this.reshuffleThreshold}`,
                {
                    fontFamily: "Arial Black",
                    fontSize: 38,
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
        this.countText.setText(`Card Count: ${displayCount}`);

        if (this.attemptCount % this.reshuffleThreshold === 0) {
            const hasClosedCards = this.scene.cards.some(
                (card) => !card.isOpened
            );
            if (hasClosedCards) {
                this.scene.time.delayedCall(1200, () => {
                    this.onReshuffle();
                });
            }
            this.scene.time.delayedCall(1000, () => {
                this.attemptCount = 0; // Reset counter after reshuffle
                this.countText?.setText(
                    `Card Count: ${this.reshuffleThreshold}`
                );
            });
        }
    }

    reset() {
        this.attemptCount = 0;
    }
}
