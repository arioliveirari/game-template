import Phaser from "phaser";
import EventsCenterManager from "../../services/eventsServices/EventsCenterService";
import GenericButton from "@/game/assets/genericButton";

export default class MainScene extends Phaser.Scene {

  eventCenter = EventsCenterManager.getInstance();
  player: Phaser.GameObjects.Rectangle | null = null;
  matrix: number[][] = [];
  tileSize: number = 100;
  constructor() {
    super({key: "MainScene", active: false});
  }

  create() {
    console.log("CREO LA MAINS CENE")

  
    
    // draw a chess board with phaser graphics , using the total of the screen and adding the tiles into a new matrix variable
   

    // draw the player in one random position of the matrix
    this.drawChessBoard();
    this.drawPlayerInRandomPosition();
    this.highlightHorseMoves();
    
  }
  
  restart() {
    this.highlightHorseMoves();
  }

  highlightHorseMoves() {
    if(!this.player) return;
    const playerX = Math.floor(this.player.x / this.tileSize);
    const playerY = Math.floor(this.player.y / this.tileSize);
    const moves = [
      [playerX + 1, playerY + 2],
      [playerX + 2, playerY + 1],
      [playerX + 2, playerY - 1],
      [playerX + 1, playerY - 2],
      [playerX - 1, playerY - 2],
      [playerX - 2, playerY - 1],
      [playerX - 2, playerY + 1],
      [playerX - 1, playerY + 2],
    ];
    const graphics = this.add.graphics();
    const offsetX = (window.innerWidth - this.matrix[0].length * this.tileSize) / 2;
    const offsetY = (window.innerHeight - this.matrix.length * this.tileSize) / 2;
    moves.forEach((move) => {
      const x = move[0] * this.tileSize + offsetX;
      const y = move[1] * this.tileSize + offsetY;
      if (move[0] >= 0 && move[0] < this.matrix[0].length && move[1] >= 0 && move[1] < this.matrix.length) {
        graphics.fillStyle(0x00ff00, 0.5);
        graphics.fillRect(x, y, this.tileSize, this.tileSize);
        graphics.lineStyle(2, 0x00ff00, 1);
        graphics.strokeRect(x, y, this.tileSize, this.tileSize);
      }
    });

    // add interactivity to the highlighted squares
    graphics.setInteractive(new Phaser.Geom.Rectangle(0, 0, window.innerWidth, window.innerHeight), Phaser.Geom.Rectangle.Contains);
    graphics.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      const x = Math.floor((pointer.x - offsetX) / this.tileSize);
      const y = Math.floor((pointer.y - offsetY) / this.tileSize);
      if (x >= 0 && x < this.matrix[0].length && y >= 0 && y < this.matrix.length) {
        // check if the clicked square is a valid move
        const isValidMove = moves.some((move) => move[0] === x && move[1] === y);
        if (!isValidMove) return;
        this.player?.setPosition(x * this.tileSize + offsetX, y * this.tileSize + offsetY);
        graphics.clear();
        this.restart()
      }
    });
  }

  drawChessBoard() {
    const graphics = this.add.graphics();
    const rows = Math.floor(window.innerHeight / this.tileSize);
    const cols = Math.floor(window.innerWidth / this.tileSize);
    this.matrix = [];
    // algin the matrix to the center of the screen
    const offsetX = (window.innerWidth - cols * this.tileSize) / 2;
    const offsetY = (window.innerHeight - rows * this.tileSize) / 2;
    graphics.setPosition(offsetX, offsetY);
    for (let i = 0; i < rows; i++) {
      const row: number[] = [];
      for (let j = 0; j < cols; j++) {
        const x = j * this.tileSize;
        const y = i * this.tileSize;
        const color = (i + j) % 2 === 0 ? 0x000000 : 0xffffff;
        graphics.fillStyle(color, 1);
        graphics.fillRect(x, y, this.tileSize, this.tileSize);
        row.push(color);
      }
      this.matrix.push(row);
    }
  }

  drawPlayerInRandomPosition() {
    const randomRow = Math.floor(Math.random() * this.matrix.length);
    const randomCol = Math.floor(Math.random() * this.matrix[0].length);
    const rows = Math.floor(window.innerHeight / this.tileSize);
    const cols = Math.floor(window.innerWidth / this.tileSize);
    const offsetX = (window.innerWidth - cols * this.tileSize) / 2;
    const offsetY = (window.innerHeight - rows * this.tileSize) / 2;
    const x = randomCol * 100 ;
    const y = randomRow * 100 ;
    this.player = this.add.rectangle(x + offsetX, y + offsetY, 100, 100, 0xff0000).setOrigin(0, 0).setAlpha(1).setVisible(true);
    this.physics.add.existing(this.player);
    this.physics.world.gravity.y = 0;
  }

  testCallback() {
    this.eventCenter.emitEvent(
      this.eventCenter.possibleEvents.CHANGE_SCENE,
      {
        sceneToStart: "MenuScene",
        sceneToStop: "MainScene",
        dataToPass: { test: "test" }
      }
    );
  }

  update() {

  }
}
