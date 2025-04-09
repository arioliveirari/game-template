import RPG from "@/game/rpg";

export default class TitleComponent extends Phaser.GameObjects.Text {
    scene: RPG;
    x: number;
    y: number;
    width: number;
    size: string;
    ff: string;
    color: string;
    fHeight: number;
    constructor(scene: RPG, x: number, y: number, text: string, width: number = 200, size: string = "24", ff: string = 'MontserratBold', color: string = "#ffffff", fHeight: number = 0,align: string = 'center') {
        super(scene, x, y, text, {
            fontFamily: ff,
            fontSize: size + 'px',
            color: color,
            wordWrap: { width: width },
            fixedWidth: width,
            fixedHeight: fHeight,
        });
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.width = width;
        this.size = size;
        this.ff = ff;
        this.color = color;
        this.fHeight = fHeight;
        this.setAlign(align).setOrigin(0.5);

        scene.add.existing(this);
    }
}