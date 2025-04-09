import axios from 'axios';
import { TagResults } from '@shared/types';

/**
 * Checks a given URL for various tracking tags
 */
export async function checkURL(url: string): Promise<TagResults> {
  try {
    // Ensure URL has protocol
    const formattedUrl = url.startsWith('http') ? url : `https://${url}`;
    
    // Fetch the webpage content
    const response = await axios.get(formattedUrl, {
      timeout: 10000, // 10 second timeout
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    });
    
    const html = response.data;
    
    // Initialize results object
    const results: TagResults = {
      url: formattedUrl,
      gtm: { found: false },
      ga4: { found: false },
      googleAds: { found: false },
      metaPixel: { found: false }
    };
    
    // Check for Google Tag Manager
    const gtmHeadRegex = /<script\b[^>]*>([\s\S]*?)googletagmanager\.com\/gtm\.js([\s\S]*?)<\/script>/i;
    const gtmBodyRegex = /<noscript\b[^>]*>([\s\S]*?)googletagmanager\.com\/ns\.html([\s\S]*?)<\/noscript>/i;
    
    if (gtmHeadRegex.test(html)) {
      results.gtm.found = true;
      results.gtm.location = 'head';
      
      // Try to extract GTM ID
      const gtmIdMatch = html.match(/GTM-[A-Z0-9]+/i);
      if (gtmIdMatch) {
        results.gtm.id = gtmIdMatch[0];
      }
    } else if (gtmBodyRegex.test(html)) {
      results.gtm.found = true;
      results.gtm.location = 'body';
      
      // Try to extract GTM ID
      const gtmIdMatch = html.match(/GTM-[A-Z0-9]+/i);
      if (gtmIdMatch) {
        results.gtm.id = gtmIdMatch[0];
      }
    }
    
    // Check for Google Analytics 4
    const ga4Regex = /gtag\('config',\s*['"]G-[A-Z0-9]+['"]/i;
    const ga4RegexAlt = /googletagmanager\.com.*?id=G-[A-Z0-9]+/i;
    
    if (ga4Regex.test(html) || ga4RegexAlt.test(html)) {
      results.ga4.found = true;
      results.ga4.location = 'head';
      
      // Try to extract GA4 Measurement ID
      const ga4IdMatch = html.match(/G-[A-Z0-9]+/i);
      if (ga4IdMatch) {
        results.ga4.id = ga4IdMatch[0];
      }
    }
    
    // Check for Google Ads conversion tracking
    const googleAdsRegex = /gtag\('config',\s*['"]AW-[0-9]+['"]/i;
    const googleAdsRegexAlt = /googleadservices\.com\/pagead\/conversion/i;
    
    if (googleAdsRegex.test(html) || googleAdsRegexAlt.test(html)) {
      results.googleAds.found = true;
      results.googleAds.location = 'head';
      
      // Try to extract Google Ads ID
      const adsIdMatch = html.match(/AW-[0-9]+/i);
      if (adsIdMatch) {
        results.googleAds.id = adsIdMatch[0];
      }
    }
    
    // Check for Meta Pixel
    const metaPixelRegex = /connect\.facebook\.net\/en_US\/fbevents\.js/i;
    const metaPixelRegexAlt = /fbq\('init',\s*['"][0-9]+['"]/i;
    
    if (metaPixelRegex.test(html) || metaPixelRegexAlt.test(html)) {
      results.metaPixel.found = true;
      results.metaPixel.location = 'head';
      
      // Try to extract Meta Pixel ID
      const pixelIdMatch = html.match(/fbq\('init',\s*['"]([0-9]+)['"]/i);
      if (pixelIdMatch && pixelIdMatch[1]) {
        results.metaPixel.id = pixelIdMatch[1];
      }
    }
    
    return results;
  } catch (error) {
    // Handle request errors
    if (axios.isAxiosError(error)) {
      throw new Error(`Failed to fetch website: ${error.message}`);
    }
    throw error;
  }
}
