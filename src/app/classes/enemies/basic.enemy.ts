import { GameService } from "src/app/services/game.service";
import { ObjectService } from "src/app/services/object.service";
import { Enemy } from "../enemy.class";

export class BasicEnemy extends Enemy {

    movementSpeed = 10;

    constructor(gameService: GameService, objectService: ObjectService) {
        super(gameService, objectService);
    }

    move() {
        let xPlayerDifference = this.location.x - this.gameService.player.location.x;
        let yPlayerDifference = this.location.y - this.gameService.player.location.y;

        // move up or down
        if (Math.abs(xPlayerDifference) < Math.abs(yPlayerDifference)) {
            if (yPlayerDifference > 0) {
                this.moveUp();
            } else {
                this.moveDown();
            }
            return;
        }
        // move left or right
        if (Math.abs(xPlayerDifference) > Math.abs(yPlayerDifference)) {
            if (xPlayerDifference > 0) {
                this.moveLeft();
            } else {
                this.moveRight();
            }
            return;
        }

        // else they are equal, move diagonal
        if (yPlayerDifference > 0) {
            this.moveUp();
        } else {
            this.moveDown();
        }
        if (xPlayerDifference > 0) {
            this.moveLeft()
        } else {
            this.moveRight
        }
    }
}