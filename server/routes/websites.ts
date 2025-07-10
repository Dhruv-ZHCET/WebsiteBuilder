import express from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';
import { validateRequest, schemas } from '../middleware/validation';

const router = express.Router();
const prisma = new PrismaClient();

// Get all websites for user
router.get('/', async (req: AuthRequest, res, next) => {
  try {
    const websites = await prisma.website.findMany({
      where: { userId: req.user!.id },
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
router.get('/:id', async (req: AuthRequest, res, next) => {
  try {
    const website = await prisma.website.findFirst({
      where: {
        id: req.params.id,
        userId: req.user!.id
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
router.post('/', validateRequest(schemas.website), async (req: AuthRequest, res, next) => {
  try {
    const { name, industry, domain } = req.body;

    const website = await prisma.website.create({
      data: {
        name,
        industry,
        domain,
        userId: req.user!.id
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
router.put('/:id', async (req: AuthRequest, res, next) => {
  try {
    const { name, industry, domain, status } = req.body;

    const website = await prisma.website.findFirst({
      where: {
        id: req.params.id,
        userId: req.user!.id
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
router.put('/:id/company', validateRequest(schemas.companyDetails), async (req: AuthRequest, res, next) => {
  try {
    const websiteId = req.params.id;
    const companyData = req.body;

    // Verify website ownership
    const website = await prisma.website.findFirst({
      where: {
        id: websiteId,
        userId: req.user!.id
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
router.put('/:id/theme', validateRequest(schemas.colorTheme), async (req: AuthRequest, res, next) => {
  try {
    const websiteId = req.params.id;
    const themeData = req.body;

    // Verify website ownership
    const website = await prisma.website.findFirst({
      where: {
        id: websiteId,
        userId: req.user!.id
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
router.put('/:id/content', async (req: AuthRequest, res, next) => {
  try {
    const websiteId = req.params.id;
    const { sections } = req.body;

    // Verify website ownership
    const website = await prisma.website.findFirst({
      where: {
        id: websiteId,
        userId: req.user!.id
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
      data: sections.map((section: any, index: number) => ({
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
router.post('/:id/publish', async (req: AuthRequest, res, next) => {
  try {
    const websiteId = req.params.id;

    // Verify website ownership
    const website = await prisma.website.findFirst({
      where: {
        id: websiteId,
        userId: req.user!.id
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

// Delete website
router.delete('/:id', async (req: AuthRequest, res, next) => {
  try {
    const website = await prisma.website.findFirst({
      where: {
        id: req.params.id,
        userId: req.user!.id
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