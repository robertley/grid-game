import { Injectable, Injector } from "@angular/core";
import { Coin } from "../classes/coin.class";
import { BasicEnemy } from "../classes/enemies/basic.enemy";
import { BouncerEnemy } from "../classes/enemies/bouncer.enemy";
import { MiniSniper } from "../classes/enemies/mini-sniper.enemy";
import { TeleporterEnemy } from "../classes/enemies/teleporter.enemy";
import { Enemy } from "../classes/enemy.class";
import { Player } from "../classes/player.class";
import { TileObject } from "../classes/tile-object.class";
import { Tile } from "../classes/tile.class";
import { KEY_CODE } from "../enums/key-code.enum";
import { Coordinate } from "../interfaces/coordinate.interface";
import { Game } from "../interfaces/game.interface";
import { Grid } from "../interfaces/grid.interface";
import { KeyboardService } from "./keyboard.service";
import { ObjectService } from "./object.service";

@Injectable({
    providedIn: 'root'
})
export class GameService {
    
    game: Game;
    grid: Grid;
    player: Player;

    gameWidth = 20;
    gameHeight = 20;

    gameIsRunning = false;

    tickRate = 100;
    tickNumber = 0;
    levelLength = 150;
    windowIntervalObject: any;

    constructor(private keyboardService: KeyboardService, private objectService: ObjectService) {

        this.grid = this.getNewGrid();

        this.initializeGame();
    }

    initializeGame() {
        this.player = new Player(this, this.objectService);

        this.game = {
            grid: this.grid,
            player: this.player,
            coinRate: 80,
            score: 0,
            scoreMultiplier: 1,
            enemySpawnRate: 50, // 50
            level: 0
        }

        this.objectService.initObjectService(this.grid);

        this.objectService.addObject(10, 10, this.player);
    }

    getNewGrid(): Grid {
        let grid: Grid;
        let tiles: Tile[][] = [];

        for (let y = 0; y < this.gameWidth; y++) {
            let row: Tile[] = [];
            for (let x = 0; x < this.gameHeight; x++) {
                row.push(new Tile(x, y))
            }
            tiles.push(row);
        }

        let hiddenTiles: Tile[][] = [[], [], [], []];

        for (let y = 0; y < this.gameWidth; y++) {
            let row1 = hiddenTiles[1]
            let row2 = hiddenTiles[3]
            
            row1.push(new Tile(-1, y, 1));
            row2.push(new Tile(-1, y, 3));
        }
        for (let x = 0; x < this.gameHeight; x++) {
            let row1 = hiddenTiles[0]
            let row2 = hiddenTiles[2]
            
            row1.push(new Tile(x, -1, 0));
            row2.push(new Tile(x, -1, 2));
        }

        grid = {
            tiles: tiles,
            hiddenTiles: hiddenTiles
        }

        console.log(grid)

        return grid;
    }

    startGame() {
        this.gameIsRunning = true;
        this.windowIntervalObject = window.setInterval(this.gameLoop.bind(this), this.tickRate)

        // this.objectService.addHiddenObject(2, 1, new MiniSniper(this,this.objectService));
        // this.objectService.addHiddenObject(0, 1, new MiniSniper(this,this.objectService));
        // this.objectService.addHiddenObject(1, 1, new MiniSniper(this,this.objectService));
        // this.objectService.addHiddenObject(2, 1, new MiniSniper(this,this.objectService));
        // this.objectService.addHiddenObject(3, 1, new MiniSniper(this,this.objectService));

        console.log(this.grid)
    }

    gameLoop() {
        this.calculateInput();
        this.calculateEnemyMovements();
        this.calculateCollisions();
        this.calculateEnemySpawn();

        if (this.tickNumber % this.game.coinRate == 0) {
            let coin = new Coin(this, this.objectService);
            coin.spawn();
        }


        this.game.scoreMultiplier = 1 + ((this.game.level + this.objectService.enemies.size) * .1)

        this.addToScore(1);

        this.checkLevelUp();

        this.tickNumber++;
    }

    calculateInput() {
        // console.log(this.keyboardService.registeredKeys)
        // console.log("calculating input")
        for (let [key, value] of this.keyboardService.registeredKeys) {
            switch (key) {
                case KEY_CODE.UP_ARROW:
                    this.player.moveUp();
                    break;
                case KEY_CODE.W:
                    this.player.moveUp();
                    break;
                case KEY_CODE.DOWN_ARROW:
                    this.player.moveDown();
                    break;
                case KEY_CODE.S:
                    this.player.moveDown();
                    break;
                case KEY_CODE.LEFT_ARROW:
                    this.player.moveLeft();
                    break;
                case KEY_CODE.A:
                    this.player.moveLeft();
                    break;
                case KEY_CODE.RIGHT_ARROW:
                    this.player.moveRight();
                    break;
                case KEY_CODE.D:
                    this.player.moveRight();
                    break;
            }
        }
    }

    calculateEnemyMovements() {
        for (let [key, enemy] of this.objectService.enemies) {
            if (this.tickNumber % enemy.movementSpeed == 0) {
                enemy.move();
            }
        }
    }

    calculateCollisions() {
        // console.log(this.objectService.objects)
        for (let [id, object] of this.objectService.objects) {
            if (object.location.objects.length > 1) {
                object.onCollision();
            }
        }
    }

    calculateEnemySpawn() {
        if (this.tickNumber % this.game.enemySpawnRate == 0) {
            
            let r = Math.floor(Math.random() * 10);
            if (r < 5) {
                this.randomSpawn(new BasicEnemy(this, this.objectService))
            } else if (r < 9) {
                this.randomSpawn(new BouncerEnemy(this, this.objectService))
            } else {
                this.randomSpawn(new TeleporterEnemy(this, this.objectService))
            }

        }
    }

    checkLevelUp() {
        if (this.tickNumber % this.levelLength == 0) {
            if (this.game.level > 0) {
                // this.game.scoreMultiplier += .1;
            }
            this.game.level++;
        }
    }

    randomSpawn(obj: TileObject){

        let coordinate = this.getRandomCoordinate(2, 2);

        this.objectService.addObject(coordinate.x, coordinate.y, obj);
    }

    reset() {
        this.objectService.clearObjects();
        this.gameIsRunning = false;
        this.tickNumber = 0;
        window.clearInterval(this.windowIntervalObject);
        this.keyboardService.clearKeys();
        this.initializeGame();

    }

    getRandomCoordinate(padX?: number, padY?: number): Coordinate {
       let coordinate: Coordinate = {
           x: Math.floor(Math.random() * (this.gameWidth - 1)),
           y: Math.floor(Math.random() * (this.gameHeight - 1))
       }

       padX = padX ?? 0;
       padY = padY ?? 0;

       while (Math.abs(this.player.location.x - coordinate.x) < padX ||
            Math.abs(this.player.location.y - coordinate.y) < padY) {

            coordinate = {
                x: Math.floor(Math.random() * (this.gameWidth - 1)),
                y: Math.floor(Math.random() * (this.gameHeight - 1))
            }
        }

       return coordinate;
    }

    getTile(x: number, y: number) {
        return this.grid.tiles[y][x];
    }

    addToScore(amt: number) {
        this.game.score = this.game.score + (amt * this.game.scoreMultiplier);
    }
}

