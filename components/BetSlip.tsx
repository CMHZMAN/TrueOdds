import React, { useState } from 'react';
import { Match, GeminiAnalysis } from '../types';
import { Calculator, DollarSign, Wallet, ArrowRight, Zap } from 'lucide-react';

interface BetSlipProps {
  match: Match;
  analysis: GeminiAnalysis | null;
}

const BetSlip: React.FC<BetSlipProps> = ({ match, analysis }) => {
  const [stake, setStake] = useState<string>('100');
  const [selectedOutcome, setSelectedOutcome] = useState<'home' | 'draw' | 'away' | null>(null);
  const [useTrueOdds, setUseTrueOdds] = useState(false);
  const [betPlaced, setBetPlaced] = useState(false);

  // Get Market Best Odds
  const marketOdds = {
    home: Math.max(...match.bookmakerOdds.map(o => o.homeWin)),
    draw: match.sport === 'Soccer' ? Math.max(...match.bookmakerOdds.map(o => o.draw || 0)) : 0,
    away: Math.max(...match.bookmakerOdds.map(o => o.awayWin))
  };

  // Get AI Odds (if available)
  const aiOdds = analysis ? {
    home: analysis.trueOdds.homeWin,
    draw: analysis.trueOdds.draw || 0,
    away: analysis.trueOdds.awayWin
  } : null;

  const currentOdds = useTrueOdds && aiOdds ? aiOdds : marketOdds;
  const isAiActive = useTrueOdds && aiOdds;

  const getOddsValue = (type: 'home' | 'draw' | 'away') => currentOdds[type];

  const numericStake = parseFloat(stake) || 0;
  const selectedOddsValue = selectedOutcome ? getOddsValue(selectedOutcome) : 0;
  const potentialReturn = numericStake * selectedOddsValue;
  const potentialProfit = potentialReturn - numericStake;

  const handlePlaceBet = () => {
    if (!selectedOutcome || numericStake <= 0) return;
    setBetPlaced(true);
    setTimeout(() => setBetPlaced(false), 3000);
  };

  return (
    <div className="bg-brand-800 rounded-xl border border-brand-700 overflow-hidden shadow-xl">
      <div className="p-4 bg-brand-900/50 border-b border-brand-700 flex justify-between items-center">
        <h3 className="font-bold text-white flex items-center gap-2">
          <Wallet className="text-brand-accent" size={20} />
          Bet Slip Simulator
        </h3>
        {aiOdds && (
          <div className="flex items-center gap-2 bg-brand-900 p-1 rounded-lg border border-brand-700">
             <button 
               onClick={() => setUseTrueOdds(false)}
               className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${!useTrueOdds ? 'bg-brand-700 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
             >
               Market
             </button>
             <button 
               onClick={() => setUseTrueOdds(true)}
               className={`px-3 py-1 text-xs font-bold rounded-md transition-all flex items-center gap-1 ${useTrueOdds ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
             >
               <Zap size={10} /> AI True Odds
             </button>
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="mb-6">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Select Outcome</label>
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => setSelectedOutcome('home')}
              className={`p-3 rounded-lg border transition-all relative overflow-hidden group ${
                selectedOutcome === 'home' 
                  ? 'bg-brand-accent/20 border-brand-accent text-white' 
                  : 'bg-brand-900/50 border-brand-700 text-slate-300 hover:border-slate-500'
              }`}
            >
              <div className="text-xs font-bold mb-1 truncate">{match.homeTeam.name}</div>
              <div className={`text-lg font-mono font-bold ${selectedOutcome === 'home' ? 'text-brand-accent' : 'text-white'}`}>
                {currentOdds.home.toFixed(2)}
              </div>
              {isAiActive && marketOdds.home < currentOdds.home && (
                 <div className="absolute top-0 right-0 w-2 h-2 bg-emerald-500 rounded-bl-full"></div>
              )}
            </button>

            {match.sport === 'Soccer' && (
              <button
                onClick={() => setSelectedOutcome('draw')}
                className={`p-3 rounded-lg border transition-all ${
                  selectedOutcome === 'draw' 
                    ? 'bg-brand-accent/20 border-brand-accent text-white' 
                    : 'bg-brand-900/50 border-brand-700 text-slate-300 hover:border-slate-500'
                }`}
              >
                <div className="text-xs font-bold mb-1">Draw</div>
                <div className={`text-lg font-mono font-bold ${selectedOutcome === 'draw' ? 'text-brand-accent' : 'text-white'}`}>
                  {currentOdds.draw.toFixed(2)}
                </div>
              </button>
            )}

            <button
              onClick={() => setSelectedOutcome('away')}
              className={`p-3 rounded-lg border transition-all relative overflow-hidden ${
                selectedOutcome === 'away' 
                  ? 'bg-brand-accent/20 border-brand-accent text-white' 
                  : 'bg-brand-900/50 border-brand-700 text-slate-300 hover:border-slate-500'
              }`}
            >
              <div className="text-xs font-bold mb-1 truncate">{match.awayTeam.name}</div>
              <div className={`text-lg font-mono font-bold ${selectedOutcome === 'away' ? 'text-brand-accent' : 'text-white'}`}>
                {currentOdds.away.toFixed(2)}
              </div>
               {isAiActive && marketOdds.away < currentOdds.away && (
                 <div className="absolute top-0 right-0 w-2 h-2 bg-emerald-500 rounded-bl-full"></div>
              )}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block flex items-center gap-1">
              <DollarSign size={12} /> Stake
            </label>
            <div className="relative">
               <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
               <input 
                type="number" 
                value={stake}
                onChange={(e) => setStake(e.target.value)}
                className="w-full bg-brand-900 border border-brand-700 rounded-lg py-2 pl-7 pr-3 text-white focus:outline-none focus:border-brand-accent font-mono"
               />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block flex items-center gap-1">
              <Calculator size={12} /> Potential Return
            </label>
            <div className={`text-xl font-mono font-bold flex items-center h-[42px] ${selectedOutcome ? 'text-emerald-400' : 'text-slate-600'}`}>
              ${selectedOutcome ? potentialReturn.toFixed(2) : '0.00'}
            </div>
            {selectedOutcome && (
                <div className="text-[10px] text-emerald-500/70 font-mono">
                    +${potentialProfit.toFixed(2)} Profit
                </div>
            )}
          </div>
        </div>

        <button 
          onClick={handlePlaceBet}
          disabled={!selectedOutcome || betPlaced}
          className={`w-full py-3 rounded-lg font-bold text-brand-900 flex items-center justify-center gap-2 transition-all transform active:scale-95 ${
            !selectedOutcome 
              ? 'bg-slate-700 text-slate-500 cursor-not-allowed' 
              : betPlaced 
                ? 'bg-emerald-500 text-brand-900'
                : 'bg-brand-accent hover:bg-emerald-400 shadow-lg shadow-emerald-900/20'
          }`}
        >
          {betPlaced ? 'Bet Placed!' : 'Place Bet (Simulation)'}
          {!betPlaced && <ArrowRight size={18} />}
        </button>
        
        {isAiActive && selectedOutcome && (
            <div className="mt-3 text-[10px] text-center text-purple-400">
                Using AI True Odds. If True Odds &gt; Market Odds, this is a Value Bet.
            </div>
        )}
      </div>
    </div>
  );
};

export default BetSlip;