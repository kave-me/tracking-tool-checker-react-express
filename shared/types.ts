export interface TagDetectionResult {
  found: boolean;
  location?: string;
  id?: string;
}

export interface TagResults {
  url: string;
  gtm: TagDetectionResult;
  ga4: TagDetectionResult;
  googleAds: TagDetectionResult;
  metaPixel: TagDetectionResult;
  error?: string;
}

export interface BlogPostSummary {
  id: number;
  slug: string;
  title: string;
  description: string;
  date: string;
  readTime: number;
}

export interface BlogPostFull extends BlogPostSummary {
  content: string;
}
