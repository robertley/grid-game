import { GameService } from "../services/game.service";
import { ObjectService } from "../services/object.service";
import { TileObject } from "./tile-object.class";

export class Player extends TileObject {

    tag = "player";
    health: number = 6;

    constructor(gameService: GameService, objectService: ObjectService) {
        super(gameService, objectService);

    }

    onCollision() {
        let collisionObjects = this.getCollisionObjects();
        console.log(collisionObjects)
        for (let obj of collisionObjects) {
            if (obj.tag == "enemy") {
                this.health--;
                if (this.health == 0) {
                    this.death();
                    return;
                }
                obj.destroy();
            }

            if (obj.tag == "coin") {
                this.gameService.addToScore(100);
                this.objectService.damageRandomEnemy();
                obj.destroy();
            }
        }
    }

    death() {
        alert("You died")
        this.gameService.reset();
    }

}