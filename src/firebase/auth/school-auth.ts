/**
 * School-Based Authentication System for Moonbug
 * Students log in with school information (name, email, school ID)
 * Nickname is permanent and cannot be changed without payment
 */

import { useState, useEffect } from 'react';
import { useFirestore } from '../provider';
import { doc, setDoc } from 'firebase/firestore';
import { getOfflineProfile, saveOfflineProfile, OfflineProfile, initOfflineDB } from '@/lib/offline-storage';

export interface SchoolAuthData {
  schoolName: string;
  schoolId: string;
  studentName: string;
  studentEmail: string;
  nickname: string;
}

export function useSchoolAuth() {
  const db = useFirestore();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check for existing local auth
  useEffect(() => {
    const checkLocalAuth = async () => {
      const profile = await getOfflineProfile();
      if (profile) {
        setUser({
          uid: profile.studentId,
          displayName: profile.nickname,
          email: profile.email,
        });
        setIsAuthenticated(true);
      }
      setLoading(false);
    };
    
    checkLocalAuth();
  }, []);

  const loginWithSchool = async (data: SchoolAuthData) => {
    setLoading(true);
    
    // Generate unique student ID
    const studentId = `STU-${data.schoolId}-${Math.floor(Math.random() * 10000)}`;
    
    // Create profile
    const profile: OfflineProfile = {
      nickname: data.nickname,
      email: data.studentEmail,
      studentId,
      rewardsBalance: 0,
      hasPaid: false,
      createdAt: new Date().toISOString(),
      synced: false,
    };
    
    // Save locally first (offline-first)
    await saveOfflineProfile(profile);
    
    // Try to sync to Firebase if online
    if (db) {
      try {
        const profileRef = doc(db, 'users', studentId, 'profile', 'data');
        await setDoc(profileRef, profile);
      } catch (error) {
        console.log('Offline mode - will sync later');
      }
    }
    
    setUser({
      uid: studentId,
      displayName: data.nickname,
      email: data.studentEmail,
    });
    setIsAuthenticated(true);
    setLoading(false);
    
    return { success: true, studentId };
  };

  const changeNickname = async (newNickname: string) => {
    if (!user) return { success: false, error: 'Not authenticated' };
    
    const profile = await getOfflineProfile();
    if (!profile || !profile.hasPaid) {
      return { success: false, error: 'Payment required to change nickname' };
    }
    
    const updatedProfile = {
      ...profile,
      nickname: newNickname,
    };
    
    await saveOfflineProfile(updatedProfile);
    setUser({ ...user, displayName: newNickname });
    
    return { success: true };
  };

  const logout = async () => {
    // Clear local profile
    const database = await initOfflineDB();
    const tx = database.transaction('profile', 'readwrite');
    await tx.store.clear();
    await tx.done;
    
    setUser(null);
    setIsAuthenticated(false);
  };

  return {
    user,
    loading,
    isAuthenticated,
    loginWithSchool,
    changeNickname,
    logout,
  };
}