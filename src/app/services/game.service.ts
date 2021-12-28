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
import { DiscoverItemData } from "../interfaces/local-storage.interface";
import { Heart } from "../classes/items/heart.class";
import { Bullet } from "../classes/projectiles/bullet.class";
import { MatDialog } from "@angular/material/dialog";
import { DeathDialogComponent } from "../components/death-dialog/death-dialog.component";
import { Animation } from "../classes/animation.class";
import { EnemeySpawn } from "../classes/animations/enemy-spawn-class";
import { BigFattyMain } from "../classes/enemies/big-fatty-main.enemy";
import { BigFattyAnimation } from "../classes/animations/big-fatty-animation.class";
import { LocalStorageService } from "./local-storage.service";
import { Bomber } from "../classes/enemies/bomber.enemy";
import { Bomb } from "../classes/enemies/bomb.enemy";

@Injectable({
    providedIn: 'root'
})
export class GameService {

    tickModifier = 2;
    
    game: Game;
    grid: Grid;
    player: Player;

    gameWidth = 21;
    gameHeight = 20;

    gameIsRunning = false;

    tickRate = 100 / this.tickModifier;
    tickNumber = 1;
    levelLength = 150 * this.tickModifier;
    windowIntervalObject: any;

    inputStack: KEY_CODE[] = [];
    enemyStack: Enemy[] = [];
    coinStack: Coin[] = [];

    freezePlayer = false;
    deathAnimation = false;
    isGameOver = false;

    private spawnModifier = 1;

    constructor(private keyboardService: KeyboardService,
                private objectService: ObjectService,
                public dialog: MatDialog,
                private localStorageService: LocalStorageService) {

        this.grid = this.getNewGrid();

        this.initDiscoverItemData();

        this.initializeGame();
    }

    initializeGame() {

        this.game = {
            grid: this.grid,
            player: this.player,
            coinRate: 80 * this.tickModifier,
            score: 0,
            scoreMultiplier: 1,
            enemySpawnRate: 56 * this.tickModifier + 1, // 50
            level: 0
        }
        this.objectService.initObjectService(this.grid);

        this.createPlayer();

    }

    createPlayer() {
        this.player = new Player(this, this.objectService);
        this.objectService.addObject(10, 10, this.player);
    }

    resetService() {
        this.game.coinRate = 80 * this.tickModifier;
        this.game.score = 0;
        this.game.scoreMultiplier = 1;
        this.game.enemySpawnRate = 56 * this.tickModifier + 1;
        this.game.level = 0;
        this.tickNumber = 1;

        this.inputStack = [];
        this.coinStack = [];
        this.enemyStack = [];

        this.gameIsRunning =
        this.freezePlayer = false;
        this.deathAnimation = false;
        this.isGameOver = false;

        this.createPlayer();
    }

    getNewGrid(): Grid {
        let grid: Grid;
        let tiles: Tile[][] = [];

        for (let y = 0; y < this.gameHeight; y++) {
            let row: Tile[] = [];
            for (let x = 0; x < this.gameWidth; x++) {
                row.push(new Tile(x, y))
            }
            tiles.push(row);
        }

        let hiddenTiles: Tile[][] = [[], [], [], []];

        for (let y = 0; y < this.gameHeight; y++) {
            let row1 = hiddenTiles[1]
            let row2 = hiddenTiles[3]
            
            row1.push(new Tile(-1, y, 1));
            row2.push(new Tile(-1, y, 3));
        }
        for (let x = 0; x < this.gameWidth; x++) {
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
// // 

        this.enemyStack.push(new Bomber(this,this.objectService))
        this.spawnEnemy();
        this.enemyStack.push(new Bomber(this,this.objectService))
        this.spawnEnemy();
        this.enemyStack.push(new Bomber(this,this.objectService))
        this.spawnEnemy();
        this.enemyStack.push(new Bomber(this,this.objectService))
        this.spawnEnemy();
        this.enemyStack.push(new Bomber(this,this.objectService))
        this.spawnEnemy();

        // this.createBigFatty();

        console.log(this.grid)
    }

    gameLoop() {
        this.calculateInput();
        this.calculateEnemyMovements();
        this.calculateProjectileMovements();
        this.calculateEnemyAttacks();

        if (!this.isGameOver)
            this.calculateCollisions();

        // this.calculateEnemySpawn();
        // this.calculateCoinSpawn();

        this.calculateGameMultiplier();

        if (!this.isGameOver) {
            this.addToScore(10);
            this.checkLevelUp();
            this.doExtraInput();
        }

        this.tickNumber++;

    }

    slow = false;

    calculateInput() {

        let foundSlow = false;

        if (this.freezePlayer) {
            return;
        }

        // console.log(this.keyboardService.registeredKeys)
        // console.log("calculating input")
        if (this.tickNumber % this.player.movementSpeed == 0) {
            for (let [key, value] of this.keyboardService.registeredKeys) {
                switch (key) {

                    case KEY_CODE.SPACE:
                        if (!this.slow) {
                            this.slow = true;
                        }
                        // console.log("found slow")
                        foundSlow = true;
                        break;

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

        if (this.slow && !foundSlow) {
            // console.log("not slow")
            // this.slow = false;
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
            if ((this.tickNumber - enemy.spawnTick) * (this.slow ? 2 : 1) % enemy.movementSpeed == 0) {
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
            if ((this.tickNumber - enemy.spawnTick + 1) % enemy.attackSpeed == 0) {
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
            return;
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

    calculateGameMultiplier() {
        let enemyArray = Array.from(this.objectService.enemies.values()).filter(enemy => {
            return !enemy.trigger;
        })
        this.game.scoreMultiplier = 1 + ((this.game.level + enemyArray.length) * .1)
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

            if (this.game.level == 1) {
                // this.enemyStack.push(new MiniSniper(this,this.objectService));
                // this.spawnEnemy();
                // this.enemyStack.push(new Sprinter(this,this.objectService))
                // this.spawnEnemy();
            }

            if (this.game.level == 5) {
                this.enemyStack.push(new MiniSniper(this,this.objectService));
                this.spawnEnemy();

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

            if (this.game.level == 10) {
                // this.coinStack.push(new SuperCoin(this, this.objectService));
            }

            if (this.game.level == 11) {
                let randomC = this.getRandomCoordinate();
                // this.objectService.addObject(randomC.x, randomC.y, new Heart(this, this.objectService));
                this.createBigFatty();
            }
            if (this.game.level == 13) {
                this.coinStack.push(new SuperCoin(this,this.objectService))
            }
        }

    }

    randomSpawn(obj: TileObject) {
        let coordinate = this.getRandomCoordinate(2, 2);
        this.objectService.addObject(coordinate.x, coordinate.y, obj);
    }

    reset() {
        this.objectService.resetService();
        this.keyboardService.resetService();
        this.resetService();
    }

    getRandomCoordinate(padX?: number, padY?: number, boardPadX?: number, boardPadY?: number): Coordinate {
        
       boardPadX = boardPadX ?? 0;
       boardPadY = boardPadY ?? 0;

       let coordinate: Coordinate = {
           x: Math.floor(Math.random() * ((this.gameWidth - 1) - boardPadX)),
           y: Math.floor(Math.random() * ((this.gameHeight - 1) - boardPadY))
       }

       padX = padX ?? 0;
       padY = padY ?? 0;

       while (Math.abs(this.player.location.x - coordinate.x) < padX ||
            Math.abs(this.player.location.y - coordinate.y) < padY) {

            coordinate = {
                x: Math.floor(Math.random() * ((this.gameWidth - 1) - boardPadX)),
                y: Math.floor(Math.random() * ((this.gameHeight - 1) - boardPadY))
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

    gameOver(deathObj: TileObject) {

        this.isGameOver = true;
        this.freezePlayer = true;
        this.deathAnimation = true;

        setTimeout(() => {
            window.clearInterval(this.windowIntervalObject);
            this.deathAnimation = false;

            const dialogRef = this.dialog.open(DeathDialogComponent, {
                width: '500px',
                disableClose: true,
                data: {
                    deathObject: deathObj,
                    score: this.game.score
                }
            });
    
            dialogRef.afterClosed().subscribe(result => {

                this.reset();

            });
        }, 3000)
    }

    get enemySpawnRate() {
        return Math.floor(this.game.enemySpawnRate * this.spawnModifier)
    }

    get coinRate() {
        return Math.floor(this.game.coinRate * this.spawnModifier)
    }

    createBigFatty() {
        let coor = this.getRandomCoordinate(0, 0, 4, 4);

        console.log(coor)
        let fatty = this.objectService.addObject(coor.x + 1, coor.y + 2, new BigFattyMain(this, this.objectService));

        this.setObjectDiscovered(fatty);
    }





    
    // #region local storage

    discoverItemData: DiscoverItemData;

    initDiscoverItemData() {

        let discoverDefault = false;
        let discoverItemData: DiscoverItemData = {
            items: [
                {
                    groupName: "Items",
                    storageItems: [
                        {
                            name: "Coin",
                            description: "After collecting does 1 damage to a random enemy.",
                            ...this.getItemStorageData(Coin)
                        },
                        {
                            name: "Angry Coin",
                            description: "After collecting does 1 damage to one of the strongest enemies.",
                            ...this.getItemStorageData(AngryCoin)
                        },
                        {
                            name: "Super Coin",
                            description: "After collecting does 1 damage to a random enemy five times.",
                            ...this.getItemStorageData(SuperCoin)
                        },
                        {
                            name: "Heart",
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
                            description: "He follows ya",
                            ...this.getItemStorageData(Follower)
                        },
                        {
                            name: "Bouncer",
                            description: "Bouncey boi",
                            ...this.getItemStorageData(BouncerEnemy)
                        },
                        {
                            name: "Teleporter",
                            description: "Checkmate flat-earthers.",
                            ...this.getItemStorageData(TeleporterEnemy)
                        },
                        {
                            name: "Mini Sniper",
                            description: "Mini Sniper goes brrrrrrrrrrrr",
                            ...this.getItemStorageData(MiniSniper)
                        },
                        {
                            name: "Bullet",
                            description: "pew",
                            ...this.getItemStorageData(Bullet)
                        },
                        {
                            name: "Sprinter",
                            description: "He is determined to catch you.",
                            ...this.getItemStorageData(Sprinter)
                        },
                        {
                            name: "Bomber",
                            description: "He's a bomber, man.",
                            ...this.getItemStorageData(Bomber)
                        },
                        {
                            name: "Bomb",
                            description: "Bomb goes boom",
                            ...this.getItemStorageData(Bomb)
                        },
                        {
                            name: "Big Fatty",
                            description: "Beeeeeeeeeeg",
                            ...this.getItemStorageData(BigFattyMain)
                        }
                    ]
                }
            ]
        }
    
        this.discoverItemData = discoverItemData;
        
        console.log(this.discoverItemData)
    }

    
    getItemStorageData(ItemClass: typeof TileObject): any {
        let item = new ItemClass(this, this.objectService);
        return {
            htmlClass: item.getHtmlClass(),
            tag: item.tag,
            discovered: this.localStorageService.getLocalStorageItem(item.tag) ?? false
        }
    }


    setObjectDiscovered(obj: TileObject) {
        let found = false;
        for (let group of this.discoverItemData.items) {
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

        this.localStorageService.setLocalStorageItem(obj.tag, true);
    }


    // #endregion
}

