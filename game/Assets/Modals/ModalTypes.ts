import { configMinigame } from "@/game/maps/mapCreationFunctions";

export type ProductToBuy = {
  id: number
  title: string
  picture: string
  pictureOn: string
  text: string
  reward: number
  isSelected?: boolean
  roomInformation?: {
    assetInRoom: string
    frontContainer: boolean
  }
}

export type Inventory = {
  id: number
  title: string
  image: string
  description: string
  price: number
  roomInformation?: {
    assetInRoom: string
    frontContainer: boolean
  }
}

export type InventoryType = {
  physicalMoney: number
  digitalMoney: number
  investedMoney: number
  businessFuel: number
  items: Item[]
}

export type Item = {
  id: number
  name: string
  buyPrice: number 
  sellPrice: number
  description: string | null
  imageInInventory: string | null
  imageInRoom: string | null
  imageInStore: string | null
  imageInMission: string | null
  type: string | null
  inInventory: boolean | null
  inStore: boolean | null
  requirement: number[]
  amount: number
  life?: number
}

export enum modalType {
  QUEST,
  PC,
  NEWS,
  PHONE,
  FORM,
  CITIES,
  FINISH,
  BUYROOMCOFFE,
  TRADE,
  WORLD,
  MECHANIC,
  TROFIES
}

export type ModalConfig = {
  type: modalType;
  requires?: string;
  requirePicture?: string;
  requirements: number[];
  title: string;
  time: number;
  picture?: string;
  text?: string;
  reward: rewardType;
  configMinigame?: configMinigame;
  agreedButtom?: any;
  closeButtom?: any;
  background?: Phaser.GameObjects.Image;
  products?: ProductToBuy[];
  subModal?: ModalConfig;
  agreeFunction: Function;
};

export type rewardType = {
  id: number
  money: number
  reputation: number
  happiness: number
  items?: number[]
}

export type newsType = {
  id: number
  title: string
  missionId: number[]
  image: string
  time: number | null
  description: string
  rewardId: number | null,
  requirements: number[] | null,
  readed: boolean
}

export type configMinigameType = {
  id: number
  type: string
  itemsId: number[]
}

export type configMiniGameScene = {
  id: number,
  miniGameName: string
}


export type questionFormsType = {
  id: number
  type: string
  imageForm: string | null
  question: string
  answers: string[]
  correctAnswer: string[]
}

export type missionsType = {
  id: number
  title: string
  requirements: number[]
  picture: string
  time: number
  description: string
  shortDescription?: string
  rewardId: number
  available: boolean
  done: boolean
  inProgress: boolean
  cronometer?: number | null
  startedTime?: number
  isMinigame: boolean
  draw: boolean
  relatedMission: number | null
  configMinigameId: number | null
  keywords: string[] | null
  group: string[]
  isFollowUp: boolean
  takesPlaceOn: string[]
  followUpMission: number[] 
}

export type happinessType = {
  actualValue: number
  maxValue: number
}

export type transactionsType = {
  date: string
  amount: number
  description: string
  type?: 'income' | 'outcome' | 'investment'
}

