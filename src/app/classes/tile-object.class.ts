
import { Injector } from "@angular/core";
import { Game } from "../interfaces/game.interface";
import { GameService } from "../services/game.service";
import { ObjectService } from "../services/object.service";
import { Tile } from "./tile.class";

export class TileObject {

    location: Tile;
    tag: string;
    id: number;

    protected gameService: GameService;
    protected objectService: ObjectService;
    
    constructor(gameService: GameService, objectService: ObjectService) {
        this.gameService = gameService;
        this.objectService = objectService;
    }
    
    moveUp() {
        let newY = this.location.y - 1;

        // If out of bounds
        if (newY < 0) {
            return;
        }

        this.doMove(this.location.x, newY);
    }

    moveLeft() {
        let newX = this.location.x - 1;

        // If out of bounds
        if (newX < 0) {
            return;
        }

        this.doMove(newX, this.location.y);
    }

    moveRight() {
        let newX = this.location.x + 1;

        // If out of bounds
        if (newX > this.gameService.gameWidth - 1) {
            return;
        }

        this.doMove(newX, this.location.y);
    }

    moveDown() {
        let newY = this.location.y + 1;

        // If out of bounds
        if (newY > this.gameService.gameHeight - 1) {
            return;
        }

        this.doMove(this.location.x, newY);
    }

    doMove(x: number, y: number) {
        let newTile = this.gameService.grid.tiles[y][x];
        this.location.removeObject(this);
        this.location = newTile;
        newTile.addObject(this);
    }

    onCollision() {
        console.log("collide!")
    }

    getCollisionObjects() {
        return this.location.objects.filter((obj) => {
            return obj.id != this.id;
        })
    }

    spawn() {
        
    }

    onDeath() {

    }

    destroy() {
        this.onDeath();
        this.objectService.removeObject(this);
    }
}