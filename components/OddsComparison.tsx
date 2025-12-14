import React from 'react';
import { Match, Odds } from '../types';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface OddsComparisonProps {
  match: Match;
}

const OddsComparison: React.FC<OddsComparisonProps> = ({ match }) => {
  // Find best odds to highlight them
  const bestHome = Math.max(...match.bookmakerOdds.map(o => o.homeWin));
  const bestDraw = match.bookmakerOdds[0].draw ? Math.max(...match.bookmakerOdds.map(o => o.draw || 0)) : 0;
  const bestAway = Math.max(...match.bookmakerOdds.map(o => o.awayWin));

  return (
    <div className="bg-brand-800 rounded-xl overflow-hidden border border-brand-700">
      <div className="p-4 border-b border-brand-700 bg-brand-900/50">
        <h3 className="font-bold text-white flex items-center gap-2">
          <TrendingUp className="text-brand-accent" size={20} />
          Bookmaker Comparison
        </h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-xs text-slate-500 border-b border-brand-700 bg-brand-900/30">
              <th className="p-4 font-semibold">Bookmaker</th>
              <th className="p-4 font-semibold text-center">Home ({match.homeTeam.name})</th>
              {match.sport === 'Soccer' && <th className="p-4 font-semibold text-center">Draw</th>}
              <th className="p-4 font-semibold text-center">Away ({match.awayTeam.name})</th>
              <th className="p-4 font-semibold text-right">Updated</th>
            </tr>
          </thead>
          <tbody>
            {match.bookmakerOdds.map((odds, idx) => (
              <tr key={idx} className="border-b border-brand-700 hover:bg-brand-700/30 transition-colors">
                <td className="p-4 font-medium text-slate-300">{odds.provider}</td>
                
                <td className="p-4 text-center">
                  <span className={`px-2 py-1 rounded font-mono font-bold ${odds.homeWin === bestHome ? 'bg-brand-accent text-brand-900' : 'text-slate-400 bg-brand-900'}`}>
                    {odds.homeWin.toFixed(2)}
                  </span>
                </td>
                
                {match.sport === 'Soccer' && (
                  <td className="p-4 text-center">
                     <span className={`px-2 py-1 rounded font-mono font-bold ${odds.draw === bestDraw ? 'bg-brand-accent text-brand-900' : 'text-slate-400 bg-brand-900'}`}>
                      {odds.draw?.toFixed(2)}
                    </span>
                  </td>
                )}
                
                <td className="p-4 text-center">
                   <span className={`px-2 py-1 rounded font-mono font-bold ${odds.awayWin === bestAway ? 'bg-brand-accent text-brand-900' : 'text-slate-400 bg-brand-900'}`}>
                    {odds.awayWin.toFixed(2)}
                  </span>
                </td>
                
                <td className="p-4 text-right text-xs text-slate-500">
                  {odds.updatedAt}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OddsComparison;