class Card extends Phaser.GameObjects.Sprite {
    isOpened: boolean = false;
    positionX = 0;
    positionY = 0;
    delay = 0;
    value = 0;
    baseScale: number = 1; // Add this line to track scale
    sceneRef: Phaser.Scene;

    constructor(scene: Phaser.Scene, value: number) {
        super(scene, 0, 0, "card");
        this.sceneRef = scene;
        this.value = value;
        this.setOrigin(0.5, 0.5);
        this.sceneRef.add.existing(this);
        this.setInteractive();
    }

    syncPosition() {
        this.x = this.positionX;
        this.y = this.positionY;
        this.setScale(this.baseScale);
    }

    // Update showCard to use baseScale
    showCard() {
        if (!this.sceneRef) {
            console.warn("Card: scene is not available when calling showCard");
            return;
        }

        const texture = this.isOpened ? `card${this.value}` : "card";
        this.setTexture(texture);
        this.sceneRef.tweens.add({
            targets: this,
            scaleX: this.baseScale, // Use baseScale instead of fixed 1
            ease: "Linear",
            duration: 150,
        });
    }

    flipCard(speed?: number) {
        this.sceneRef.tweens.add({
            targets: this,
            scaleX: 0,
            ease: "Linear",
            duration: speed ? speed : 150,
            onComplete: () => {
                if (this.sceneRef && this.active) {
                    this.showCard();
                }
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
        console.log("MOVING CARD");
        if (this.sceneRef) {
            this.sceneRef.tweens.add({
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

    destroy(fromScene?: boolean) {
        this.sceneRef?.tweens?.killTweensOf(this);
        super.destroy(fromScene);
    }
}

export default Card;
