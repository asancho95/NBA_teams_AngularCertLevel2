import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScoreListComponent } from './modules/scoreTracking/components/score-list/score-list.component';
import { ScoreDetailComponent } from './modules/scoreTracking/components/score-detail/score-detail.component';

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
		RouterModule.forRoot(routes)
	],
	exports: [RouterModule]
})
export class AppRoutingModule { }
