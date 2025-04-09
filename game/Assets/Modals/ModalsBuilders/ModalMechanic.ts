import RPG from "@/game/rpg";
import EventsCenterManager from "../../../services/EventsCenter";
import { ModalBase } from "./ModalBase";
import { globalState } from "@/game/GlobalDataManager";
import { ModalFormQuestion } from "./ModalFormQuestion";
import { formQuestionType } from "@/game/maps/mapCreationFunctions";
import ButtonComponent from "../ModalComponents/ButtonComponent";
import TitleComponent from "../ModalComponents/TitleComponent";
import { ModalFormFinish } from "./ModalFormFinish";
import { missionsType } from "../ModalTypes";
import { PinIsoSpriteBox } from "../../pinIsoSpriteBox";
import { changeSceneTo } from "@/game/helpers/helpers";
import possibleSounds from "../../../modules/possibleSounds.json";
import { tweenWorldTransition } from "../ModalComponents/tweenHelpers";
import MechanicData from "@/game/MockData/MechanicData.json";



export class ModalMechanic extends ModalBase {
    scene: RPG;
    cancelButton: ButtonComponent;
    buyButton: ButtonComponent;
    activeTween: boolean = false;
    citySelected?: string
    eventCenter = EventsCenterManager.getInstance();
    backgroundCity: Phaser.GameObjects.Image;

    updateActiveTween = (value: boolean = !this.activeTween) => {
        this.activeTween = value;
    }

    constructor(
        scene: RPG,
        x: number,
        y: number,
        pin: PinIsoSpriteBox | undefined,
    ) {
        super(scene, x, y);

        this.scene = scene;
        //this.backgroundLess.off('pointerdown');
        this.backgroundCity = scene.add.image(0, 0, "modalBackground").setOrigin(0.5).setVisible(true).setInteractive();;
        const globalData: globalState = EventsCenterManager.emitWithResponse(EventsCenterManager.possibleEvents.GET_STATE, null)

        const topContainer = this.scene.add.container(0, -150);

        const mechanicsData = MechanicData;

        //selecionar mecanico random
        let selectedMechanic = mechanicsData.mechanics.find((mechanic) => mechanic.id === pin?.mechanicId);
        if (!selectedMechanic) {
            console.error("No se encontró el mecánico seleccionado.");
            selectedMechanic = mechanicsData.mechanics[0];
        }

        //right button
        this.cancelButton = new ButtonComponent(this.scene, 140, 0, 200, "CANCELAR", "btn", "#ffffff", "16", 1.2, 1, () => {
            this.handleClose();
            this.eventCenter.emitEvent(this.eventCenter.possibleEvents.PLAY_SOUND, possibleSounds.sounds.modals.modalCities.buttonClose);
        }).setVisible(false);

        //TOP CONTAINER
        const btnExit_p = new ButtonComponent(this.scene, 340, -40, 200, "", "btnExit", "#ffffff", "16", 1.2, 1, () => {
            this.handleClose();
        });

        const title = new TitleComponent(this.scene, 0, -35, "¡REPARA LA MAQUINA!", 350, '26');

        topContainer.add([
            title,
            btnExit_p,
        ]);

        const calculateRepairPercentage = (repairLvl: number): number  =>{
            let min: number;
            let max: number;
        
            switch (repairLvl) {
                case 1:
                    min = 30;
                    max = 60;
                    break;
                case 2:
                    min = 60;
                    max = 80;
                    break;
                case 3:
                    min = 80;
                    max = 100;
                    break;
                default:
                    min = 0;
                    max = 0;
                    break;
            }
        
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        //Buttons Container
        const buttonsContainer = this.scene.add.container(0, 220);

        //LEFT BUTTON
        this.buyButton = new ButtonComponent(this.scene, 0, -20, 200, "PAGAR", "btn", "#ffffff", "16", 1.2, 1, () => {
            if(globalData.inventary.digitalMoney >= selectedMechanic.price) {
                this.eventCenter.emitEvent(this.eventCenter.possibleEvents.REPAIR_MACHINE, selectedMechanic.price);
        
                const repairPercentage = calculateRepairPercentage(selectedMechanic.repairLvl);
                let data = {name : "Maquina de hacer Cafe", item: 15, consume: 0, money: 0, considerBusinessFuel: false, newLife: repairPercentage};
                this.eventCenter.emit(this.eventCenter.possibleEvents.REPAIRMENT, data);
            
                this.eventCenter.emitEvent(this.eventCenter.possibleEvents.PLAY_SOUND, possibleSounds.sounds.modals.modalCities.buttonClose);
                if (pin) {
                    pin.self.destroy();
                }
                this.handleClose();
            }
        });

        if(globalData.inventary.digitalMoney < selectedMechanic.price){
            this.buyButton.setAlpha(0.5);
            //this.buyButton.removeInteractive();
            this.buyButton.buttonText.setAlpha(0.5);
        }//else this.buyButton.setInteractive(); 

        buttonsContainer.setVisible(true);

         const photo_q = this.scene.add.image(-20, -2, "blueprintPicture").setScale(.3);
         const graphics = this.scene.make.graphics();
         graphics.fillRoundedRect(-100, -100, 170, 220, 20);
         // photo_q.setMask(mask);
         const description = this.scene.add.text(0, -60, `${selectedMechanic.description}`, {
            fontFamily: "MontserratSemiBold",
            fontSize: '18px',
            color: '#ffffff',
            align: 'center',
            wordWrap: { width: 300 },
            fixedWidth: 300,
            fixedHeight: 0,
        }).setOrigin(0.5).setAlign('left').setLineSpacing(3);

        //Nivel de reparación:
        const description2 = this.scene.add.text(0, 0, `Nivel de reparación: ${selectedMechanic.porcentage}`, {
            fontFamily: "MontserratSemiBold",
            fontSize: '18px',
            color: '#ffffff',
            align: 'center',
            wordWrap: { width: 300 },
            fixedWidth: 300,
            fixedHeight: 0,
        }).setOrigin(0.5).setAlign('left').setLineSpacing(3);

         //@ts-ignore
         const reward_q = this.scene.add.text(-40, 50, `${selectedMechanic.price}`, {
            fontFamily: "MontserratSemiBold",
            fontSize: '24px',
            color: '#ffffff',
        }).setOrigin(0.5);
        const coinIcon = this.scene.add.image(10, 50, "iconDigitalMoney").setScale(0.5);

        //Modals containers
        const leftContainer = this.scene.add.container(-140, 20);
        const rightContainer = this.scene.add.container(225, 20);
         leftContainer.add([
             photo_q,
         ]);
         rightContainer.add([
            description,
            description2,
            coinIcon,
            reward_q,
           
        ]);

        buttonsContainer.add([
            this.cancelButton,
            this.buyButton 
        ]);


        this.modalContainerWithElements.add([
            this.backgroundCity,
            topContainer,
            leftContainer,
            rightContainer,
            buttonsContainer,
        ]);
    }
}