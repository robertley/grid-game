import { Direction } from "../../enums/direction.enum";
import { Enemy } from "../enemy.class";

export class WanderingEnemy extends Enemy {

    direction: Direction = Direction.DOWN;
    steps: number = 0;
    maxSteps: number = 5; 

    move() {
        if (this.steps == 0) {
            this.getNewDirection();
        }

        switch (this.direction) {
            case Direction.DOWN:
                this.moveDown();
                break;
            case Direction.LEFT:
                this.moveLeft();
                break;
            case Direction.UP:
                this.moveUp();
                break;
            case Direction.RIGHT:
                this.moveRight();
                break;
        }
        this.steps--;
    }

    getNewDirection() {
        let directions: Direction[] = [];

        if (this.location.y - 1 > 0 && this.direction != Direction.DOWN) {
            directions.push(Direction.UP);
        }

        if (this.location.x - 1 > 0 && this.direction != Direction.RIGHT) {
            directions.push(Direction.LEFT);
        }

        if (this.location.y + 1 < this.gameService.gameHeight && this.direction != Direction.UP) {
            directions.push(Direction.DOWN);
        }

        if (this.location.x + 1 < this.gameService.gameWidth && this.direction != Direction.LEFT) {
            directions.push(Direction.RIGHT);
        }

        this.direction = directions[Math.floor(Math.random() * directions.length)];

        // random number between 2 and 5
        let steps = Math.floor(Math.random() * 4) + 2;

        switch (this.direction) {
            case Direction.DOWN:
                if (this.location.y + steps > this.gameService.gameHeight) {
                    this.steps = this.gameService.gameHeight - this.location.y;
                    break;
                }
                this.steps = steps;
                break;
            case Direction.UP:
                this.steps = Math.min(this.location.y, steps);
                break;
            case Direction.RIGHT:
                if (this.location.x + steps > this.gameService.gameWidth) {
                    this.steps = this.gameService.gameWidth - this.location.x;
                    break;
                }
                this.steps = steps;
                break;
            case Direction.LEFT:
                this.steps = Math.min(this.location.x, steps);
                break;
        }

        // console.log(this.direction, this.steps);
    }
}