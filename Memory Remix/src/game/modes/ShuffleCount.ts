//import { Scene } from "phaser";
import { IShuffleGameScene } from "../interfaces/shuffleInterface";
import { getBaseFontSize, getTitleY } from "../utils/ui_dimensions";

export class ShuffleCount {
    private scene: IShuffleGameScene;
    private attemptCount: number = 0;
    private reshuffleThreshold: number = 4;
    public countText?: Phaser.GameObjects.Text;
    public onReshuffle: () => void;
    private isMobile: boolean;
    public baseFontSize: number = 15;

    constructor(
        scene: IShuffleGameScene,
        isMobile: boolean,
        onReshuffle: () => void
    ) {
        this.scene = scene;
        this.isMobile = isMobile;
        this.onReshuffle = onReshuffle;
        this.baseFontSize = getBaseFontSize(this.scene.scale.height);
    }

    createCountdown() {
        const titleY = getTitleY(this.scene.scale.height, this.isMobile);
        const infoY = titleY + this.baseFontSize * (this.isMobile ? 2 : 2.5);

        this.scene.add
            .text(this.scene.scale.width / 2, titleY, "Remix Mode ", {
                fontFamily: "Orbitron",
                fontSize: this.isMobile
                    ? this.baseFontSize + 10
                    : this.baseFontSize + 15,
                color: "#ffff00",
                stroke: "#000000",
                strokeThickness: 8,
                align: "center",
            })
            .setOrigin(0.5);
        this.countText = this.scene.add
            .text(
                this.scene.scale.width / 2,
                infoY,
                `Cards Until Remix: ${this.reshuffleThreshold}`,
                {
                    fontFamily: "Orbitron",
                    fontSize: this.isMobile
                        ? this.baseFontSize - 4
                        : this.baseFontSize + 8,
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
