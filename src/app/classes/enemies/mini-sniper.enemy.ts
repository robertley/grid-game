import { GameService } from "src/app/services/game.service";
import { ObjectService } from "src/app/services/object.service";
import { EnemyType } from "src/app/types/enemy-type.type";
import { EliteAnimation } from "../animations/elite.animation.class";
import { Enemy } from "../enemy.class";
import { Heart } from "../items/heart.class";
import { Bullet } from "../projectiles/bullet.class";

export class MiniSniper extends Enemy {

    movementSpeed = 2;

    onHiddenSecton = true;
    maxHealth = 2;
    health = 2;
    attackSpeed = 8;
    enemyType = "mini-boss" as EnemyType;
    animation = new EliteAnimation(this.gameService, this.objectService)
    tag = "mini-sniper";

    discoveredBullet = false;

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
        let bullet = new Bullet(this.gameService, this.objectService, movementDirection);
        this.objectService.addObject(x, y, bullet);

        if (!this.discoveredBullet) {
            this.gameService.setObjectDiscovered(bullet);
            this.discoveredBullet = true;
        }
    }

    onDeath() {
        let randomC = this.gameService.getRandomCoordinate();
        this.objectService.addObject(randomC.x, randomC.y, new Heart(this.gameService, this.objectService));
    }

   
}