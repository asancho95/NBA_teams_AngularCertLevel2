import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { Team, TeamResult } from '../../models/team.model';
import { NbaService } from '../../services/nba.service';

@Component({
	selector: 'app-team-card',
	templateUrl: './team-card.component.html',
	styleUrls: ['./team-card.component.scss']
})
export class TeamCardComponent {

	@Input() team?: Team;
	result$: Observable<TeamResult[]> = new Observable();

	constructor(private nbaService: NbaService) { }

	ngOnInit(): void {
		if(this.team) {
			this.result$ = this.nbaService.getResult(this.team);
		}
	}

	deleteTeam(team: Team) {
		this.nbaService.deleteTeam(team);
	}
}
