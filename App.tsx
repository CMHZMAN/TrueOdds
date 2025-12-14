import React, { useState } from 'react';
import { MOCK_MATCHES } from './constants';
import { Match } from './types';
import MatchDetails from './pages/MatchDetails';
import MatchCard from './components/MatchCard';
import { Activity, Menu, Github, TrendingUp } from 'lucide-react';

const App: React.FC = () => {
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);

  const selectedMatch = MOCK_MATCHES.find(m => m.id === selectedMatchId);

  return (
    <div className="min-h-screen font-sans text-slate-200">
      {/* Navbar */}
      <nav className="border-b border-brand-700 bg-brand-900/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setSelectedMatchId(null)}>
            <div className="bg-gradient-to-br from-brand-accent to-emerald-700 p-2 rounded-lg">
              <Activity className="text-white" size={20} />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">True<span className="text-brand-accent">Odds</span>.AI</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
             <a href="#" className="hover:text-white transition-colors">Sportsbook</a>
             <a href="#" className="hover:text-white transition-colors">Live Scores</a>
             <a href="#" className="hover:text-white transition-colors text-brand-accent">Value Bets</a>
          </div>
          <div className="flex items-center gap-4">
             <button className="md:hidden text-slate-400"><Menu /></button>
             <a href="#" className="text-slate-400 hover:text-white"><Github size={20} /></a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {selectedMatch ? (
          <MatchDetails 
            match={selectedMatch} 
            onBack={() => setSelectedMatchId(null)} 
          />
        ) : (
          <div className="animate-fade-in">
            <header className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Upcoming Matches</h1>
              <p className="text-slate-400">Comparing odds from top bookmakers against Gemini AI true probability models.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               <div className="lg:col-span-2">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-white">Featured</h2>
                    <span className="text-xs bg-brand-800 text-brand-accent px-2 py-1 rounded border border-brand-700">Live Updates</span>
                  </div>
                  {MOCK_MATCHES.map(match => (
                    <MatchCard key={match.id} match={match} onClick={setSelectedMatchId} />
                  ))}
               </div>

               {/* Sidebar Widgets */}
               <div className="space-y-6">
                  <div className="bg-gradient-to-b from-brand-800 to-brand-900 rounded-xl p-6 border border-brand-700 shadow-xl">
                     <h3 className="font-bold text-white mb-2">How it works</h3>
                     <ul className="space-y-4 mt-4">
                        <li className="flex gap-3">
                           <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-700 flex items-center justify-center text-xs font-bold">1</span>
                           <p className="text-sm text-slate-400">We aggregate odds from major bookmakers in real-time.</p>
                        </li>
                        <li className="flex gap-3">
                           <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-700 flex items-center justify-center text-xs font-bold">2</span>
                           <p className="text-sm text-slate-400">Gemini AI analyzes team form, injuries, and historical data.</p>
                        </li>
                        <li className="flex gap-3">
                           <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-900 text-emerald-400 flex items-center justify-center text-xs font-bold">3</span>
                           <p className="text-sm text-slate-400">We highlight <span className="text-emerald-400 font-bold">Value Bets</span> where the "True Odds" are better than the market.</p>
                        </li>
                     </ul>
                  </div>

                  <div className="bg-brand-800 rounded-xl p-6 border border-brand-700">
                    <h3 className="font-bold text-white mb-4">Market Movers</h3>
                    <div className="space-y-3">
                       <div className="flex justify-between items-center text-sm">
                          <span className="text-slate-300">Arsenal to Win</span>
                          <span className="text-red-400 flex items-center gap-1 text-xs">1.65 <TrendingDown size={12} className="transform rotate-180" /></span>
                       </div>
                       <div className="flex justify-between items-center text-sm">
                          <span className="text-slate-300">Celtics -5.5</span>
                          <span className="text-green-400 flex items-center gap-1 text-xs">1.90 <TrendingUp size={12} /></span>
                       </div>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

const TrendingDown = ({ size, className }: { size: number, className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline>
    <polyline points="17 18 23 18 23 12"></polyline>
  </svg>
)

export default App;