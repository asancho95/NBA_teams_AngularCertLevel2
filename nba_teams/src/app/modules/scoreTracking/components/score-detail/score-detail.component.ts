import { Component, OnInit } from '@angular/core';
import { Team, Game } from '../../models/team.model';
import { Observable } from 'rxjs';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { NbaService } from '../../services/nba.service';

@Component({
    selector: 'app-score-detail',
    templateUrl: './score-detail.component.html',
    styleUrls: ['./score-detail.component.scss']
})
export class ScoreDetailComponent implements OnInit {
    private urlParam: string = 'teamCode';
    team?: Team;
    results$?: Observable<Game[]>;

    constructor(private activatedRoute: ActivatedRoute, private nbaService: NbaService) { }

    ngOnInit(): void {
        this.getResults();
    }

    private getResults() {
        this.activatedRoute.paramMap.subscribe({
            next: (paramMap: ParamMap) => {
                this.team = this.nbaService.teamsToShow.find((t: Team) => t.abbreviation === paramMap.get(this.urlParam));
                if (this.team) {
                    this.results$ = this.nbaService.getResult(this.team);
                }
            }
        });
    }
}
