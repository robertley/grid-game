import { Tile } from "../classes/tile.class";

export interface Grid {
    tiles: Tile[][];
    hiddenTiles: Tile[][];
}