import { Coordinate } from "src/app/interfaces/coordinate.interface";
import { GameService } from "src/app/services/game.service";
import { ObjectService } from "src/app/services/object.service";
import { Enemy } from "../enemy.class";

export class Follower extends Enemy {

    tag = "follower"

    movementSpeed = 4;

    constructor(gameService: GameService, objectService: ObjectService) {
        super(gameService, objectService);
    }

    move() {
        let xPlayerDifference = this.location.x - this.gameService.player.location.x;
        let yPlayerDifference = this.location.y - this.gameService.player.location.y;

        let coordinate: Coordinate = {x: this.location.x, y: this.location.y}

        // move up or down
        if (Math.abs(xPlayerDifference) < Math.abs(yPlayerDifference)) {
            if (yPlayerDifference > 0) {
                coordinate.y -= 1;
                if (this.gameService.getTile(coordinate.x,coordinate.y).hasObject(Follower)){
                    return;
                }
                this.moveUp();
            } else {
                coordinate.y += 1;
                if (this.gameService.getTile(coordinate.x,coordinate.y).hasObject(Follower)){
                    return;
                }
                this.moveDown();
            }
            return;
        }
        // move left or right
        if (Math.abs(xPlayerDifference) > Math.abs(yPlayerDifference)) {
            if (xPlayerDifference > 0) {
                coordinate.x -= 1;
                if (this.gameService.getTile(coordinate.x,coordinate.y).hasObject(Follower)){
                    return;
                }
                this.moveLeft();
            } else {
                coordinate.x += 1;
                if (this.gameService.getTile(coordinate.x,coordinate.y).hasObject(Follower)){
                    return;
                }
                this.moveRight();
            }
            return;
        }

        // else they are equal, move diagonal
        if (yPlayerDifference > 0) {
            coordinate.y -= 1;
            if (this.gameService.getTile(coordinate.x,coordinate.y).hasObject(Follower)){
                return;
            }
            this.moveUp();
        } else {
            coordinate.y += 1;
            if (this.gameService.getTile(coordinate.x,coordinate.y).hasObject(Follower)){
                return;
            }
            this.moveDown();
        }
        if (xPlayerDifference > 0) {
            coordinate.x -= 1;
            if (this.gameService.getTile(coordinate.x,coordinate.y).hasObject(Follower)){
                return;
            }
            this.moveLeft();
        } else {
            coordinate.x += 1;
            if (this.gameService.getTile(coordinate.x,coordinate.y).hasObject(Follower)){
                return;
            }
            this.moveRight();
        }
    }
}