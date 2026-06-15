"use client";

import * as React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';

const COLORS = ['#10b981', '#f59e0b', '#3b82f6', '#8b5cf6', '#ec4899'];

export const CommercialChart = React.memo(function CommercialChart({ data }: { data: any[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis fontSize={12} tickLine={false} axisLine={false} />
        <RechartsTooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px' }} />
        <Bar dataKey="value" fill="var(--primary)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
});

export const OperationalChart = React.memo(function OperationalChart({ data }: { data: any[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          paddingAngle={5}
          dataKey="concluídas"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <RechartsTooltip contentStyle={{ borderRadius: '8px' }} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
});

export const FinancialChart = React.memo(function FinancialChart({ data }: { data: any[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorReceita" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
          </linearGradient>
          <linearGradient id="colorDespesa" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis fontSize={12} tickLine={false} axisLine={false} />
        <RechartsTooltip contentStyle={{ borderRadius: '8px' }} />
        <Legend />
        <Area type="monotone" dataKey="receita" name="Receitas" stroke="var(--primary)" fillOpacity={1} fill="url(#colorReceita)" />
        <Area type="monotone" dataKey="despesa" name="Despesas" stroke="#ef4444" fillOpacity={1} fill="url(#colorDespesa)" />
      </AreaChart>
    </ResponsiveContainer>
  );
});
