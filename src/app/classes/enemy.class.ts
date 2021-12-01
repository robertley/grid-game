import { GameService } from "../services/game.service";
import { ObjectService } from "../services/object.service";
import { EnemyType } from "../types/enemy-type.type";
import { TileObject } from "./tile-object.class";

export class Enemy extends TileObject {

    tag = "enemy";
    movementSpeed = 2;
    maxHealth = 1;
    health = this.maxHealth;
    attackSpeed: number | null = null;

    enemyType: EnemyType = "basic";

    constructor(gameService: GameService, objectService: ObjectService) {
        super(gameService, objectService);
    }

    onDeath() {
        // let enemy = new Enemy(this.gameService, this.objectService);
        // this.gameService.randomSpawn(enemy);
    }

    move() {

    }

    attack() {
        
    }

    getHtmlClass() {
        let htmlClass = this.tag;
        if (this.subClass) {
            htmlClass += ("-" + this.subClass);
        }
        htmlClass += (" " + this.enemyType);

        return htmlClass;
    }

    doDamage(amt: number) {
        this.health -= amt;

        if (this.health < 1) {
            this.destroy();
        }
    }
}