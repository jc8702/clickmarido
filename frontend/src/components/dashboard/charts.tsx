"use client";

import * as React from 'react';
import { Card } from '@/components/ui/card';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface ChartData {
  name: string;
  [key: string]: any;
}

interface CommonChartProps {
  data: ChartData[];
  title: string;
  dataKey: string;
  color?: string;
  className?: string;
}

export const DashboardLineChart = React.memo(function DashboardLineChart({ data, title, dataKey, color = '#8b5cf6', className }: CommonChartProps) {
  return (
    <Card className={`p-6 ${className || ''}`}>
      <h3 className="text-lg font-semibold mb-4 text-foreground">{title}</h3>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}`} />
            <Tooltip
              contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '8px' }}
              itemStyle={{ color: 'var(--foreground)' }}
            />
            <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
});

export const DashboardBarChart = React.memo(function DashboardBarChart({ data, title, dataKey, color = '#3b82f6', className }: CommonChartProps) {
  return (
    <Card className={`p-6 ${className || ''}`}>
      <h3 className="text-lg font-semibold mb-4 text-foreground">{title}</h3>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '8px' }}
              cursor={{ fill: 'var(--muted)' }}
            />
            <Bar dataKey={dataKey} fill={color} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
});
