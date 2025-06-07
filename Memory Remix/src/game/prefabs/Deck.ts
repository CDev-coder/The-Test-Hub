import { IShuffleGameScene } from "../interfaces/shuffleInterface";
import { Game } from "../scenes/Game";
import { CARDS_ARRAY } from "../utils/constants";
import Card from "./Cards";

export class Deck implements IShuffleGameScene {
    private game: Game;
    public cards: Card[] = [];
    openCardCount: number = 0;

    constructor(game: Game) {
        this.game = game;
    }

    initCards() {
        const positions = this.game.getCardsPosition();
        this.cards.forEach((card, index) => {
            const position = positions[index];
            if (position) {
                card.init(
                    position.x,
                    position.y,
                    position.delay,
                    position.scale
                );

                // Debug text (remove in production)
                const debugText = this.game.add
                    .text(position.x, position.y, `${card.value}`, {
                        fontSize: "24px",
                        color: "#ff0000",
                    })
                    .setOrigin(0.5)
                    .setDepth(100);
                this.game.time.delayedCall(2000, () => debugText.destroy());
            }
        });
    }

    createCards() {
        console.log("CREATE CARDS_ARRAY-");
        // Clear any existing cards first
        this.clean_cards();

        // Create pairs for each card value (2 cards per value)
        const cardsToCreate: number[] = [];
        for (const cardValue of CARDS_ARRAY) {
            cardsToCreate.push(cardValue, cardValue); // Add two cards for each value
        }

        // Verify we have the right number of cards for our grid
        if (
            cardsToCreate.length !==
            this.game.configSetting.columns * this.game.configSetting.rows
        ) {
            console.error(
                `Card count mismatch! Have ${cardsToCreate.length} cards for ${
                    this.game.configSetting.columns *
                    this.game.configSetting.rows
                } grid positions`
            );
            return;
        }

        // Shuffle the card values before creating card objects
        Phaser.Utils.Array.Shuffle(cardsToCreate);

        // Create card objects for each value
        cardsToCreate.forEach((cardValue) => {
            const cardObj = new Card(this.game, cardValue);
            this.cards.push(cardObj);

            // Set up click handler
            cardObj.on("pointerdown", () => {
                this.game.onCardClicked(cardObj);
            });
        });

        this.initCards(); // Position all cards
    }

    clean_cards() {
        this.game.tweens.killAll();
        // Clean up any existing timer
        this.game.timeAttackManager?.destroy();

        this.cards.forEach((card) => {
            card.destroy();
        });
        this.cards.length = 0;
    }

    reshuffle() {
        this.game.canClick = false;
        // Close any open card first
        if (this.game.openedCard) {
            this.game.openedCard.closeCard();
            this.game.openedCard = null;
        }
        // Get only closed cards and their current positions
        const closedCards = this.cards.filter((card) => !card.isOpened);
        const currentPositions = closedCards.map((card) => ({
            x: card.positionX,
            y: card.positionY,
            scale: card.baseScale,
        }));
        this.game.cameras.main.shake(300, 0.01);
        // Shuffle only the positions (not the cards themselves)
        Phaser.Utils.Array.Shuffle(currentPositions);

        // Animate closed cards to new positions
        closedCards.forEach((card, index) => {
            const newPos = currentPositions[index];

            // Update card's internal position tracking
            card.positionX = newPos.x;
            card.positionY = newPos.y;
            card.baseScale = newPos.scale;

            // Only animate if the position actually changed
            if (card.x !== newPos.x || card.y !== newPos.y) {
                this.game.tweens.add({
                    targets: card,
                    x: newPos.x,
                    y: newPos.y,
                    duration: 500,
                    ease: "Power2",
                });
            }
        });
        this.game.canClick = true;
    }

    create() {
        console.log("CREATING DECK OBJ");
    }

    isGameOver() {
        ////////// END GAME CHECK
        return this.openCardCount === this.cards.length / 2;
    }

    setUpCards() {
        this.cards.forEach((card) => {
            card.move();
        });
    }

    closeAll() {
        this.cards.forEach((card) => {
            card.closeCard();
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
                this.game.tweens.add({
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

    getCardsPosition(): {
        x: number;
        y: number;
        delay: number;
        scale: number;
    }[] {
        const marginX =
            this.game.configSetting.marginX *
            this.game.configSetting.marginFactor;
        const marginY =
            this.game.configSetting.marginY *
            this.game.configSetting.marginFactor;

        const maxGridWidth =
            this.game.scale.width * this.game.configSetting.widthMultiplier;
        const maxGridHeight =
            this.game.scale.height * this.game.configSetting.heightMultiplier;

        // Real image size
        const texW = 196;
        const texH = 306;

        // Grid size in raw pixels (before scaling)
        const rawGridWidth =
            this.game.configSetting.columns * texW +
            (this.game.configSetting.columns - 1) * marginX;
        const rawGridHeight =
            this.game.configSetting.rows * texH +
            (this.game.configSetting.rows - 1) * marginY;

        // Compute max scale that fits screen
        const scaleFactor = Math.min(
            maxGridWidth / rawGridWidth,
            maxGridHeight / rawGridHeight,
            1 // never upscale
        );

        // Actual size after scaling
        const cardWidth = texW * scaleFactor;
        const cardHeight = texH * scaleFactor;
        const scaledMarginX = marginX * scaleFactor;
        const scaledMarginY = marginY * scaleFactor;

        // Centered offset
        const gridWidth =
            this.game.configSetting.columns * cardWidth +
            (this.game.configSetting.columns - 1) * scaledMarginX;
        const gridHeight =
            this.game.configSetting.rows * cardHeight +
            (this.game.configSetting.rows - 1) * scaledMarginY;
        const offsetX = (this.game.scale.width - gridWidth) / 2 + cardWidth / 2;
        const offsetY =
            (this.game.scale.height - gridHeight) / 2 + cardHeight / 2;

        // Build the position list
        const positions = [];
        let id = 0;

        for (let r = 0; r < this.game.configSetting.rows; r++) {
            for (let c = 0; c < this.game.configSetting.columns; c++) {
                positions.push({
                    x: offsetX + c * (cardWidth + scaledMarginX),
                    y: offsetY + r * (cardHeight + scaledMarginY),
                    delay: ++id * 100,
                    scale: scaleFactor,
                });
            }
        }

        Phaser.Utils.Array.Shuffle(positions);
        return positions;
    }
}
