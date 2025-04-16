import Phaser from 'phaser';

export default class GenericButton extends Phaser.GameObjects.Container {

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, callback: () => void) {
        super(scene, x, y);

        // que podemos hacer con nuestro boton:  cambiar de escena por ejemplo
        const button = scene.add.rectangle(0, 0, 100, 100, 0x0000ff).setInteractive({ useHandCursor: true });
        button.on('pointerdown', () => {
            console.log("ARIELITO")
            if (callback)  callback(); 
        });
        this.add(button);
        this.scene.add.existing(this);
    }
}