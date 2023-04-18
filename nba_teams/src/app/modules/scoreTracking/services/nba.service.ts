import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
import { Result, Stats, Team, Game, GameData, TeamsData } from '../models/team.model';
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
		if (index >= 0) {
			this.teamsToShow.splice(index, 1);
		}
	}

	getResult(team: Team, numberOfDays: number = this.defaultDays): Observable<Game[]> {
		return this.http.get<GameData>(`${environment.apiUrl}/games?page=0`,
			{ headers: environment.headers, params: { per_page: numberOfDays, "team_ids[]": team.id.toString() } }).pipe(
				map(res => res.data)
			);
	}

	getStatsByGame(results: Game[], team: Team | undefined): Stats {
		const stats: Stats = { wins: 0, losses: 0, averagePointsScored: 0, averagePointsConceded: 0, lastGames: [] };
		results.forEach(game => {
			const gameStats = this.getSingleGameStats(team, game);
			stats.wins += gameStats.wins;
			stats.losses += gameStats.losses;
			stats.averagePointsConceded += gameStats.averagePointsConceded;
			stats.averagePointsScored += gameStats.averagePointsScored;
			stats.lastGames.push(gameStats.wins == 1 ? Result.WIN : Result.LOSE);
		});
		stats.averagePointsScored = Math.round(stats.averagePointsScored / results.length);
		stats.averagePointsConceded = Math.round(stats.averagePointsConceded / results.length);
		return stats;
	}

	private getSingleGameStats(team: Team | undefined, game: Game): Stats {
		const stats: Stats = { wins: 0, losses: 0, averagePointsScored: 0, averagePointsConceded: 0, lastGames: [] };
		if (game.home_team.id === team?.id) {
			stats.averagePointsScored = game.home_team_score;
			stats.averagePointsConceded = game.visitor_team_score;
			if (game.home_team_score > game.visitor_team_score) {
				stats.wins += 1;
			} else {
				stats.losses += 1;
			}
		}
		if (game.visitor_team.id === team?.id) {
			stats.averagePointsScored = game.visitor_team_score;
			stats.averagePointsConceded = game.home_team_score;
			if (game.visitor_team_score > game.home_team_score) {
				stats.wins = 1;
			} else {
				stats.losses = 1;
			}
		}
		return stats;
	}
}
