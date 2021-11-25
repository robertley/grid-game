import { Component, OnInit } from '@angular/core';
import { Player } from 'src/app/classes/player.class';
import { Game } from 'src/app/interfaces/game.interface';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-hud',
  templateUrl: './hud.component.html',
  styleUrls: ['./hud.component.scss']
})
export class HudComponent implements OnInit {

  player: Player;
  game: Game;

  constructor(private gameService: GameService) {
    this.player = gameService.player;  
    this.game = gameService.game;
  }

  ngOnInit(): void {
  }

  get healthDisplay() {
    let health = "";

    for (let i = 0; i < this.player.health; i++) {
      health += i % 2 == 0 ? "<" : "3";
    }
    return health;
  }

}
