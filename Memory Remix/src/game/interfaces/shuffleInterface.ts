import Card from "../prefabs/Cards";

export interface IShuffleGameScene {
    cards: Card[];
    reshuffle(): void;
}
