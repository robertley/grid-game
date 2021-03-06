import { GameService } from "../services/game.service";
import { ObjectService } from "../services/object.service";
import { Animation } from "./animation.class";
import { Tile } from "./tile.class";

export class TileObject {

    location: Tile;
    tag: string;
    id: number;
    spawnTick: number;

    onHiddenSecton: boolean = false;
    hiddenSection: 0 | 1 | 2 | 3 | undefined;

    subClass: string;

    trigger: boolean = false;

    animation: Animation;

    protected gameService: GameService;
    protected objectService: ObjectService;
    
    constructor(gameService: GameService, objectService: ObjectService) {
        this.gameService = gameService;
        this.objectService = objectService;

        this.spawnTick = this.gameService.tickNumber;
    }
    
    moveUp() {

        let newY = this.location.y - 1;

        // If out of bounds
        if (newY < 0) {
            this.hitWall();
            return;
        }

        let x = this.onHiddenSecton ? this.hiddenSection : this.location.x;

        this.doMove(x, newY);
    }

    moveLeft() {
        let newX = this.location.x - 1;

        // If out of bounds
        if (newX < 0) {
            this.hitWall();
            return;
        }

        let y = this.onHiddenSecton ? this.hiddenSection : this.location.y;

        this.doMove(newX, y);
    }

    moveRight() {
        let newX = this.location.x + 1;

        // If out of bounds
        if (newX > this.gameService.gameWidth - 1) {
            this.hitWall();
            return;
        }

        let y = this.onHiddenSecton ? this.hiddenSection : this.location.y;

        this.doMove(newX, y);
    }

    moveDown() {
        let newY = this.location.y + 1;

        // If out of bounds
        if (newY > this.gameService.gameHeight - 1) {
            this.hitWall();
            return;
        }

        let x = this.onHiddenSecton ? this.hiddenSection : this.location.x;

        this.doMove(x, newY);
    }

    doMove(x: number, y: number) {
        let newTile;

        if (this.onHiddenSecton && this.location.hiddenSection != undefined) {
            let tileIndex = this.location.hiddenSection % 2 == 0 ? x : y;
            newTile = this.gameService.grid.hiddenTiles[this.location.hiddenSection][tileIndex];
        } else {
            newTile = this.gameService.grid.tiles[y][x];
        }

        this.location.removeObject(this);
        this.location = newTile;
        newTile.addObject(this);

    }

    onCollision() {
    }

    getCollisionObjects() {
        return this.location.objects.filter((obj) => {
            return obj.id != this.id;
        })
    }

    hitWall() {

    }

    spawn() {
        
    }

    onDeath() {

    }

    destroy() {
        this.onDeath();
        this.objectService.removeObject(this);
    }

    getHtmlClass() {
        let htmlClass = this.tag;
        if (this.subClass) {
            htmlClass += ("-" + this.subClass);
        }
        return htmlClass;
    }
}