import DOMPurify from 'dompurify';

// Configuration for DOMPurify to allow safe HTML formatting
const ALLOWED_TAGS = [
  'p', 'br', 'strong', 'b', 'em', 'i', 'u', 'ul', 'ol', 'li', 'a'
];

const ALLOWED_ATTRIBUTES = {
  'a': ['href', 'title', 'target'],
  '*': ['class'] // Allow class attributes for styling
};

// Sanitize HTML content for safe rendering
export const sanitizeHtml = (html: string): string => {
  if (!html) return '';
  
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR: ALLOWED_ATTRIBUTES,
    ALLOW_DATA_ATTR: false,
    FORBID_SCRIPT: true,
    FORBID_TAGS: ['script', 'object', 'embed', 'form', 'input'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover']
  });
};

// Convert plain text to HTML (for backward compatibility)
export const textToHtml = (text: string): string => {
  if (!text) return '';
  
  // If the text already contains HTML tags, assume it's already HTML
  if (/<[^>]+>/.test(text)) {
    return sanitizeHtml(text);
  }
  
  // Convert plain text to HTML with line breaks
  return text
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .map(line => `<p>${line}</p>`)
    .join('');
};

// Extract plain text from HTML (for character counting, etc.)
export const htmlToText = (html: string): string => {
  if (!html) return '';
  
  // Create a temporary div to extract text content
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = sanitizeHtml(html);
  return tempDiv.textContent || tempDiv.innerText || '';
};

// Check if content contains HTML formatting
export const isHtmlContent = (content: string): boolean => {
  return /<[^>]+>/.test(content);
};
