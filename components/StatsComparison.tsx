import React from 'react';
import { Team } from '../types';
import { BarChart3 } from 'lucide-react';

interface StatsComparisonProps {
  homeTeam: Team;
  awayTeam: Team;
}

const StatRow = ({ label, homeValue, awayValue, formatValue }: { 
  label: string, 
  homeValue: number, 
  awayValue: number,
  formatValue?: (v: number) => string 
}) => {
  const total = homeValue + awayValue;
  // If total is 0, split 50/50
  const homeWidth = total > 0 ? (homeValue / total) * 100 : 50;
  
  return (
    <div className="group">
      <div className="flex justify-between items-end text-sm mb-2">
        <span className="font-bold text-lg text-brand-accent tabular-nums">{formatValue ? formatValue(homeValue) : homeValue}</span>
        <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">{label}</span>
        <span className="font-bold text-lg text-blue-400 tabular-nums">{formatValue ? formatValue(awayValue) : awayValue}</span>
      </div>
      <div className="flex h-3 rounded-full overflow-hidden bg-brand-900 ring-1 ring-brand-700/50 relative">
        <div 
            style={{ width: `${homeWidth}%` }} 
            className="bg-brand-accent h-full relative group-hover:bg-emerald-400 transition-all duration-700 ease-out"
        >
             <div className="absolute top-0 right-0 bottom-0 w-[1px] bg-white/20"></div>
        </div>
        <div 
            style={{ width: `${100 - homeWidth}%` }} 
            className="bg-blue-500 h-full relative group-hover:bg-blue-400 transition-all duration-700 ease-out"
        >
        </div>
        
        {/* Center Marker */}
        <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-brand-900/50 z-10 transform -translate-x-1/2"></div>
      </div>
    </div>
  );
};

const FormPills = ({ form }: { form: ('W'|'D'|'L')[] }) => (
    <div className="flex gap-1.5">
        {form.map((result, i) => (
            <div 
                key={i}
                className={`
                    w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ring-1 ring-inset ring-white/10 shadow-sm
                    ${result === 'W' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 
                      result === 'D' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' : 
                      'bg-red-500/20 text-red-400 border border-red-500/30'}
                `}
            >
                {result}
            </div>
        ))}
    </div>
)

const StatsComparison: React.FC<StatsComparisonProps> = ({ homeTeam, awayTeam }) => {
  // Calculate win rates
  const getWinRate = (team: Team) => {
      const total = team.stats.wins + team.stats.losses + (team.stats.draws || 0);
      return total === 0 ? 0 : Math.round((team.stats.wins / total) * 100);
  };

  return (
    <div className="bg-brand-800 rounded-xl border border-brand-700 p-6 shadow-xl">
        <div className="flex items-center gap-2 mb-6 border-b border-brand-700 pb-4">
            <BarChart3 className="text-brand-accent" size={20} />
            <h3 className="font-bold text-white">Team Stats Comparison</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
             {/* Home Form */}
             <div className="flex flex-col items-center">
                 <div className="text-sm text-slate-400 mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-brand-accent"></span>
                    <span className="font-semibold text-white">{homeTeam.name}</span>
                 </div>
                 <FormPills form={homeTeam.recentForm} />
             </div>
             {/* Away Form */}
             <div className="flex flex-col items-center">
                 <div className="text-sm text-slate-400 mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    <span className="font-semibold text-white">{awayTeam.name}</span>
                 </div>
                 <FormPills form={awayTeam.recentForm} />
             </div>
        </div>

        <div className="space-y-6 px-2 md:px-6">
            <StatRow 
                label="Avg Goals Scored" 
                homeValue={homeTeam.stats.goalsScored || 0} 
                awayValue={awayTeam.stats.goalsScored || 0} 
            />
            
            <StatRow 
                label="Avg Goals Conceded" 
                homeValue={homeTeam.stats.goalsConceded || 0} 
                awayValue={awayTeam.stats.goalsConceded || 0} 
            />

            {(homeTeam.stats.possession || awayTeam.stats.possession) && (
                 <StatRow 
                    label="Possession %" 
                    homeValue={homeTeam.stats.possession || 50} 
                    awayValue={awayTeam.stats.possession || 50}
                    formatValue={(v) => `${v}%`}
                />
            )}
             
             <StatRow 
                label="Season Win Rate" 
                homeValue={getWinRate(homeTeam)} 
                awayValue={getWinRate(awayTeam)}
                formatValue={(v) => `${v}%`}
            />
        </div>
    </div>
  );
};

export default StatsComparison;