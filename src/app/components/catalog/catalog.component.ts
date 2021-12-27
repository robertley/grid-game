import { Component, OnInit } from '@angular/core';
import { DiscoverItemData, StorageItem } from 'src/app/interfaces/local-storage.interface';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss']
})
export class CatalogComponent implements OnInit {

  discoverItemData: DiscoverItemData;

  hoverItem: StorageItem;

  constructor(private gameService: GameService) {
    this.discoverItemData = gameService.discoverItemData;
  }

  ngOnInit(): void {
  }

  mouseIn(item: StorageItem) {
    if (item.discovered) {
      this.hoverItem = item;
    }
  }
  mouseOut(item: StorageItem) {
    this.hoverItem = null;
  }

}
