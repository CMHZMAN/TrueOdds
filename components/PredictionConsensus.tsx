import React from 'react';
import { Match, GeminiAnalysis } from '../types';
import { Scale, Trophy, Users, Brain, Target } from 'lucide-react';

interface PredictionConsensusProps {
  match: Match;
  analysis: GeminiAnalysis | null;
}

const PredictionConsensus: React.FC<PredictionConsensusProps> = ({ match, analysis }) => {
  // --- 1. MARKET PROBABILITY (20% Weight) ---
  // Average the implied probability from bookmaker odds
  // Prob = 1 / DecimalOdds
  const calculateMarketProb = () => {
    let sumHome = 0, sumAway = 0, count = 0;
    match.bookmakerOdds.forEach(o => {
      sumHome += (1 / o.homeWin);
      sumAway += (1 / o.awayWin);
      count++;
    });
    
    // Normalize (ignoring draw for binary comparison or including it for total)
    // For "Who will win", we compare relative strengths.
    const avgHome = sumHome / count;
    const avgAway = sumAway / count;
    const total = avgHome + avgAway; // Simple normalization between two teams for the gauge
    
    return {
      home: (avgHome / total) * 100,
      away: (avgAway / total) * 100
    };
  };

  // --- 2. HISTORICAL PROBABILITY (30% Weight) ---
  // Based on the logic from HistoricalAnalysis (H2H + Titles + Consistency)
  const calculateHistoryProb = () => {
    if (!match.headToHead || !match.homeTeam.history || !match.awayTeam.history) return { home: 50, away: 50 };

    const getScore = (team: any, winsVsOpponent: number) => {
       let score = winsVsOpponent * 5; // H2H
       score += (team.history?.majorTitles || 0) * 2; // Titles
       score += Math.max(0, 20 - (team.history?.avgLeagueFinish || 10)) * 3; // Consistency
       return score;
    };

    const homeScore = getScore(match.homeTeam, match.headToHead.homeWins);
    const awayScore = getScore(match.awayTeam, match.headToHead.awayWins);
    const total = homeScore + awayScore;

    return {
      home: (homeScore / total) * 100,
      away: (awayScore / total) * 100
    };
  };

  // --- 3. AI PROBABILITY (50% Weight) ---
  // Based on Gemini True Odds
  const calculateAIProb = () => {
    if (!analysis) return null;
    
    const probHome = 1 / analysis.trueOdds.homeWin;
    const probAway = 1 / analysis.trueOdds.awayWin;
    const total = probHome + probAway;

    return {
      home: (probHome / total) * 100,
      away: (probAway / total) * 100
    };
  };

  const market = calculateMarketProb();
  const history = calculateHistoryProb();
  const ai = calculateAIProb();

  // --- WEIGHTED CONSENSUS ---
  // If AI is missing, we rebalance: Market 40%, History 60%
  let finalHome = 0;
  let finalAway = 0;

  if (ai) {
    finalHome = (market.home * 0.2) + (history.home * 0.3) + (ai.home * 0.5);
    finalAway = (market.away * 0.2) + (history.away * 0.3) + (ai.away * 0.5);
  } else {
    finalHome = (market.home * 0.4) + (history.home * 0.6);
    finalAway = (market.away * 0.4) + (history.away * 0.6);
  }
  
  // Normalize final to 100%
  const totalFinal = finalHome + finalAway;
  finalHome = (finalHome / totalFinal) * 100;
  finalAway = (finalAway / totalFinal) * 100;

  const predictedWinner = finalHome > finalAway ? match.homeTeam.name : match.awayTeam.name;
  const winProbability = Math.max(finalHome, finalAway).toFixed(1);
  const isTooClose = Math.abs(finalHome - finalAway) < 5;

  return (
    <div className="bg-gradient-to-r from-brand-900 to-slate-900 rounded-xl border border-brand-700 p-1 shadow-2xl overflow-hidden mb-8">
      {/* Header */}
      <div className="bg-brand-800/50 p-4 border-b border-brand-700/50 flex justify-between items-center backdrop-blur">
         <div className="flex items-center gap-2">
            <Target className="text-red-500" size={24} />
            <h3 className="text-xl font-bold text-white tracking-tight">Match Consensus <span className="text-brand-accent">Prediction</span></h3>
         </div>
         {!ai && (
             <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded border border-yellow-500/30">
                 Preliminary (Run AI for accuracy)
             </span>
         )}
      </div>

      <div className="p-6">
          {/* Main Verdict */}
          <div className="flex flex-col items-center justify-center mb-8">
              <div className="text-sm text-slate-400 uppercase tracking-widest font-bold mb-2">Projected Winner</div>
              {isTooClose ? (
                  <div className="text-3xl md:text-5xl font-black text-slate-200 text-center tracking-tighter">
                      TOO CLOSE TO CALL
                  </div>
              ) : (
                  <div className="text-3xl md:text-5xl font-black text-white text-center tracking-tighter flex flex-col md:flex-row items-center gap-3">
                      <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-accent to-blue-500">
                        {predictedWinner.toUpperCase()}
                      </span>
                      <span className="text-2xl md:text-3xl font-bold text-slate-500 bg-brand-900 px-3 py-1 rounded-lg border border-brand-700">
                        {winProbability}%
                      </span>
                  </div>
              )}
          </div>

          {/* Data Sources Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Source 1: Market */}
              <div className="bg-brand-900/50 p-3 rounded-lg border border-brand-700/50">
                  <div className="flex items-center gap-2 mb-2">
                      <Users size={16} className="text-blue-400" />
                      <span className="text-xs font-bold text-slate-400 uppercase">Betting Market (20%)</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden flex">
                      <div style={{ width: `${market.home}%` }} className="bg-brand-accent/70 h-full"></div>
                      <div style={{ width: `${market.away}%` }} className="bg-blue-500/70 h-full"></div>
                  </div>
                  <div className="flex justify-between mt-1 text-[10px] text-slate-500 font-mono">
                      <span>{market.home.toFixed(0)}%</span>
                      <span>{market.away.toFixed(0)}%</span>
                  </div>
              </div>

               {/* Source 2: History */}
               <div className="bg-brand-900/50 p-3 rounded-lg border border-brand-700/50">
                  <div className="flex items-center gap-2 mb-2">
                      <Trophy size={16} className="text-yellow-500" />
                      <span className="text-xs font-bold text-slate-400 uppercase">Historical Stats (30%)</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden flex">
                      <div style={{ width: `${history.home}%` }} className="bg-brand-accent/70 h-full"></div>
                      <div style={{ width: `${history.away}%` }} className="bg-blue-500/70 h-full"></div>
                  </div>
                  <div className="flex justify-between mt-1 text-[10px] text-slate-500 font-mono">
                      <span>{history.home.toFixed(0)}%</span>
                      <span>{history.away.toFixed(0)}%</span>
                  </div>
              </div>

               {/* Source 3: AI */}
               <div className={`p-3 rounded-lg border ${ai ? 'bg-purple-900/20 border-purple-500/30' : 'bg-slate-800/50 border-slate-700 border-dashed opacity-50'}`}>
                  <div className="flex items-center gap-2 mb-2">
                      <Brain size={16} className="text-purple-400" />
                      <span className="text-xs font-bold text-slate-400 uppercase">Gemini AI (50%)</span>
                  </div>
                  {ai ? (
                      <>
                        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden flex">
                            <div style={{ width: `${ai.home}%` }} className="bg-brand-accent h-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                            <div style={{ width: `${ai.away}%` }} className="bg-blue-500 h-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                        </div>
                        <div className="flex justify-between mt-1 text-[10px] text-slate-500 font-mono">
                            <span>{ai.home.toFixed(0)}%</span>
                            <span>{ai.away.toFixed(0)}%</span>
                        </div>
                      </>
                  ) : (
                      <div className="text-[10px] text-center text-slate-500 py-1">Waiting for Analysis...</div>
                  )}
              </div>
          </div>
      </div>
    </div>
  );
};

export default PredictionConsensus;