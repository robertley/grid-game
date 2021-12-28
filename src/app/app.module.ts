import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { GridComponent } from './components/grid/grid.component';
import { HudComponent } from './components/hud/hud.component';
import { HealthBarsComponent } from './components/health-bars/health-bars.component';
import { CatalogComponent } from './components/catalog/catalog.component';
import { HighscoresComponent } from './components/highscores/highscores.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatDialogModule} from '@angular/material/dialog';
import { DeathDialogComponent } from './components/death-dialog/death-dialog.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HowToPlayComponent } from './components/how-to-play/how-to-play.component';

@NgModule({
  declarations: [
    AppComponent,
    GridComponent,
    HudComponent,
    HealthBarsComponent,
    CatalogComponent,
    HighscoresComponent,
    DeathDialogComponent,
    HowToPlayComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatDialogModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
