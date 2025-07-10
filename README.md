# WebsiteBoss - Website Builder Tool

A comprehensive website builder tool for creating industry-specific websites quickly and efficiently.

## Features

### Frontend
- **Multi-step Website Builder**: Guided wizard for website creation
- **Industry Templates**: Pre-built templates for different industries
- **Color Theme Selection**: Professional color schemes
- **Product Management**: Add and manage products with pricing
- **Content Customization**: Customize all website content
- **Real-time Preview**: See changes as you build
- **Responsive Design**: Works on all devices

### Backend
- **RESTful API**: Complete API for website management
- **User Authentication**: JWT-based authentication
- **Database Management**: PostgreSQL with Prisma ORM
- **File Upload**: Image upload functionality
- **Website Generation**: Automatic HTML/CSS/JS generation
- **Industry Templates**: Predefined templates and themes

## Tech Stack

### Frontend
- React 18 with TypeScript
- Tailwind CSS for styling
- Lucide React for icons
- Vite for build tooling

### Backend
- Node.js with Express
- TypeScript
- Prisma ORM
- PostgreSQL database
- JWT authentication
- Multer for file uploads

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd websiteboss
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your database URL and other configuration:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/websiteboss"
   JWT_SECRET="your-super-secret-jwt-key"
   PORT=3001
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Push database schema
   npm run db:push
   
   # Seed the database with industry templates
   npx ts-node server/scripts/seedDatabase.ts
   ```

5. **Start the development servers**
   
   **Frontend (Terminal 1):**
   ```bash
   npm run dev
   ```
   
   **Backend (Terminal 2):**
   ```bash
   npm run server
   ```

The frontend will be available at `http://localhost:5173` and the backend API at `http://localhost:3001`.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Websites
- `GET /api/websites` - Get user's websites
- `POST /api/websites` - Create new website
- `GET /api/websites/:id` - Get website details
- `PUT /api/websites/:id` - Update website
- `PUT /api/websites/:id/company` - Update company details
- `PUT /api/websites/:id/theme` - Update color theme
- `PUT /api/websites/:id/content` - Update content sections
- `POST /api/websites/:id/publish` - Publish website
- `DELETE /api/websites/:id` - Delete website

### Products
- `GET /api/products/website/:websiteId` - Get website products
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `PUT /api/products/website/:websiteId/bulk` - Bulk update products

### Templates
- `GET /api/templates/industries` - Get industry templates
- `GET /api/templates/themes` - Get color themes

### File Upload
- `POST /api/upload/image` - Upload single image
- `POST /api/upload/images` - Upload multiple images
- `DELETE /api/upload/:filename` - Delete uploaded file

## Database Schema

The application uses the following main entities:

- **User**: User accounts and authentication
- **Website**: Website projects
- **CompanyDetails**: Company information for each website
- **Product**: Products/services for each website
- **ColorTheme**: Color schemes for websites
- **ContentSection**: Content sections (hero, about, etc.)
- **Page**: Additional pages for websites
- **IndustryTemplate**: Predefined industry templates

## Website Generation

The system automatically generates complete HTML/CSS/JS websites based on:

1. **Industry Template**: Determines structure and layout
2. **Company Details**: Populates contact information and branding
3. **Color Theme**: Applies consistent styling
4. **Products**: Creates product catalogs
5. **Content**: Customizes all text content

Generated websites are fully functional and ready for deployment.

## Development

### Database Management
```bash
# View database in Prisma Studio
npm run db:studio

# Create and apply migrations
npm run db:migrate

# Reset database
npx prisma migrate reset
```

### Code Structure
```
├── src/                    # Frontend React application
│   ├── components/         # React components
│   ├── data/              # Static data and templates
│   ├── types/             # TypeScript type definitions
│   └── ...
├── server/                # Backend Node.js application
│   ├── routes/            # API route handlers
│   ├── middleware/        # Express middleware
│   ├── utils/             # Utility functions
│   └── scripts/           # Database scripts
├── prisma/                # Database schema and migrations
└── uploads/               # File upload directory
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.