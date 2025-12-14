import React from 'react';
import { Match, Sport } from '../types';
import { Calendar, ChevronRight } from 'lucide-react';
import TeamLogo from './TeamLogo';

interface MatchCardProps {
  match: Match;
  onClick: (id: string) => void;
}

const MatchCard: React.FC<MatchCardProps> = ({ match, onClick }) => {
  const bestHome = Math.max(...match.bookmakerOdds.map(o => o.homeWin));
  const bestAway = Math.max(...match.bookmakerOdds.map(o => o.awayWin));

  return (
    <div 
      onClick={() => onClick(match.id)}
      className="bg-brand-800 border border-brand-700 rounded-xl p-4 mb-4 hover:border-brand-accent transition-all cursor-pointer group shadow-lg"
    >
      <div className="flex justify-between items-center mb-4 text-xs text-slate-400 uppercase tracking-wider font-semibold">
        <div className="flex items-center gap-2">
          <span>{match.sport}</span>
          <span>•</span>
          <span>{match.league}</span>
        </div>
        <div className="flex items-center gap-1">
          <Calendar size={12} />
          {new Date(match.date).toLocaleDateString()} {new Date(match.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
        </div>
      </div>

      <div className="flex justify-between items-center">
        {/* Home Team */}
        <div className="flex flex-col items-center flex-1">
          <TeamLogo url={match.homeTeam.logo} name={match.homeTeam.name} size="md" className="mb-2" />
          <span className="font-bold text-lg text-center">{match.homeTeam.name}</span>
          <div className="flex gap-1 mt-1">
            {match.homeTeam.recentForm.map((f, i) => (
              <span key={i} className={`text-[10px] px-1 rounded ${f === 'W' ? 'bg-green-500/20 text-green-400' : f === 'D' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>
                {f}
              </span>
            ))}
          </div>
        </div>

        {/* VS / Odds Preview */}
        <div className="flex flex-col items-center px-4 w-1/3">
          <span className="text-slate-500 text-xs font-bold mb-2">VS</span>
          <div className="flex gap-2 w-full justify-center">
            <div className="bg-brand-900 rounded px-3 py-1 text-center border border-brand-700">
              <div className="text-[10px] text-slate-400">HOME</div>
              <div className="text-brand-accent font-mono font-bold">{bestHome.toFixed(2)}</div>
            </div>
             <div className="bg-brand-900 rounded px-3 py-1 text-center border border-brand-700">
              <div className="text-[10px] text-slate-400">AWAY</div>
              <div className="text-brand-accent font-mono font-bold">{bestAway.toFixed(2)}</div>
            </div>
          </div>
        </div>

        {/* Away Team */}
        <div className="flex flex-col items-center flex-1">
          <TeamLogo url={match.awayTeam.logo} name={match.awayTeam.name} size="md" className="mb-2" />
          <span className="font-bold text-lg text-center">{match.awayTeam.name}</span>
          <div className="flex gap-1 mt-1">
            {match.awayTeam.recentForm.map((f, i) => (
              <span key={i} className={`text-[10px] px-1 rounded ${f === 'W' ? 'bg-green-500/20 text-green-400' : f === 'D' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>
                {f}
              </span>
            ))}
          </div>
        </div>
      </div>
      
      <div className="mt-4 flex justify-end">
        <span className="text-sm text-brand-accent group-hover:underline flex items-center">
          Compare Odds & AI Analysis <ChevronRight size={16} />
        </span>
      </div>
    </div>
  );
};

export default MatchCard;