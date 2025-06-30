import { TrendingUp, Users, DollarSign } from 'lucide-react';

const stats = [
  { 
    id: 1, 
    name: 'Businesses trust Fintracker', 
    value: '50,000+',
    icon: Users,
    description: 'From startups to enterprises'
  },
  { 
    id: 2, 
    name: 'In transactions processed', 
    value: '$2.5B+',
    icon: DollarSign,
    description: 'Secure and reliable processing'
  },
  { 
    id: 3, 
    name: 'Average ROI improvement', 
    value: '35%',
    icon: TrendingUp,
    description: 'Better financial decisions'
  }
];

export function StatsSection() {
  return (
    <div className="bg-background py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-none">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Trusted by businesses worldwide
            </h2>
            <p className="mt-4 text-lg leading-8 text-muted-foreground">
              Join thousands of companies that have transformed their financial management with Fintracker.
            </p>
          </div>
          <dl className="mt-16 grid grid-cols-1 gap-0.5 overflow-hidden rounded-2xl text-center sm:grid-cols-2 lg:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.id} className="flex flex-col bg-muted/50 p-8 group hover:bg-muted/70 transition-colors">
                <div className="flex items-center justify-center mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 group-hover:bg-primary/20 transition-colors">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <dt className="text-sm font-semibold leading-6 text-muted-foreground">
                  {stat.name}
                </dt>
                <dd className="order-first text-3xl font-bold tracking-tight text-foreground">
                  {stat.value}
                </dd>
                <dd className="text-xs text-muted-foreground mt-2">
                  {stat.description}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}