// src/managers/ScoreAttackManager.ts
import { Scene } from "phaser";

export class ScoreAttackManager {
    private scene: Scene;
    public active: boolean = false;
    private isMobile: boolean = false;
    public scoreGoal: number = 0;
    public playerCount: number = 1;
    public playerTurn: number = 1;
    public player1Score: number = 0;
    public player2Score: number = 0;
    public scoreText?: Phaser.GameObjects.Text;
    public player1ScoreText?: Phaser.GameObjects.Text;
    public player2ScoreText?: Phaser.GameObjects.Text;

    constructor(
        scene: Scene,
        isMobile: boolean,
        scoreGoal: number,
        playerCount: number
    ) {
        this.scene = scene;
        this.isMobile = isMobile || this.scene.scale.width < 768;
        this.scoreGoal = scoreGoal;
        this.playerCount = playerCount;
        if (this.playerCount > 1) {
            this.playerTurn = 1;
        }
    }

    createScoreMode() {
        this.scene.add
            .text(
                this.scene.scale.width / 2,
                this.isMobile ? 15 : 30,
                "Score Attack Mode ",
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
        if (this.playerCount == 1) {
            this.scoreText = this.scene.add
                .text(
                    this.scene.scale.width / 2,
                    this.isMobile ? 48 : 66,
                    `Score: ${this.player1Score}`,
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
        } else {
            this.player1ScoreText = this.scene.add
                .text(
                    this.isMobile ? 85 : 170,
                    this.isMobile ? 50 : 100,
                    `P1 Score: ${this.player1Score}`,
                    {
                        fontFamily: "Share Tech Mono",
                        fontSize: this.isMobile ? 18 : 30,
                        color: "#ffffff",
                        stroke: "#000000",
                        strokeThickness: 8,
                        align: "center",
                    }
                )
                .setOrigin(0.5)
                .setDepth(100);
            this.player2ScoreText = this.scene.add
                .text(
                    this.isMobile
                        ? this.scene.scale.width - 85
                        : this.scene.scale.width - 200,
                    this.isMobile ? 50 : 100,
                    `P2 Score: 0`,
                    {
                        fontFamily: "Share Tech Mono",
                        fontSize: this.isMobile ? 18 : 30,
                        color: "#ffffff",
                        stroke: "#000000",
                        strokeThickness: 8,
                        align: "center",
                    }
                )
                .setOrigin(0.5)
                .setDepth(100);
        }
    }

    setScore(copyCombo: number) {
        if (copyCombo < 0) copyCombo = 1;
        if (this.playerCount == 1) {
            const currentScore = this.player1Score + copyCombo * 10;
            this.scoreText?.setText(`Score: ${currentScore}`);
            this.player1Score = currentScore;
        } else {
            if (this.playerTurn == 1) {
                const currentScore = this.player1Score + copyCombo * 10;
                this.player1ScoreText?.setText(`P1 Score: ${currentScore}`);
                this.player1Score = currentScore;
            } else if (this.playerTurn == 2) {
                const currentScore = this.player2Score + copyCombo * 10;
                this.player2ScoreText?.setText(`P2 Score: ${currentScore}`);
                this.player2Score = currentScore;
            }
        }
    }

    switchPlayer() {
        if (this.playerCount > 1) {
            if (this.playerTurn == 1) {
                this.playerTurn = 2;
            } else if (this.playerTurn == 2) {
                this.playerTurn = 1;
            }
        }
    }

    isGoalReached() {
        if (this.playerCount > 1) {
            return (
                this.player1Score >= this.scoreGoal ||
                this.player2Score >= this.scoreGoal
            );
        } else {
            return this.player1Score >= this.scoreGoal;
        }
    }
}
