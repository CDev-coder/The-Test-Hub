import { Game } from "../scenes/Game";
import { CARDS_ARRAY } from "../utils/constants";
import Card from "./Cards";

export class Deck {
    private game: Game;
    public cards: Card[] = [];
    canClick: boolean = true;
    openCardCount: number = 0;
    openedCard: null | Card = null;
    constructor(game: Game) {
        this.game = game;
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
                this.onCardClicked(cardObj);
            });
        });

        this.initCards(); // Position all cards
    }

    clean_cards() {
        console.log("DECK clean_cards");
        this.game.tweens.killAll();
        // Clean up any existing timer
        this.game.timeAttackManager?.destroy();

        this.cards.forEach((card) => {
            card.destroy();
        });
        this.cards.length = 0;
    }

    reshuffle() {
        this.canClick = false;
        // CLOSE ANY OPEN CARDS
        if (this.openedCard) {
            this.openedCard.closeCard();
            this.openedCard = null;
        }
        const openCards = this.cards.filter((c) => c.isOpened); //Get all the open cards on screen
        const closedCards = this.cards.filter((c) => !c.isOpened); //Get all the closed cards on screen
        ///Now compare to see which spots are avalaible.
        const allPositions = this.getCardsPosition(); // full grid
        const blocked = new Set(
            openCards.map(
                (c) => `${Math.round(c.positionX)}|${Math.round(c.positionY)}`
            )
        );
        const availablePositions = allPositions.filter(
            (p) => !blocked.has(`${Math.round(p.x)}|${Math.round(p.y)}`)
        );

        /* Safety guard: there must be exactly as many free spots as closed cards */
        if (availablePositions.length !== closedCards.length) {
            console.warn(
                "Mismatch in reshuffle():",
                availablePositions.length,
                "free cells vs",
                closedCards.length,
                "closed cards."
            );
            return;
        }
        Phaser.Utils.Array.Shuffle(availablePositions); ///Shuffle only the available spots

        //Move only the closed cards
        closedCards.forEach((card, i) => {
            const { x, y, scale } = availablePositions[i];
            card.positionX = x;
            card.positionY = y;
            card.baseScale = scale;

            if (card.x !== x || card.y !== y) {
                this.game.tweens.add({
                    targets: card,
                    x,
                    y,
                    duration: 500,
                    ease: "Power2",
                });
            }
        });

        this.game.cameras.main.shake(300, 0.01);
        this.canClick = true;
    }

    isGameOver() {
        ////////// END GAME CHECK
        return this.openCardCount === this.cards.length / 2;
    }

    setUpCards() {
        this.openCardCount = 0;
        this.cards.forEach((card) => {
            card.move();
        });
        this.canClick = true;
        //console.log("setUpCards END");
    }

    updatedCardCount() {
        this.openCardCount++;
    }

    closeAll() {
        // console.log("DECK closeAll");
        this.cards.forEach((card) => {
            card.closeCard();
        });
        //console.log("DECK closeAll END");
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

    onCardClicked(card: Card) {
        // The first condition checks if the clicked card (card) is already open (card.isOpened). If so, the function returns false to prevent any further actions.
        if (card.isOpened) {
            return false;
        }
        if (!this.canClick) {
            return false;
        }
        //console.log("OPENNING CARD VALUE: ", card.value);
        card.openCard();
        this.game.checkCardOpenRule(); //Perform the rule for a card openning
        /////Now we check if there was a previous card open
        if (this.openedCard) {
            if (this.openedCard.value === card.value) {
                //console.log("MATCHED");
                this.openedCard = null;
                this.game.checkMatchedRule();
            } else {
                //console.log("DONT MATCHED");
                this.canClick = false;
                // If the cards don’t match, the previous card (this.openedCard) is closed by calling this.openedCard.closeCard(), and openedCard is updated to reference the newly clicked card.
                this.game.time.delayedCall(1000, () => {
                    if (this.openedCard) {
                        this.openedCard.closeCard();
                        this.openedCard = null;
                    }
                    card.closeCard();
                    this.game.checkUnMatchedRule();
                });
            }
        } else {
            // If no card is currently open (this.openedCard is null), the clicked card is set as openedCard.
            this.openedCard = card;
        }
    }
}
