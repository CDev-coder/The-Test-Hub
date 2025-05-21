import { Scene } from "phaser";
import { CARDS, COLS, ROWS, TIMEOUT } from "../utils/constants";
import Card from "../prefabs/Cards";

export class Game extends Scene {
    background: Phaser.GameObjects.Image;
    openedCard: null | Card = null;
    openCardCount: number;
    timeout: any;

    // Add these properties to hold your parameters
    gameMode: string = "Quick"; // Default value
    playerCount: number = 1;

    constructor() {
        super("Game");
    }

    init(data: { gameMode?: string; playerCount?: number }) {
        // Set parameters with default fallbacks
        this.gameMode = data.gameMode || "Quick";
        this.playerCount = data.playerCount || 1;

        console.log(`Starting game with gameMode: ${this.gameMode}`);
        console.log(`Player count: ${this.playerCount}`);
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
        // Card dimensions with padding
        const cardWidth = 196 + 5; // Width + extra margin
        const cardHeight = 306 + 5; // Height + extra margin

        // Get current game dimensions
        const gameWidth = this.scale.width;
        const gameHeight = this.scale.height;

        // Calculate total grid width/height
        const gridWidth = cardWidth * COLS;
        const gridHeight = cardHeight * ROWS;

        // Calculate dynamic scale factor
        const scaleFactor = Math.min(
            gameWidth / (gridWidth + 40),
            gameHeight / (gridHeight + 40),
            1
        );

        // Apply scaling if needed (for smaller screens)
        const scaledCardWidth = cardWidth * scaleFactor;
        const scaledCardHeight = cardHeight * scaleFactor;

        // Calculate centered offsets
        const offsetX =
            (gameWidth - scaledCardWidth * COLS) / 2 + scaledCardWidth / 2;
        const offsetY =
            (gameHeight - scaledCardHeight * ROWS) / 2 + scaledCardHeight / 2;

        const positions = [];
        let id = 0;

        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                positions.push({
                    x: offsetX + c * scaledCardWidth,
                    y: offsetY + r * scaledCardHeight,
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

    ////Lets Render it
    create() {
        const bg = this.add.image(0, 0, "background").setOrigin(0, 0);
        bg.setDisplaySize(this.scale.width, this.scale.height);
        this.createCards();
        this.start();
    }
}
