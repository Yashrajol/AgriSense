import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Home, BarChart3, Calendar, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import AuthModal from '@/components/auth/AuthModal';

const LandingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useTranslation();
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const handleSignIn = () => {
    setAuthModalOpen(true);
  };

  const features = [
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: 'Analytics Dashboard',
      description: 'Track your farm performance with detailed analytics'
    },
    {
      icon: <Calendar className="h-6 w-6" />,
      title: 'Plant Scheduler',
      description: 'Plan your crops with AI-powered scheduling'
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: 'Community',
      description: 'Connect with fellow farmers and share experiences'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Welcome Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="bg-green-100 p-4 rounded-full">
              <Home className="h-16 w-16 text-green-600" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Welcome to AgriSense! 🌱
          </h1>
          
          <p className="text-xl text-gray-600 mb-2">
            Your Smart Farming Companion
          </p>
          
          <p className="text-lg text-gray-500 mb-8">
            Sign in to access NASA-powered farming insights, crop predictions, and community features.
          </p>
        </div>

        {/* Features Preview */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {features.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="text-green-600 mb-4 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="text-center space-y-4">
          <Button 
            onClick={handleSignIn}
            size="lg"
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg"
          >
            <Home className="mr-2 h-5 w-5" />
            Sign In to Dashboard
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          
          <div className="text-sm text-gray-500">
            Access your personalized farming dashboard
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-2xl font-bold text-green-600">1000+</div>
            <div className="text-sm text-gray-600">Active Farmers</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-2xl font-bold text-blue-600">50+</div>
            <div className="text-sm text-gray-600">Crop Varieties</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-2xl font-bold text-purple-600">24/7</div>
            <div className="text-sm text-gray-600">Support</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-2xl font-bold text-orange-600">95%</div>
            <div className="text-sm text-gray-600">Success Rate</div>
          </div>
        </div>
      </div>

      <AuthModal 
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </div>
  );
};

export default LandingPage;
