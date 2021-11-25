import { Component, Injector, OnInit } from '@angular/core';
import { Game } from 'src/app/interfaces/game.interface';
import { Grid } from 'src/app/interfaces/grid.interface';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent implements OnInit {
  
  game: Game;
  grid: Grid;

  private gameService: GameService;

  constructor(private injector: Injector) {
    this.gameService = injector.get(GameService);
  }

  ngOnInit(): void {
    this.grid = this.gameService.game.grid;
  }

}
