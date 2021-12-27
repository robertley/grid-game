import { Coordinate } from "src/app/interfaces/coordinate.interface";
import { Enemy } from "../enemy.class";

export class FollowingEnemy extends Enemy {
    
    move() {
        let xPlayerDifference = this.location.x - this.gameService.player.location.x;
        let yPlayerDifference = this.location.y - this.gameService.player.location.y;

        let coordinate: Coordinate = {x: this.location.x, y: this.location.y}

        // move up or down
        if (Math.abs(xPlayerDifference) < Math.abs(yPlayerDifference)) {
            if (yPlayerDifference > 0) {
                coordinate.y -= 1;
                if (this.gameService.getTile(coordinate.x,coordinate.y).hasObject(FollowingEnemy)){
                    return;
                }
                this.moveUp();
            } else {
                coordinate.y += 1;
                if (this.gameService.getTile(coordinate.x,coordinate.y).hasObject(FollowingEnemy)){
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
                if (this.gameService.getTile(coordinate.x,coordinate.y).hasObject(FollowingEnemy)){
                    return;
                }
                this.moveLeft();
            } else {
                coordinate.x += 1;
                if (this.gameService.getTile(coordinate.x,coordinate.y).hasObject(FollowingEnemy)){
                    return;
                }
                this.moveRight();
            }
            return;
        }

        // else they are equal, move diagonal
        if (yPlayerDifference > 0) {
            coordinate.y -= 1;
            if (this.gameService.getTile(coordinate.x,coordinate.y).hasObject(FollowingEnemy)){
                return;
            }
            this.moveUp();
        } else {
            coordinate.y += 1;
            if (this.gameService.getTile(coordinate.x,coordinate.y).hasObject(FollowingEnemy)){
                return;
            }
            this.moveDown();
        }
        if (xPlayerDifference > 0) {
            coordinate.x -= 1;
            if (this.gameService.getTile(coordinate.x,coordinate.y).hasObject(FollowingEnemy)){
                return;
            }
            this.moveLeft();
        } else {
            coordinate.x += 1;
            if (this.gameService.getTile(coordinate.x,coordinate.y).hasObject(FollowingEnemy)){
                return;
            }
            this.moveRight();
        }
    }
}