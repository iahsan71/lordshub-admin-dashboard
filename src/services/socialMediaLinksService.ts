import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/config/firebase';

export interface SocialMediaLink {
  id: string;
  platform: string;
  url: string;
  createdAt: any; // Firestore Timestamp
  updatedAt: any; // Firestore Timestamp
}

export interface SocialMediaLinkPayload {
  platform: string;
  url: string;
}

/**
 * Fetch all social media links from Firestore
 * @returns Array of social media links with id and data
 */
export async function getSocialMediaLinks(): Promise<SocialMediaLink[]> {
  try {
    const linksRef = collection(db, 'socialMediaLinks');
    const querySnapshot = await getDocs(linksRef);
    
    const links: SocialMediaLink[] = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as SocialMediaLink));
    
    return links;
  } catch (error) {
    console.error('Error fetching social media links:', error);
    throw new Error('Failed to fetch social media links. Please try again.');
  }
}

/**
 * Add a new social media link to Firestore
 * @param payload - Object containing platform and url
 * @returns The ID of the newly created document
 */
export async function addSocialMediaLink(
  payload: SocialMediaLinkPayload
): Promise<string> {
  try {
    const { platform, url } = payload;
    
    if (!platform || !url) {
      throw new Error('Platform and URL are required.');
    }
    
    const linksRef = collection(db, 'socialMediaLinks');
    
    const docRef = await addDoc(linksRef, {
      platform,
      url,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error adding social media link:', error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Failed to add social media link. Please try again.');
  }
}

/**
 * Update an existing social media link in Firestore
 * @param id - Document ID
 * @param payload - Object containing platform and url
 */
export async function updateSocialMediaLink(
  id: string,
  payload: SocialMediaLinkPayload
): Promise<void> {
  try {
    const { platform, url } = payload;
    
    if (!id) {
      throw new Error('Document ID is required.');
    }
    
    if (!platform || !url) {
      throw new Error('Platform and URL are required.');
    }
    
    const linkRef = doc(db, 'socialMediaLinks', id);
    
    await updateDoc(linkRef, {
      platform,
      url,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating social media link:', error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Failed to update social media link. Please try again.');
  }
}

/**
 * Delete a social media link from Firestore
 * @param id - Document ID to delete
 */
export async function deleteSocialMediaLink(id: string): Promise<void> {
  try {
    if (!id) {
      throw new Error('Document ID is required.');
    }
    
    const linkRef = doc(db, 'socialMediaLinks', id);
    await deleteDoc(linkRef);
  } catch (error) {
    console.error('Error deleting social media link:', error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Failed to delete social media link. Please try again.');
  }
}
