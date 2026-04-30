import React from 'react';
import { cn } from '../lib/utils';

interface StatsCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  unit: string;
  iconBgColor: string;
  iconColor: string;
}

export default function StatsCard({ 
  icon: Icon, 
  label, 
  value, 
  unit, 
  iconBgColor, 
  iconColor 
}: StatsCardProps) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-4">
      <div className="flex items-start gap-4">
        <div className={cn("p-4 rounded-xl", iconBgColor)}>
          <Icon className={cn("w-6 h-6", iconColor)} />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-slate-500">{label}</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-3xl font-bold text-slate-800 tracking-tight">{value}</span>
          </div>
          <span className="text-xs text-slate-400 font-medium">{unit}</span>
        </div>
      </div>
    </div>
  );
}
