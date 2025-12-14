import React from 'react';
import { Match, Team } from '../types';
import { History, Trophy, Swords, Crown } from 'lucide-react';

interface HistoricalAnalysisProps {
  match: Match;
}

const HistoricalAnalysis: React.FC<HistoricalAnalysisProps> = ({ match }) => {
  if (!match.headToHead || !match.homeTeam.history || !match.awayTeam.history) {
    return null;
  }

  const { headToHead, homeTeam, awayTeam } = match;

  // --- PREDICTION LOGIC ---
  // We calculate a score based on H2H dominance and Major Titles
  const calculateScore = (team: Team, winsAgainstOpponent: number) => {
    const h2hWeight = 5; // High weight for direct matchups
    const titleWeight = 2; // Medium weight for trophies
    const consistencyWeight = 3; // Weight for avg finish (lower is better)

    let score = 0;
    
    // H2H Points
    score += winsAgainstOpponent * h2hWeight;

    // Title Points
    score += (team.history?.majorTitles || 0) * titleWeight;

    // Consistency (Inverse: 20 minus avg finish, clamped)
    // Assuming worst finish is 20th. Better finish adds more points.
    const avgFinish = team.history?.avgLeagueFinish || 10;
    score += Math.max(0, 20 - avgFinish) * consistencyWeight;

    return score;
  };

  const homeScore = calculateScore(homeTeam, headToHead.homeWins);
  const awayScore = calculateScore(awayTeam, headToHead.awayWins);
  const totalScore = homeScore + awayScore;

  const homeProb = Math.round((homeScore / totalScore) * 100);
  const awayProb = 100 - homeProb;

  const predictedWinner = homeScore > awayScore ? homeTeam.name : awayTeam.name;
  const isDrawLikely = Math.abs(homeScore - awayScore) < (totalScore * 0.1); // If scores are within 10%

  return (
    <div className="bg-brand-800 rounded-xl border border-brand-700 p-6 shadow-xl relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <History size={120} />
        </div>

        <div className="flex items-center gap-2 mb-6 border-b border-brand-700 pb-4 relative z-10">
            <History className="text-purple-400" size={20} />
            <h3 className="font-bold text-white">10-Year Historical Analysis</h3>
        </div>

        {/* Prediction Banner */}
        <div className="mb-8 bg-gradient-to-r from-brand-900 to-brand-800 p-4 rounded-lg border border-purple-500/30 relative z-10">
            <div className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-1">Historical Prediction</div>
            <div className="flex items-center gap-3">
                {isDrawLikely ? (
                    <span className="text-xl font-bold text-white">Data indicates a tightly contested <span className="text-slate-300">Draw</span></span>
                ) : (
                    <div className="flex items-center gap-2">
                         <Crown className="text-yellow-400" size={24} fill="currentColor" />
                         <span className="text-2xl font-bold text-white">
                             {predictedWinner} <span className="text-sm font-normal text-slate-400">is statistically favored</span>
                         </span>
                    </div>
                )}
            </div>
            
            {/* Probability Bar */}
            <div className="mt-4 flex items-center gap-4">
                <span className="text-xs font-bold text-brand-accent">{homeTeam.name} {homeProb}%</span>
                <div className="flex-1 h-2 bg-brand-900 rounded-full overflow-hidden flex">
                    <div style={{ width: `${homeProb}%` }} className="bg-brand-accent h-full"></div>
                    <div style={{ width: `${awayProb}%` }} className="bg-blue-500 h-full"></div>
                </div>
                <span className="text-xs font-bold text-blue-400">{awayProb}% {awayTeam.name}</span>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
            {/* Head to Head Column */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                    <Swords className="text-slate-400" size={16} />
                    <h4 className="font-bold text-sm text-slate-300">Head-to-Head (Last {headToHead.totalMatches} Matches)</h4>
                </div>
                
                <div className="flex justify-between items-center text-center bg-brand-900/50 p-4 rounded-lg">
                    <div>
                        <div className="text-2xl font-bold text-brand-accent">{headToHead.homeWins}</div>
                        <div className="text-[10px] uppercase text-slate-500 font-bold">{homeTeam.name}</div>
                    </div>
                    <div>
                        <div className="text-lg font-bold text-slate-400">{headToHead.draws}</div>
                        <div className="text-[10px] uppercase text-slate-600 font-bold">Draws</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-blue-500">{headToHead.awayWins}</div>
                        <div className="text-[10px] uppercase text-slate-500 font-bold">{awayTeam.name}</div>
                    </div>
                </div>
            </div>

            {/* Trophy Cabinet Column */}
            <div className="space-y-4">
                 <div className="flex items-center gap-2 mb-2">
                    <Trophy className="text-yellow-500" size={16} />
                    <h4 className="font-bold text-sm text-slate-300">Major Titles (10 Years)</h4>
                </div>

                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-300">{homeTeam.name}</span>
                        <div className="flex items-center gap-1">
                            {Array.from({ length: Math.min(homeTeam.history.majorTitles, 8) }).map((_, i) => (
                                <div key={i} className="w-1.5 h-4 bg-yellow-500/80 rounded-sm"></div>
                            ))}
                            <span className="ml-2 text-sm font-bold text-white">{homeTeam.history.majorTitles}</span>
                        </div>
                    </div>
                     <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-300">{awayTeam.name}</span>
                        <div className="flex items-center gap-1">
                            {Array.from({ length: Math.min(awayTeam.history.majorTitles, 8) }).map((_, i) => (
                                <div key={i} className="w-1.5 h-4 bg-blue-500/80 rounded-sm"></div>
                            ))}
                            <span className="ml-2 text-sm font-bold text-white">{awayTeam.history.majorTitles}</span>
                        </div>
                    </div>
                </div>

                <div className="mt-4 pt-4 border-t border-brand-700/50 flex justify-between text-xs">
                     <div className="text-slate-400">
                        Avg League Finish: <span className="text-white font-mono">{homeTeam.history.avgLeagueFinish}</span>
                     </div>
                     <div className="text-slate-400">
                        Avg League Finish: <span className="text-white font-mono">{awayTeam.history.avgLeagueFinish}</span>
                     </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default HistoricalAnalysis;