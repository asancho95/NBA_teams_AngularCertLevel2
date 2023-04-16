import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScoreDetailComponent } from './components/score-detail/score-detail.component';
import { ScoreListComponent } from './components/score-list/score-list.component';
import { RouterModule } from '@angular/router';
import { NbaService } from './services/nba.service';
import { HttpClientModule } from '@angular/common/http';
import { TeamCardComponent } from './components/team-card/team-card.component';



@NgModule({
	declarations: [
		ScoreListComponent,
		ScoreDetailComponent,
  TeamCardComponent
	],
	imports: [
		CommonModule,
		HttpClientModule,
		RouterModule.forChild([
			{
				path: '', component: ScoreListComponent
			},
			{
				path: 'results/:teamCode', component: ScoreDetailComponent
			},
			{ 
				path: '**', component: ScoreListComponent
			}
		])
	],
	providers: [ NbaService ]
})
export class ScoreTrackingModule { }
