"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Client A', value: 8500 },
  { name: 'Client B', value: 12000 },
  { name: 'Client C', value: 5500 },
  { name: 'Client D', value: 7800 },
  { name: 'Client E', value: 4200 },
];

export function IncomeBySource() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
          barSize={20}
        >
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis dataKey="name" scale="point" padding={{ left: 10, right: 10 }} />
          <YAxis 
            tickFormatter={(value) => `$${value.toLocaleString()}`} 
            tick={{ fontSize: 12 }} 
            className="text-muted-foreground" 
          />
          <Tooltip 
            formatter={(value) => [`$${value.toLocaleString()}`, 'Income']}
            contentStyle={{ 
              backgroundColor: 'var(--card)', 
              borderColor: 'var(--border)',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
            }}
          />
          <Bar 
            dataKey="value" 
            fill="hsl(var(--chart-1))" 
            radius={[4, 4, 0, 0]} 
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}