import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScoreListComponent } from './modules/scoreTracking/components/score-list/score-list.component';
import { ScoreDetailComponent } from './modules/scoreTracking/components/score-detail/score-detail.component';
import { ScoreTrackingModule } from './modules/scoreTracking/score-tracking.module';
import { BrowserModule } from '@angular/platform-browser';

const routes: Routes = [
	{
		path: '', component: ScoreListComponent
	},
	{
		path: 'results/:teamCode', component: ScoreDetailComponent
	},
	{ 
		path: '**', component: ScoreListComponent
	}
];

@NgModule({
	imports: [
		BrowserModule,
		RouterModule.forRoot(routes), 
		ScoreTrackingModule
	],
	exports: [RouterModule]
})
export class AppRoutingModule { }
