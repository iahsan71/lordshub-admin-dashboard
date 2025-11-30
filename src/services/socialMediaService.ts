import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/config/firebase';

export interface SocialMediaLinks {
  id: string;
  facebook: string;
  instagram: string;
  discord: string;
  telegram: string;
  twitter: string;
  whatsapp: string;
  line: string;
  email: string;
  createdAt: any;
  updatedAt: any;
}

export interface SocialMediaLinksInput {
  facebook: string;
  instagram: string;
  discord: string;
  telegram: string;
  twitter: string;
  whatsapp: string;
  line: string;
  email: string;
}

/**
 * Fetch all social media links from Firestore
 * @returns Array of social media link documents
 */
export async function getSocialMediaLinks(): Promise<SocialMediaLinks[]> {
  try {
    const linksRef = collection(db, 'social_media_links');
    const querySnapshot = await getDocs(linksRef);
    
    const links: SocialMediaLinks[] = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    } as SocialMediaLinks));
    
    return links;
  } catch (error) {
    console.error('Error fetching social media links:', error);
    throw error;
  }
}

/**
 * Add new social media links to Firestore
 * @param data - Social media links data
 * @returns The ID of the newly created document
 */
export async function addSocialMediaLinks(data: SocialMediaLinksInput): Promise<string> {
  try {
    const linksRef = collection(db, 'social_media_links');
    
    const docRef = await addDoc(linksRef, {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error adding social media links:', error);
    throw error;
  }
}

/**
 * Update existing social media links in Firestore
 * @param id - Document ID
 * @param data - Updated social media links data
 */
export async function updateSocialMediaLinks(id: string, data: SocialMediaLinksInput): Promise<void> {
  try {
    const linkRef = doc(db, 'social_media_links', id);
    
    await updateDoc(linkRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating social media links:', error);
    throw error;
  }
}

/**
 * Delete social media links from Firestore
 * @param id - Document ID to delete
 */
export async function deleteSocialMediaLinks(id: string): Promise<void> {
  try {
    const linkRef = doc(db, 'social_media_links', id);
    await deleteDoc(linkRef);
  } catch (error) {
    console.error('Error deleting social media links:', error);
    throw error;
  }
}