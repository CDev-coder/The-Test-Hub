import { Scene } from "phaser";
import { CARDS, COLS, ROWS, TIMEOUT } from "../utils/constants";
import Card from "../prefabs/Cards";

export class Game extends Scene {
    background: Phaser.GameObjects.Image;
    openedCard: null | Card = null;
    openCardCount: number;
    timeout: any;
    cards: Card[] = [];
    playerTurn: string;
    player1Score: Phaser.GameObjects.Text;
    player2Score: Phaser.GameObjects.Text;
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
        //  Load the assets for the game
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
                this.updateScore();
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

    updateScore() {
        this.player1Score.setText("Matched: " + this.openCardCount);
    }

    getCardsPosition(): {
        x: number;
        y: number;
        delay: number;
        scale: number;
    }[] {
        // Base dimensions (smaller for mobile)
        const baseCardWidth = 150;
        const baseCardHeight = 225;
        const cardMarginX = 50;
        const cardMarginY = 100;

        // Get current game dimensions
        const gameWidth = this.scale.width;
        const gameHeight = this.scale.height;

        // Calculate scale factor
        const maxGridWidth = gameWidth * 0.9; // 90% of screen width
        const maxGridHeight = gameHeight * 0.7; // 70% of screen height

        const widthScale =
            maxGridWidth / ((baseCardWidth + cardMarginX) * COLS);
        const heightScale =
            maxGridHeight / ((baseCardHeight + cardMarginY) * ROWS);

        const scaleFactor = Math.min(widthScale, heightScale, 1); // Don't scale up

        // Calculate final dimensions
        const cardWidth = baseCardWidth * scaleFactor;
        const cardHeight = baseCardHeight * scaleFactor;
        const marginX = cardMarginX * scaleFactor;
        const marginY = cardMarginY * scaleFactor;

        // Center the grid
        const gridWidth = (cardWidth + marginX) * COLS;
        const gridHeight = (cardHeight + marginY) * ROWS;
        const offsetX = (gameWidth - gridWidth) / 2 + cardWidth / 2;
        const offsetY = (gameHeight - gridHeight) / 2 + cardHeight / 2;

        const positions = [];
        let id = 0;

        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                positions.push({
                    x: offsetX + c * (cardWidth + marginX),
                    y: offsetY + r * (cardHeight + marginY),
                    delay: ++id * 100,
                    scale: scaleFactor,
                });
            }
        }

        Phaser.Utils.Array.Shuffle(positions);
        return positions;
    }

    handleResize() {
        const positions = this.getCardsPosition();
        this.cards.forEach((card, index) => {
            const position = positions[index];
            if (position) {
                card.positionX = position.x;
                card.positionY = position.y;
                card.baseScale = position.scale;
                this.tweens.add({
                    targets: card,
                    x: position.x,
                    y: position.y,
                    scaleX: position.scale,
                    scaleY: position.scale,
                    duration: 300,
                });
            }
        });
    }

    initCards() {
        const positions = this.getCardsPosition();
        this.cards.forEach((card, index) => {
            const position = positions[index];
            if (position) {
                card.init(
                    position.x,
                    position.y,
                    position.delay,
                    position.scale
                );
            }
        });
    }

    createCards() {
        for (const card of CARDS) {
            for (let i = 0; i < ROWS; i++) {
                this.cards.push(new Card(this, card));
            }
        }
        this.initCards();
        this.input.on("gameobjectdown", this.onCardClicked, this); ///Assign Card object with a onCardClicked function
    }

    ////Lets Render it
    create() {
        const bg = this.add.image(0, 0, "background").setOrigin(0, 0);
        bg.setDisplaySize(this.scale.width, this.scale.height);
        this.createCards();
        this.start();
        // Add resize listener
        this.scale.on("resize", this.handleResize, this);

        if (this.playerCount === 1) {
            //Create a Score Tracker
            this.player1Score = this.add
                .text(this.scale.width / 2, 50, "Matched: " + 0, {
                    fontFamily: "Arial Black",
                    fontSize: 38,
                    color: "#ffffff",
                    stroke: "#000000",
                    strokeThickness: 8,
                    align: "center",
                })
                .setOrigin(0.5)
                .setDepth(100);
        } else {
            this.player1Score = this.add
                .text(100, 50, "P1 Matched: " + 0, {
                    fontFamily: "Arial Black",
                    fontSize: 38,
                    color: "#ffffff",
                    stroke: "#000000",
                    strokeThickness: 8,
                    align: "center",
                })
                .setOrigin(0.5)
                .setDepth(100);
            this.player2Score = this.add
                .text(this.scale.width - 200, 50, "P2 Matched: " + 0, {
                    fontFamily: "Arial Black",
                    fontSize: 38,
                    color: "#ffffff",
                    stroke: "#000000",
                    strokeThickness: 8,
                    align: "center",
                })
                .setOrigin(0.5)
                .setDepth(100);
        }
    }
}
