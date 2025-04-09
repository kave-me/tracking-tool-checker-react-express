import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email"),
  name: text("name"),
  role: text("role").default("user").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  name: true,
});

export const subscribers = pgTable("subscribers", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertSubscriberSchema = createInsertSchema(subscribers).pick({
  email: true,
});

export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  content: text("content").notNull(),
  date: timestamp("date").defaultNow().notNull(),
  readTime: integer("read_time").notNull(),
  authorId: integer("author_id"),
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
});

export const tagScans = pgTable("tag_scans", {
  id: serial("id").primaryKey(),
  url: text("url").notNull(),
  userId: integer("user_id").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  gtmFound: boolean("gtm_found").default(false).notNull(),
  ga4Found: boolean("ga4_found").default(false).notNull(),
  googleAdsFound: boolean("google_ads_found").default(false).notNull(),
  metaPixelFound: boolean("meta_pixel_found").default(false).notNull(),
});

export const insertTagScanSchema = createInsertSchema(tagScans).pick({
  url: true,
  userId: true,
  gtmFound: true,
  ga4Found: true,
  googleAdsFound: true,
  metaPixelFound: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertSubscriber = z.infer<typeof insertSubscriberSchema>;
export type Subscriber = typeof subscribers.$inferSelect;

export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type BlogPost = typeof blogPosts.$inferSelect;

export type InsertTagScan = z.infer<typeof insertTagScanSchema>;
export type TagScan = typeof tagScans.$inferSelect;
