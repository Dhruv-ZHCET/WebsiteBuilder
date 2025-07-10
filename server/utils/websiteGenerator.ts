import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

export interface WebsiteGenerationData {
  websiteId: string;
  industry: string;
  company: any;
  products: any[];
  theme: any;
  content: any[];
  pages: any[];
}

export class WebsiteGenerator {
  private outputDir: string;

  constructor(outputDir: string = 'generated-websites') {
    this.outputDir = outputDir;
    this.ensureOutputDir();
  }

  private ensureOutputDir() {
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  async generateWebsite(websiteId: string): Promise<string> {
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
      await this.generateHTML(website, websiteDir);
      
      // Generate CSS files
      await this.generateCSS(website, websiteDir);
      
      // Generate JavaScript files
      await this.generateJS(website, websiteDir);
      
      // Copy assets
      await this.copyAssets(websiteDir);

      return websiteDir;
    } catch (error) {
      console.error('Website generation error:', error);
      throw error;
    }
  }

  private async generateHTML(website: any, outputDir: string) {
    const htmlTemplate = this.getHTMLTemplate(website);
    
    // Generate index.html
    fs.writeFileSync(
      path.join(outputDir, 'index.html'),
      htmlTemplate
    );

    // Generate additional pages
    website.pages?.forEach((page: any) => {
      const pageHTML = this.getPageTemplate(website, page);
      fs.writeFileSync(
        path.join(outputDir, `${page.slug}.html`),
        pageHTML
      );
    });
  }

  private async generateCSS(website: any, outputDir: string) {
    const cssContent = this.getCSSTemplate(website);
    
    fs.writeFileSync(
      path.join(outputDir, 'styles.css'),
      cssContent
    );
  }

  private async generateJS(website: any, outputDir: string) {
    const jsContent = this.getJSTemplate(website);
    
    fs.writeFileSync(
      path.join(outputDir, 'script.js'),
      jsContent
    );
  }

  private async copyAssets(outputDir: string) {
    // Copy common assets like fonts, icons, etc.
    const assetsDir = path.join(outputDir, 'assets');
    if (!fs.existsSync(assetsDir)) {
      fs.mkdirSync(assetsDir);
    }
  }

  private getHTMLTemplate(website: any): string {
    const { company, theme, content, products } = website;
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${company?.name || 'Website'}</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <header class="header">
        <nav class="navbar">
            <div class="nav-brand">
                <h1>${company?.name || 'Company Name'}</h1>
            </div>
            <ul class="nav-menu">
                <li><a href="#home">Home</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#services">Services</a></li>
                <li><a href="#products">Products</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
        </nav>
    </header>

    <main>
        <section id="home" class="hero">
            <div class="hero-content">
                <h1>${this.getContentByType(content, 'HERO')?.title || 'Welcome to ' + (company?.name || 'Our Business')}</h1>
                <p>${this.getContentByType(content, 'HERO')?.content || company?.tagline || 'Professional services you can trust'}</p>
                <button class="cta-button">Get Started</button>
            </div>
        </section>

        <section id="about" class="about">
            <div class="container">
                <h2>${this.getContentByType(content, 'ABOUT')?.title || 'About Us'}</h2>
                <p>${this.getContentByType(content, 'ABOUT')?.content || company?.description || 'We are committed to providing excellent service.'}</p>
            </div>
        </section>

        <section id="services" class="services">
            <div class="container">
                <h2>${this.getContentByType(content, 'SERVICES')?.title || 'Our Services'}</h2>
                <div class="services-grid">
                    ${this.generateServicesHTML(website)}
                </div>
            </div>
        </section>

        ${products && products.length > 0 ? `
        <section id="products" class="products">
            <div class="container">
                <h2>Our Products</h2>
                <div class="products-grid">
                    ${this.generateProductsHTML(products)}
                </div>
            </div>
        </section>
        ` : ''}

        <section id="contact" class="contact">
            <div class="container">
                <h2>${this.getContentByType(content, 'CONTACT')?.title || 'Contact Us'}</h2>
                <div class="contact-info">
                    ${company?.phone ? `<p><strong>Phone:</strong> ${company.phone}</p>` : ''}
                    ${company?.email ? `<p><strong>Email:</strong> ${company.email}</p>` : ''}
                    ${company?.address ? `<p><strong>Address:</strong> ${company.address}</p>` : ''}
                </div>
            </div>
        </section>
    </main>

    <footer class="footer">
        <div class="container">
            <p>${this.getContentByType(content, 'FOOTER')?.content || `© 2024 ${company?.name || 'Company'}. All rights reserved.`}</p>
        </div>
    </footer>

    <script src="script.js"></script>
</body>
</html>`;
  }

  private getPageTemplate(website: any, page: any): string {
    const { company, theme } = website;
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${page.title || page.name} - ${company?.name || 'Website'}</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <header class="header">
        <nav class="navbar">
            <div class="nav-brand">
                <h1>${company?.name || 'Company Name'}</h1>
            </div>
            <ul class="nav-menu">
                <li><a href="index.html">Home</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#services">Services</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
        </nav>
    </header>

    <main>
        <section class="page-content">
            <div class="container">
                <h1>${page.title || page.name}</h1>
                <div class="content">
                    ${page.content || '<p>Page content goes here.</p>'}
                </div>
            </div>
        </section>
    </main>

    <footer class="footer">
        <div class="container">
            <p>© 2024 ${company?.name || 'Company'}. All rights reserved.</p>
        </div>
    </footer>

    <script src="script.js"></script>
</body>
</html>`;
  }

  private getCSSTemplate(website: any): string {
    const { theme } = website;
    
    return `/* Reset and Base Styles */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Arial', sans-serif;
    line-height: 1.6;
    color: ${theme?.text || '#333'};
    background-color: ${theme?.background || '#fff'};
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

/* Header Styles */
.header {
    background-color: ${theme?.primary || '#007bff'};
    color: white;
    padding: 1rem 0;
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 1000;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

.nav-brand h1 {
    font-size: 1.5rem;
}

.nav-menu {
    display: flex;
    list-style: none;
    gap: 2rem;
}

.nav-menu a {
    color: white;
    text-decoration: none;
    transition: color 0.3s;
}

.nav-menu a:hover {
    color: ${theme?.accent || '#ffc107'};
}

/* Hero Section */
.hero {
    background: linear-gradient(135deg, ${theme?.primary || '#007bff'}, ${theme?.secondary || '#0056b3'});
    color: white;
    padding: 120px 0 80px;
    text-align: center;
}

.hero-content h1 {
    font-size: 3rem;
    margin-bottom: 1rem;
}

.hero-content p {
    font-size: 1.2rem;
    margin-bottom: 2rem;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
}

.cta-button {
    background-color: ${theme?.accent || '#ffc107'};
    color: ${theme?.text || '#333'};
    padding: 12px 30px;
    border: none;
    border-radius: 5px;
    font-size: 1.1rem;
    cursor: pointer;
    transition: transform 0.3s, box-shadow 0.3s;
}

.cta-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
}

/* Section Styles */
section {
    padding: 80px 0;
}

section h2 {
    text-align: center;
    font-size: 2.5rem;
    margin-bottom: 3rem;
    color: ${theme?.primary || '#007bff'};
}

/* Services Grid */
.services-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin-top: 2rem;
}

.service-card {
    background: white;
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    text-align: center;
    transition: transform 0.3s;
}

.service-card:hover {
    transform: translateY(-5px);
}

/* Products Grid */
.products-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
    margin-top: 2rem;
}

.product-card {
    background: white;
    border-radius: 10px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    overflow: hidden;
    transition: transform 0.3s;
}

.product-card:hover {
    transform: translateY(-5px);
}

.product-card img {
    width: 100%;
    height: 200px;
    object-fit: cover;
}

.product-info {
    padding: 1.5rem;
}

.product-price {
    font-size: 1.5rem;
    font-weight: bold;
    color: ${theme?.primary || '#007bff'};
}

/* Contact Section */
.contact {
    background-color: ${theme?.background || '#f8f9fa'};
}

.contact-info {
    text-align: center;
    font-size: 1.1rem;
}

.contact-info p {
    margin-bottom: 1rem;
}

/* Footer */
.footer {
    background-color: ${theme?.text || '#333'};
    color: white;
    text-align: center;
    padding: 2rem 0;
}

/* Responsive Design */
@media (max-width: 768px) {
    .nav-menu {
        display: none;
    }
    
    .hero-content h1 {
        font-size: 2rem;
    }
    
    .hero-content p {
        font-size: 1rem;
    }
    
    section h2 {
        font-size: 2rem;
    }
}`;
  }

  private getJSTemplate(website: any): string {
    return `// Website functionality
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    
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
            }
        });
    });

    // Add scroll effect to header
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        if (window.scrollY > 100) {
            header.style.backgroundColor = 'rgba(0, 123, 255, 0.95)';
        } else {
            header.style.backgroundColor = '${website.theme?.primary || '#007bff'}';
        }
    });

    // Add animation to cards on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all cards
    const cards = document.querySelectorAll('.service-card, .product-card');
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
});`;
  }

  private getContentByType(content: any[], type: string) {
    return content?.find(c => c.type === type);
  }

  private generateServicesHTML(website: any): string {
    // Generate services based on industry
    const services = this.getIndustryServices(website.industry);
    
    return services.map(service => `
      <div class="service-card">
        <h3>${service.name}</h3>
        <p>${service.description}</p>
      </div>
    `).join('');
  }

  private generateProductsHTML(products: any[]): string {
    return products.map(product => `
      <div class="product-card">
        ${product.image ? `<img src="${product.image}" alt="${product.name}">` : ''}
        <div class="product-info">
          <h3>${product.name}</h3>
          <p>${product.description || ''}</p>
          <div class="product-price">$${product.price.toFixed(2)}</div>
          ${!product.inStock ? '<p class="out-of-stock">Out of Stock</p>' : ''}
        </div>
      </div>
    `).join('');
  }

  private getIndustryServices(industry: string): any[] {
    const serviceMap: { [key: string]: any[] } = {
      pharmacy: [
        { name: 'Prescription Services', description: 'Professional prescription filling and consultation' },
        { name: 'Health Consultations', description: 'Expert health advice and medication guidance' },
        { name: 'Home Delivery', description: 'Convenient delivery of medications to your door' }
      ],
      cosmetics: [
        { name: 'Beauty Consultation', description: 'Personalized beauty advice and product recommendations' },
        { name: 'Makeup Services', description: 'Professional makeup application for special events' },
        { name: 'Skincare Analysis', description: 'Comprehensive skin analysis and treatment plans' }
      ],
      restaurant: [
        { name: 'Dine-In Experience', description: 'Comfortable dining with exceptional service' },
        { name: 'Takeout & Delivery', description: 'Quick and convenient food ordering' },
        { name: 'Catering Services', description: 'Professional catering for events and parties' }
      ],
      default: [
        { name: 'Professional Service', description: 'High-quality service tailored to your needs' },
        { name: 'Expert Consultation', description: 'Professional advice and guidance' },
        { name: 'Customer Support', description: '24/7 customer support and assistance' }
      ]
    };

    return serviceMap[industry] || serviceMap.default;
  }
}`;
  }

  private getIndustryServices(industry: string): any[] {
    const serviceMap: { [key: string]: any[] } = {
      pharmacy: [
        { name: 'Prescription Services', description: 'Professional prescription filling and consultation' },
        { name: 'Health Consultations', description: 'Expert health advice and medication guidance' },
        { name: 'Home Delivery', description: 'Convenient delivery of medications to your door' }
      ],
      cosmetics: [
        { name: 'Beauty Consultation', description: 'Personalized beauty advice and product recommendations' },
        { name: 'Makeup Services', description: 'Professional makeup application for special events' },
        { name: 'Skincare Analysis', description: 'Comprehensive skin analysis and treatment plans' }
      ],
      restaurant: [
        { name: 'Dine-In Experience', description: 'Comfortable dining with exceptional service' },
        { name: 'Takeout & Delivery', description: 'Quick and convenient food ordering' },
        { name: 'Catering Services', description: 'Professional catering for events and parties' }
      ],
      default: [
        { name: 'Professional Service', description: 'High-quality service tailored to your needs' },
        { name: 'Expert Consultation', description: 'Professional advice and guidance' },
        { name: 'Customer Support', description: '24/7 customer support and assistance' }
      ]
    };

    return serviceMap[industry] || serviceMap.default;
  }
}