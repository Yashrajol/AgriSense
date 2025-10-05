export interface Location {
  lat: number;
  lng: number;
  name?: string;
}

export interface NASAData {
  soilMoisture: number; // 0-100%
  temperature: number; // Celsius
  precipitation: number; // mm
  lastUpdated: Date;
}

export interface Advisory {
  id: string;
  type: 'irrigation' | 'fertilizer' | 'pest' | 'weather';
  status: 'good' | 'caution' | 'alert';
  title: string;
  message: string;
  icon: string;
  action?: string;
}

export interface CropSuggestion {
  name: string;
  suitability: number; // 0-100%
  season: string;
  reason: string;
}

export interface CommunityPost {
  id: string;
  author: string;
  content: string;
  timestamp: Date;
  likes: number;
}

export interface DiaryEntry {
  id: string;
  date: Date;
  activity: 'sowing' | 'irrigation' | 'fertilizing' | 'harvesting' | 'other';
  crop?: string;
  notes: string;
}
