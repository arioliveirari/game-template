import Phaser from "phaser";
import RPG from "@/game/rpg";
import EventsCenterManager from "../../services/EventsCenter";
import { globalState } from "@/game/GlobalDataManager";


export class Timer extends Phaser.GameObjects.Container {

  constructor(
    scene: RPG,
    x: number,
    y: number,
  ) {
    super(scene, x, y);

    const graphics = this.scene.add.graphics()
    graphics.lineStyle(4, 0xffffff, 1);
    graphics.strokeRoundedRect(-75, -30, 120, 60, 15);

    const timer = this.scene.add.image(-40, 0, "reloj").setOrigin(0.5)
    const timerCounter = this.scene.add.text(0, 0, "0", {
      fontSize: 40,
      fontStyle: "bold"
    }).setOrigin(0, 0.5)

    const timerCall = this.scene.time.addEvent({
      delay: 1000, // ms
      callback: () => {
        timerCounter.setText((Number(timerCounter.text) + 1).toString())
        const count = Number(timerCounter.text)
        if (count > 9 && count <= 99) {
          graphics.clear()
          graphics.lineStyle(4, 0xffffff, 1);
          graphics.strokeRoundedRect(-75, -30, 140, 60, 15);
        } else if (count === 100 && count <= 999) {
          graphics.clear()
          graphics.lineStyle(4, 0xffffff, 1);
          graphics.strokeRoundedRect(-75, -30, 170, 60, 15);
        } else if (count > 999) {
          graphics.clear()
          graphics.lineStyle(4, 0xffffff, 1);
          graphics.strokeRoundedRect(-75, -30, 200, 60, 15);
        }
      },
      callbackScope: this,
      loop: true,
    });


    this.add([
      graphics,
      timer,
      timerCounter
    ])
  }
}

export class Avatar extends Phaser.GameObjects.Container {
  scene: RPG;
  // avatarStats: Phaser.GameObjects.Image;
  navbarBackground: Phaser.GameObjects.Image;
  moodLine: Phaser.GameObjects.Image;
  // avatarGlow: Phaser.GameObjects.Image;
  avatar: Phaser.GameObjects.Image;
  avatarEmoji: Phaser.GameObjects.Image;
  reputationIcon: Phaser.GameObjects.Image;
  eventCenter = EventsCenterManager.getInstance();
  mood: 0 | 1 | 2 = 0;
  moodText: Phaser.GameObjects.Text;
  // happinessBackgound: Phaser.GameObjects.Arc;
  reputationText: Phaser.GameObjects.Text;
  // money: Phaser.GameObjects.Text;
  avatarChosen: string = 'avatar1'
  inversionBubbleNumber?: Phaser.GameObjects.Text;
  bubble?: Phaser.GameObjects.Image;
  iconInvestment?: Phaser.GameObjects.Image;
  coinHolder: CoinsHolder;
  scaleFactor: number = window.innerWidth / 1920;

  fuelIcon: Phaser.GameObjects.Image;
  fuelText: Phaser.GameObjects.Text;
  dayBlock: DayBlock;
  constructor(
    scene: RPG,
    x: number,
    y: number,
    globalData: globalState
  ) {
    super(scene, x, y);
    this.scene = scene;
    this.mood = globalData.happiness.actualValue < 50 ? 0 : globalData.happiness.actualValue < 80 ? 1 : 2

   
    this.eventCenter.turnEventOn("RPG", this.eventCenter.possibleEvents.UPDATE, (data: any) => {

    }, this.scene)

    this.dayBlock = new DayBlock(this.scene, 1920 / 2, 0, globalData)
    // this.scene.tweens.add({
    //   targets: this.dayBlock,
    //   y: 0,
    //   duration: 2000,
    //   delay: 1200,
    //   ease: 'bounce',
    // })
    this.navbarBackground = this.scene.add.image(0, 0, 'navBarBg').setOrigin(0)
    this.moodLine = this.scene.add.image(0, 0, this.mood === 2 ? 'navLineGreen' : this.mood === 1 ? "navLineYellow" : "navLineRed").setOrigin(0)
    this.avatar = this.scene.add.image(0, 0, this.mood === 2 ? 'avatar1Happy' : this.mood === 1 ? "avatar1Normal" : "avatar1Sad").setOrigin(0)
    this.avatarEmoji = this.scene.add.image(110, 20, this.mood === 2 ? 'UIStateHappy' : this.mood === 1 ? "UIStateNormal" : "UIStateSad").setOrigin(0)
    this.moodText = this.scene.add.text(167, 38, globalData.happiness.actualValue.toString(), {
      fontSize: 22,
      fontStyle: "bold"
    }).setOrigin(0, 0.5)

    this.reputationIcon = this.scene.add.image(259, 35, 'reputationIcon').setOrigin(1, 0.5).setScale(0.8)
    this.reputationText = this.scene.add.text(265, 35, globalData.reputation.toString(), {
      fontSize: 30,
      fontStyle: "bold"
    }).setOrigin(0, 0.5)

    // how to call a enterpre
    this.fuelIcon = this.scene.add.image(420, 35, 'coffePin').setOrigin(1, 0.5).setScale(0.6)
    this.fuelText = this.scene.add.text(430, 35, globalData.inventary.businessFuel.toString(), {
      fontSize: 30,
      fontStyle: "bold"
    }).setOrigin(0, 0.5)
    
    if (globalData.inversionModule.isActive) {
      this.fuelIcon.setVisible(true)
      this.fuelText.setVisible(true)
    }
    this.coinHolder = new CoinsHolder(scene, 0, 0, globalData)
    this.coinHolder.setPosition(1920 - this.coinHolder.containerWidth, 35)

    this.add([
      this.navbarBackground,
      this.moodLine,
      this.avatar,
      this.avatarEmoji,
      this.moodText,
      this.reputationIcon,
      this.reputationText,
      this.fuelIcon,
      this.fuelText,
      this.coinHolder,
      this.dayBlock
    ])

    this.setScale(this.scaleFactor)
  }

  createDayBlock(data: globalState) {
    this.scene.tweens.add({
      targets: this.dayBlock,
      y: -200,
      duration: 1000,
      delay: 0,
      onComplete: () => {
        this.dayBlock.removeAll(true)
        this.dayBlock.destroy()
        this.dayBlock = new DayBlock(this.scene, 1920 / 2, -200, data)
        this.add(this.dayBlock)
        this.scene.tweens.add({
          targets: this.dayBlock,
          y: 0,
          duration: 1000,
          delay: 0,
          ease: 'bounce',
        })
      },
      ease: 'bounce',
    })
  }

  setHead(avatar: string) {
    console.log("que llego", avatar)
    if(avatar === '01') this.avatarChosen = 'avatar2'
    if(avatar === '02') this.avatarChosen = 'avatar1'
    if(avatar === '03') this.avatarChosen = 'avatar3'
    
    const headMap = {
      "01": "avatar2" + (this.mood === 2 ? 'Happy' : this.mood === 1 ? "Normal" : "Sad"),
      "02": "avatar1" + (this.mood === 2 ? 'Happy' : this.mood === 1 ? "Normal" : "Sad"),
      "03": "avatar3" + (this.mood === 2 ? 'Happy' : this.mood === 1 ? "Normal" : "Sad"),
    }
    //@ts-ignore
    this.avatar.setTexture(headMap[avatar] ?? 'avatar1Happy')
    
    
  }

  animNumber(target: Phaser.GameObjects.Text) {
    this.scene.tweens.add({
      targets: target,
      scale: 1.1,
      duration: 300,
      yoyo: true,
      repeat: 0
    })
  }

  updateValues(data: globalState) {
    this.dayBlock.updateValues(data)
    this.mood = data.happiness.actualValue < 50 ? 0 : data.happiness.actualValue < 80 ? 1 : 2
    if (this.reputationText.text !== data.reputation.toString()) {
      this.reputationText.setText(Math.round(data.reputation).toString())
      this.animNumber(this.reputationText)
    }

    if (this.fuelText.text !== data.inventary.businessFuel.toString()) {
      this.fuelText.setText(Math.round(data.inventary.businessFuel).toString())
      this.animNumber(this.fuelText)
    }
    if (data.inversionModule.isActive) {
      this.fuelIcon.setVisible(true)
      this.fuelText.setVisible(true)
    } else {
      this.fuelIcon.setVisible(false)
      this.fuelText.setVisible(false)
    }
    this.coinHolder.updateValues(data)
    this.moodLine.setTexture(this.mood === 0 ? 'navLineRed' : this.mood === 1 ? "navLineYellow" : "navLineGreen")
    // this.avatar.setTexture(this.mood === 0 ? this.avatarChosen + 'Sad' : this.mood === 1 ? this.avatarChosen + 'Normal' : this.avatarChosen + 'Happy')
    let avatar = "01" 
    if(this.avatarChosen == 'avatar2') avatar = "01"
    if(this.avatarChosen == 'avatar1') avatar = "02"
    if(this.avatarChosen == 'avatar3') avatar = "03"

    console.log("ACA QUE LLEGO",avatar)
    this.setHead(avatar)
    
    this.avatarEmoji.setTexture(this.mood === 0 ? 'UIStateSad' : this.mood === 1 ? 'UIStateNormal' : 'UIStateHappy')
  }
}


export class CoinsHolder extends Phaser.GameObjects.Container {
  coinDigitalIcon: Phaser.GameObjects.Image;
  coinDigitalText: Phaser.GameObjects.Text;
  coinCommonIcon: Phaser.GameObjects.Image;
  coinCommonText: Phaser.GameObjects.Text;
  coinInversionIcon: Phaser.GameObjects.Image;
  coinInversionText: Phaser.GameObjects.Text;
  containerWidth: number = 0;
  eventCenter = EventsCenterManager.getInstance();
  constructor(
    scene: RPG,
    x: number,
    y: number,
    globalData: globalState
  ) {
    super(scene, x, y);
    this.coinDigitalIcon = this.scene.add.image(0, 0, 'iconDigital').setOrigin(1, .5).setScale(.8)
    this.coinDigitalText = this.scene.add.text(15, 0, globalData.inventary.physicalMoney.toString(), {
      fontSize: 30,
      fontStyle: "bold"
    }).setOrigin(0, .5)
    const digitalContainer = this.scene.add.container(0, 0, [this.coinDigitalIcon, this.coinDigitalText])
    this.coinCommonIcon = this.scene.add.image(0, 0, 'iconCommon').setOrigin(1, .5).setScale(.8)
    this.coinCommonText = this.scene.add.text(15, 0, globalData.inventary.digitalMoney.toString(), {
      fontSize: 30,
      fontStyle: "bold"
    }).setOrigin(0, .5)
    const commonContainer = this.scene.add.container(0, 0, [this.coinCommonIcon, this.coinCommonText])
    this.coinInversionIcon = this.scene.add.image(0, 0, 'iconInversion').setOrigin(1, .5).setScale(.8)
    this.coinInversionText = this.scene.add.text(-5, 0, globalData.inversionModule.totalInvested.toString(), {
      fontSize: 30,
      fontStyle: "bold"
    }).setOrigin(0, .5)
    const inversionContainer = this.scene.add.container(0, 0, [this.coinInversionIcon, this.coinInversionText])

    const group = this.scene.add.group()
    group.addMultiple([
      digitalContainer,
      commonContainer,
      inversionContainer,
    ])

    Phaser.Actions.GridAlign(group.getChildren(), {
      width: 3,
      height: 1,
      cellWidth: 200,
      cellHeight: 50,
      x: 0,
      y: 0
    })

    this.containerWidth = this.coinInversionText.getBounds().right - this.coinDigitalIcon.getBounds().left
    this.add([
      digitalContainer,
      commonContainer,
      inversionContainer,
    ])
  }
  animNumber(target: Phaser.GameObjects.Text) {
    this.scene.tweens.add({
      targets: target,
      scale: 1.2,
      duration: 150,
      yoyo: true,
      repeat: 1
    })
  }

  updateValues(data: globalState) {
    if (this.coinDigitalText.text !== data.inventary.digitalMoney.toString()) {
      this.coinDigitalText.setText(Math.round(data.inventary.digitalMoney).toString())
      this.animNumber(this.coinDigitalText)
    }
    if (this.coinCommonText.text !== data.inventary.physicalMoney.toString()) {
      this.coinCommonText.setText(Math.round(data.inventary.physicalMoney).toString())
      this.animNumber(this.coinCommonText)
    }
    if (this.coinInversionText.text !== data.inversionModule.totalInvested.toString()) {
      this.coinInversionText.setText(Math.round(data.inversionModule.totalInvested).toString())
      this.animNumber(this.coinInversionText)
    }
    // this.coinDigitalText.setText(data.inventary.digitalMoney.toString())
    // this.coinCommonText.setText(data.inventary.physicalMoney.toString())
    // this.coinInversionText.setText(data.inversionModule.totalInvested.toString())
  }
}


export class DayBlock extends Phaser.GameObjects.Container {
  startStaticDayBlock: Phaser.GameObjects.Image;
  endStaticDayBlock: Phaser.GameObjects.Image;
  lineBackgroundDayBlock: Phaser.GameObjects.Image;
  dayBlock1: Phaser.GameObjects.Image;
  dayBlock2: Phaser.GameObjects.Image;
  dayBlock3: Phaser.GameObjects.Image;
  dayBlock4: Phaser.GameObjects.Image;
  flecha: Phaser.GameObjects.Image;
  // timerCall: Phaser.Time.TimerEvent;
  eventCenter = EventsCenterManager.getInstance();
  momentOfDay: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 = 1;

  constructor(
    scene: RPG,
    x: number,
    y: number,
    globalData: globalState
  ) {
    super(scene, x, y);
    this.momentOfDay = globalData.timeOfDay

    this.lineBackgroundDayBlock = this.scene.add.image(0, 40, 'lineBarDayBlocks').setScale(1,0.6);
    this.startStaticDayBlock = this.scene.add.image(-170, 40, 'startMoonLineBar');
    this.endStaticDayBlock = this.scene.add.image(170, 40, 'endMorningLineBar');

    this.dayBlock1 = this.scene.add.image(0, 0, 'iconEmptyMorning')
    const widthBlock = this.dayBlock1.width
    const heightBlock = this.dayBlock1.height
    this.dayBlock1.setPosition(-widthBlock * 1.5 - 30, heightBlock / 2 + 15)
    this.dayBlock2 = this.scene.add.image(-widthBlock * .5 - 10, heightBlock / 2 + 15, 'iconEmptyMediodia')
    this.dayBlock3 = this.scene.add.image(widthBlock * .5 + 10, heightBlock / 2 + 15, 'iconEmptyTarde')
    this.dayBlock4 = this.scene.add.image(widthBlock * 1.5 + 30, heightBlock / 2 + 15, 'iconEmptyNoche')
    const momentsWorld1 = [
      this.dayBlock1.x,
      this.dayBlock2.x,
      this.dayBlock3.x,
      this.dayBlock4.x,
    ]

    const momentsWorld2 = [
      this.dayBlock1.x,
      this.dayBlock1.x,
      this.dayBlock2.x,
      this.dayBlock2.x,
      this.dayBlock3.x,
      this.dayBlock3.x,
      this.dayBlock4.x,
      this.dayBlock4.x,
    ]
    this.flecha = this.scene.add.image(globalData.inversionModule.isActive ? momentsWorld2[globalData.timeOfDay - 1] : momentsWorld1[globalData.timeOfDay - 1], 85, 'flecha').setOrigin(0.5).setFlipY(true)

    this.add([
      this.lineBackgroundDayBlock,
      this.startStaticDayBlock,
      this.endStaticDayBlock,
      this.dayBlock1,
      this.dayBlock2,
      this.dayBlock3,
      this.dayBlock4,
      this.flecha
    ])

    this.setActiveBlock(globalData.timeOfDay, globalData)
  }

  updateValues(data: globalState) {

    const momentsWorld1 = [
      this.dayBlock1.x,
      this.dayBlock2.x,
      this.dayBlock3.x,
      this.dayBlock4.x,
    ]

    const momentsWorld2 = [
      this.dayBlock1.x,
      this.dayBlock1.x,
      this.dayBlock2.x,
      this.dayBlock2.x,
      this.dayBlock3.x,
      this.dayBlock3.x,
      this.dayBlock4.x,
      this.dayBlock4.x,
    ]


    this.setActiveBlock(data.timeOfDay, data)
    const possiblePositions = data.inversionModule.isActive ? momentsWorld2 : momentsWorld1
    this.scene.tweens.add({
      targets: this.flecha,
      x: possiblePositions[data.timeOfDay - 1],
      duration: 200,
      ease: 'ease',
      repeat: 0
    })
  }

  setActiveBlock(blockDay: number, data: globalState) {
    this.dayBlock1.setTexture("iconEmptyMorning")
    this.dayBlock2.setTexture("iconEmptyMediodia")
    this.dayBlock3.setTexture("iconEmptyTarde")
    this.dayBlock4.setTexture("iconEmptyNoche")
    const possibleCases = data.inversionModule.isActive ? [1, 2, 3, 4, 5, 6, 7, 8] : [1, 2, 3, 4]
    // if possibleCases length is 4 then set texture to full to blocks according to the time of day
    if (possibleCases.length === 4) {
      switch (blockDay) {
        case 1:
          this.dayBlock1.setTexture("iconFullMorning")
          break;
        case 2:
          this.dayBlock1.setTexture("iconFullMorning")
          this.dayBlock2.setTexture("iconFullMediodia")
          break;
        case 3:
          this.dayBlock1.setTexture("iconFullMorning")
          this.dayBlock2.setTexture("iconFullMediodia")
          this.dayBlock3.setTexture("iconFullTarde")
          break;
        case 4:
          this.dayBlock1.setTexture("iconFullMorning")
          this.dayBlock2.setTexture("iconFullMediodia")
          this.dayBlock3.setTexture("iconFullTarde")
          this.dayBlock4.setTexture("iconFullNoche")
          break;
      }
    } else {
      switch (blockDay) {
        case 1:
          this.dayBlock1.setTexture("iconMidMorning")
          break;
        case 2:
          this.dayBlock1.setTexture("iconFullMorning")
          break;
        case 3:
          this.dayBlock1.setTexture("iconFullMorning")
          this.dayBlock2.setTexture("iconMidMediodia")
          break;
        case 4:
          this.dayBlock1.setTexture("iconFullMorning")
          this.dayBlock2.setTexture("iconFullMediodia")
          break;
        case 5:
          this.dayBlock1.setTexture("iconFullMorning")
          this.dayBlock2.setTexture("iconFullMediodia")
          this.dayBlock3.setTexture("iconMidTarde")
          break;
        case 6:
          this.dayBlock1.setTexture("iconFullMorning")
          this.dayBlock2.setTexture("iconFullMediodia")
          this.dayBlock3.setTexture("iconFullTarde")
          break;
        case 7:
          this.dayBlock1.setTexture("iconFullMorning")
          this.dayBlock2.setTexture("iconFullMediodia")
          this.dayBlock3.setTexture("iconFullTarde")
          this.dayBlock4.setTexture("iconMidNoche")
          break;
        case 8:
          this.dayBlock1.setTexture("iconFullMorning")
          this.dayBlock2.setTexture("iconFullMediodia")
          this.dayBlock3.setTexture("iconFullTarde")
          this.dayBlock4.setTexture("iconFullNoche")
          break;
        default:
          break;
      }
    }
  }

  passTime(amount: number) {

  }
}