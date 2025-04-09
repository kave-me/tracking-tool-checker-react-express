/**
 * Validates if the given string is a valid URL
 */
export function isValidUrl(url: string): boolean {
  // Trim the URL to handle leading/trailing spaces
  const trimmedUrl = url.trim();
  
  if (!trimmedUrl) {
    return false;
  }

  // Basic domain pattern, very permissive to allow most user inputs
  const domainPattern = /^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
  
  try {
    // If it already has a protocol, just validate as a URL
    if (trimmedUrl.match(/^[a-zA-Z]+:\/\//)) {
      new URL(trimmedUrl);
      return true;
    }
    
    // If it's just a domain name without protocol
    if (domainPattern.test(trimmedUrl)) {
      return true;
    }
    
    // Try to make it a valid URL and check
    new URL(`https://${trimmedUrl}`);
    return true;
  } catch (err) {
    // If it fails URL parsing, it might still be a valid domain
    // Strip any paths or query parameters and check just the domain
    try {
      const possibleDomain = trimmedUrl.split('/')[0].split('?')[0];
      return domainPattern.test(possibleDomain);
    } catch (err) {
      return false;
    }
  }
}
