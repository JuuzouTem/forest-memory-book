## 1. Project Overview
A private, shared digital memory book (PWA) designed for an introverted couple's forest park dates. The app serves as a secure, shared cloud gallery where both partners can upload photos, record voice notes, and tag memories. It features an in-app camera, multi-file upload, a highly optimized horizontally scrollable custom tagging system, and offline capabilities. The project is strictly designed to be hosted for FREE on GitHub Pages, utilizing Firebase for a free backend and real-time syncing so both partners see the same memories instantly.

## 2. Tech Stack & Dependencies
- **Frontend Framework:** React 18 (Vite) - *Chosen for easy static export to GitHub Pages.*
- **Styling:** Tailwind CSS + Framer Motion (for smooth UI transitions).
- **Backend & Database:** Firebase (Firestore for real-time DB, Firebase Auth for private login).
- **Cloud Storage:** Firebase Storage (Generous 5GB free tier for photos and audio).
- **PWA Capabilities:** `vite-plugin-pwa` (for offline usage in the forest).
- **Mapping:** `react-leaflet` with OpenStreetMap (100% Free, no API keys).
- **Optimization:** `browser-image-compression` (CRITICAL: Compress images on client-side before upload to maximize the free Firebase storage limit).
- **Icons:** `lucide-react`.

## 3. Directory Structure
```text
/
├── public/
│   ├── manifest.json       # PWA Manifest
│   └── icons/              # PWA Icons
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── layout/
│   │   ├── camera/
│   │   │   ├── WebCamera.jsx
│   │   │   └── Uploader.jsx
│   │   ├── gallery/
│   │   │   ├── MemoryCard.jsx
│   │   │   └── MasonryGrid.jsx
│   │   ├── tags/
│   │   │   ├── TagInput.jsx
│   │   │   └── ScrollableTagList.jsx
│   │   ├── audio/
│   │   │   └── VoiceRecorder.jsx
│   │   └── map/
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── hooks/
│   │   ├── useFirebase.js
│   │   └── useOfflineSync.js
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Home.jsx
│   │   ├── AddMemory.jsx
│   │   └── MapView.jsx
│   ├── services/
│   │   └── firebaseConfig.js
│   ├── styles/
│   │   └── index.css       # Tailwind + Lofi-Nature variables
│   ├── utils/
│   │   └── imageCompressor.js
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── vite.config.js
├── tailwind.config.js
└── package.json
```

## 4. Development Rules
- **Strictly Free Tier:** Do NOT introduce any paid APIs. Rely on Firebase free tier and OpenStreetMap.
- **Client-Side Compression:** All image uploads MUST pass through `browser-image-compression` to ensure file sizes are < 500kb without losing obvious visual quality.
- **Color Palette (Lofi-Nature):** Use soft nature colors. 
  - Primary: Soft Sage Green (`#9CAF88` or similar)
  - Secondary: Dusty Rose (`#D2A6A2`)
  - Background: Cream/Off-white (`#F9F6F0`)
  - Text: Dark Olive (`#3B4333`)
- **Tagging System UX:** The tag list must use `overflow-x-auto` with `snap-x` styling so it scrolls horizontally without taking up vertical space. It must look clean on mobile. Allow multiple tags per image.
- **Mobile-First:** The UI must be explicitly designed for mobile Safari/Chrome. Large touch targets, comfortable one-handed use.
- **PWA & Offline:** Implement service workers. If offline, queue uploads and sync when the connection is restored.
- **Shared State:** Ensure Firestore listeners update the UI in real-time so both users see new uploads instantly.

## 5. Roadmap & Status
- [ ] **Phase 1: Foundation & Deployment Setup**
  - [ ] Initialize Vite + React project.
  - [ ] Configure Tailwind CSS with the Lofi-Nature palette.
  - [ ] Set up Firebase (Auth, Firestore, Storage) and secure rules.
  - [ ] Create GitHub repository and configure GitHub Actions for automatic GitHub Pages deployment.
- [ ] **Phase 2: Core Memories (Photos & Tags)**
  - [ ] Implement Private Login screen.
  - [ ] Build `WebCamera` and `Uploader` components with image compression.
  - [ ] Develop custom horizontal scrollable tag system (Add new, select existing).
  - [ ] Create Home Feed (Masonry Gallery) fetching from Firestore.
- [ ] **Phase 3: The Introvert Features**
  - [ ] Add Voice Notes (`VoiceRecorder`) attached to memories.
  - [ ] Add Daily Mood emoji picker.
  -[ ] Implement Time Capsule (hidden text notes unlocking on a specific date).
- [ ] **Phase 4: Map & Polish**
  - [ ] Integrate `react-leaflet` to map memory coordinates.
  - [ ] Configure PWA manifest and offline sync logic.
  - [ ] Final UI/UX polish and Framer Motion animations.
```