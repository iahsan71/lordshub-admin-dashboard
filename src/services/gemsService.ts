import { collection, getDocs, query, where, addDoc, doc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/config/firebase';
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

 * Add a new gem item to Firestore
 * @param itemName - Name of the item
 * @param quantity - Quantity of the item
 * @param tabName - The tab/category for the item
 * @returns The ID of the newly created document
 */
export async function addGem(
  itemName: string,
  quantity: number,
  tabName: TabName
): Promise<string> {
  try {
    const gemsRef = collection(db, 'gems');
    
    const docRef = await addDoc(gemsRef, {
      itemName,
      quantity,
      tabName,
      createdAt: serverTimestamp(),
    });
    
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
 */
export async function updateGem(
  id: string,
  itemName: string,
  quantity: number
): Promise<void> {
  try {
    const gemRef = doc(db, 'gems', id);
    
    await updateDoc(gemRef, {
      itemName,
      quantity,
    });
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
