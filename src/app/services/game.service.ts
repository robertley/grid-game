import { Injectable, Injector } from "@angular/core";
import { Coin } from "../classes/items/coin.class";
import { Follower } from "../classes/enemies/follower.enemy";
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
import { SuperCoin } from "../classes/items/super-coin.class";
import { Sprinter } from "../classes/enemies/sprinter.enemy";
import { AngryCoin } from "../classes/items/angry-coin.class";
import { LocalStorage } from "../interfaces/local-storage.interface";
import { Heart } from "../classes/items/heart.class";
import { Bullet } from "../classes/projectiles/bullet.class";

@Injectable({
    providedIn: 'root'
})
export class GameService {

    tickModifier = 2;
    
    game: Game;
    grid: Grid;
    player: Player;

    gameWidth = 20;
    gameHeight = 20;

    gameIsRunning = false;

    tickRate = 100 / this.tickModifier;
    tickNumber = 0;
    levelLength = 150 * this.tickModifier;
    windowIntervalObject: any;

    inputStack: KEY_CODE[] = [];
    enemyStack: Enemy[] = [];
    coinStack: Coin[] = [];

    private spawnModifier = 1;

    constructor(private keyboardService: KeyboardService, private objectService: ObjectService) {

        this.grid = this.getNewGrid();

        this.initLocalStorage();

        this.initializeGame();
    }

    initializeGame() {
        this.player = new Player(this, this.objectService);

        this.game = {
            grid: this.grid,
            player: this.player,
            coinRate: 80 * this.tickModifier,
            score: 0,
            scoreMultiplier: 1,
            enemySpawnRate: 50 * this.tickModifier + 1, // 50
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

        // this.objectService.addHiddenObject(0, 1, new MiniSniper(this,this.objectService));
        // this.objectService.addHiddenObject(1, 1, new MiniSniper(this,this.objectService));
        // this.objectService.addHiddenObject(2, 1, new MiniSniper(this,this.objectService));
        // this.objectService.addHiddenObject(3, 1, new MiniSniper(this,this.objectService));

        // this.objectService.addObject(15, 10, new SuperCoin(this, this.objectService));
        // this.objectService.addObject(5, 10, new Heart(this, this.objectService));

        // this.enemyStack.push(new Sprinter(this,this.objectService))
        // this.spawnEnemy();

        console.log(this.grid)
    }

    gameLoop() {
        this.calculateInput();
        this.calculateEnemyMovements();
        this.calculateProjectileMovements();
        this.calculateEnemyAttacks();
        this.calculateCollisions();

        this.calculateEnemySpawn();
        this.calculateCoinSpawn();

        this.game.scoreMultiplier = 1 + ((this.game.level + this.objectService.enemies.size) * .1)

        this.addToScore(1);

        this.checkLevelUp();

        this.doExtraInput();

        this.tickNumber++;
    }

    calculateInput() {
        // console.log(this.keyboardService.registeredKeys)
        // console.log("calculating input")
        if (this.tickNumber % this.player.movementSpeed == 0) {
            for (let [key, value] of this.keyboardService.registeredKeys) {
                switch (key) {
                    case KEY_CODE.UP_ARROW:
                        this.player.moveUp();
                        break;
                    case KEY_CODE.W:
                        if (this.keyboardService.registeredKeys.has(KEY_CODE.UP_ARROW)) {
                            this.inputStack.push(key);
                            break;
                        }
                        this.player.moveUp();
                        break;
                    case KEY_CODE.DOWN_ARROW:
                        this.player.moveDown();
                        break;
                    case KEY_CODE.S:
                        if (this.keyboardService.registeredKeys.has(KEY_CODE.DOWN_ARROW)) {
                            this.inputStack.push(key);
                            break;
                        }
                        this.player.moveDown();
                        break;
                    case KEY_CODE.LEFT_ARROW:
                        this.player.moveLeft();
                        break;
                    case KEY_CODE.A:
                        if (this.keyboardService.registeredKeys.has(KEY_CODE.LEFT_ARROW)) {
                            this.inputStack.push(key);
                            break;
                        }
                        this.player.moveLeft();
                        break;
                    case KEY_CODE.RIGHT_ARROW:
                        this.player.moveRight();
                        break;
                    case KEY_CODE.D:
                        if (this.keyboardService.registeredKeys.has(KEY_CODE.RIGHT_ARROW)) {
                            this.inputStack.push(key);
                            break;
                        }
                        this.player.moveRight();
                        break;
                }
            }
        }
    }

    doExtraInput() {
        for (let input of this.inputStack) {
            switch (input) {
                case KEY_CODE.W:
                    this.player.moveUp();
                    break;
                case KEY_CODE.S:
                    this.player.moveDown();
                    break;
                case KEY_CODE.A:
                    this.player.moveLeft();
                    break;
                case KEY_CODE.D:
                    this.player.moveRight();
                    break;
            }
        }
        // clear
        this.inputStack = [];
    }

    calculateEnemyMovements() {
        for (let [key, enemy] of this.objectService.enemies) {
            if ((this.tickNumber - enemy.spawnTick) % enemy.movementSpeed == 0) {
                enemy.move();
            }
        }
    }

    calculateProjectileMovements() {
        for (let [key, projectile] of this.objectService.projectiles) {
            if ((this.tickNumber - projectile.spawnTick) % projectile.movementSpeed == 0) {
                projectile.move();
            }
        }
    }

    calculateEnemyAttacks() {
        for (let [key, enemy] of this.objectService.enemies) {
            if ((this.tickNumber - enemy.spawnTick) % enemy.attackSpeed == 0) {
                enemy.attack();
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
        if (this.tickNumber % this.enemySpawnRate == 0) {

            this.spawnEnemy();
        }
    }

    spawnEnemy() {
        if (this.enemyStack.length > 0) {
            let enemy = this.enemyStack.shift();
            this.setObjectDiscovered(enemy);

            if (enemy.onHiddenSecton) {
                this.objectService.addHiddenObject(Math.floor((Math.random() * 4)) as 0 | 1 | 2 | 3, this.gameHeight / 2, enemy);
                return;
            }

            this.randomSpawn(enemy);
        }
        
        let Enemy = this.objectService.createLottery(this.objectService.availableEnemies);
        let enemy = new Enemy(this, this.objectService);
        this.setObjectDiscovered(enemy);
        this.randomSpawn(enemy);
    }

    calculateCoinSpawn() {
        if (this.tickNumber % this.coinRate == 0) {
            this.spawnCoin();
        }
    }

    spawnCoin() {
        let coin;
        if (this.coinStack.length > 0) {
            coin = this.coinStack.shift();
        } else {
            let CoinType = this.objectService.createLottery(this.objectService.availableItems);
            coin = new CoinType(this, this.objectService);
        }

        coin.spawn();
    }

    checkLevelUp() {
        if (this.tickNumber % this.levelLength == 0) {

            this.game.level++;

            if (this.game.level == 2) {
                // this.enemyStack.push(new Sprinter(this,this.objectService))
                // this.spawnEnemy();
            }

            if (this.game.level == 5) {
                this.enemyStack.push(new MiniSniper(this,this.objectService));
                this.objectService.availableItems.set(AngryCoin, 2);
            }

            if (this.game.level == 7) {
                this.coinStack.push(new SuperCoin(this,this.objectService))
            }

            if (this.game.level == 8) {
                this.spawnModifier = .75;
                // this.game.coinRate = 80;
                this.spawnCoin();
                this.spawnEnemy();
                this.spawnEnemy();
            }

            if (this.game.level == 9) {
                this.enemyStack.unshift(new Sprinter(this,this.objectService));
                this.spawnEnemy();

                this.objectService.availableEnemies.set(Sprinter, 1);
            }
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

    get enemySpawnRate() {
        return Math.floor(this.game.enemySpawnRate * this.spawnModifier)
    }

    get coinRate() {
        return Math.floor(this.game.coinRate * this.spawnModifier)
    }





    
    // #region local storage

    localStorage: LocalStorage;

    initLocalStorage() {
        window.localStorage.clear();
        // return;
        if (window.localStorage.getItem('gridStorage') == undefined) {
            console.log('setting new local storage');
            let discoverDefault = false;
            let localStorage: LocalStorage = {
                items: [
                    {
                        groupName: "Items",
                        storageItems: [
                            {
                                name: "Coin",
                                discovered: discoverDefault,
                                description: "After collecting does 1 damage to a random enemy.",
                                ...this.getItemStorageData(Coin)
                            },
                            {
                                name: "Angry Coin",
                                discovered: discoverDefault,
                                description: "After collecting does 1 damage to one of the strongest enemies.",
                                ...this.getItemStorageData(AngryCoin)
                            },
                            {
                                name: "Super Coin",
                                discovered: discoverDefault,
                                description: "After collecting does 1 damage to a random enemy five times.",
                                ...this.getItemStorageData(SuperCoin)
                            },
                            {
                                name: "Heart",
                                discovered: discoverDefault,
                                description: "Grants 2 health.",
                                ...this.getItemStorageData(Heart)
                            }
                        ]
                    },
                    {
                        groupName: "Enemies",
                        storageItems: [
                            {
                                name: "Follower",
                                discovered: discoverDefault,
                                description: "He follows ya",
                                ...this.getItemStorageData(Follower)
                            },
                            {
                                name: "Bouncer",
                                discovered: discoverDefault,
                                description: "Bouncey boi",
                                ...this.getItemStorageData(BouncerEnemy)
                            },
                            {
                                name: "Teleporter",
                                discovered: discoverDefault,
                                description: "Checkmate flat-earthers.",
                                ...this.getItemStorageData(TeleporterEnemy)
                            },
                            {
                                name: "Mini Sniper",
                                discovered: discoverDefault,
                                description: "Mini Sniper goes brrrrrrrrrrrr",
                                ...this.getItemStorageData(MiniSniper)
                            },
                            {
                                name: "Bullet",
                                discovered: discoverDefault,
                                description: "pew",
                                ...this.getItemStorageData(Bullet)
                            },
                            {
                                name: "Sprinter",
                                discovered: discoverDefault,
                                description: "He is determined to catch you.",
                                ...this.getItemStorageData(Sprinter)
                            }
                        ]
                    }
                ]
            }
      
            this.localStorage = localStorage;
            this.setLocalStorageToMemory();
        }
      
        this.localStorage = JSON.parse(window.localStorage.getItem('gridStorage'));

        console.log("Local Storage:",this.localStorage)
    }

    
    getItemStorageData(ItemClass: typeof TileObject): any {
        let item = new ItemClass(this, this.objectService);
        return {
            htmlClass: item.getHtmlClass(),
            tag: item.tag
        }
    }

    setLocalStorageToMemory() {
        window.localStorage.setItem('gridStorage', JSON.stringify(this.localStorage))
    }

    setObjectDiscovered(obj: TileObject) {
        let found = false;
        for (let group of this.localStorage.items) {
            for (let item of group.storageItems) {
                if (obj.tag == item.tag) {
                    if (item.discovered) {
                        return;
                    }
                    item.discovered = true;
                    found = true;
                    break;
                }
            }

            if (found) {
                break;
            }
        }

        this.setLocalStorageToMemory();
    }


    // #endregion
}

