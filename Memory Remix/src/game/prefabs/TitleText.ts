import Phaser from "phaser";
import { getBaseFontSize } from "../utils/ui_dimensions";

export class TitleText extends Phaser.GameObjects.Container {
    private originalText: string;
    private glitchTexts: Phaser.GameObjects.Text[] = [];
    private originalStyle: Phaser.Types.GameObjects.Text.TextStyle;
    private glitchEvent?: Phaser.Time.TimerEvent;
    private isMobile: boolean;
    public baseFontSize: number = 15;
    // private baseCharacterWidth?: number;

    constructor(
        scene: Phaser.Scene,
        isMobile: boolean,
        x: number,
        y: number,
        text: string,
        style: Phaser.Types.GameObjects.Text.TextStyle = {}
    ) {
        super(scene, x, y);
        this.originalText = text;
        this.isMobile = isMobile;
        this.baseFontSize = getBaseFontSize(this.scene.scale.height);
        this.originalStyle = {
            fontFamily: "Orbitron",
            fontSize: this.isMobile
                ? this.baseFontSize + 10
                : this.baseFontSize + 30,
            color: "#ffffff",
            stroke: "#000000",
            strokeThickness: 8,
            align: "center",
            ...style,
        };

        // Calculate spacing based on the largest possible character
        const tempText = this.scene.add
            .text(0, 0, "W", this.originalStyle) // 'W' is typically the widest
            .setVisible(false);
        //this.baseCharacterWidth = tempText.width;
        tempText.destroy();

        //this.characterSpacing = this.baseCharacterWidth * spacingMultiplier;
        this.createTextElements();
        this.setupGlitchEffect();
        scene.add.existing(this);
    }

    private createTextElements() {
        this.removeAll(true);
        this.glitchTexts = [];

        // First measure all characters to get exact widths
        const charWidths: number[] = [];
        let totalWidth = 0;

        for (let i = 0; i < this.originalText.length; i++) {
            const char = this.originalText[i];
            const tempText = this.scene.add
                .text(0, 0, char, this.originalStyle)
                .setVisible(false);
            charWidths.push(tempText.width);
            totalWidth += tempText.width;
            tempText.destroy();
        }

        // Calculate positions based on actual character widths
        let currentX = -totalWidth / 2;

        for (let i = 0; i < this.originalText.length; i++) {
            const charText = this.scene.add
                .text(
                    currentX + charWidths[i] / 2, // Center each character in its space
                    0,
                    this.originalText[i],
                    this.originalStyle
                )
                .setOrigin(0.5);

            this.glitchTexts.push(charText);
            this.add(charText);

            // Add spacing (10% of average width) except after last character
            currentX +=
                charWidths[i] +
                (i < this.originalText.length - 1
                    ? (totalWidth / this.originalText.length) * 0.1
                    : 0);
        }
    }

    private setupGlitchEffect() {
        this.glitchEvent = this.scene.time.addEvent({
            delay: 300, // Glitch every 100ms
            callback: this.applyGlitchEffect,
            callbackScope: this,
            loop: true,
        });
    }

    private applyGlitchEffect() {
        if (Phaser.Math.Between(0, 100) > 85) {
            // 15% chance to glitch
            // Choose two random characters to keep matching
            const matchIndex1 = Phaser.Math.Between(
                0,
                this.glitchTexts.length - 1
            );
            let matchIndex2 = Phaser.Math.Between(
                0,
                this.glitchTexts.length - 1
            );
            while (matchIndex2 === matchIndex1) {
                matchIndex2 = Phaser.Math.Between(
                    0,
                    this.glitchTexts.length - 1
                );
            }

            // Generate random styles for the matching characters
            const matchColor = Phaser.Display.Color.RGBToString(
                Phaser.Math.Between(150, 255),
                Phaser.Math.Between(150, 255),
                Phaser.Math.Between(150, 255)
            );

            const matchSize =
                Phaser.Math.Between(
                    this.isMobile
                        ? this.baseFontSize + 8
                        : this.baseFontSize + 35,
                    this.isMobile
                        ? this.baseFontSize + 25
                        : this.baseFontSize + 45
                ) + "px";

            // Apply glitch to all characters
            this.glitchTexts.forEach((charText, index) => {
                if (index === matchIndex1 || index === matchIndex2) {
                    // Matching characters
                    charText.setStyle({
                        color: matchColor,
                        fontSize: matchSize,
                    });
                } else {
                    // Random glitch characters
                    charText.setStyle({
                        color: Phaser.Display.Color.RGBToString(
                            Phaser.Math.Between(50, 255),
                            Phaser.Math.Between(50, 255),
                            Phaser.Math.Between(50, 255)
                        ),
                        fontSize:
                            Phaser.Math.Between(
                                this.isMobile
                                    ? this.baseFontSize + 10
                                    : this.baseFontSize + 40,
                                this.isMobile
                                    ? this.baseFontSize + 20
                                    : this.baseFontSize + 50
                            ) + "px",
                    });
                }
            });

            // Reset after short delay
            this.scene.time.delayedCall(Phaser.Math.Between(500, 2000), () => {
                this.resetGlitchEffect();
            });
        }
    }

    private resetGlitchEffect() {
        this.glitchTexts.forEach((charText) => {
            charText.setStyle(this.originalStyle);
        });
    }

    setText(newText: string) {
        this.originalText = newText;
        this.createTextElements();
    }

    destroy(fromScene?: boolean) {
        if (this.glitchEvent) {
            this.glitchEvent.destroy();
        }
        super.destroy(fromScene);
    }
}
