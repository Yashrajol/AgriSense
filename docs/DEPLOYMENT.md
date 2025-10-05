# Deployment Guide

This guide covers deploying AgriSense to various platforms.

## Prerequisites

- Production environment variables configured
- Supabase project set up with database schema
- Domain name (optional but recommended)

## Environment Variables

Create a `.env.production` file with the following variables:

```env
# Production Environment
NODE_ENV=production

# Supabase Configuration
VITE_SUPABASE_URL=your_production_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_production_anon_key

# NASA APIs (optional)
VITE_NASA_API_KEY=your_nasa_api_key
VITE_NASA_POWER_API_KEY=your_nasa_power_api_key

# AI Configuration
LOVABLE_API_KEY=your_lovable_api_key

# Geocoding Service (optional)
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

## Deployment Options

### 1. Vercel (Recommended)

Vercel provides excellent React support with automatic deployments.

#### Setup Steps:
1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Set build command: `npm run build`
4. Set output directory: `dist`
5. Deploy

#### Vercel Configuration (`vercel.json`):
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### 2. Netlify

Netlify offers great static site hosting with form handling.

#### Setup Steps:
1. Connect repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Configure environment variables
5. Deploy

#### Netlify Configuration (`netlify.toml`):
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"
```

### 3. Docker

For containerized deployment.

#### Dockerfile:
```dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### nginx.conf:
```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # Handle client-side routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location /static/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

### 4. AWS S3 + CloudFront

For scalable static hosting.

#### Setup Steps:
1. Create S3 bucket for static hosting
2. Configure CloudFront distribution
3. Set up CI/CD pipeline
4. Configure custom domain (optional)

#### GitHub Actions Workflow:
```yaml
name: Deploy to AWS
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1
      - run: aws s3 sync dist/ s3://your-bucket-name --delete
      - run: aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

## Database Setup

### Supabase Production Setup

1. **Create Production Project**
   ```bash
   supabase projects create agrisense-prod
   ```

2. **Run Migrations**
   ```bash
   supabase db push --project-ref your-project-ref
   ```

3. **Configure Authentication**
   - Enable email authentication
   - Set up OAuth providers (Google, GitHub)
   - Configure email templates

4. **Set Up Row Level Security**
   ```sql
   -- Enable RLS on all tables
   ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
   ALTER TABLE diary_entries ENABLE ROW LEVEL SECURITY;
   ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
   -- ... other tables
   ```

## Performance Optimization

### Build Optimization

1. **Enable Compression**
   ```bash
   npm install --save-dev vite-plugin-compression
   ```

2. **Bundle Analysis**
   ```bash
   npm install --save-dev rollup-plugin-visualizer
   ```

3. **Environment-specific Builds**
   ```bash
   npm run build:production  # For production
   npm run build:staging    # For staging
   ```

### CDN Configuration

1. **Static Asset Caching**
   - Cache CSS/JS files for 1 year
   - Cache images for 6 months
   - Use versioned filenames

2. **API Caching**
   - Cache NASA data for 1 hour
   - Cache user data for 5 minutes
   - Implement cache invalidation

## Monitoring and Analytics

### Error Tracking

1. **Sentry Integration**
   ```bash
   npm install @sentry/react
   ```

2. **Error Boundary Setup**
   ```tsx
   import * as Sentry from "@sentry/react";
   
   Sentry.init({
     dsn: "YOUR_SENTRY_DSN",
     environment: process.env.NODE_ENV,
   });
   ```

### Analytics

1. **Google Analytics**
   ```tsx
   import { gtag } from 'ga-gtag';
   
   gtag('config', 'GA_MEASUREMENT_ID');
   ```

2. **User Analytics**
   - Track user engagement
   - Monitor feature usage
   - Analyze performance metrics

## Security Considerations

### Environment Variables
- Never commit API keys to version control
- Use different keys for development/staging/production
- Rotate keys regularly

### Content Security Policy
```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  connect-src 'self' https://api.nasa.gov https://*.supabase.co;
">
```

### HTTPS
- Always use HTTPS in production
- Configure HSTS headers
- Use secure cookies

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version compatibility
   - Clear npm cache: `npm cache clean --force`
   - Delete node_modules and reinstall

2. **Environment Variables Not Loading**
   - Ensure variables start with `VITE_`
   - Check for typos in variable names
   - Verify deployment platform configuration

3. **Database Connection Issues**
   - Verify Supabase URL and keys
   - Check network connectivity
   - Validate RLS policies

### Debug Mode
```bash
# Enable debug logging
NODE_ENV=development npm run dev

# Check bundle size
npm run build -- --analyze
```

## Rollback Strategy

1. **Version Control**
   - Tag releases with semantic versioning
   - Keep deployment history
   - Maintain rollback procedures

2. **Database Migrations**
   - Test migrations on staging first
   - Create reversible migrations
   - Keep backup procedures

3. **Feature Flags**
   - Use feature flags for new features
   - Enable gradual rollouts
   - Quick disable capability

## Post-Deployment

### Health Checks
```bash
# Check application health
curl -f https://your-domain.com/health

# Check API endpoints
curl -f https://your-domain.com/api/status
```

### Monitoring Setup
- Set up uptime monitoring
- Configure alert notifications
- Monitor performance metrics
- Track error rates

### Backup Strategy
- Regular database backups
- Configuration backups
- Code repository backups
- Environment variable backups
