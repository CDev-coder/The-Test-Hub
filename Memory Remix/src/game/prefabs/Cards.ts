class Card extends Phaser.GameObjects.Sprite {
    isOpened: boolean = false;
    positionX = 0;
    positionY = 0;
    delay = 0;
    value = 0;

    constructor(scene: Phaser.Scene, value: number) {
        super(scene, 0, 0, "card");
        this.scene = scene;
        this.value = value;
        this.setOrigin(0.5, 0.5);
        this.scene.add.existing(this);
        this.setInteractive();
    }

    showCard() {
        // This line determines which texture (image) to show on the card.
        const texture = this.isOpened ? `card${this.value}` : "card";
        this.setTexture(texture);
        // This adds another tween animation, just like in the flipCard method, to animate the card's horizontal scaling.
        this.scene.tweens.add({
            targets: this,
            scaleX: 1,
            ease: "Linear",
            duration: 150,
        });
    }

    flipCard() {
        this.scene.tweens.add({
            targets: this,
            scaleX: 0,
            ease: "Linear",
            duration: 150,
            onComplete: () => {
                this.showCard();
            },
        });
    }

    openCard() {
        this.isOpened = true;
        this.flipCard();
    }

    closeCard() {
        if (this.isOpened) {
            this.isOpened = false;
            this.flipCard();
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

    init(x: number, y: number, delay: number) {
        this.positionX = x;
        this.positionY = y;
        this.delay = delay;
        this.setPosition(-this.width, -this.height);
    }
}

export default Card;
