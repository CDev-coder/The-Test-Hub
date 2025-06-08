import Card from "../prefabs/Cards";
import { Scene } from "phaser";

export interface IShuffleGameScene extends Scene {
    openedCard: Card | null; //Access the Game's returned openedCard object
    cards: Card[]; //Access the Game's returned card object
    //reshuffle(): void; //Accesses the Game reshuffle function
}
