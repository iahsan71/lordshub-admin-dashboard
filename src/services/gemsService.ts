import { collection, getDocs, query, where, addDoc, doc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '@/config/firebase';
import type { TabName } from '@/components/ui/tabs';
import { toast } from 'react-toastify';

export interface GemItem {
  id: string;
  tabName: string;
  itemName: string;
  quantity: number;
  createdAt: any; // Firestore Timestamp
  imageUrl?: string;
  description?: string;
}

/**
 * Fetch gems/items for a specific tab from Firestore
 * @param tabName - The active tab name to filter by
 * @returns Array of gem items with id and data
 */
export async function getGemsByTab(tabName: TabName): Promise<GemItem[]> {
  try {
    // Reference to the 'gems' collection
    const gemsRef = collection(db, 'gems');
    
    // Create query with where clause
    const q = query(gemsRef, where('tabName', '==', tabName));
    
    // Execute query
    const querySnapshot = await getDocs(q);
    
    // Map documents to array with id + data
    const items: GemItem[] = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    } as GemItem));
    
    return items;
  } catch (error) {
    console.error('Error fetching gems:', error);
    throw error;
  }
}
/**
 * Upload an image to Firebase Storage
 * @param file - The image file to upload
 * @param gemId - The gem document ID
 * @returns The download URL of the uploaded image
 */
export async function uploadGemImage(file: File, gemId: string): Promise<string> {
  try {
    const storageRef = ref(storage, `gems/${gemId}/${file.name}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}

/**
 * Add a new gem item to Firestore
 * @param itemName - Name of the item
 * @param quantity - Quantity of the item
 * @param tabName - The tab/category for the item
 * @param imageFile - Optional image file to upload
 * @returns The ID of the newly created document
 */
export async function addGem(
  itemName: string,
  quantity: number,
  tabName: TabName,
  imageFile?: File
): Promise<string> {
  try {
    const gemsRef = collection(db, 'gems');
    
    const docRef = await addDoc(gemsRef, {
      itemName,
      quantity,
      tabName,
      createdAt: serverTimestamp(),
    });
    
    // Upload image if provided
    if (imageFile) {
      const imageUrl = await uploadGemImage(imageFile, docRef.id);
      await updateDoc(docRef, { imageUrl });
    }
    
    return docRef.id;
  } catch (error) {
    console.error('Error adding gem:', error);
    throw error;
  }
}

/**
 * Update an existing gem item in Firestore
 * @param id - Document ID
 * @param itemName - Updated item name
 * @param quantity - Updated quantity
 * @param imageFile - Optional new image file to upload
 */
export async function updateGem(
  id: string,
  itemName: string,
  quantity: number,
  imageFile?: File
): Promise<void> {
  try {
    const gemRef = doc(db, 'gems', id);
    
    const updateData: any = {
      itemName,
      quantity,
    };
    
    // Upload new image if provided
    if (imageFile) {
      const imageUrl = await uploadGemImage(imageFile, id);
      updateData.imageUrl = imageUrl;
    }
    
    await updateDoc(gemRef, updateData);
  } catch (error) {
    console.error('Error updating gem:', error);
    throw error;
  }
}

/**
 * Delete a gem item from Firestore
 * @param id - Document ID to delete
 */
export async function deleteGem(id: string): Promise<void> {
  try {
    const gemRef = doc(db, 'gems', id);
    await deleteDoc(gemRef);
  } catch (error) {
    console.error('Error deleting gem:', error);
    throw error;
  }
}
