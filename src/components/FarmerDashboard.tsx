import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  Sun, 
  Droplets, 
  Thermometer, 
  CloudRain, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  Star,
  Award,
  Calendar,
  MapPin,
  Leaf,
  Zap
} from 'lucide-react';

interface DashboardData {
  weather: {
    temperature: number;
    humidity: number;
    precipitation: number;
    condition: string;
  };
  tasks: {
    id: string;
    title: string;
    description: string;
    priority: 'High' | 'Medium' | 'Low';
    dueDate: string;
    completed: boolean;
    points: number;
  }[];
  achievements: {
    id: string;
    title: string;
    description: string;
    icon: React.ComponentType<any>;
    unlocked: boolean;
    progress: number;
    maxProgress: number;
  }[];
  quickActions: {
    id: string;
    title: string;
    description: string;
    icon: React.ComponentType<any>;
    color: string;
  }[];
}

const FarmerDashboard = () => {
  const { t } = useTranslation();
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    weather: {
      temperature: 28,
      humidity: 65,
      precipitation: 15,
      condition: 'sunny'
    },
    tasks: [
      {
        id: '1',
        title: 'Check soil moisture',
        description: 'Test soil moisture levels in field A',
        priority: 'High',
        dueDate: 'Today',
        completed: false,
        points: 25
      },
      {
        id: '2',
        title: 'Plant new seedlings',
        description: 'Plant tomato seedlings in greenhouse',
        priority: 'Medium',
        dueDate: 'Tomorrow',
        completed: false,
        points: 50
      },
      {
        id: '3',
        title: 'Harvest ready crops',
        description: 'Harvest mature vegetables from field B',
        priority: 'High',
        dueDate: 'Today',
        completed: true,
        points: 75
      }
    ],
    achievements: [
      {
        id: '1',
        title: 'Weather Watcher',
        description: 'Check weather data 5 times',
        icon: Sun,
        unlocked: true,
        progress: 5,
        maxProgress: 5
      },
      {
        id: '2',
        title: 'Task Master',
        description: 'Complete 10 tasks',
        icon: CheckCircle,
        unlocked: false,
        progress: 7,
        maxProgress: 10
      },
      {
        id: '3',
        title: 'Crop Expert',
        description: 'Use crop predictor 3 times',
        icon: Leaf,
        unlocked: false,
        progress: 1,
        maxProgress: 3
      }
    ],
    quickActions: [
      {
        id: 'weather',
        title: 'Weather Check',
        description: 'View detailed weather forecast',
        icon: Sun,
        color: 'bg-yellow-100 text-yellow-700'
      },
      {
        id: 'crops',
        title: 'Crop Predictor',
        description: 'Get crop recommendations',
        icon: Leaf,
        color: 'bg-green-100 text-green-700'
      },
      {
        id: 'tasks',
        title: 'Daily Tasks',
        description: 'View and manage tasks',
        icon: Target,
        color: 'bg-blue-100 text-blue-700'
      },
      {
        id: 'community',
        title: 'Community',
        description: 'Connect with other farmers',
        icon: Award,
        color: 'bg-purple-100 text-purple-700'
      }
    ]
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-700';
      case 'Medium': return 'bg-yellow-100 text-yellow-700';
      case 'Low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'sunny': return <Sun className="h-8 w-8 text-yellow-500" />;
      case 'cloudy': return <CloudRain className="h-8 w-8 text-gray-500" />;
      case 'rainy': return <CloudRain className="h-8 w-8 text-blue-500" />;
      default: return <Sun className="h-8 w-8 text-yellow-500" />;
    }
  };

  const completeTask = (taskId: string) => {
    setDashboardData(prev => ({
      ...prev,
      tasks: prev.tasks.map(task => 
        task.id === taskId ? { ...task, completed: true } : task
      )
    }));
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl border border-green-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Good morning, Farmer! 🌅
            </h1>
            <p className="text-gray-600">
              Ready to make today a great farming day? Let's check your fields and tasks.
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Today's Score</div>
            <div className="text-2xl font-bold text-green-600">1,250</div>
            <div className="text-xs text-gray-500">+150 from yesterday</div>
          </div>
        </div>
      </div>

      {/* Weather Overview */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Sun className="h-5 w-5 text-yellow-500" />
            Today's Weather
          </h2>
          <Badge className="bg-green-100 text-green-700">
            Perfect for farming
          </Badge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="flex justify-center mb-2">
              {getWeatherIcon(dashboardData.weather.condition)}
            </div>
            <div className="text-2xl font-bold">{dashboardData.weather.temperature}°C</div>
            <div className="text-sm text-muted-foreground">Temperature</div>
          </div>
          
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <Droplets className="h-8 w-8 text-blue-500" />
            </div>
            <div className="text-2xl font-bold">{dashboardData.weather.humidity}%</div>
            <div className="text-sm text-muted-foreground">Humidity</div>
          </div>
          
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <CloudRain className="h-8 w-8 text-blue-500" />
            </div>
            <div className="text-2xl font-bold">{dashboardData.weather.precipitation}mm</div>
            <div className="text-sm text-muted-foreground">Rainfall</div>
          </div>
          
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
            <div className="text-2xl font-bold">Good</div>
            <div className="text-sm text-muted-foreground">Conditions</div>
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Zap className="h-5 w-5 text-yellow-500" />
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {dashboardData.quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Card 
                key={action.id} 
                className="p-4 hover:shadow-lg transition-all cursor-pointer hover:scale-105"
              >
                <div className="text-center space-y-2">
                  <div className={`p-3 rounded-full mx-auto w-fit ${action.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-sm">{action.title}</h3>
                  <p className="text-xs text-muted-foreground">{action.description}</p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Today's Tasks */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-500" />
            Today's Tasks
          </h2>
          <Badge className="bg-blue-100 text-blue-700">
            {dashboardData.tasks.filter(t => t.completed).length}/{dashboardData.tasks.length} Complete
          </Badge>
        </div>
        
        <div className="space-y-3">
          {dashboardData.tasks.map((task) => (
            <div 
              key={task.id} 
              className={`flex items-center gap-4 p-4 rounded-lg border ${
                task.completed 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-muted/50 border-border'
              }`}
            >
              <div className="flex-shrink-0">
                {task.completed ? (
                  <CheckCircle className="h-6 w-6 text-green-500" />
                ) : (
                  <Clock className="h-6 w-6 text-muted-foreground" />
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className={`font-semibold ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                    {task.title}
                  </h3>
                  <Badge className={getPriorityColor(task.priority)}>
                    {task.priority}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{task.description}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>Due: {task.dueDate}</span>
                  <span className="flex items-center gap-1">
                    <Star className="h-3 w-3 text-yellow-500" />
                    {task.points} points
                  </span>
                </div>
              </div>
              
              {!task.completed && (
                <Button 
                  size="sm" 
                  onClick={() => completeTask(task.id)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Complete
                </Button>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Recent Achievements */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Award className="h-5 w-5 text-yellow-500" />
            Recent Achievements
          </h2>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {dashboardData.achievements.map((achievement) => {
            const Icon = achievement.icon;
            return (
              <div 
                key={achievement.id}
                className={`p-4 rounded-lg border ${
                  achievement.unlocked 
                    ? 'bg-yellow-50 border-yellow-200' 
                    : 'bg-muted/50 border-border'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`p-2 rounded-full ${
                    achievement.unlocked 
                      ? 'bg-yellow-100 text-yellow-600' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">{achievement.title}</h3>
                    <p className="text-xs text-muted-foreground">{achievement.description}</p>
                  </div>
                </div>
                
                {!achievement.unlocked && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Progress</span>
                      <span>{achievement.progress}/{achievement.maxProgress}</span>
                    </div>
                    <Progress value={(achievement.progress / achievement.maxProgress) * 100} className="h-2" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default FarmerDashboard;
