import { GameService } from "../services/game.service";
import { ObjectService } from "../services/object.service";
import { TileObject } from "./tile-object.class";

export class Enemy extends TileObject {

    tag = "enemy";

    movementSpeed = 1;

    constructor(gameService: GameService, objectService: ObjectService) {
        super(gameService, objectService);
    }

    onDeath() {
        // let enemy = new Enemy(this.gameService, this.objectService);
        // this.gameService.randomSpawn(enemy);
    }

    move() {

    }
}