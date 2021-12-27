import { Component, OnInit } from '@angular/core';
import { Enemy } from 'src/app/classes/enemy.class';
import { Player } from 'src/app/classes/player.class';
import { Game } from 'src/app/interfaces/game.interface';
import { GameService } from 'src/app/services/game.service';
import { ObjectService } from 'src/app/services/object.service';

@Component({
  selector: 'app-health-bars',
  templateUrl: './health-bars.component.html',
  styleUrls: ['./health-bars.component.scss']
})
export class HealthBarsComponent implements OnInit {

  player: Player;
  game: Game;

  constructor(private gameService: GameService, private objectService: ObjectService) {
    this.player = gameService.player;  
    this.game = gameService.game;
  }

  ngOnInit(): void {
    console.log(this)
  }

  get bosses(): Enemy[] {
    return Array.from(this.objectService.bossEnemies.values())
  }

  getBarWidth(boss: Enemy) {
    return 536 * boss.health / boss.maxHealth;
  }

}
