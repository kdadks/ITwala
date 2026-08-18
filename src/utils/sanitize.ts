import sanitizeHtml from 'sanitize-html';

export function sanitizeText(input: string): string {
  return sanitizeHtml(input, {
    allowedTags: [],
    allowedAttributes: {},
    disallowedTagsMode: 'escape'
  });
}

export function sanitizeHtmlRich(input: string): string {
  return sanitizeHtml(input, {
    allowedTags: ['b', 'i', 'em', 'strong', 'a', 'br', 'p', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    allowedAttributes: {
      a: ['href', 'title']
    },
    allowedSchemes: ['http', 'https', 'mailto']
  });
}

export function sanitizeEmail(input: string): string {
  return sanitizeHtml(input, {
    allowedTags: [],
    allowedAttributes: {}
  });
}
