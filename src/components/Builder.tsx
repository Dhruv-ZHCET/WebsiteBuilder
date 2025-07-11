import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "./Header";
import ProgressBar from "./ProgressBar";
import TemplateSelection from "./steps/TemplateSelection";
import VisualAssets from "./steps/VisualAssets";
import CompanyDetails from "./steps/CompanyDetails";
import ColorTheme from "./steps/ColorTheme";
import ProductManagement from "./steps/ProductManagement";
import ContentCustomization from "./steps/ContentCustomization";
import NavigationButtons from "./NavigationButtons";
import {
  WebsiteData,
  WebsiteTemplate,
  ColorTheme as ColorThemeType,
  VisualAssets as VisualAssetsType,
} from "../types";
import { websiteAPI } from "../utils/api";

const steps = [
  "Template",
  "Visual Assets",
  "Company Details",
  "Color Theme",
  "Products",
  "Content",
  "Review & Generate",
];

const initialWebsiteData: WebsiteData = {
  template: {
    id: "",
    name: "",
    description: "",
    category: "minimalist",
    preview: "",
    features: [],
    sections: [],
    colorSchemes: []
  },
  company: {
    name: "",
    tagline: "",
    description: "",
    address: "",
    phone: "",
    email: "",
    websiteName: "",
  },
  products: [],
  colorTheme: {
    id: "",
    name: "",
    primary: "",
    secondary: "",
    accent: "",
    background: "",
    text: "",
    preview: "",
  },
  visualAssets: {
    heroBackground: "",
    logo: "",
    testimonialImages: [],
    galleryImages: []
  },
  content: {
    heroTitle: "",
    heroSubtitle: "",
    aboutTitle: "",
    aboutContent: "",
    servicesTitle: "",
    contactTitle: "",
    footerText: "",
  },
  settings: {
    darkModeEnabled: true,
    animationsEnabled: true,
    responsiveImages: true
  }
};

export default function Builder() {
  const [searchParams] = useSearchParams();
  const editWebsiteId = searchParams.get('edit');
  const [currentStep, setCurrentStep] = useState(0);
  const [websiteData, setWebsiteData] = useState<WebsiteData>(initialWebsiteData);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedWebsite, setGeneratedWebsite] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load existing website data if editing
  useEffect(() => {
    if (editWebsiteId) {
      setIsLoading(true);
      // Load website data for editing
      // This would typically fetch from your API
      console.log('Loading website for editing:', editWebsiteId);
      setIsLoading(false);
    }
  }, [editWebsiteId]);

  const handleTemplateSelect = (template: WebsiteTemplate) => {
    setWebsiteData((prev) => ({
      ...prev,
      template,
      content: {
        ...prev.content,
        heroTitle: `Welcome to ${prev.company.name || "Your Business"}`,
        heroSubtitle: `Professional services you can trust`,
        aboutTitle: "About Us",
        aboutContent: `We are committed to providing excellent service to our community.`,
        servicesTitle: "Our Services",
        contactTitle: "Contact Us",
        footerText: `© 2024 ${
          prev.company.name || "Your Company"
        }. All rights reserved.`,
      },
    }));
  };

  const handleVisualAssetsChange = (assets: VisualAssetsType) => {
    setWebsiteData((prev) => ({ ...prev, visualAssets: assets }));
  };
  const handleCompanyDetailsChange = (company: typeof websiteData.company) => {
    setWebsiteData((prev) => ({
      ...prev,
      company,
      content: {
        ...prev.content,
        heroTitle: `Welcome to ${company.name || "Your Business"}`,
        footerText: `© 2024 ${
          company.name || "Your Company"
        }. All rights reserved.`,
      },
    }));
  };

  const handleColorThemeSelect = (theme: ColorThemeType) => {
    setWebsiteData((prev) => ({ ...prev, colorTheme: theme }));
  };

  const handleProductsChange = (products: typeof websiteData.products) => {
    setWebsiteData((prev) => ({ ...prev, products }));
  };

  const handleContentChange = (content: typeof websiteData.content) => {
    setWebsiteData((prev) => ({ ...prev, content }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return websiteData.template.id !== "";
      case 1:
        return websiteData.visualAssets.heroBackground !== "";
      case 2:
        return (
          websiteData.company.name &&
          websiteData.company.email &&
          websiteData.company.phone
        );
      case 3:
        return websiteData.colorTheme.id !== "";
      case 4:
        return websiteData.products.length > 0 && 
               websiteData.products.every(product => product.images.length > 0);
      case 5:
        return websiteData.content.heroTitle && websiteData.content.aboutTitle;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleGenerateWebsite();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handlePreview = () => {
    // Generate a preview of the website with current data
    const previewData = {
      ...websiteData,
      isPreview: true
    };
    
    // Create a preview HTML
    const previewHTML = generatePreviewHTML(previewData);
    
    // Open in new window
    const previewWindow = window.open('', '_blank');
    if (previewWindow) {
      previewWindow.document.write(previewHTML);
      previewWindow.document.close();
    }
  };

  const generatePreviewHTML = (data: WebsiteData) => {
    const { company, colorTheme, content, products, industry } = data;
    const { company, colorTheme, content, products, template } = data;
    
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${company.name || 'Preview'}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: ${colorTheme.text || '#333'};
            background-color: ${colorTheme.background || '#fff'};
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
        }
        
        .header {
            background-color: ${colorTheme.primary || '#007bff'};
            color: white;
            padding: 1rem 0;
            position: fixed;
            top: 0;
            width: 100%;
            z-index: 1000;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
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
            font-weight: bold;
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
            color: ${colorTheme.accent || '#ffc107'};
        }
        
        .hero {
            background: linear-gradient(135deg, ${colorTheme.primary || '#007bff'}, ${colorTheme.secondary || '#0056b3'});
            color: white;
            padding: 120px 0 80px;
            text-align: center;
            margin-top: 60px;
        }
        
        .hero h1 {
            font-size: 3rem;
            margin-bottom: 1rem;
            font-weight: bold;
        }
        
        .hero p {
            font-size: 1.2rem;
            margin-bottom: 2rem;
            max-width: 600px;
            margin-left: auto;
            margin-right: auto;
        }
        
        .cta-button {
            background-color: ${colorTheme.accent || '#ffc107'};
            color: ${colorTheme.text || '#333'};
            padding: 15px 30px;
            border: none;
            border-radius: 8px;
            font-size: 1.1rem;
            font-weight: bold;
            cursor: pointer;
            transition: transform 0.3s, box-shadow 0.3s;
        }
        
        .cta-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(0,0,0,0.2);
        }
        
        section {
            padding: 80px 0;
        }
        
        section h2 {
            text-align: center;
            font-size: 2.5rem;
            margin-bottom: 3rem;
            color: ${colorTheme.primary || '#007bff'};
            font-weight: bold;
        }
        
        .services-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            margin-top: 2rem;
        }
        
        .service-card {
            background: white;
            padding: 2rem;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            text-align: center;
            transition: transform 0.3s, box-shadow 0.3s;
            border: 1px solid ${colorTheme.accent || '#ffc107'}20;
        }
        
        .service-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 20px 40px rgba(0,0,0,0.15);
        }
        
        .service-card h3 {
            color: ${colorTheme.primary || '#007bff'};
            margin-bottom: 1rem;
            font-size: 1.3rem;
        }
        
        .products-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 2rem;
            margin-top: 2rem;
        }
        
        .product-card {
            background: white;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            overflow: hidden;
            transition: transform 0.3s, box-shadow 0.3s;
            border: 1px solid ${colorTheme.accent || '#ffc107'}20;
        }
        
        .product-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 20px 40px rgba(0,0,0,0.15);
        }
        
        .product-info {
            padding: 1.5rem;
        }
        
        .product-info h3 {
            color: ${colorTheme.primary || '#007bff'};
            margin-bottom: 0.5rem;
            font-size: 1.2rem;
        }
        
        .product-price {
            font-size: 1.5rem;
            font-weight: bold;
            color: ${colorTheme.primary || '#007bff'};
            margin-top: 1rem;
        }
        
        .contact {
            background: linear-gradient(135deg, ${colorTheme.background || '#f8f9fa'}, ${colorTheme.accent || '#ffc107'}20);
        }
        
        .contact-info {
            text-align: center;
            font-size: 1.1rem;
        }
        
        .contact-info p {
            margin-bottom: 1rem;
            padding: 0.5rem;
        }
        
        .footer {
            background-color: ${colorTheme.text || '#333'};
            color: white;
            text-align: center;
            padding: 2rem 0;
        }
        
        .preview-badge {
            position: fixed;
            top: 80px;
            right: 20px;
            background: #ff6b6b;
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: bold;
            z-index: 1001;
            box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
        }
        
        @media (max-width: 768px) {
            .nav-menu {
                display: none;
            }
            
            .hero h1 {
                font-size: 2rem;
            }
            
            .hero p {
                font-size: 1rem;
            }
            
            section h2 {
                font-size: 2rem;
            }
        }
    </style>
</head>
<body>
    <div class="preview-badge">🔍 PREVIEW MODE</div>
    
    <header class="header">
        <nav class="navbar">
            <div class="nav-brand">
                <h1>${company.name || 'Your Company'}</h1>
            </div>
            <ul class="nav-menu">
                <li><a href="#home">Home</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#services">Services</a></li>
                ${products.length > 0 ? '<li><a href="#products">Products</a></li>' : ''}
                <li><a href="#contact">Contact</a></li>
            </ul>
        </nav>
    </header>

    <main>
        <section id="home" class="hero">
            <div class="hero-content">
                <h1>${content.heroTitle || 'Welcome to Your Business'}</h1>
                <p>${content.heroSubtitle || 'Professional services you can trust'}</p>
                <button class="cta-button">Get Started</button>
            </div>
        </section>

        <section id="about">
            <div class="container">
                <h2>${content.aboutTitle || 'About Us'}</h2>
                <p style="text-align: center; font-size: 1.1rem; max-width: 800px; margin: 0 auto;">
                    ${content.aboutContent || 'We are committed to providing excellent service to our community.'}
                </p>
            </div>
        </section>

        <section id="services">
            <div class="container">
                <h2>${content.servicesTitle || 'Our Services'}</h2>
                <div class="services-grid">
                    ${getTemplateServices(template).map(service => `
                        <div class="service-card">
                            <h3>${service.name}</h3>
                            <p>${service.description}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        </section>

        ${products.length > 0 ? `
        <section id="products">
            <div class="container">
                <h2>Our Products</h2>
                <div class="products-grid">
                    ${products.map(product => `
                        <div class="product-card">
                            <div class="product-info">
                                <h3>${product.name}</h3>
                                <p>${product.description || ''}</p>
                                <div class="product-price">$${product.price.toFixed(2)}</div>
                                ${!product.inStock ? '<p style="color: #ff6b6b; font-weight: bold;">Out of Stock</p>' : ''}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </section>
        ` : ''}

        <section id="contact" class="contact">
            <div class="container">
                <h2>${content.contactTitle || 'Contact Us'}</h2>
                <div class="contact-info">
                    ${company.phone ? `<p><strong>📞 Phone:</strong> ${company.phone}</p>` : ''}
                    ${company.email ? `<p><strong>✉️ Email:</strong> ${company.email}</p>` : ''}
                    ${company.address ? `<p><strong>📍 Address:</strong> ${company.address}</p>` : ''}
                </div>
            </div>
        </section>
    </main>

    <footer class="footer">
        <div class="container">
            <p>${content.footerText || `© 2024 ${company.name || 'Your Company'}. All rights reserved.`}</p>
        </div>
    </footer>
</body>
</html>`;
  };

  const getTemplateServices = (template: WebsiteTemplate) => {
    const serviceMap: { [key: string]: Array<{name: string, description: string}> } = {
      'minimalist-clean': [
        { name: 'Clean Design', description: 'Minimalist approach with focus on content' },
        { name: 'Fast Loading', description: 'Optimized for speed and performance' },
        { name: 'Mobile First', description: 'Perfect experience on all devices' }
      ],
      'bold-modern': [
        { name: 'Eye-catching Design', description: 'Bold visuals that capture attention' },
        { name: 'Interactive Elements', description: 'Engaging user interactions' },
        { name: 'Modern Layouts', description: 'Contemporary design patterns' }
      ],
      'corporate-professional': [
        { name: 'Professional Look', description: 'Trustworthy and business-focused design' },
        { name: 'Data Presentation', description: 'Clear information architecture' },
        { name: 'Corporate Standards', description: 'Meets enterprise requirements' }
      ],
      'creative-artistic': [
        { name: 'Artistic Expression', description: 'Creative and unique visual elements' },
        { name: 'Fluid Animations', description: 'Smooth and engaging transitions' },
        { name: 'Visual Storytelling', description: 'Narrative-driven design approach' }
      ]
    };

    return serviceMap[template.id] || [
      { name: 'Professional Service', description: 'High-quality service tailored to your needs' },
      { name: 'Expert Consultation', description: 'Professional advice and guidance' },
      { name: 'Customer Support', description: '24/7 customer support and assistance' }
    ];
  };

  const handleSave = () => {
    // Save as draft
    localStorage.setItem('websiteBuilderDraft', JSON.stringify(websiteData));
    alert("Draft saved successfully!");
  };

  const handleGenerateWebsite = async () => {
    setIsGenerating(true);
    try {
      const authToken = localStorage.getItem("authToken");
      const response = await websiteAPI.generateWebsite(websiteData, authToken);
      setGeneratedWebsite(response.data);
    } catch (error) {
      console.error("Error generating website:", error);
      alert("Error generating website. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadWebsite = async () => {
    if (!generatedWebsite?.websiteId) return;

    try {
      const response = await websiteAPI.downloadWebsite(
        generatedWebsite.websiteId
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `${websiteData.company.name || "website"}.zip`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading website:", error);
      alert("Error downloading website. Please try again.");
    }
  };

  const renderCurrentStep = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading website data...</p>
          </div>
        </div>
      );
    }

    switch (currentStep) {
      case 0:
        return (
          <TemplateSelection
            selectedTemplate={websiteData.template.id ? websiteData.template : null}
            onSelect={handleTemplateSelect}
          />
        );
      case 1:
        return (
          <VisualAssets
            visualAssets={websiteData.visualAssets}
            onChange={handleVisualAssetsChange}
          />
        );
      case 2:
        return (
          <CompanyDetails
            companyDetails={websiteData.company}
            onChange={handleCompanyDetailsChange}
          />
        );
      case 3:
        return (
          <ColorTheme
            selectedTheme={websiteData.colorTheme.id}
            onSelect={handleColorThemeSelect}
          />
        );
      case 4:
        return (
          <ProductManagement
            products={websiteData.products}
            onChange={handleProductsChange}
          />
        );
      case 5:
        return (
          <ContentCustomization
            content={websiteData.content}
            onChange={handleContentChange}
          />
        );
      case 6:
        return (
          <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
                {generatedWebsite
                  ? "🎉 Website Generated Successfully!"
                  : "Review Your Website"}
              </h2>
              <p className="text-xl text-gray-600">
                {generatedWebsite
                  ? "Your website is ready! Preview it below or download the complete code package."
                  : "Review all the information before generating your professional website"}
              </p>
            </div>
            
            {!generatedWebsite ? (
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <span className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center text-white text-sm font-bold mr-3">✓</span>
                  Website Summary
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                      <h4 className="font-semibold text-blue-900 mb-2 flex items-center">
                        <span className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs mr-2">T</span>
                        Template
                      </h4>
                      <p className="text-blue-700 font-medium">{websiteData.template.name}</p>
                    </div>
                    <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                      <h4 className="font-semibold text-green-900 mb-2 flex items-center">
                        <span className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-xs mr-2">C</span>
                        Company
                      </h4>
                      <p className="text-green-700 font-medium">{websiteData.company.name}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
                      <h4 className="font-semibold text-yellow-900 mb-2 flex items-center">
                        <span className="w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center text-white text-xs mr-2">A</span>
                        Visual Assets
                      </h4>
                      <p className="text-yellow-700 font-medium">
                        {websiteData.visualAssets.heroBackground ? '✓' : '✗'} Hero Background, 
                        {websiteData.visualAssets.productImages.length} Product Images
                      </p>
                    </div>
                    <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                      <h4 className="font-semibold text-purple-900 mb-2 flex items-center">
                        <span className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs mr-2">T</span>
                        Color Theme
                      </h4>
                      <p className="text-purple-700 font-medium">{websiteData.colorTheme.name}</p>
                    </div>
                  </div>
                </div>
                
                {isGenerating && (
                  <div className="mt-8 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200">
                    <div className="flex items-center justify-center space-x-3">
                      <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-indigo-700 font-medium">Generating your website...</span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-8">
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                      <span className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center text-white text-sm mr-3">🌐</span>
                      Website Preview
                    </h3>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => window.open(generatedWebsite.previewUrl, '_blank')}
                        className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                      >
                        <span>🔗</span>
                        <span>Open in New Tab</span>
                      </button>
                      <button
                        onClick={handleDownloadWebsite}
                        className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                      >
                        <span>📦</span>
                        <span>Download Code</span>
                      </button>
                    </div>
                  </div>
                  <div className="border-2 border-gray-200 rounded-xl overflow-hidden shadow-inner bg-white">
                    <iframe
                      src={generatedWebsite.previewUrl}
                      className="w-full h-[600px]"
                      title="Website Preview"
                      style={{ border: 'none' }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header />
      <ProgressBar
        currentStep={currentStep}
        totalSteps={steps.length}
        steps={steps}
      />
      <main className="pb-24">{renderCurrentStep()}</main>
      <NavigationButtons
        currentStep={currentStep}
        totalSteps={steps.length}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onPreview={handlePreview}
        onSave={handleSave}
        canProceed={canProceed()}
      />
    </div>
  );
}