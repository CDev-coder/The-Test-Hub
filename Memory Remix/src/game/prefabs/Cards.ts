class Card extends Phaser.GameObjects.Sprite {
    isOpened: boolean = false;
    positionX = 0;
    positionY = 0;
    delay = 0;
    value = 0;
    baseScale: number = 1; // Add this line to track scale

    constructor(scene: Phaser.Scene, value: number) {
        super(scene, 0, 0, "card");
        this.scene = scene;
        this.value = value;
        this.setOrigin(0.5, 0.5);
        this.scene.add.existing(this);
        this.setInteractive();
    }

    // Update showCard to use baseScale
    showCard() {
        const texture = this.isOpened ? `card${this.value}` : "card";
        this.setTexture(texture);
        this.scene.tweens.add({
            targets: this,
            scaleX: this.baseScale, // Use baseScale instead of fixed 1
            ease: "Linear",
            duration: 150,
        });
    }

    flipCard(speed?: number) {
        this.scene.tweens.add({
            targets: this,
            scaleX: 0,
            ease: "Linear",
            duration: speed ? speed : 150,
            onComplete: () => {
                this.showCard();
            },
        });
    }

    openCard() {
        this.isOpened = true;
        this.flipCard();
    }

    closeCard(speed?: number) {
        if (this.isOpened) {
            this.isOpened = false;
            this.flipCard(speed);
        }
    }

    move() {
        this.scene.tweens.add({
            targets: this,
            x: this.positionX,
            y: this.positionY,
            ease: "Linear",
            delay: this.delay,
            duration: 250,
            onComplete: () => {
                this.showCard();
            },
        });
    }

    resetPosition(newX: number, newY: number) {
        this.positionX = newX;
        this.positionY = newY;
        this.setPosition(newX, newY);
    }

    init(x: number, y: number, delay: number, scale: number = 1) {
        this.positionX = x;
        this.positionY = y;
        this.delay = delay;
        this.baseScale = scale;
        this.setPosition(-this.width, -this.height);
        this.setScale(scale); // Apply the scale
    }
}

export default Card;
