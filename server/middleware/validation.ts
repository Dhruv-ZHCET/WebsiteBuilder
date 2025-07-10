import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';

export const validateRequest = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.details.map(detail => detail.message)
      });
    }
    next();
  };
};

// Validation schemas
export const schemas = {
  register: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),

  website: Joi.object({
    name: Joi.string().min(1).max(200).required(),
    industry: Joi.string().required(),
    domain: Joi.string().optional()
  }),

  companyDetails: Joi.object({
    name: Joi.string().min(1).max(200).required(),
    tagline: Joi.string().max(500).optional(),
    description: Joi.string().max(2000).optional(),
    address: Joi.string().max(500).optional(),
    phone: Joi.string().max(20).optional(),
    email: Joi.string().email().optional(),
    website: Joi.string().uri().optional()
  }),

  product: Joi.object({
    name: Joi.string().min(1).max(200).required(),
    description: Joi.string().max(1000).optional(),
    price: Joi.number().min(0).required(),
    sku: Joi.string().min(1).max(100).required(),
    category: Joi.string().max(100).optional(),
    inStock: Joi.boolean().default(true),
    featured: Joi.boolean().default(false)
  }),

  colorTheme: Joi.object({
    name: Joi.string().min(1).max(100).required(),
    primary: Joi.string().pattern(/^#[0-9A-F]{6}$/i).required(),
    secondary: Joi.string().pattern(/^#[0-9A-F]{6}$/i).required(),
    accent: Joi.string().pattern(/^#[0-9A-F]{6}$/i).required(),
    background: Joi.string().pattern(/^#[0-9A-F]{6}$/i).required(),
    text: Joi.string().pattern(/^#[0-9A-F]{6}$/i).required(),
    preview: Joi.string().required()
  })
};