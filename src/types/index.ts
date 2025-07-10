export interface CompanyDetails {
  name: string;
  tagline: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  website: string;
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
  industry: string;
  company: CompanyDetails;
  products: Product[];
  colorTheme: ColorTheme;
  content: {
    heroTitle: string;
    heroSubtitle: string;
    aboutTitle: string;
    aboutContent: string;
    servicesTitle: string;
    contactTitle: string;
    footerText: string;
  };
}