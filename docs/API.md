# API Documentation

This document describes the APIs and services used by AgriSense.

## NASA APIs

### Overview
AgriSense integrates with several NASA APIs to provide real-time agricultural data.

### Available APIs

#### 1. SMAP (Soil Moisture Active Passive)
- **Purpose**: Soil moisture data
- **Endpoint**: `https://api.nasa.gov/insight_weather/`
- **Documentation**: [NASA SMAP API](https://api.nasa.gov/)

#### 2. MODIS
- **Purpose**: Vegetation and land surface data
- **Documentation**: [MODIS API](https://modis.gsfc.nasa.gov/data/)

#### 3. POWER API
- **Purpose**: Weather and solar data
- **Endpoint**: `https://power.larc.nasa.gov/api/`
- **Documentation**: [POWER API](https://power.larc.nasa.gov/)

#### 4. GPM (Global Precipitation Measurement)
- **Purpose**: Precipitation data
- **Documentation**: [GPM API](https://gpm.nasa.gov/)

### Implementation

```typescript
// NASA Service Example
import nasaService from '@/services/nasaApi';

// Get comprehensive NASA data
const data = await nasaService.getNASAData(lat, lng);

// Get specific data types
const soilMoisture = await nasaService.getSoilMoisture(lat, lng);
const weather = await nasaService.getWeatherData(lat, lng);
const vegetation = await nasaService.getVegetationData(lat, lng);
```

## Supabase APIs

### Authentication

#### Sign Up
```typescript
POST /auth/v1/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "options": {
    "data": {
      "full_name": "John Doe",
      "farm_name": "Green Acres"
    }
  }
}
```

#### Sign In
```typescript
POST /auth/v1/token?grant_type=password
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Sign Out
```typescript
POST /auth/v1/logout
Authorization: Bearer <access_token>
```

### Database Operations

#### Profiles
```typescript
// Get profile
GET /rest/v1/profiles?id=eq.user_id
Authorization: Bearer <access_token>

// Update profile
PATCH /rest/v1/profiles?id=eq.user_id
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "full_name": "John Doe",
  "farm_name": "Green Acres",
  "location": {"lat": 40.7128, "lng": -74.0060}
}
```

#### Diary Entries
```typescript
// Get diary entries
GET /rest/v1/diary_entries?user_id=eq.user_id&order=date.desc
Authorization: Bearer <access_token>

// Create diary entry
POST /rest/v1/diary_entries
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "user_id": "user_id",
  "date": "2024-01-15",
  "activity": "sowing",
  "crop": "Corn",
  "notes": "Planted 5 acres"
}
```

#### Community Posts
```typescript
// Get community posts
GET /rest/v1/community_posts?select=*,profiles(full_name,farm_name)&order=created_at.desc
Authorization: Bearer <access_token>

// Create post
POST /rest/v1/community_posts
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "user_id": "user_id",
  "content": "Great harvest this season!"
}
```

## AI Chat API

### Plant Schedule Chat
```typescript
POST /functions/v1/plant-schedule-chat
Authorization: Bearer <supabase_anon_key>
Content-Type: application/json

{
  "messages": [
    {
      "role": "user",
      "content": "What crops should I plant this season?"
    }
  ],
  "location": {
    "lat": 40.7128,
    "lng": -74.0060,
    "name": "New York, NY"
  }
}
```

### Response Format
```typescript
// Streaming response
data: {"choices": [{"delta": {"content": "Based on your location"}}]}
data: {"choices": [{"delta": {"content": " and current conditions"}}]}
data: [DONE]
```

## Geocoding APIs

### Google Maps Geocoding
```typescript
// Forward geocoding
GET https://maps.googleapis.com/maps/api/geocode/json?address=New+York&key=API_KEY

// Reverse geocoding
GET https://maps.googleapis.com/maps/api/geocode/json?latlng=40.714224,-73.961452&key=API_KEY
```

### OpenStreetMap Nominatim
```typescript
// Forward geocoding
GET https://nominatim.openstreetmap.org/search?format=json&q=New+York&limit=1

// Reverse geocoding
GET https://nominatim.openstreetmap.org/reverse?format=json&lat=40.714224&lon=-73.961452
```

## Error Handling

### HTTP Status Codes
- `200`: Success
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `429`: Rate Limited
- `500`: Internal Server Error

### Error Response Format
```typescript
{
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE",
    "details": "Additional error details"
  }
}
```

### Rate Limiting
- NASA APIs: 1000 requests/hour (with API key)
- Supabase: Based on plan limits
- Google Maps: Based on plan limits
- OpenStreetMap: 1 request/second (free)

## Authentication

### JWT Tokens
AgriSense uses JWT tokens for authentication:

```typescript
// Token structure
{
  "aud": "authenticated",
  "exp": 1234567890,
  "iat": 1234567890,
  "iss": "https://your-project.supabase.co/auth/v1",
  "sub": "user-uuid",
  "email": "user@example.com",
  "role": "authenticated"
}
```

### Token Refresh
```typescript
POST /auth/v1/token?grant_type=refresh_token
Content-Type: application/json

{
  "refresh_token": "refresh_token_here"
}
```

## WebSocket Connections

### Real-time Updates
```typescript
// Subscribe to diary entries changes
const subscription = supabase
  .channel('diary_entries')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'diary_entries',
    filter: `user_id=eq.${userId}`
  }, (payload) => {
    console.log('Change received!', payload);
  })
  .subscribe();
```

## API Versioning

### Current Version: v1
- All endpoints use `/v1/` prefix
- Backward compatibility maintained
- Deprecated features marked in documentation

### Future Versions
- v2 planned for Q2 2024
- Migration guide will be provided
- Deprecation notices 6 months in advance

## SDK Usage

### JavaScript/TypeScript
```typescript
import { createClient } from '@supabase/supabase-js';
import nasaService from '@/services/nasaApi';

// Initialize Supabase client
const supabase = createClient(url, key);

// Use NASA service
const data = await nasaService.getNASAData(lat, lng);
```

### React Hooks
```typescript
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';

// Use authentication
const { user, signIn, signOut } = useAuth();

// Use data fetching
const { data, error, isLoading } = useQuery({
  queryKey: ['nasa-data', location],
  queryFn: () => nasaService.getNASAData(location.lat, location.lng)
});
```

## Testing APIs

### Unit Tests
```typescript
import { describe, it, expect, vi } from 'vitest';
import nasaService from '@/services/nasaApi';

describe('NASA Service', () => {
  it('should fetch NASA data', async () => {
    const mockData = { soilMoisture: 45, temperature: 24 };
    vi.spyOn(nasaService, 'getNASAData').mockResolvedValue(mockData);
    
    const result = await nasaService.getNASAData(40.7128, -74.0060);
    expect(result).toEqual(mockData);
  });
});
```

### Integration Tests
```typescript
import { test, expect } from '@playwright/test';

test('should create diary entry', async ({ request }) => {
  const response = await request.post('/rest/v1/diary_entries', {
    data: {
      user_id: 'test-user',
      activity: 'sowing',
      notes: 'Test entry'
    },
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  expect(response.status()).toBe(201);
});
```

## Security

### API Key Management
- Store API keys in environment variables
- Use different keys for different environments
- Rotate keys regularly
- Monitor key usage

### CORS Configuration
```typescript
// Supabase CORS settings
{
  "allowed_origins": [
    "https://yourdomain.com",
    "https://staging.yourdomain.com"
  ],
  "allowed_methods": ["GET", "POST", "PATCH", "DELETE"],
  "allowed_headers": ["Authorization", "Content-Type"]
}
```

### Rate Limiting
- Implement client-side rate limiting
- Use exponential backoff for retries
- Cache responses when appropriate
- Monitor API usage

## Monitoring

### Health Checks
```typescript
// Application health
GET /health

// Database health
GET /rest/v1/health

// NASA API health
GET /api/nasa/health
```

### Metrics
- API response times
- Error rates
- Usage statistics
- Rate limit hits

### Alerts
- High error rates (>5%)
- Slow responses (>2s)
- Rate limit exceeded
- Service unavailability
