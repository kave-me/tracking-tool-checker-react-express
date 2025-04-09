import { apiRequest } from './queryClient';
import { TagResults } from '@shared/types';

/**
 * Check a website for tracking tags
 */
export async function checkWebsiteForTags(url: string): Promise<TagResults> {
  const response = await apiRequest('POST', '/api/check-tags', { url });
  return response.json();
}

/**
 * Subscribe user to newsletter
 */
export async function subscribeToNewsletter(email: string): Promise<{ success: boolean }> {
  const response = await apiRequest('POST', '/api/subscribe', { email });
  return response.json();
}
