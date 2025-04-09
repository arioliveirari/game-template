import ButtonComponent from "../ModalComponents/ButtonComponent";
import TitleComponent from "../ModalComponents/TitleComponent";
import RPG from "@/game/rpg";


export class ModalFormFinish extends Phaser.GameObjects.Container {
    text: Phaser.GameObjects.Text;
    //result: Phaser.GameObjects.Text;
    closeButton: ButtonComponent;
    callback: Function;

    constructor(scene: RPG, x: number, y: number, text: string, correctAnswers: number, questions: number, callback: Function) {
        super(scene, x, y);

        this.callback = callback;
        this.text = new TitleComponent(scene, 0, 50, text, 500, '20', 'MontserratSemiBold');

        //this.result = TitleComponent(scene, 0, 200, `Has acertado ${correctAnswers} de ${questions} preguntas`, 500, '20', 'MontserratSemiBold');

        this.closeButton = new ButtonComponent(this.scene, 0, 270, 200, "CERRAR", "btn", "#ffffff", "16", 1.2, 1,() => {
            this.callback();
        });

        
        this.add([
            this.text,
            //this.result,
            this.closeButton,
        ]);
    }
}


