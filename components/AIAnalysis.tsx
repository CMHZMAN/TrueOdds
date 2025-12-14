import React, { useState } from 'react';
import { Match, GeminiAnalysis } from '../types';
import { analyzeMatchOdds, getQuickInsight } from '../services/geminiService';
import { Sparkles, Brain, AlertTriangle, CheckCircle, Search } from 'lucide-react';

interface AIAnalysisProps {
  match: Match;
  analysis: GeminiAnalysis | null;
  onAnalysisComplete: (data: GeminiAnalysis) => void;
}

const AIAnalysis: React.FC<AIAnalysisProps> = ({ match, analysis, onAnalysisComplete }) => {
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingInsight, setLoadingInsight] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await analyzeMatchOdds(match);
      onAnalysisComplete(result);
    } catch (err) {
      setError("Failed to analyze match. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLiveInsight = async () => {
    setLoadingInsight(true);
    try {
      const result = await getQuickInsight(match);
      setInsight(result);
    } catch (err) {
      setInsight("Unable to fetch live insights.");
    } finally {
      setLoadingInsight(false);
    }
  }

  if (loading) {
    return (
      <div className="bg-brand-800 rounded-xl p-8 text-center animate-pulse border border-brand-700">
        <Sparkles className="mx-auto text-brand-accent mb-4 animate-spin" size={32} />
        <h3 className="text-xl font-bold text-white mb-2">Gemini is analyzing stats...</h3>
        <p className="text-slate-400">Calculating True Odds based on form, history, and metrics.</p>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="bg-brand-800 rounded-xl p-8 text-center border border-brand-700 bg-gradient-to-b from-brand-800 to-brand-900 shadow-xl">
        <Brain className="mx-auto text-purple-400 mb-4" size={48} />
        <h3 className="text-2xl font-bold text-white mb-2">Unlock True Odds</h3>
        <p className="text-slate-400 mb-6 max-w-md mx-auto">
          Use Gemini AI to compare real stats against bookmaker odds and find value bets hidden in the market.
        </p>
        <button 
          onClick={handleAnalyze}
          className="bg-brand-accent hover:bg-emerald-400 text-brand-900 font-bold py-3 px-8 rounded-full transition-all transform hover:scale-105 shadow-lg shadow-emerald-900/50 flex items-center gap-2 mx-auto"
        >
          <Sparkles size={20} /> Run AI Prediction Model
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Analysis Card */}
      <div className="bg-brand-800 rounded-xl overflow-hidden border border-brand-700 shadow-xl">
        <div className="bg-purple-900/20 p-4 border-b border-brand-700 flex justify-between items-center">
          <div className="flex items-center gap-2">
             <Brain className="text-purple-400" />
             <h3 className="font-bold text-white">Gemini Intelligence Report</h3>
          </div>
          <div className="text-xs font-mono text-slate-400">Model: gemini-2.5-flash</div>
        </div>
        
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left: Odds Comparison */}
          <div>
            <h4 className="text-sm uppercase tracking-wide text-slate-400 font-bold mb-4">True Probability vs Market</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-brand-900/50 p-3 rounded-lg border border-brand-700">
                <span>Home Win ({match.homeTeam.name})</span>
                <div className="text-right">
                  <div className="text-xl font-mono font-bold text-white">{analysis.trueOdds.homeWin.toFixed(2)}</div>
                  <div className="text-[10px] text-slate-500">True Odds</div>
                </div>
              </div>
              {analysis.trueOdds.draw && (
                <div className="flex justify-between items-center bg-brand-900/50 p-3 rounded-lg border border-brand-700">
                  <span>Draw</span>
                  <div className="text-right">
                    <div className="text-xl font-mono font-bold text-white">{analysis.trueOdds.draw.toFixed(2)}</div>
                    <div className="text-[10px] text-slate-500">True Odds</div>
                  </div>
                </div>
              )}
              <div className="flex justify-between items-center bg-brand-900/50 p-3 rounded-lg border border-brand-700">
                <span>Away Win ({match.awayTeam.name})</span>
                <div className="text-right">
                  <div className="text-xl font-mono font-bold text-white">{analysis.trueOdds.awayWin.toFixed(2)}</div>
                  <div className="text-[10px] text-slate-500">True Odds</div>
                </div>
              </div>
            </div>

            <div className={`mt-6 p-4 rounded-lg border ${analysis.valueBetDetected ? 'bg-emerald-900/20 border-emerald-500/50' : 'bg-yellow-900/20 border-yellow-500/50'}`}>
              <div className="flex items-start gap-3">
                {analysis.valueBetDetected ? <CheckCircle className="text-emerald-500 shrink-0" /> : <AlertTriangle className="text-yellow-500 shrink-0" />}
                <div>
                  <h5 className={`font-bold ${analysis.valueBetDetected ? 'text-emerald-400' : 'text-yellow-400'}`}>
                    {analysis.valueBetDetected ? 'Value Bet Detected' : 'No Clear Value'}
                  </h5>
                  <p className="text-sm text-slate-300 mt-1">{analysis.recommendedBet}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Reasoning */}
          <div>
            <h4 className="text-sm uppercase tracking-wide text-slate-400 font-bold mb-4">AI Reasoning</h4>
            <p className="text-slate-300 text-sm leading-relaxed mb-4">
              {analysis.reasoning}
            </p>
            
            <h5 className="text-xs font-bold text-slate-500 mb-2">KEY FACTORS</h5>
            <ul className="space-y-2">
              {analysis.keyFactors.map((factor, idx) => (
                <li key={idx} className="text-sm flex items-start gap-2 text-slate-300">
                  <span className="block w-1 h-1 rounded-full bg-brand-accent mt-2"></span>
                  {factor}
                </li>
              ))}
            </ul>

            <div className="mt-6">
               <div className="flex justify-between items-center text-xs text-slate-500 mb-1">
                 <span>Confidence Score</span>
                 <span>{analysis.confidenceScore}%</span>
               </div>
               <div className="h-2 bg-brand-900 rounded-full overflow-hidden">
                 <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-1000" 
                    style={{ width: `${analysis.confidenceScore}%` }}
                 ></div>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Context Section */}
      <div className="bg-brand-800 rounded-xl p-6 border border-brand-700">
         <div className="flex justify-between items-start mb-4">
            <h4 className="font-bold flex items-center gap-2 text-white">
              <Search size={18} className="text-blue-400" /> Live Context Check
            </h4>
            {!insight && !loadingInsight && (
              <button onClick={handleLiveInsight} className="text-xs bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded text-white transition-colors">
                Check News
              </button>
            )}
         </div>
         
         {loadingInsight && (
           <div className="flex items-center gap-3 text-slate-400 text-sm">
             <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
             Checking live web sources...
           </div>
         )}
         
         {insight && (
           <div className="bg-blue-900/10 border border-blue-500/20 p-4 rounded-lg text-sm text-slate-300">
             {insight}
             <div className="mt-2 text-[10px] text-slate-500 text-right">Source: Google Search Grounding</div>
           </div>
         )}
         {!insight && !loadingInsight && (
           <p className="text-sm text-slate-500">Check for last-minute injuries or team news that might affect the odds.</p>
         )}
      </div>
    </div>
  );
};

export default AIAnalysis;