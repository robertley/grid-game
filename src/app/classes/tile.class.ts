import { Type } from "@angular/core";
import { remove } from "lodash";
import { TileObject } from "./tile-object.class";

export class Tile {
    x: number;
    y: number;
    objects: TileObject[];

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.objects = [];
    }

    addObject(obj: TileObject) {
        this.objects.push(obj);
    }

    removeObject(obj: TileObject) {
        remove(this.objects, obj);
    }

    hasObject(T: Type<TileObject>) {
        let hasObject = false;
        for (let object of this.objects) {
            if (object instanceof T) {
                hasObject = true;
                break;
            }
        }
        return hasObject;
    }

    isEmpty() {
        return this.objects.length < 1;
    }
}