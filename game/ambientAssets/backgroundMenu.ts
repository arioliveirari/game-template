
export default class BackgroundMenu extends Phaser.GameObjects.Container{

    menuClouds: Phaser.GameObjects.Image;
    menuCity: Phaser.GameObjects.Image;
    menuLights: Phaser.GameObjects.Image;
    menuPJA: Phaser.GameObjects.Image;
    menuPJB: Phaser.GameObjects.Image;
    menuPJC: Phaser.GameObjects.Image;
    menuSky: Phaser.GameObjects.Image;
    logo: Phaser.GameObjects.Image;
    
    

    constructor(scene: Phaser.Scene, x: number, y: number, width: number, height: number) {
        super(scene, x, y);
        this.menuClouds = scene.add.image(0, 0, "menuClouds").setOrigin(0.65, -0.3).setScale(1.1)
        this.menuClouds.setPosition(this.menuClouds.width*0.15, -this.menuClouds.height*0.8).setScale(1.1)
        this.menuCity = scene.add.image(0, 0, "menuCity").setScale(1.1)
        this.menuLights = scene.add.image(0, 0, "menuLights").setOrigin(0.65, -0.3).setScale(1.1)
        this.menuLights.setPosition(this.menuLights.width*0.15, -this.menuLights.height*0.8).setScale(1.1)
        this.menuSky = scene.add.image(0, 0, "menuSky")

      
        this.logo = scene.add.image(0, 0, "logo").setAlpha(0).setScale(0).setOrigin(0.5, 0.85)

        const container = this.scene.add.container()
        container.add([
            this.menuSky, 
            this.menuClouds, 
            this.menuLights, 
            this.menuCity, 
            // this.menuPJB,
            // this.menuPJC,
            // this.menuPJA,
            this.logo,
        ])

        // this.menuPJA.setPosition(-100,300)
        // this.menuPJB.setPosition(-100,300)
        // this.menuPJC.setPosition(-100,300)

        const objectScaler = {
            x: window.innerWidth / this.menuCity.width,
            y: window.innerHeight / this.menuCity.height
        }
        container.setScale(objectScaler.x > objectScaler.y ? objectScaler.x : objectScaler.y)

        this.menuPJC = scene.add.image(0, height / 2, "intro_image_3").setOrigin(-0.1,1.3).setScale(0.3)
        this.menuPJB = scene.add.image(0, height / 2, "intro_image_2").setOrigin(0.65,1).setScale(0.4)
        this.menuPJA = scene.add.image(0, height / 2, "intro_image_1").setOrigin(0.75,0.65).setScale(0.4)


        // this.menuPJA.setScale(0.9).setPosition(-(width /6),0)
        // this.menuPJB.setScale(0.9).setPosition(-(width /6),0)
        // this.menuPJC.setScale(0.7).setPosition(-(width /6),0).setAlpha(0)

        // this.menuPJA.setOrigin(0.5,1).setPosition(0,height /2).setScale(0.5)
        // this.menuPJB.setOrigin(0.5,1).setPosition(0,height /2).setScale(0.5)
        // this.menuPJC.setOrigin(0.5,1).setPosition(0,height /2).setAlpha(0).setScale(0.5)
        // Comentado para la demo por call 23/12
        /*this.scene.tweens.add({
            targets:[this.menuClouds],
            rotation: '+=.05',
            duration: 10000,
            hold: 500,
            yoyo: true,
            ease: 'ease',
            loop: -1,
        }) */

        // add bounce effect for logo appear

       


        this.scene.tweens.add({
            targets:[this.menuLights],
            rotation: '+=.03',
            duration: 8000,
            hold: 333,
            yoyo: true,
            ease: 'ease',
            loop: -1,
        })

        // add tiny scale out for all background to make it look like a parallax effect

        this.scene.tweens.add({
            targets: [this.menuSky, this.menuClouds, this.menuCity, this.menuLights],
            scale: 1,
            duration: 10000,
            hold: 500,
            yoyo: true,
            ease: 'ease',
            loop: -1,
        })

        // add tiny scale in effect for player 

        // this.scene.tweens.add({
        //     targets: [this.menuPJC],
        //     scale: this.menuPJC.scale + 0.2,
        //     duration: 8000,
        //     hold: 500,
        //     yoyo: true,
        //     ease: 'ease',
        //     loop: -1,
        // })
        this.scene.tweens.add({
            targets: [this.menuPJA],
            scale: this.menuPJA.scale + 0.08,
            x: "-=20",
            duration: 10000,
            hold: 500,
            yoyo: true,
            ease: 'ease',
            loop: -1,
        })

        this.scene.tweens.add({
            targets: [this.menuPJB],
            scale: this.menuPJB.scale - 0.05,
            y: "+=10",
            duration: 8000,
            hold: 500,
            yoyo: true,
            ease: 'ease',
            loop: -1,
        })

        this.scene.tweens.add({
            targets: [this.menuPJC],
            alpha: 1,
            duration: 300,
            hold: 500,
            yoyo: false,
            ease: 'ease',
        })

        // this.scene.tweens.add({
        //     targets: [this.logo],
        //     scale: 0,
        //     alpha: 0,
        //     duration: 10,
        //     ease: Phaser.Math.Easing.Cubic.Out,
        //     forward: true,
        // })


        // add event after 3 seconds

        this.scene.time.addEvent({
            delay: 3000,
            callback: () => {
                this.scene.tweens.add({
                    targets: [this.logo],
                    scale: 1.3,
                    alpha: 1,
                    duration: 800,
                    forward: true,
                    ease: Phaser.Math.Easing.Cubic.Out,
                })
            }
        })

       
        this.add(container);
        this.add([this.menuPJC,this.menuPJB,this.menuPJA])
        this.scene.add.existing(this)
    }
}