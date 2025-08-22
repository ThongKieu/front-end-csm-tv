/**
 * Utility functions for copying text to clipboard
 */

/**
 * Copy text to clipboard using modern Clipboard API with fallback
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} - Success status
 */
export const copyToClipboard = async (text) => {
  if (!text) {
    console.error('No text provided to copy');
    return false;
  }

  try {
    // Try modern Clipboard API first
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }

    // Fallback for older browsers or non-secure contexts
    return fallbackCopyToClipboard(text);
  } catch (error) {
    console.error('Error copying to clipboard:', error);
    // Try fallback method
    return fallbackCopyToClipboard(text);
  }
};

/**
 * Fallback method using document.execCommand
 * @param {string} text - Text to copy
 * @returns {boolean} - Success status
 */
const fallbackCopyToClipboard = (text) => {
  try {
    // Create temporary textarea element
    const textArea = document.createElement('textarea');
    textArea.value = text;
    
    // Make it invisible
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    textArea.style.opacity = '0';
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    // Execute copy command
    const successful = document.execCommand('copy');
    
    // Clean up
    document.body.removeChild(textArea);
    
    return successful;
  } catch (error) {
    console.error('Fallback copy method failed:', error);
    return false;
  }
};

/**
 * Copy text with success/error feedback
 * @param {string} text - Text to copy
 * @param {Function} onSuccess - Success callback
 * @param {Function} onError - Error callback
 */
export const copyWithFeedback = async (text, onSuccess, onError) => {
  try {
    const success = await copyToClipboard(text);
    
    if (success && onSuccess) {
      onSuccess();
    } else if (!success && onError) {
      onError();
    }
    
    return success;
  } catch (error) {
    console.error('Error in copyWithFeedback:', error);
    if (onError) {
      onError();
    }
    return false;
  }
};
