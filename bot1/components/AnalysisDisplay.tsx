
import React from 'react';
import type { AnalysisResult } from '../types';
import { ActionType } from '../types';

interface AnalysisDisplayProps {
  result: AnalysisResult;
}

const actionStyles: Record<ActionType, { text: string; bg: string; border: string }> = {
  [ActionType.LONG]: { text: 'text-green-300', bg: 'bg-green-900/50', border: 'border-green-500' },
  [ActionType.SHORT]: { text: 'text-red-300', bg: 'bg-red-900/50', border: 'border-red-500' },
  [ActionType.NO_TRADE]: { text: 'text-gray-300', bg: 'bg-gray-700/50', border: 'border-gray-500' },
};

const MetricCard: React.FC<{ title: string; value: React.ReactNode; className?: string }> = ({ title, value, className }) => (
    <div className={`bg-gray-900/70 p-3 rounded-lg ${className}`}>
        <p className="text-xs text-gray-400 uppercase tracking-wider">{title}</p>
        <p className="text-md font-semibold text-white">{value}</p>
    </div>
);

export const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ result }) => {
  const { action, entry, stop_loss, take_profits, confidence, accuracy_estimate, timeframe, indicators, orderbook_bias, reasons, note } = result;
  const styles = actionStyles[action];

  return (
    <div className="space-y-6 animate-fade-in">
        <div className={`p-4 rounded-lg flex items-center justify-between border ${styles.bg} ${styles.border}`}>
            <h3 className="text-2xl font-bold">Action: <span className={styles.text}>{action}</span></h3>
            <div className='text-right'>
                <p className='text-sm text-gray-400'>Confidence</p>
                <p className={`text-2xl font-bold ${styles.text}`}>{confidence}%</p>
            </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <MetricCard title="Entry" value={entry} />
            <MetricCard title="Stop Loss" value={stop_loss} />
            <MetricCard title="Timeframe" value={timeframe} />
            <MetricCard title="Accuracy Est." value={accuracy_estimate} />
        </div>
        
        <MetricCard title="Take Profits" value={take_profits.join(' / ')} className="w-full" />

        <div>
            <h4 className="font-semibold text-lg mb-2 text-cyan-300">Indicators</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
                {Object.entries(indicators).map(([key, value]) => value && (
                    <div key={key} className="bg-gray-700/50 p-2 rounded-md">
                        <span className="font-medium text-gray-400">{key.toUpperCase()}: </span>
                        <span className="text-gray-200">{value}</span>
                    </div>
                ))}
            </div>
        </div>
        
        <div>
            <h4 className="font-semibold text-lg mb-2 text-cyan-300">Key Reasons</h4>
            <ul className="space-y-2">
                {reasons.map((reason, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                        <span className={`flex-shrink-0 mt-1 w-2 h-2 rounded-full ${styles.text.replace('text-', 'bg-')}`}></span>
                        <span className="text-gray-300">{reason}</span>
                    </li>
                ))}
            </ul>
        </div>
        
        <p className="text-xs text-center text-gray-500 pt-4 border-t border-gray-700">{note}</p>
    </div>
  );
};
