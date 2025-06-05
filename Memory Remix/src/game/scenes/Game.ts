import { Scene } from "phaser";
import {
    CARDS_ARRAY,
    COLS_DEKSTOP,
    COLS_MOBILE,
    ROWS_DEKSTOP,
    ROWS_MOBILE,
    TIMEOUT,
} from "../utils/constants";
import Card from "../prefabs/Cards";
import { Modal } from "../prefabs/Modal";
import { TimeAttackManager } from "../modes/TimeAttackManager";
import { ShuffleCount } from "../modes/ShuffleCount";

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
    canClick: boolean = true;
    modal: Modal;
    timeAttackManager?: TimeAttackManager;
    shuffleCount?: ShuffleCount;
    isMobile: boolean = false;
    configSetting: {
        widthMultiplier: number;
        heightMultiplier: number;
        marginX: number;
        marginY: number;
        marginFactor: number;
        rows: number;
        columns: number;
    };

    endGameRule: () => void = () => {};

    constructor() {
        super("Game");
    }

    init(data: { gameMode?: string; playerCount?: number }) {
        //Used for initializing data, receiving scene parameters.
        this.gameMode = data.gameMode || "Quick";
        this.playerCount = data.playerCount || 1;
        //console.log(`Starting game with gameMode: ${this.gameMode}`);
        // console.log(`Player count: ${this.playerCount}`);
        this.isMobile = this.scale.width < 768; // Common mobile breakpoint
        this.configSetting = this.isMobile
            ? {
                  widthMultiplier: 0.85,
                  heightMultiplier: 0.75,
                  marginX: 15,
                  marginY: 20,
                  marginFactor: 0.8,
                  rows: ROWS_DEKSTOP,
                  columns: COLS_DEKSTOP,
              }
            : {
                  widthMultiplier: 0.9,
                  heightMultiplier: 0.7,
                  marginX: 20,
                  marginY: 30,
                  marginFactor: 1,
                  rows: ROWS_MOBILE,
                  columns: COLS_MOBILE,
              };
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
        this.load.image("card6", "card6.png");
        this.load.image("card7", "card7.png");
        this.load.image("card8", "card8.png");
        this.load.image("card9", "card9.png");
        this.load.image("card10", "card10.png");
    }

    setUpCards() {
        this.cards.forEach((card) => {
            card.move();
        });
    }

    beginGame() {
        console.log("CALLING beginGame");
        this.openCardCount = 0;
        this.player1CardCount = 0;
        this.player2CardCount = 0;
        this.canClick = true;
        this.timeout = TIMEOUT;
        console.log("CALLING setUpCards");
        this.setUpCards();
        this.cards.forEach((card) => {
            card.closeCard();
        });
    }

    retryGame() {
        this.timeAttackManager?.reset();
        this.clean_cards();
        this.scene.restart();
    }

    exitGame() {
        this.clean_cards();
        this.scene.start("MainMenu");
    }

    onCardClicked(card: Card) {
        // The first condition checks if the clicked card (card) is already open (card.isOpened). If so, the function returns false to prevent any further actions.
        if (card.isOpened) {
            return false;
        }
        if (!this.canClick) {
            return false;
        }
        /////
        if (this.openedCard) {
            if (this.openedCard.value === card.value) {
                console.log("MATCHED");
                this.openedCard = null;
                this.pastCard = null;
                this.updateScore();
            } else {
                console.log("DONT MATCHED");
                this.canClick = false;
                // If the cards don’t match, the previous card (this.openedCard) is closed by calling this.openedCard.closeCard(), and openedCard is updated to reference the newly clicked card.
                this.time.delayedCall(1000, () => {
                    if (this.openedCard) {
                        this.openedCard.closeCard();
                        this.openedCard = null;
                        this.canClick = true;
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
        this.checkGameMode();
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
        this.isGameOver();
    }

    getCardsPosition(): {
        x: number;
        y: number;
        delay: number;
        scale: number;
    }[] {
        const marginX =
            this.configSetting.marginX * this.configSetting.marginFactor;
        const marginY =
            this.configSetting.marginY * this.configSetting.marginFactor;

        const maxGridWidth =
            this.scale.width * this.configSetting.widthMultiplier;
        const maxGridHeight =
            this.scale.height * this.configSetting.heightMultiplier;

        // Real image size
        const texW = 196;
        const texH = 306;

        // Grid size in raw pixels (before scaling)
        const rawGridWidth =
            this.configSetting.columns * texW +
            (this.configSetting.columns - 1) * marginX;
        const rawGridHeight =
            this.configSetting.rows * texH +
            (this.configSetting.rows - 1) * marginY;

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
            this.configSetting.columns * cardWidth +
            (this.configSetting.columns - 1) * scaledMarginX;
        const gridHeight =
            this.configSetting.rows * cardHeight +
            (this.configSetting.rows - 1) * scaledMarginY;
        const offsetX = (this.scale.width - gridWidth) / 2 + cardWidth / 2;
        const offsetY = (this.scale.height - gridHeight) / 2 + cardHeight / 2;

        // Build the position list
        const positions = [];
        let id = 0;

        for (let r = 0; r < this.configSetting.rows; r++) {
            for (let c = 0; c < this.configSetting.columns; c++) {
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

    checkGameMode() {
        console.log("CHECKING GAME MODE");
        switch (this.gameMode) {
            case "Time":
                if (
                    this.openedCard != null &&
                    this.timeAttackManager &&
                    !this.timeAttackManager.active
                ) {
                    this.timeAttackManager.start();
                    this.endGameRule = () => this.endTimeAttack();
                }
                break;
            case "Quick":
                this.endGameRule = () => this.endQuickPlay();
                break;
            case "Shuffle":
                if (this.shuffleCount) {
                    this.shuffleCount.trackAttempt();
                }
                this.endGameRule = () => this.endQuickPlay();
                break;
            default:
                console.log("DEFAULT IS ALREADY SET");
                break;
        }
    }

    isGameOver() {
        ////////// END GAME CHECK
        if (this.openCardCount === this.cards.length / 2) {
            this.endGameRule();
        }
    }

    endQuickPlay() {
        this.time.delayedCall(1500, () => {
            this.modal.show_retryMenu(
                () => {
                    this.retryGame();
                },
                () => {
                    this.exitGame();
                }
            );
        });
    }

    endTimeAttack() {
        this.timeAttackManager?.end();

        const getTextResult = () => {
            if (this.playerCount == 1) {
                return `Your Time is ${this.timeAttackManager?.lastTimerText} seconds`;
            } else {
                if (this.player1CardCount > this.player2CardCount) {
                    return `Player 1's is the Winner`;
                } else if (this.player1CardCount < this.player2CardCount) {
                    return `Player 2's is the Winner`;
                } else {
                    return "DRAW";
                }
            }
        };

        this.modal.show_retryMenu(
            () => {
                this.retryGame();
            },
            () => {
                this.exitGame();
            },
            getTextResult()
        );
    }

    reshuffle() {
        this.canClick = false;
        // Close any open card first
        if (this.openedCard) {
            this.openedCard.closeCard();
            this.openedCard = null;
        }
        // Get only closed cards and their current positions
        const closedCards = this.cards.filter((card) => !card.isOpened);
        const currentPositions = closedCards.map((card) => ({
            x: card.positionX,
            y: card.positionY,
            scale: card.baseScale,
        }));
        this.cameras.main.shake(300, 0.01);
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
                this.tweens.add({
                    targets: card,
                    x: newPos.x,
                    y: newPos.y,
                    duration: 500,
                    ease: "Power2",
                });
            }
        });
        this.canClick = true;
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

                // Debug text (remove in production)
                const debugText = this.add
                    .text(position.x, position.y, `${card.value}`, {
                        fontSize: "24px",
                        color: "#ff0000",
                    })
                    .setOrigin(0.5)
                    .setDepth(100);
                this.time.delayedCall(2000, () => debugText.destroy());
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
            this.configSetting.columns * this.configSetting.rows
        ) {
            console.error(
                `Card count mismatch! Have ${cardsToCreate.length} cards for ${
                    this.configSetting.columns * this.configSetting.rows
                } grid positions`
            );
            return;
        }

        // Shuffle the card values before creating card objects
        Phaser.Utils.Array.Shuffle(cardsToCreate);

        // Create card objects for each value
        cardsToCreate.forEach((cardValue) => {
            const cardObj = new Card(this, cardValue);
            this.cards.push(cardObj);

            // Set up click handler
            cardObj.on("pointerdown", () => {
                this.onCardClicked(cardObj);
            });
        });

        this.initCards(); // Position all cards
    }

    clean_cards() {
        this.tweens.killAll();
        // Clean up any existing timer
        this.timeAttackManager?.destroy();

        this.cards.forEach((card) => {
            card.destroy();
        });
        this.cards.length = 0;
    }

    ////Lets Render it
    create() {
        ///Called automatically by Phaser after all assets are loaded.
        console.log("CREATE THE CREATE");
        const bg = this.add.image(0, 0, "background").setOrigin(0, 0);
        bg.setDisplaySize(this.scale.width, this.scale.height);
        this.createCards();
        this.beginGame();
        this.modal = new Modal(this, this.scale.width, this.scale.height);

        if (this.gameMode === "Time") {
            this.timeAttackManager = new TimeAttackManager(
                this,
                this.isMobile,
                30000
            );
            this.timeAttackManager.createTimerText();
            this.timeAttackManager.events.on("timeup", () => {
                this.endTimeAttack();
            });
        }

        if (this.gameMode === "Shuffle") {
            this.shuffleCount = new ShuffleCount(this, this.isMobile, () =>
                this.reshuffle()
            );
            this.shuffleCount.createCountdown();
        }

        if (this.gameMode === "Quick") {
            this.add
                .text(this.scale.width / 2, 30, "Quick Play Mode ", {
                    fontFamily: "Orbitron",
                    fontSize: this.isMobile ? "24px" : "38px",
                    color: "#ffff00",
                    stroke: "#000000",
                    strokeThickness: 8,
                    align: "center",
                })
                .setOrigin(0.5);
        }

        if (this.playerCount === 1) {
            //Create a Score Tracker
            this.player1Score = this.add
                .text(
                    this.scale.width / 2,
                    this.isMobile
                        ? this.scale.height - 75
                        : this.scale.height - 100,
                    "Matched: " + 0,
                    {
                        fontFamily: "Orbitron",
                        fontSize: this.isMobile ? "22px" : "30px",
                        color: "#ffffff",
                        stroke: "#000000",
                        strokeThickness: 8,
                        align: "center",
                    }
                )
                .setOrigin(0.5)
                .setDepth(100);
        } else {
            this.player1Score = this.add
                .text(
                    this.isMobile ? 75 : 170,
                    this.isMobile ? 90 : 50,
                    "P1 Matched: " + 0,
                    {
                        fontFamily: "Orbitron",
                        fontSize: this.isMobile ? 18 : 30,
                        color: "#ffffff",
                        stroke: "#000000",
                        strokeThickness: 8,
                        align: "center",
                    }
                )
                .setOrigin(0.5)
                .setDepth(100);
            this.player2Score = this.add
                .text(
                    this.isMobile
                        ? this.scale.width - 75
                        : this.scale.width - 200,
                    this.isMobile ? 90 : 50,
                    "P2 Matched: " + 0,
                    {
                        fontFamily: "Orbitron",
                        fontSize: this.isMobile ? 18 : 30,
                        color: "#ffffff",
                        stroke: "#000000",
                        strokeThickness: 8,
                        align: "center",
                    }
                )
                .setOrigin(0.5)
                .setDepth(100);
        }

        ////////////Main Menu Button
        this.add
            .text(this.scale.width / 2, this.scale.height - 25, "Main Menu", {
                fontSize: this.isMobile ? "26px" : "38px",
                color: "#ffffff",
                backgroundColor: "#333333",
                padding: { x: 20, y: 10 },
            })
            .setOrigin(0.5)
            .setInteractive()
            .on("pointerup", () => {
                this.exitGame();
            });

        ////////////////RESIZE
        this.scale.on("resize", this.handleResize, this);
        this.handleResize();
    }

    //We can hook into the update(time, delta), but since we don't need to check for frame inputs
    //i.e collisions physics or pixel flickering in this project, we don't have to use it here.
}
