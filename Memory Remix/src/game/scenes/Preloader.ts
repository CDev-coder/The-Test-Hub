import { Scene } from "phaser";

export class Preloader extends Scene {
    constructor() {
        super("Preloader");
    }

    init() {
        //  We loaded this image in our Boot Scene, so we can display it here
        this.add.image(
            window.innerWidth / 2,
            window.innerHeight / 2,
            "background"
        );
    }

    preload() {
        this.load.setPath("assets"); //Assign a path pre fix.
        this.load.image("card", "GlitchCard_Back.png");
        this.load.image("card1", "GlitchCard_1.png");
        this.load.image("card2", "GlitchCard_2.png");
        this.load.image("card3", "GlitchCard_3.png");
        this.load.image("card4", "GlitchCard_4.png");
        this.load.image("card5", "GlitchCard_5.png");
    }

    create() {
        this.scene.start("MainMenu");
    }
}
