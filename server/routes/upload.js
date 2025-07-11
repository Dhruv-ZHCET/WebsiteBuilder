import express from 'express';
import { 
  heroImageUpload, 
  productImageUpload, 
  logoUpload, 
  deleteCloudinaryImage,
  getOptimizedImageUrl 
} from '../utils/cloudinaryConfig.js';

const router = express.Router();

// Upload hero background image
router.post('/hero-image', heroImageUpload.single('heroImage'), (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No hero image uploaded' });
    }

    const optimizedUrl = getOptimizedImageUrl(req.file.filename, {
      width: 1920,
      height: 1080,
      crop: 'fill',
      gravity: 'center'
    });

    res.json({
      message: 'Hero image uploaded successfully',
      image: {
        publicId: req.file.filename,
        url: req.file.path,
        optimizedUrl,
        originalName: req.file.originalname,
        size: req.file.bytes,
        format: req.file.format,
        width: req.file.width,
        height: req.file.height
      }
    });
  } catch (error) {
    next(error);
  }
});

// Upload product images (multiple)
router.post('/product-images', productImageUpload.array('productImages', 10), (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No product images uploaded' });
    }

    const images = req.files.map(file => {
      const optimizedUrl = getOptimizedImageUrl(file.filename, {
        width: 500,
        height: 500,
        crop: 'fill',
        gravity: 'center'
      });

      return {
        publicId: file.filename,
        url: file.path,
        optimizedUrl,
        originalName: file.originalname,
        size: file.bytes,
        format: file.format,
        width: file.width,
        height: file.height
      };
    });

    res.json({
      message: 'Product images uploaded successfully',
      images
    });
  } catch (error) {
    next(error);
  }
});

// Upload single product image
router.post('/product-image', productImageUpload.single('productImage'), (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No product image uploaded' });
    }

    const optimizedUrl = getOptimizedImageUrl(req.file.filename, {
      width: 500,
      height: 500,
      crop: 'fill',
      gravity: 'center'
    });

    res.json({
      message: 'Product image uploaded successfully',
      image: {
        publicId: req.file.filename,
        url: req.file.path,
        optimizedUrl,
        originalName: req.file.originalname,
        size: req.file.bytes,
        format: req.file.format,
        width: req.file.width,
        height: req.file.height
      }
    });
  } catch (error) {
    next(error);
  }
});

// Upload logo
router.post('/logo', logoUpload.single('logo'), (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No logo uploaded' });
    }

    const optimizedUrl = getOptimizedImageUrl(req.file.filename, {
      width: 300,
      height: 300,
      crop: 'fit',
      background: 'transparent'
    });

    res.json({
      message: 'Logo uploaded successfully',
      image: {
        publicId: req.file.filename,
        url: req.file.path,
        optimizedUrl,
        originalName: req.file.originalname,
        size: req.file.bytes,
        format: req.file.format,
        width: req.file.width,
        height: file.height
      }
    });
  } catch (error) {
    next(error);
  }
});

// Delete image from Cloudinary
router.delete('/:publicId', async (req, res, next) => {
  try {
    const { publicId } = req.params;
    
    // Extract the actual public ID from the full path if needed
    const actualPublicId = publicId.includes('/') ? publicId : `websiteboss/${publicId}`;
    
    const result = await deleteCloudinaryImage(actualPublicId);
    
    if (result.result === 'ok') {
      res.json({ message: 'Image deleted successfully' });
    } else {
      res.status(404).json({ error: 'Image not found or already deleted' });
    }
  } catch (error) {
    next(error);
  }
});

// Get optimized image URL
router.get('/optimize/:publicId', (req, res, next) => {
  try {
    const { publicId } = req.params;
    const { width, height, crop = 'fill', quality = 'auto' } = req.query;
    
    const optimizedUrl = getOptimizedImageUrl(publicId, {
      width: width ? parseInt(width) : undefined,
      height: height ? parseInt(height) : undefined,
      crop,
      quality
    });
    
    res.json({ optimizedUrl });
  } catch (error) {
    next(error);
  }
});

export default router;