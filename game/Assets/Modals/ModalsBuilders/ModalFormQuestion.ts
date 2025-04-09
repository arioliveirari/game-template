import { formQuestionType } from "@/game/maps/mapCreationFunctions";
import { LargeButtonWithText } from "../ModalComponents/LargeButtonWithText";
import TitleComponent from "../ModalComponents/TitleComponent";
import { act } from "react";
import { questionFormsType } from "../ModalTypes";


export class ModalFormQuestion extends Phaser.GameObjects.Container {
    question: any;
    answers: LargeButtonWithText[];
    constructor(scene: Phaser.Scene, x: number, y: number, activeQuestion: questionFormsType, callback: Function) {
        super(scene, x, y);

        if(activeQuestion.imageForm != null) {
            let image = scene.add.image(-285, 100, activeQuestion.imageForm).setOrigin(0.5);
            this.add(image);

        }



        let dinamicConfig = {
            width: 200,
            height:50,
            LargeButtonX: 0,
            gridWidth: 230,
            gridHeight: 90, 
            gridX: -115,
            gridY : 90,
            rowConfig: false,
        };
        switch(activeQuestion.type) {
            case 'multiple':
                break;
            case 'image':
                dinamicConfig.width = 530;
                dinamicConfig.height = 70;
                dinamicConfig.LargeButtonX = 110;
                dinamicConfig.gridWidth = 510; 
                dinamicConfig.gridHeight = 80;
                dinamicConfig.gridX = 145;
                dinamicConfig.gridY = (activeQuestion.answers.length == 2) ? 60 :
                (activeQuestion.answers.length == 3) ? 50 :  10;
                dinamicConfig.rowConfig = true;
                //@ts-ignore
                this.question = new TitleComponent(scene, 150, -40, activeQuestion.question, 390, '16', 'MontserratSemiBold', '#ffffff',100);

                break;
            case 'vertical':
                dinamicConfig.width = 800;
                dinamicConfig.height = 60;
                dinamicConfig.LargeButtonX = 0;
                dinamicConfig.gridWidth = 500;
                dinamicConfig.gridHeight = 80;
                dinamicConfig.gridX = 0;
                dinamicConfig.gridY = (activeQuestion.answers.length == 2) ? 60 :
                (activeQuestion.answers.length == 3) ? 30 :  10;
                dinamicConfig.rowConfig = true;
                //@ts-ignore
                this.question = new TitleComponent(scene, 0, -35, activeQuestion.question, 500, '16', 'MontserratSemiBold', '#ffffff',100);
                break;
            default:
                break;
        }
        

        const groupAnswer = this.scene.add.group();
        this.answers = activeQuestion.answers.map((answer, i) => {
            let lb = new LargeButtonWithText(
                scene,
                dinamicConfig.LargeButtonX,
                0,
                dinamicConfig.width,
                dinamicConfig.height,
                answer,
                i,
                0,
                { hover: 0x8966f7, normal: 0xfcf3e8, click: 0x8966f7 },
                (row: number, col: number) => {
                    callback(answer);
                }
            );
            groupAnswer.add(lb);
            return lb;
        });

        let totalAnswers = this.answers.length;
        let rows = dinamicConfig.rowConfig ? totalAnswers : Math.ceil(totalAnswers / 2);
        let cols = dinamicConfig.rowConfig ? 1 : Math.min(totalAnswers, 2);


        Phaser.Actions.GridAlign(groupAnswer.getChildren(), {
            width: cols,
            height: rows,
            cellWidth: dinamicConfig.gridWidth,
            cellHeight: dinamicConfig.gridHeight, 
            x: dinamicConfig.gridX,
            y: dinamicConfig.gridY,
        });

        this.add([this.question, ...this.answers]);
    }

}



