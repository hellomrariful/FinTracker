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
  },
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
          <dl className="mt-16 grid grid-cols-1 gap-8 overflow-hidden text-center sm:grid-cols-2 lg:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.id} className="flex flex-col bg-muted/50 p-12 rounded-2xl group hover:bg-muted/70 transition-all duration-300 hover:shadow-lg border border-border/50">
                {/* Icon at the top */}
                <div className="flex items-center justify-center mb-8">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                    <stat.icon className="h-8 w-8 text-primary" />
                  </div>
                </div>
                
                {/* Main value */}
                <dd className="text-4xl font-bold tracking-tight text-foreground mb-4 group-hover:text-primary transition-colors duration-300">
                  {stat.value}
                </dd>
                
                {/* Title */}
                <dt className="text-base font-semibold leading-6 text-foreground mb-3">
                  {stat.name}
                </dt>
                
                {/* Description */}
                <dd className="text-sm text-muted-foreground leading-relaxed">
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