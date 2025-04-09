import RPG from "@/game/rpg";
import { ModalConfig, ProductToBuy, modalType } from "../ModalTypes";
import EventsCenterManager from "../../../services/EventsCenter";
import { ModalBase } from "./ModalBase";
import { globalState } from "@/game/GlobalDataManager";
import { info } from "console";
import TitleComponent from "../ModalComponents/TitleComponent";
import ButtonComponent from "../ModalComponents/ButtonComponent";
import possibleSounds from "../../../../game/modules/possibleSounds.json";



export class ModalNews extends ModalBase {
    scene: RPG;
    agreeButton?: ButtonComponent;
    activeTween: Phaser.Tweens.Tween | null = null;
    eventCenter = EventsCenterManager.getInstance();

    constructor(
        scene: RPG,
        x: number,
        y: number,
    ) {
        super(scene, x, y);
        this.scene = scene;

        const globalData: globalState = EventsCenterManager.emitWithResponse(EventsCenterManager.possibleEvents.GET_STATE, null)

        const allNews = globalData.news


        const availableNews = allNews.filter(news => !news.readed);
        if (availableNews.length === 1) this.eventCenter.emit(this.eventCenter.possibleEvents.RESTART_NEWS, undefined);
        let newsSelected = globalData.selectedNews 
        if (!newsSelected) {
            newsSelected = this.eventCenter.emitWithResponse(this.eventCenter.possibleEvents.SET_SELECTED_NEWS, undefined);
        }
        if (!newsSelected) return
        let isAlreadyRead = newsSelected.readed;
        this.eventCenter.emit(this.eventCenter.possibleEvents.READ_NEWSPAPER, newsSelected.id);


        //Modals containers
        const topContainer = this.scene.add.container(0, -170);
        const leftContainer = this.scene.add.container(-150, 0);
        const rightContainer = this.scene.add.container(163, 0);

        // INFO CONTAINER
        const infoContainer = this.scene.add.container(26, 0);


        //const image = this.scene.add.image(-100, 0, newsSelected.image).setOrigin(0.5).setScale(0.45).setRotation(-Math.PI / 4);
        //ULTIMA//const image = this.scene.add.image(-205, 45, newsSelected.image).setOrigin(0.5).setScale(0.5);
        const image = this.scene.add.image(-345, 82, newsSelected.image).setOrigin(0.5).setScale(0.7);
        const borderImage = this.scene.add.image(-345, 82, "newsMarkImg").setOrigin(0.5).setScale(0.7);

        const readedImg = this.scene.add.image(-518, -185, !isAlreadyRead ? "newsNotRead" : "newsRead").setOrigin(0.5).setScale(0.7);

        //@ts-ignore
        const title = new TitleComponent(this.scene, 180, -125, newsSelected.title, 650, '60', 'TinosBoldItalic','#000000',0,"left");
        //@ts-ignore
        const description = new TitleComponent(this.scene, 180, 40, newsSelected.description, 650, '38', 'TinosRegular', '#000000',0,"left");

        infoContainer.add([
            image,
            borderImage,
            readedImg,
            title,
            description,
        ]);

        //backgroundModal
        const modalBackground = this.scene.add.image(0, 0, "newsBackground").setOrigin(0.5).setScale(0.7).setInteractive();

        //LEFT BUTTON buttonBg
        this.agreeButton = new ButtonComponent(this.scene, 156, 315, 150, "CERRAR", "buttonBg", "#ffffff", "22", 1.2, 1,() => {
            this.handleClose();
                 this.eventCenter.emitEvent(this.eventCenter.possibleEvents.PLAY_SOUND, possibleSounds.sounds.modals.newspaper.buttonAccept);

        });

        this.agreeButton.background.setScale(0.7);

        //TOP CONTAINER
        /*const btnExit_p = new ButtonComponent(this.scene, 310, -40, 200, "", "btnExit", "#ffffff", "16", 1.2, 1,() => {
            this.handleClose();
                 this.eventCenter.emitEvent(this.eventCenter.possibleEvents.PLAY_SOUND, possibleSounds.sounds.modals.newspaper.buttonClose);
        });*/

        //@ts-ignore
        const title_p = new TitleComponent(this.scene, 0, -145, "NOTI CHAMBIX", 800, '100', 'TinosBold', '#000000');

        topContainer.add([
            title_p,
            //btnExit_p,
        ]);



        this.modalContainerWithElements.add([
            modalBackground,
            topContainer,
            leftContainer,
            rightContainer,
            infoContainer,
            this.agreeButton
        ]);
    }
}