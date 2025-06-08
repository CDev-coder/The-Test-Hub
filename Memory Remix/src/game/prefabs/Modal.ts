import Phaser from "phaser";

export class Modal {
    scene: Phaser.Scene;
    container: Phaser.GameObjects.Container;
    modal_box: Phaser.GameObjects.Rectangle;
    modal_text: Phaser.GameObjects.Text;
    modal_nextButton: Phaser.GameObjects.Text;
    modal_backButton: Phaser.GameObjects.Text;

    constructor(scene: Phaser.Scene, width: number, height: number) {
        this.scene = scene;

        // Background overlay (semi-transparent)
        const overlay = scene.add
            .rectangle(width / 2, height / 2, width, height, 0x000000, 0.5)
            .setInteractive(); // block clicks below

        // Popup box
        const popupWidth = 300;
        const popupHeight = 200;
        this.modal_box = scene.add.rectangle(
            width / 2,
            height / 2,
            popupWidth,
            popupHeight,
            0xffffff
        );
        this.modal_box.setStrokeStyle(2, 0x000000);

        // Rule Text
        this.modal_text = scene.add
            .text(width / 2, height / 2 - 50, "", {
                fontFamily: "Share Tech Mono",
                fontSize: "20px",
                color: "#000",
                wordWrap: { width: popupWidth - 40 },
                align: "center",
            })
            .setOrigin(0.5);

        // Play / Next button
        this.modal_nextButton = scene.add
            .text(width / 2, height / 2 + 50, "Play", {
                fontFamily: "Share Tech Mono",
                fontSize: "24px",
                backgroundColor: "#4CAF50",
                color: "#fff",
                padding: { x: 20, y: 10 },
            })
            .setOrigin(0.5)
            .setInteractive();

        // Go back / Cancel button
        this.modal_backButton = scene.add
            .text(width / 2, height / 2, "Go back", {
                fontFamily: "Share Tech Mono",
                fontSize: "24px",
                backgroundColor: "#F44336",
                color: "#fff",
                padding: { x: 20, y: 10 },
            })
            .setOrigin(0.5)
            .setInteractive();

        // Default goBack behavior: hide modal
        this.modal_backButton.on("pointerup", () => {
            this.hideModal();
        });

        this.container = scene.add.container(0, 0, [
            overlay,
            this.modal_box,
            this.modal_text,
            this.modal_backButton,
            this.modal_nextButton,
        ]);

        this.container.setDepth(1000);
        this.container.setVisible(false);
    }

    showModal(
        text: string,
        onPlayCallback: () => void,
        playButtonText = "Play",
        goBackButtonText = "Go back"
    ) {
        this.modal_text.setText(text);
        this.modal_nextButton.setText(playButtonText);
        this.modal_backButton.setText(goBackButtonText);

        // Calculate new size & positions
        const textBounds = this.modal_text.getBounds();
        const padding = 40;
        const newPopupHeight = textBounds.height + 170;

        this.modal_box.setSize(this.modal_box.width, newPopupHeight);

        const centerY = this.scene.scale.height / 2;
        this.modal_box.setY(centerY);

        this.modal_text.setY(centerY - newPopupHeight / 2 + padding);

        this.modal_nextButton.setY(this.modal_text.y + textBounds.height + 20);
        this.modal_backButton.setY(this.modal_nextButton.y + 50);

        // Clear old listeners before adding new one for play button
        this.modal_nextButton.removeAllListeners();
        this.modal_nextButton.setInteractive().on("pointerup", () => {
            onPlayCallback();
        });

        this.container.setVisible(true);
    }

    show_retryMenu(
        onNextButtonCallBack: () => void,
        onBackButtonCallBack: () => void,
        gameOverText?: string
    ) {
        this.modal_text.setText(
            gameOverText != null ? gameOverText : "GAME OVER"
        );
        this.modal_nextButton.setText("RETRY");
        this.modal_backButton.setText("EXIT");

        // Calculate new size & positions
        const textBounds = this.modal_text.getBounds();
        const padding = 40;
        const newPopupHeight = textBounds.height + 170;

        this.modal_box.setSize(this.modal_box.width, newPopupHeight);

        const centerY = this.scene.scale.height / 2;
        this.modal_box.setY(centerY);

        this.modal_text.setY(centerY - newPopupHeight / 2 + padding);

        this.modal_nextButton.setY(this.modal_text.y + textBounds.height + 20);
        this.modal_backButton.setY(this.modal_nextButton.y + 50);

        this.modal_nextButton.removeAllListeners();
        this.modal_nextButton.setInteractive().on("pointerup", () => {
            onNextButtonCallBack();
        });
        this.modal_backButton.setInteractive().on("pointerup", () => {
            onBackButtonCallBack();
        });

        this.container.setVisible(true);
    }

    hideModal() {
        this.container.setVisible(false);
    }
}
