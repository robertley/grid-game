import { Component, OnInit } from '@angular/core';
import { LocalStorage, StorageItem } from 'src/app/interfaces/local-storage.interface';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss']
})
export class CatalogComponent implements OnInit {

  localStorage: LocalStorage;

  hoverItem: StorageItem;

  constructor(private gameService: GameService) {
    this.localStorage = gameService.localStorage;
  }

  ngOnInit(): void {
  }

  mouseIn(item: StorageItem) {
    if (item.discovered) {
      this.hoverItem = item;
    }
    console.log("in:", item);
  }
  mouseOut(item: StorageItem) {
    this.hoverItem = null;
    console.log("out:", item);
  }

}
