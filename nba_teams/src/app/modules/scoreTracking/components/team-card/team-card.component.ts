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

	@Input() team?: Team;
	result$: Observable<Game[]> = new Observable();
	stats?: Stats;

	get logoSrc(): string {
		return `https://interstate21.com/nba-logos/${this.team?.abbreviation}.png`
	}

	constructor(private nbaService: NbaService) { }

	ngOnInit(): void {
		if(this.team) {
			this.result$ = this.nbaService.getResult(this.team).pipe(
				tap((games) =>  this.stats = this.nbaService.getStatsByGame(games, this.team))
			  );
		}
	}

	deleteTeam(team: Team) {
		this.nbaService.deleteTeam(team);
	}
}
