import { IndustryTemplate, ColorTheme, WebsiteTemplate } from '../types';

export const websiteTemplates: WebsiteTemplate[] = [
  {
    id: 'minimalist-clean',
    name: 'Minimalist Clean',
    description: 'Clean, spacious design with focus on content and subtle animations',
    category: 'minimalist',
    preview: '/templates/minimalist-clean.jpg',
    features: ['Clean Typography', 'Subtle Animations', 'Spacious Layout', 'Mobile-First'],
    sections: ['Hero', 'About', 'Services', 'Portfolio', 'Contact'],
    colorSchemes: ['monochrome', 'soft-blues', 'warm-grays'],
    demoUrl: '/demo/minimalist-clean'
  },
  {
    id: 'bold-modern',
    name: 'Bold & Modern',
    description: 'Eye-catching design with vibrant colors and dynamic layouts',
    category: 'bold',
    preview: '/templates/bold-modern.jpg',
    features: ['Vibrant Colors', 'Dynamic Layouts', 'Interactive Elements', 'Bold Typography'],
    sections: ['Hero', 'Features', 'Showcase', 'Testimonials', 'Contact'],
    colorSchemes: ['vibrant-gradients', 'neon-accents', 'bold-contrasts'],
    demoUrl: '/demo/bold-modern'
  },
  {
    id: 'corporate-professional',
    name: 'Corporate Professional',
    description: 'Professional and trustworthy design perfect for business websites',
    category: 'corporate',
    preview: '/templates/corporate-professional.jpg',
    features: ['Professional Layout', 'Trust Elements', 'Data Visualization', 'Clean Forms'],
    sections: ['Hero', 'Services', 'About', 'Team', 'Contact'],
    colorSchemes: ['corporate-blues', 'professional-grays', 'trust-greens'],
    demoUrl: '/demo/corporate-professional'
  },
  {
    id: 'creative-artistic',
    name: 'Creative & Artistic',
    description: 'Unique and creative design with artistic elements and fluid animations',
    category: 'creative',
    preview: '/templates/creative-artistic.jpg',
    features: ['Artistic Elements', 'Fluid Animations', 'Creative Layouts', 'Visual Storytelling'],
    sections: ['Hero', 'Portfolio', 'About', 'Process', 'Contact'],
    colorSchemes: ['artistic-palette', 'creative-gradients', 'expressive-colors'],
    demoUrl: '/demo/creative-artistic'
  }
];

export const industryTemplates: IndustryTemplate[] = [
  {
    id: 'pharmacy',
    name: 'Pharmacy',
    description: 'Complete pharmacy website with medicine catalog and online ordering',
    icon: 'Pill',
    pages: ['Home', 'Products', 'Services', 'About', 'Contact'],
    sections: ['Hero', 'Featured Products', 'Services', 'About Us', 'Contact'],
    features: ['Medicine Catalog', 'Online Ordering', 'Prescription Upload', 'Store Locator']
  },
  {
    id: 'cosmetics',
    name: 'Cosmetics',
    description: 'Beautiful cosmetics website with product showcase and e-commerce',
    icon: 'Sparkles',
    pages: ['Home', 'Products', 'Beauty Tips', 'About', 'Contact'],
    sections: ['Hero Banner', 'Product Categories', 'Beauty Tips', 'Brand Story', 'Contact'],
    features: ['Product Catalog', 'Beauty Blog', 'Wishlist', 'Reviews & Ratings']
  },
  {
    id: 'education',
    name: 'Education',
    description: 'Educational institution website with courses and admissions',
    icon: 'GraduationCap',
    pages: ['Home', 'Courses', 'Admissions', 'About', 'Contact'],
    sections: ['Hero', 'Courses', 'Admissions', 'Faculty', 'Contact'],
    features: ['Course Catalog', 'Online Applications', 'Student Portal', 'News & Events']
  }
];

export const colorThemes: ColorTheme[] = [
  {
    id: 'modern-blue',
    name: 'Modern Blue',
    primary: '#3B82F6',
    secondary: '#1E40AF',
    accent: '#60A5FA',
    background: '#F8FAFC',
    text: '#1F2937',
    preview: 'linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%)'
  },
  {
    id: 'elegant-purple',
    name: 'Elegant Purple',
    primary: '#8B5CF6',
    secondary: '#7C3AED',
    accent: '#A78BFA',
    background: '#FAFAFA',
    text: '#374151',
    preview: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)'
  },
  {
    id: 'warm-orange',
    name: 'Warm Orange',
    primary: '#F97316',
    secondary: '#EA580C',
    accent: '#FB923C',
    background: '#FFFBF7',
    text: '#1F2937',
    preview: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)'
  },
  {
    id: 'fresh-green',
    name: 'Fresh Green',
    primary: '#10B981',
    secondary: '#059669',
    accent: '#34D399',
    background: '#F0FDF4',
    text: '#1F2937',
    preview: 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
  },
  {
    id: 'professional-gray',
    name: 'Professional Gray',
    primary: '#6B7280',
    secondary: '#4B5563',
    accent: '#9CA3AF',
    background: '#F9FAFB',
    text: '#111827',
    preview: 'linear-gradient(135deg, #6B7280 0%, #4B5563 100%)'
  },
  {
    id: 'vibrant-pink',
    name: 'Vibrant Pink',
    primary: '#EC4899',
    secondary: '#DB2777',
    accent: '#F472B6',
    background: '#FEF7F7',
    text: '#1F2937',
    preview: 'linear-gradient(135deg, #EC4899 0%, #DB2777 100%)'
  },
  {
    id: 'monochrome',
    name: 'Monochrome',
    primary: '#000000',
    secondary: '#374151',
    accent: '#6B7280',
    background: '#FFFFFF',
    text: '#111827',
    preview: 'linear-gradient(135deg, #000000 0%, #374151 100%)'
  },
  {
    id: 'soft-blues',
    name: 'Soft Blues',
    primary: '#0EA5E9',
    secondary: '#0284C7',
    accent: '#38BDF8',
    background: '#F0F9FF',
    text: '#0C4A6E',
    preview: 'linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)'
  }
];