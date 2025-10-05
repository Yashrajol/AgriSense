import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { 
  BookOpen, 
  Lightbulb, 
  TrendingUp, 
  Shield, 
  Droplets, 
  Thermometer, 
  Sun, 
  Wind,
  Leaf,
  Zap,
  Globe,
  Target,
  CheckCircle,
  AlertTriangle,
  Info
} from "lucide-react";

interface EducationalTopic {
  id: string;
  title: string;
  description: string;
  category: 'soil' | 'weather' | 'crops' | 'sustainability' | 'technology';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  readTime: string;
  content: string;
  tips: string[];
  warnings: string[];
  relatedTopics: string[];
}

const EducationalContent = () => {
  const [selectedTopic, setSelectedTopic] = useState<EducationalTopic | null>(null);

  const topics: EducationalTopic[] = [
    {
      id: 'soil-health',
      title: 'Understanding Soil Health',
      description: 'Learn about soil composition, pH levels, and how to maintain healthy soil for optimal crop growth.',
      category: 'soil',
      difficulty: 'beginner',
      readTime: '5 min',
      content: `
        Soil health is the foundation of successful agriculture. Healthy soil provides essential nutrients, water retention, and a stable environment for plant roots.

        **Key Components of Healthy Soil:**
        - **Organic Matter**: Improves water retention and nutrient availability
        - **Microorganisms**: Break down organic matter and fix nitrogen
        - **Proper pH**: Most crops prefer pH between 6.0-7.0
        - **Good Structure**: Allows root penetration and water drainage

        **Signs of Healthy Soil:**
        - Dark, crumbly texture
        - Earthworm activity
        - Good water infiltration
        - Strong plant growth

        **Common Soil Problems:**
        - Compaction from heavy machinery
        - Erosion from wind and water
        - Nutrient depletion from over-farming
        - pH imbalance from chemical fertilizers
      `,
      tips: [
        'Test your soil pH annually',
        'Add organic matter regularly',
        'Use cover crops to prevent erosion',
        'Rotate crops to maintain soil health'
      ],
      warnings: [
        'Avoid over-tilling which can destroy soil structure',
        'Don\'t ignore soil test results',
        'Be careful with chemical fertilizers - they can harm beneficial microorganisms'
      ],
      relatedTopics: ['soil-testing', 'composting', 'crop-rotation']
    },
    {
      id: 'weather-patterns',
      title: 'Reading Weather Patterns',
      description: 'Understand how weather affects crop growth and how to use weather data for better farming decisions.',
      category: 'weather',
      difficulty: 'intermediate',
      readTime: '8 min',
      content: `
        Weather is one of the most critical factors in agriculture. Understanding weather patterns helps farmers make informed decisions about planting, irrigation, and harvesting.

        **Key Weather Factors:**
        - **Temperature**: Affects plant growth rates and crop development
        - **Precipitation**: Determines irrigation needs and disease risk
        - **Humidity**: Influences disease pressure and pest activity
        - **Wind**: Affects pollination and can cause physical damage

        **Seasonal Considerations:**
        - **Spring**: Monitor frost dates and soil temperature
        - **Summer**: Watch for heat stress and drought conditions
        - **Fall**: Plan harvest timing around weather windows
        - **Winter**: Prepare for cold damage and plan next season

        **Weather Tools:**
        - Local weather stations
        - Satellite imagery
        - Historical weather data
        - Climate models and forecasts
      `,
      tips: [
        'Keep detailed weather records',
        'Use multiple weather sources',
        'Plan for extreme weather events',
        'Monitor microclimates on your farm'
      ],
      warnings: [
        'Don\'t rely solely on weather forecasts',
        'Be prepared for unexpected weather changes',
        'Extreme weather can cause significant crop losses'
      ],
      relatedTopics: ['irrigation-planning', 'crop-protection', 'climate-change']
    },
    {
      id: 'crop-selection',
      title: 'Smart Crop Selection',
      description: 'Learn how to choose the right crops for your climate, soil, and market conditions.',
      category: 'crops',
      difficulty: 'intermediate',
      readTime: '10 min',
      content: `
        Choosing the right crops is crucial for farm profitability and sustainability. Consider multiple factors when making crop selection decisions.

        **Factors to Consider:**
        - **Climate Suitability**: Match crops to your growing season and temperature ranges
        - **Soil Requirements**: Consider pH, drainage, and nutrient needs
        - **Market Demand**: Research local and regional markets
        - **Resource Availability**: Water, labor, and equipment requirements
        - **Risk Management**: Diversify to spread risk

        **Crop Categories:**
        - **Cash Crops**: High-value crops for market sale
        - **Cover Crops**: Improve soil health and prevent erosion
        - **Rotation Crops**: Break pest and disease cycles
        - **Emergency Crops**: Quick-growing crops for food security

        **Selection Process:**
        1. Assess your farm's capabilities
        2. Research market opportunities
        3. Consider environmental factors
        4. Plan for crop rotation
        5. Calculate potential returns
      `,
      tips: [
        'Start with crops you know well',
        'Consider local market demand',
        'Plan for crop rotation',
        'Keep detailed records of what works'
      ],
      warnings: [
        'Don\'t put all your eggs in one basket',
        'Research market prices before planting',
        'Consider the learning curve for new crops'
      ],
      relatedTopics: ['market-analysis', 'crop-rotation', 'risk-management']
    },
    {
      id: 'sustainable-farming',
      title: 'Sustainable Farming Practices',
      description: 'Discover methods to farm more sustainably while maintaining productivity and profitability.',
      category: 'sustainability',
      difficulty: 'advanced',
      readTime: '12 min',
      content: `
        Sustainable farming focuses on long-term environmental health while maintaining economic viability. It's about working with nature rather than against it.

        **Core Principles:**
        - **Soil Conservation**: Prevent erosion and maintain soil health
        - **Water Management**: Efficient irrigation and water conservation
        - **Biodiversity**: Support beneficial insects and wildlife
        - **Energy Efficiency**: Reduce fossil fuel dependence
        - **Waste Reduction**: Minimize inputs and maximize outputs

        **Sustainable Practices:**
        - **Conservation Tillage**: Reduce soil disturbance
        - **Cover Cropping**: Protect soil between cash crops
        - **Integrated Pest Management**: Use biological controls
        - **Precision Agriculture**: Apply inputs only where needed
        - **Agroforestry**: Integrate trees with crops

        **Benefits:**
        - Reduced input costs
        - Improved soil health
        - Better water quality
        - Increased biodiversity
        - Long-term profitability
      `,
      tips: [
        'Start small with sustainable practices',
        'Measure your progress',
        'Learn from other sustainable farmers',
        'Be patient - results take time'
      ],
      warnings: [
        'Transitioning to sustainable farming requires planning',
        'Some practices may initially reduce yields',
        'Education and training are essential'
      ],
      relatedTopics: ['organic-farming', 'conservation', 'climate-adaptation']
    },
    {
      id: 'precision-agriculture',
      title: 'Precision Agriculture Technology',
      description: 'Explore how technology can improve farming efficiency and reduce environmental impact.',
      category: 'technology',
      difficulty: 'advanced',
      readTime: '15 min',
      content: `
        Precision agriculture uses technology to optimize farming practices at a detailed level. It helps farmers make data-driven decisions for better outcomes.

        **Key Technologies:**
        - **GPS Guidance**: Accurate field mapping and navigation
        - **Variable Rate Application**: Apply inputs based on field variability
        - **Remote Sensing**: Monitor crops from satellites and drones
        - **Soil Sensors**: Real-time soil moisture and nutrient monitoring
        - **Weather Stations**: Local weather data for better decisions

        **Benefits:**
        - Reduced input costs
        - Improved crop yields
        - Better environmental outcomes
        - More precise decision making
        - Increased profitability

        **Getting Started:**
        1. Assess your current technology level
        2. Identify key challenges to address
        3. Research available solutions
        4. Start with simple, proven technologies
        5. Gradually add more advanced tools

        **Common Applications:**
        - Variable rate fertilizer application
        - Precision planting
        - Automated irrigation
        - Crop monitoring
        - Yield mapping
      `,
      tips: [
        'Start with basic GPS guidance',
        'Invest in good data management',
        'Train your team on new technologies',
        'Measure ROI on technology investments'
      ],
      warnings: [
        'Technology requires significant investment',
        'Data management can be complex',
        'Not all technologies work for every farm'
      ],
      relatedTopics: ['data-management', 'automation', 'smart-farming']
    }
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'soil': return <Leaf className="h-4 w-4" />;
      case 'weather': return <Wind className="h-4 w-4" />;
      case 'crops': return <Sun className="h-4 w-4" />;
      case 'sustainability': return <Globe className="h-4 w-4" />;
      case 'technology': return <Zap className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'soil': return 'text-green-600';
      case 'weather': return 'text-blue-600';
      case 'crops': return 'text-yellow-600';
      case 'sustainability': return 'text-emerald-600';
      case 'technology': return 'text-purple-600';
      default: return 'text-gray-600';
    }
  };

  const categories = [
    { id: 'all', label: 'All Topics', count: topics.length },
    { id: 'soil', label: 'Soil Health', count: topics.filter(t => t.category === 'soil').length },
    { id: 'weather', label: 'Weather', count: topics.filter(t => t.category === 'weather').length },
    { id: 'crops', label: 'Crops', count: topics.filter(t => t.category === 'crops').length },
    { id: 'sustainability', label: 'Sustainability', count: topics.filter(t => t.category === 'sustainability').length },
    { id: 'technology', label: 'Technology', count: topics.filter(t => t.category === 'technology').length }
  ];

  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredTopics = selectedCategory === 'all' 
    ? topics 
    : topics.filter(topic => topic.category === selectedCategory);

  if (selectedTopic) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            onClick={() => setSelectedTopic(null)}
          >
            ← Back to Topics
          </Button>
          <div className="flex items-center space-x-2">
            {getCategoryIcon(selectedTopic.category)}
            <Badge className={getDifficultyColor(selectedTopic.difficulty)}>
              {selectedTopic.difficulty}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {selectedTopic.readTime} read
            </span>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{selectedTopic.title}</CardTitle>
            <CardDescription>{selectedTopic.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="prose max-w-none">
              {selectedTopic.content.split('\n').map((paragraph, index) => {
                if (paragraph.trim() === '') return null;
                if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                  return (
                    <h3 key={index} className="text-lg font-semibold mt-6 mb-3">
                      {paragraph.replace(/\*\*/g, '')}
                    </h3>
                  );
                }
                return (
                  <p key={index} className="mb-4 leading-relaxed">
                    {paragraph}
                  </p>
                );
              })}
            </div>

            {selectedTopic.tips.length > 0 && (
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-3 flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Pro Tips
                </h4>
                <ul className="space-y-2">
                  {selectedTopic.tips.map((tip, index) => (
                    <li key={index} className="text-green-700 flex items-start">
                      <span className="mr-2">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {selectedTopic.warnings.length > 0 && (
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-semibold text-yellow-800 mb-3 flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Important Warnings
                </h4>
                <ul className="space-y-2">
                  {selectedTopic.warnings.map((warning, index) => (
                    <li key={index} className="text-yellow-700 flex items-start">
                      <span className="mr-2">⚠</span>
                      {warning}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {selectedTopic.relatedTopics.length > 0 && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-3 flex items-center">
                  <Info className="h-4 w-4 mr-2" />
                  Related Topics
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedTopic.relatedTopics.map((topic, index) => (
                    <Badge key={index} variant="outline" className="text-blue-700">
                      {topic.replace('-', ' ')}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Agricultural Education Center</h2>
        <p className="text-muted-foreground mt-2">
          Learn about sustainable farming practices, crop management, and agricultural technology
        </p>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          {categories.map((category) => (
            <TabsTrigger key={category.id} value={category.id}>
              {category.label} ({category.count})
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((category) => (
          <TabsContent key={category.id} value={category.id} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[70vh] overflow-y-auto">
              {filteredTopics.map((topic) => (
                <Card 
                  key={topic.id} 
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setSelectedTopic(topic)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className={`flex items-center space-x-2 ${getCategoryColor(topic.category)}`}>
                        {getCategoryIcon(topic.category)}
                        <span className="text-sm font-medium capitalize">
                          {topic.category}
                        </span>
                      </div>
                      <Badge className={getDifficultyColor(topic.difficulty)}>
                        {topic.difficulty}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{topic.title}</CardTitle>
                    <CardDescription>{topic.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{topic.readTime} read</span>
                      <span>{topic.tips.length} tips</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default EducationalContent;
