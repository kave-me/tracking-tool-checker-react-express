import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { checkURL } from "./services/tagDetector";
import { insertSubscriberSchema, insertBlogPostSchema, insertTagScanSchema } from "@shared/schema";
import { z } from "zod";
import { setupAuth } from "./auth";

// Middleware to ensure user is authenticated
function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: "Not authenticated" });
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes
  setupAuth(app);
  
  // API routes for tag checking
  app.post("/api/check-tags", async (req, res) => {
    try {
      const { url } = req.body;
      
      if (!url || typeof url !== "string") {
        return res.status(400).json({ error: "URL is required" });
      }
      
      // Validate URL format
      try {
        new URL(url.startsWith('http') ? url : `https://${url}`);
      } catch (error) {
        return res.status(400).json({ error: "Invalid URL format" });
      }
      
      // Check for tracking tags
      try {
        const results = await checkURL(url);
        
        // If user is authenticated, save the scan to their history
        if (req.isAuthenticated() && req.user) {
          const scanData = {
            url: results.url,
            userId: req.user.id,
            gtmFound: results.gtm.found,
            ga4Found: results.ga4.found,
            googleAdsFound: results.googleAds.found,
            metaPixelFound: results.metaPixel.found
          };
          
          try {
            await storage.createTagScan(scanData);
          } catch (err) {
            console.error("Failed to save scan history:", err);
            // Continue anyway, don't fail the request
          }
        }
        
        return res.json(results);
      } catch (error) {
        console.error("Error checking URL:", error);
        return res.status(500).json({ 
          error: "Failed to check website for tracking tags", 
          details: (error as Error).message 
        });
      }
    } catch (error) {
      console.error("Error processing request:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  // API routes for subscribers
  app.post("/api/subscribe", async (req, res) => {
    try {
      const validatedData = insertSubscriberSchema.parse(req.body);
      
      const subscriber = await storage.createSubscriber(validatedData);
      return res.status(201).json({ success: true, email: subscriber.email });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid email address" });
      }
      
      console.error("Error creating subscriber:", error);
      return res.status(500).json({ error: "Failed to save subscription" });
    }
  });

  // API routes for blog posts
  app.get("/api/blog-posts", async (req, res) => {
    try {
      const blogPosts = await storage.getAllBlogPosts();
      return res.json(blogPosts);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      return res.status(500).json({ error: "Failed to fetch blog posts" });
    }
  });

  app.get("/api/blog-posts/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      
      const blogPost = await storage.getBlogPost(slug);
      
      if (!blogPost) {
        return res.status(404).json({ error: "Blog post not found" });
      }
      
      return res.json(blogPost);
    } catch (error) {
      console.error("Error fetching blog post:", error);
      return res.status(500).json({ error: "Failed to fetch blog post" });
    }
  });

  // Protected route for creating blog posts
  app.post("/api/blog-posts", ensureAuthenticated, async (req, res) => {
    try {
      // Only admins can create blog posts - check admin role
      if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ error: "Unauthorized: Admin rights required" });
      }
      
      const validatedData = insertBlogPostSchema.parse(req.body);
      
      // Check if slug already exists
      const existingPost = await storage.getBlogPost(validatedData.slug);
      if (existingPost) {
        return res.status(409).json({ error: "Blog post with this slug already exists" });
      }
      
      const blogPost = await storage.createBlogPost(validatedData);
      return res.status(201).json(blogPost);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          error: "Invalid blog post data", 
          details: error.errors 
        });
      }
      
      console.error("Error creating blog post:", error);
      return res.status(500).json({ error: "Failed to create blog post" });
    }
  });

  // Dashboard-related API routes
  app.get("/api/dashboard/scans", ensureAuthenticated, async (req, res) => {
    try {
      const userScans = await storage.getUserScans(req.user!.id);
      return res.json(userScans);
    } catch (error) {
      console.error("Error fetching user scans:", error);
      return res.status(500).json({ error: "Failed to fetch scan history" });
    }
  });
  
  app.get("/api/dashboard/stats", ensureAuthenticated, async (req, res) => {
    try {
      const userScans = await storage.getUserScans(req.user!.id);
      
      // Calculate stats from the user's scans
      const stats = {
        totalScans: userScans.length,
        uniqueWebsites: new Set(userScans.map(scan => scan.url)).size,
        tagsFound: {
          gtm: userScans.filter(scan => scan.gtmFound).length,
          ga4: userScans.filter(scan => scan.ga4Found).length,
          googleAds: userScans.filter(scan => scan.googleAdsFound).length,
          metaPixel: userScans.filter(scan => scan.metaPixelFound).length
        },
        recentScans: userScans.slice(-5) // Most recent 5 scans
      };
      
      return res.json(stats);
    } catch (error) {
      console.error("Error fetching user stats:", error);
      return res.status(500).json({ error: "Failed to fetch dashboard statistics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
