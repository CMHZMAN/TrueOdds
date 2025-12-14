import { Match, Sport, OddsHistoryPoint } from './types';

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
      stats: { wins: 18, draws: 4, losses: 3, goalsScored: 2.4, goalsConceded: 0.8, possession: 62 },
      history: { majorTitles: 4, avgLeagueFinish: 3.5, totalGoalsScoredLast10Y: 720 }
    },
    awayTeam: {
      id: 't2',
      name: 'Chelsea',
      logo: 'https://picsum.photos/id/12/40/40',
      recentForm: ['L', 'D', 'W', 'L', 'D'],
      stats: { wins: 10, draws: 6, losses: 9, goalsScored: 1.5, goalsConceded: 1.6, possession: 55 },
      history: { majorTitles: 6, avgLeagueFinish: 4.2, totalGoalsScoredLast10Y: 680 }
    },
    headToHead: {
      totalMatches: 24,
      homeWins: 9,
      awayWins: 8,
      draws: 7
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
      stats: { wins: 20, draws: 5, losses: 1, goalsScored: 2.8, goalsConceded: 0.7, possession: 58 },
      history: { majorTitles: 14, avgLeagueFinish: 1.8, totalGoalsScoredLast10Y: 950 }
    },
    awayTeam: {
      id: 't4',
      name: 'Barcelona',
      logo: 'https://picsum.photos/id/15/40/40',
      recentForm: ['W', 'W', 'W', 'W', 'L'],
      stats: { wins: 19, draws: 4, losses: 3, goalsScored: 2.6, goalsConceded: 0.9, possession: 65 },
      history: { majorTitles: 10, avgLeagueFinish: 1.9, totalGoalsScoredLast10Y: 920 }
    },
    headToHead: {
      totalMatches: 30,
      homeWins: 12,
      awayWins: 13,
      draws: 5
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
      stats: { wins: 45, losses: 12 },
      history: { majorTitles: 1, avgLeagueFinish: 3.0 }
    },
    awayTeam: {
      id: 't6',
      name: 'Denver Nuggets',
      logo: 'https://picsum.photos/id/22/40/40',
      recentForm: ['W', 'W', 'W', 'L', 'W'],
      stats: { wins: 40, losses: 17 },
      history: { majorTitles: 1, avgLeagueFinish: 4.5 }
    },
    headToHead: {
      totalMatches: 20,
      homeWins: 12,
      awayWins: 8,
      draws: 0
    },
    bookmakerOdds: [
      { provider: 'FanDuel', homeWin: 1.55, awayWin: 2.45, updatedAt: '30 mins ago' },
      { provider: 'MGM', homeWin: 1.52, awayWin: 2.55, updatedAt: '35 mins ago' }
    ]
  }
];

export const generateMockHistory = (match: Match): OddsHistoryPoint[] => {
  const history: OddsHistoryPoint[] = [];
  const hours = 24;
  
  // Use current odds as base
  const currentHome = Math.max(...match.bookmakerOdds.map(o => o.homeWin));
  const currentAway = Math.max(...match.bookmakerOdds.map(o => o.awayWin));
  const currentDraw = match.sport === 'Soccer' ? Math.max(...match.bookmakerOdds.map(o => o.draw || 0)) : undefined;

  for (let i = hours; i >= 0; i--) {
    // Add some random noise to create fluctuation
    // Older data has more variance from current
    const volatility = i * 0.01; 
    
    const noiseHome = (Math.random() - 0.5) * volatility * currentHome;
    const noiseAway = (Math.random() - 0.5) * volatility * currentAway;
    const noiseDraw = currentDraw ? (Math.random() - 0.5) * volatility * currentDraw : 0;

    const date = new Date();
    date.setHours(date.getHours() - i);
    
    history.push({
      timestamp: i === 0 ? 'Now' : date.getHours() + ':00',
      homeWin: parseFloat((currentHome + noiseHome).toFixed(2)),
      awayWin: parseFloat((currentAway + noiseAway).toFixed(2)),
      draw: currentDraw ? parseFloat((currentDraw + noiseDraw).toFixed(2)) : undefined
    });
  }
  return history;
};