/**
 * Offline-First Storage System for Moonbug
 * Uses IndexedDB for local storage with sync queue for Firebase
 */

import { openDB, IDBPDatabase } from 'idb';

// Types for offline storage
export interface OfflineNote {
  id: string;
  content: string;
  scopeId: string;
  type: 'note' | 'todo' | 'idea' | 'event' | 'reminder' | 'deadline';
  isCompleted: boolean;
  createdAt: string;
  ownerId: string;
  synced: boolean;
}

export interface OfflineScope {
  id: string;
  name: string;
  description: string;
  tasks: Array<{ id: string; title: string; completed: boolean }>;
  deadline?: string;
  createdAt: string;
  color: string;
  synced: boolean;
}

export interface OfflineProfile {
  id: string;
  nickname: string;
  email?: string;
  studentId: string;
  rewardsBalance: number;
  hasPaid: boolean;
  createdAt: string;
  synced: boolean;
}

export interface OfflineSurvey {
  id: string;
  title: string;
  description: string;
  questions: Array<{
    id: string;
    question: string;
    type: 'text' | 'multiple-choice' | 'rating';
    options?: string[];
  }>;
  responses?: Array<{
    questionId: string;
    answer: string;
  }>;
  reward: number;
  completed: boolean;
  createdAt: string;
}

// Database schema type
interface MoonbugDB {
  notes: {
    key: string;
    value: OfflineNote;
    indexes: ['scopeId', 'ownerId', 'synced', 'createdAt'];
  };
  scopes: {
    key: string;
    value: OfflineScope;
    indexes: ['ownerId', 'synced', 'createdAt'];
  };
  profile: {
    key: string;
    value: OfflineProfile;
    indexes: ['synced'];
  };
  surveys: {
    key: string;
    value: OfflineSurvey;
    indexes: ['completed', 'reward'];
  };
  syncQueue: {
    key: string;
    value: {
      id: string;
      type: 'create' | 'update' | 'delete';
      collection: string;
      data: any;
      timestamp: number;
    };
    indexes: ['timestamp', 'collection'];
  };
}

let db: IDBPDatabase<MoonbugDB> | null = null;

export async function initOfflineDB() {
  if (db) return db;
  
  db = await openDB<MoonbugDB>('moonbug-db', 1, {
    upgrade(database) {
      // Notes store
      const notesStore = database.createObjectStore('notes', { keyPath: 'id' });
      notesStore.createIndex('scopeId', 'scopeId');
      notesStore.createIndex('ownerId', 'ownerId');
      notesStore.createIndex('synced', 'synced');
      notesStore.createIndex('createdAt', 'createdAt');

      // Scopes store
      const scopesStore = database.createObjectStore('scopes', { keyPath: 'id' });
      scopesStore.createIndex('ownerId', 'ownerId');
      scopesStore.createIndex('synced', 'synced');
      scopesStore.createIndex('createdAt', 'createdAt');

      // Profile store
      const profileStore = database.createObjectStore('profile', { keyPath: 'id' });
      profileStore.createIndex('synced', 'synced');

      // Surveys store
      const surveysStore = database.createObjectStore('surveys', { keyPath: 'id' });
      surveysStore.createIndex('completed', 'completed');
      surveysStore.createIndex('reward', 'reward');

      // Sync queue for offline operations
      const syncQueue = database.createObjectStore('syncQueue', { keyPath: 'id' });
      syncQueue.createIndex('timestamp', 'timestamp');
      syncQueue.createIndex('collection', 'collection');
    },
  });

  return db;
}

// Notes operations
export async function createOfflineNote(note: OfflineNote) {
  const database = await initOfflineDB();
  return database.put('notes', { ...note, synced: false });
}

export async function getOfflineNotes(ownerId: string): Promise<OfflineNote[]> {
  const database = await initOfflineDB();
  return database.getAllFromIndex('notes', 'ownerId', IDBKeyRange.only(ownerId));
}

export async function getOfflineNotesByScope(scopeId: string): Promise<OfflineNote[]> {
  const database = await initOfflineDB();
  return database.getAllFromIndex('notes', 'scopeId', IDBKeyRange.only(scopeId));
}

export async function updateOfflineNote(note: OfflineNote) {
  const database = await initOfflineDB();
  return database.put('notes', { ...note, synced: false });
}

export async function deleteOfflineNote(id: string) {
  const database = await initOfflineDB();
  return database.delete('notes', id);
}

// Scopes operations
export async function createOfflineScope(scope: OfflineScope) {
  const database = await initOfflineDB();
  return database.put('scopes', { ...scope, synced: false });
}

export async function getOfflineScopes(ownerId: string): Promise<OfflineScope[]> {
  const database = await initOfflineDB();
  return database.getAllFromIndex('scopes', 'ownerId', IDBKeyRange.only(ownerId));
}

export async function updateOfflineScope(scope: OfflineScope) {
  const database = await initOfflineDB();
  return database.put('scopes', { ...scope, synced: false });
}

// Profile operations
export async function saveOfflineProfile(profile: OfflineProfile) {
  const database = await initOfflineDB();
  return database.put('profile', { ...profile, id: 'current', synced: false });
}

export async function getOfflineProfile(): Promise<OfflineProfile | undefined> {
  const database = await initOfflineDB();
  return database.get('profile', 'current');
}

// Surveys operations
export async function getOfflineSurveys(): Promise<OfflineSurvey[]> {
  const database = await initOfflineDB();
  return database.getAll('surveys');
}

export async function saveOfflineSurvey(survey: OfflineSurvey) {
  const database = await initOfflineDB();
  return database.put('surveys', survey);
}

// Sync queue operations
export async function addToSyncQueue(
  type: 'create' | 'update' | 'delete',
  collection: string,
  data: any
) {
  const database = await initOfflineDB();
  const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  return database.put('syncQueue', {
    id,
    type,
    collection,
    data,
    timestamp: Date.now(),
  });
}

export async function getSyncQueue(): Promise<any[]> {
  const database = await initOfflineDB();
  return database.getAll('syncQueue');
}

export async function clearSyncQueue() {
  const database = await initOfflineDB();
  const tx = database.transaction('syncQueue', 'readwrite');
  await tx.store.clear();
  await tx.done;
}

// Check if online
export function isOnline(): boolean {
  return typeof navigator !== 'undefined' ? navigator.onLine : true;
}

// Sync pending operations to Firebase
export async function syncPendingOperations(
  firestoreDb: any,
  user: any
) {
  if (!isOnline() || !firestoreDb || !user) return;

  const { collection, addDoc } = await import('firebase/firestore');
  const queue = await getSyncQueue();
  
  for (const item of queue) {
    try {
      if (item.type === 'create') {
        await addDoc(collection(firestoreDb, 'users', user.uid, item.collection), item.data);
      }
      // Remove from queue on success
      const database = await initOfflineDB();
      await database.delete('syncQueue', item.id);
    } catch (error) {
      console.error('Sync failed:', error);
    }
  }
}