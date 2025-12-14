export enum Sport {
  SOCCER = 'Soccer',
  BASKETBALL = 'Basketball',
  TENNIS = 'Tennis'
}

export interface Team {
  id: string;
  name: string;
  logo: string; // URL or placeholder code
  recentForm: ('W' | 'D' | 'L')[]; // Last 5 games
  stats: {
    wins: number;
    draws?: number;
    losses: number;
    goalsScored?: number; // Avg per game
    goalsConceded?: number; // Avg per game
    possession?: number; // %
  }
}

export interface Odds {
  provider: string;
  homeWin: number;
  draw?: number;
  awayWin: number;
  updatedAt: string;
}

export interface Match {
  id: string;
  sport: Sport;
  league: string;
  homeTeam: Team;
  awayTeam: Team;
  date: string;
  bookmakerOdds: Odds[];
}

export interface GeminiAnalysis {
  trueOdds: {
    homeWin: number;
    draw?: number;
    awayWin: number;
  };
  valueBetDetected: boolean;
  reasoning: string;
  keyFactors: string[];
  recommendedBet: string;
  confidenceScore: number; // 0-100
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}