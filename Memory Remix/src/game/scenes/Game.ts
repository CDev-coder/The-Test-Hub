import { Scene } from "phaser";
import { CARDS, COLS, ROWS, TIMEOUT } from "../utils/constants";
import Card from "../prefabs/Cards";

export class Game extends Scene {
    background: Phaser.GameObjects.Image;
    pastCard: null | Card = null;
    openedCard: null | Card = null;
    openCardCount: number;
    player1CardCount: number = 0;
    player2CardCount: number = 0;
    timeout: any;
    cards: Card[] = [];
    playerTurn: string = "Player 1";
    player1Score: Phaser.GameObjects.Text;
    player2Score: Phaser.GameObjects.Text;
    // Add these properties to hold your parameters
    gameMode: string = "Quick"; // Default value
    playerCount: number = 1;
    retryGroup: Phaser.GameObjects.Container;

    constructor() {
        super("Game");
    }

    init(data: { gameMode?: string; playerCount?: number }) {
        //Used for initializing data, receiving scene parameters.
        // Set parameters with default fallbacks
        this.gameMode = data.gameMode || "Quick";
        this.playerCount = data.playerCount || 1;
        console.log(`Starting game with gameMode: ${this.gameMode}`);
        console.log(`Player count: ${this.playerCount}`);
    }

    preload() {
        ///Useful to load just assets here
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

    beginGame() {
        console.log("CALLING beginGame");
        this.openCardCount = 0;
        this.player1CardCount = 0;
        this.player2CardCount = 0;
        this.timeout = TIMEOUT;
        //this.initCards();
        console.log("CALLING showCards");
        this.showCards();
        this.cards.forEach((card) => {
            card.closeCard();
        });
    }

    createRetryScreen() {
        const retryScreenWidth = this.scale.width;
        const retryScreenHeight = this.scale.height;

        // Background overlay
        const overlay = this.add.rectangle(
            retryScreenWidth / 2,
            retryScreenHeight / 2,
            retryScreenWidth,
            retryScreenHeight,
            0x000000,
            0.5
        );
        overlay.setInteractive(); // block clicks through the overlay

        // Popup box
        const popupWidth = 300;
        const popupHeight = 200;
        const popup = this.add.rectangle(
            retryScreenWidth / 2,
            retryScreenHeight / 2,
            popupWidth,
            popupHeight,
            0xffffff
        );
        popup.setStrokeStyle(2, 0x000000);

        const titleText = this.add
            .text(retryScreenWidth / 2, retryScreenHeight / 2 - 50, "MATCHED", {
                fontSize: "28px",
                color: "#000",
            })
            .setOrigin(0.5);

        const retryButton = this.add
            .text(retryScreenWidth / 2, retryScreenHeight / 2, "Retry", {
                fontSize: "24px",
                backgroundColor: "#4CAF50",
                color: "#fff",
                padding: { x: 20, y: 10 },
            })
            .setOrigin(0.5)
            .setInteractive();

        retryButton.on("pointerup", () => {
            console.log("RESetting");
            this.clean_cards();
            this.hide_retyMenu();
            this.scene.restart();
        });

        const exitButton = this.add
            .text(retryScreenWidth / 2, retryScreenHeight / 2 + 50, "Exit", {
                fontSize: "24px",
                backgroundColor: "#F44336",
                color: "#fff",
                padding: { x: 20, y: 10 },
            })
            .setOrigin(0.5)
            .setInteractive();

        exitButton.on("pointerup", () => {
            this.clean_cards();
            this.hide_retyMenu();
            this.scene.start("MainMenu");
        });

        this.retryGroup = this.add.container(0, 0, [
            overlay,
            popup,
            titleText,
            retryButton,
            exitButton,
        ]);

        this.retryGroup.setVisible(false); // hide by default
    }

    show_retryMenu() {
        if (this.retryGroup != null) {
            this.retryGroup.setVisible(true);
            this.retryGroup.setDepth(100); // make sure it’s on top
        }
    }

    hide_retyMenu() {
        if (this.retryGroup != null) {
            this.retryGroup.setVisible(false);
        }
    }

    onCardClicked(card: Card) {
        // The first condition checks if the clicked card (card) is already open (card.isOpened). If so, the function returns false to prevent any further actions.
        //console.log("onCardClicked this.playerTurn: " + this.playerTurn);
        if (card.isOpened) {
            return false;
        }
        if (this.openedCard) {
            if (this.openedCard.value === card.value) {
                console.log("MATCHED");
                this.openedCard = null;
                this.pastCard = null;
                this.updateScore();
            } else {
                console.log("DONT MATCHED");
                // If the cards don’t match, the previous card (this.openedCard) is closed by calling this.openedCard.closeCard(), and openedCard is updated to reference the newly clicked card.
                this.time.delayedCall(1000, () => {
                    if (this.openedCard) {
                        this.openedCard.closeCard();
                        this.openedCard = null;
                    }
                    card.closeCard();
                });
                ///////SWITCH ROLES
                if (this.playerCount === 2) {
                    if (this.playerTurn === "Player 1") {
                        this.playerTurn = "Player 2";
                    } else {
                        this.playerTurn = "Player 1";
                    }
                }
            }
        } else {
            console.log("OPENNING MOVE");
            // If no card is currently open (this.openedCard is null), the clicked card is set as openedCard.
            this.openedCard = card;
        }
        console.log("OPENNING CARD VALUE: ", card.value);
        card.openCard();
    }

    updateScore() {
        this.openCardCount++;
        console.log("updateScore this.playerTurn: " + this.playerTurn);
        ///////SWITCH ROLES
        if (this.playerCount === 2) {
            if (this.playerTurn === "Player 1") {
                console.log("P1 UPDATED");
                this.player1CardCount++;
                this.player1Score.setText(
                    "P1 Matched: " + this.player1CardCount
                );
            } else {
                console.log("P2 UPDATED");
                this.player2CardCount++;
                this.player2Score.setText(
                    "P2 Matched: " + this.player2CardCount
                );
            }
        } else {
            this.player1Score.setText("Matched: " + this.openCardCount);
        }
        ////////// END GAME CHECK
        if (this.openCardCount === this.cards.length / 2) {
            // this.beginGame();
            this.show_retryMenu();
        }
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

    reshuffle() {
        if (this.openedCard) {
            this.openedCard.closeCard(5);
            this.openedCard = null;
        }
        // Get only closed cards
        const closedCards = this.cards.filter((card) => !card.isOpened);

        // Get their current positions (we'll reuse these)
        const currentPositions = closedCards.map((card) => ({
            x: card.positionX,
            y: card.positionY,
            scale: card.baseScale,
        }));

        // Shuffle the positions
        Phaser.Utils.Array.Shuffle(currentPositions);

        // Animate cards to new positions
        closedCards.forEach((card, index) => {
            const newPos = currentPositions[index];
            card.positionX = newPos.x;
            card.positionY = newPos.y;

            this.tweens.add({
                targets: card,
                x: newPos.x,
                y: newPos.y,
                duration: 500,
                ease: "Power2",
            });
        });
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
        console.log("initCards-");
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
        console.log("CREATE CARDS-");
        // Create new cards
        for (const cardValue of CARDS) {
            for (let i = 0; i < ROWS; i++) {
                const cardObj = new Card(this, cardValue);
                this.cards.push(cardObj);

                // Set up click handler directly on the card
                cardObj.on("pointerdown", () => {
                    this.onCardClicked(cardObj); // Pass the card directly
                });
            }
        }
        this.initCards();
    }

    ////Lets Render it
    create() {
        ///Called automatically by Phaser after all assets are loaded.
        console.log("CREATE THE CREATE");
        const bg = this.add.image(0, 0, "background").setOrigin(0, 0);
        bg.setDisplaySize(this.scale.width, this.scale.height);
        this.createCards();
        this.beginGame();
        // Add resize listener
        this.scale.on("resize", this.handleResize, this);
        this.handleResize();
        this.createRetryScreen();
        //this.show_retryMenu();

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
                .text(170, 50, "P1 Matched: " + 0, {
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
        ////////////Debug button
        this.add
            .text(this.scale.width / 2, 60, "Shuffle", {
                fontSize: "32px",
                color: "#ffffff",
                backgroundColor: "#333333",
                padding: { x: 20, y: 10 },
            })
            .setOrigin(0.5)
            .setInteractive()
            .on("pointerdown", () => {
                console.log("RESHUFFLING");
                this.reshuffle();
            });
    }

    clean_cards() {
        this.tweens.killAll();
        this.cards.forEach((card) => {
            card.destroy();
        });
        this.cards.length = 0;
    }

    //We can hook into the update(time, delta), but since we don't need to check for frame inputs
    //i.e collisions physics or pixel flickering in this project, we don't have to use it here.
}
