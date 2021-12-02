import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { GridComponent } from './components/grid/grid.component';
import { HudComponent } from './components/hud/hud.component';
import { HealthBarsComponent } from './components/health-bars/health-bars.component';
import { CatalogComponent } from './components/catalog/catalog.component';
import { HighscoresComponent } from './components/highscores/highscores.component';

@NgModule({
  declarations: [
    AppComponent,
    GridComponent,
    HudComponent,
    HealthBarsComponent,
    CatalogComponent,
    HighscoresComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
