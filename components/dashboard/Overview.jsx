"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const data = [
  { name: 'Jan', income: 4000, expenses: 2400, net: 1600 },
  { name: 'Feb', income: 3500, expenses: 1398, net: 2102 },
  { name: 'Mar', income: 5000, expenses: 3800, net: 1200 },
  { name: 'Apr', income: 2780, expenses: 3908, net: -1128 },
  { name: 'May', income: 5890, expenses: 4800, net: 1090 },
  { name: 'Jun', income: 4390, expenses: 3800, net: 590 },
  { name: 'Jul', income: 8490, expenses: 4300, net: 4190 },
  { name: 'Aug', income: 9000, expenses: 5500, net: 3500 },
  { name: 'Sep', income: 11000, expenses: 6000, net: 5000 },
  { name: 'Oct', income: 9500, expenses: 5800, net: 3700 },
  { name: 'Nov', income: 10000, expenses: 6500, net: 3500 },
  { name: 'Dec', income: 12000, expenses: 7800, net: 4200 },
];

export function Overview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <AreaChart
        data={data}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis dataKey="name" tick={{ fontSize: 12 }} className="text-muted-foreground" />
        <YAxis 
          tickFormatter={(value) => `$${value.toLocaleString()}`} 
          tick={{ fontSize: 12 }} 
          className="text-muted-foreground" 
        />
        <Tooltip 
          formatter={(value) => [`$${value.toLocaleString()}`, undefined]}
          contentStyle={{ 
            backgroundColor: 'var(--card)', 
            borderColor: 'var(--border)',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
          }} 
        />
        <Legend />
        <Area 
          type="monotone" 
          dataKey="income" 
          stackId="1" 
          stroke="hsl(var(--chart-1))" 
          fill="hsl(var(--chart-1))" 
          name="Income"
          fillOpacity={0.3}
        />
        <Area 
          type="monotone" 
          dataKey="expenses" 
          stackId="2" 
          stroke="hsl(var(--chart-2))" 
          fill="hsl(var(--chart-2))" 
          name="Expenses"
          fillOpacity={0.3}
        />
        <Area 
          type="monotone" 
          dataKey="net" 
          stackId="3" 
          stroke="hsl(var(--chart-3))" 
          fill="hsl(var(--chart-3))" 
          name="Net"
          fillOpacity={0.3}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}