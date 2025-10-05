import { useState, useEffect, useMemo, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Button } from "./ui/button";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from "recharts";
import { 
  TrendingUp, 
  TrendingDown, 
  Droplets, 
  Thermometer, 
  CloudRain, 
  Sun,
  BarChart3,
  Calendar,
  MapPin,
  AlertTriangle,
  CheckCircle,
  Info
} from "lucide-react";
import { NASAData } from "@/types";

interface AnalyticsData {
  soilMoistureHistory: Array<{ date: string; moisture: number; optimal: number }>;
  temperatureHistory: Array<{ date: string; temperature: number; min: number; max: number }>;
  precipitationHistory: Array<{ date: string; precipitation: number; average: number }>;
  cropHealth: Array<{ crop: string; health: number; yield: number; color: string }>;
  fieldConditions: Array<{ condition: string; value: number; status: 'good' | 'caution' | 'alert' }>;
  recommendations: Array<{ type: string; priority: 'high' | 'medium' | 'low'; message: string; action: string }>;
}

const AnalyticsDashboard = ({ nasaData }: { nasaData: NASAData | null }) => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  useEffect(() => {
    generateAnalyticsData();
  }, [nasaData, selectedPeriod]);

  // Memoize the analytics data to prevent regeneration
  const memoizedAnalyticsData = useMemo(() => {
    if (!analyticsData) return null;
    return analyticsData;
  }, [analyticsData]);

  const generateAnalyticsData = useCallback(() => {
    if (!nasaData) return;

    const days = selectedPeriod === '7d' ? 7 : selectedPeriod === '30d' ? 30 : selectedPeriod === '90d' ? 90 : 365;
    const now = new Date();
    
    // Generate historical data with stable values
    const soilMoistureHistory = Array.from({ length: days }, (_, i) => {
      const date = new Date(now.getTime() - (days - i - 1) * 24 * 60 * 60 * 1000);
      const baseMoisture = nasaData.soilMoisture;
      // Use a seeded approach for consistent data
      const seed = Math.floor(date.getTime() / (1000 * 60 * 60 * 24)); // Daily seed
      const seededRandom = Math.sin(seed) * 10000;
      const variation = ((seededRandom - Math.floor(seededRandom)) - 0.5) * 10; // Reduced variation
      const seasonalFactor = Math.sin((date.getMonth() / 12) * 2 * Math.PI) * 5; // Reduced seasonal variation
      
      return {
        date: date.toISOString().split('T')[0],
        moisture: Math.max(0, Math.min(100, Math.round(baseMoisture + variation + seasonalFactor))),
        optimal: 60
      };
    });

    const temperatureHistory = Array.from({ length: days }, (_, i) => {
      const date = new Date(now.getTime() - (days - i - 1) * 24 * 60 * 60 * 1000);
      const baseTemp = nasaData.temperature;
      // Use seeded random for stable temperature data
      const seed = Math.floor(date.getTime() / (1000 * 60 * 60 * 24));
      const seededRandom = Math.sin(seed + 1) * 10000;
      const variation = ((seededRandom - Math.floor(seededRandom)) - 0.5) * 8; // Reduced variation
      const dailyVariation = Math.sin((i / days) * 2 * Math.PI) * 3; // Reduced daily variation
      
      const temp = baseTemp + variation + dailyVariation;
      return {
        date: date.toISOString().split('T')[0],
        temperature: Math.round(temp * 10) / 10,
        min: Math.round((temp - 3) * 10) / 10,
        max: Math.round((temp + 3) * 10) / 10
      };
    });

    const precipitationHistory = Array.from({ length: days }, (_, i) => {
      const date = new Date(now.getTime() - (days - i - 1) * 24 * 60 * 60 * 1000);
      const basePrecip = nasaData.precipitation;
      // Use seeded random for stable precipitation data
      const seed = Math.floor(date.getTime() / (1000 * 60 * 60 * 24));
      const seededRandom = Math.sin(seed + 2) * 10000;
      const variation = (seededRandom - Math.floor(seededRandom)) * 10; // Reduced variation
      const seasonalFactor = Math.sin((date.getMonth() / 12) * 2 * Math.PI) * 3; // Reduced seasonal variation
      
      return {
        date: date.toISOString().split('T')[0],
        precipitation: Math.max(0, Math.round((basePrecip + variation + seasonalFactor) * 10) / 10),
        average: 15
      };
    });

    const cropHealth = [
      { crop: 'Wheat', health: 85, yield: 3.2, color: '#10b981' },
      { crop: 'Corn', health: 78, yield: 4.1, color: '#f59e0b' },
      { crop: 'Soybeans', health: 92, yield: 2.8, color: '#3b82f6' },
      { crop: 'Rice', health: 88, yield: 3.5, color: '#8b5cf6' }
    ];

    const fieldConditions = [
      { condition: 'Soil Moisture', value: nasaData.soilMoisture, status: nasaData.soilMoisture > 40 && nasaData.soilMoisture < 80 ? 'good' : nasaData.soilMoisture > 20 ? 'caution' : 'alert' },
      { condition: 'Temperature', value: nasaData.temperature, status: nasaData.temperature > 10 && nasaData.temperature < 35 ? 'good' : nasaData.temperature > 5 ? 'caution' : 'alert' },
      { condition: 'Precipitation', value: nasaData.precipitation, status: nasaData.precipitation > 5 && nasaData.precipitation < 50 ? 'good' : nasaData.precipitation > 0 ? 'caution' : 'alert' }
    ];

    const recommendations = [
      { type: 'Irrigation', priority: 'high', message: 'Soil moisture is below optimal levels', action: 'Schedule irrigation for tomorrow morning' },
      { type: 'Fertilization', priority: 'medium', message: 'Nitrogen levels are adequate for current growth stage', action: 'Monitor for next 2 weeks' },
      { type: 'Pest Control', priority: 'low', message: 'No pest activity detected', action: 'Continue regular monitoring' }
    ];

    setAnalyticsData({
      soilMoistureHistory,
      temperatureHistory,
      precipitationHistory,
      cropHealth,
      fieldConditions,
      recommendations
    });
    setLoading(false);
  }, [nasaData, selectedPeriod]);

  const getStatusColor = (status: 'good' | 'caution' | 'alert') => {
    switch (status) {
      case 'good': return 'text-green-600';
      case 'caution': return 'text-yellow-600';
      case 'alert': return 'text-red-600';
    }
  };

  const getStatusIcon = (status: 'good' | 'caution' | 'alert') => {
    switch (status) {
      case 'good': return <CheckCircle className="h-4 w-4" />;
      case 'caution': return <AlertTriangle className="h-4 w-4" />;
      case 'alert': return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
    }
  };

  if (loading || !analyticsData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold">Field Analytics</h2>
          <p className="text-muted-foreground">Comprehensive analysis of your agricultural data</p>
        </div>
        <div className="flex gap-2">
          {(['7d', '30d', '90d', '1y'] as const).map((period) => (
            <Button
              key={period}
              variant={selectedPeriod === period ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedPeriod(period)}
            >
              {period}
            </Button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Soil Moisture</CardTitle>
            <Droplets className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{nasaData?.soilMoisture}%</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1" />
              +2.1% from last week
            </div>
            <Progress value={nasaData?.soilMoisture} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Temperature</CardTitle>
            <Thermometer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{nasaData?.temperature}°C</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingDown className="h-3 w-3 mr-1" />
              -1.2°C from yesterday
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Precipitation</CardTitle>
            <CloudRain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{nasaData?.precipitation}mm</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1" />
              +5.3mm this week
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Crop Health</CardTitle>
            <Sun className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87%</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1" />
              +3.2% from last month
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Analysis */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="soil">Soil Analysis</TabsTrigger>
          <TabsTrigger value="weather">Weather Trends</TabsTrigger>
          <TabsTrigger value="crops">Crop Health</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Soil Moisture Trend</CardTitle>
                <CardDescription>Daily soil moisture levels over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={analyticsData.soilMoistureHistory}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="moisture" stroke="#10b981" strokeWidth={2} />
                      <Line type="monotone" dataKey="optimal" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Temperature Range</CardTitle>
                <CardDescription>Daily temperature variations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={analyticsData.temperatureHistory}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="max" stackId="1" stroke="#ef4444" fill="#fecaca" />
                      <Area type="monotone" dataKey="min" stackId="1" stroke="#3b82f6" fill="#dbeafe" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="soil" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Soil Conditions</CardTitle>
                <CardDescription>Current field conditions and status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {analyticsData.fieldConditions.map((condition, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(condition.status)}
                      <span className="font-medium">{condition.condition}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`font-bold ${getStatusColor(condition.status)}`}>
                        {condition.value}{condition.condition === 'Soil Moisture' ? '%' : condition.condition === 'Temperature' ? '°C' : 'mm'}
                      </span>
                      <Badge variant={condition.status === 'good' ? 'default' : condition.status === 'caution' ? 'secondary' : 'destructive'}>
                        {condition.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Precipitation History</CardTitle>
                <CardDescription>Daily precipitation over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analyticsData.precipitationHistory}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="precipitation" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="weather" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Weather Trends</CardTitle>
              <CardDescription>Temperature and precipitation patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analyticsData.temperatureHistory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Line yAxisId="left" type="monotone" dataKey="temperature" stroke="#ef4444" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="crops" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Crop Health Distribution</CardTitle>
                <CardDescription>Health status of different crops</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analyticsData.cropHealth}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ crop, health }) => `${crop}: ${health}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="health"
                      >
                        {analyticsData.cropHealth.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Crop Yield Comparison</CardTitle>
                <CardDescription>Expected yield by crop type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analyticsData.cropHealth}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="crop" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="yield" fill="#10b981" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Recommendations</CardTitle>
              <CardDescription>Personalized recommendations based on your field data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {analyticsData.recommendations.map((rec, index) => (
                <div key={index} className="flex items-start space-x-3 p-4 border rounded-lg">
                  <div className="flex-shrink-0">
                    <Info className="h-5 w-5 text-blue-500" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{rec.type}</span>
                      <Badge className={getPriorityColor(rec.priority)}>
                        {rec.priority} priority
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{rec.message}</p>
                    <p className="text-sm font-medium text-blue-600">{rec.action}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsDashboard;
