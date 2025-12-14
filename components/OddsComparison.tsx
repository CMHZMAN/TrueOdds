import React, { useState } from 'react';
import { Match, Odds } from '../types';
import { TrendingUp, TrendingDown, Clock } from 'lucide-react';

interface OddsComparisonProps {
  match: Match;
}

const BookmakerLogo = ({ provider }: { provider: string }) => {
  const [error, setError] = useState(false);

  // Map provider names to domains for Clearbit Logo API
  // In a production app, these assets should be hosted locally
  const domainMap: Record<string, string> = {
    'Bet365': 'bet365.com',
    'William Hill': 'williamhill.com',
    'DraftKings': 'draftkings.com',
    'Pinnacle': 'pinnacle.com',
    'FanDuel': 'fanduel.com',
    'MGM': 'betmgm.com',
    'Unibet': 'unibet.com',
    'Betway': 'betway.com',
    '888sport': '888sport.com'
  };

  const domain = domainMap[provider];
  // Request a slightly larger size for better quality on retina displays, downscaled via CSS
  const logoUrl = domain ? `https://logo.clearbit.com/${domain}?size=64` : null;

  if (error || !logoUrl) {
    // Fallback UI if logo not found or failed to load
    return (
      <div className="flex items-center gap-3">
         <div className="w-8 h-8 rounded bg-brand-700 flex items-center justify-center text-xs font-bold text-slate-400 border border-brand-600 ring-1 ring-brand-700/50">
             {provider.substring(0, 1).toUpperCase()}
         </div>
         <span className="font-bold text-slate-300 text-sm">{provider}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
       {/* White background container ensures dark logos are visible */}
       <div className="w-8 h-8 rounded bg-white p-1 flex items-center justify-center overflow-hidden shrink-0 shadow-sm ring-2 ring-brand-700/50">
         <img 
           src={logoUrl} 
           alt={provider} 
           className="max-w-full max-h-full object-contain"
           onError={() => setError(true)}
           loading="lazy"
         />
       </div>
       <span className="font-bold text-slate-200 text-sm">{provider}</span>
    </div>
  );
};

const OddsComparison: React.FC<OddsComparisonProps> = ({ match }) => {
  // Find best odds to highlight them
  const bestHome = Math.max(...match.bookmakerOdds.map(o => o.homeWin));
  const bestDraw = match.bookmakerOdds[0].draw ? Math.max(...match.bookmakerOdds.map(o => o.draw || 0)) : 0;
  const bestAway = Math.max(...match.bookmakerOdds.map(o => o.awayWin));

  // Determine the most recent update time from the list
  const getMostRecentUpdate = () => {
    if (!match.bookmakerOdds.length) return 'N/A';
    
    // Sort logic for strings like "2 mins ago", "1 hour ago"
    // We parse the string to approximate minutes for comparison
    const sorted = [...match.bookmakerOdds].sort((a, b) => {
        const getMinutes = (s: string) => {
            if (s.includes('sec')) return 0; // Recent
            const val = parseInt(s);
            if (isNaN(val)) return 999;
            if (s.includes('hour')) return val * 60;
            if (s.includes('day')) return val * 1440;
            return val; // default assume mins
        };
        return getMinutes(a.updatedAt) - getMinutes(b.updatedAt);
    });
    
    return sorted[0].updatedAt;
  };

  const lastUpdated = getMostRecentUpdate();

  return (
    <div className="bg-brand-800 rounded-xl overflow-hidden border border-brand-700">
      <div className="p-4 border-b border-brand-700 bg-brand-900/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="font-bold text-white flex items-center gap-2">
          <TrendingUp className="text-brand-accent" size={20} />
          Bookmaker Comparison
        </h3>
        
        <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-brand-800 px-3 py-1.5 rounded-full border border-brand-700/50 shadow-sm">
            <Clock size={12} className="text-brand-accent" />
            <span>Last check: <span className="text-slate-200 font-medium">{lastUpdated}</span></span>
        </div>
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
                <td className="p-4">
                  <BookmakerLogo provider={odds.provider} />
                </td>
                
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