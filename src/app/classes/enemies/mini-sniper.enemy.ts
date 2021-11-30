import { GameService } from "src/app/services/game.service";
import { ObjectService } from "src/app/services/object.service";
import { Enemy } from "../enemy.class";
import { Bullet } from "../projectiles/bullet.class";

export class MiniSniper extends Enemy {

    movementSpeed = 2;

    onHiddenSecton = true;
    maxHealth = 2;
    health = 2;
    attackSpeed = 8;

    subClass = "mini-sniper";

    constructor(gameService: GameService, objectService: ObjectService) {
        super(gameService, objectService);

        this.enemyType = "mini-boss";

    }

    move() {
        
        if (this.location.hiddenSection % 2 == 0) {
            // this.doMove(this.gameService.player.location.x, this.location.hiddenSection);

            if (this.location.x < this.gameService.player.location.x) {
                this.moveRight();
                return;
            }
            if (this.location.x > this.gameService.player.location.x) {
                this.moveLeft();
                return;
            }

            // on the same x axis as the player
            return;
        }

        if (this.location.y < this.gameService.player.location.y) {
            this.moveDown();
            return;
        }
        if (this.location.y > this.gameService.player.location.y) {
            this.moveUp();
            return;
        }

        // on the same y axis as the player
        return;
    }

    attack() {
        // let x = this.hiddenSection % 2 == 0 ? this.location.x : this.hiddenSection != 0 ? 0 : this.gameService.gameHeight - 1;
        // let y = this.hiddenSection % 2 != 0 ? this.location.y : this.hiddenSection == 1 ? this.gameService.gameWidth - 1 : 0;

        let x;
        if (this.hiddenSection % 2 == 0) {
            x = this.location.x;
        } else if (this.hiddenSection == 1) {
            x = this.gameService.gameWidth - 1;
        } else {
            x = 0;
        }

        let y;
        if (this.hiddenSection % 2 == 1) {
            y = this.location.y;
        } else if (this.hiddenSection == 0) {
            y = 0;
        } else {
            y = this.gameService.gameHeight - 1;
        }

        let movementDirection: "Up" | "Right" | "Down" | "Left" = this.hiddenSection == 0 ? "Down" : this.hiddenSection == 1 ? "Left" : this.hiddenSection == 2 ? "Up" : "Right";
        this.objectService.addObject(x, y, new Bullet(this.gameService, this.objectService, movementDirection))
    }

   
}