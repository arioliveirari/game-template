import RPG from "@/game/rpg";
import EventsCenterManager from "../../../services/EventsCenter";
import { AppearModeEnum, ModalBase } from "./ModalBase";
import { globalState } from "@/game/GlobalDataManager";
import { StoreContainer } from "./StoreContainer";
import { AcademyContainer } from "./AcademyContainer";

export class ModalPCV2 extends ModalBase {
    scene: RPG;
    activeTween: Phaser.Tweens.Tween | null = null;
    eventCenter = EventsCenterManager.getInstance();
    imageTitle: Phaser.GameObjects.Image
    // storeContainer: StoreContainer;
    // academyContainer: AcademyContainer;
    activeKey: 'store' | 'academy' = 'store';
    stateAnim: "IDLE" | "CHANGING" = "IDLE"
    activeContainer: StoreContainer | AcademyContainer | null = null;
    constructor(scene: RPG, x: number, y: number) {
        super(scene, x, y, AppearModeEnum.FROMLEFT);
        this.scene = scene;
        // this.storeContainer = new StoreContainer(this.scene, 0, 0, "trofies");
        // this.academyContainer = new AcademyContainer(this.scene, 0, 0, "trofies")
        this.activeContainer = new StoreContainer(this.scene, 0, 0, "store", this);

        const globalState: globalState = this.eventCenter.emitWithResponse(
            this.eventCenter.possibleEvents.GET_STATE,
            null
        );

        const modalBackground = this.scene.add
            .image(0, 0, "trofiesBackground")
            .setOrigin(0.5)
            .setScale(1)
            .setInteractive();

        this.imageTitle = this.scene.add.image(0, -220, "storeActive")
            .setOrigin(0.5, 0.5)
            .setAlpha(1)
            .setDepth(1)
            .setInteractive()

        this.imageTitle.on("pointerup", () => {
            this.changeVisibleContainerWithTween(this.activeKey === "store" ? 'academy' : 'store');
        })

        this.modalContainerWithElements.add([
            modalBackground,
            this.imageTitle
        ]);
        
        this.modalContainerWithElements.add(this.activeContainer);
        // this.modalContainerWithElements.add(this.academyContainer);
        this.scene.time.delayedCall(100, () => this.changeVisibleContainerWithTween("store"), [], this.scene);
    }

    fireUpdate() {
        this.activeContainer?.fireUpdate();
    }

    fireClose() {
        this.activeContainer?.fireClose();
    }

    changeVisibleContainerWithTween(type: 'store' | 'academy') {
        if (this.stateAnim === "CHANGING") return
        this.stateAnim = "CHANGING"
        if (this.activeContainer) {
            this.activeContainer.fireClose();
            this.activeContainer = null;
        }
        this.activeContainer = type === 'store' ? new StoreContainer(this.scene, 0, 0, "store", this) : new AcademyContainer(this.scene, 0, 0, "store", this);
        this.modalContainerWithElements.add(this.activeContainer);
        this.activeContainer.fireUpdate()
        this.activeKey = type
        this.imageTitle.setTexture(type + 'Active')
        
        this.activeTween = this.scene.tweens.add({
            targets: this.activeContainer.scrollPanel,
            alpha: 1,
            duration: 400,
            ease: "Power2",
            onComplete: () => {
                this.activeTween = null;
                this.stateAnim = "IDLE"
            },
        });
    }
}
