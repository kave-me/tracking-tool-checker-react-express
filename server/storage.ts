import { 
  users, type User, type InsertUser,
  subscribers, type Subscriber, type InsertSubscriber,
  blogPosts, type BlogPost, type InsertBlogPost,
  tagScans, type TagScan, type InsertTagScan
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Subscriber methods
  getSubscriberByEmail(email: string): Promise<Subscriber | undefined>;
  createSubscriber(subscriber: InsertSubscriber): Promise<Subscriber>;
  
  // BlogPost methods
  getAllBlogPosts(): Promise<BlogPost[]>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  createBlogPost(blogPost: InsertBlogPost): Promise<BlogPost>;
  
  // TagScan methods
  createTagScan(tagScan: InsertTagScan): Promise<TagScan>;
  getRecentTagScans(limit?: number): Promise<TagScan[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private subscribers: Map<number, Subscriber>;
  private blogPosts: Map<number, BlogPost>;
  private tagScans: Map<number, TagScan>;
  
  private userIdCounter: number;
  private subscriberIdCounter: number;
  private blogPostIdCounter: number;
  private tagScanIdCounter: number;

  constructor() {
    this.users = new Map();
    this.subscribers = new Map();
    this.blogPosts = new Map();
    this.tagScans = new Map();
    
    this.userIdCounter = 1;
    this.subscriberIdCounter = 1;
    this.blogPostIdCounter = 1;
    this.tagScanIdCounter = 1;
    
    // Initialize with example blog posts
    this.initializeExampleBlogPosts();
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Subscriber methods
  async getSubscriberByEmail(email: string): Promise<Subscriber | undefined> {
    return Array.from(this.subscribers.values()).find(
      (subscriber) => subscriber.email === email,
    );
  }
  
  async createSubscriber(insertSubscriber: InsertSubscriber): Promise<Subscriber> {
    const id = this.subscriberIdCounter++;
    const subscriber: Subscriber = { 
      ...insertSubscriber, 
      id, 
      createdAt: new Date() 
    };
    this.subscribers.set(id, subscriber);
    return subscriber;
  }
  
  // BlogPost methods
  async getAllBlogPosts(): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values())
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }
  
  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    return Array.from(this.blogPosts.values()).find(
      (post) => post.slug === slug,
    );
  }
  
  async createBlogPost(insertBlogPost: InsertBlogPost): Promise<BlogPost> {
    const id = this.blogPostIdCounter++;
    const blogPost: BlogPost = {
      ...insertBlogPost,
      id,
      date: insertBlogPost.date || new Date()
    };
    this.blogPosts.set(id, blogPost);
    return blogPost;
  }
  
  // TagScan methods
  async createTagScan(insertTagScan: InsertTagScan): Promise<TagScan> {
    const id = this.tagScanIdCounter++;
    const tagScan: TagScan = {
      ...insertTagScan,
      id,
      scannedAt: new Date()
    };
    this.tagScans.set(id, tagScan);
    return tagScan;
  }
  
  async getRecentTagScans(limit: number = 10): Promise<TagScan[]> {
    return Array.from(this.tagScans.values())
      .sort((a, b) => b.scannedAt.getTime() - a.scannedAt.getTime())
      .slice(0, limit);
  }
  
  private initializeExampleBlogPosts() {
    // Google Tag Manager Setup Guide
    this.createBlogPost({
      slug: "how-to-set-up-google-tag-manager",
      title: "How to Set Up Google Tag Manager",
      description: "A step-by-step guide to installing and configuring Google Tag Manager on your website for better tracking.",
      content: `
        <h2>Introduction to Google Tag Manager</h2>
        <p>Google Tag Manager (GTM) is a free tag management system from Google that allows you to quickly and easily update tracking codes and related code fragments collectively known as "tags" on your website or mobile app. Once a small segment of GTM code is added to your site, you can deploy and modify measurement code from the user interface without having to alter your website's code.</p>
        
        <h2>Why Use Google Tag Manager?</h2>
        <ul>
          <li><strong>Streamlined Tag Management:</strong> Manage all your analytics and marketing tags from a single interface</li>
          <li><strong>No Coding Required:</strong> Add or update tags without modifying your website's code</li>
          <li><strong>Version Control:</strong> Track changes and roll back when needed</li>
          <li><strong>Rapid Deployment:</strong> Changes go live immediately after publishing</li>
          <li><strong>Advanced Features:</strong> Use triggers, variables, and custom HTML tags for complex tracking needs</li>
        </ul>
        
        <h2>Step 1: Create a Google Tag Manager Account</h2>
        <ol>
          <li>Visit <a href="https://tagmanager.google.com/" target="_blank">https://tagmanager.google.com/</a></li>
          <li>Sign in with your Google account</li>
          <li>Click "Create Account"</li>
          <li>Enter an account name (typically your company name)</li>
          <li>Enter a container name (typically your website's name)</li>
          <li>Select "Web" as the target platform</li>
          <li>Click "Create"</li>
          <li>Accept the Terms of Service</li>
        </ol>
        
        <h2>Step 2: Install the GTM Code on Your Website</h2>
        <p>After creating your account, GTM will provide you with two code snippets:</p>
        
        <p><strong>Snippet 1:</strong> This goes in the <code>&lt;head&gt;</code> of your HTML, as high as possible:</p>
        <pre><code>&lt;!-- Google Tag Manager --&gt;
&lt;script&gt;(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&'+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-XXXX');&lt;/script&gt;
&lt;!-- End Google Tag Manager --&gt;</code></pre>
        
        <p><strong>Snippet 2:</strong> This goes immediately after the opening <code>&lt;body&gt;</code> tag:</p>
        <pre><code>&lt;!-- Google Tag Manager (noscript) --&gt;
&lt;noscript&gt;&lt;iframe src="https://www.googletagmanager.com/ns.html?id=GTM-XXXX"
height="0" width="0" style="display:none;visibility:hidden"&gt;&lt;/iframe&gt;&lt;/noscript&gt;
&lt;!-- End Google Tag Manager (noscript) --&gt;</code></pre>
        
        <p><em>Note: Replace GTM-XXXX with your actual GTM container ID that Google provides.</em></p>
        
        <h2>Step 3: Verify Installation</h2>
        <ol>
          <li>Once you've added both code snippets to your website, open your site in a web browser</li>
          <li>Install the <a href="https://chrome.google.com/webstore/detail/tag-assistant-by-google/kejbdjndbnbjgmefkgdddjlbokphdefk" target="_blank">Google Tag Assistant</a> Chrome extension</li>
          <li>Navigate to your website and click on the Tag Assistant icon</li>
          <li>Click "Enable" and refresh the page</li>
          <li>Tag Assistant should show a green indicator for Google Tag Manager if it's installed correctly</li>
        </ol>
        
        <h2>Step 4: Create Your First Tag</h2>
        <p>Let's add Google Analytics as our first tag:</p>
        <ol>
          <li>In GTM, click "Tags" from the left navigation</li>
          <li>Click "New" button</li>
          <li>Click "Tag Configuration" and select "Google Analytics: GA4 Configuration"</li>
          <li>Enter your Measurement ID (G-XXXXXXXX)</li>
          <li>Under "Triggering", select "All Pages"</li>
          <li>Name your tag (e.g., "GA4 Configuration")</li>
          <li>Click "Save"</li>
        </ol>
        
        <h2>Step 5: Publish Your Container</h2>
        <ol>
          <li>After creating your tag(s), click the "Submit" button in the top right corner</li>
          <li>Enter a version name and description for your changes</li>
          <li>Click "Publish"</li>
        </ol>
        
        <h2>Step 6: Test Your Setup</h2>
        <p>To ensure your tags are firing correctly:</p>
        <ol>
          <li>Enter Preview mode by clicking the "Preview" button in GTM</li>
          <li>Enter your website URL and click "Start"</li>
          <li>Your website will open in a new tab with a debugging console at the bottom</li>
          <li>Verify that your tags are firing on the appropriate triggers</li>
        </ol>
        
        <h2>Next Steps</h2>
        <p>After successfully setting up Google Tag Manager, consider implementing these additional tags:</p>
        <ul>
          <li>Event tracking for clicks, form submissions, video plays, etc.</li>
          <li>Conversion tracking for Google Ads</li>
          <li>Facebook Pixel for Meta advertising</li>
          <li>Custom HTML tags for other marketing or analytics tools</li>
        </ul>
        
        <p>For more information, visit the <a href="https://support.google.com/tagmanager#topic=3441530" target="_blank">official Google Tag Manager documentation</a>.</p>
      `,
      date: new Date("2023-01-15"),
      readTime: 8
    });
    
    // Google Analytics 4 (GA4) Migration Guide
    this.createBlogPost({
      slug: "migrating-from-universal-analytics-to-ga4",
      title: "Migrating from Universal Analytics to GA4",
      description: "Everything you need to know about transitioning to Google Analytics 4 before Universal Analytics stops working.",
      content: `
        <h2>Why Migrate to Google Analytics 4?</h2>
        <p>Google is phasing out Universal Analytics (UA), with standard UA properties stopping data collection on July 1, 2023. Google Analytics 4 (GA4) is the next generation of Google Analytics with significant changes in data structure, collection methods, and analysis capabilities.</p>
        
        <p>Key benefits of GA4 include:</p>
        <ul>
          <li>Better privacy controls and data collection without cookies</li>
          <li>Cross-platform tracking between web and apps</li>
          <li>Event-based tracking instead of session-based</li>
          <li>AI-powered insights and predictions</li>
          <li>Better integration with Google Ads</li>
        </ul>
        
        <h2>Step 1: Create a New GA4 Property</h2>
        <ol>
          <li>Sign in to <a href="https://analytics.google.com/" target="_blank">Google Analytics</a></li>
          <li>Click "Admin" in the bottom left corner</li>
          <li>In the Account column, select the account that contains your Universal Analytics property</li>
          <li>In the Property column, click "Create Property"</li>
          <li>Select "Web" as your platform</li>
          <li>Enter your website URL and name for the property</li>
          <li>Click "Create" to complete the setup</li>
        </ol>
        
        <h2>Step 2: Add the GA4 Tag to Your Website</h2>
        <p>You have two options to add GA4 to your site:</p>
        
        <h3>Option A: Using Google Tag Manager (Recommended)</h3>
        <ol>
          <li>Log in to <a href="https://tagmanager.google.com/" target="_blank">Google Tag Manager</a></li>
          <li>Select your container</li>
          <li>Click "Tags" in the left menu</li>
          <li>Click "New" to create a new tag</li>
          <li>Click "Tag Configuration" and select "Google Analytics: GA4 Configuration"</li>
          <li>Enter your Measurement ID (format: G-XXXXXXXX)</li>
          <li>Under "Triggering", select "All Pages"</li>
          <li>Name your tag (e.g., "GA4 Configuration")</li>
          <li>Click "Save" and then "Submit" to publish the changes</li>
        </ol>
        
        <h3>Option B: Direct Implementation</h3>
        <p>If you're not using GTM, add this code to your website's <code>&lt;head&gt;</code> section:</p>
        <pre><code>&lt;!-- Global site tag (gtag.js) - Google Analytics --&gt;
&lt;script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXX"&gt;&lt;/script&gt;
&lt;script&gt;
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-XXXXXXXX');
&lt;/script&gt;</code></pre>
        <p><em>Note: Replace G-XXXXXXXX with your actual GA4 Measurement ID.</em></p>
        
        <h2>Step 3: Configure Basic Settings</h2>
        <ol>
          <li>In GA4, go to Admin > Data Streams and select your web stream</li>
          <li>Enable enhanced measurement features you want to track automatically (page views, scrolls, outbound clicks, site search, etc.)</li>
          <li>Go to Admin > Data Settings > Data Collection to configure Google signals and other data collection features</li>
          <li>Set up User-ID tracking if applicable (Admin > Property Settings > User-ID)</li>
        </ol>
        
        <h2>Step 4: Set Up Conversion Events</h2>
        <p>GA4 uses an event-based model, so you'll need to define your key conversion events:</p>
        <ol>
          <li>Go to Configure > Events in the left menu</li>
          <li>Click "Create Event"</li>
          <li>Name your event and define the conditions that will trigger it</li>
          <li>Click "Create" to save the event</li>
          <li>To mark an event as a conversion, go to Configure > Conversions</li>
          <li>Click "New Conversion Event" and select the event you want to track as a conversion</li>
        </ol>
        
        <h2>Step 5: Set Up Custom Dimensions</h2>
        <p>If you were using custom dimensions in Universal Analytics, you'll need to recreate them in GA4:</p>
        <ol>
          <li>Go to Configure > Custom Definitions in the left menu</li>
          <li>Click "Create Custom Dimensions"</li>
          <li>Enter a dimension name and select its scope (user, session, or event)</li>
          <li>Click "Save" to create the dimension</li>
        </ol>
        
        <h2>Step 6: Run Both Analytics Properties in Parallel</h2>
        <p>It's recommended to run both UA and GA4 simultaneously for several months to:</p>
        <ul>
          <li>Collect baseline data in GA4</li>
          <li>Compare data between both platforms to ensure proper tracking</li>
          <li>Become familiar with the new GA4 reporting</li>
        </ul>
        
        <h2>Step 7: Update Your Reports and Dashboards</h2>
        <p>GA4 has a completely different reporting structure:</p>
        <ol>
          <li>Explore the new reports available in the Reports section</li>
          <li>Use the Explore feature to create custom reports</li>
          <li>Set up custom dashboards using the Dashboard feature</li>
          <li>Consider updating any external dashboards or data integrations to pull from GA4</li>
        </ol>
        
        <h2>Important Differences to Be Aware Of</h2>
        <ul>
          <li><strong>No View Level:</strong> GA4 doesn't have the concept of Views that UA had</li>
          <li><strong>Different Metrics:</strong> Many metrics are calculated differently in GA4</li>
          <li><strong>No Bounce Rate:</strong> GA4 uses "engagement rate" instead of bounce rate</li>
          <li><strong>Event Tracking:</strong> GA4 uses a different event model with more flexibility</li>
          <li><strong>Data Retention:</strong> GA4 has a maximum 14-month data retention period</li>
        </ul>
        
        <h2>Additional Resources</h2>
        <ul>
          <li><a href="https://support.google.com/analytics/answer/10089681" target="_blank">Official GA4 Migration Guide</a></li>
          <li><a href="https://developers.google.com/analytics/devguides/collection/ga4" target="_blank">GA4 Developer Documentation</a></li>
          <li><a href="https://support.google.com/analytics/answer/9744165" target="_blank">GA4 Event Parameters Reference</a></li>
        </ul>
        
        <p>Remember, starting fresh with GA4 allows you to implement a cleaner, more modern analytics setup that will serve your business needs for years to come.</p>
      `,
      date: new Date("2023-03-10"),
      readTime: 10
    });
    
    // Meta Pixel Setup Guide
    this.createBlogPost({
      slug: "setting-up-meta-pixel-for-conversion-tracking",
      title: "Setting Up Meta Pixel for Conversion Tracking",
      description: "Learn how to implement the Meta (Facebook) Pixel for accurate conversion tracking and better ad performance.",
      content: `
        <h2>What is the Meta Pixel?</h2>
        <p>The Meta Pixel (formerly known as the Facebook Pixel) is a piece of code that you place on your website that allows you to measure the effectiveness of your advertising by understanding the actions people take on your website. It helps you ensure your ads are shown to the right people, build advertising audiences, and unlock additional Meta advertising tools.</p>
        
        <h2>Key Benefits of Using Meta Pixel</h2>
        <ul>
          <li><strong>Conversion Tracking:</strong> Measure when visitors take valuable actions on your site</li>
          <li><strong>Optimize Ad Delivery:</strong> Show ads to people more likely to take action</li>
          <li><strong>Build Targeted Audiences:</strong> Create custom audiences based on website visitors</li>
          <li><strong>Dynamic Ads:</strong> Show personalized product recommendations based on browsing behavior</li>
          <li><strong>Performance Insights:</strong> Better understand your customers' journey from ad to conversion</li>
        </ul>
        
        <h2>Step 1: Create a Meta Pixel</h2>
        <ol>
          <li>Go to <a href="https://business.facebook.com/events_manager" target="_blank">Events Manager</a> within Meta Business Suite</li>
          <li>Click on the "Connect Data Sources" button and select "Web"</li>
          <li>Select "Meta Pixel" and click "Connect"</li>
          <li>Enter a name for your pixel (typically your business name)</li>
          <li>Enter your website URL to automatically check for easy setup options</li>
          <li>Click "Continue" to create your pixel</li>
        </ol>
        
        <h2>Step 2: Add the Pixel Base Code to Your Website</h2>
        <p>You have several options to install the pixel on your website:</p>
        
        <h3>Option A: Using Google Tag Manager (Recommended)</h3>
        <ol>
          <li>Log in to <a href="https://tagmanager.google.com/" target="_blank">Google Tag Manager</a></li>
          <li>Select your container</li>
          <li>Click "Tags" from the left menu</li>
          <li>Click "New" to create a new tag</li>
          <li>Click "Tag Configuration" and select "Custom HTML"</li>
          <li>Paste your Meta Pixel base code (provided in Events Manager)</li>
          <li>Under "Triggering", select "All Pages"</li>
          <li>Name your tag (e.g., "Meta Pixel - Base Code")</li>
          <li>Click "Save" and then "Submit" to publish the changes</li>
        </ol>
        
        <h3>Option B: Manual Installation</h3>
        <p>Add this code to your website's <code>&lt;head&gt;</code> section:</p>
        <pre><code>&lt;!-- Meta Pixel Code --&gt;
&lt;script&gt;
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', 'PIXEL_ID');
fbq('track', 'PageView');
&lt;/script&gt;
&lt;noscript&gt;&lt;img height="1" width="1" style="display:none"
src="https://www.facebook.com/tr?id=PIXEL_ID&ev=PageView&noscript=1"
/&gt;&lt;/noscript&gt;
&lt;!-- End Meta Pixel Code --&gt;</code></pre>
        <p><em>Note: Replace PIXEL_ID with your actual Meta Pixel ID.</em></p>
        
        <h3>Option C: Using a Platform Integration</h3>
        <p>Meta provides easy integrations for popular platforms:</p>
        <ul>
          <li>Shopify: Use the Facebook Channel app</li>
          <li>WordPress: Use the Meta Pixel plugin</li>
          <li>Wix, Squarespace, etc.: Use the platform's built-in Meta integration</li>
        </ul>
        
        <h2>Step 3: Verify Your Pixel Installation</h2>
        <ol>
          <li>Install the <a href="https://chrome.google.com/webstore/detail/facebook-pixel-helper/fdgfkebogiimcoedlicjlajpkdmockpc" target="_blank">Meta Pixel Helper</a> Chrome extension</li>
          <li>Visit your website and click on the Pixel Helper icon in your browser toolbar</li>
          <li>The extension will show if your pixel is detected and if it's working correctly</li>
          <li>You can also check the Events Manager in Meta Business Suite to see if your pixel is receiving data</li>
        </ol>
        
        <h2>Step 4: Set Up Standard Events</h2>
        <p>After installing the base pixel code, you'll want to track specific actions. Meta has predefined standard events that you can use:</p>
        
        <pre><code>fbq('track', 'EVENT_NAME', {optional_parameters});</code></pre>
        
        <p>Common standard events include:</p>
        <ul>
          <li><code>AddToCart</code> - When items are added to shopping cart</li>
          <li><code>Purchase</code> - When a purchase is completed</li>
          <li><code>Lead</code> - When a sign up is completed (like for an email list)</li>
          <li><code>CompleteRegistration</code> - When a registration form is completed</li>
          <li><code>Contact</code> - When someone initiates contact with your business</li>
        </ul>
        
        <p>For example, to track a purchase event with conversion value:</p>
        <pre><code>fbq('track', 'Purchase', {
  value: 99.99,
  currency: 'USD'
});</code></pre>
        
        <h2>Step 5: Add Event Parameters for Enhanced Tracking</h2>
        <p>To get more detailed information, add parameters to your events. For example:</p>
        
        <pre><code>fbq('track', 'Purchase', {
  value: 99.99,
  currency: 'USD',
  content_name: 'Premium Subscription',
  content_type: 'product',
  content_ids: ['PROD123'],
  num_items: 1
});</code></pre>
        
        <h2>Step 6: Set Up the Conversions API (Advanced)</h2>
        <p>For more reliable tracking, consider implementing the Meta Conversions API alongside the pixel. This server-side tracking method sends data directly from your server to Meta. This helps:</p>
        <ul>
          <li>Track conversions even when browsers block cookies or pixels</li>
          <li>Provide more accurate attribution data</li>
          <li>Improve ad optimization</li>
        </ul>
        
        <p>To implement the Conversions API:</p>
        <ol>
          <li>Go to Events Manager in Meta Business Suite</li>
          <li>Select your pixel</li>
          <li>Click on "Settings" and then "Conversions API"</li>
          <li>Follow the implementation guide for your specific platform</li>
        </ol>
        
        <h2>Step 7: Create Custom Conversions</h2>
        <p>Custom conversions allow you to track specific page visits as conversions:</p>
        <ol>
          <li>Go to Events Manager in Meta Business Suite</li>
          <li>Click on "Custom Conversions"</li>
          <li>Click "Create Custom Conversion"</li>
          <li>Define a rule based on URL patterns (e.g., thank-you pages)</li>
          <li>Select a category for your conversion</li>
          <li>Add a conversion value if applicable</li>
          <li>Name your custom conversion and click "Create"</li>
        </ol>
        
        <h2>Step 8: Create and Use Custom Audiences</h2>
        <p>One of the most powerful features of the Meta Pixel is the ability to create custom audiences for retargeting:</p>
        <ol>
          <li>Go to Audiences in Meta Ads Manager</li>
          <li>Click "Create Audience" and select "Custom Audience"</li>
          <li>Select "Website" as the source</li>
          <li>Define your audience criteria based on website visitors and events</li>
          <li>Name your audience and click "Create Audience"</li>
        </ol>
        
        <h2>Important Privacy Considerations</h2>
        <ul>
          <li><strong>Update Your Privacy Policy:</strong> Clearly disclose your use of the Meta Pixel and cookies</li>
          <li><strong>Implement a Cookie Consent Banner:</strong> Get user consent before activating the pixel in regions like the EU (GDPR compliance)</li>
          <li><strong>Configure Your Pixel for Compliance:</strong> Use Meta's data processing options to comply with regulations</li>
          <li><strong>Respect User Choice:</strong> Don't trigger the pixel for users who have declined consent</li>
        </ul>
        
        <h2>Additional Resources</h2>
        <ul>
          <li><a href="https://developers.facebook.com/docs/meta-pixel/implementation/conversion-tracking" target="_blank">Meta Pixel Implementation Guide</a></li>
          <li><a href="https://www.facebook.com/business/help/402791146561655" target="_blank">Meta Conversions API Documentation</a></li>
          <li><a href="https://developers.facebook.com/docs/meta-pixel/reference" target="_blank">Meta Pixel Event Reference</a></li>
        </ul>
        
        <p>By properly implementing the Meta Pixel, you'll gain valuable insights into your customers' journey and significantly improve your advertising return on investment.</p>
      `,
      date: new Date("2023-06-05"),
      readTime: 9
    });
  }
}

export const storage = new MemStorage();
