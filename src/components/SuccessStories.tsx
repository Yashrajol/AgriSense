import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { 
  Star, 
  TrendingUp, 
  Users, 
  Award,
  Quote,
  MapPin,
  Calendar,
  Share2,
  Heart
} from 'lucide-react';

interface SuccessStory {
  id: string;
  title: string;
  description: string;
  farmer: {
    name: string;
    location: string;
    avatar?: string;
    experience: string;
  };
  results: {
    metric: string;
    improvement: string;
    value: string;
  }[];
  category: string;
  date: string;
  likes: number;
  verified: boolean;
}

const SuccessStories = () => {
  const { t } = useTranslation();
  const [likedStories, setLikedStories] = useState<Set<string>>(new Set());

  const stories: SuccessStory[] = [
    {
      id: '1',
      title: t('successStories.story1.title'),
      description: t('successStories.story1.description'),
      farmer: {
        name: 'Raj Kumar',
        location: 'Punjab, India',
        experience: '15 years farming experience'
      },
      results: [
        { metric: 'Yield Increase', improvement: '+30%', value: '30%' },
        { metric: 'Water Saved', improvement: '-25%', value: '25%' },
        { metric: 'Cost Reduction', improvement: '-20%', value: '20%' }
      ],
      category: 'Crop Management',
      date: '2024-01-15',
      likes: 142,
      verified: true
    },
    {
      id: '2',
      title: t('successStories.story2.title'),
      description: t('successStories.story2.description'),
      farmer: {
        name: 'Maria Rodriguez',
        location: 'California, USA',
        experience: '8 years farming experience'
      },
      results: [
        { metric: 'Water Usage', improvement: '-25%', value: '25%' },
        { metric: 'Crop Quality', improvement: '+15%', value: '15%' },
        { metric: 'Profit Margin', improvement: '+18%', value: '18%' }
      ],
      category: 'Water Management',
      date: '2024-02-03',
      likes: 89,
      verified: true
    },
    {
      id: '3',
      title: t('successStories.story3.title'),
      description: t('successStories.story3.description'),
      farmer: {
        name: 'Ahmed Hassan',
        location: 'Egypt',
        experience: '12 years farming experience'
      },
      results: [
        { metric: 'Disease Prevention', improvement: '100%', value: '100%' },
        { metric: 'Crop Health', improvement: '+40%', value: '40%' },
        { metric: 'Harvest Quality', improvement: '+35%', value: '35%' }
      ],
      category: 'Disease Control',
      date: '2024-01-28',
      likes: 156,
      verified: true
    }
  ];

  const toggleLike = (storyId: string) => {
    setLikedStories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(storyId)) {
        newSet.delete(storyId);
      } else {
        newSet.add(storyId);
      }
      return newSet;
    });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Crop Management': return 'bg-green-100 text-green-700';
      case 'Water Management': return 'bg-blue-100 text-blue-700';
      case 'Disease Control': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Award className="h-6 w-6 text-yellow-500" />
          <h2 className="text-2xl font-bold">{t('successStories.title')}</h2>
        </div>
        <p className="text-muted-foreground">
          {t('successStories.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stories.map((story) => (
          <Card key={story.id} className="p-6 hover:shadow-lg transition-all">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={story.farmer.avatar} />
                    <AvatarFallback>
                      {story.farmer.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{story.farmer.name}</h3>
                      {story.verified && (
                        <Badge variant="secondary" className="bg-green-100 text-green-700">
                          ✓ Verified
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {story.farmer.location}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {story.farmer.experience}
                    </p>
                  </div>
                </div>
                <Badge className={getCategoryColor(story.category)}>
                  {story.category}
                </Badge>
              </div>

              {/* Quote */}
              <div className="bg-muted/50 p-4 rounded-lg">
                <Quote className="h-4 w-4 text-muted-foreground mb-2" />
                <h4 className="font-semibold mb-2">{story.title}</h4>
                <p className="text-sm text-muted-foreground">{story.description}</p>
              </div>

              {/* Results */}
              <div className="space-y-2">
                <h5 className="font-medium text-sm">Key Results:</h5>
                <div className="grid grid-cols-1 gap-2">
                  {story.results.map((result, index) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">{result.metric}</span>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3 text-green-500" />
                        <span className="font-semibold text-green-600">
                          {result.improvement}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleLike(story.id)}
                    className="gap-1"
                  >
                    <Heart 
                      className={`h-4 w-4 ${
                        likedStories.has(story.id) 
                          ? 'fill-red-500 text-red-500' 
                          : ''
                      }`} 
                    />
                    {story.likes + (likedStories.has(story.id) ? 1 : 0)}
                  </Button>
                  <Button variant="ghost" size="sm" className="gap-1">
                    <Share2 className="h-4 w-4" />
                    Share
                  </Button>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {new Date(story.date).toLocaleDateString()}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Call to Action */}
      <Card className="p-6 bg-gradient-to-r from-primary/10 to-secondary/10 text-center">
        <div className="space-y-4">
          <h3 className="text-xl font-bold">Share Your Success Story!</h3>
          <p className="text-muted-foreground">
            Have you achieved great results with AgriSense? Share your story and inspire other farmers!
          </p>
          <div className="flex justify-center gap-4">
            <Button>
              <Users className="h-4 w-4 mr-2" />
              Share Your Story
            </Button>
            <Button variant="outline">
              <Star className="h-4 w-4 mr-2" />
              Read More Stories
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SuccessStories;
