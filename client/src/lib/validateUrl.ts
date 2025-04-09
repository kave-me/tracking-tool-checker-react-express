/**
 * Validates if the given string is a valid URL
 */
export function isValidUrl(url: string): boolean {
  try {
    // If the URL doesn't have a protocol, add https://
    const urlWithProtocol = url.match(/^[a-zA-Z]+:\/\//) ? url : `https://${url}`;
    new URL(urlWithProtocol);
    return true;
  } catch (err) {
    return false;
  }
}
