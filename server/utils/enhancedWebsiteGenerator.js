import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

export class EnhancedWebsiteGenerator {
  constructor(outputDir = 'generated-websites') {
    this.outputDir = outputDir;
    this.ensureOutputDir();
  }

  ensureOutputDir() {
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  async generateWebsite(websiteId) {
    try {
      // Fetch complete website data
      const website = await prisma.website.findUnique({
        where: { id: websiteId },
        include: {
          company: true,
          products: true,
          theme: true,
          content: { orderBy: { order: 'asc' } },
          pages: { orderBy: { order: 'asc' } }
        }
      });

      if (!website) {
        throw new Error('Website not found');
      }

      const websiteDir = path.join(this.outputDir, websiteId);
      
      // Create website directory
      if (!fs.existsSync(websiteDir)) {
        fs.mkdirSync(websiteDir, { recursive: true });
      }

      // Generate HTML files
      await this.generateEnhancedHTML(website, websiteDir);
      
      // Generate CSS files with dark mode support
      await this.generateEnhancedCSS(website, websiteDir);
      
      // Generate JavaScript files with animations
      await this.generateEnhancedJS(website, websiteDir);
      
      // Copy assets
      await this.copyAssets(websiteDir);

      return websiteDir;
    } catch (error) {
      console.error('Website generation error:', error);
      throw error;
    }
  }

  async generateEnhancedHTML(website, outputDir) {
    const htmlTemplate = this.getEnhancedHTMLTemplate(website);
    
    // Generate index.html
    fs.writeFileSync(
      path.join(outputDir, 'index.html'),
      htmlTemplate
    );

    // Generate additional pages
    website.pages?.forEach((page) => {
      const pageHTML = this.getPageTemplate(website, page);
      fs.writeFileSync(
        path.join(outputDir, `${page.slug}.html`),
        pageHTML
      );
    });
  }

  async generateEnhancedCSS(website, outputDir) {
    const cssContent = this.getEnhancedCSSTemplate(website);
    
    fs.writeFileSync(
      path.join(outputDir, 'styles.css'),
      cssContent
    );
  }

  async generateEnhancedJS(website, outputDir) {
    const jsContent = this.getEnhancedJSTemplate(website);
    
    fs.writeFileSync(
      path.join(outputDir, 'script.js'),
      jsContent
    );
  }

  async copyAssets(outputDir) {
    // Copy common assets like fonts, icons, etc.
    const assetsDir = path.join(outputDir, 'assets');
    if (!fs.existsSync(assetsDir)) {
      fs.mkdirSync(assetsDir);
    }
  }

  getEnhancedHTMLTemplate(website) {
    const { company, theme, content, products } = website;
    
    return `<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${company?.name || 'Website'}</title>
    <meta name="description" content="${company?.description || 'Professional website'}">
    <link rel="stylesheet" href="styles.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
</head>
<body class="antialiased">
    <!-- Dark Mode Toggle -->
    <button id="darkModeToggle" class="dark-mode-toggle" aria-label="Toggle dark mode">
        <span class="sun-icon">☀️</span>
        <span class="moon-icon">🌙</span>
    </button>

    <header class="header">
        <nav class="navbar">
            <div class="nav-brand">
                <h1>${company?.name || 'Company Name'}</h1>
            </div>
            <ul class="nav-menu">
                <li><a href="#home" class="nav-link">Home</a></li>
                <li><a href="#about" class="nav-link">About</a></li>
                <li><a href="#services" class="nav-link">Services</a></li>
                <li><a href="#products" class="nav-link">Products</a></li>
                <li><a href="#contact" class="nav-link">Contact</a></li>
            </ul>
            <button class="mobile-menu-toggle" aria-label="Toggle mobile menu">
                <span></span>
                <span></span>
                <span></span>
            </button>
        </nav>
    </header>

    <main>
        <section id="home" class="hero">
            <div class="hero-background"></div>
            <div class="hero-content">
                <div class="hero-text animate-fade-in-up">
                    <h1 class="hero-title">${this.getContentByType(content, 'HERO')?.title || 'Welcome to ' + (company?.name || 'Our Business')}</h1>
                    <p class="hero-subtitle">${this.getContentByType(content, 'HERO')?.content || company?.tagline || 'Professional services you can trust'}</p>
                    <div class="hero-buttons">
                        <button class="cta-button primary">Get Started</button>
                        <button class="cta-button secondary">Learn More</button>
                    </div>
                </div>
            </div>
            <div class="scroll-indicator">
                <div class="scroll-arrow"></div>
            </div>
        </section>

        <section id="about" class="about section-padding">
            <div class="container">
                <div class="section-header animate-on-scroll">
                    <h2 class="section-title">${this.getContentByType(content, 'ABOUT')?.title || 'About Us'}</h2>
                    <div class="section-divider"></div>
                </div>
                <div class="about-content animate-on-scroll">
                    <p class="about-text">${this.getContentByType(content, 'ABOUT')?.content || company?.description || 'We are committed to providing excellent service.'}</p>
                </div>
            </div>
        </section>

        <section id="services" class="services section-padding">
            <div class="container">
                <div class="section-header animate-on-scroll">
                    <h2 class="section-title">${this.getContentByType(content, 'SERVICES')?.title || 'Our Services'}</h2>
                    <div class="section-divider"></div>
                </div>
                <div class="services-grid">
                    ${this.generateEnhancedServicesHTML(website)}
                </div>
            </div>
        </section>

        ${products && products.length > 0 ? `
        <section id="products" class="products section-padding">
            <div class="container">
                <div class="section-header animate-on-scroll">
                    <h2 class="section-title">Our Products</h2>
                    <div class="section-divider"></div>
                </div>
                <div class="products-grid">
                    ${this.generateEnhancedProductsHTML(products)}
                </div>
            </div>
        </section>
        ` : ''}

        <section id="contact" class="contact section-padding">
            <div class="container">
                <div class="section-header animate-on-scroll">
                    <h2 class="section-title">${this.getContentByType(content, 'CONTACT')?.title || 'Contact Us'}</h2>
                    <div class="section-divider"></div>
                </div>
                <div class="contact-content">
                    <div class="contact-info animate-on-scroll">
                        ${company?.phone ? `
                        <div class="contact-item">
                            <div class="contact-icon">📞</div>
                            <div class="contact-details">
                                <h3>Phone</h3>
                                <p>${company.phone}</p>
                            </div>
                        </div>
                        ` : ''}
                        ${company?.email ? `
                        <div class="contact-item">
                            <div class="contact-icon">✉️</div>
                            <div class="contact-details">
                                <h3>Email</h3>
                                <p>${company.email}</p>
                            </div>
                        </div>
                        ` : ''}
                        ${company?.address ? `
                        <div class="contact-item">
                            <div class="contact-icon">📍</div>
                            <div class="contact-details">
                                <h3>Address</h3>
                                <p>${company.address}</p>
                            </div>
                        </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        </section>
    </main>

    <footer class="footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-brand">
                    <h3>${company?.name || 'Company'}</h3>
                    <p>${company?.tagline || 'Professional services'}</p>
                </div>
                <div class="footer-links">
                    <div class="footer-section">
                        <h4>Quick Links</h4>
                        <ul>
                            <li><a href="#home">Home</a></li>
                            <li><a href="#about">About</a></li>
                            <li><a href="#services">Services</a></li>
                            <li><a href="#contact">Contact</a></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="footer-bottom">
                <p>${this.getContentByType(content, 'FOOTER')?.content || `© 2024 ${company?.name || 'Company'}. All rights reserved.`}</p>
            </div>
        </div>
    </footer>

    <script src="script.js"></script>
</body>
</html>`;
  }

  getEnhancedCSSTemplate(website) {
    const { theme } = website;
    
    return `/* CSS Variables for Light/Dark Mode */
:root {
    /* Light Mode Colors */
    --primary: ${theme?.primary || '#3B82F6'};
    --secondary: ${theme?.secondary || '#1E40AF'};
    --accent: ${theme?.accent || '#60A5FA'};
    --background: ${theme?.background || '#FFFFFF'};
    --surface: #FFFFFF;
    --text-primary: ${theme?.text || '#1F2937'};
    --text-secondary: #6B7280;
    --border: #E5E7EB;
    --shadow: rgba(0, 0, 0, 0.1);
    
    /* Typography */
    --font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    --font-size-xs: 0.75rem;
    --font-size-sm: 0.875rem;
    --font-size-base: 1rem;
    --font-size-lg: 1.125rem;
    --font-size-xl: 1.25rem;
    --font-size-2xl: 1.5rem;
    --font-size-3xl: 1.875rem;
    --font-size-4xl: 2.25rem;
    --font-size-5xl: 3rem;
    
    /* Spacing */
    --spacing-xs: 0.25rem;
    --spacing-sm: 0.5rem;
    --spacing-md: 1rem;
    --spacing-lg: 1.5rem;
    --spacing-xl: 2rem;
    --spacing-2xl: 3rem;
    --spacing-3xl: 4rem;
    
    /* Border Radius */
    --radius-sm: 0.375rem;
    --radius-md: 0.5rem;
    --radius-lg: 0.75rem;
    --radius-xl: 1rem;
    --radius-2xl: 1.5rem;
    
    /* Transitions */
    --transition-fast: 150ms ease;
    --transition-normal: 300ms ease;
    --transition-slow: 500ms ease;
}

/* Dark Mode Colors */
[data-theme="dark"] {
    --background: #0F172A;
    --surface: #1E293B;
    --text-primary: #F8FAFC;
    --text-secondary: #CBD5E1;
    --border: #334155;
    --shadow: rgba(0, 0, 0, 0.3);
}

/* Reset and Base Styles */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

html {
    scroll-behavior: smooth;
}

body {
    font-family: var(--font-family);
    line-height: 1.6;
    color: var(--text-primary);
    background-color: var(--background);
    transition: background-color var(--transition-normal), color var(--transition-normal);
    overflow-x: hidden;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 var(--spacing-lg);
}

.section-padding {
    padding: var(--spacing-3xl) 0;
}

/* Dark Mode Toggle */
.dark-mode-toggle {
    position: fixed;
    top: var(--spacing-lg);
    right: var(--spacing-lg);
    z-index: 1001;
    background: var(--surface);
    border: 2px solid var(--border);
    border-radius: 50%;
    width: 3rem;
    height: 3rem;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all var(--transition-normal);
    box-shadow: 0 4px 12px var(--shadow);
}

.dark-mode-toggle:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 20px var(--shadow);
}

.dark-mode-toggle .moon-icon {
    display: none;
}

[data-theme="dark"] .dark-mode-toggle .sun-icon {
    display: none;
}

[data-theme="dark"] .dark-mode-toggle .moon-icon {
    display: block;
}

/* Header Styles */
.header {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid var(--border);
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 1000;
    transition: all var(--transition-normal);
}

[data-theme="dark"] .header {
    background: rgba(15, 23, 42, 0.95);
}

.navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--spacing-md) var(--spacing-lg);
    max-width: 1200px;
    margin: 0 auto;
}

.nav-brand h1 {
    font-size: var(--font-size-xl);
    font-weight: 700;
    background: linear-gradient(135deg, var(--primary), var(--accent));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.nav-menu {
    display: flex;
    list-style: none;
    gap: var(--spacing-xl);
    align-items: center;
}

.nav-link {
    color: var(--text-primary);
    text-decoration: none;
    font-weight: 500;
    position: relative;
    transition: color var(--transition-fast);
}

.nav-link::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 0;
    height: 2px;
    background: linear-gradient(135deg, var(--primary), var(--accent));
    transition: width var(--transition-normal);
}

.nav-link:hover::after {
    width: 100%;
}

.mobile-menu-toggle {
    display: none;
    flex-direction: column;
    background: none;
    border: none;
    cursor: pointer;
    padding: var(--spacing-sm);
}

.mobile-menu-toggle span {
    width: 25px;
    height: 3px;
    background: var(--text-primary);
    margin: 3px 0;
    transition: var(--transition-fast);
}

/* Hero Section */
.hero {
    position: relative;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    background: linear-gradient(135deg, var(--primary), var(--secondary));
}

.hero-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, var(--primary), var(--secondary));
    opacity: 0.9;
}

.hero-content {
    position: relative;
    z-index: 2;
    text-align: center;
    color: white;
    max-width: 800px;
    padding: 0 var(--spacing-lg);
}

.hero-title {
    font-size: var(--font-size-5xl);
    font-weight: 700;
    margin-bottom: var(--spacing-lg);
    line-height: 1.2;
}

.hero-subtitle {
    font-size: var(--font-size-xl);
    margin-bottom: var(--spacing-2xl);
    opacity: 0.9;
    line-height: 1.5;
}

.hero-buttons {
    display: flex;
    gap: var(--spacing-lg);
    justify-content: center;
    flex-wrap: wrap;
}

.cta-button {
    padding: var(--spacing-md) var(--spacing-xl);
    border: none;
    border-radius: var(--radius-lg);
    font-size: var(--font-size-lg);
    font-weight: 600;
    cursor: pointer;
    transition: all var(--transition-normal);
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 150px;
}

.cta-button.primary {
    background: white;
    color: var(--primary);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.cta-button.primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

.cta-button.secondary {
    background: transparent;
    color: white;
    border: 2px solid white;
}

.cta-button.secondary:hover {
    background: white;
    color: var(--primary);
}

.scroll-indicator {
    position: absolute;
    bottom: var(--spacing-xl);
    left: 50%;
    transform: translateX(-50%);
    animation: bounce 2s infinite;
}

.scroll-arrow {
    width: 24px;
    height: 24px;
    border-right: 2px solid white;
    border-bottom: 2px solid white;
    transform: rotate(45deg);
}

/* Section Styles */
.section-header {
    text-align: center;
    margin-bottom: var(--spacing-3xl);
}

.section-title {
    font-size: var(--font-size-4xl);
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: var(--spacing-md);
}

.section-divider {
    width: 80px;
    height: 4px;
    background: linear-gradient(135deg, var(--primary), var(--accent));
    margin: 0 auto;
    border-radius: var(--radius-sm);
}

/* Services Grid */
.services-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: var(--spacing-xl);
}

.service-card {
    background: var(--surface);
    padding: var(--spacing-2xl);
    border-radius: var(--radius-xl);
    box-shadow: 0 4px 20px var(--shadow);
    text-align: center;
    transition: all var(--transition-normal);
    border: 1px solid var(--border);
    position: relative;
    overflow: hidden;
}

.service-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: linear-gradient(135deg, var(--primary), var(--accent));
}

.service-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 40px var(--shadow);
}

.service-icon {
    width: 60px;
    height: 60px;
    background: linear-gradient(135deg, var(--primary), var(--accent));
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto var(--spacing-lg);
    font-size: var(--font-size-2xl);
}

.service-card h3 {
    font-size: var(--font-size-xl);
    font-weight: 600;
    margin-bottom: var(--spacing-md);
    color: var(--text-primary);
}

.service-card p {
    color: var(--text-secondary);
    line-height: 1.6;
}

/* Products Grid */
.products-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: var(--spacing-xl);
}

.product-card {
    background: var(--surface);
    border-radius: var(--radius-xl);
    box-shadow: 0 4px 20px var(--shadow);
    overflow: hidden;
    transition: all var(--transition-normal);
    border: 1px solid var(--border);
}

.product-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 40px var(--shadow);
}

.product-image {
    width: 100%;
    height: 200px;
    background: linear-gradient(135deg, var(--primary), var(--accent));
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: var(--font-size-3xl);
    color: white;
}

.product-info {
    padding: var(--spacing-xl);
}

.product-info h3 {
    font-size: var(--font-size-xl);
    font-weight: 600;
    margin-bottom: var(--spacing-sm);
    color: var(--text-primary);
}

.product-info p {
    color: var(--text-secondary);
    margin-bottom: var(--spacing-lg);
    line-height: 1.6;
}

.product-price {
    font-size: var(--font-size-2xl);
    font-weight: 700;
    color: var(--primary);
}

/* Contact Section */
.contact {
    background: var(--surface);
}

.contact-content {
    max-width: 800px;
    margin: 0 auto;
}

.contact-info {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: var(--spacing-xl);
}

.contact-item {
    display: flex;
    align-items: center;
    gap: var(--spacing-lg);
    padding: var(--spacing-xl);
    background: var(--background);
    border-radius: var(--radius-lg);
    border: 1px solid var(--border);
    transition: all var(--transition-normal);
}

.contact-item:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px var(--shadow);
}

.contact-icon {
    font-size: var(--font-size-2xl);
    width: 60px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, var(--primary), var(--accent));
    border-radius: 50%;
}

.contact-details h3 {
    font-size: var(--font-size-lg);
    font-weight: 600;
    margin-bottom: var(--spacing-xs);
    color: var(--text-primary);
}

.contact-details p {
    color: var(--text-secondary);
}

/* Footer */
.footer {
    background: var(--text-primary);
    color: var(--background);
    padding: var(--spacing-3xl) 0 var(--spacing-xl);
}

.footer-content {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: var(--spacing-xl);
    margin-bottom: var(--spacing-xl);
}

.footer-brand h3 {
    font-size: var(--font-size-xl);
    font-weight: 700;
    margin-bottom: var(--spacing-sm);
}

.footer-section h4 {
    font-size: var(--font-size-lg);
    font-weight: 600;
    margin-bottom: var(--spacing-md);
}

.footer-section ul {
    list-style: none;
}

.footer-section ul li {
    margin-bottom: var(--spacing-sm);
}

.footer-section ul li a {
    color: rgba(255, 255, 255, 0.8);
    text-decoration: none;
    transition: color var(--transition-fast);
}

.footer-section ul li a:hover {
    color: white;
}

.footer-bottom {
    border-top: 1px solid rgba(255, 255, 255, 0.2);
    padding-top: var(--spacing-lg);
    text-align: center;
    color: rgba(255, 255, 255, 0.8);
}

/* Animations */
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
        transform: translateX(-50%) translateY(0);
    }
    40% {
        transform: translateX(-50%) translateY(-10px);
    }
    60% {
        transform: translateX(-50%) translateY(-5px);
    }
}

.animate-fade-in-up {
    animation: fadeInUp 1s ease-out;
}

.animate-on-scroll {
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.6s ease-out;
}

.animate-on-scroll.in-view {
    opacity: 1;
    transform: translateY(0);
}

/* Responsive Design */
@media (max-width: 768px) {
    .nav-menu {
        display: none;
    }
    
    .mobile-menu-toggle {
        display: flex;
    }
    
    .hero-title {
        font-size: var(--font-size-3xl);
    }
    
    .hero-subtitle {
        font-size: var(--font-size-lg);
    }
    
    .hero-buttons {
        flex-direction: column;
        align-items: center;
    }
    
    .section-title {
        font-size: var(--font-size-3xl);
    }
    
    .services-grid,
    .products-grid {
        grid-template-columns: 1fr;
    }
    
    .contact-info {
        grid-template-columns: 1fr;
    }
    
    .footer-content {
        grid-template-columns: 1fr;
        text-align: center;
    }
}

@media (max-width: 480px) {
    .container {
        padding: 0 var(--spacing-md);
    }
    
    .hero-title {
        font-size: var(--font-size-2xl);
    }
    
    .section-padding {
        padding: var(--spacing-2xl) 0;
    }
}`;
  }

  getEnhancedJSTemplate(website) {
    return `// Enhanced Website functionality with animations and dark mode
document.addEventListener('DOMContentLoaded', function() {
    // Initialize theme
    initializeTheme();
    
    // Initialize smooth scrolling
    initializeSmoothScrolling();
    
    // Initialize scroll animations
    initializeScrollAnimations();
    
    // Initialize header effects
    initializeHeaderEffects();
    
    // Initialize mobile menu
    initializeMobileMenu();
    
    // Initialize dark mode toggle
    initializeDarkModeToggle();
});

// Theme Management
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
}

function initializeDarkModeToggle() {
    const toggle = document.getElementById('darkModeToggle');
    if (toggle) {
        toggle.addEventListener('click', function() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            // Add a subtle animation to the toggle
            toggle.style.transform = 'scale(0.9)';
            setTimeout(() => {
                toggle.style.transform = 'scale(1)';
            }, 150);
        });
    }
}

// Smooth Scrolling
function initializeSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update active nav link
                updateActiveNavLink(targetId);
            }
        });
    });
}

function updateActiveNavLink(targetId) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === targetId) {
            link.classList.add('active');
        }
    });
}

// Scroll Animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                
                // Add staggered animation for grid items
                if (entry.target.classList.contains('services-grid') || 
                    entry.target.classList.contains('products-grid')) {
                    animateGridItems(entry.target);
                }
            }
        });
    }, observerOptions);

    // Observe all animated elements
    const animatedElements = document.querySelectorAll('.animate-on-scroll, .services-grid, .products-grid');
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

function animateGridItems(grid) {
    const items = grid.querySelectorAll('.service-card, .product-card');
    items.forEach((item, index) => {
        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Header Effects
function initializeHeaderEffects() {
    const header = document.querySelector('.header');
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', function() {
        const currentScrollY = window.scrollY;
        
        // Add/remove scrolled class
        if (currentScrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Hide/show header on scroll
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollY = currentScrollY;
        
        // Update active section in navigation
        updateActiveSection();
    });
}

function updateActiveSection() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            updateActiveNavLink('#' + sectionId);
        }
    });
}

// Mobile Menu
function initializeMobileMenu() {
    const toggle = document.querySelector('.mobile-menu-toggle');
    const menu = document.querySelector('.nav-menu');
    
    if (toggle && menu) {
        toggle.addEventListener('click', function() {
            menu.classList.toggle('active');
            toggle.classList.toggle('active');
            
            // Animate hamburger icon
            const spans = toggle.querySelectorAll('span');
            spans.forEach((span, index) => {
                if (toggle.classList.contains('active')) {
                    if (index === 0) span.style.transform = 'rotate(45deg) translate(5px, 5px)';
                    if (index === 1) span.style.opacity = '0';
                    if (index === 2) span.style.transform = 'rotate(-45deg) translate(7px, -6px)';
                } else {
                    span.style.transform = 'none';
                    span.style.opacity = '1';
                }
            });
        });
        
        // Close menu when clicking on a link
        const navLinks = menu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                menu.classList.remove('active');
                toggle.classList.remove('active');
                
                const spans = toggle.querySelectorAll('span');
                spans.forEach(span => {
                    span.style.transform = 'none';
                    span.style.opacity = '1';
                });
            });
        });
    }
}

// Enhanced Card Interactions
function initializeCardInteractions() {
    const cards = document.querySelectorAll('.service-card, .product-card, .contact-item');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Parallax Effect for Hero Section
function initializeParallaxEffect() {
    const hero = document.querySelector('.hero');
    const heroBackground = document.querySelector('.hero-background');
    
    if (hero && heroBackground) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            heroBackground.style.transform = \`translateY(\${rate}px)\`;
        });
    }
}

// Initialize additional features
document.addEventListener('DOMContentLoaded', function() {
    initializeCardInteractions();
    initializeParallaxEffect();
    
    // Add loading animation
    document.body.classList.add('loaded');
});

// Utility function for smooth animations
function animateElement(element, animation, duration = 600) {
    element.style.animation = \`\${animation} \${duration}ms ease-out\`;
    
    setTimeout(() => {
        element.style.animation = '';
    }, duration);
}

// Performance optimization: Throttle scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Apply throttling to scroll events
window.addEventListener('scroll', throttle(function() {
    // Scroll-dependent functions here
}, 16)); // ~60fps`;
  }

  getContentByType(content, type) {
    return content?.find(c => c.type === type);
  }

  generateEnhancedServicesHTML(website) {
    // Generate services based on template
    const services = this.getTemplateServices(website);
    
    return services.map((service, index) => `
      <div class="service-card animate-on-scroll" style="animation-delay: ${index * 100}ms;">
        <div class="service-icon">🚀</div>
        <h3>${service.name}</h3>
        <p>${service.description}</p>
      </div>
    `).join('');
  }

  generateEnhancedProductsHTML(products) {
    return products.map((product, index) => `
      <div class="product-card animate-on-scroll" style="animation-delay: ${index * 100}ms;">
        <div class="product-image">
          ${product.image ? `<img src="${product.image}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover;">` : '📦'}
        </div>
        <div class="product-info">
          <h3>${product.name}</h3>
          <p>${product.description || ''}</p>
          <div class="product-price">$${product.price.toFixed(2)}</div>
          ${!product.inStock ? '<p class="out-of-stock" style="color: #ef4444; font-weight: 600; margin-top: 0.5rem;">Out of Stock</p>' : ''}
        </div>
      </div>
    `).join('');
  }

  getTemplateServices(website) {
    const serviceMap = {
      'minimalist-clean': [
        { name: 'Clean Design', description: 'Minimalist approach with focus on content and user experience' },
        { name: 'Fast Performance', description: 'Optimized for speed and excellent performance metrics' },
        { name: 'Mobile First', description: 'Perfect experience across all devices and screen sizes' }
      ],
      'bold-modern': [
        { name: 'Eye-catching Design', description: 'Bold visuals and modern aesthetics that capture attention' },
        { name: 'Interactive Elements', description: 'Engaging user interactions and dynamic components' },
        { name: 'Modern Layouts', description: 'Contemporary design patterns and innovative structures' }
      ],
      'corporate-professional': [
        { name: 'Professional Excellence', description: 'Trustworthy and business-focused design approach' },
        { name: 'Data Presentation', description: 'Clear information architecture and content organization' },
        { name: 'Enterprise Standards', description: 'Meets corporate requirements and industry standards' }
      ],
      'creative-artistic': [
        { name: 'Artistic Expression', description: 'Creative and unique visual elements that inspire' },
        { name: 'Fluid Animations', description: 'Smooth transitions and engaging motion design' },
        { name: 'Visual Storytelling', description: 'Narrative-driven design that tells your story' }
      ]
    };

    const templateId = website.template?.id || 'default';
    return serviceMap[templateId] || [
      { name: 'Professional Service', description: 'High-quality service tailored to your specific needs' },
      { name: 'Expert Consultation', description: 'Professional advice and guidance from industry experts' },
      { name: 'Customer Support', description: '24/7 customer support and comprehensive assistance' }
    ];
  }

  getPageTemplate(website, page) {
    const { company } = website;
    
    return `<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${page.title || page.name} - ${company?.name || 'Website'}</title>
    <link rel="stylesheet" href="styles.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
</head>
<body class="antialiased">
    <button id="darkModeToggle" class="dark-mode-toggle" aria-label="Toggle dark mode">
        <span class="sun-icon">☀️</span>
        <span class="moon-icon">🌙</span>
    </button>

    <header class="header">
        <nav class="navbar">
            <div class="nav-brand">
                <h1>${company?.name || 'Company Name'}</h1>
            </div>
            <ul class="nav-menu">
                <li><a href="index.html" class="nav-link">Home</a></li>
                <li><a href="index.html#about" class="nav-link">About</a></li>
                <li><a href="index.html#services" class="nav-link">Services</a></li>
                <li><a href="index.html#contact" class="nav-link">Contact</a></li>
            </ul>
        </nav>
    </header>

    <main style="padding-top: 100px;">
        <section class="page-content section-padding">
            <div class="container">
                <div class="section-header animate-on-scroll">
                    <h1 class="section-title">${page.title || page.name}</h1>
                    <div class="section-divider"></div>
                </div>
                <div class="content animate-on-scroll">
                    ${page.content || '<p>Page content goes here.</p>'}
                </div>
            </div>
        </section>
    </main>

    <footer class="footer">
        <div class="container">
            <div class="footer-bottom">
                <p>© 2024 ${company?.name || 'Company'}. All rights reserved.</p>
            </div>
        </div>
    </footer>

    <script src="script.js"></script>
</body>
</html>`;
  }
}