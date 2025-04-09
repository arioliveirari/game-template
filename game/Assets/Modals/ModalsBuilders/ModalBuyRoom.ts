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
import possibleSounds from "../../../../game/modules/possibleSounds.json";
import { tweenWorldTransition } from "../ModalComponents/tweenHelpers";



export class ModalBuyRoom extends ModalBase {
    scene: RPG;
    agreeButton: ButtonComponent;
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
        lock?: Phaser.GameObjects.Image
    ) {
        super(scene, x, y);



        this.scene = scene;
        this.backgroundLess.off('pointerdown');
        this.backgroundCity = scene.add.image(0, 0, "modalBackground").setOrigin(0.5).setVisible(true).setInteractive();;
        const globalData: globalState = EventsCenterManager.emitWithResponse(EventsCenterManager.possibleEvents.GET_STATE, null)

        const topContainer = this.scene.add.container(0, -150);





        //LEFT BUTTON
        this.agreeButton = new ButtonComponent(this.scene, -140, 0, 200, "ACEPTAR", "btn", "#ffffff", "16", 1.2, 1, () => {
            buttonsContainer.setVisible(false);
        }).setVisible(false);


        //right button
        this.cancelButton = new ButtonComponent(this.scene, 140, 0, 200, "CANCELAR", "btn", "#ffffff", "16", 1.2, 1, () => {
            this.handleClose();
            this.eventCenter.emitEvent(this.eventCenter.possibleEvents.PLAY_SOUND, possibleSounds.sounds.modals.modalCities.buttonClose);
        }).setVisible(false);

        //TOP CONTAINER
        const btnExit_p = new ButtonComponent(this.scene, 340, -40, 200, "", "btnExit", "#ffffff", "16", 1.2, 1, () => {
            this.handleClose();
        });

        const title = new TitleComponent(this.scene, 0, -35, "Expandí tu negocio!", 300, '28');

        topContainer.add([
            title,
            btnExit_p,
        ]);

        //Buttons Container
        const buttonsContainer = this.scene.add.container(0, 220);
        

        //LEFT BUTTON
        this.buyButton = new ButtonComponent(this.scene, 0, -20, 200, "COMPRAR", "btn", "#ffffff", "16", 1.2, 1, () => {
            if(globalData.inventary.digitalMoney >= 400) {
                //@ts-ignore
                this.scene.map.unLockLand();
                if (lock) lock.setVisible(false);
                this.eventCenter.emitEvent(this.eventCenter.possibleEvents.BUY_EXPANSION, 400)
                this.handleClose();

            }
        });


        if(globalData.inventary.digitalMoney < 400){
            this.buyButton.setAlpha(0.5);
            //this.buyButton.removeInteractive();
            this.buyButton.buttonText.setAlpha(0.5);
        }

        buttonsContainer.setVisible(true);

         const photo_q = this.scene.add.image(-20, -2, "blueprintPicture").setScale(.3);
         const graphics = this.scene.make.graphics();
         graphics.fillRoundedRect(-100, -100, 170, 220, 20);
         // photo_q.setMask(mask);
         const description = this.scene.add.text(0, -30, `Comprá una expansión de terreno para tu negocio`, {
            fontFamily: "MontserratSemiBold",
            fontSize: '18px',
            color: '#ffffff',
            align: 'center',
            wordWrap: { width: 300 },
            fixedWidth: 300,
            fixedHeight: 0,
        }).setOrigin(0.5).setAlign('left').setLineSpacing(3);
         //@ts-ignore
         const reward_q = this.scene.add.text(-40, 50, `400`, {
            fontFamily: "MontserratSemiBold",
            fontSize: '24px',
            color: '#ffffff',
        }).setOrigin(0.5);
        const coinIcon = this.scene.add.image(10, 50, "iconDigital").setScale(.55);

        //Modals containers
        const leftContainer = this.scene.add.container(-140, 20);
        const rightContainer = this.scene.add.container(225, 20);
         leftContainer.add([
             // graphics,
             photo_q,
         ]);
         rightContainer.add([
            /*timeNumber_q,*/
            /*timeIcon_q,*/
            description,
            coinIcon,
            reward_q,
           
        ]);

        buttonsContainer.add([
            this.agreeButton,
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