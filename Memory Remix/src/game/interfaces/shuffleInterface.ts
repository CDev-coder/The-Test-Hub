import Card from "../prefabs/Cards";
import { Scene } from "phaser";

export interface IShuffleGameScene extends Scene {
    cards: Card[];
    reshuffle(): void;
}
