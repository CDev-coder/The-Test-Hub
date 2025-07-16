// src/managers/TimeAttackManager.ts
import { Scene } from "phaser";
import { getBaseFontSize, getTitleY } from "../utils/ui_dimensions";

export class TimeAttackManager {
    private scene: Scene;
    private timer?: Phaser.Time.TimerEvent;
    public baseFontSize: number = 15;
    public timerText?: Phaser.GameObjects.Text;
    public player1TimerText?: Phaser.GameObjects.Text;
    public player2TimerText?: Phaser.GameObjects.Text;
    public lastTimerText: string;
    private duration: number;
    public active: boolean = false;
    private startTime: number = 0;
    public events: Phaser.Events.EventEmitter;
    private isMobile: boolean = false;
    public playerCount: number = 1;
    public playerTurn: number = 1;
    public player1Time: string;
    public player2Time: string;
    public elapsedMs = 0; // live counter for the active player
    private pausedAt = 0;
    player1Ms: number;
    player2Ms: number;

    constructor(
        scene: Scene,
        isMobile: boolean,
        durationSeconds: number = 30,
        playerCount: number
    ) {
        this.scene = scene;
        this.isMobile = isMobile || this.scene.scale.width < 768;
        this.duration = durationSeconds * 1000; // convert to ms
        this.events = new Phaser.Events.EventEmitter();
        this.playerCount = playerCount;
        if (this.playerCount > 1) {
            this.playerTurn = 1;
        }
        this.baseFontSize = getBaseFontSize(this.scene.scale.height);
    }

    private formatTime(ms: number): string {
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        const hundredths = Math.floor((ms % 1000) / 10);
        return `${this.pad(minutes)}:${this.pad(seconds)}:${this.pad(
            hundredths
        )}`;
    }

    createTimerText() {
        const titleY = getTitleY(this.scene.scale.height, this.isMobile);
        const timerY = titleY + this.baseFontSize * (this.isMobile ? 1.5 : 2);
        this.scene.add
            .text(this.scene.scale.width / 2, titleY, "TIME ATTACK MODE", {
                fontFamily: "Orbitron",
                fontSize: this.isMobile
                    ? this.baseFontSize
                    : this.baseFontSize + 15,
                color: "#ffff00",
                stroke: "#000000",
                strokeThickness: 8,
                align: "center",
            })
            .setOrigin(0.5);
        this.timerText = this.scene.add
            .text(
                this.scene.scale.width / 2,
                timerY,
                `Time: ${this.formatTime(this.duration)}`,
                {
                    fontFamily: "Orbitron",
                    fontSize: this.isMobile
                        ? this.baseFontSize - 1
                        : this.baseFontSize + 8,
                    color: "#ffffff",
                    stroke: "#000000",
                    strokeThickness: 8,
                    align: "center",
                }
            )
            .setOrigin(0.5)
            .setDepth(100);

        if (this.playerCount > 1) {
            /////////PLAYER 1 TIME
            this.player1TimerText = this.scene.add
                .text(
                    this.isMobile ? 85 : 170,
                    this.isMobile ? 100 : 100,
                    `P1 TIME: ${this.formatTime(0)}`,
                    {
                        fontFamily: "Share Tech Mono",
                        fontSize: this.isMobile
                            ? this.baseFontSize - 8
                            : this.baseFontSize + 8,
                        color: "#ffffff",
                        stroke: "#000000",
                        strokeThickness: 8,
                        align: "center",
                    }
                )
                .setOrigin(0.5)
                .setDepth(100);
            this.player2TimerText = this.scene.add
                .text(
                    this.isMobile
                        ? this.scene.scale.width - 85
                        : this.scene.scale.width - 200,
                    this.isMobile ? 100 : 100,
                    `P2 TIME: ${this.formatTime(0)}`,
                    {
                        fontFamily: "Share Tech Mono",
                        fontSize: this.isMobile
                            ? this.baseFontSize - 8
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
    }

    start() {
        if (this.active) return;

        this.active = true;
        this.startTime = Date.now();

        if (!this.timerText) {
            this.createTimerText();
        }

        this.timer?.destroy();
        this.timer = this.scene.time.addEvent({
            delay: 100,
            callback: this.update,
            callbackScope: this,
            loop: true,
        });
    }

    private pad(value: number): string {
        return value.toString().padStart(2, "0");
    }

    private update() {
        if (!this.timerText) return;

        const now = Date.now();
        const elapsed = now - this.startTime;
        const remaining = Math.max(0, this.duration - elapsed);

        this.elapsedMs = Math.min(elapsed, this.duration);
        this.lastTimerText = this.formatTime(this.elapsedMs);

        this.timerText.setText(`Time: ${this.formatTime(remaining)}`);

        if (remaining <= this.duration / 3) {
            this.timerText.setColor("#ff0000");
            this.scene.tweens.add({
                targets: this.timerText,
                scaleX: 1.2,
                scaleY: 1.2,
                yoyo: true,
                duration: 500,
            });
        }

        if (remaining <= 0) {
            this.end();
            this.events.emit("timeup");
        }
    }

    stopTimer() {
        // Only pause if a timer exists and is running
        if (!this.active || !this.timer) return;
        this.timer.paused = true; // Phaser-native pause flag
        this.active = false; // let the rest of your code know
        this.pausedAt = Date.now(); // remember when we paused
    }
    resumeTimer() {
        // Resume only if we have a paused timer
        if (this.active || !this.timer || !this.timer.paused) return;
        const pauseDuration = Date.now() - this.pausedAt;
        // Shift the startTime forward so elapsed/remaining stay correct
        this.startTime += pauseDuration;
        this.timer.paused = false;
        this.active = true;
    }

    switchPlayers(turn: number) {
        this.player1TimerText?.setText(`P1 TIME: ${this.lastTimerText}`);
        this.playerTurn = turn;
    }

    end() {
        this.timer?.destroy();
        this.active = false;
        if (this.timerText) {
            this.timerText.setText("Time's Up!");
        }
    }

    capturePlayerOneTime() {
        this.player1Ms = this.elapsedMs;
        this.player1TimerText?.setText(`P1 TIME: ${this.lastTimerText}`);
    }
    capturePlayerTwoTime() {
        this.player2Ms = this.elapsedMs;
        this.player2TimerText?.setText(`P2 TIME: ${this.lastTimerText}`);
    }

    getWinner(): "Player 1" | "Player 2" | "Draw" {
        if (this.player1Ms === 0 || this.player2Ms === 0) {
            return "Draw";
        }
        if (this.player1Ms < this.player2Ms) return "Player 1";
        if (this.player2Ms < this.player1Ms) return "Player 2";
        return "Draw";
    }

    reset() {
        this.timer?.destroy();
        this.active = false;

        if (this.timerText) {
            this.timerText.setText(`Time: ${this.formatTime(this.duration)}`);
            this.timerText.setColor("#ffffff");
            this.timerText.setScale(1);
        }
    }

    destroy() {
        this.timer?.destroy();
        this.timerText?.destroy();
        this.player1TimerText?.destroy();
        this.player2TimerText?.destroy();
    }
}
