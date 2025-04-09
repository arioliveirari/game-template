import ButtonComponent from "../ModalComponents/ButtonComponent";
import TitleComponent from "../ModalComponents/TitleComponent";
import EventsCenterManager from "../../../services/EventsCenter";
import RPG from "@/game/rpg";
import { ModalBase } from "./ModalBase";
import { globalState } from "@/game/GlobalDataManager";
import { tweenStarFalling } from "../ModalComponents/tweenHelpers";
import possibleSounds from "../../../modules/possibleSounds.json";


export class ModalWorld extends ModalBase {
    background: Phaser.GameObjects.Image;
    header: Phaser.GameObjects.Image;
    title: Phaser.GameObjects.Text;
    text: Phaser.GameObjects.Text;
    separator: Phaser.GameObjects.Image;
    rewardText: Phaser.GameObjects.Text;
    rewardContainer: Phaser.GameObjects.Container;

    closeButton: ButtonComponent;
    buyButton: ButtonComponent;

    constructor(scene: RPG, x: number, y: number) {
        super(scene, x, y);

        // this.backgroundLess.off('pointerdown');
        const globalData: globalState = EventsCenterManager.emitWithResponse(EventsCenterManager.possibleEvents.GET_STATE, null);
        
        let actualReq = {
            money: globalData.inventary.digitalMoney,
            reputation: globalData.reputation,
            happiness: globalData.happiness.actualValue,   
        };

        const requirements = {
            money: 2100,
            reputation: 150,
            happiness: 80,
        };

        let texture = globalData.wizzardModule.getState().texture

        let modalWorldData = {
            title: "Nuevo mundo disponible",
            text: "Para desbloquear un nuevo mundo necesitas los siguientes requisitos.",
        };

        if(this.scene.stateGlobal.wizzardModule.getState().isActive) this.createRandomWizard(0.8, Phaser.Math.Between(4,5), texture);

        this.background = scene.add.image(0, 0, "modalFinish").setOrigin(0.5).setInteractive();
        this.header = scene.add.image(0,-240, 'header-3').setOrigin(0.5);
        this.title = new TitleComponent(scene, 0, -240, modalWorldData.title, 500, '24', 'MontserratSemiBold');
        this.text = new TitleComponent(scene, 0, -120, modalWorldData.text, 500, '18', 'MontserratSemiBold');
        this.separator = scene.add.image(0, -30, 'separator-3').setOrigin(0.5);
        this.rewardText = new TitleComponent(scene, 0, 10,  "REQUISITOS", 500, '18', 'MontserratSemiBold');


        let checkRequierments = false;

        if(actualReq.money >= requirements.money && actualReq.reputation >= requirements.reputation && actualReq.happiness >= requirements.happiness) {
            checkRequierments = true;
        }


        this.rewardContainer = scene.add.container(0, 90);

      
        const coinIcon = this.scene.add.image(-94, 0, "iconDigitalMoney").setScale(0.5);
        const coinText = new TitleComponent(scene, -50, 0, requirements.money.toString() , 50, '18', 'MontserratSemiBold');

        
        const happinessIcon = this.scene.add.image(0, 0, "iconSmileFinish").setScale(0.5);
        const happinessText = new TitleComponent(scene, 35, 0, requirements.happiness.toString() , 50, '18', 'MontserratSemiBold');

        
        const reputationIcon = this.scene.add.image(80, 0, "reputationIcon").setScale(0.8);
        const reputationText = new TitleComponent(scene, 115, 0, requirements.reputation.toString() , 50, '18', 'MontserratSemiBold');

        this.rewardContainer.add([
            coinIcon,
            coinText,
            happinessIcon,
            happinessText,
            reputationIcon,
            reputationText,
        ]);

        this.buyButton = new ButtonComponent(this.scene, -80, 190, 200, "COMPRAR", "btn-violet", "#ffffff", "16", 1.2, 1,() => {
            this.handleClose();
            this.eventCenter.emitEvent(this.eventCenter.possibleEvents.PLAY_SOUND, possibleSounds.sounds.modals.modalFinishMission.buttonClose);
            globalData.inversionModule.isActive = !globalData.inversionModule.isActive;
            this.eventCenter.emit(this.eventCenter.possibleEvents.ACTIVATE_INVERSION_MODULE);
            //Event de comprar mundo BUY_WORLD_EXPANSION
            this.eventCenter.emitEvent(this.eventCenter.possibleEvents.BUY_WORLD_EXPANSION, requirements.money);
        });
        

        this.closeButton = new ButtonComponent(this.scene, 80, 190, 200, "CERRAR", "btn-violet", "#ffffff", "16", 1.2, 1,() => {
            this.handleClose();
            this.eventCenter.emitEvent(this.eventCenter.possibleEvents.PLAY_SOUND, possibleSounds.sounds.modals.modalFinishMission.buttonClose);
        });

        if(!checkRequierments) {
            this.buyButton.pauseInteracts(true);
            this.buyButton.disableEvent('pointerup');
            this.buyButton.disableEvent('pointerover');
            this.buyButton.disableEvent('pointerout');  
            this.buyButton.background.setAlpha(0.5);    
            this.buyButton.buttonText.setAlpha(0.5);
        }

        this.modalContainerWithElements.add([
            this.background,
            this.header,
            this.title,
            this.text,
            this.separator,
            this.rewardText,
            this.rewardContainer,
            this.closeButton,
            this.buyButton,
        ]);

    }
}


