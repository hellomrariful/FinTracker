import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Clock,
  Activity,
  Server,
  Database,
  Globe,
  Shield,
  Zap,
} from "lucide-react";

export const metadata: Metadata = {
  title: "System Status | FinTracker",
  description:
    "Real-time status of FinTracker services and infrastructure. Check for any ongoing issues or maintenance.",
};

const systemStatus = {
  overall: "operational", // operational, degraded, outage
  lastUpdated: "2025-01-15T10:30:00Z",
};

const services = [
  {
    name: "Web Application",
    status: "operational",
    description: "Main FinTracker web application",
    icon: Globe,
    uptime: "99.98%",
    responseTime: "245ms",
  },
  {
    name: "API Services",
    status: "operational",
    description: "REST API and data processing",
    icon: Server,
    uptime: "99.95%",
    responseTime: "89ms",
  },
  {
    name: "Database",
    status: "operational",
    description: "Primary database cluster",
    icon: Database,
    uptime: "99.99%",
    responseTime: "12ms",
  },
  {
    name: "Authentication",
    status: "operational",
    description: "User login and security services",
    icon: Shield,
    uptime: "99.97%",
    responseTime: "156ms",
  },
  {
    name: "Data Integrations",
    status: "degraded",
    description: "Third-party platform connections",
    icon: Zap,
    uptime: "98.85%",
    responseTime: "1.2s",
  },
  {
    name: "Reporting Engine",
    status: "operational",
    description: "Report generation and analytics",
    icon: Activity,
    uptime: "99.92%",
    responseTime: "567ms",
  },
];

const incidents = [
  {
    id: 1,
    title: "Intermittent delays in Facebook Ads data sync",
    status: "investigating",
    severity: "minor",
    startTime: "2025-01-15T09:15:00Z",
    description:
      "We're experiencing intermittent delays in syncing Facebook Ads data. Most users are unaffected, but some may see delays of up to 30 minutes in their dashboard updates.",
    updates: [
      {
        time: "2025-01-15T10:30:00Z",
        message:
          "We've identified the root cause and are implementing a fix. Expected resolution within 2 hours.",
      },
      {
        time: "2025-01-15T09:45:00Z",
        message:
          "Our team is investigating reports of delayed Facebook Ads data synchronization.",
      },
    ],
  },
];

const maintenanceSchedule = [
  {
    id: 1,
    title: "Database Performance Optimization",
    scheduledTime: "2025-01-20T02:00:00Z",
    duration: "2 hours",
    impact: "No expected downtime",
    description:
      "Routine database maintenance to improve query performance and optimize storage.",
  },
  {
    id: 2,
    title: "Security Certificate Renewal",
    scheduledTime: "2025-01-25T01:00:00Z",
    duration: "30 minutes",
    impact: "Brief connection interruptions possible",
    description:
      "Scheduled renewal of SSL certificates. Users may experience brief connection interruptions.",
  },
];

const StatusIcon = ({ status }: { status: string }) => {
  switch (status) {
    case "operational":
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case "degraded":
      return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    case "outage":
      return <XCircle className="h-5 w-5 text-red-500" />;
    default:
      return <Clock className="h-5 w-5 text-gray-500" />;
  }
};

const StatusBadge = ({ status }: { status: string }) => {
  const variants = {
    operational: "bg-green-100 text-green-800 border-green-200",
    degraded: "bg-yellow-100 text-yellow-800 border-yellow-200",
    outage: "bg-red-100 text-red-800 border-red-200",
    investigating: "bg-blue-100 text-blue-800 border-blue-200",
  };

  return (
    <Badge
      className={`${
        variants[status as keyof typeof variants] || variants.operational
      } border`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

export default function StatusPage() {
  const overallStatusColor = {
    operational: "text-green-600",
    degraded: "text-yellow-600",
    outage: "text-red-600",
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              <h1 className="text-xl font-semibold">System Status</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Overall Status */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-6">
              <StatusIcon status={systemStatus.overall} />
              <h1
                className={`text-4xl font-bold ${
                  overallStatusColor[
                    systemStatus.overall as keyof typeof overallStatusColor
                  ]
                }`}
              >
                All Systems Operational
              </h1>
            </div>
            <p className="text-xl text-muted-foreground mb-4">
              FinTracker services are running smoothly. Check individual service
              status below.
            </p>
            <p className="text-sm text-muted-foreground">
              Last updated:{" "}
              {new Date(systemStatus.lastUpdated).toLocaleString()}
            </p>
          </div>
        </div>
      </section>

      {/* Service Status */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Service Status</h2>
            <p className="text-muted-foreground text-lg">
              Real-time status of all FinTracker services and infrastructure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <service.icon className="h-6 w-6 text-primary" />
                      <CardTitle className="text-lg">{service.name}</CardTitle>
                    </div>
                    <StatusIcon status={service.status} />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {service.description}
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Uptime:</span>
                      <span className="font-medium">{service.uptime}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Response Time:
                      </span>
                      <span className="font-medium">
                        {service.responseTime}
                      </span>
                    </div>
                  </div>
                  <StatusBadge status={service.status} />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Current Incidents */}
      {incidents.length > 0 && (
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Current Incidents</h2>
              <p className="text-muted-foreground text-lg">
                Active incidents and their resolution progress.
              </p>
            </div>

            <div className="max-w-4xl mx-auto space-y-6">
              {incidents.map((incident) => (
                <Card
                  key={incident.id}
                  className="border-l-4 border-l-yellow-500"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl">
                        {incident.title}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <StatusBadge status={incident.status} />
                        <Badge variant="outline" className="text-xs">
                          {incident.severity}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Started: {new Date(incident.startTime).toLocaleString()}
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">
                      {incident.description}
                    </p>
                    <div className="space-y-3">
                      <h4 className="font-semibold">Updates:</h4>
                      {incident.updates.map((update, index) => (
                        <div
                          key={index}
                          className="border-l-2 border-border pl-4 py-2"
                        >
                          <div className="text-sm text-muted-foreground mb-1">
                            {new Date(update.time).toLocaleString()}
                          </div>
                          <div className="text-sm">{update.message}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Scheduled Maintenance */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Scheduled Maintenance</h2>
            <p className="text-muted-foreground text-lg">
              Upcoming maintenance windows and their expected impact.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {maintenanceSchedule.map((maintenance) => (
              <Card key={maintenance.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">
                      {maintenance.title}
                    </CardTitle>
                    <Badge variant="outline">Scheduled</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(maintenance.scheduledTime).toLocaleString()} •{" "}
                    {maintenance.duration}
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-muted-foreground">
                    {maintenance.description}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      Expected Impact:
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      {maintenance.impact}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Subscribe to Updates */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Stay Informed</h2>
            <p className="text-muted-foreground mb-8">
              Subscribe to status updates and get notified about incidents and
              maintenance windows.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button>Subscribe</Button>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Get notified via email about system status changes
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
