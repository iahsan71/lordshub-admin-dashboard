/**
 * Utility functions for chat functionality
 */

/**
 * Generate a unique conversation ID for customers
 * This can be used on the customer-facing website
 */
export const generateConversationId = (): string => {
  return `conv_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

/**
 * Get or create a conversation ID from localStorage
 * This ensures customers maintain the same conversation across sessions
 */
export const getOrCreateConversationId = (): string => {
  const storageKey = 'lordshub_conversation_id';
  let conversationId = localStorage.getItem(storageKey);
  
  if (!conversationId) {
    conversationId = generateConversationId();
    localStorage.setItem(storageKey, conversationId);
  }
  
  return conversationId;
};

/**
 * Validate image file before upload
 */
export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
  const maxSize = 2 * 1024 * 1024; // 2MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

  if (file.size > maxSize) {
    return { valid: false, error: 'Image size must be less than 2MB' };
  }

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Only JPG, PNG, GIF, and WEBP images are allowed' };
  }

  return { valid: true };
};

/**
 * Format file size for display
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};
