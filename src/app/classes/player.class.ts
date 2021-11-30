import { GameService } from "../services/game.service";
import { ObjectService } from "../services/object.service";
import { Coin } from "./items/coin.class";
import { Enemy } from "./enemy.class";
import { Projectile } from "./projectile.class";
import { TileObject } from "./tile-object.class";
import { SuperCoin } from "./items/super-coin.class";

export class Player extends TileObject {

    tag = "player";
    health: number = 6;

    constructor(gameService: GameService, objectService: ObjectService) {
        super(gameService, objectService);

    }

    onCollision() {
        let collisionObjects = this.getCollisionObjects();
        // console.log(collisionObjects)
        for (let obj of collisionObjects) {
            if (obj instanceof Enemy) {
                this.health--;
                this.checkDeath();
                obj.destroy();
            }

            if (obj instanceof Coin) {
                this.gameService.addToScore(100);
                this.objectService.damageRandomEnemy();
                obj.destroy();
            }

            if (obj instanceof SuperCoin) {
                this.gameService.addToScore(500);
                this.objectService.damageRandomEnemy(5);
                obj.destroy();
            }

            if (obj instanceof Projectile) {
                this.health -= obj.damage;
                this.checkDeath();
                obj.destroy();
            }

        }
    }


    checkDeath() {
        if (this.health == 0) {
            this.death();
            return;
        }
    }

    death() {
        alert("You died")
        this.gameService.reset();
    }

}