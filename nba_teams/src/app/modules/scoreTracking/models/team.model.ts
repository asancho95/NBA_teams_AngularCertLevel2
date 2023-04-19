export interface TeamsData {
    data: Team[];
    meta: Pagination;
}

export interface Team {
    id: number;
    abbreviation: string;
    city: string;
    conference: string;
    division: string;
    full_name: string;
    name: string;
}

export interface GameData {
    meta: Pagination;
    data: Game[];
}

export interface Game {
    id: number;
    date: Date;
    home_team: Team;
    home_team_score: number;
    period: number;
    postseason: boolean;
    season: number;
    status: string;
    time: string;
    visitor_team: Team;
    visitor_team_score: number;
}

export interface Stats {
    wins: number;
    losses: number;
    pointsScored: number;
    pointsConceded: number;
    games: Result[];
}

export enum Result {
    WIN = 'W',
    LOSE = 'L'
}

export interface Pagination {
    total_pages: number;
    current_page: number;
    next_page?: number;
    per_page: number;
    total_count: number;
}