import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { checkURL } from "./services/tagDetector";
import { insertSubscriberSchema, insertBlogPostSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes for tag checking
  app.post("/api/check-tags", async (req, res) => {
    try {
      const { url } = req.body;
      
      if (!url || typeof url !== "string") {
        return res.status(400).json({ error: "URL is required" });
      }
      
      // Validate URL format
      try {
        new URL(url);
      } catch (error) {
        return res.status(400).json({ error: "Invalid URL format" });
      }
      
      // Check for tracking tags
      try {
        const results = await checkURL(url);
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
      
      // Check if email already exists
      const existingSubscriber = await storage.getSubscriberByEmail(validatedData.email);
      if (existingSubscriber) {
        return res.status(409).json({ error: "Email already subscribed" });
      }
      
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
      
      const blogPost = await storage.getBlogPostBySlug(slug);
      
      if (!blogPost) {
        return res.status(404).json({ error: "Blog post not found" });
      }
      
      return res.json(blogPost);
    } catch (error) {
      console.error("Error fetching blog post:", error);
      return res.status(500).json({ error: "Failed to fetch blog post" });
    }
  });

  // For admin or CMS to create blog posts (in real implementation would have auth)
  app.post("/api/blog-posts", async (req, res) => {
    try {
      const validatedData = insertBlogPostSchema.parse(req.body);
      
      // Check if slug already exists
      const existingPost = await storage.getBlogPostBySlug(validatedData.slug);
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

  const httpServer = createServer(app);
  return httpServer;
}
