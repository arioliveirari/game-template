import ButtonComponent from "../ModalComponents/ButtonComponent";
import TitleComponent from "../ModalComponents/TitleComponent";
import EventsCenterManager from "../../../services/EventsCenter";
import RPG from "@/game/rpg";
import { ModalBase } from "./ModalBase";
import { globalState } from "@/game/GlobalDataManager";
import { tweenStarFalling } from "../../Modals/ModalComponents/tweenHelpers";
import possibleSounds from "../../../../game/modules/possibleSounds.json";


export class ModalMissionFinish extends ModalBase {
    background: Phaser.GameObjects.Image;
    header: Phaser.GameObjects.Image;
    title: Phaser.GameObjects.Text;
    text: Phaser.GameObjects.Text;
    separator: Phaser.GameObjects.Image;
    rewardText: Phaser.GameObjects.Text;
    rewardContainer: Phaser.GameObjects.Container;
    responses: number;
    maxQuestions: number;

    closeButton: ButtonComponent;
    callback: Function;

    constructor(scene: RPG, x: number, y: number,response: number = 3, rewardId: number ,maxQuestions: number = 0, callback: Function) {
        super(scene, x, y);

        this.responses = response;
        this.maxQuestions = maxQuestions;
        const createStar = (containerStar: Phaser.GameObjects.Container) => {
            const randomX = Phaser.Math.Between(50, 750); 
            const randomScale = Phaser.Math.FloatBetween(0.3, 1); 
            const star = scene.add.image(randomX, -70, 'star');
            star.setScale(randomScale);
            containerStar.add(star);
            tweenStarFalling(star,70,0.3,1,() => createStar(containerStar),scene);
        }

        // this.backgroundLess.off('pointerdown');

        if(this.maxQuestions == 1 &&  (this.responses ==  this.maxQuestions)) this.responses = 3;
        
   
        const globalData: globalState = EventsCenterManager.emitWithResponse(EventsCenterManager.possibleEvents.GET_STATE, null)
        const rewards = globalData.rewards.find(reward => rewardId === reward.id) || { id: 1 ,money: 0, reputation: 0, happiness: 0 };
        const feedback = [
            {title : "Sigamos intentado",text : "Parece que ninguna respuesta fue acertada. Vuelve a intentarlo para mejorar tu puntuación."},
            {title : "A practicar", text : "¡Buen comienzo! Sigue practicando y alcanza la meta en tu próximo intento."},
            {title : "Bien", text : "¡Vas por buen camino! Cada paso te acerca más al éxito. Inténtalo de nuevo y consíguelo todo."},
            {title : "¡Muy bien!", text : "¡Eres imparable! Sigue avanzando, nuevas aventuras te esperan."},
        ];
        let texture = globalData.wizzardModule.getState().texture
        const wizardModalResponses = [
            {type: texture, scale: 0.8, pos: 7},
            {type: texture, scale: 0.8, pos: 42},
            {type: texture, scale: 0.8, pos: 5},
            {type: texture, scale: 0.8, pos: 2},
        ];
        if(this.scene.stateGlobal.wizzardModule.getState().isActive && texture) this.createRandomWizard(wizardModalResponses[this.responses].scale, wizardModalResponses[this.responses].pos, wizardModalResponses[this.responses].type);
        
        this.background = scene.add.image(0, 0, "modalFinish").setOrigin(0.5).setInteractive();;
        this.callback = callback;
        this.header = scene.add.image(0,-240, `header-${this.responses}`).setOrigin(0.5);
        this.title = new TitleComponent(scene, 0, -240, feedback[this.responses].title, 500, '24', 'MontserratSemiBold');
        this.text = new TitleComponent(scene, 0, -120, feedback[this.responses].text, 500, '18', 'MontserratSemiBold');
        this.separator = scene.add.image(0, -30, `separator-${this.responses}`).setOrigin(0.5);
        this.rewardText = new TitleComponent(scene, 0, 10, this.responses > 0 ? "RECOMPENSA" : "¡No te rindas! Cada intento cuenta.", 500, '18', 'MontserratSemiBold');


        let finalMoney = rewards.money;
        if(this.maxQuestions > 1) finalMoney = (rewards.money * this.responses) / this.maxQuestions;

        this.rewardContainer = scene.add.container(0, 90);

        if(this.responses > 0) {
            const coinIcon = this.scene.add.image(-90, 0, "iconCommon").setScale(0.55);
            const coinText = new TitleComponent(scene, -50, 0, Math.round(finalMoney).toString() , 50, '18', 'MontserratSemiBold');
    
            
            const happinessIcon = this.scene.add.image(0, 0, "iconSmileFinish").setScale(0.5);
            const happinessText = new TitleComponent(scene, 35, 0, rewards.happiness.toString() , 50, '18', 'MontserratSemiBold');
    
            
            const reputationIcon = this.scene.add.image(80, 0, "reputationIcon").setScale(0.8);
            const reputationText = new TitleComponent(scene, 115, 0, rewards.reputation.toString() , 50, '18', 'MontserratSemiBold');

            this.rewardContainer.add([
                coinIcon,
                coinText,
                happinessIcon,
                happinessText,
                reputationIcon,
                reputationText,
            ]);
        }else {
            const readIcon = this.scene.add.image(0, 0, "iconFailFinish").setScale(0.8);

            this.rewardContainer.add([
                readIcon,
            ]);
        }

        this.closeButton = new ButtonComponent(this.scene, 0, 190, 300, this.responses ? "RECOLECTAR" : "CONTINUAR", "btn-violet", "#ffffff", "16", 1.2, 1,() => {
            this.callback();
            this.handleClose();
            this.eventCenter.emitEvent(this.eventCenter.possibleEvents.PLAY_SOUND, possibleSounds.sounds.modals.modalFinishMission.buttonClose);
        });

        this.modalContainerWithElements.add([
            this.background,
            this.header,
            this.title,
            this.text,
            this.separator,
            this.rewardText,
            this.rewardContainer,
            this.closeButton,
        ]);

        if(this.responses >= 2) {
            const containerStar = scene.add.container(-400, -240);

          this.eventCenter.emitEvent(this.eventCenter.possibleEvents.PLAY_SOUND, "winModalSound")
            const maskShape = scene.add.graphics();
            //maskShape.fillStyle(0xa4f, 0.3);
            maskShape.fillRect(window.innerWidth/2 - 850 /2,window.innerHeight/2 - 285, 850, 90); 
            //maskShape.lineStyle(2, 0xff0000, 1); 
            maskShape.strokeRect(window.innerWidth/2 - 850 /2,window.innerHeight/2 - 285, 850, 90);
            const mask = maskShape.createGeometryMask();
            containerStar.setMask(mask);

            for (let i = 0; i < 16; i++) {
                createStar(containerStar);
            }

            this.modalContainerWithElements.add(containerStar);
        }
    }
}


