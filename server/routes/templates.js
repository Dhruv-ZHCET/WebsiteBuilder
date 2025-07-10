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

export default router;