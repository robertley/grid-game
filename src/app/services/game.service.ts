import { Injectable, Injector } from "@angular/core";
import { Coin } from "../classes/coin.class";
import { BasicEnemy } from "../classes/enemies/basic.enemy";
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
            coinRate: 50,
            score: 0,
            scoreMultiplier: 1,
            enemySpawnRate: 50,
            level: 1
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

        grid = {
            tiles: tiles
        }

        return grid;
    }

    startGame() {
        let enemy = new BasicEnemy(this, this.objectService);
        this.randomSpawn(enemy);
        this.gameIsRunning = true;
        this.windowIntervalObject = window.setInterval(this.gameLoop.bind(this), this.tickRate)
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


        this.game.score += this.game.scoreMultiplier;

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
            this.randomSpawn(new BasicEnemy(this, this.objectService))
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
        this.game.score += amt;
    }
}

