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
                card.gridCell = position.cellId; // ← Assign unique ID
            }
        });
    }

    createCards() {
        console.log("CREATE CARDS_ARRAY-");
        this.clean_cards();

        const cardsToCreate: number[] = [];
        for (const cardValue of CARDS_ARRAY) {
            cardsToCreate.push(cardValue, cardValue);
        }

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

        Phaser.Utils.Array.Shuffle(cardsToCreate);

        cardsToCreate.forEach((cardValue) => {
            const cardObj = new Card(this.game, cardValue);
            this.cards.push(cardObj);
            cardObj.on("pointerdown", () => this.onCardClicked(cardObj));
        });

        this.initCards();
    }

    clean_cards() {
        console.log("DECK clean_cards");
        this.game.tweens.killAll();
        this.game.timeAttackManager?.destroy();

        this.cards.forEach((card) => {
            card.destroy();
        });
        this.cards.length = 0;
    }

    reshuffle() {
        this.canClick = false;

        if (this.openedCard) {
            this.openedCard.closeCard();
            this.openedCard = null;
        }

        const openCards = this.cards.filter((c) => c.isOpened);
        const closedCards = this.cards.filter((c) => !c.isOpened);

        const allPositions = this.getCardsPosition(); // Each has cellId
        const blocked = new Set(openCards.map((c) => c.gridCell));
        let availablePositions = allPositions.filter(
            (p) => !blocked.has(p.cellId)
        );
        Phaser.Utils.Array.Shuffle(availablePositions);

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

        const used = new Set(blocked);

        closedCards.forEach((card) => {
            const pos = availablePositions.find((p) => !used.has(p.cellId));
            if (!pos) {
                console.warn("No available position for card:", card);
                return;
            }

            used.add(pos.cellId);
            availablePositions = availablePositions.filter(
                (p) => p.cellId !== pos.cellId
            );

            card.positionX = pos.x;
            card.positionY = pos.y;
            card.baseScale = pos.scale;

            this.game.tweens.add({
                targets: card,
                x: pos.x,
                y: pos.y,
                duration: 500,
                ease: "Power2",
                onComplete: () => {
                    card.gridCell = pos.cellId;
                },
            });
        });

        this.game.cameras.main.shake(300, 0.01);
        this.canClick = true;
    }

    isGameOver() {
        const isGameOver = this.openCardCount === this.cards.length / 2;
        if (isGameOver) {
            this.resetCardCount();
        }
        return isGameOver;
    }

    setUpCards() {
        this.openCardCount = 0;
        this.cards.forEach((card) => card.move());
        this.canClick = true;
    }

    updatedCardCount() {
        this.openCardCount++;
    }

    resetCardCount() {
        this.openCardCount = 0;
    }

    closeAll() {
        this.cards.forEach((card) => card.closeCard());
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
                    onComplete: () => {
                        card.gridCell = position.cellId;
                    },
                });
            }
        });
    }

    getCardsPosition(): {
        x: number;
        y: number;
        delay: number;
        scale: number;
        cellId: string;
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

        const texW = 196;
        const texH = 306;

        const rawGridWidth =
            this.game.configSetting.columns * texW +
            (this.game.configSetting.columns - 1) * marginX;
        const rawGridHeight =
            this.game.configSetting.rows * texH +
            (this.game.configSetting.rows - 1) * marginY;

        const scaleFactor = Math.min(
            maxGridWidth / rawGridWidth,
            maxGridHeight / rawGridHeight,
            1
        );

        const cardWidth = texW * scaleFactor;
        const cardHeight = texH * scaleFactor;
        const scaledMarginX = marginX * scaleFactor;
        const scaledMarginY = marginY * scaleFactor;

        const gridWidth =
            this.game.configSetting.columns * cardWidth +
            (this.game.configSetting.columns - 1) * scaledMarginX;
        const gridHeight =
            this.game.configSetting.rows * cardHeight +
            (this.game.configSetting.rows - 1) * scaledMarginY;
        const offsetX = (this.game.scale.width - gridWidth) / 2 + cardWidth / 2;
        const offsetY =
            (this.game.scale.height - gridHeight) / 2 + cardHeight / 2;

        const positions = [];
        let id = 0;

        for (let r = 0; r < this.game.configSetting.rows; r++) {
            for (let c = 0; c < this.game.configSetting.columns; c++) {
                positions.push({
                    x: offsetX + c * (cardWidth + scaledMarginX),
                    y: offsetY + r * (cardHeight + scaledMarginY),
                    delay: ++id * 100,
                    scale: scaleFactor,
                    cellId: `${r}_${c}`, // unique cell identifier
                });
            }
        }

        return positions;
    }

    onCardClicked(card: Card) {
        if (card.isOpened || !this.canClick) return false;

        card.openCard();
        this.game.checkCardOpenRule();

        if (this.openedCard) {
            if (this.openedCard.value === card.value) {
                this.openedCard = null;
                this.game.checkMatchedRule();
            } else {
                this.canClick = false;
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
            this.openedCard = card;
        }
    }
}
