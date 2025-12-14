import React from 'react';
import { Match } from '../types';
import { ArrowLeft, BarChart2, Shield } from 'lucide-react';
import OddsComparison from '../components/OddsComparison';
import AIAnalysis from '../components/AIAnalysis';
import TeamLogo from '../components/TeamLogo';

interface MatchDetailsProps {
  match: Match;
  onBack: () => void;
}

const MatchDetails: React.FC<MatchDetailsProps> = ({ match, onBack }) => {
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
        {/* Main Content: AI Analysis takes prominence */}
        <div className="lg:col-span-2 space-y-8">
          <AIAnalysis match={match} />
          <OddsComparison match={match} />
        </div>

        {/* Sidebar: Stat Blocks */}
        <div className="space-y-6">
           <div className="bg-brand-800 rounded-xl p-6 border border-brand-700">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <BarChart2 className="text-blue-400" size={18} /> Head-to-Head Stats
              </h3>
              <div className="space-y-4">
                 <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Goals Scored (Avg)</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <span className="text-xs w-8 text-right font-mono">{match.homeTeam.stats.goalsScored || '-'}</span>
                    <div className="flex-1 h-2 bg-brand-900 rounded-full overflow-hidden flex">
                       <div style={{width: '50%'}} className="bg-emerald-500 h-full"></div>
                       <div style={{width: '50%'}} className="bg-blue-500 h-full"></div>
                    </div>
                    <span className="text-xs w-8 text-left font-mono">{match.awayTeam.stats.goalsScored || '-'}</span>
                 </div>
                 <div className="flex justify-between text-xs text-slate-500">
                    <span>{match.homeTeam.name}</span>
                    <span>{match.awayTeam.name}</span>
                 </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-brand-700">
                <h4 className="text-xs font-bold text-slate-500 mb-3 uppercase">Recent Form</h4>
                <div className="flex justify-between items-center mb-2">
                   <span className="text-sm text-white">{match.homeTeam.name}</span>
                   <div className="flex gap-1">
                      {match.homeTeam.recentForm.map((f, i) => (
                        <span key={i} className={`w-5 h-5 flex items-center justify-center text-[10px] rounded ${f === 'W' ? 'bg-green-500 text-white' : f === 'D' ? 'bg-yellow-500 text-black' : 'bg-red-500 text-white'}`}>{f}</span>
                      ))}
                   </div>
                </div>
                <div className="flex justify-between items-center">
                   <span className="text-sm text-white">{match.awayTeam.name}</span>
                   <div className="flex gap-1">
                      {match.awayTeam.recentForm.map((f, i) => (
                        <span key={i} className={`w-5 h-5 flex items-center justify-center text-[10px] rounded ${f === 'W' ? 'bg-green-500 text-white' : f === 'D' ? 'bg-yellow-500 text-black' : 'bg-red-500 text-white'}`}>{f}</span>
                      ))}
                   </div>
                </div>
              </div>
           </div>

           <div className="bg-gradient-to-br from-purple-900/50 to-brand-900 rounded-xl p-6 border border-purple-500/20">
              <Shield className="text-purple-400 mb-2" size={24} />
              <h3 className="font-bold text-white mb-2">Why Trust Gemini?</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Gemini processes multidimensional data points including player form, tactical matchups, and historical variance that traditional models might miss.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default MatchDetails;