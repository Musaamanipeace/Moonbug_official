/**
 * Privacy Controls for Minority Groups
 * Ensures data protection and anonymity for all users
 */

export interface PrivacySettings {
  anonymousMode: boolean;
  dataEncryption: boolean;
  minorityGroup: string;
  shareWithResearchers: boolean;
  shareWithNGOs: boolean;
  shareWithGovernment: boolean;
  shareWithInvestors: boolean;
}

export const minorityGroups = [
  { id: 'none', name: 'Prefer not to say' },
  { id: 'ethnic-minority', name: 'Ethnic Minority' },
  { id: 'religious-minority', name: 'Religious Minority' },
  { id: 'lgbtq', name: 'LGBTQ+' },
  { id: 'disabled', name: 'Disabled' },
  { id: 'refugee', name: 'Refugee/Asylum Seeker' },
  { id: 'low-income', name: 'Low Income' },
  { id: 'rural', name: 'Rural/Remote' },
  { id: 'other', name: 'Other' },
];

// Encrypt data before sharing
export function encryptData(data: any, key: string): string {
  // Simple encryption for demonstration
  // In production, use proper encryption like libsodium or Web Crypto API
  if (typeof window === 'undefined') return JSON.stringify(data);
  
  const text = JSON.stringify(data);
  const encoded = btoa(text);
  return encoded;
}

// Anonymize data for sharing
export function anonymizeData(data: any, settings: PrivacySettings): any {
  if (!settings.anonymousMode) return data;
  
  const anonymized = { ...data };
  
  // Remove personally identifiable information
  delete anonymized.email;
  delete anonymized.displayName;
  delete anonymized.studentId;
  
  // Add minority group tag if consented
  if (settings.minorityGroup && settings.minorityGroup !== 'none') {
    anonymized.minorityGroup = settings.minorityGroup;
  }
  
  return anonymized;
}

// Check if data can be shared with specific party
export function canShareWith(party: 'researchers' | 'ngos' | 'government' | 'investors', settings: PrivacySettings): boolean {
  switch (party) {
    case 'researchers': return settings.shareWithResearchers;
    case 'ngos': return settings.shareWithNGOs;
    case 'government': return settings.shareWithGovernment;
    case 'investors': return settings.shareWithInvestors;
  }
}

// Get data sharing summary
export function getDataSharingSummary(settings: PrivacySettings): {
  totalShares: number;
  parties: string[];
} {
  const parties: string[] = [];
  
  if (settings.shareWithResearchers) parties.push('Researchers');
  if (settings.shareWithNGOs) parties.push('NGOs');
  if (settings.shareWithGovernment) parties.push('Government');
  if (settings.shareWithInvestors) parties.push('Investors');
  
  return {
    totalShares: parties.length,
    parties,
  };
}

// Default privacy settings
export const defaultPrivacySettings: PrivacySettings = {
  anonymousMode: true,
  dataEncryption: true,
  minorityGroup: 'none',
  shareWithResearchers: false,
  shareWithNGOs: false,
  shareWithGovernment: false,
  shareWithInvestors: false,
};