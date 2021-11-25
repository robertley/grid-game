import { Player } from "../classes/player.class";
import { Grid } from "./grid.interface";

export interface Game {
    grid: Grid;
    player: Player;
    coinRate: number;
    score: number;
    scoreMultiplier: number;
    enemySpawnRate: number;
    level: number;
}