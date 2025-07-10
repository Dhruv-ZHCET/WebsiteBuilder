import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Get all industry templates
router.get('/industries', async (req, res, next) => {
  try {
    const templates = await prisma.industryTemplate.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' }
    });

    res.json({ templates });
  } catch (error) {
    next(error);
  }
});

// Get single industry template
router.get('/industries/:id', async (req, res, next) => {
  try {
    const template = await prisma.industryTemplate.findFirst({
      where: {
        id: req.params.id,
        isActive: true
      }
    });

    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }

    res.json({ template });
  } catch (error) {
    next(error);
  }
});

// Predefined color themes
const colorThemes = [
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

// Get color themes
router.get('/themes', async (req, res) => {
  res.json({ themes: colorThemes });
});

// Preview template with dummy data
router.get('/preview/:templateId', async (req, res, next) => {
  try {
    const { templateId } = req.params;
    
    const dummyData = {
      pharmacy: {
        company: {
          name: 'HealthCare Pharmacy',
          tagline: 'Your trusted healthcare partner',
          description: 'Professional pharmacy services with expert care',
          phone: '+1 (555) 123-4567',
          email: 'info@healthcarepharmacy.com',
          address: '123 Health Street, Medical District, City 12345'
        },
        products: [
          { name: 'Prescription Medications', price: 25.99, description: 'Professional prescription services' },
          { name: 'Health Supplements', price: 15.99, description: 'Quality vitamins and supplements' },
          { name: 'Medical Supplies', price: 8.99, description: 'Essential medical equipment' }
        ],
        theme: {
          primary: '#3B82F6',
          secondary: '#1E40AF',
          accent: '#60A5FA',
          background: '#F8FAFC',
          text: '#1F2937'
        }
      },
      cosmetics: {
        company: {
          name: 'Glamour Beauty',
          tagline: 'Unleash your natural beauty',
          description: 'Premium cosmetics and beauty products',
          phone: '+1 (555) 987-6543',
          email: 'hello@glamourbeauty.com',
          address: '456 Beauty Avenue, Fashion District, City 67890'
        },
        products: [
          { name: 'Luxury Lipstick', price: 35.99, description: 'Long-lasting premium lipstick' },
          { name: 'Foundation Set', price: 49.99, description: 'Complete foundation collection' },
          { name: 'Eye Shadow Palette', price: 28.99, description: 'Professional eye makeup palette' }
        ],
        theme: {
          primary: '#EC4899',
          secondary: '#DB2777',
          accent: '#F472B6',
          background: '#FEF7F7',
          text: '#1F2937'
        }
      },
      education: {
        company: {
          name: 'Excellence Academy',
          tagline: 'Empowering future leaders',
          description: 'Quality education and innovative learning experiences',
          phone: '+1 (555) 456-7890',
          email: 'admissions@excellenceacademy.edu',
          address: '789 Education Blvd, Academic District, City 13579'
        },
        products: [
          { name: 'Computer Science Program', price: 2500.00, description: 'Comprehensive CS curriculum' },
          { name: 'Business Administration', price: 2200.00, description: 'MBA and business courses' },
          { name: 'Online Courses', price: 299.99, description: 'Flexible online learning' }
        ],
        theme: {
          primary: '#10B981',
          secondary: '#059669',
          accent: '#34D399',
          background: '#F0FDF4',
          text: '#1F2937'
        }
      }
    };

    const templateData = dummyData[templateId] || dummyData.pharmacy;
    res.json({ templateData });
  } catch (error) {
    next(error);
  }
});

export default router;