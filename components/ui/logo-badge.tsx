'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export function LogoBadge() {
  const [isDarkBackground, setIsDarkBackground] = useState(false);

  useEffect(() => {
    // Function to detect if the background is dark
    const detectBackgroundColor = () => {
      // Get the computed background color of the body or main container
      const body = document.body;
      const computedStyle = window.getComputedStyle(body);
      const backgroundColor = computedStyle.backgroundColor;
      
      // If background is transparent, check the html element
      if (backgroundColor === 'rgba(0, 0, 0, 0)' || backgroundColor === 'transparent') {
        const html = document.documentElement;
        const htmlStyle = window.getComputedStyle(html);
        const htmlBgColor = htmlStyle.backgroundColor;
        
        // Check for dark mode class or dark background
        const isDarkMode = html.classList.contains('dark') || 
                          body.classList.contains('dark') ||
                          htmlBgColor.includes('rgb(0, 0, 0)') ||
                          htmlBgColor.includes('rgba(0, 0, 0');
        
        setIsDarkBackground(isDarkMode);
        return;
      }

      // Parse RGB values to determine if background is dark
      const rgb = backgroundColor.match(/\d+/g);
      if (rgb) {
        const [r, g, b] = rgb.map(Number);
        // Calculate luminance using the relative luminance formula
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        setIsDarkBackground(luminance < 0.5);
      }
    };

    // Initial detection
    detectBackgroundColor();

    // Create observer for theme changes
    const observer = new MutationObserver(detectBackgroundColor);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'data-theme']
    });

    // Listen for theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', detectBackgroundColor);

    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener('change', detectBackgroundColor);
    };
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50 sm:bottom-6 sm:right-6 lg:bottom-8 lg:right-8">
      <Link
        href="https://bolt.new/"
        target="_blank"
        rel="noopener noreferrer"
        className="group block transition-all duration-300 ease-in-out hover:scale-110 focus:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background rounded-full"
        aria-label="Powered by Bolt.new - Open in new tab"
      >
        <div className="relative w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 xl:w-16 xl:h-16 transition-all duration-300 ease-in-out group-hover:shadow-lg group-focus:shadow-lg">
          <Image
            src={isDarkBackground ? "/white_circle_360x360.png" : "/black_circle_360x360.png"}
            alt="Bolt.new logo - AI-powered development platform"
            fill
            className="object-contain transition-all duration-300 ease-in-out group-hover:brightness-110 group-focus:brightness-110"
            sizes="(max-width: 640px) 40px, (max-width: 1024px) 48px, (max-width: 1280px) 56px, 64px"
            priority={false}
          />
          
          {/* Subtle glow effect on hover */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-300 ease-in-out blur-sm -z-10" />
        </div>
      </Link>
    </div>
  );
}