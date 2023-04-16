import { Component,OnInit } from '@angular/core';
import { NbaService } from '../../services/nba.service';
import { Team } from '../../models/team.model';
import { Observable } from 'rxjs';

@Component({
	selector: 'app-score-list',
	templateUrl: './score-list.component.html',
	styleUrls: ['./score-list.component.scss']
})
export class ScoreListComponent implements OnInit {

	teams$: Observable<Team[]> = new Observable();

	get teamsToShow(): Team[] {
		return this.nbaService.teamsToShow;
	}

	constructor(private nbaService: NbaService) { }

	ngOnInit(): void {
		this.teams$ = this.nbaService.getAllTeams()
	}

	trackTeam(teamId: string): void {
		let team: Team | undefined = this.nbaService.allTeams.find(team => team.id == Number(teamId));
		if (team) {
			this.nbaService.addTeam(team);
		}
	}
}
