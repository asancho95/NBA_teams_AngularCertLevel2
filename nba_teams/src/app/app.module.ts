import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ScoreTrackingModule } from './modules/scoreTracking/score-tracking.module';

@NgModule({
	declarations: [
		AppComponent
	],
	imports: [
		BrowserModule,
		AppRoutingModule, 
		ScoreTrackingModule
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule { }
