export interface CompanyDetails {
  name: string;
  tagline: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  websiteName: string;
  logo?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  sku: string;
  category: string;
  image?: string;
  inStock: boolean;
}

export interface ColorTheme {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  preview: string;
}

export interface VisualAssets {
  heroBackground: string;
  productImages: string[];
  logo?: string;
  testimonialImages?: string[];
  galleryImages?: string[];
}

export interface WebsiteTemplate {
  id: string;
  name: string;
  description: string;
  category: 'minimalist' | 'bold' | 'corporate' | 'creative';
  preview: string;
  features: string[];
  sections: string[];
  colorSchemes: string[];
  demoUrl?: string;
}

export interface IndustryTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  pages: string[];
  sections: string[];
  features: string[];
}

export interface WebsiteData {
  template: WebsiteTemplate;
  company: CompanyDetails;
  products: Product[];
  colorTheme: ColorTheme;
  visualAssets: VisualAssets;
  content: {
    heroTitle: string;
    heroSubtitle: string;
    aboutTitle: string;
    aboutContent: string;
    servicesTitle: string;
    contactTitle: string;
    footerText: string;
  };
  settings: {
    darkModeEnabled: boolean;
    animationsEnabled: boolean;
    responsiveImages: boolean;
  };
}

export interface UploadedFile {
  id: string;
  name: string;
  url: string;
  type: 'hero-background' | 'product' | 'logo' | 'testimonial' | 'gallery';
  size: number;
}