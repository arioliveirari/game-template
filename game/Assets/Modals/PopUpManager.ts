import RPG from "@/game/rpg";
import { missionsType } from "./ModalTypes";
import { MissionTrofyChallenge } from "@/game/services/EventChallengeListener";
import Container from "phaser3-rex-plugins/templates/ui/container/Container";

class MissionBoxObject {
    sprite: Phaser.GameObjects.Sprite;
    text: Phaser.GameObjects.Text;
    container: Phaser.GameObjects.Container;
    scene: RPG;
    id: number;
    index: number = 0;
    heightAnim: number = 0;
    constructor(scene: RPG, mission: missionsType, itemNumber: number, lastItem?: MissionBoxObject, index: number = 0) {
        this.scene = scene;
        this.id = mission.id;
        this.index = index
        this.sprite = scene.add.sprite(0, 0, "popUp2").setOrigin(0.5).setScale(.9);
        this.text = scene.add.text(0, 0, mission.shortDescription || mission.description).setOrigin(0.5);
        this.text.setWordWrapWidth(280);
        let newYPos = 120;
        if (lastItem) newYPos = lastItem.container.y + this.sprite.height + 20;
        this.heightAnim = this.sprite.height + 20;
        this.container = scene.add.container(window.innerWidth + 180, newYPos, [this.sprite, this.text]);
        this.scene.cameras.main.ignore(this.container);
        this.startAnimation();
    }

    startAnimation() {
        // tween from left to right
        this.scene.tweens.add({
            targets: this.container,
            x: window.innerWidth - 20 - this.sprite.width / 2,
            duration: 500,
            ease: 'Power1',
            onComplete: () => {
            }
        });
    }

    destroy(fn: Function = () => { }) {
        if (!this.container) {
            fn();
            return;
        }
        // tween from right to left and remove
        this.scene.tweens.add({
            targets: this.container,
            x: window.innerWidth + 300,
            duration: 500,
            ease: 'Power1',
            onComplete: () => {
                this.container.destroy();
                fn();
            }
        });
    }
}

class TrofyBoxObject {
    sprite: Phaser.GameObjects.Sprite;
    text: Phaser.GameObjects.Text;
    trofyIcon: Phaser.GameObjects.Sprite;
    container: Phaser.GameObjects.Container;
    scene: RPG;

    constructor(scene: RPG, trofy: MissionTrofyChallenge) {
        this.scene = scene;
        this.sprite = scene.add.sprite(0, 0, "popUp2").setOrigin(0.5);
        this.trofyIcon = scene.add.sprite(-116, 4, trofy.trofyIcon).setScale(0.5).setOrigin(0.5);
        this.text = scene.add.text(10, 0, trofy.name || trofy.description).setOrigin(0.5);
        this.text.setWordWrapWidth(230);
        this.container = scene.add.container(window.innerWidth / 2, -200, [this.sprite, this.text, this.trofyIcon]);

        this.scene.cameras.main.ignore(this.container);
        this.startAnimation();
    }

    startAnimation() {
        // tween from left to right
        this.scene.tweens.add({
            targets: this.container,
            y: 140,
            duration: 500,
            ease: 'Power1',
            onComplete: () => {
                // wait 2 seconds and then destroy
                this.scene.time.delayedCall(1500, () => {
                    this.destroy();
                });
            }
        });
    }

    destroy(fn: Function = () => { }) {
        if (!this.container) {
            fn();
            return;
        }
        // tween from right to left and remove
        this.scene.tweens.add({
            targets: this.container,
            y: -200,
            duration: 500,
            ease: 'Power1',
            onComplete: () => {
                this.container.destroy();
                fn();
            }
        });
    }
}


export class PopUpManager {
    scene: RPG;
    activeMissions: missionsType[] = [];
    activeBoxes: MissionBoxObject[] = [];
    group: MissionBoxObject[] = [];
    constructor(
        scene: RPG,
    ) {
        this.scene = scene;
    }

    createModal(mission: missionsType) {
        this.activeMissions = [...this.activeMissions, mission];
        const itemNumber = this.activeBoxes.length;
        const newBox = new MissionBoxObject(this.scene, mission, itemNumber + 1, itemNumber ? this.activeBoxes[itemNumber - 1] : undefined, itemNumber);
        //this.group.push(newBox);
        this.activeBoxes = [...this.activeBoxes, newBox];
    }

    handleGroupRemoval(index: number) {
        //if (this.group && this.group?.length) {
            this.activeBoxes.forEach((child, index) => {
                const distance = this.activeBoxes && this.activeBoxes[0] ? this.activeBoxes[0].heightAnim : 0;
                    const finalYPos = child.container.y - distance;
                    if (child.index > index) {
                        this.scene.tweens.add({
                            targets: child.container,
                            y: finalYPos,
                            duration: 500,
                            ease: 'Power1',
                        });
                    }
            });
        //}
        this.activeBoxes = this.activeBoxes.map((child, i) => {
            child.index = i;
            return child;
        });
    }

    createTrofyModal(trofy: MissionTrofyChallenge) {
        const trofyBox = new TrofyBoxObject(this.scene, trofy);
        return trofyBox
    }

    destroyModal(mission: missionsType) {
        if (this.activeBoxes.length > 0) {
            const activeBox = this.activeBoxes.find(box => box.id === mission.id);
            if (activeBox) {
                activeBox.destroy(() => {
                    this.activeBoxes = this.activeBoxes.filter(box => box.id !== mission.id);
                    this.activeMissions = this.activeMissions.filter(m => m.id !== mission.id);
                    //this.group?.filter(box => box.id !== activeBox.id);
                    this.handleGroupRemoval(activeBox.index);
                });
            }

        }
    }
}