# Moonbug Implementation Documentation

## Overview
Moonbug is a productivity and learning platform designed for offline-first resilience, pedagogical assistance, and celestial tracking. This document outlines the implementation of all features.

## Core Features Implemented

### 1. Offline-First Storage System (`src/lib/offline-storage.ts`)
- **IndexedDB Integration**: Uses `idb` library for local data storage
- **Data Stores**:
  - `notes`: Text/voice notes with scope association
  - `scopes`: Project containers with tasks and deadlines
  - `profile`: User profile with rewards balance
  - `surveys`: Community surveys with responses
  - `syncQueue`: Queue for offline operations to sync when online
- **Sync Strategy**: Local-first, sync to Firebase when online

### 2. School-Based Authentication (`src/firebase/auth/school-auth.ts`)
- **Login Method**: School name, school ID, student name, email, and nickname
- **Nickname Lock-in**: Nickname is permanent and cannot be changed without payment
- **Student ID Generation**: `STU-{schoolId}-{random}` format
- **Offline Support**: Profile stored locally first, then synced

### 3. Survey System (`src/lib/surveys-data.ts`, `src/app/surveys/page.tsx`)
- **Parties Benefiting**:
  - **NGOs**: Targeted resource allocation, impact measurement
  - **Anonymous Individuals**: Direct impact visibility, peer-to-peer sharing
  - **Government Projects**: Data-driven policy, resource gap identification
  - **Investors/Loaners**: Low-risk opportunities, ROI tracking
- **Reward System**: SAT (Student Achievement Token) currency
- **Survey Types**: Resource, Infrastructure, Nutrition surveys

### 4. SAT Reward Currency
- **Earning**: Complete surveys to earn SAT tokens
- **Storage**: Local rewards balance in profile
- **Future**: Can be forwarded/spent on educational resources

### 5. Accessibility Features (`src/hooks/use-accessibility.ts`)
- **Screen Reader Support**: ARIA live regions for announcements
- **Visual Alerts**: On-screen notifications for deaf users
- **Font Size Control**: Small, medium, large, x-large options
- **Reduced Motion**: Respects system preferences
- **Keyboard Navigation**: Alt+S (skip to main), Alt+N (skip to nav)

### 6. Data Import & Grammar Check (`src/lib/data-import.ts`)
- **File Import**: Text file parsing
- **Grammar Check**: Common misspellings correction
- **AI Organization**: Categorizes notes into ideas, tasks, events
- **Scope Detection**: Parses scope:type markers in imported data

### 7. Privacy Controls (`src/lib/privacy-controls.ts`)
- **Anonymous Mode**: Removes PII before sharing
- **Data Encryption**: Base64 encoding (placeholder for production)
- **Minority Group Support**: Optional self-identification
- **Granular Sharing**: Control what data goes to which party

## Resource Types & Implementation Methods

### Food
- **Conventional**: School feeding programs, community gardens, nutritional education
- **Non-Conventional**: Permaculture food forests, aquaponics, food-sharing networks

### Clothing
- **Conventional**: Uniform programs, donation drives, tailoring training
- **Non-Conventional**: Upcycling workshops, clothing libraries, fiber arts

### Survival Resources
- **Conventional**: Emergency protocols, stockpiling, response teams
- **Non-Conventional**: Bushcraft education, local resource mapping, peer networks

### Inquiry & Research
- **Conventional**: Library access, research grants, mentorship
- **Non-Conventional**: Citizen science, open-source collaboration, peer circles

### Experimentation
- **Conventional**: Science labs, maker spaces, hands-on curricula
- **Non-Conventional**: DIY kits, community workshops, open hardware

### Guidance & Care
- **Conventional**: Counseling, mentorship, peer support
- **Non-Conventional**: Elders wisdom, peer counseling, trauma-informed care

## Scopes System

A Scope is a project container with:
- **Name**: Project title
- **Description**: Focus area details
- **Tasks**: Array of task objects with completion status
- **Deadline**: Optional due date
- **Color**: Visual identifier
- **Notes**: Associated notes (note, todo, idea, event, reminder, deadline types)

## Technical Stack Recommendations

- **Offline Storage**: IndexedDB with Dexie.js
- **Mobile**: Capacitor for cross-platform (APK: 25-40MB)
- **Offline STT**: Whisper.cpp or Vosk
- **Encryption**: Web Crypto API for production
- **AI**: Genkit with local LLM options

## File Structure
```
src/
├── app/
│   ├── page.tsx          # Main dashboard
│   ├── moon-dial/        # Lunar tracking
│   └── surveys/          # Survey system
├── components/
│   ├── nexus/            # Input and scope components
│   ├── moon-dial/        # Moon visualization
│   └── navigation/       # Header and nav
├── firebase/
│   ├── auth/             # Authentication hooks
│   └── firestore/        # Database hooks
├── hooks/
│   └── use-accessibility.ts
├── lib/
│   ├── offline-storage.ts
│   ├── surveys-data.ts
│   ├── data-import.ts
│   ├── privacy-controls.ts
│   └── lunar-engine.ts
└── ai/
    └── flows/
        └── strategy-flow.ts
```

## Future Enhancements
1. Offline speech-to-text with Whisper.cpp
2. Local LLM for AI strategy engine
3. Bitcoin/SAT wallet integration
4. Real-time sync with conflict resolution
5. Advanced data visualization for survey results
6. Multi-language support
7. Voice commands for accessibility