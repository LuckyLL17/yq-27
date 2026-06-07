import { AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { Pitfall } from '../types';

const severityConfig = {
  high: {
    icon: AlertTriangle,
    bgClass: 'bg-red-500/10',
    borderClass: 'border-red-500/30',
    textClass: 'text-red-400',
    label: '高危',
  },
  medium: {
    icon: AlertCircle,
    bgClass: 'bg-orange-500/10',
    borderClass: 'border-orange-500/30',
    textClass: 'text-orange-400',
    label: '中危',
  },
  low: {
    icon: Info,
    bgClass: 'bg-blue-500/10',
    borderClass: 'border-blue-500/30',
    textClass: 'text-blue-400',
    label: '注意',
  },
};

interface PitfallCardProps {
  pitfall: Pitfall;
  index: number;
}

export default function PitfallCard({ pitfall, index }: PitfallCardProps) {
  const config = severityConfig[pitfall.severity];
  const Icon = config.icon;

  return (
    <div
      className={`relative p-5 ${config.bgClass} border ${config.borderClass} rounded-xl animate-fade-in`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="absolute -top-3 -left-3 w-6 h-6 rounded-full bg-dark-900 flex items-center justify-center">
        <span className={`text-xs font-bold ${config.textClass}`}>
          {index + 1}
        </span>
      </div>
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg ${config.bgClass} ${config.textClass}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-white">
              {pitfall.title}
            </h4>
            <span
              className={`px-2 py-0.5 text-xs font-medium rounded-full ${config.bgClass} ${config.textClass} border ${config.borderClass}`}
            >
              {config.label}
            </span>
          </div>
          <p className="mt-2 text-sm text-dark-300 leading-relaxed">
            {pitfall.description}
          </p>
        </div>
      </div>
    </div>
  );
}
