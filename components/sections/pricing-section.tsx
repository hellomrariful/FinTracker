import { Button } from '@/components/ui/button';
import { CheckCircle, X } from 'lucide-react';
import Link from 'next/link';

const tiers = [
  {
    name: 'Starter',
    id: 'tier-starter',
    href: '/auth/signup?plan=starter',
    price: { monthly: '$0', annually: '$0' },
    description: 'Perfect for individuals and small startups getting started.',
    features: [
      'Up to 100 transactions per month',
      'Basic expense tracking',
      'Simple income management',
      'Monthly reports',
      'Email support',
    ],
    notIncluded: [
      'Advanced analytics',
      'Team collaboration',
      'API access',
      'Priority support',
    ],
    mostPopular: false,
  },
  {
    name: 'Professional',
    id: 'tier-professional',
    href: '/auth/signup?plan=professional',
    price: { monthly: '$29', annually: '$290' },
    description: 'Best for growing businesses that need advanced features.',
    features: [
      'Unlimited transactions',
      'Advanced expense tracking',
      'Multi-currency support',
      'Custom categories',
      'Advanced analytics & insights',
      'Team collaboration (up to 5 users)',
      'Priority email support',
      'Data export (CSV, PDF)',
      'Mobile app access',
    ],
    notIncluded: [
      'API access',
      'Custom integrations',
      'Dedicated account manager',
    ],
    mostPopular: true,
  },
  {
    name: 'Enterprise',
    id: 'tier-enterprise',
    href: '/contact',
    price: { monthly: 'Custom', annually: 'Custom' },
    description: 'Advanced features for large organizations with complex needs.',
    features: [
      'Everything in Professional',
      'Unlimited team members',
      'API access & webhooks',
      'Custom integrations',
      'Advanced security & compliance',
      'Dedicated account manager',
      '24/7 phone support',
      'Custom reporting',
      'Single sign-on (SSO)',
      'White-label options',
    ],
    notIncluded: [],
    mostPopular: false,
  },
];

export function PricingSection() {
  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-base font-semibold leading-7 text-primary">Pricing</h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Choose the right plan for your business
          </p>
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-muted-foreground">
          Start free and scale as you grow. No hidden fees, no surprises.
        </p>
        <div className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-y-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-x-8 xl:gap-x-12">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className={`flex flex-col justify-between rounded-3xl bg-card p-8 ring-1 xl:p-10 ${
                tier.mostPopular
                  ? 'ring-2 ring-primary shadow-2xl scale-105'
                  : 'ring-border shadow-lg'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-x-4">
                  <h3
                    id={tier.id}
                    className={`text-lg font-semibold leading-8 ${
                      tier.mostPopular ? 'text-primary' : 'text-foreground'
                    }`}
                  >
                    {tier.name}
                  </h3>
                  {tier.mostPopular ? (
                    <p className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold leading-5 text-primary">
                      Most popular
                    </p>
                  ) : null}
                </div>
                <p className="mt-4 text-sm leading-6 text-muted-foreground">
                  {tier.description}
                </p>
                <p className="mt-6 flex items-baseline gap-x-1">
                  <span className="text-4xl font-bold tracking-tight text-foreground">
                    {tier.price.monthly}
                  </span>
                  {tier.price.monthly !== 'Custom' && (
                    <span className="text-sm font-semibold leading-6 text-muted-foreground">
                      /month
                    </span>
                  )}
                </p>
                <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-muted-foreground">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex gap-x-3">
                      <CheckCircle
                        className="h-6 w-5 flex-none text-accent"
                        aria-hidden="true"
                      />
                      {feature}
                    </li>
                  ))}
                  {tier.notIncluded.map((feature) => (
                    <li key={feature} className="flex gap-x-3 opacity-60">
                      <X
                        className="h-6 w-5 flex-none text-muted-foreground"
                        aria-hidden="true"
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <Link href={tier.href} className="mt-8">
                <Button
                  className={`w-full ${
                    tier.mostPopular
                      ? 'bg-primary hover:bg-primary/90'
                      : ''
                  }`}
                  variant={tier.mostPopular ? 'default' : 'outline'}
                >
                  {tier.name === 'Enterprise' ? 'Contact Sales' : 'Get Started'}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}