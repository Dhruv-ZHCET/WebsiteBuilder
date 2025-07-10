import express from 'express';
import { PrismaClient } from '@prisma/client';
import { validateRequest, schemas } from '../middleware/validation.js';
import { WebsiteGenerator } from '../utils/websiteGenerator.js';
import archiver from 'archiver';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const prisma = new PrismaClient();
const websiteGenerator = new WebsiteGenerator();

// Get all websites for user
router.get('/', async (req, res, next) => {
  try {
    const websites = await prisma.website.findMany({
      where: { userId: req.user.id },
      include: {
        company: true,
        theme: true,
        _count: {
          select: {
            products: true,
            pages: true
          }
        }
      },
      orderBy: { updatedAt: 'desc' }
    });

    res.json({ websites });
  } catch (error) {
    next(error);
  }
});

// Get single website
router.get('/:id', async (req, res, next) => {
  try {
    const website = await prisma.website.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id
      },
      include: {
        company: true,
        products: true,
        theme: true,
        content: {
          orderBy: { order: 'asc' }
        },
        pages: {
          orderBy: { order: 'asc' }
        }
      }
    });

    if (!website) {
      return res.status(404).json({ error: 'Website not found' });
    }

    res.json({ website });
  } catch (error) {
    next(error);
  }
});

// Create website
router.post('/', validateRequest(schemas.website), async (req, res, next) => {
  try {
    const { name, industry, domain } = req.body;

    const website = await prisma.website.create({
      data: {
        name,
        industry,
        domain,
        userId: req.user.id
      },
      include: {
        company: true,
        theme: true
      }
    });

    res.status(201).json({
      message: 'Website created successfully',
      website
    });
  } catch (error) {
    next(error);
  }
});

// Update website
router.put('/:id', async (req, res, next) => {
  try {
    const { name, industry, domain, status } = req.body;

    const website = await prisma.website.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!website) {
      return res.status(404).json({ error: 'Website not found' });
    }

    const updatedWebsite = await prisma.website.update({
      where: { id: req.params.id },
      data: {
        ...(name && { name }),
        ...(industry && { industry }),
        ...(domain && { domain }),
        ...(status && { status })
      },
      include: {
        company: true,
        theme: true
      }
    });

    res.json({
      message: 'Website updated successfully',
      website: updatedWebsite
    });
  } catch (error) {
    next(error);
  }
});

// Update company details
router.put('/:id/company', validateRequest(schemas.companyDetails), async (req, res, next) => {
  try {
    const websiteId = req.params.id;
    const companyData = req.body;

    // Verify website ownership
    const website = await prisma.website.findFirst({
      where: {
        id: websiteId,
        userId: req.user.id
      }
    });

    if (!website) {
      return res.status(404).json({ error: 'Website not found' });
    }

    const company = await prisma.companyDetails.upsert({
      where: { websiteId },
      update: companyData,
      create: {
        ...companyData,
        websiteId
      }
    });

    res.json({
      message: 'Company details updated successfully',
      company
    });
  } catch (error) {
    next(error);
  }
});

// Update color theme
router.put('/:id/theme', validateRequest(schemas.colorTheme), async (req, res, next) => {
  try {
    const websiteId = req.params.id;
    const themeData = req.body;

    // Verify website ownership
    const website = await prisma.website.findFirst({
      where: {
        id: websiteId,
        userId: req.user.id
      }
    });

    if (!website) {
      return res.status(404).json({ error: 'Website not found' });
    }

    const theme = await prisma.colorTheme.upsert({
      where: { websiteId },
      update: themeData,
      create: {
        ...themeData,
        websiteId
      }
    });

    res.json({
      message: 'Color theme updated successfully',
      theme
    });
  } catch (error) {
    next(error);
  }
});

// Update content sections
router.put('/:id/content', async (req, res, next) => {
  try {
    const websiteId = req.params.id;
    const { sections } = req.body;

    // Verify website ownership
    const website = await prisma.website.findFirst({
      where: {
        id: websiteId,
        userId: req.user.id
      }
    });

    if (!website) {
      return res.status(404).json({ error: 'Website not found' });
    }

    // Delete existing content sections
    await prisma.contentSection.deleteMany({
      where: { websiteId }
    });

    // Create new content sections
    const contentSections = await prisma.contentSection.createMany({
      data: sections.map((section, index) => ({
        ...section,
        websiteId,
        order: index
      }))
    });

    res.json({
      message: 'Content updated successfully',
      contentSections
    });
  } catch (error) {
    next(error);
  }
});

// Publish website
router.post('/:id/publish', async (req, res, next) => {
  try {
    const websiteId = req.params.id;

    // Verify website ownership
    const website = await prisma.website.findFirst({
      where: {
        id: websiteId,
        userId: req.user.id
      }
    });

    if (!website) {
      return res.status(404).json({ error: 'Website not found' });
    }

    const publishedWebsite = await prisma.website.update({
      where: { id: websiteId },
      data: {
        status: 'PUBLISHED',
        isPublished: true
      }
    });

    res.json({
      message: 'Website published successfully',
      website: publishedWebsite
    });
  } catch (error) {
    next(error);
  }
});

// Generate website
router.post('/generate', async (req, res, next) => {
  try {
    const websiteData = req.body;
    console.log(websiteData)
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;
    console.log(userId)
    // Create website record
    const website = await prisma.website.create({
      data: {
        name: websiteData.company.name || 'Generated Website',
        industry: websiteData.industry,
        userId,
        status: 'DRAFT'
      }
    });

    // Create company details
    if (websiteData.company) {
      await prisma.companyDetails.create({
        data: {
          ...websiteData.company,
          websiteId: website.id
        }
      });
    }

    // Create color theme
    if (websiteData.colorTheme) {
      await prisma.colorTheme.create({
        data: {
          ...websiteData.colorTheme,
          websiteId: website.id
        }
      });
    }

    // Create products
    if (websiteData.products && websiteData.products.length > 0) {
      await prisma.product.createMany({
        data: websiteData.products.map(product => ({
          ...product,
          websiteId: website.id
        }))
      });
    }

    // Create content sections
    if (websiteData.content) {
      const contentSections = [
        { type: 'HERO', title: websiteData.content.heroTitle, content: websiteData.content.heroSubtitle, order: 0 },
        { type: 'ABOUT', title: websiteData.content.aboutTitle, content: websiteData.content.aboutContent, order: 1 },
        { type: 'SERVICES', title: websiteData.content.servicesTitle, content: '', order: 2 },
        { type: 'CONTACT', title: websiteData.content.contactTitle, content: '', order: 3 },
        { type: 'FOOTER', title: '', content: websiteData.content.footerText, order: 4 }
      ];

      await prisma.contentSection.createMany({
        data: contentSections.map(section => ({
          ...section,
          websiteId: website.id
        }))
      });
    }

    // Generate website files
    const websiteDir = await websiteGenerator.generateWebsite(website.id);
    
    res.json({
      message: 'Website generated successfully',
      websiteId: website.id,
      previewUrl: `http://localhost:3001/generated/${website.id}/index.html`,
      websiteDir
    });
  } catch (error) {
    next(error);
  }
});

// Download website as ZIP
router.get('/:id/download', async (req, res, next) => {
  try {
    const websiteId = req.params.id;
    
    // Verify website ownership
    const website = await prisma.website.findFirst({
      where: {
        id: websiteId,
        userId: req.user.id
      }
    });

    if (!website) {
      return res.status(404).json({ error: 'Website not found' });
    }

    const websiteDir = path.join(__dirname, '../generated-websites', websiteId);
    
    if (!fs.existsSync(websiteDir)) {
      return res.status(404).json({ error: 'Website files not found' });
    }

    // Create ZIP archive
    const archive = archiver('zip', {
      zlib: { level: 9 }
    });

    res.attachment(`${website.name || 'website'}.zip`);
    archive.pipe(res);

    // Add files to archive
    archive.directory(websiteDir, false);
    archive.finalize();

  } catch (error) {
    next(error);
  }
});

// Delete website
router.delete('/:id', async (req, res, next) => {
  try {
    const website = await prisma.website.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!website) {
      return res.status(404).json({ error: 'Website not found' });
    }

    await prisma.website.delete({
      where: { id: req.params.id }
    });

    res.json({ message: 'Website deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;