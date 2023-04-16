import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
import { Team, TeamResult, TeamResultData, TeamsData } from '../models/team.model';
import { environment } from 'src/environments/environment';

@Injectable({
	providedIn: 'root'
})
export class NbaService {
	private _allTeams: Team[] = [];
	private _teamsToShow: Team[] = [];
	
	get allTeams(): Team[] {
		return this._allTeams;
	}

	get teamsToShow(): Team[] {
		return this._teamsToShow;
	}

	get defaultDays(): number {
		return 12;
	}

	constructor(private http: HttpClient) { }

	getAllTeams(): Observable<Team[]> {
		return this.http.get<TeamsData>(`${environment.apiUrl}/teams?page=0`, { headers: environment.headers })
			.pipe(map((res: TeamsData) => res.data),
					tap((t: Team[]) => this._allTeams = t));
	}

	addTeam(team: Team): void {
		this.teamsToShow.push(team);
	}
	
	deleteTeam(teamToSearch: Team) {
		let index: number = this.teamsToShow.findIndex((team: Team) => team.id === teamToSearch.id);
		if(index >= 0) {
			this.teamsToShow.splice(index, 1);
		}
	}
	
	getResult(team: Team, numberOfDays: number = this.defaultDays): Observable<TeamResult[]> {
		return this.http.get<TeamResultData>(`${environment.apiUrl}/games?page=0`,
			{headers: environment.headers, params: {per_page: numberOfDays, "team_ids[]": team.id.toString()}}).pipe(
			map(res => res.data)
		);
	}
}
