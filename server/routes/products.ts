import express from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';
import { validateRequest, schemas } from '../middleware/validation';

const router = express.Router();
const prisma = new PrismaClient();

// Get products for a website
router.get('/website/:websiteId', async (req: AuthRequest, res, next) => {
  try {
    const { websiteId } = req.params;

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

    const products = await prisma.product.findMany({
      where: { websiteId },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ products });
  } catch (error) {
    next(error);
  }
});

// Get single product
router.get('/:id', async (req: AuthRequest, res, next) => {
  try {
    const product = await prisma.product.findFirst({
      where: {
        id: req.params.id,
        website: {
          userId: req.user!.id
        }
      },
      include: {
        website: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ product });
  } catch (error) {
    next(error);
  }
});

// Create product
router.post('/', validateRequest(schemas.product), async (req: AuthRequest, res, next) => {
  try {
    const { websiteId, ...productData } = req.body;

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

    const product = await prisma.product.create({
      data: {
        ...productData,
        websiteId
      }
    });

    res.status(201).json({
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    next(error);
  }
});

// Update product
router.put('/:id', validateRequest(schemas.product), async (req: AuthRequest, res, next) => {
  try {
    const productData = req.body;

    // Verify product ownership
    const existingProduct = await prisma.product.findFirst({
      where: {
        id: req.params.id,
        website: {
          userId: req.user!.id
        }
      }
    });

    if (!existingProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: productData
    });

    res.json({
      message: 'Product updated successfully',
      product
    });
  } catch (error) {
    next(error);
  }
});

// Delete product
router.delete('/:id', async (req: AuthRequest, res, next) => {
  try {
    // Verify product ownership
    const product = await prisma.product.findFirst({
      where: {
        id: req.params.id,
        website: {
          userId: req.user!.id
        }
      }
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    await prisma.product.delete({
      where: { id: req.params.id }
    });

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    next(error);
  }
});

// Bulk update products
router.put('/website/:websiteId/bulk', async (req: AuthRequest, res, next) => {
  try {
    const { websiteId } = req.params;
    const { products } = req.body;

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

    // Delete existing products
    await prisma.product.deleteMany({
      where: { websiteId }
    });

    // Create new products
    const createdProducts = await prisma.product.createMany({
      data: products.map((product: any) => ({
        ...product,
        websiteId
      }))
    });

    res.json({
      message: 'Products updated successfully',
      count: createdProducts.count
    });
  } catch (error) {
    next(error);
  }
});

export default router;