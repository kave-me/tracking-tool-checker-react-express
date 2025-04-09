import { users, subscribers, blogPosts, tagScans, type User, type InsertUser, type Subscriber, type InsertSubscriber, type BlogPost, type InsertBlogPost, type TagScan, type InsertTagScan } from "@shared/schema";
import { db } from "./db";
import { eq, sql } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  setResetToken(userId: number, token: string, expiry: Date): Promise<void>;
  getUserByResetToken(token: string): Promise<User | undefined>;
  resetPassword(userId: number, newPassword: string): Promise<void>;
  
  // Blog post methods
  getBlogPost(slug: string): Promise<BlogPost | undefined>;
  getAllBlogPosts(): Promise<BlogPost[]>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  
  // Subscriber methods
  createSubscriber(subscriber: InsertSubscriber): Promise<Subscriber>;
  
  // Tag scan methods
  createTagScan(scan: InsertTagScan): Promise<TagScan>;
  getUserScans(userId: number): Promise<TagScan[]>;
  getRecentScans(limit?: number): Promise<TagScan[]>;
  
  // Session store
  sessionStore: any; // Type for session.Store
}

const PostgresSessionStore = connectPg(session);

export class DatabaseStorage implements IStorage {
  sessionStore: any; // Type for session.Store
  
  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      createTableIfMissing: true 
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }
  
  async setResetToken(userId: number, token: string, expiry: Date): Promise<void> {
    await db
      .update(users)
      .set({
        resetToken: token,
        resetTokenExpiry: expiry
      })
      .where(eq(users.id, userId));
  }
  
  async getUserByResetToken(token: string): Promise<User | undefined> {
    // Query using a single where clause with AND condition
    const [user] = await db
      .select()
      .from(users)
      .where(
        sql`${users.resetToken} = ${token} AND ${users.resetTokenExpiry} > NOW()`
      );
    return user;
  }
  
  async resetPassword(userId: number, newPassword: string): Promise<void> {
    await db
      .update(users)
      .set({
        password: newPassword,
        resetToken: null,
        resetTokenExpiry: null
      })
      .where(eq(users.id, userId));
  }
  
  // Blog post methods
  async getBlogPost(slug: string): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug));
    return post;
  }
  
  async getAllBlogPosts(): Promise<BlogPost[]> {
    return db.select().from(blogPosts).orderBy(blogPosts.date);
  }
  
  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const [newPost] = await db
      .insert(blogPosts)
      .values(post)
      .returning();
    return newPost;
  }
  
  // Subscriber methods
  async createSubscriber(subscriber: InsertSubscriber): Promise<Subscriber> {
    const [newSubscriber] = await db
      .insert(subscribers)
      .values(subscriber)
      .returning();
    return newSubscriber;
  }
  
  // Tag scan methods
  async createTagScan(scan: InsertTagScan): Promise<TagScan> {
    const [newScan] = await db
      .insert(tagScans)
      .values(scan)
      .returning();
    return newScan;
  }
  
  async getUserScans(userId: number): Promise<TagScan[]> {
    return db.select().from(tagScans).where(eq(tagScans.userId, userId)).orderBy(tagScans.timestamp);
  }
  
  async getRecentScans(limit: number = 10): Promise<TagScan[]> {
    return db.select().from(tagScans).orderBy(tagScans.timestamp).limit(limit);
  }
}

export const storage = new DatabaseStorage();
