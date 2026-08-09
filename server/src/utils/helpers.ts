import sanitizeHtml from 'sanitize-html';

export const calculateReadingTime = (content: string): number => {
  const wordsPerMinute = 200;
  const cleanText = content.replace(/<[^>]*>/g, '').trim();
  const wordCount = cleanText ? cleanText.split(/\s+/).length : 0;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
};

export const slugify = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

export const sanitizeString = (text: string): string => {
  return sanitizeHtml(text, {
    allowedTags: [
      'b', 'i', 'em', 'strong', 'a', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'blockquote', 'code', 'pre', 'hr', 'br', 'img', 'span',
      'table', 'thead', 'tbody', 'tr', 'th', 'td'
    ],
    allowedAttributes: {
      'a': ['href', 'title', 'target', 'rel'],
      'img': ['src', 'alt', 'title', 'width', 'height']
    },
    allowedSchemes: ['http', 'https', 'data']
  });
};
