import { Injectable } from "@angular/core";
import { Enemy } from "../classes/enemy.class";
import { TileObject } from "../classes/tile-object.class";
import { Grid } from "../interfaces/grid.interface";

@Injectable({
    providedIn: "root"
})
export class ObjectService {

    grid: Grid;
    objects: Map<number, TileObject> = new Map();
    enemies: Map<number, Enemy> = new Map();
    bossEnemies: Map<number, Enemy> = new Map();
    objCount = 0;

    initObjectService(grid: Grid) {
        this.grid = grid;
    }

    addObject(x: number, y: number, obj: TileObject) {
        obj.id = this.objCount;
        let tile = this.grid.tiles[y][x];
        tile.objects.push(obj);
        obj.location = tile;
        this.objects.set(this.objCount, obj);

        if (obj instanceof Enemy) {
            this.enemies.set(this.objCount, obj);

            if (obj.enemyType == "mini-boss") {
                this.bossEnemies.set(this.objCount, obj);
            }

        }

        this.objCount++;

    }

    addHiddenObject(hiddenSection: number, i: number, obj: TileObject) {
        obj.id = this.objCount;
        let tile = this.grid.hiddenTiles[hiddenSection][i];
        tile.objects.push(obj);
        obj.location = tile;
        this.objects.set(this.objCount, obj);

        if (obj instanceof Enemy) {
            this.enemies.set(this.objCount, obj);

            if (obj.enemyType == "mini-boss") {
                this.bossEnemies.set(this.objCount, obj);
            }
        }

        // console.log("hi", this.grid)

        this.objCount++;

    }

    removeObject(obj: TileObject) {
        this.objects.delete(obj.id);
        obj.location.removeObject(obj);

        if (obj instanceof Enemy) {
            this.removeEnemy(obj);
        }
    }

    clearObjects() {
        for (let [id, obj] of this.objects) {
            this.removeObject(obj);
        }
    }

    destroyRandomEnemy() {
        let enemiesArr = Array.from(this.enemies.values());

        let destroyEnemy = enemiesArr[Math.floor(Math.random() * enemiesArr.length)];

        this.enemies.delete(destroyEnemy.id);

        destroyEnemy.destroy();
    }

    damageRandomEnemy() {
        let enemiesArr = Array.from(this.enemies.values());

        let enemy = enemiesArr[Math.floor(Math.random() * enemiesArr.length)];

        if (enemy) {
            enemy.health -= 1;

            if (enemy.health < 1) {
                enemy.destroy();
            }
        }
    }

    removeEnemy(enemy: Enemy) {
        this.enemies.delete(enemy.id);
        if (enemy.enemyType = "mini-boss") {
            this.bossEnemies.delete(enemy.id);
        }
    }

}