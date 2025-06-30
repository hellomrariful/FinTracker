import { 
  BarChart3, 
  CreditCard, 
  PieChart, 
  TrendingUp, 
  Shield, 
  Zap,
  DollarSign,
  Target,
  Users,
  Bell,
  FileText,
  Globe
} from 'lucide-react';

const features = [
  {
    name: 'Expense Tracking',
    description: 'Automatically categorize and track all your business expenses with smart receipt scanning and AI-powered insights.',
    icon: CreditCard,
    color: 'text-primary bg-primary/10 border-primary/20',
  },
  {
    name: 'Income Management',
    description: 'Monitor revenue streams, track invoices, and manage multiple income sources with comprehensive dashboards.',
    icon: DollarSign,
    color: 'text-accent bg-accent/10 border-accent/20',
  },
  {
    name: 'Advanced Analytics',
    description: 'Get deep insights into your financial performance with customizable reports and predictive analytics.',
    icon: BarChart3,
    color: 'text-chart-3 bg-chart-3/10 border-chart-3/20',
  },
  {
    name: 'Budget Planning',
    description: 'Set and track budgets with intelligent alerts and recommendations to optimize your spending.',
    icon: Target,
    color: 'text-chart-4 bg-chart-4/10 border-chart-4/20',
  },
  {
    name: 'Real-time Insights',
    description: 'Access live financial data and trends to make informed decisions quickly and confidently.',
    icon: TrendingUp,
    color: 'text-chart-5 bg-chart-5/10 border-chart-5/20',
  },
  {
    name: 'Secure & Compliant',
    description: 'Bank-level security with end-to-end encryption and compliance with financial regulations.',
    icon: Shield,
    color: 'text-primary bg-primary/10 border-primary/20',
  },
  {
    name: 'Team Collaboration',
    description: 'Share insights and collaborate with your team through role-based access and shared dashboards.',
    icon: Users,
    color: 'text-accent bg-accent/10 border-accent/20',
  },
  {
    name: 'Smart Notifications',
    description: 'Stay informed with intelligent alerts for important financial events and opportunities.',
    icon: Bell,
    color: 'text-chart-3 bg-chart-3/10 border-chart-3/20',
  },
  {
    name: 'Export & Reports',
    description: 'Generate professional reports and export data in multiple formats for accounting and analysis.',
    icon: FileText,
    color: 'text-chart-4 bg-chart-4/10 border-chart-4/20',
  },
  {
    name: 'Multi-Currency',
    description: 'Handle international transactions with real-time exchange rates and multi-currency support.',
    icon: Globe,
    color: 'text-chart-5 bg-chart-5/10 border-chart-5/20',
  },
  {
    name: 'Lightning Fast',
    description: 'Optimized performance ensures your financial data is always accessible and up-to-date.',
    icon: Zap,
    color: 'text-primary bg-primary/10 border-primary/20',
  },
  {
    name: 'Visual Analytics',
    description: 'Beautiful charts and graphs that make complex financial data easy to understand and share.',
    icon: PieChart,
    color: 'text-accent bg-accent/10 border-accent/20',
  },
];

export function FeaturesSection() {
  return (
    <div id="features" className="py-24 sm:py-32 bg-muted/30">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold leading-7 text-primary">Everything you need</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Powerful features for modern finance management
          </p>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            From expense tracking to advanced analytics, Fintracker provides all the tools 
            you need to take control of your business finances.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.name} className="flex flex-col group">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-foreground">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg border ${feature.color} group-hover:scale-110 transition-transform duration-200`}>
                    <feature.icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-muted-foreground">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}