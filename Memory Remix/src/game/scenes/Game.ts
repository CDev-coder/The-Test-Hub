import { Scene } from "phaser";
import { CARDS, COLS, ROWS, TIMEOUT } from "../utils/constants";
import Card from "./prefabs/Cards";

export class Game extends Scene {
    background: Phaser.GameObjects.Image;
    openedCard: null | Card = null;
    openCardCount: number;
    timeout: any;

    constructor() {
        super("Game");
    }

    preload() {
        //  Load the assets for the game - Replace with your own assets
        this.load.setPath("assets");
        this.load.image("card", "card.png");
        this.load.image("card1", "card1.png");
        this.load.image("card2", "card2.png");
        this.load.image("card3", "card3.png");
        this.load.image("card4", "card4.png");
        this.load.image("card5", "card5.png");
    }
    showCards() {
        this.cards.forEach((card) => {
            card.move();
        });
    }
    start() {
        this.openCardCount = 0;
        this.timeout = TIMEOUT;
        this.initCards();
        this.showCards();
        this.cards.forEach((card) => {
            card.closeCard();
        });
    }

    onCardClicked(_pointer: { x: number; y: number }, card: Card) {
        // The first condition checks if the clicked card (card) is already open (card.isOpened). If so, the function returns false to prevent any further actions.

        if (card.isOpened) {
            return false;
        }
        if (this.openedCard) {
            if (this.openedCard.value === card.value) {
                this.openedCard = null;
                this.openCardCount++;
            } else {
                // If the cards don’t match, the previous card (this.openedCard) is closed by calling this.openedCard.closeCard(), and openedCard is updated to reference the newly clicked card.
                this.openedCard.closeCard();
                this.openedCard = card;
            }
        } else {
            // If no card is currently open (this.openedCard is null), the clicked card is set as openedCard.
            this.openedCard = card;
        }
        card.openCard();

        if (this.openCardCount === this.cards.length / 2) {
            this.start();
        }
    }

    getCardsPosition(): { x: number; y: number; delay: number }[] {
        const cardWidth = 196 + 5;
        const cardHeight = 306 + 5;
        const positions = [];
        const offsetX =
            (+this.sys.game.config.width - cardWidth * COLS) / 2 +
            cardWidth / 2;
        const offsetY =
            (+this.sys.game.config.height - cardHeight * ROWS) / 2 +
            cardHeight / 2;

        let id = 0;
        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                positions.push({
                    x: offsetX + c * cardWidth,
                    y: offsetY + r * cardHeight,
                    delay: ++id * 100,
                });
            }
        }
        Phaser.Utils.Array.Shuffle(positions);
        return positions;
    }

    cards: Card[] = [];

    initCards() {
        const positions = this.getCardsPosition();
        Phaser.Utils.Array.Shuffle(positions);
        this.cards.forEach((card, index) => {
            const position = positions.pop();
            console.log("Card-" + index + " position: ", position);
            if (position != undefined)
                card.init(position.x, position.y, position.delay);

            // card.setPosition(card.positionX, card.positionY);
        });
    }

    createCards() {
        for (const card of CARDS) {
            for (let i = 0; i < ROWS; i++) {
                this.cards.push(new Card(this, card));
            }
        }
        this.initCards();
        this.input.on("gameobjectdown", this.onCardClicked, this);
    }

    ////Lets Make it
    create() {
        //this.background = this.add.image(0, 0, "background").setOrigin(0, 0);
        this.background = this.add.image(
            window.innerWidth / 2,
            window.innerHeight / 2,
            "background"
        );
        this.createCards();
        this.start();
    }
}
