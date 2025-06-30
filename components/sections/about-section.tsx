import { Users, Target, Award, Globe } from 'lucide-react';

const values = [
  {
    name: 'Innovation First',
    description: 'We believe in pushing the boundaries of what financial software can do, constantly innovating to serve our customers better.',
    icon: Target,
  },
  {
    name: 'Customer Success',
    description: 'Your success is our success. We build features and provide support that directly contributes to your business growth.',
    icon: Award,
  },
  {
    name: 'Transparency',
    description: 'We believe in honest communication, clear pricing, and transparent business practices in everything we do.',
    icon: Globe,
  },
  {
    name: 'Team Excellence',
    description: 'Our diverse team of experts is passionate about creating exceptional experiences for our customers.',
    icon: Users,
  },
];

const team = [
  {
    name: 'Alex Thompson',
    role: 'CEO & Co-founder',
    imageUrl: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop&crop=face',
    bio: 'Former Goldman Sachs analyst with 10+ years in fintech. Passionate about democratizing financial tools.',
  },
  {
    name: 'Sarah Kim',
    role: 'CTO & Co-founder',
    imageUrl: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop&crop=face',
    bio: 'Ex-Google engineer specializing in scalable systems. Believes technology should make complex things simple.',
  },
  {
    name: 'Marcus Rodriguez',
    role: 'Head of Product',
    imageUrl: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop&crop=face',
    bio: 'Product strategist with experience at Stripe and Square. Focused on building intuitive financial experiences.',
  },
  {
    name: 'Emily Chen',
    role: 'Head of Design',
    imageUrl: 'https://images.pexels.com/photos/3184299/pexels-photo-3184299.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop&crop=face',
    bio: 'Design leader from Airbnb. Passionate about creating beautiful, accessible interfaces that users love.',
  },
];

export function AboutSection() {
  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Hero Section */}
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
            About Fintracker
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            We're on a mission to revolutionize financial management for digital businesses, 
            making it simple, powerful, and accessible for everyone.
          </p>
        </div>

        {/* Story Section */}
        <div className="mx-auto mt-16 max-w-4xl">
          <div className="bg-card rounded-2xl p-8 lg:p-12 border border-border">
            <h2 className="text-2xl font-bold tracking-tight text-foreground mb-6">
              Our Story
            </h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-muted-foreground leading-8">
                Fintracker was born from frustration. As entrepreneurs ourselves, we struggled with 
                existing financial tools that were either too basic for growing businesses or too 
                complex and expensive for small teams.
              </p>
              <p className="text-muted-foreground leading-8 mt-4">
                We believed there had to be a better way. In 2022, we set out to build the financial 
                management platform we wished existed - one that could grow with your business, provide 
                meaningful insights, and actually be enjoyable to use.
              </p>
              <p className="text-muted-foreground leading-8 mt-4">
                Today, Fintracker serves over 50,000 businesses worldwide, from solo entrepreneurs to 
                fast-growing startups. We're proud to be part of their journey toward better financial health.
              </p>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mx-auto mt-24 max-w-7xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Our Values
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              The principles that guide everything we do
            </p>
          </div>
          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <div key={value.name} className="text-center group">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 group-hover:bg-primary/20 transition-colors">
                  <value.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mt-6 text-lg font-medium text-foreground">{value.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className="mx-auto mt-24 max-w-7xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Meet Our Team
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              The passionate people building the future of financial management
            </p>
          </div>
          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((person) => (
              <div key={person.name} className="group">
                <div className="aspect-square overflow-hidden rounded-2xl bg-muted">
                  <img
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    src={person.imageUrl}
                    alt={person.name}
                  />
                </div>
                <h3 className="mt-6 text-lg font-medium text-foreground">{person.name}</h3>
                <p className="text-sm text-primary font-medium">{person.role}</p>
                <p className="mt-2 text-sm text-muted-foreground">{person.bio}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Mission Section */}
        <div className="mx-auto mt-24 max-w-4xl text-center">
          <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-2xl p-8 lg:p-12 border border-primary/20">
            <h2 className="text-2xl font-bold tracking-tight text-foreground mb-6">
              Our Mission
            </h2>
            <p className="text-lg text-muted-foreground leading-8">
              To empower every business with the financial clarity and tools they need to make 
              confident decisions, achieve sustainable growth, and build a better future.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}