import { Scene } from "phaser";
import {
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
import { TurnIndicator } from "../prefabs/TurnIndicator";
import { Deck } from "../prefabs/Deck";

export class Game extends Scene {
    background: Phaser.GameObjects.Image;
    player1CardCount: number = 0;
    player2CardCount: number = 0;
    timeout: any;
    playerTurn: number = 1;
    player1Score: Phaser.GameObjects.Text;
    player2Score: Phaser.GameObjects.Text;
    gameMode: string = "Quick"; // Default value
    playerCount: number = 1;
    modal: Modal;
    timeAttackManager?: TimeAttackManager;
    remixManager?: ShuffleCount;
    turnIndicator?: TurnIndicator;
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
    deckManager: Deck;
    endGameRule: () => void = () => {};

    constructor() {
        super("Game");
    }

    init(data: { gameMode?: string; playerCount?: number; isMobile: boolean }) {
        //Used for initializing data, receiving scene parameters.
        this.gameMode = data.gameMode || "Quick";
        this.playerCount = data.playerCount || 1;
        this.isMobile = this.scale.width < 768 || data.isMobile; //Make a default incase the MainMenu gets bypassed
        this.deckManager = new Deck(this);
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

    /* CARD FUNCTIONS */
    get cards(): Card[] {
        return this.deckManager.cards; // A get function for the IShuffleGameScene.cards
    }

    get openedCard(): Card | null {
        return this.deckManager.openedCard; // A get function for the IShuffleGameScene.cards
    }

    reshuffle() {
        this.deckManager.reshuffle(); ///Allows the IShuffleGameScene access to another object's function
    }

    /* INITIAL GAME */
    beginGame() {
        this.playerTurn = 1;
        this.player1CardCount = 0;
        this.player2CardCount = 0;
        this.timeout = TIMEOUT;
        this.deckManager.setUpCards();
        this.deckManager.closeAll();
    }

    setGameMode() {
        this.turnIndicator = new TurnIndicator(this, this.isMobile);
        switch (this.gameMode) {
            case "Time":
                this.timeAttackManager = new TimeAttackManager(
                    this,
                    this.isMobile,
                    30,
                    this.playerCount
                );
                this.timeAttackManager.createTimerText();
                this.timeAttackManager.events.on("timeup", () => {
                    this.endTimeAttack();
                });
                if (this.playerCount === 2) {
                    this.turnIndicator.display("Player 1 START", 500, () => {});
                } else {
                    this.turnIndicator.display("GAME START", 500, () => {});
                }
                this.endGameRule = () => this.endTimeAttack();
                break;
            case "Quick":
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
                this.endGameRule = () => this.endQuickPlay();
                if (this.playerCount === 2) {
                    this.turnIndicator.display("Player 1 START", 500, () => {});
                } else {
                    this.turnIndicator.display("GAME START", 500, () => {});
                }
                break;
            case "Shuffle":
                this.remixManager = new ShuffleCount(this, this.isMobile, () =>
                    this.deckManager.reshuffle()
                );
                this.remixManager.createCountdown();
                this.endGameRule = () => this.endRemixMode();
                if (this.playerCount === 2) {
                    this.turnIndicator.display("Player 1 START", 500, () => {});
                } else {
                    this.turnIndicator.display("GAME START", 500, () => {});
                }
                break;
            default:
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
                this.endGameRule = () => this.endQuickPlay();
                if (this.playerCount === 2) {
                    this.turnIndicator.display("Player 1 START", 500, () => {});
                } else {
                    this.turnIndicator.display("GAME START", 500, () => {});
                }
                break;
        }
    }

    setPlayerCountDisplay() {
        if (this.playerCount === 1) {
            //Create a Score Tracker
            this.player1Score = this.add
                .text(
                    this.scale.width / 2,
                    this.isMobile ? 90 : 100,
                    "Matched: " + 0,
                    {
                        fontFamily: "Share Tech Mono",
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
                    this.isMobile ? 70 : 170,
                    this.isMobile ? 90 : 50,
                    "P1 Matched: " + 0,
                    {
                        fontFamily: "Share Tech Mono",
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
                        ? this.scale.width - 70
                        : this.scale.width - 200,
                    this.isMobile ? 90 : 50,
                    "P2 Matched: " + 0,
                    {
                        fontFamily: "Share Tech Mono",
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
    }

    checkMatchedRule() {
        console.log("checkMatchedRule");
        this.deckManager.updatedCardCount();
        if (this.gameMode == "Shuffle") this.remixManager?.triggerShuffle();

        ///////UPDATE PLAYERS SCORE
        if (this.playerCount === 2) {
            if (this.playerTurn === 1) {
                this.player1CardCount++;
                this.player1Score.setText(
                    "P1 Matched: " + this.player1CardCount
                );
            } else {
                this.player2CardCount++;
                this.player2Score.setText(
                    "P2 Matched: " + this.player2CardCount
                );
            }
        } else {
            this.player1Score.setText(
                "Matched: " + this.deckManager.openCardCount
            );
        }
        const isGameOver = this.deckManager?.isGameOver();
        if (isGameOver) {
            this.endGameRule();
        }
    }

    checkUnMatchedRule() {
        switch (this.gameMode) {
            case "Quick":
            case "Shuffle":
                if (this.gameMode == "Shuffle") {
                    this.remixManager?.triggerShuffle();
                }
                if (this.playerCount === 2) {
                    if (this.playerTurn == 1) {
                        this.turnIndicator?.display("Player 2", 500, () => {
                            this.playerTurn = 2;
                            this.deckManager.canClick = true;
                        });
                    } else {
                        this.turnIndicator?.display("Player 1", 500, () => {
                            this.playerTurn = 1;
                            this.deckManager.canClick = true;
                        });
                    }
                } else {
                    this.deckManager.canClick = true;
                }
                break;
            case "Time":
            default:
                this.deckManager.canClick = true;
                break;
        }
    }

    checkCardOpenRule() {
        switch (this.gameMode) {
            case "Time":
                if (!this.timeAttackManager?.active) {
                    this.timeAttackManager?.start();
                }
                break;
            case "Shuffle":
                this.remixManager?.trackAttempt();
                break;
            case "Quick":
            default:
                break;
        }
    }

    /* END OF GAME RULES */
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
        console.log("endTimeAttack");
        this.timeAttackManager?.end();
        this.timeAttackManager?.reset();
        if (this.playerCount == 1) {
            this.modal.show_retryMenu(
                () => {
                    this.retryGame();
                },
                () => {
                    this.exitGame();
                },
                `Your Time is ${this.timeAttackManager?.lastTimerText}`
            );
        } else {
            if (this.playerTurn == 1) {
                this.timeAttackManager?.capturePlayerOneTime();
                this.timeAttackManager?.switchPlayers(2);
                this.turnIndicator?.display("Player 2", 500, () => {
                    this.playerTurn = 2;
                });
                this.deckManager.closeAll();
                this.deckManager.reshuffle();
            }
            if (this.playerTurn == 2) {
                this.timeAttackManager?.capturePlayerTwoTime();
                this.timeAttackManager?.stopTimer();
                const getTextResult = () => {
                    const timeResults = this.timeAttackManager?.getWinner();
                    return timeResults;
                };

                this.time.delayedCall(1000, () => {
                    this.modal.show_retryMenu(
                        () => {
                            this.retryGame();
                        },
                        () => {
                            this.exitGame();
                        },
                        getTextResult()
                    );
                });
            }
        }
    }

    endRemixMode() {
        if (this.playerCount == 1) {
            this.modal.show_retryMenu(
                () => {
                    this.retryGame();
                },
                () => {
                    this.exitGame();
                },
                `GAME OVER`
            );
        } else {
            const getTextResult = () => {
                if (this.player1CardCount > this.player2CardCount) {
                    return `Player 1's is the Winner`;
                } else if (this.player1CardCount < this.player2CardCount) {
                    return `Player 2's is the Winner`;
                } else {
                    return "DRAW";
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
    }

    retryGame() {
        this.deckManager.clean_cards();
        this.scene.restart();
    }

    exitGame() {
        this.deckManager.clean_cards();
        this.scene.start("MainMenu");
    }

    /* RESIZE CARDS */
    handleResize() {
        this.deckManager.handleResize(); ///Resize based on screen width
    }

    ////Lets Render it
    create() {
        ///Called automatically by Phaser after all assets are loaded.
        const bg = this.add.image(0, 0, "background").setOrigin(0, 0);
        bg.setDisplaySize(this.scale.width, this.scale.height);
        this.deckManager.createCards();
        this.beginGame();
        this.modal = new Modal(this, this.scale.width, this.scale.height);
        this.setGameMode();
        this.setPlayerCountDisplay();
        ////////////Main Menu Button
        this.add
            .text(this.scale.width / 2, this.scale.height - 25, "Main Menu", {
                fontSize: this.isMobile ? "26px" : "38px",
                fontFamily: "Share Tech Mono",
                color: "#ffffff",
                backgroundColor: "#333333",
                padding: { x: 20, y: 10 },
            })
            .setOrigin(0.5)
            .setInteractive()
            .on("pointerup", () => {
                this.exitGame();
            });

        this.add
            .text(this.scale.width / 2, this.scale.height - 70, "MIX", {
                fontSize: this.isMobile ? "26px" : "38px",
                fontFamily: "Share Tech Mono",
                color: "#ffffff",
                backgroundColor: "#333333",
                padding: { x: 20, y: 10 },
            })
            .setOrigin(0.5)
            .setInteractive()
            .on("pointerup", () => {
                this.reshuffle();
            });

        ////////////////RESIZE
        this.scale.on("resize", this.handleResize, this);
        this.handleResize();
    }

    //We can hook into the update(time, delta), but since we don't need to check for frame inputs
    //i.e collisions physics or pixel flickering in this project, we don't have to use it here.
}
