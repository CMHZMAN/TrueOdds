import { Match, Sport } from './types';

export const MOCK_MATCHES: Match[] = [
  {
    id: 'm1',
    sport: Sport.SOCCER,
    league: 'Premier League',
    date: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
    homeTeam: {
      id: 't1',
      name: 'Arsenal',
      logo: 'https://picsum.photos/id/10/40/40',
      recentForm: ['W', 'W', 'W', 'D', 'W'],
      stats: { wins: 18, draws: 4, losses: 3, goalsScored: 2.4, goalsConceded: 0.8, possession: 62 }
    },
    awayTeam: {
      id: 't2',
      name: 'Chelsea',
      logo: 'https://picsum.photos/id/12/40/40',
      recentForm: ['L', 'D', 'W', 'L', 'D'],
      stats: { wins: 10, draws: 6, losses: 9, goalsScored: 1.5, goalsConceded: 1.6, possession: 55 }
    },
    bookmakerOdds: [
      { provider: 'Bet365', homeWin: 1.65, draw: 4.00, awayWin: 5.25, updatedAt: '2 mins ago' },
      { provider: 'William Hill', homeWin: 1.62, draw: 4.10, awayWin: 5.40, updatedAt: '5 mins ago' },
      { provider: 'DraftKings', homeWin: 1.70, draw: 3.90, awayWin: 5.00, updatedAt: '1 min ago' }
    ]
  },
  {
    id: 'm2',
    sport: Sport.SOCCER,
    league: 'La Liga',
    date: new Date(Date.now() + 172800000).toISOString(), // Day after tomorrow
    homeTeam: {
      id: 't3',
      name: 'Real Madrid',
      logo: 'https://picsum.photos/id/14/40/40',
      recentForm: ['W', 'D', 'W', 'W', 'W'],
      stats: { wins: 20, draws: 5, losses: 1, goalsScored: 2.8, goalsConceded: 0.7, possession: 58 }
    },
    awayTeam: {
      id: 't4',
      name: 'Barcelona',
      logo: 'https://picsum.photos/id/15/40/40',
      recentForm: ['W', 'W', 'W', 'W', 'L'],
      stats: { wins: 19, draws: 4, losses: 3, goalsScored: 2.6, goalsConceded: 0.9, possession: 65 }
    },
    bookmakerOdds: [
      { provider: 'Bet365', homeWin: 2.10, draw: 3.50, awayWin: 3.20, updatedAt: '10 mins ago' },
      { provider: 'Pinnacle', homeWin: 2.15, draw: 3.45, awayWin: 3.30, updatedAt: '1 hour ago' }
    ]
  },
  {
    id: 'm3',
    sport: Sport.BASKETBALL,
    league: 'NBA',
    date: new Date(Date.now() + 43200000).toISOString(), // 12 hours
    homeTeam: {
      id: 't5',
      name: 'Boston Celtics',
      logo: 'https://picsum.photos/id/20/40/40',
      recentForm: ['W', 'L', 'W', 'W', 'W'],
      stats: { wins: 45, losses: 12 }
    },
    awayTeam: {
      id: 't6',
      name: 'Denver Nuggets',
      logo: 'https://picsum.photos/id/22/40/40',
      recentForm: ['W', 'W', 'W', 'L', 'W'],
      stats: { wins: 40, losses: 17 }
    },
    bookmakerOdds: [
      { provider: 'FanDuel', homeWin: 1.55, awayWin: 2.45, updatedAt: '30 mins ago' },
      { provider: 'MGM', homeWin: 1.52, awayWin: 2.55, updatedAt: '35 mins ago' }
    ]
  }
];