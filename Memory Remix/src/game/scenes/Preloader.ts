import { Scene } from "phaser";

export class Preloader extends Scene {
    debugMode: boolean = false;
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

    async preload() {
        this.load.setPath("assets"); //Assign a path pre fix.
        this.load.image("card", "GlitchCard_Back.png");
        this.load.image("card1", "GlitchCard_1.png");
        this.load.image("card2", "GlitchCard_2.png");
        this.load.image("card3", "GlitchCard_3.png");
        this.load.image("card4", "GlitchCard_4.png");
        this.load.image("card5", "GlitchCard_5.png");
        this.load.image("card6", "GlitchCard_6.png");
        this.load.image("card7", "GlitchCard_7.png");
        this.load.image("card8", "GlitchCard_8.png");
        this.load.image("card9", "GlitchCard_9.png");
        this.load.image("card10", "GlitchCard_10.png");
        await this.loadFonts();
    }

    async loadFonts() {
        try {
            const orbitron = new FontFace(
                "Orbitron",
                "url(https://fonts.gstatic.com/s/orbitron/v25/yMJMMIlzdpvBhQQL_SC3X9yhF25-T1nyKS6xpmIyXjU1pg.woff2)"
            );

            const shareTech = new FontFace(
                "Share Tech Mono",
                "url(https://fonts.gstatic.com/s/sharetechmono/v15/J7aHnp1uDWRBEqV98dVQztYldFcLowEF.woff2)"
            );

            await Promise.all([orbitron.load(), shareTech.load()]);

            document.fonts.add(orbitron);
            document.fonts.add(shareTech);

            // Store in game registry for other scenes
            this.game.registry.set("fontsLoaded", true);
        } catch (error) {
            console.error("Font loading failed:", error);
            this.game.registry.set("fontsLoaded", false);
        }
    }

    create() {
        const devSkipToGame = this.debugMode;
        if (devSkipToGame) {
            this.time.delayedCall(500, () => {
                this.scene.start("Game", {
                    gameMode: "Time",
                    playerCount: 2,
                });
            });
        } else {
            this.scene.start("MainMenu");
        }
    }
}
