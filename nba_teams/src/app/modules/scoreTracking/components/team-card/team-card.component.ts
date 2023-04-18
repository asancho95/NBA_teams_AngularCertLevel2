import { Component, Input } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Result, Stats, Team, Game } from '../../models/team.model';
import { NbaService } from '../../services/nba.service';

@Component({
	selector: 'app-team-card',
	templateUrl: './team-card.component.html',
	styleUrls: ['./team-card.component.scss']
})
export class TeamCardComponent {

	//Team data to show in card
	@Input() team?: Team;
	//Team's results of last 12 days 
	result$: Observable<Game[]> = new Observable();
	//Team's stats of last 12 days
	stats?: Stats;

	//Get of team logo by its abbreviation
	get logoSrc(): string {
		return `https://interstate21.com/nba-logos/${this.team?.abbreviation}.png`;
	}

	constructor(private nbaService: NbaService) { }

	ngOnInit(): void {
		if(this.team) {
			//Retrieving the results of lat 12 days
			this.result$ = this.nbaService.getResult(this.team).pipe(
				tap((games: Game[]) =>  this.stats = this.nbaService.getStatsOfAllGames(games, this.team))
			);
		}
	}

	/**
	 * Method in charge of delete a team from service
	 * @param team Team to delete
	 */
	deleteTeam(team: Team): void {
		this.nbaService.deleteTeam(team);
	}
}
