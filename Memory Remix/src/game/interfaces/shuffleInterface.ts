import { Scene } from "phaser";
import Card from "../prefabs/Cards";

export interface IShuffleGameScene extends Scene {
    cards: Card[];
    reshuffle(): void;
}
