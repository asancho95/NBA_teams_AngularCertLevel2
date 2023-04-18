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

	//Variable to fill dropdown's list
	teams$: Observable<Team[]> = new Observable();

	//Teams tracked list
	get teamsToShow(): Team[] {
		return this.nbaService.teamsToShow;
	}

	constructor(private nbaService: NbaService) { }

	ngOnInit(): void {
		//Retrieving all teams list to dropdown
		this.teams$ = this.nbaService.getAllTeams();
	}

	/**
	 * Method in charge of find team tracked to add to teams array of NBA service
	 * @param teamId Team searched id
	 */
	trackTeam(teamId: string): void {
		let team: Team | undefined = this.nbaService.allTeams.find(team => team.id == Number(teamId));
		if (team) {
			this.nbaService.addTeam(team);
		}
	}
}
