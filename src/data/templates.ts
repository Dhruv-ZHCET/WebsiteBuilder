import { IndustryTemplate, ColorTheme } from '../types';

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
    id: 'restaurant',
    name: 'Restaurant',
    description: 'Restaurant website with menu, reservations, and online ordering',
    icon: 'UtensilsCrossed',
    pages: ['Home', 'Menu', 'Reservations', 'About', 'Contact'],
    sections: ['Hero', 'Menu Highlights', 'Reservations', 'About', 'Location'],
    features: ['Digital Menu', 'Table Reservations', 'Online Ordering', 'Event Booking']
  },
  {
    id: 'clothing',
    name: 'Clothing Store',
    description: 'Fashion e-commerce website with collections and shopping cart',
    icon: 'Shirt',
    pages: ['Home', 'Collections', 'Sale', 'About', 'Contact'],
    sections: ['Hero', 'New Arrivals', 'Collections', 'Sale Items', 'Contact'],
    features: ['Product Catalog', 'Shopping Cart', 'Size Guide', 'Style Blog']
  },
  {
    id: 'fitness',
    name: 'Fitness Center',
    description: 'Fitness center website with class schedules and membership plans',
    icon: 'Dumbbell',
    pages: ['Home', 'Classes', 'Membership', 'Trainers', 'Contact'],
    sections: ['Hero', 'Classes', 'Membership Plans', 'Trainers', 'Contact'],
    features: ['Class Booking', 'Membership Management', 'Trainer Profiles', 'Progress Tracking']
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
  }
];