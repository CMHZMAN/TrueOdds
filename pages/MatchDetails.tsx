import React, { useMemo, useState } from 'react';
import { Match, GeminiAnalysis } from '../types';
import { ArrowLeft, BarChart2, Shield } from 'lucide-react';
import OddsComparison from '../components/OddsComparison';
import AIAnalysis from '../components/AIAnalysis';
import TeamLogo from '../components/TeamLogo';
import OddsHistoryChart from '../components/OddsHistoryChart';
import StatsComparison from '../components/StatsComparison';
import HistoricalAnalysis from '../components/HistoricalAnalysis';
import PredictionConsensus from '../components/PredictionConsensus';
import { generateMockHistory } from '../constants';

interface MatchDetailsProps {
  match: Match;
  onBack: () => void;
}

const MatchDetails: React.FC<MatchDetailsProps> = ({ match, onBack }) => {
  // Lifted state to share with PredictionConsensus
  const [aiAnalysis, setAiAnalysis] = useState<GeminiAnalysis | null>(null);

  // Memoize history generation so it doesn't change on re-renders
  const historyData = useMemo(() => generateMockHistory(match), [match]);

  return (
    <div className="animate-fade-in pb-12">
      <button 
        onClick={onBack}
        className="flex items-center text-slate-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft size={18} className="mr-2" /> Back to Dashboard
      </button>

      {/* Header Info */}
      <div className="bg-brand-800 rounded-2xl p-6 md:p-10 mb-8 border border-brand-700 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-accent to-blue-500"></div>
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
          <div className="text-center md:text-right flex-1 flex flex-col items-center md:items-end">
             <TeamLogo url={match.homeTeam.logo} name={match.homeTeam.name} size="xl" className="mb-2" />
             <h2 className="text-2xl md:text-3xl font-bold text-white">{match.homeTeam.name}</h2>
             <div className="text-sm text-slate-400 mt-1">
                Win Rate: {((match.homeTeam.stats.wins / (match.homeTeam.stats.wins + match.homeTeam.stats.losses + (match.homeTeam.stats.draws || 0))) * 100).toFixed(0)}%
             </div>
          </div>

          <div className="text-center px-4">
            <div className="text-sm text-brand-accent font-bold tracking-widest uppercase mb-2">{match.league}</div>
            <div className="text-4xl font-black text-slate-700 dark:text-slate-600 select-none">VS</div>
            <div className="text-xs text-slate-400 mt-2 bg-brand-900 px-3 py-1 rounded-full border border-brand-700 inline-block">
               {new Date(match.date).toLocaleDateString()} • {new Date(match.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </div>
          </div>

          <div className="text-center md:text-left flex-1 flex flex-col items-center md:items-start">
             <TeamLogo url={match.awayTeam.logo} name={match.awayTeam.name} size="xl" className="mb-2" />
             <h2 className="text-2xl md:text-3xl font-bold text-white">{match.awayTeam.name}</h2>
             <div className="text-sm text-slate-400 mt-1">
               Win Rate: {((match.awayTeam.stats.wins / (match.awayTeam.stats.wins + match.awayTeam.stats.losses + (match.awayTeam.stats.draws || 0))) * 100).toFixed(0)}%
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* New Prediction Consensus Engine */}
          <PredictionConsensus match={match} analysis={aiAnalysis} />

          <AIAnalysis 
            match={match} 
            analysis={aiAnalysis}
            onAnalysisComplete={setAiAnalysis}
          />
          
          <StatsComparison homeTeam={match.homeTeam} awayTeam={match.awayTeam} />

          <HistoricalAnalysis match={match} />
          
          <OddsHistoryChart 
            data={historyData} 
            homeName={match.homeTeam.name} 
            awayName={match.awayTeam.name} 
            showDraw={match.sport === 'Soccer'}
          />

          <OddsComparison match={match} />
        </div>

        {/* Sidebar: Stat Blocks */}
        <div className="space-y-6">
           <div className="bg-gradient-to-br from-purple-900/50 to-brand-900 rounded-xl p-6 border border-purple-500/20">
              <Shield className="text-purple-400 mb-2" size={24} />
              <h3 className="font-bold text-white mb-2">Why Trust Gemini?</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Gemini processes multidimensional data points including player form, tactical matchups, and historical variance that traditional models might miss.
              </p>
           </div>
           
           <div className="bg-brand-800 rounded-xl p-6 border border-brand-700">
             <h3 className="font-bold text-white mb-4">Betting Tips</h3>
             <ul className="space-y-3 text-sm text-slate-400">
               <li className="flex gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-brand-accent mt-1.5"></div>
                 Always check lineups before placing bets.
               </li>
                <li className="flex gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-brand-accent mt-1.5"></div>
                 Look for value, not just winners.
               </li>
                <li className="flex gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-brand-accent mt-1.5"></div>
                 Manage your bankroll responsibly.
               </li>
             </ul>
           </div>
        </div>
      </div>
    </div>
  );
};

export default MatchDetails;