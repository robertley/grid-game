import { Component, OnInit } from '@angular/core';
import { LocalStorage } from 'src/app/interfaces/local-storage.interface';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss']
})
export class CatalogComponent implements OnInit {

  localStorage: LocalStorage;

  constructor(private gameService: GameService) {
    this.localStorage = gameService.localStorage;
  }

  ngOnInit(): void {
  }

}
