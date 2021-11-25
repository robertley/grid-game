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
        }

        this.objCount++;

    }

    removeObject(obj: TileObject) {
        this.objects.delete(obj.id);
        obj.location.removeObject(obj);

        if (obj instanceof Enemy) {
            this.enemies.delete(obj.id);
        }
    }

    clearObjects() {
        for (let [id, obj] of this.objects) {
            this.removeObject(obj);
        }
    }

}