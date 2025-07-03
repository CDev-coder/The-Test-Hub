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
            .text(
                this.scene.scale.width / 2,
                this.isMobile ? 15 : 30,
                "Remix Mode ",
                {
                    fontFamily: "Orbitron",
                    fontSize: this.isMobile ? "24px" : "38px",
                    color: "#ffff00",
                    stroke: "#000000",
                    strokeThickness: 8,
                    align: "center",
                }
            )
            .setOrigin(0.5);
        this.countText = this.scene.add
            .text(
                this.scene.scale.width / 2,
                this.isMobile ? 50 : 70,
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
        //console.log("TRACK trackAttempt");
        if (!this.countText) return;
        this.attemptCount++;
        let displayCount = this.reshuffleThreshold - this.attemptCount;
        if (displayCount < 0) {
            displayCount = 0;
        }
        this.countText.setText(`Cards Until Remix: ${displayCount}`);
    }

    triggerShuffle() {
        //console.log("this.attemptCount: " + this.attemptCount);
        if (this.attemptCount >= this.reshuffleThreshold) {
            const hasClosedCards = this.scene.cards.some((c) => !c.isOpened);
            const noCardIsFlipped = this.scene.openedCard === null; ///Check to see if ONE non-matching card is showing

            if (hasClosedCards && noCardIsFlipped) {
                this.scene.time.delayedCall(250, () => this.onReshuffle());
            }

            this.scene.time.delayedCall(1000, () => {
                this.attemptCount = 0;
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
