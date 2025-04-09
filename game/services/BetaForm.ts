import RPG from "../rpg";
import rexUI from "phaser3-rex-plugins/templates/ui/ui-plugin";


const COLOR_PRIMARY = 0x00000000;
const COLOR_LIGHT = 0xffffff;
const COLOR_DARK = 0x000000;
const SliderWidth = 20;

export class BetaForm {
  scene: RPG;
  formID: string;
  scrollablePanel?: rexUI.ScrollablePanel;
  constructor(scene: RPG, formID: string) {
    this.scene = scene;
    this.formID = formID;
    this.loadForm();
  }
  loadForm() {
    if (!this.scene.UICamera) return;
    const width = this.scene.UICamera.width * 0.8;
    const height = this.scene.UICamera.height * 0.8;
    const rexUI = (this.scene as any).rexUI as rexUI;
    this.scrollablePanel = rexUI.add.scrollablePanel({
      x: this.scene.UICamera.width / 2,
      y: 0,
      // scrollMode: 0,
      // scrollDetectionMode: 0,
      panel: {
        child: this.scene.add.dom(0, 0).createFromCache(this.formID),
      },

      space: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
      },
    });

    this.scrollablePanel.layout();
    // scroller.drawBounds(this.scene.add.graphics(), 0xff0000);
    this.scrollablePanel.setMinSize(width, height);

    // add two bottons to next and prev to move the scroll position
    var nextButton = this.scene.add.text(0, 0, "NEXT", {
      backgroundColor: "black",
      padding: {
        x: 10,
        y: 10,
      },
      color: "white",
    });
    var prevButton = this.scene.add.text(0, 0, "PREV", {
      backgroundColor: "black",
      padding: {
        x: 10,
        y: 10,
      },
      color: "white",
    });

      // add close btn
      var closeButton = this.scene.add.text(0, 0, "X", {
        backgroundColor: "black",
        padding: {
          x: 10,
          y: 10,
        },
        color: "white",
      });

    nextButton.setInteractive().on("pointerdown", () => {
      // scroll a bit down the scroller
      let actualPosition = this.scrollablePanel!.t;
      actualPosition += 0.1;
      if (actualPosition > 1) actualPosition = 1;
      this.scrollablePanel!.setT(actualPosition);
    });
    prevButton.setInteractive().on("pointerdown", () => {
      let actualPosition = this.scrollablePanel!.t;
      actualPosition -= 0.1;
      if (actualPosition < 0) actualPosition = 0;
      this.scrollablePanel!.setT(actualPosition);
    });

    closeButton.setInteractive().on("pointerdown", () => {
      this.scrollablePanel!.destroy();
      nextButton.destroy();
      prevButton.destroy();
      closeButton.destroy();
    });

  

    // add hover effect
    nextButton.on("pointerover", () => {
      nextButton.setBackgroundColor("red");
    });
    nextButton.on("pointerout", () => {
      nextButton.setBackgroundColor("black");
    });

    prevButton.on("pointerover", () => {
      prevButton.setBackgroundColor("red");
    });
    prevButton.on("pointerout", () => {
      prevButton.setBackgroundColor("black");
    });

    closeButton.on("pointerover", () => {
      closeButton.setBackgroundColor("red");
    });
    closeButton.on("pointerout", () => {
      closeButton.setBackgroundColor("black");
    });

    // move buttons to the right of the scroller one below the other one
    nextButton.x = (this.scene.UICamera.width / 2) + (this.scrollablePanel.width / 2) + 50;
    nextButton.y = 210;
    prevButton.x = (this.scene.UICamera.width / 2) + (this.scrollablePanel.width / 2) + 50;
    prevButton.y = 250;
    closeButton.x = (this.scene.UICamera.width / 2) + (this.scrollablePanel.width / 2) + 50;
    closeButton.y = 290;


    // get the width of backgroundScroller

    this.scene.cameras.main.ignore(this.scrollablePanel);
    this.scene.cameras.main.ignore(nextButton);
    this.scene.cameras.main.ignore(prevButton);

    // ignore camera ui
  }
}
