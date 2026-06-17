# Moonbug OS

A high-fidelity productivity and learning platform designed for offline-first resilience, pedagogical assistance, and celestial tracking.

## Core Features
- **Offline-First Input**: Quick capture of notes and insights using text or speech.
- **Nexus Strategy Engine**: Integrated AI (via Genkit & Gemini) to provide strategic advice based on your local schedule and learning goals.
- **Scope Management**: Organize productivity into "Scopes" (Project Containers) with tasks, deadlines, and specific note types.
- **Learning Hub**: Participate in institutional surveys to earn virtual rewards (SATs) and help allocate local resources.
- **Moon Dial**: A high-fidelity, offline astronomical engine for tracking lunar phases and orbital cycles.
- **Voice Integration**: Web Speech API integration for hands-free insight capture.

## Prerequisites
- **Node.js**: Version 18.0.0 or higher.
- **NPM**: Version 9.0.0 or higher.
- **Firebase Project**: A Firebase project with Firestore and Authentication enabled.
- **Google AI (Gemini) API Key**: Required for the Strategy AI and pedagogical insights.

## Local Installation

1. **Clone the project**
   ```bash
   git clone <your-repository-url>
   cd moonbug
   ```

2. **Install Dependencies**
   The project uses a modern Next.js 15 stack with React 19.
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env.local` file in the root directory and add your keys:
   ```env
   # Genkit / Gemini Configuration
   GOOGLE_GENAI_API_KEY=your_gemini_api_key_here

   # Firebase Configuration (From Firebase Console)
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

4. **Initialize Firebase in the Code**
   Ensure `src/firebase/config.ts` uses the environment variables mentioned above.

## Running the App

### Development Mode
Start the Next.js development server:
```bash
npm run dev
```
The app will be available at `http://localhost:9002` (or your configured port).

### Genkit AI Dev UI
To debug AI flows and prompts:
```bash
npm run genkit:dev
```

## Tech Stack & Dependencies

### Frameworks
- **Next.js 15**: App Router, Server Actions.
- **React 19**: Modern functional components and hooks.
- **TypeScript**: Full type safety across the application.

### Backend & AI
- **Firebase SDK**: Firestore for data, Auth for identity.
- **Genkit**: Framework for Generative AI flows.
- **Google Gemini**: Large Language Model for strategy and pedagogy.

### UI & Styling
- **Tailwind CSS**: Utility-first styling.
- **ShadCN UI**: High-quality accessible components (Radix UI primitives).
- **Lucide React**: Icon library.
- **Framer Motion**: Smooth animations (optional integration).
- **Recharts**: Data visualization for progress and achievements.

### Full Dependency List (package.json)
- `@genkit-ai/google-genai`
- `firebase`
- `genkit`
- `zod`
- `lucide-react`
- `date-fns`
- `clsx` & `tailwind-merge`
- `react-hook-form`
- `@radix-ui` (Accordion, Alert, Avatar, Checkbox, Dialog, Tabs, etc.)

## Project Structure
- `src/app`: Next.js routes and layouts.
- `src/components`: UI components (Nexus, Moon Dial, UI primitives).
- `src/firebase`: Database hooks and service initialization.
- `src/ai`: Genkit flows and AI prompt definitions.
- `src/lib`: Helper utilities and the Lunar Engine logic.

## License
MIT - Created for the Luminous Node project.