# AgriSense - NASA Agricultural Guide

A comprehensive agricultural management application that leverages NASA data to provide farmers with intelligent insights for sustainable farming practices.

## 🌟 Features

### Core Features
- **NASA Data Integration**: Real-time soil moisture, temperature, and precipitation data
- **AI-Powered Advisory System**: Intelligent recommendations for irrigation, fertilization, and crop management
- **Crop Predictor**: Suggests optimal crops based on current conditions and location
- **Plant Planner**: AI chatbot for planting schedules and crop rotation advice
- **Community Feed**: Social platform for farmers to share tips and experiences
- **Field Diary**: Activity tracking and record keeping
- **User Authentication**: Secure user accounts with Supabase Auth
- **Location Services**: GPS-based recommendations and geocoding

### Technical Features
- **Responsive Design**: Mobile-first design with desktop sidebar navigation
- **Progressive Web App**: Offline functionality and mobile app-like experience
- **Real-time Updates**: Live data streaming and notifications
- **Performance Optimized**: Lazy loading, caching, and image optimization
- **Error Handling**: Comprehensive error boundaries and user feedback
- **Testing Suite**: Unit, integration, and end-to-end tests

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Supabase account and project
- NASA API key (optional)
- Google Maps API key (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd nasa-agri-guide-main
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Fill in your environment variables:
   ```env
   # Supabase Configuration
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
   
   # NASA APIs (optional)
   VITE_NASA_API_KEY=your_nasa_api_key
   VITE_NASA_POWER_API_KEY=your_nasa_power_api_key
   
   # AI Configuration
   LOVABLE_API_KEY=your_lovable_api_key
   
   # Geocoding Service (optional)
   VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   ```

4. **Set up Supabase database**
   ```bash
   # Run the migration to create database schema
   supabase db push
   ```

5. **Start development server**
   ```bash
npm run dev
```

6. **Open your browser**
   Navigate to `http://localhost:8080`

## 🛠️ Development

### Project Structure
```
src/
├── components/          # React components
│   ├── ui/             # Reusable UI components (shadcn/ui)
│   ├── auth/           # Authentication components
│   └── ...             # Feature components
├── contexts/           # React contexts (Auth, etc.)
├── hooks/              # Custom React hooks
├── services/           # API and database services
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── test/               # Test setup and utilities

supabase/
├── migrations/         # Database migrations
└── functions/          # Edge functions
```

### Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run preview          # Preview production build

# Testing
npm run test             # Run unit tests
npm run test:ui          # Run tests with UI
npm run test:coverage    # Run tests with coverage
npm run test:e2e         # Run end-to-end tests
npm run test:e2e:ui      # Run e2e tests with UI

# Code Quality
npm run lint             # Run ESLint
```

### Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Library**: shadcn/ui (Radix UI + Tailwind CSS)
- **Backend**: Supabase (PostgreSQL + Edge Functions)
- **Authentication**: Supabase Auth
- **AI**: Lovable AI Gateway with Gemini 2.5 Flash
- **Maps**: Google Maps API / OpenStreetMap
- **Testing**: Vitest, Playwright, Testing Library
- **PWA**: Service Worker, Web App Manifest

## 📊 NASA Data Integration

AgriSense integrates with several NASA APIs to provide real-time agricultural data:

### Available APIs
- **SMAP (Soil Moisture Active Passive)**: Soil moisture data
- **MODIS**: Vegetation and land surface data
- **POWER API**: Weather and solar data
- **GPM**: Precipitation data

### Implementation
The NASA data integration is handled through the `NASAService` class in `src/services/nasaApi.ts`. The service provides:
- Realistic data simulation based on location and season
- Fallback mechanisms for API failures
- Caching and performance optimization

## 🔐 Authentication & Database

### Supabase Setup
1. Create a new Supabase project
2. Run the migration script to create the database schema
3. Configure Row Level Security (RLS) policies
4. Set up authentication providers

### Database Schema
- **profiles**: User profiles and preferences
- **diary_entries**: Field activity tracking
- **community_posts**: Social feed posts
- **post_likes**: Post interaction tracking
- **user_preferences**: User settings
- **advisory_history**: AI advisory tracking

## 🧪 Testing

### Unit Tests
```bash
npm run test
```
Tests are written with Vitest and Testing Library, covering:
- Utility functions
- Custom hooks
- Component logic
- API services

### End-to-End Tests
```bash
npm run test:e2e
```
E2E tests use Playwright and cover:
- User authentication flows
- Navigation and routing
- Form submissions
- Responsive design

### Test Structure
```
src/test/               # Unit test setup
tests/e2e/              # End-to-end tests
├── auth.spec.ts        # Authentication tests
├── dashboard.spec.ts   # Dashboard tests
└── ...                 # Other feature tests
```

## 🚀 Deployment

### Environment Setup
1. **Production Environment Variables**
   ```env
   NODE_ENV=production
   VITE_SUPABASE_URL=your_production_supabase_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_production_key
   # ... other production variables
   ```

2. **Build the Application**
   ```bash
   npm run build
   ```

### Deployment Options

#### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

#### Netlify
1. Connect repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Configure environment variables

#### Docker
```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 🔧 Configuration

### API Keys Setup

#### NASA APIs
1. Register at [NASA API Portal](https://api.nasa.gov/)
2. Get your API key
3. Add to environment variables

#### Google Maps API
1. Create project in [Google Cloud Console](https://console.cloud.google.com/)
2. Enable Geocoding API
3. Create API key with restrictions
4. Add to environment variables

#### Supabase
1. Create project at [Supabase](https://supabase.com)
2. Get project URL and anon key
3. Configure authentication providers
4. Set up database schema

## 📱 Progressive Web App

AgriSense is built as a Progressive Web App with:
- **Service Worker**: Offline caching and background sync
- **Web App Manifest**: Mobile app-like experience
- **Responsive Design**: Works on all device sizes
- **Fast Loading**: Optimized performance and caching

### PWA Features
- Installable on mobile devices
- Offline functionality for core features
- Push notifications (future feature)
- Background sync (future feature)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write tests for new features
- Update documentation
- Follow the existing code style
- Ensure responsive design

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **NASA** for providing agricultural data APIs
- **Supabase** for backend infrastructure
- **shadcn/ui** for the component library
- **Lovable** for AI integration
- **OpenStreetMap** for free geocoding services

## 📞 Support

For support, email support@agrisense.com or join our community Discord.

## 🔮 Roadmap

### Phase 1 (Current)
- ✅ NASA data integration
- ✅ User authentication
- ✅ Basic advisory system
- ✅ Community features

### Phase 2 (Next)
- 🔄 Real NASA API integration
- 🔄 Advanced analytics
- 🔄 Mobile app (React Native)
- 🔄 Push notifications

### Phase 3 (Future)
- 📅 IoT sensor integration
- 📅 Drone imagery analysis
- 📅 Market price integration
- 📅 Expert consultation system

---

**AgriSense** - Empowering farmers with NASA-powered insights for sustainable agriculture.