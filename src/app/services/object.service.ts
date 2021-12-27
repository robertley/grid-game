import { Injectable } from "@angular/core";
import { Enemy } from "../classes/enemy.class";
import { Coin } from "../classes/items/coin.class";
import { Projectile } from "../classes/projectile.class";
import { TileObject } from "../classes/tile-object.class";
import { Grid } from "../interfaces/grid.interface";
import { Follower } from "../classes/enemies/follower.enemy";
import { BouncerEnemy } from "../classes/enemies/bouncer.enemy";
import { TeleporterEnemy } from "../classes/enemies/teleporter.enemy";

@Injectable({
    providedIn: "root"
})
export class ObjectService {

    grid: Grid;
    objects: Map<number, TileObject> = new Map();
    enemies: Map<number, Enemy> = new Map();
    bossEnemies: Map<number, Enemy> = new Map();
    projectiles: Map<number, Projectile> = new Map();
    objCount = 0;

    availableItems: Map<typeof TileObject, number> = new Map();
    availableEnemies: Map<typeof Enemy, number> = new Map();

    constructor() {
        this.initStarterAvailableItems();
    }

    initObjectService(grid: Grid) {
        this.grid = grid;
    }

    initStarterAvailableItems() {

        this.availableItems.clear();
        this.availableEnemies.clear();

        this.availableItems.set(Coin, 8);
        this.availableEnemies.set(Follower, 6);
        this.availableEnemies.set(BouncerEnemy, 4);
        this.availableEnemies.set(TeleporterEnemy, 1);
    }

    resetService() {

        for (let [key, object] of this.objects) {
            object.destroy();
        }
        this.objects.clear();
        this.enemies.clear();
        this.bossEnemies.clear();
        this.projectiles.clear();
        this.initStarterAvailableItems();
        this.objCount = 0;
    }

    addObject(x: number, y: number, obj: TileObject) {
        // console.log("add:", obj)

        try {
            if (obj.animation == null) {
                return this.placeObject(x, y, obj);
            }
    
            this.placeObject(x, y, obj.animation);
            // console.log("placing animation", obj.animation)
    
            setTimeout(() => {
                this.placeObject(x, y, obj)
            }, obj.animation.duration);
    
            return obj;
        } catch (error) {
            console.error(error)
            console.error("add object error")
            console.log("!!!", obj, x, y,)
            return undefined;
        }

    }

    addHiddenObject(hiddenSection: 0 | 1 | 2 | 3, i: number, obj: TileObject) {
        
        if (obj.animation == null) {
            return this.placeHiddenObject(hiddenSection, i, obj);
        }

        this.placeHiddenObject(hiddenSection, i, obj.animation);

        console.log(obj.animation.duration)

        setTimeout(() => {
            this.placeHiddenObject(hiddenSection, i, obj);
        }, obj.animation.duration);

        return obj;
    }

    placeObject(x: number, y: number, obj: TileObject) {
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
        
        if (obj instanceof Projectile) {
            this.projectiles.set(this.objCount, obj);
        }

        this.objCount++;

        return obj;
    }

    placeHiddenObject(hiddenSection: 0 | 1 | 2 | 3, i: number, obj: TileObject) {
        obj.id = this.objCount;
        let tile = this.grid.hiddenTiles[hiddenSection][i];
        tile.objects.push(obj);
        obj.location = tile;
        obj.hiddenSection = hiddenSection;
        this.objects.set(this.objCount, obj);

        if (obj instanceof Enemy) {
            this.enemies.set(this.objCount, obj);

            if (obj.enemyType == "mini-boss") {
                this.bossEnemies.set(this.objCount, obj);
            }
        }

        this.objCount++;

        return obj;
    }

    removeObject(obj: TileObject) {
        try {
            this.objects.delete(obj.id);
            obj.location.removeObject(obj);
    
            if (obj instanceof Enemy) {
                this.removeEnemy(obj);
            }
            if (obj instanceof Projectile) {
                this.removeProjectile(obj);
            }
        } catch (error) {
            console.error(error)
            console.log("Remove Object Error:", obj)
            console.log("Remove Object Location:", obj.location)
        }
    }

    clearObjects() {
        for (let [id, obj] of this.objects) {
            this.removeObject(obj);
        }
    }

    damageRandomEnemy(damage?: number) {

        damage = damage ?? 1;

        for (let i = 0; i < damage; i++) {

            let enemiesArr = Array.from(this.enemies.values());

            // Enemies can be triggers. We do not want to include triggers in the damage pool
            enemiesArr = enemiesArr.filter(enemy => {
                return !enemy.trigger
            })

            if (enemiesArr.length < 1) {
                return;
            }

            let enemy = enemiesArr[Math.floor(Math.random() * enemiesArr.length)];
    
            enemy.doDamage(damage);
        }

    }

    damageStrongestEnemy(damage?: number) {
        damage = damage ?? 1;

        for (let i = 0; i < damage; i++) {

            let enemiesArr = Array.from(this.enemies.values());

            let bossEnemies = enemiesArr.filter((enemy) => {
                return enemy.enemyType == "boss";
            })

            if (bossEnemies.length > 0) {
                bossEnemies[0].doDamage(1);
                continue;
            }

            let miniBossEnemies = enemiesArr.filter((enemy) => {
                return enemy.enemyType == "mini-boss";
            })

            if (miniBossEnemies.length > 0) {
                miniBossEnemies[0].doDamage(1);
                continue;
            }

            let eliteEnemies = enemiesArr.filter((enemy) => {
                return enemy.enemyType == "elite";
            })

            if (eliteEnemies.length > 0) {
                eliteEnemies[0].doDamage(1);
                continue;
            }

            enemiesArr[0].doDamage(1);
        }
    }

    removeEnemy(enemy: Enemy) {
        this.enemies.delete(enemy.id);
        if (enemy.enemyType == "mini-boss") {
            this.bossEnemies.delete(enemy.id);
        }
    }

    removeProjectile(projectile: Projectile) {
        this.projectiles.delete(projectile.id);
    }

    createLottery(itemMap: Map<any, number>) {
        let currMax = 0;
        let lotteryPool: ItemLotteryTicket[] = [];
        for (let [key, value] of itemMap) {
            lotteryPool.push(
                {
                    item: key,
                    lotteryNumber: (value + currMax)
                }
            )
            currMax += value;
        }

        let winningNumber = Math.floor(Math.random() * currMax);

        for (let ticket of lotteryPool) {
            if (ticket.lotteryNumber > winningNumber) {
                return ticket.item;
            }
        }
    }
}

interface ItemLotteryTicket {
    item: any;
    lotteryNumber: number;
}