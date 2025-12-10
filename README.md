# Foodies API

[![Deploy](https://github.com/shikigami12/goit-foodies-api/actions/workflows/deploy.yml/badge.svg)](https://github.com/shikigami12/goit-foodies-api/actions/workflows/deploy.yml)

REST API for a recipe-sharing platform where users can discover, create, and share their favorite recipes.

## About the Project

Foodies API is the backend service for a recipe-sharing application. It provides a comprehensive set of endpoints for:

- **User Authentication** – Registration, login, and JWT-based authorization
- **Recipe Management** – Create, read, update, and delete recipes
- **Social Features** – Follow other users, view followers/following lists
- **Favorites** – Save and manage favorite recipes
- **Search & Discovery** – Filter recipes by category, area, or ingredients

## Technologies Used

| Technology | Purpose |
|------------|---------|
| **Node.js** | Runtime environment |
| **TypeScript** | Type-safe JavaScript |
| **Express.js** | Web framework |
| **Sequelize** | ORM for PostgreSQL |
| **PostgreSQL** | Relational database |
| **JWT** | Authentication tokens |
| **bcrypt** | Password hashing |
| **Cloudinary** | Image hosting |
| **Joi** | Request validation |
| **Swagger** | API documentation |
| **Docker** | Containerization |

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [Docker](https://www.docker.com/) & Docker Compose
- [Cloudinary](https://cloudinary.com/) account (free tier)

### Environment Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/shikigami12/goit-foodies-api.git
   cd goit-foodies-api
   ```

2. Create `.env` file from template:
   ```bash
   cp .env.example .env
   ```

3. Fill in environment variables:
   ```env
   PORT=3000
   DATABASE_URL=postgresql://foodies_user:foodies_password@db:5432/foodies_db
   JWT_SECRET=your-super-secret-key
   JWT_EXPIRES_IN=7d
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ```

### Running with Docker (Recommended)

```bash
docker-compose up --build
```

The API will be available at:
- **API**: http://localhost:3000/api
- **Swagger Docs**: http://localhost:3000/api-docs
- **Health Check**: http://localhost:3000/health

### Running Locally (Development)

```bash
# Install dependencies
npm install

# Start development server (requires external PostgreSQL)
npm run dev
```

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| POST | `/api/auth/logout` | Logout user |
| GET | `/api/auth/current` | Get current user |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/current` | Get current user with stats |
| GET | `/api/users/:id` | Get user by ID |
| PATCH | `/api/users/avatar` | Update avatar |
| GET | `/api/users/:id/followers` | Get followers |
| GET | `/api/users/following` | Get following |
| POST | `/api/users/:id/follow` | Follow user |
| DELETE | `/api/users/:id/follow` | Unfollow user |

### Recipes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/recipes` | Search recipes |
| GET | `/api/recipes/popular` | Get popular recipes |
| GET | `/api/recipes/:id` | Get recipe by ID |
| POST | `/api/recipes` | Create recipe |
| DELETE | `/api/recipes/:id` | Delete recipe |
| GET | `/api/recipes/own` | Get own recipes |
| POST | `/api/recipes/:id/favorite` | Add to favorites |
| DELETE | `/api/recipes/:id/favorite` | Remove from favorites |
| GET | `/api/recipes/favorites` | Get favorites |

### Reference Data
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/categories` | Get all categories |
| GET | `/api/areas` | Get all areas |
| GET | `/api/ingredients` | Get all ingredients |
| GET | `/api/testimonials` | Get testimonials |

## Project Structure

```
goit-foodies-api/
├── src/
│   ├── config/         # Configuration (Cloudinary)
│   ├── controllers/    # Route handlers
│   ├── db/             # Database connection
│   ├── helpers/        # Utility functions
│   ├── middlewares/    # Express middlewares
│   ├── models/         # Sequelize models
│   ├── routes/         # API routes
│   ├── schemas/        # Joi validation schemas
│   ├── swagger/        # OpenAPI configuration
│   ├── types/          # TypeScript interfaces
│   ├── app.ts          # Express app setup
│   └── server.ts       # Entry point
├── .github/workflows/  # CI/CD pipelines
├── docker-compose.yml
├── Dockerfile
└── package.json
```

## Deployment

The application is automatically deployed to [Render.com](https://render.com) when changes are pushed to the `main` branch.

**CI/CD Pipeline:**
1. Push to `main` → GitHub Actions triggered
2. Build Docker image
3. Push to Docker Hub (`shikigami/goit-foodies-api`)
4. Trigger Render.com deploy hook

## Team

Developed by **Render Party** team as part of the GoIT curriculum.

## License

ISC