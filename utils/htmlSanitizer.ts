import DOMPurify from 'dompurify';

// Configuration for DOMPurify to allow safe HTML formatting
const ALLOWED_TAGS = [
  'p', 'br', 'strong', 'b', 'em', 'i', 'u', 'ul', 'ol', 'li', 'a', 'div', 'span'
];

const ALLOWED_ATTRIBUTES = {
  'a': ['href', 'title', 'target'],
  '*': ['class', 'style'] // Allow class and limited style attributes for indentation
};

// Sanitize HTML content for safe rendering
export const sanitizeHtml = (html: string): string => {
  if (!html) return '';

  // Pre-process to preserve indentation patterns
  let processedHtml = html
    // Convert margin-left styles to classes for better control
    .replace(/style="[^"]*margin-left:\s*(\d+)px[^"]*"/gi, (match, pixels) => {
      const indent = Math.floor(parseInt(pixels) / 20) * 20; // Round to nearest 20px
      return `class="indent-${indent}"`;
    })
    // Convert padding-left styles to classes
    .replace(/style="[^"]*padding-left:\s*(\d+)px[^"]*"/gi, (match, pixels) => {
      const indent = Math.floor(parseInt(pixels) / 20) * 20; // Round to nearest 20px
      return `class="indent-${indent}"`;
    })
    // Preserve bullet points and numbered lists
    .replace(/<p[^>]*>\s*•\s*/gi, '<p class="bullet-item">• ')
    .replace(/<p[^>]*>\s*(\d+\.)\s*/gi, '<p class="numbered-item">$1 ');

  return DOMPurify.sanitize(processedHtml, {
    ALLOWED_TAGS,
    ALLOWED_ATTR: {
      ...ALLOWED_ATTRIBUTES,
      '*': ['class'],
      'p': ['class', 'style'],
      'div': ['class', 'style']
    },
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

  // Convert plain text to HTML preserving indentation and formatting
  return text
    .split('\n')
    .map(line => {
      if (!line.trim()) return '<br>'; // Empty lines become breaks

      // Detect indentation (leading spaces/tabs)
      const leadingSpaces = line.length - line.trimStart().length;
      const trimmed = line.trim();

      // Handle bullet points
      if (trimmed.startsWith('•') || trimmed.startsWith('-')) {
        const indentClass = leadingSpaces > 0 ? ` indent-${Math.min(leadingSpaces * 5, 80)}` : '';
        return `<p class="bullet-item${indentClass}">${trimmed}</p>`;
      }

      // Handle numbered items
      if (/^\d+\./.test(trimmed)) {
        const indentClass = leadingSpaces > 0 ? ` indent-${Math.min(leadingSpaces * 5, 80)}` : '';
        return `<p class="numbered-item${indentClass}">${trimmed}</p>`;
      }

      // Handle regular indented text
      if (leadingSpaces > 0) {
        const indentClass = leadingSpaces > 4 ? 'indent-deep' : 'indent-normal';
        return `<p class="${indentClass}">${trimmed}</p>`;
      }

      // Regular paragraph
      return `<p>${trimmed}</p>`;
    })
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
