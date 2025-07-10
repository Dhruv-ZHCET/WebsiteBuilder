import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedDatabase() {
  try {
    console.log('🌱 Seeding database...');

    // Seed industry templates
    const industryTemplates = [
      {
        name: 'Pharmacy',
        description: 'Complete pharmacy website with medicine catalog and online ordering',
        icon: 'Pill',
        pages: ['Home', 'Products', 'Services', 'About', 'Contact'],
        sections: ['Hero', 'Featured Products', 'Services', 'About Us', 'Contact'],
        features: ['Medicine Catalog', 'Online Ordering', 'Prescription Upload', 'Store Locator']
      },
      {
        name: 'Cosmetics',
        description: 'Beautiful cosmetics website with product showcase and e-commerce',
        icon: 'Sparkles',
        pages: ['Home', 'Products', 'Beauty Tips', 'About', 'Contact'],
        sections: ['Hero Banner', 'Product Categories', 'Beauty Tips', 'Brand Story', 'Contact'],
        features: ['Product Catalog', 'Beauty Blog', 'Wishlist', 'Reviews & Ratings']
      },
      {
        name: 'Restaurant',
        description: 'Restaurant website with menu, reservations, and online ordering',
        icon: 'UtensilsCrossed',
        pages: ['Home', 'Menu', 'Reservations', 'About', 'Contact'],
        sections: ['Hero', 'Menu Highlights', 'Reservations', 'About', 'Location'],
        features: ['Digital Menu', 'Table Reservations', 'Online Ordering', 'Event Booking']
      },
      {
        name: 'Clothing Store',
        description: 'Fashion e-commerce website with collections and shopping cart',
        icon: 'Shirt',
        pages: ['Home', 'Collections', 'Sale', 'About', 'Contact'],
        sections: ['Hero', 'New Arrivals', 'Collections', 'Sale Items', 'Contact'],
        features: ['Product Catalog', 'Shopping Cart', 'Size Guide', 'Style Blog']
      },
      {
        name: 'Fitness Center',
        description: 'Fitness center website with class schedules and membership plans',
        icon: 'Dumbbell',
        pages: ['Home', 'Classes', 'Membership', 'Trainers', 'Contact'],
        sections: ['Hero', 'Classes', 'Membership Plans', 'Trainers', 'Contact'],
        features: ['Class Booking', 'Membership Management', 'Trainer Profiles', 'Progress Tracking']
      },
      {
        name: 'Education',
        description: 'Educational institution website with courses and admissions',
        icon: 'GraduationCap',
        pages: ['Home', 'Courses', 'Admissions', 'About', 'Contact'],
        sections: ['Hero', 'Courses', 'Admissions', 'Faculty', 'Contact'],
        features: ['Course Catalog', 'Online Applications', 'Student Portal', 'News & Events']
      }
    ];

    for (const template of industryTemplates) {
      await prisma.industryTemplate.upsert({
        where: { name: template.name },
        update: template,
        create: template
      });
    }

    console.log('✅ Database seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedDatabase();