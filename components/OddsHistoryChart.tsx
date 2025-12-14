import React, { useState, useMemo } from 'react';
import { OddsHistoryPoint } from '../types';
import { TrendingUp } from 'lucide-react';

interface OddsHistoryChartProps {
  data: OddsHistoryPoint[];
  homeName: string;
  awayName: string;
  showDraw?: boolean;
}

const OddsHistoryChart: React.FC<OddsHistoryChartProps> = ({ data, homeName, awayName, showDraw }) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  // Dimensions
  const height = 300;
  const width = 600; // Aspect ratio unit
  const padding = { top: 20, right: 20, bottom: 40, left: 40 };
  const graphWidth = width - padding.left - padding.right;
  const graphHeight = height - padding.top - padding.bottom;

  // Calculate scales
  const allValues = data.flatMap(d => [d.homeWin, d.awayWin, ...(showDraw && d.draw ? [d.draw] : [])]);
  const minVal = Math.min(...allValues) * 0.95;
  const maxVal = Math.max(...allValues) * 1.05;
  const range = maxVal - minVal;

  const getX = (index: number) => (index / (data.length - 1)) * graphWidth + padding.left;
  const getY = (value: number) => graphHeight - ((value - minVal) / range) * graphHeight + padding.top;

  // Generate paths
  const createPath = (key: keyof Pick<OddsHistoryPoint, 'homeWin' | 'awayWin' | 'draw'>) => {
    return data.map((point, i) => {
      const val = point[key];
      if (val === undefined) return '';
      return `${i === 0 ? 'M' : 'L'} ${getX(i)},${getY(val)}`;
    }).join(' ');
  };

  const homePath = createPath('homeWin');
  const awayPath = createPath('awayWin');
  const drawPath = showDraw ? createPath('draw') : '';

  const activeData = hoverIndex !== null ? data[hoverIndex] : null;

  return (
    <div className="bg-brand-800 rounded-xl overflow-hidden border border-brand-700 shadow-xl">
      <div className="p-4 border-b border-brand-700 bg-brand-900/50 flex justify-between items-center">
        <h3 className="font-bold text-white flex items-center gap-2">
          <TrendingUp className="text-blue-400" size={20} />
          Odds History (24h)
        </h3>
        <div className="flex gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-brand-accent"></div> {homeName}
          </div>
          {showDraw && (
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-slate-400"></div> Draw
            </div>
          )}
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div> {awayName}
          </div>
        </div>
      </div>

      <div className="relative p-4" onMouseLeave={() => setHoverIndex(null)}>
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
          {/* Grid Lines (Horizontal) */}
          {[0, 0.25, 0.5, 0.75, 1].map((tick, i) => {
            const y = graphHeight - (tick * graphHeight) + padding.top;
            const val = minVal + (tick * range);
            return (
              <g key={i}>
                <line x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke="#334155" strokeDasharray="4" strokeWidth="1" />
                <text x={padding.left - 5} y={y + 4} textAnchor="end" className="text-[10px] fill-slate-500 font-mono">
                  {val.toFixed(2)}
                </text>
              </g>
            );
          })}

          {/* Lines */}
          {showDraw && <path d={drawPath} fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />}
          <path d={awayPath} fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d={homePath} fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

          {/* Hover Overlay */}
          {data.map((_, i) => (
             <rect 
               key={i}
               x={getX(i) - (graphWidth / data.length / 2)} 
               y={padding.top} 
               width={graphWidth / data.length} 
               height={graphHeight} 
               fill="transparent" 
               onMouseEnter={() => setHoverIndex(i)}
             />
          ))}

          {/* Active Hover State */}
          {activeData && hoverIndex !== null && (
            <g>
              <line 
                x1={getX(hoverIndex)} 
                y1={padding.top} 
                x2={getX(hoverIndex)} 
                y2={height - padding.bottom} 
                stroke="#f8fafc" 
                strokeWidth="1" 
                strokeDasharray="4"
                className="opacity-50"
              />
              <circle cx={getX(hoverIndex)} cy={getY(activeData.homeWin)} r="4" fill="#10b981" stroke="#0f172a" strokeWidth="2" />
              <circle cx={getX(hoverIndex)} cy={getY(activeData.awayWin)} r="4" fill="#3b82f6" stroke="#0f172a" strokeWidth="2" />
              {showDraw && activeData.draw && (
                 <circle cx={getX(hoverIndex)} cy={getY(activeData.draw)} r="4" fill="#94a3b8" stroke="#0f172a" strokeWidth="2" />
              )}
            </g>
          )}

           {/* X Axis Labels */}
           {data.filter((_, i) => i % 4 === 0).map((d, i) => {
             const index = data.indexOf(d);
             return (
               <text key={i} x={getX(index)} y={height - 10} textAnchor="middle" className="text-[10px] fill-slate-500">
                 {d.timestamp}
               </text>
             );
           })}
        </svg>

        {/* Floating Tooltip */}
        {activeData && (
          <div className="absolute top-6 right-6 bg-brand-900/90 backdrop-blur border border-brand-700 p-3 rounded-lg shadow-xl pointer-events-none z-10">
            <div className="text-xs text-slate-400 mb-1 border-b border-brand-700 pb-1">{activeData.timestamp}</div>
            <div className="space-y-1">
              <div className="flex justify-between gap-4 text-xs">
                <span className="text-brand-accent">{homeName}</span>
                <span className="font-mono font-bold text-white">{activeData.homeWin.toFixed(2)}</span>
              </div>
              {showDraw && (
                 <div className="flex justify-between gap-4 text-xs">
                  <span className="text-slate-400">Draw</span>
                  <span className="font-mono font-bold text-white">{activeData.draw?.toFixed(2)}</span>
                </div>
              )}
               <div className="flex justify-between gap-4 text-xs">
                <span className="text-blue-400">{awayName}</span>
                <span className="font-mono font-bold text-white">{activeData.awayWin.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OddsHistoryChart;