export class TurnIndicator {
    scene: Phaser.Scene;
    text: Phaser.GameObjects.Text;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;

        this.text = this.scene.add
            .text(-300, this.scene.scale.height / 2, "", {
                fontFamily: "Orbitron",
                fontSize: "48px",
                color: "#ffffff",
                stroke: "#000000",
                strokeThickness: 6,
            })
            .setOrigin(0.5)
            .setVisible(false);
    }

    display(
        playerName: string,
        duration: number = 500,
        onComplete: () => void
    ) {
        const centerX = this.scene.scale.width / 2;
        const exitX = this.scene.scale.width + 300;

        this.text.setText(`${playerName}'s Turn`);
        this.text.setX(-300);
        this.text.setVisible(true);

        // Fly in
        this.scene.tweens.add({
            targets: this.text,
            x: centerX,
            duration: duration,
            ease: "Back.easeOut",
            onComplete: () => {
                // Pause for 1 second
                this.scene.time.delayedCall(1000, () => {
                    // Fly out
                    this.scene.tweens.add({
                        targets: this.text,
                        x: exitX,
                        duration: duration,
                        ease: "Back.easeIn",
                        onComplete: () => {
                            this.text.setVisible(false);
                            onComplete(); // Callback when complete
                        },
                    });
                });
            },
        });
    }
}
