/**
 * Accessibility Hook for Moonbug
 * Provides screen reader support, visual alerts, and keyboard navigation
 */

import { useEffect, useState } from 'react';

export type AccessibilityMode = 'default' | 'screen-reader' | 'visual-alerts' | 'high-contrast';

export interface AccessibilitySettings {
  mode: AccessibilityMode;
  fontSize: 'small' | 'medium' | 'large' | 'x-large';
  reducedMotion: boolean;
  screenReaderEnabled: boolean;
  visualAlertsEnabled: boolean;
}

const defaultSettings: AccessibilitySettings = {
  mode: 'default',
  fontSize: 'medium',
  reducedMotion: false,
  screenReaderEnabled: false,
  visualAlertsEnabled: false,
};

export function useAccessibility() {
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings);

  useEffect(() => {
    // Load settings from localStorage
    const saved = localStorage.getItem('moonbug-accessibility');
    if (saved) {
      setSettings(JSON.parse(saved));
    }

    // Check for system preferences
    if (typeof window !== 'undefined') {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) {
        setSettings(prev => ({ ...prev, reducedMotion: true }));
      }
    }
  }, []);

  useEffect(() => {
    // Apply settings to document
    const root = document.documentElement;
    
    // Font size
    const fontSizes = {
      small: '14px',
      medium: '16px',
      large: '18px',
      'x-large': '20px',
    };
    root.style.setProperty('--font-size-base', fontSizes[settings.fontSize]);

    // High contrast mode
    if (settings.mode === 'high-contrast') {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Reduced motion
    if (settings.reducedMotion) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }

    // Save to localStorage
    localStorage.setItem('moonbug-accessibility', JSON.stringify(settings));
  }, [settings]);

  const announceToScreenReader = (message: string) => {
    if (!settings.screenReaderEnabled) return;
    
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  };

  const showVisualAlert = (message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
    if (!settings.visualAlertsEnabled) return;
    
    // Create visual alert element
    const alert = document.createElement('div');
    alert.className = `fixed top-20 right-4 px-6 py-4 rounded-lg z-[200] transition-all ${
      type === 'success' ? 'bg-green-500/20 border border-green-500' :
      type === 'warning' ? 'bg-yellow-500/20 border border-yellow-500' :
      type === 'error' ? 'bg-red-500/20 border border-red-500' :
      'bg-blue-500/20 border border-blue-500'
    }`;
    alert.setAttribute('role', 'alert');
    alert.textContent = message;
    document.body.appendChild(alert);
    
    setTimeout(() => {
      alert.remove();
    }, 5000);
  };

  return {
    settings,
    setSettings,
    announceToScreenReader,
    showVisualAlert,
  };
}

// Keyboard navigation helper
export function useKeyboardNavigation() {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip to main content
      if (e.key === 's' && e.altKey) {
        const main = document.querySelector('main');
        main?.focus();
      }
      
      // Skip to navigation
      if (e.key === 'n' && e.altKey) {
        const nav = document.querySelector('nav');
        nav?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);
}