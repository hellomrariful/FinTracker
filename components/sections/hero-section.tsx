"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { VideoModal } from "@/components/ui/video-modal";
import { ArrowRight, Play, TrendingUp, Shield, Zap } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export function HeroSection() {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  const handleWatchDemo = () => {
    setIsVideoModalOpen(true);
  };

  return (
    <div className="relative overflow-hidden bg-background pt-14">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-primary/20 via-accent/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-0 translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-bl from-accent/15 via-primary/15 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 lg:py-40">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
            <Zap className="mr-2 h-4 w-4" />
            FinTracker: Your Digital Finance Manager!
          </div>

          {/* Headline */}
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            Smart Financial
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent py-[5px]">
              Management
            </span>
            for Digital Businesses
          </h1>

          {/* Sub-headline */}
          <p className="mt-6 text-lg leading-8 text-muted-foreground sm:text-xl lg:text-2xl max-w-3xl mx-auto">
            Take control of your finances with intelligent tracking, powerful
            analytics, and actionable insights. Built for modern businesses that
            demand more.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/demo">
              <Button
                size="lg"
                className="group relative overflow-hidden px-8 py-4 text-lg font-semibold"
              >
                <span className="relative z-10 flex items-center">
                  Try Live Demo
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 transition-opacity group-hover:opacity-100" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button
                variant="outline"
                size="lg"
                className="group px-8 py-4 text-lg font-semibold"
              >
                <Play className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
                Start Free Trial
              </Button>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-accent" />
              Bank-level Security
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-accent" />
              Real-time Analytics
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-accent" />
              Instant Setup
            </div>
          </div>
        </div>

        {/* Hero Image/Dashboard Preview */}
        <div className="mt-20 relative">
          <div className="relative mx-auto max-w-5xl">
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-accent/20 rounded-3xl blur-2xl" />
            <div className="relative bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-primary/10 to-accent/10 px-6 py-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <div className="ml-4 text-sm font-medium text-muted-foreground">
                    fintracker.com/dashboard
                  </div>
                </div>
              </div>
              <div className="p-0">
                <Image
                  src="/dashboard.png"
                  alt="FinTracker Dashboard Preview"
                  width={1200}
                  height={800}
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        videoUrl="https://www.youtube.com/watch?v=7Dmozfs0Q44&ab_channel=ArifulIslam"
        title="FinTracker Demo Video"
      />
    </div>
  );
}
