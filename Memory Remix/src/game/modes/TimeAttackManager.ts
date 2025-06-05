// src/managers/TimeAttackManager.ts
import { Scene } from "phaser";

export class TimeAttackManager {
    private scene: Scene;
    private timer?: Phaser.Time.TimerEvent;
    public timerText?: Phaser.GameObjects.Text;
    public lastTimerText: number;
    private duration: number;
    public active: boolean = false;
    private startTime: number = 0;
    public events: Phaser.Events.EventEmitter;

    constructor(scene: Scene, duration: number = 30000) {
        this.scene = scene;
        this.duration = duration;
        this.events = new Phaser.Events.EventEmitter();
    }

    createTimerText() {
        this.scene.add
            .text(this.scene.scale.width / 2, 30, "TIME ATTACK MODE", {
                fontFamily: "Orbitron",
                fontSize: "24px",
                color: "#ffff00",
                stroke: "#000000",
                strokeThickness: 8,
                align: "center",
            })
            .setOrigin(0.5);
        this.timerText = this.scene.add
            .text(
                this.scene.scale.width / 2,
                70,
                `Time: ${this.duration / 1000}s`,
                {
                    fontFamily: "Orbitron",
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

    private update() {
        if (!this.timerText) return;

        const elapsed = Date.now() - this.startTime;
        const remaining = Math.max(0, this.duration - elapsed);
        const remainingSeconds = Math.ceil(remaining / 1000);
        this.lastTimerText = remainingSeconds;
        this.timerText.setText(`Time: ${remainingSeconds}s`);

        if (remainingSeconds < 10) {
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
            this.events.emit("timeup"); ///Game side needs a 'timeup' listeners
        }
    }

    end() {
        this.timer?.destroy();
        this.active = false;

        if (this.timerText) {
            this.timerText.setText("Time's Up!");
        }
    }

    reset() {
        this.timer?.destroy();
        this.active = false;

        if (this.timerText) {
            this.timerText.setText(`Time: ${this.duration / 1000}s`);
            this.timerText.setColor("#ffffff");
            this.timerText.setScale(1);
        }
    }

    destroy() {
        this.timer?.destroy();
        this.timerText?.destroy();
    }
}
