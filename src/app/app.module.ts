import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { GridComponent } from './components/grid/grid.component';
import { HudComponent } from './components/hud/hud.component';
import { HealthBarsComponent } from './components/health-bars/health-bars.component';

@NgModule({
  declarations: [
    AppComponent,
    GridComponent,
    HudComponent,
    HealthBarsComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
