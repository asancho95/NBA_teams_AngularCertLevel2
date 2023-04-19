import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
import { Result, Stats, Team, Game, GameData, TeamsData } from '../models/team.model';
import { environment } from 'src/environments/environment';

@Injectable({
	providedIn: 'root'
})
export class NbaService {
	//List of teams to fill dropdown
	private _allTeams: Team[] = [];
	//List of teams to show in cards and find team data for its detail view
	private _teamsToShow: Team[] = [];

	get allTeams(): Team[] {
		return this._allTeams;
	}

	get teamsToShow(): Team[] {
		return this._teamsToShow;
	}

	//Number of days by default to search results of X last days for each team
	get defaultDays(): number {
		return 12;
	}

	constructor(private http: HttpClient) { }

	/**
	 * Method in charge of retive all teams needed to fill dropdown list
	 * @returns List of all team to fill dropdown
	 */
	getAllTeams(): Observable<Team[]> {
		let params: HttpParams = new HttpParams();
		params = params.append('page', 0);
		return this.http.get<TeamsData>(`${environment.apiUrl}/teams`, { headers: environment.headers, params: params })
			.pipe(map((res: TeamsData) => res.data),
				tap((t: Team[]) => this._allTeams = t));
	}

	/**
	 * Method in charge of add teams to 'teamsToShow' array
	 * @param team Team to add to array
	 */
	addTeam(team: Team): void {
		this.teamsToShow.push(team);
	}

	/**
	 * Method in charge of delete teams from 'teamsToShow' array
	 * @param teamToSearch Team to delete from 'teamsToShow' array
	 */
	deleteTeam(teamToSearch: Team): void {
		let index: number = this.teamsToShow.findIndex((team: Team) => team.id === teamToSearch.id);
		if (index >= 0) {
			this.teamsToShow.splice(index, 1);
		}
	}

	/**
	 * 
	 * @param team Team to search results
	 * @param numberOfDays Number of days to search results of X last days for each team
	 * @returns Retrieve result of the last 'numberOfDays' days
	 */
	getResult(team: Team, numberOfDays: number = this.defaultDays): Observable<Game[]> {
		let params: HttpParams = new HttpParams();
		params = params.append('page', 0);
		params = params.append('per_page', numberOfDays);
		params = params.append('team_ids[]', team.id.toString());
		params = this.setDatesParams(numberOfDays, params);
		return this.http.get<GameData>(`${environment.apiUrl}/games`,
			{ headers: environment.headers, params: params }).pipe(
				map((res: GameData) => res.data)
			);
	}

	/**
	 * Method in charge of concat dates of the last X days with yyy-MM-dd format
	 * @param numberOfDays
	 * @returns 
	 */
	private getDates(numberOfDays: number): string[] {
		let dates: string[] = new Array(numberOfDays).fill(0).map((item: number, index: number) => {
			let day: Date = new Date();
			const daysBefore: number = index + 1;
			day.setDate(day.getDate()-(daysBefore));
			return `${day.getFullYear()}-${day.getMonth()+1}-${day.getDate()}`;
		});
	  	return dates;
	}

	/**
	 * Method in charge of set dates array as params for getResult request 
	 * @param numberOfDays 
	 * @param params 
	 */
	private setDatesParams(numberOfDays: number, params: HttpParams): HttpParams {
		this.getDates(numberOfDays).forEach((date: string) => {
			params = params.append('dates[]', date);
		});
		return params;
	}

	/**
	 * Method in charge of get all stats from games array (wins, losees and scores)
	 * @param results Games to check
	 * @param team Team to search scores
	 * @returns Object with data needed to show wins, losses and scores
	 */
	getStatsOfAllGames(results: Game[], team: Team | undefined): Stats {
		const stats: Stats = { wins: 0, losses: 0, pointsScored: 0, pointsConceded: 0, games: [] };
		results.forEach((game: Game) => {
			let gameStats: Stats = this.getStatsByGame(team, game);
			stats.wins += gameStats.wins;
			stats.losses += gameStats.losses;
			stats.pointsConceded += gameStats.pointsConceded;
			stats.pointsScored += gameStats.pointsScored;
			this.addStateGame(stats.games, gameStats);
		});
		stats.pointsScored = Math.round(stats.pointsScored / results.length);
		stats.pointsConceded = Math.round(stats.pointsConceded / results.length);
		return stats;
	}

	/**
	 * Method in charge of indentify id the team is visitor or not to update its scores
	 * @param team Team to search
	 * @param game Game with scores
	 * @returns Object with data needed to show wins, losses and scores
	 */
	private getStatsByGame(team: Team | undefined, game: Game): Stats {
		let stats: Stats = { wins: 0, losses: 0, pointsScored: 0, pointsConceded: 0, games: [] };
		if (game.home_team.id === team?.id) {
			this.updatePoints(stats, game.home_team_score, game.visitor_team_score);
		} else if (game.visitor_team.id === team?.id) {
			this.updatePoints(stats, game.visitor_team_score, game.home_team_score);
		}
		return stats;
	}

	/**
	 * Method in charge of update data of Stats with scores
	 * @param stats Object to update
	 * @param teamScore Score of the team
	 * @param enemyScore Score of the enemy team
	 */
	private updatePoints(stats: Stats, teamScore: number, enemyScore: number) {
		stats.pointsScored = teamScore;
		stats.pointsConceded = enemyScore;
		if (teamScore > enemyScore) {
			stats.wins += 1;
		} else {
			stats.losses += 1;
		}
	}

	/**
	 * Method in charge of add the result of the match to show in each card
	 * @param games 
	 * @param stats 
	 */
	private addStateGame(games: Result[], stats: Stats) {
		if(stats.wins === 1) {
			games.push(Result.WIN);
		} else {
			games.push(Result.LOSE);
		}
	}
}
